/**
 *   Project: termii-js
 *   File: messaging
 *   Created by pennycodes on 25/04/2023.
 *   Copyright termii-js
 */
import { KeyValuePair, Paginator, Paginator2 } from "./global";

interface SenderID {
  sender_id: string;
  status: "block" | "unblock";
  company: string | null;
  usecase: string | null;
  country: string | null;
  created_at: string;
}

export interface SenderIDs extends Paginator<SenderID> {}

export interface RequestSenderIdOptions {
  /**
   * Represents the ID of the sender which can be alphanumeric or numeric. Alphanumeric sender ID length should be between 3 and 11 characters
   * <br/> Example: <b>CompanyName</b>
   */
  sender_id: string;
  /** A sample of the type of message sent */
  usecase: string;
  /** Represents the name of the company with the sender ID */
  company: string;
}

export interface RequestSenderIdPayload extends RequestSenderIdOptions {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string;
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
   * This channel sends messages via WhatsApp
   */
  WHATSAPP = "whatsapp",
}

interface MediaOptions {
  /**
   * <p> The url to the file resource </p>
   * <h3> Media Types </h3>
   *     <tr>
   *       <th> <b> File </b>
   *       </th>
   *       <th> <b> Supported Format </b>
   *       </th>
   *      </tr>
   *       <tr>
   *         <td>Image</td>
   *         <td> JPG, JPEG, PNG </td>
   *        </tr>
   *        <tr>
   *          <td> Audio </td>
   *          <td> MP3, OGG, AMR </td>
   *        </tr>
   *        <tr>
   *          <td> Documents </td>
   *          <td> PDF </td>
   *        </tr>
   *        <tr>
   *          <td> Video </td>
   *          <td> MP4 (<b>Note</b>: WhatsApp currently does not support MP4 files without an audio) </td>
   *        </tr>
   */
  url: string;
  /**
   * <p> The caption that should be added to the image. </p>
   */
  caption: string;
}
export interface SendMessageOptions {
  /**
   * <p>Represents the destination phone number. Phone number must be in the international format</p>
   * <b>(Example: 23490126727)</b>
   * <p> You can also send to multiple numbers. To do so put numbers in an array </p>
   * <b>(Example: ["23490555546", "23423490126999"])</b>
   * <p>Please note: the array takes only 100 phone numbers at a time</p>
   */
  to: string | string[];
  /**
   * <p>Text of a message that would be sent to the destination phone number</p>
   */
  sms: string;
  /**
   * <p>The kind of message that is sent, which is a <b>plain</b> message</p>
   * <h3> Default is <b> plain </b> </h3>
   */
  type?: string;
  /**
   * <p>This is the route through which the message is sent. It is either <b>dnd</b>, <b>whatsapp</b>, or <b>generic</b></p>
   * <h3> Default is <b> generic </b> </h3>
   */
  channel?: MessagingChannels;
  /**
   * <p>This is a media object, it is only available for the <b>High Volume WhatsApp</b> </p>
   */
  media?: MediaOptions;
}

export interface SendMessagePayload extends SendMessageOptions {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string;
  type: string;
  channel: MessagingChannels;
  /**
   * <p>Represents a sender ID for sms which can be Alphanumeric or Device name for Whatsapp</p>
   * <p>Alphanumeric sender ID length should be between 3 and 11 characters</p>
   * <b> (Example:CompanyName)</b>
   */
  from: string;
}

export interface SendBulkMessageOptions {
  /**
   * <p>Represents the array of phone numbers you are sending to</p>
   * <b>(Example: ["23490555546", "23423490126999","23490555546"]).</b>
   * <p> Phone numbers must be in international format <b> (Example: 23490126727) </b></p>
   * <p>lease note: the array can take up to 10,000 phone numbers</p>
   */
  to: string[];
  /**
   * <p>Text of a message that would be sent to the destination phone number</p>
   */
  sms: string;
  /**
   * <p>The kind of message that is sent, which is a <b>plain</b> message</p>
   * <h3> Default is <b> plain </b> </h3>
   */
  type?: string;
  /**
   * <p>This is the route through which the message is sent. It is either <b>dnd</b>, <b>whatsapp</b>, or <b>generic</b></p>
   * <h3> Default is <b> generic </b> </h3>
   */
  channel?: MessagingChannels;
}

export interface SendBulkMessagePayload extends SendBulkMessageOptions {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string;
  type: string;
  channel: MessagingChannels;
  /**
   * <p>Represents a sender ID for sms which can be Alphanumeric or Device name for Whatsapp</p>
   * <p>Alphanumeric sender ID length should be between 3 and 11 characters</p>
   * <b> (Example:CompanyName)</b>
   */
  from: string;
}

export interface SendWithoutSenderId {
  /**
   * <p>Represents the destination phone number. Phone number must be in the international format</p>
   * <b>(Example: 2349012672711)</b>
   */
  to: string;
  /**
   * <p>Text of a message that would be sent to the destination phone number</p>
   */
  sms: string;
}

export interface SendWithoutSenderIdPayload extends SendWithoutSenderId {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string;
}

