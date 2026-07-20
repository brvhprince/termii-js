/**
 *   Project: termii-js
 *   File: Termii
 *   Created by pennycodes on 25/04/2023.
 *   Copyright termii-js
 */

import Insights from "../apps/Insights";
import Messaging from "../apps/Messaging";
import Token from "../apps/Token";
import HttpClient from "../service/client";

class Termii extends HttpClient {
  readonly api_key: string;
  sender_id: string;

  public readonly messaging: Messaging;
  public readonly token: Token;
  public readonly insights: Insights;
  constructor(api_key: string, sender_id: string, base_url?: string) {
    super({
      baseURL: base_url ?? "https://v3.api.termii.com/api/",
      headers: {
        // Content-Type is deliberately not set here. The v3 API returns 200 with
        // an empty body when a GET carries Content-Type: application/json, which
        // silently breaks every read endpoint. Axios sets it per-request when
        // there is a body to send.
        Accept: "application/json",
      },
    });

    this.api_key = api_key;
    this.sender_id = sender_id.trim();
    this.messaging = new Messaging(this, this.api_key, this.sender_id);
    this.token = new Token(this, this.api_key, this.sender_id);
    this.insights = new Insights(this, this.api_key, this.sender_id);
  }

  public set_sender_id(sender_id: string): void {
    const trimmed = sender_id.trim();

    this.sender_id = trimmed;
    // the apps hold their own copy, so the new value has to be pushed down or
    // subsequent sends keep using the ID captured at construction
    this.messaging.set_sender_id(trimmed);
    this.token.set_sender_id(trimmed);
  }

  public set_base_url(base_url: string): void {
    this.client.defaults.baseURL = base_url;
  }
}

export default Termii;
