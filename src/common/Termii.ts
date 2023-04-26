/**
 *   Project: termii-js
 *   File: Termii
 *   Created by pennycodes on 25/04/2023.
 *   Copyright termii-js
 */
import HttpClient from "../service/client";
import Messaging from "../apps/Messaging";
import Token from "../apps/Token";
import Insights from "../apps/Insights";

class Termii extends HttpClient {
  static readonly base_url = "https://api.ng.termii.com/api/";

  readonly api_key: string;
  sender_id: string;

  public readonly messaging: Messaging;
  public readonly token: Token;
  public readonly insights: Insights;
  constructor(api_key: string, sender_id: string) {
    super({
      baseURL: Termii.base_url,
      headers: {
        "Content-Type": "application/json",
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
    this.sender_id = sender_id.trim();
  }
}

export default Termii;
