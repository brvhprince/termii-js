/**
 *   Project: termii-js
 *   File: Messaging.test
 *   Created by pennycodes on 26/04/2023.
 *   Copyright termii-js
 */

import Messaging from "../src/apps/Messaging";
import HttpClient from "../src/service/client";
import {
  MessagingChannels,
  RequestSenderIdPayload,
  SenderIDs,
  SendMessageOptions,
  SendMessagePayload,
  SendMessageResponse,
  SendBulkMessageOptions, SendTemplateOptions
} from "../src/interface/messaging";
import { PayloadResponse } from "../src/interface/global";
import { CreatePhonebook, Phonebooks, SendWithoutSenderId } from "../lib/interface/messaging";

describe("Messaging", () => {

  const options = {
    baseURL: "https://example.com",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };


  const client = new HttpClient(options);
  const apiKey = "test-api-key";
  const senderId = "test-sender-id";
  const messaging = new Messaging(client, apiKey, senderId);

  describe("list_sender_ids", () => {
    it("should return SenderIDs", async () => {
      const expected: SenderIDs = {
        current_page: 0,
        first_page_url: "",
        from: 0,
        last_page: 0,
        last_page_url: "",
        next_page_url: "",
        path: "",
        per_page: 0,
        prev_page_url: "",
        to: 0,
        total: 0,
        data: []
      };
      const getSpy = jest.spyOn(client, "get").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.list_sender_ids();

      expect(result).toEqual(expected);
      expect(client.get).toHaveBeenCalledWith("sender-id", {
        params: {
          api_key: apiKey,
        },
      });

      // Restore the original implementation of the post method
      getSpy.mockRestore();
    });

    it("should include page in request if provided", async () => {
      const expected: SenderIDs = {
        current_page: 0,
        first_page_url: "",
        from: 0,
        last_page: 0,
        last_page_url: "",
        next_page_url: "",
        path: "",
        per_page: 0,
        prev_page_url: "",
        to: 0,
        total: 0,
        data: []
      };
      const getSpy =  jest.spyOn(client, "get").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.list_sender_ids(2);

      expect(result).toEqual(expected);
      expect(client.get).toHaveBeenCalledWith("sender-id", {
        params: {
          api_key: apiKey,
          page: 2,
        },
      });

      getSpy.mockRestore();
    });
  });

  describe("request_sender_id", () => {
    it("should return PayloadResponse", async () => {
      const payload: RequestSenderIdPayload = {
        sender_id: "test-sender-id",
        company: "Test Company",
        usecase: "For sending Promotional Messages",
        api_key: apiKey
      };

      const expected: PayloadResponse = {
        code: "ok",
        message: "Sender ID request sent successfully.",
      };

      const postSpy = jest.spyOn(client, "post").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.request_sender_id(payload);

      expect(result).toEqual(expected);
      expect(client.post).toHaveBeenCalledWith("sender-id/request", payload);

      postSpy.mockRestore()
    });
  });

  describe("send", () => {
    it("should return SendMessageResponse", async () => {
      const payload: SendMessageOptions = {
        to: "1234567890",
        sms: "Hello Welcome to Termii"
      };
      const expected:SendMessageResponse = {
        balance: 0, code: "", message: "", message_id: "", user: ""
      };
      const postSpy = jest.spyOn(client, "post").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.send(payload);

      expect(result).toEqual(expected);
      expect(client.post).toHaveBeenCalledWith("sms/send", {
        api_key: apiKey,
        from: senderId,
        channel: "generic",
        type: "plain",
        ...payload,
      });

      postSpy.mockRestore()
    });
  });

  describe("send_bulk", () => {
    it("should return SendMessageResponse", async () => {
      const payload: SendBulkMessageOptions = {
        to: ["1234567890", "0987654321"],
        sms: "Test message",
      };
      const expected: SendMessageResponse = { balance: 0, code: "", message: "", message_id: "", user: "" };

      const postSpy =  jest.spyOn(client, "post").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.send_bulk(payload);

      expect(result).toEqual(expected);
      expect(client.post).toHaveBeenCalledWith("sms/send/bulk", {
        api_key: apiKey,
        from: senderId,
        channel: "generic",
        type: "plain",
        ...payload,
      });

      postSpy.mockRestore()

    });
  });

  describe("send_without_sender_id", () => {
    it("should return SendMessageResponse", async () => {
      const payload: SendWithoutSenderId = {
        to: "233445567890",
        sms: "Test message",
      };
      const expected: SendMessageResponse = { balance: 0, code: "", message: "", message_id: "", user: "" };

      const postSpy =  jest.spyOn(client, "post").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.send_without_sender_id(payload);

      expect(result).toEqual(expected);
      expect(client.post).toHaveBeenCalledWith("sms/number/send", {
        api_key: apiKey,
        ...payload,
      });

      postSpy.mockRestore()

    });
  });

  describe("send_with_template", () => {
    it("should return an array of SendMessageResponse", async () => {
      const payload: SendTemplateOptions = {
       template_id: "template_id",
        phone_number: "1234567890",
        device_id: "device_id",
        data: {
          sms: "Test message",
        }

      };
      const expected: SendMessageResponse[] = [{ balance: 0, code: "", message: "", message_id: "", user: "" }];

      const postSpy =  jest.spyOn(client, "post").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.send_with_template(payload);

      expect(result).toEqual(expected);
      expect(client.post).toHaveBeenCalledWith("send/template", {
        api_key: apiKey,
        ...payload,
      });

      postSpy.mockRestore()

    });
  });

  describe("list_phonebooks", () => {
    it("should return Phonebooks", async () => {
      const expected: Phonebooks = {
        data: [],
        links: {
          last: "",
          next: "",
          prev: "",
          first: ""
        },
        meta: {
          to: 0,
          from: 0,
          last_page: 0,
          total: 0,
          current_page: 0,
          path: "",
          per_page: 15
        }

      };
      const getSpy = jest.spyOn(client, "get").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.list_phonebooks();

      expect(result).toEqual(expected);
      expect(client.get).toHaveBeenCalledWith("phonebooks", {
        params: {
          api_key: apiKey,
        },
      });

      // Restore the original implementation of the post method
      getSpy.mockRestore();
    });

    it("should include page in request if provided", async () => {
      const expected: Phonebooks = {
        data: [],
        links: {
          last: "",
          next: "",
          prev: "",
          first: ""
        },
        meta: {
          to: 0,
          from: 0,
          last_page: 0,
          total: 0,
          current_page: 0,
          path: "",
          per_page: 15
        }

      };

      const getSpy =  jest.spyOn(client, "get").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.list_phonebooks(2);

      expect(result).toEqual(expected);
      expect(client.get).toHaveBeenCalledWith("phonebooks", {
        params: {
          api_key: apiKey,
          page: 2,
        },
      });

      getSpy.mockRestore();
    });
  });

  describe("create_phonebook", () => {
    it("should return PayloadResponse", async () => {

      const payload: CreatePhonebook = {
        phonebook_name: "Royals"
      };

      const expected: SendMessageResponse[] = [{ balance: 0, code: "", message: "", message_id: "", user: "" }];

      const postSpy =  jest.spyOn(client, "post").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.create_phonebook(payload);

      expect(result).toEqual(expected);
      expect(client.post).toHaveBeenCalledWith("phonebooks", {
        api_key: apiKey,
        ...payload,
      });

      postSpy.mockRestore()

    });
  });
});
