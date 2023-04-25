/**
 *   Project: termii-js
 *   File: insights
 *   Created by pennycodes on 25/04/2023.
 *   Copyright termii-js
 */

export interface Balance {
  user: string
  balance: number
  currency: string
}

export interface SearchQueryParams {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string
  /**
   * <p> Represents the phone number to be verified. Phone number must be in the international format </p>
   * <b> (Example: 23490126727) </b>
   */
  phone_number: string
}

export interface SearchResponse {
  number: string
  status: string
  network: string
  network_code:string
}

export interface StatusQueryParams {
  /**
   * <p> Represents the phone number to be verified. Phone number must be in the international format </p>
   * <b> (Example: 2348753243651) </b>
   */
  phone_number: string
  /**
   * Represents short alphabetic codes developed to represent countries
   * <h3> Default <b>GH</b> </h3>
   */
  country_code?: string
}

export interface StatusQueryPayload extends StatusQueryParams {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string
  country_code: string
}

interface Result {
  status: number
  routeDetail: {
    number: string
    ported: number
  }
  countryDetail: {
    countryCode: string
    mobileCountryCode: string
    iso: string
  }
  operatorDetail: {
    operatorCode: string
    operatorName: string
    mobileNumberCode: string
    mobileRoutingCode: string
    carrierIdentificationCode: string
    lineType: string
  }
}
export interface StatusResponse {
  result: Result[]
}


export interface InboxHistory {
  sender: string
  receiver: string
  message: string
  amount: number
  reroute: number
  status: string
  sms_type: string
  send_by: string
  media_url: string | null
  message_id: string
  notify_url: string | null
  notify_id: string | null
  created_at: string
}
