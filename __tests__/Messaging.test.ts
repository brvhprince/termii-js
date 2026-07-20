/**
 *   Project: termii-js
 *   File: Messaging.test
 *   Created by pennycodes on 26/04/2023.
 *   Copyright termii-js
 */

import Messaging from "../src/apps/Messaging";
import type { Page, PayloadResponse } from "../src/interface/global";
import {
  type CreatePhonebook,
  MessagingChannels,
  type Phonebooks,
  type RequestSenderIdOptions,
  type SendBulkMessageOptions,
  type SendEmailOptions,
  type SenderIDs,
  type SendMessageOptions,
  SendMessagePayload,
  type SendMessageResponse,
  type SendTemplateMediaOptions,
  type SendTemplateOptions,
  type SendWithoutSenderId,
} from "../src/interface/messaging";
import HttpClient from "../src/service/client";

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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const sort = { empty: true, sorted: false, unsorted: true };
  const emptyPage = <T>(content: T[] = []): Page<T> => ({
    content,
    pageable: { sort, offset: 0, pageNumber: 0, pageSize: 0, paged: true, unpaged: false },
    totalPages: 0,
    totalElements: 0,
    sort,
    size: 0,
    number: 0,
    first: true,
    last: true,
    numberOfElements: content.length,
    empty: content.length === 0,
  });

  describe("list_sender_ids", () => {
    it("should return SenderIDs", async () => {
      const expected: SenderIDs = emptyPage();
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
      const expected: SenderIDs = emptyPage();
      const getSpy = jest.spyOn(client, "get").mockImplementationOnce(() => Promise.resolve(expected));

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
      const payload: RequestSenderIdOptions = {
        sender_id: "test-sender-id",
        company: "Test Company",
        usecase: "For sending Promotional Messages",
      };

      const expected: PayloadResponse = {
        code: "ok",
        message: "Sender ID request sent successfully.",
      };

      const postSpy = jest.spyOn(client, "post").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.request_sender_id(payload);

      expect(result).toEqual(expected);
      // the API accepts the use case as use_case and reports it missing otherwise,
      // despite naming the field useCase in its own error message
      expect(client.post).toHaveBeenCalledWith("sender-id/request", {
        api_key: apiKey,
        sender_id: payload.sender_id,
        company: payload.company,
        use_case: payload.usecase,
      });
      expect(client.post).not.toHaveBeenCalledWith(
        "sender-id/request",
        expect.objectContaining({ usecase: expect.anything() }),
      );

      postSpy.mockRestore();
    });
  });

  describe("send", () => {
    it("should return SendMessageResponse", async () => {
      const payload: SendMessageOptions = {
        to: "1234567890",
        sms: "Hello Welcome to Termii",
      };
      const expected: SendMessageResponse = {
        balance: 0,
        code: "",
        message: "",
        message_id: "",
        message_id_str: "",
        user: "",
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

      postSpy.mockRestore();
    });
  });

  describe("send_bulk", () => {
    it("should return SendMessageResponse", async () => {
      const payload: SendBulkMessageOptions = {
        to: ["1234567890", "0987654321"],
        sms: "Test message",
      };
      const expected: SendMessageResponse = {
        balance: 0,
        code: "",
        message: "",
        message_id: "",
        message_id_str: "",
        user: "",
      };

      const postSpy = jest.spyOn(client, "post").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.send_bulk(payload);

      expect(result).toEqual(expected);
      expect(client.post).toHaveBeenCalledWith("sms/send/bulk", {
        api_key: apiKey,
        from: senderId,
        channel: "generic",
        type: "plain",
        ...payload,
      });

      postSpy.mockRestore();
    });
  });

  describe("send_without_sender_id", () => {
    it("should return SendMessageResponse", async () => {
      const payload: SendWithoutSenderId = {
        to: "233445567890",
        sms: "Test message",
      };
      const expected: SendMessageResponse = {
        balance: 0,
        code: "",
        message: "",
        message_id: "",
        message_id_str: "",
        user: "",
      };

      const postSpy = jest.spyOn(client, "post").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.send_without_sender_id(payload);

      expect(result).toEqual(expected);
      expect(client.post).toHaveBeenCalledWith("sms/number/send", {
        api_key: apiKey,
        ...payload,
      });

      postSpy.mockRestore();
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
        },
      };
      const expected: SendMessageResponse[] = [
        { balance: 0, code: "", message: "", message_id: "", message_id_str: "", user: "" },
      ];

      const postSpy = jest.spyOn(client, "post").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.send_with_template(payload);

      expect(result).toEqual(expected);
      expect(client.post).toHaveBeenCalledWith("send/template", {
        api_key: apiKey,
        ...payload,
      });

      postSpy.mockRestore();
    });
  });

  describe("list_phonebooks", () => {
    it("should return Phonebooks", async () => {
      const expected: Phonebooks = emptyPage();
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
      const expected: Phonebooks = emptyPage();

      const getSpy = jest.spyOn(client, "get").mockImplementationOnce(() => Promise.resolve(expected));

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
        phonebook_name: "Royals",
      };

      const expected: SendMessageResponse[] = [
        { balance: 0, code: "", message: "", message_id: "", message_id_str: "", user: "" },
      ];

      const postSpy = jest.spyOn(client, "post").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.create_phonebook(payload);

      expect(result).toEqual(expected);
      expect(client.post).toHaveBeenCalledWith("phonebooks", {
        api_key: apiKey,
        ...payload,
      });

      postSpy.mockRestore();
    });
  });
  describe("send_with_template_media", () => {
    it("should post to send/template/media with the media object", async () => {
      const payload: SendTemplateMediaOptions = {
        template_id: "template_id",
        phone_number: "1234567890",
        device_id: "device_id",
        data: { sms: "Test message" },
        media: { url: "https://example.com/image.png", caption: "a caption" },
      };
      const expected: SendMessageResponse[] = [
        { balance: 0, code: "", message: "", message_id: "", message_id_str: "", user: "" },
      ];
      const postSpy = jest.spyOn(client, "post").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.send_with_template_media(payload);

      expect(result).toEqual(expected);
      expect(client.post).toHaveBeenCalledWith("send/template/media", { api_key: apiKey, ...payload });

      postSpy.mockRestore();
    });
  });

  describe("send_email_notification", () => {
    it("should post to templates/send-email", async () => {
      const payload: SendEmailOptions = {
        email: "test@example.com",
        subject: "Your order shipped",
        email_configuration_id: "config_id",
        template_id: "template_id",
        variables: { order_id: "1234" },
      };
      const expected: SendMessageResponse = {
        balance: 0,
        code: "",
        message: "",
        message_id: "",
        message_id_str: "",
        user: "",
      };
      const postSpy = jest.spyOn(client, "post").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.send_email_notification(payload);

      expect(result).toEqual(expected);
      expect(client.post).toHaveBeenCalledWith("templates/send-email", { api_key: apiKey, ...payload });

      postSpy.mockRestore();
    });
  });

  describe("retry_campaign", () => {
    it("should patch the campaign by id", async () => {
      const expected: PayloadResponse = { code: "ok", message: "Campaign queued" };
      const patchSpy = jest.spyOn(client, "patch").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.retry_campaign("campaign_id");

      expect(result).toEqual(expected);
      expect(client.patch).toHaveBeenCalledWith("sms/campaigns/campaign_id", { api_key: apiKey });

      patchSpy.mockRestore();
    });
  });

  describe("upload_contacts", () => {
    it("should send multipart form data without the default json content type", async () => {
      const expected: PayloadResponse = { message: "Contacts uploaded" };
      const postSpy = jest.spyOn(client, "post").mockImplementationOnce(() => Promise.resolve(expected));

      const result = await messaging.upload_contacts({
        file: new Blob(["phone_number\n2348000000000"]),
        pid: "phonebook_id",
        country_code: "234",
      });

      expect(result).toEqual(expected);

      const [url, form, config] = postSpy.mock.calls[0];
      expect(url).toBe("phonebooks/contacts/upload");
      expect(config?.headers?.["Content-Type"]).toBeUndefined();
      expect(form).toBeInstanceOf(FormData);

      // the contact part is a typed blob, not a plain field: the API binds it by
      // content type and reports it missing when it arrives untyped
      const contact = (form as FormData).get("contact") as Blob;
      expect(contact).toBeInstanceOf(Blob);
      expect(contact.type).toBe("application/json");
      expect(JSON.parse(await contact.text())).toEqual({
        pid: "phonebook_id",
        country_code: "234",
        api_key: apiKey,
      });

      postSpy.mockRestore();
    });
  });

  describe("channel and type defaulting", () => {
    const sent = () => jest.spyOn(client, "post").mockImplementationOnce(() => Promise.resolve({} as never));

    it("defaults to the generic channel with a plain type", async () => {
      const spy = sent();
      await messaging.send({ to: "1", sms: "hi" });
      expect(spy.mock.calls[0][1]).toMatchObject({ channel: "generic", type: "plain" });
      spy.mockRestore();
    });

    it("honours an explicitly supplied channel", async () => {
      const spy = sent();
      await messaging.send({ to: "1", sms: "hi", channel: MessagingChannels.DND });
      expect(spy.mock.calls[0][1]).toMatchObject({ channel: "dnd" });
      spy.mockRestore();
    });

    it("falls back to defaults when channel and type are explicitly undefined", async () => {
      const spy = sent();
      await messaging.send({ to: "1", sms: "hi", channel: undefined, type: undefined });
      expect(spy.mock.calls[0][1]).toMatchObject({ channel: "generic", type: "plain" });
      spy.mockRestore();
    });

    it("pairs the voice channel with a voice type", async () => {
      const spy = sent();
      await messaging.send({ to: "1", sms: "hi", channel: MessagingChannels.VOICE });
      expect(spy.mock.calls[0][1]).toMatchObject({ channel: "voice", type: "voice" });
      spy.mockRestore();
    });

    it("still allows an explicit type to win over the voice default", async () => {
      const spy = sent();
      await messaging.send({ to: "1", sms: "hi", channel: MessagingChannels.VOICE, type: "plain" });
      expect(spy.mock.calls[0][1]).toMatchObject({ channel: "voice", type: "plain" });
      spy.mockRestore();
    });

    it("applies the same fallback to send_bulk", async () => {
      const spy = sent();
      await messaging.send_bulk({ to: ["1"], sms: "hi", channel: undefined });
      expect(spy.mock.calls[0][1]).toMatchObject({ channel: "generic", type: "plain" });
      spy.mockRestore();
    });
  });
});
