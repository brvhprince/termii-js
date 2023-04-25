/**
 *   Project: termii-js
 *   File: token
 *   Created by pennycodes on 25/04/2023.
 *   Copyright termii-js
 */

export const enum MessageType {
  NUMERIC = "NUMERIC",
  ALPHANUMERIC = "ALPHANUMERIC"
}

export const enum MessagingChannels {
  /**
   * This channel is used to send promotional messages and messages to phone number not on dnd
   */
  GENERIC = "generic",
  /**
   * On this channel all your messages deliver whether there is [dnd restriction]{@link https://termii.medium.com/the-dnd-service-in-nigeria-everything-you-need-to-know-72b7247e3968} or not on the phone number
   */
  DND = "dnd",
  /**
   * This channel sends messages via Email
   */
  EMAIL = "email",
  /**
   * This channel sends messages via WhatsApp
   */
  WHATSAPP = "WhatsApp"
}

export interface SendTokenOptions {
  /**
   * Enum: <em>"NUMERIC"</em> <em>"ALPHANUMERIC"</em>
   * <p> Type of message that will be generated and sent as part of the OTP message </p>
   * <p> You can set message type to numeric or alphanumeric </p>
   * <h3> Default is <b>NUMERIC</b> </h3>
   */
  message_type?: MessageType
  /**
   * <p> Represents the email address if the channel is set to email</p>
   * <b> Example: testshola@termii.com) </b>
   * <p>  It represents the destination phone number if other channels are selected </p>
   * <p> Phone number must be in the international format </p>
   * <b> (Example: 23490126727) </b>
   */
  to: string
  /**
   * <p> Represents the configuration ID if the channel is set to email </p>
   * <b> (Example: 0a53c416-uocj-95af-ab3c306aellc). </b>
   * <p> It can be found on your [Termii dashboard]{@link https://accounts.termii.com/#/email-otp-config} </p>
   * <p> If other channels are selected, it represents a sender ID which can be alphanumeric or numeric. </p>
   * <p> Alphanumeric sender ID length should be between 3 and 11 characters </p>
   * <b> (Example:CompanyName) </b>
   * <h3> Default is <b>@sender_id</b> </h3>
   */
  from?: string
  /**
   * This is the route through which the message is sent. It is either <b>dnd</b>, <b>WhatsApp</b>, or <b>generic</b> or <b>email</b>
   *
   * <h3> Default is <b>generic</b> </h3>
   */
  channel?: MessagingChannels

  /**
   * <p> Represents the number of times the PIN can be attempted before expiration. It has a minimum of one attempt </p>
   * <h3> Default is <b>1</b> </h3>
   */
  pin_attempts?: number
  /**
   * <p> Represents how long the PIN is valid before expiration. The time is in minutes. </p>
   * <p> The minimum time value is 0 and the maximum time value is 60 </p>
   * <h3> Default is <b>3</b> </h3>
   */
  pin_time_to_live?: number
  /**
   * <p> The length of the PIN code.It has a minimum of 4 and maximum of 8. </p>
   * <h3> Default is <b>4</b> </h3>
   */
  pin_length?: number
  /**
   * <p> PIN placeholder. Right before sending the message, PIN code placeholder will be replaced with generate PIN code. </p>
   * <h3> Default is <b> 1234 </b> </h3>
   */
  pin_placeholder?: string
  /**
   * <p> Text of a message that would be sent to the destination phone number </p>
   */
  message_text: string
}

export interface SendTokenPayload extends SendTokenOptions {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string
  message_type: MessageType
  from: string
  channel: MessagingChannels
  pin_attempts: number
  pin_time_to_live: number
  pin_length: number
  pin_placeholder: string
  pin_type: MessageType
}

export interface TokenResponse {
  pinId: string
  to: string
  smsStatus: string
}

