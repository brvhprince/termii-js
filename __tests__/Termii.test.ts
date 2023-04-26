/**
 *   Project: termii-js
 *   File: Termii.test
 *   Created by pennycodes on 26/04/2023.
 *   Copyright termii-js
 */

import Termii from "../src/common/Termii";
import HttpClient from "../src/service/client";
import Messaging from "../src/apps/Messaging";
import Token from "../src/apps/Token";
import Insights from "../src/apps/Insights";

jest.mock("../src/service/client");

describe("Termii class", () => {
  const api_key = "your_api_key";
  const sender_id = "your_sender_id";
  const options = {
    baseURL: Termii.base_url,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }

  let termii: Termii;
  let http: HttpClient;

  beforeEach(() => {
    http = new HttpClient(options);
    termii = new Termii(api_key, sender_id);
  });

  it("should set the api_key and sender_id properties correctly", () => {
    expect(termii.api_key).toBe(api_key);
    expect(termii.sender_id).toBe(sender_id);
  });

  it("should create Messaging, Token and Insights instances correctly", () => {
    expect(termii.messaging).toBeInstanceOf(Messaging);
    expect(termii.token).toBeInstanceOf(Token);
    expect(termii.insights).toBeInstanceOf(Insights);
  });

  describe("set_sender_id method", () => {
    it("should set the sender_id property correctly", () => {
      const new_sender_id = "new_sender_id";
      termii.set_sender_id(new_sender_id);
      expect(termii.sender_id).toBe(new_sender_id);
    });

    it("should trim the sender_id before setting it", () => {
      const new_sender_id = "   new_sender_id   ";
      termii.set_sender_id(new_sender_id);
      expect(termii.sender_id).toBe(new_sender_id.trim());
    });
  });
});
