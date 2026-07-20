import * as crypto from "crypto";
import Webhook from "../src/common/Webhook";

const SECRET = "test_secret";
const body = { type: "inbound", message_id: "39052", sender: "2347069549231", message: "Great" };

const sign = (payload: string) => crypto.createHmac("sha512", SECRET).update(payload).digest("hex");

const req = (headers: any, rawBody?: string) => ({ headers, body, rawBody });
const res = () => ({ sendStatus: (_: number) => undefined });

describe("Webhook", () => {
  it("fires on a valid lowercase-header signature", () => {
    const wh = new Webhook(SECRET);
    const seen: any[] = [];
    wh.on("inbound", (e: any) => seen.push(e));

    wh.middleware(req({ "x-termii-signature": sign(JSON.stringify(body)) }), res());

    expect(seen).toHaveLength(1);
    expect(seen[0].message).toBe("Great");
    expect(seen[0].type).toBeUndefined();
  });

  it("uses rawBody when key order differs from the parsed body", () => {
    const wh = new Webhook(SECRET);
    const seen: any[] = [];
    wh.on("inbound", (e: any) => seen.push(e));

    // raw bytes with different key order than JSON.stringify(body) would produce
    const raw = '{"message":"Great","type":"inbound","message_id":"39052","sender":"2347069549231"}';
    wh.middleware(req({ "x-termii-signature": sign(raw) }, raw), res());

    expect(seen).toHaveLength(1);
  });

  it("ignores a forged signature", () => {
    const wh = new Webhook(SECRET);
    const seen: any[] = [];
    wh.on("inbound", (e: any) => seen.push(e));

    wh.middleware(req({ "x-termii-signature": "a".repeat(128) }), res());
    expect(seen).toHaveLength(0);
  });

  it("ignores a missing signature header", () => {
    const wh = new Webhook(SECRET);
    const seen: any[] = [];
    wh.on("inbound", (e: any) => seen.push(e));

    wh.middleware(req({}), res());
    expect(seen).toHaveLength(0);
  });
});
