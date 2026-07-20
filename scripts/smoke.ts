/**
 * Smoke test against the live v3 API.
 *
 * Usage:
 *   1. Create .env.local (gitignored + npmignored):
 *        TERMII_API_KEY=xxxx
 *        TERMII_SENDER_ID=YourApprovedID   # tier 3 only
 *        TERMII_TEST_NUMBER=234xxxxxxxxxx  # tier 3 only
 *   2. npx ts-node scripts/smoke.ts [tier]
 *        tier 1 (default) - read-only GETs, no cost, no side effects
 *        tier 2           - adds throwaway phonebook writes, cleaned up after
 *        tier 3           - adds ONE real SMS. Costs credit. Delivers to a handset.
 *
 * The API key is redacted from all output.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import Termii from "../src/common/Termii";

const envPath = path.join(__dirname, "..", ".env.local");

if (!fs.existsSync(envPath)) {
  console.error("Missing .env.local — create it with: TERMII_API_KEY=your_key");
  process.exit(1);
}

const env = fs.readFileSync(envPath, "utf8");
const read = (key: string): string | undefined => env.match(new RegExp(`^${key}=(.+)$`, "m"))?.[1].trim();

const API_KEY = read("TERMII_API_KEY");
if (!API_KEY) {
  console.error("No TERMII_API_KEY= line found in .env.local");
  process.exit(1);
}

let SENDER_ID = read("TERMII_SENDER_ID") ?? "Termii";
const TEST_NUMBER = read("TEST_PHONE") ?? read("TERMII_TEST_NUMBER");
const BASE_URL = read("TERMII_BASE_URL") ?? "https://v3.api.termii.com/api/";
const TIER = Number(process.argv[2] ?? 1);

const redact = (value: unknown): string => JSON.stringify(value, null, 2).split(API_KEY).join("«REDACTED»");

const termii = new Termii(API_KEY, SENDER_ID, BASE_URL);

const shapeOf = (value: unknown): string => {
  if (Array.isArray(value)) return `array[${value.length}]`;
  if (value && typeof value === "object") return `{ ${Object.keys(value).join(", ")} }`;
  return typeof value;
};

async function probe<T>(label: string, fn: () => Promise<T>, lines = 12): Promise<T | undefined> {
  try {
    const result = await fn();
    console.log(`\n✓ ${label}`);
    console.log(`  shape: ${shapeOf(result)}`);
    console.log(
      redact(result)
        .split("\n")
        .slice(0, lines)
        .map((l) => `  ${l}`)
        .join("\n"),
    );
    return result;
  } catch (error: any) {
    console.log(`\n✕ ${label}`);
    console.log(`  status: ${error?.response?.status ?? "no response"}`);
    const body = error?.response?.data;
    console.log(body ? `  body: ${redact(body).split("\n").slice(0, 6).join("\n  ")}` : `  error: ${error?.message}`);
    return undefined;
  }
}

(async () => {
  console.log(`base URL: ${BASE_URL}`);
  console.log(`tier: ${TIER}`);

  // ---- Tier 1: read-only ----------------------------------------------------
  // The critical probe: is the v3 page shape content/pageable as the migration assumes?
  await probe("GET phonebooks", () => termii.messaging.list_phonebooks());
  const senders: any = await probe("GET sender-id", () => termii.messaging.list_sender_ids());

  // Use an ID this account has actually had approved, rather than guessing
  const approved = (senders?.content ?? senders?.data ?? []).find((s: any) => s.status === "active" || s.status === "unblock");
  if (approved && !read("TERMII_SENDER_ID")) {
    SENDER_ID = approved.sender_id;
    termii.set_sender_id(SENDER_ID);
    console.log(`  using approved sender id: ${SENDER_ID}`);
  }
  await probe("GET sms/campaigns", () => termii.messaging.list_campaigns());
  await probe("GET get-balance", () => termii.insights.balance());
  await probe("GET sms/inbox", () => termii.insights.history(), 8);

  if (TIER < 2) return;

  // ---- Tier 2: throwaway writes ---------------------------------------------
  const name = `smoke-test-${Date.now()}`;
  console.log(`\n--- tier 2: throwaway phonebook "${name}" ---`);

  await probe("POST phonebooks (create)", () => termii.messaging.create_phonebook({ phonebook_name: name }));

  const books: any = await probe("GET phonebooks (locate new)", () => termii.messaging.list_phonebooks(), 4);
  const created = (books?.content ?? books?.data ?? []).find((b: any) => b.name === name || b.phonebook_name === name);

  if (!created) {
    console.log("\n! could not locate the created phonebook — skipping remaining tier 2 probes");
    return;
  }

  const pid = String(created.id);
  console.log(`  phonebook id: ${pid}`);

  // Two contacts, so a delete can be measured as "one" vs "all"
  const csv = "phone_number,first_name\n2348000000001,SmokeOne\n2348000000002,SmokeTwo\n";
  await probe("POST phonebooks/contacts/upload (multipart)", () =>
    termii.messaging.upload_contacts({
      file: new Blob([csv]),
      filename: "smoke.csv",
      pid,
      country_code: "234",
    }),
  );

  const before: any = await probe("GET phonebooks/{id}/contacts", () => termii.messaging.list_contacts(pid), 16);
  const countOf = (r: any): number => r?.data?.content?.length ?? r?.data?.length ?? r?.content?.length ?? 0;
  console.log(`  contacts present: ${countOf(before)}`);

  // Does the documented path delete ONE contact or ALL of them?
  await probe("DELETE phonebooks/{id}/contacts (documented path)", () =>
    termii.delete(`phonebooks/${pid}/contacts`, { params: { api_key: API_KEY } }),
  );

  const after: any = await probe("GET phonebooks/{id}/contacts (recount)", () => termii.messaging.list_contacts(pid), 4);
  console.log(`  contacts remaining: ${countOf(after)} (was ${countOf(before)})`);

  await probe("DELETE phonebooks/{id} (cleanup)", () => termii.messaging.delete_phonebook(pid));

  if (TIER < 3) return;

  // ---- Tier 3: one real send ------------------------------------------------
  if (!TEST_NUMBER) {
    console.log("\n! TEST_PHONE not set in .env.local — skipping tier 3");
    return;
  }

  console.log(`\n--- tier 3: ONE real SMS to ${TEST_NUMBER} (costs credit) ---`);
  await probe("POST sms/send", () =>
    termii.messaging.send({ to: TEST_NUMBER, sms: `termii-js v3 smoke test ${new Date().toISOString()}` }),
  );
})();
