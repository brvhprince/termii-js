/**
 *   Project: termii-js
 *   File: Webhook
 *   Created by pennycodes on 25/04/2023.
 *   Copyright termii-js
 */

import * as crypto from "crypto";
import mitt, { type Emitter } from "mitt";

class Webhook {
  private readonly secret_key: string;
  private emitter: Emitter<any> = mitt();

  constructor(secret_key: string) {
    this.secret_key = secret_key.trim();
  }

  public middleware(request: any, response: any) {
    response.sendStatus(200);

    // Node lowercases incoming header names
    const signature = request.headers["x-termii-signature"];

    // Prefer the raw payload: re-serialising a parsed body can reorder keys and
    // change whitespace, producing a hash that never matches the signed bytes
    const payload = request.rawBody ?? JSON.stringify(request.body);

    const hash = crypto.createHmac("sha512", this.secret_key).update(payload).digest("hex");

    if (Webhook.matches(hash, signature)) {
      // Retrieve the request's body
      const { type, ...rest } = request.body;
      this.emitter.emit(type, rest);
    }
  }

  private static matches(hash: string, signature: unknown): boolean {
    if (typeof signature !== "string" || signature.length !== hash.length) {
      return false;
    }

    return crypto.timingSafeEqual(Uint8Array.from(Buffer.from(hash)), Uint8Array.from(Buffer.from(signature)));
  }

  public on = this.emitter.on;
  public off = this.emitter.off;
}

export default Webhook;
