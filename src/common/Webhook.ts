/**
 *   Project: termii-js
 *   File: Webhook
 *   Created by pennycodes on 25/04/2023.
 *   Copyright termii-js
 */

import * as crypto from "crypto";
import mitt, { Emitter } from "mitt";

class Webhook {
  private readonly secret_key: string;
  private emitter: Emitter<any> = mitt();

  constructor(secret_key: string) {
    this.secret_key = secret_key.trim();
  }

  public middleware(request: any, response: any) {
    response.sendStatus(200);

    const hash = crypto.createHmac("sha512", this.secret_key).update(JSON.stringify(request.body)).digest("hex");

    if (hash === request.headers["X-Termii-Signature"]) {
      // Retrieve the request's body
      const { type, ...rest } = request.body;
      this.emitter.emit(type, rest);
    }
  }

  public on = this.emitter.on;
  public off = this.emitter.off;
}
