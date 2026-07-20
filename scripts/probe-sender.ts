/**
 * Focused probes:
 *   1. Does a pending (unapproved) sender ID work for sending?
 *   2. Does a "+" prefixed destination number work?
 *
 * Each send costs one SMS unit. Run deliberately.
 *   npx ts-node scripts/probe-sender.ts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import Termii from "../src/common/Termii";

const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const read = (k: string): string | undefined => env.match(new RegExp(`^${k}=(.+)$`, "m"))?.[1].trim();

const API_KEY = read("TERMII_API_KEY");
if (!API_KEY) {
  console.error("No TERMII_API_KEY in .env.local");
  process.exit(1);
}

const RAW_PHONE = read("TEST_PHONE");
if (!RAW_PHONE) {
  console.error("No TEST_PHONE in .env.local");
  process.exit(1);
}

const STRIPPED = RAW_PHONE.replace(/^\+/, "");
const mask = (n: string) => `${n.slice(0, 4)}••••••${n.slice(-3)}`;

const termii = new Termii(API_KEY, "Termii");

const show = (label: string, err: any) => {
  const body = err?.response?.data;
  console.log(`  ${label}: status=${err?.response?.status ?? "?"} ${body ? JSON.stringify(body) : err?.message}`);
};

(async () => {
  // ---- 1. request a fresh sender ID, then immediately try to send with it ----
  const pending = `Smoke${Date.now().toString().slice(-5)}`;
  console.log(`\n[1] requesting new sender id "${pending}"`);

  try {
    const res = await termii.messaging.request_sender_id({
      sender_id: pending,
      usecase: "Transactional notifications for order updates and delivery confirmations.",
      company: "Wan Peninsula",
    });
    console.log(`  requested: ${JSON.stringify(res)}`);
  } catch (e) {
    show("request failed", e);
  }

  console.log(`\n[2] sending with the pending sender id "${pending}" (costs 1 unit)`);
  termii.set_sender_id(pending);
  try {
    const res = await termii.messaging.send({ to: STRIPPED, sms: `pending sender id probe ${Date.now()}` });
    console.log(`  ACCEPTED: ${JSON.stringify(res)}`);
  } catch (e) {
    show("rejected", e);
  }

  // ---- 3. does a leading + break the destination number? ---------------------
  console.log(`\n[3] sending to "${mask(RAW_PHONE)}" with a + prefix (costs 1 unit)`);
  const senders: any = await termii.messaging.list_sender_ids();
  const approved = (senders?.content ?? []).find((s: any) => s.status === "active");
  if (!approved) {
    console.log("  no active sender id on the account — skipping");
    return;
  }

  termii.set_sender_id(approved.sender_id);
  console.log(`  using approved sender id: ${approved.sender_id}`);

  try {
    const res = await termii.messaging.send({ to: RAW_PHONE, sms: `plus prefix probe ${Date.now()}` });
    console.log(`  ACCEPTED: ${JSON.stringify(res)}`);
  } catch (e) {
    show("rejected", e);
  }
})();
