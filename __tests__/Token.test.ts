/**
 *   Project: termii-js
 *   File: Token.test
 *   Created by pennycodes on 26/04/2023.
 *   Copyright termii-js
 */
import Token from "../src/apps/Token";
import HttpClient from "../src/service/client";
import {
  MessageType,
  MessagingChannels,
  SendInAppTokenPayload,
  SendTokenOptions,
  SendTokenPayload,
  SendVoiceCallOptions,
  SendVoiceCallPayload,
  SendVoiceTokenOptions,
  SendVoiceTokenPayload,
  TokenResponse,
  VoiceResponse,
  SendInAppTokenOptions,
  InAppResponse,
  EmailResponse,
  EmailTokenPayload,
  VerifyResponse,
  VerifyTokenPayload
} from "../src/interface/token";

// Mock the HttpClient module
jest.mock('../src/service/client');

describe('Token', () => {
  let client: jest.Mocked<HttpClient>;
  let token: Token;

  const options = {
    baseURL: "https://example.com",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  beforeEach(() => {
    client = new HttpClient(options) as jest.Mocked<HttpClient>;
    token = new Token(client, 'API_KEY', 'SENDER_ID');
  });

  describe('send_token', () => {
    it('should send a token message', async () => {
      const requestPayload: SendTokenPayload = {
        api_key: 'API_KEY',
        from: 'SENDER_ID',
        channel: MessagingChannels.GENERIC,
        message_type: MessageType.NUMERIC,
        pin_attempts: 1,
        pin_length: 4,
        pin_time_to_live: 3,
        pin_placeholder: '< 1234 >',
        message_text: 'Your verification code is < 1234 >',
        pin_type: MessageType.NUMERIC,
        to: "233445677791"
      };
      const response: TokenResponse = { pinId: "", to: "", smsStatus: "Message Sent" };
      client.post.mockResolvedValue(response);

      const options: SendTokenOptions = {
        to: "233445677791",
        pin_placeholder: '1234',
        message_type: MessageType.NUMERIC,
        message_text: 'Your verification code is'
      };
      const result = await token.send_token(options);

      expect(client.post).toHaveBeenCalledWith('sms/otp/send', requestPayload);
      expect(result).toEqual(response);
    });
  });

  describe('send_voice_token', () => {
    it('should send a voice token message', async () => {
      const requestPayload: SendVoiceTokenPayload = {
        phone_number: "233445677791",
        api_key: 'API_KEY',
        pin_attempts: 1,
        pin_length: 4,
        pin_time_to_live: 3
      };
      const response: VoiceResponse = { balance: "", code: "", message: "", message_id: "", pinId: "", user: "" };
      client.post.mockResolvedValue(response);

      const options: SendVoiceTokenOptions = {
        phone_number: "233445677791"
      };
      const result = await token.send_voice_token(options);

      expect(client.post).toHaveBeenCalledWith('sms/otp/send/voice', requestPayload);
      expect(result).toEqual(response);
    });
  });

  describe('make_voice_call', () => {
    it('should make a voice call', async () => {
      const requestPayload: SendVoiceCallPayload = {
        code: 0, phone_number: "233445677791",
        api_key: 'API_KEY'
      };
      const response: VoiceResponse = { balance: "", code: "", message: "", message_id: "", pinId: "", user: "" };
      client.post.mockResolvedValue(response);

      const options: SendVoiceCallOptions = { code: 0, phone_number: "233445677791" };
      const result = await token.make_voice_call(options);

      expect(client.post).toHaveBeenCalledWith('sms/otp/call', requestPayload);
      expect(result).toEqual(response);
    });
  });

    describe('send_in_app_token', () => {
      it('should send an in-app token and return a response', async () => {
        // Arrange
        const requestPayload: SendInAppTokenPayload = {
          phone_number: "123456789",
          pin_attempts: 1,
          pin_length: 4,
          pin_time_to_live: 3,
          pin_type: MessageType.NUMERIC,
          api_key: 'API_KEY'
        };

        const response: InAppResponse = {
          data: { otp: "", phone_number: "", phone_number_other: "", pin_id: "" },
          status: ""
        };
        client.post.mockResolvedValue(response);

        // Act
        const options: SendInAppTokenOptions = { phone_number: "123456789" };

        const result = await token.send_in_app_token(options);

        // Assert
        expect(client.post).toHaveBeenCalledWith('sms/otp/generate', requestPayload);
        expect(result).toEqual(response);

      });
    });

  describe('verify_token', () => {
    it('should call the client with the correct parameters', async () => {

      const requestPayload: VerifyTokenPayload = {
        pin_id: "23344-5677-791",
        pin: "123456",
        api_key: 'API_KEY'
      };
      const response: VerifyResponse = {
        pinId: "23344-5677-791",
        verified: "True",
        msisdn: "12345678"
      };

      client.post.mockResolvedValue(response);

      const result = await token.verify_token(requestPayload);

      expect(client.post).toHaveBeenCalledWith("sms/otp/verify", requestPayload);
      expect(result).toEqual(response);
    });
  });

    describe('email_token', () => {
      it('should call the correct API endpoint with the correct payload and return a response', async () => {
        // Arrange
        const requestPayload: EmailTokenPayload = {
          api_key: 'API_KEY',
          code: "1234",
          email_address:"test@termii.com",
          email_configuration_id: "email_configuration_id"
        };

        const response: EmailResponse = {
          balance: 0, code: "", message: "", message_id: "", user: ""
        };

        client.post.mockResolvedValue(response);

        // Act
        const result = await token.email_token(requestPayload);

        // Assert
        expect(client.post).toHaveBeenCalledWith("email/otp/send", requestPayload);
        expect(result).toEqual(response);
      });

    });

});