export interface SendVoiceTokenOptions {
  /**
   * <p> The destination phone number. Phone number must be in the international format </p>
   * <b> (Example: 23490126727) </b>
   */
  phone_number: string
  /**
   * <p> Represents the number of times the PIN can be attempted before expiration. It has a minimum of one attempt </p>
   * <h3> Default is <b>1</b> </h3>
   */
  pin_attempts?: number
  /**
   * <p> Represents how long the PIN is valid before expiration. The time is in minutes. </p>
   * <p> The minimum time value is 0 and the maximum time value is 60 </p>
   * <h3> Default is <b>3</b> </h3>
   */
  pin_time_to_live?: number
  /**
   * <p> The length of the PIN code.It has a minimum of 4 and maximum of 8. </p>
   * <h3> Default is <b>4</b> </h3>
   */
  pin_length?: number

}

export interface SendVoiceTokenPayload extends SendVoiceTokenOptions {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string
  pin_attempts: number
  pin_time_to_live: number
  pin_length: number
}

export interface VoiceResponse {
  code: string
  message_id: string
  pinId: string
  balance: string
  message: string
  user: string
}

export interface SendVoiceCallOptions {
  /**
   * <p> The destination phone number. Phone number must be in the international format </p>
   * <b> (Example: 23490126727) </b>
   */
  phone_number: string
  /**
   * <p> The code you want your users to receive. It has to be numeric and length must be between 4 and 8 digits. </p>
   */
  code: number

}

export interface SendVoiceCallPayload extends SendVoiceCallOptions {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string
}


export interface SendInAppTokenOptions {
  /**
   * Enum: <em>"NUMERIC"</em> <em>"ALPHANUMERIC"</em>
   * <p> Type of PIN code that will be generated and sent as part of the OTP message </p>
   * <p> You can set message type to numeric or alphanumeric </p>
   * <h3> Default is <b>NUMERIC</b> </h3>
   */
  pin_type?: MessageType
  /**
   * <p> Represents the destination phone number.Phone number must be in the international format</p>
   * <b> (Example: 23490126727) </b>
   */
  phone_number: string

  /**
   * <p> Represents the number of times the PIN can be attempted before expiration. It has a minimum of one attempt </p>
   * <h3> Default is <b>1</b> </h3>
   */
  pin_attempts?: number
  /**
   * <p> Represents how long the PIN is valid before expiration. The time is in minutes. </p>
   * <p> The minimum time value is 0 and the maximum time value is 60 </p>
   * <h3> Default is <b>3</b> </h3>
   */
  pin_time_to_live?: number
  /**
   * <p> The length of the PIN code.It has a minimum of 4 and maximum of 8. </p>
   * <h3> Default is <b>4</b> </h3>
   */
  pin_length?: number
}

export interface SendInAppTokenPayload extends SendInAppTokenOptions {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string
  pin_attempts: number
  pin_time_to_live: number
  pin_length: number
  pin_type: MessageType
}

export interface InAppResponse {
  status: string
  data: {
    pin_id: string
    otp: string
    phone_number: string
    phone_number_other: string
  }
}

export interface VerifyTokenOptions {
  /**
   * <p> ID of the PIN sent  </p>
   * <b>(Example: "c8dcd048-5e7f-4347-8c89-4470c3af0b")</b>
   */
  pin_id: string
  /**
   * <p> The PIN code</p>
   * <b> (Example: "195558") </b>
   */
  pin: string
}

export interface VerifyTokenPayload extends VerifyTokenOptions {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string
}

export interface VerifyResponse {
  pinId: string
  verified: string
  msisdn: string
}
export interface EmailTokenOptions {
  /**
   * <p> Represents the email address you are sending to </p>
   * <b>(Example: test@termii.com).</b>
   */
  email_address: string
  /**
   * <p> Represents the OTP sent to the email address</p>
   */
  code: string
  /**
   * <p> This represents the email configuration you have added on your [Termii Dashboard]{@link https://accounts.termii.com/#/email-otp-config}. </p>
   */
  email_configuration_id: string
}

export interface EmailTokenPayload extends EmailTokenOptions {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string
}

export interface EmailResponse {
  code: string
  message_id: string
  message: string
  balance: number
  user: string
}
