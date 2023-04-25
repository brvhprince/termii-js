/**
 *   Project: termii-js
 *   File: Token
 *   Created by pennycodes on 25/04/2023.
 *   Copyright termii-js
 */
import HttpClient from "../service/client";
import {
  EmailResponse,
  EmailTokenOptions, EmailTokenPayload,
  InAppResponse,
  MessageType,
  MessagingChannels,
  SendInAppTokenOptions,
  SendInAppTokenPayload,
  SendTokenOptions,
  SendTokenPayload,
  SendVoiceCallOptions,
  SendVoiceCallPayload,
  SendVoiceTokenOptions,
  SendVoiceTokenPayload,
  TokenResponse, VerifyResponse, VerifyTokenOptions, VerifyTokenPayload,
  VoiceResponse
} from "../interface/token";

class Token {

  constructor(
    private readonly client: HttpClient,
    private readonly api_key: string,
    private readonly sender_id: string
  ) {}


  public async send_token({  pin_placeholder, message_type, ...rest }: SendTokenOptions): Promise<TokenResponse>
  {
    const requestPayload: SendTokenPayload = {
      api_key: this.api_key,
      from: this.sender_id,
      channel: MessagingChannels.GENERIC,
      message_type: message_type ? message_type : MessageType.NUMERIC,
      pin_attempts: 1,
      pin_length: 4,
      pin_time_to_live: 3,
      pin_placeholder: pin_placeholder ? `< ${pin_placeholder} >` : "< 1234 >",
      pin_type: message_type ? message_type : MessageType.NUMERIC,
      ...rest
    }

    return await this.client.post<TokenResponse>("sms/otp/send", requestPayload)

  }
  public async send_voice_token(payload: SendVoiceTokenOptions): Promise<VoiceResponse>
  {
    const requestPayload: SendVoiceTokenPayload = {
      api_key: this.api_key,
      pin_attempts: 1,
      pin_length: 4,
      pin_time_to_live: 3,
      ...payload
    }

    return await this.client.post<VoiceResponse>("sms/otp/send/voice", requestPayload)

  }
  public async make_voice_call(payload: SendVoiceCallOptions): Promise<VoiceResponse>
  {
    const requestPayload: SendVoiceCallPayload = {
      api_key: this.api_key,
      ...payload
    }

    return await this.client.post<VoiceResponse>("sms/otp/call", requestPayload)

  }
  public async send_in_app_token(payload: SendInAppTokenOptions): Promise<InAppResponse>
  {
    const requestPayload: SendInAppTokenPayload = {
      api_key: this.api_key,
      pin_length: 4,
      pin_time_to_live: 3,
      pin_attempts: 1,
      pin_type: MessageType.NUMERIC,
      ...payload
    }

    return await this.client.post<InAppResponse>("sms/otp/generate", requestPayload)

  }
  public async verify_token(payload: VerifyTokenOptions): Promise<VerifyResponse>
  {
    const requestPayload: VerifyTokenPayload = {
      api_key: this.api_key,
      ...payload
    }

    return await this.client.post<VerifyResponse>("sms/otp/verify", requestPayload)

  }
  public async email_token(payload: EmailTokenOptions): Promise<EmailResponse>
  {
    const requestPayload: EmailTokenPayload = {
      api_key: this.api_key,
      ...payload
    }

    return await this.client.post<EmailResponse>("email/otp/send", requestPayload)

  }

}

export default Token
