/**
 *   Project: termii-js
 *   File: Termii
 *   Created by pennycodes on 25/04/2023.
 *   Copyright termii-js
 */
import HttpClient from "../service/client";
import Messaging from "../apps/Messaging";
import Token from "../apps/Token";



class Termii extends HttpClient {
  private static readonly base_url = "https://api.ng.termii.com/api/"

  protected readonly api_key: string
  protected sender_id: string

  public readonly messaging: Messaging;
  public readonly token: Token;
  constructor(api_key: string, sender_id: string) {

    super({
      baseURL: Termii.base_url,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })


    this.api_key = api_key;
    this.sender_id = sender_id.trim();
    this.messaging = new Messaging(this, this.api_key, this.sender_id);
    this.token = new Token(this, this.api_key, this.sender_id);
  }

  public set_sender_id(sender_id: string): void
  {
    this.sender_id = sender_id.trim()
  }

}


export default Termii