export interface SendMessageResponse {
  code: string;
  message_id: string;
  message: string;
  balance: number | string;
  user: string;
}

export interface SendTemplateOptions {
  /**
   * <p> The destination phone number. Phone number must be in the international format</p>
   * <b> (Example: 23490126727) </b>
   */
  phone_number: string;

  /**
   * <p>Represents the Device ID for Whatsapp. It can be Alphanumeric </p>
   * <p>It should be passed when the message is sent via whatsapp (It can be found on the manage device page on your Termii dashboard) </p>
   */
  device_id: string;

  /**
   * <p> The ID of the template used </p>
   */
  template_id: string;
  /**
   * <p> Represents an object of <b>key: value</b> pair.</p>
   * <p> The keys for the data object can be found on the device subscription page on your dashboard </p>
   * <b> (Example: {"product_name": "Termii", "otp" : 120435, }) </b>
   */
  data: KeyValuePair;
}

export interface SendTemplatePayload extends SendTemplateOptions {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string;
}

interface Phonebook {
  id: string;
  name: string;
  total_number_of_contacts: string;
  date_created: string;
  last_updated: string;
}

export interface Phonebooks extends Paginator2<Phonebook> {}

export interface CreatePhonebook {
  /**
   * <p> The name of the phonebook </p>
   */
  phonebook_name: string;
  /**
   * <p> A description of the contacts stored in the phonebook </p>
   */
  description?: string;
}

export interface AddPhonebook extends CreatePhonebook {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string;
}

export interface UpdatePhonebook {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string;
  /**
   * <p> The name of the phonebook </p>
   */
  phonebook_name: string;
}

interface Contact {
  id: string | number;
  pid: string | number;
  phone_number: string;
  email_address: string | null;
  message: string | null;
  company: string | null;
  first_name: string | null;
  last_name: string | null;
  create_at: string | null;
  updated_at: string | null;
}

export interface Contacts extends Paginator2<Contact> {}

export interface CreateContact {
  /**
   * <p> Phone number of the contact </p>
   */
  phone_number: string;
  /**
   * <p> Represents short numeric geographical codes developed to represent countries </p>
   * <b> (Example: 234 )</b>
   */
  country_code?: string | number;
  /**
   * <p> email address of the contact </p>
   */
  email_address?: string;
  /**
   * <p> first name of the contact </p>
   */
  first_name?: string;
  /**
   * <p> last name of the contact </p>
   */
  last_name?: string;
  /**
   * <p> name of the company of the contact </p>
   */
  company?: string;
}

export interface AddContact extends CreateContact {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string;
}

export interface ContactResponse {
  data: {
    id: number;
    phone_number: string;
    email_address: string;
    message: string | null;
    company: string;
    first_name: string;
    last_name: string;
    create_at: string;
    updated_at: string;
  };
}

export interface SendCampaignOptions {
  /**
   * <p> Represents short numeric geographical codes developed to represent countries </p>
   * <b> (Example: 234 ) . </b>
   */
  country_code: string;
  /**
   * <p> Text of a message that would be sent to the destination phone number </p>
   */
  message: string;
  /**
   * <p> This is the route through which the message is sent. It is either <b>dnd</b>, <b>whatsapp</b>, or <b>generic</b> </p>
   * <h3> Default is <b> generic </b> </h3>
   */
  channel?: MessagingChannels;
  /**
   * <p> The type of message that is sent, which is a plain message. </p>
   * <h3> Default is <b> plain </b> </h3>
   */
  message_type?: string;
  /**
   * <p> ID of the phonebook selected </p>
   */
  phonebook_id: string;
  /**
   * <p> Represents type of campaign </p>
   */
  campaign_type: string;

  schedule_sms_status?: "scheduled";
  /**
   * <p>The time to send scheduled campaign.</p>
   * <p>This is required if <b>scheduled_sm_status</b> is <em>scheduled</em> </P>
   * <p> Example <b> 30-06-2021 6:00 </b> </p>
   */
  schedule_time?: string;
  /**
   * <p> Remove duplicates contact numbers </p>
   * <h3> Default is <b> yes </b> </h3>
   */
  remove_duplicate?: "yes" | "no";
}

export interface SendCampaignPayload extends SendCampaignOptions {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string;
  /**
   * Represents the ID of the sender which can be alphanumeric or numeric. Alphanumeric sender ID length should be between 3 and 11 characters
   * <br/> Example: <b>CompanyName</b>
   */
  sender_id: string;
  message_type: string;
  channel: MessagingChannels;
  remove_duplicate: "yes" | "no";
}

interface Campaign {
  campaign_id: string;
  phone_book: string;
  sender: string;
  camp_type: string;
  channel: string;
  total_recipients: number;
  run_at: string;
  status: string;
  created_at: string;
}

export interface Campaigns extends Paginator2<Campaign> {}

interface History {
  id: number;
  sender: string;
  receiver: string;
  message: string;
  message_abbreviation: string;
  amount: number;
  channel: string;
  sms_type: string;
  message_id: string;
  status: string;
  date_created: string;
  last_updated: string;
}

export interface CampaignHistory extends Paginator2<History> {}
