/**
 *   Project: termii-js
 *   File: Termii.test
 *   Created by pennycodes on 26/04/2023.
 *   Copyright termii-js
 */

import Insights from "../src/apps/Insights";
import Messaging from "../src/apps/Messaging";
import Token from "../src/apps/Token";
import Termii from "../src/common/Termii";

// jest.mock("../src/service/client", () => {
//   return jest.fn().mockImplementation(() => {
//     return {
//       client: {
//         defaults: {
//           baseURL: "https://api.ng.termii.com/api/"
//         }
//       }
//     };
//   });
// });

describe("Termii class", () => {
  const api_key = "your_api_key";
  const sender_id = "your_sender_id";
  let termii: Termii;

  beforeEach(() => {
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

  describe("set_base_url method", () => {
    it("should set the baseURL of the client correctly", () => {
      const new_base_url = "https://new.api.ng.termii.com/api/";
      termii.set_base_url(new_base_url);
      expect(termii.client.defaults.baseURL).toBe(new_base_url);
    });
  });

  describe("v3 regressions", () => {
    it("does not set a default Content-Type", () => {
      // the v3 API returns 200 with an empty body when a GET carries
      // Content-Type: application/json, which silently breaks every read
      const t = new Termii("key", "sender");
      expect(t.client.defaults.headers["Content-Type"]).toBeUndefined();
      expect(t.client.defaults.headers.Accept).toBe("application/json");
    });

    it("propagates set_sender_id down to the apps", async () => {
      const t = new Termii("key", "OldSender");
      t.set_sender_id("NewSender");

      const spy = jest.spyOn(t, "post").mockImplementationOnce(() => Promise.resolve({} as never));
      await t.messaging.send({ to: "1", sms: "x" });

      // the apps hold their own copy, so a stale value here means sends go out
      // under the sender ID captured at construction
      expect((spy.mock.calls[0][1] as { from: string }).from).toBe("NewSender");
      spy.mockRestore();
    });
  });
});
