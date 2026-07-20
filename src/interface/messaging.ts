/**
 *   Project: termii-js
 *   File: messaging
 *   Created by pennycodes on 25/04/2023.
 *   Copyright termii-js
 */
import type { KeyValuePair, Page } from "./global";

export type SenderIdStatus = "active" | "pending" | "blocked";

interface SenderID {
  sender_id: string;
  status: SenderIdStatus;
  company: string | null;
  usecase: string | null;
  country: string | null;
  createdAt: string;
}

export interface SenderIDs extends Page<SenderID> {}

export interface SenderIdFilters {
  /** Filter by sender ID name */
  name?: string;
  /** Filter by approval status */
  status?: SenderIdStatus;
}

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

/**
 * <p> The wire format for a sender ID request. </p>
 * <p> The API reads the use case from <b>use_case</b> on the way in, but returns
 * it as <b>usecase</b> on the way out, so the field is renamed here rather than
 * in the public options. </p>
 * <p> Note: a rejected request reports the field as <b>useCase</b> in its error
 * message, which is the server's internal name and not the accepted key. </p>
 */
export interface RequestSenderIdPayload extends Omit<RequestSenderIdOptions, "usecase"> {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string;
  use_case: string;
}

export enum MessagingChannels {
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
  /**
   * This channel sends messages as a voice call
   */
  VOICE = "voice",
}

/**
 * <p> Channels accepted by the bulk endpoint. </p>
 * <p> Bulk delivery does not support WhatsApp or voice. </p>
 */
export type BulkMessagingChannel = MessagingChannels.DND | MessagingChannels.GENERIC;

/**
 * <p> The format a message is delivered in. </p>
 */
export type MessageType = "plain" | "unicode" | "encrypted" | "voice";

/**
 * <p> Formats accepted by the bulk endpoint, which cannot deliver voice. </p>
 */
export type BulkMessageType = Exclude<MessageType, "voice">;

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
   * <h3> Default is <b> plain </b>, or <b> voice </b> on the voice channel </h3>
   */
  type?: MessageType;
  /**
   * <p>This is the route through which the message is sent. It is either <b>dnd</b>, <b>generic</b>, <b>whatsapp</b> or <b>voice</b></p>
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
  type: MessageType;
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
  type?: BulkMessageType;
  /**
   * <p>This is the route through which the message is sent. It is either <b>dnd</b> or <b>generic</b></p>
   * <p> Bulk delivery does not support WhatsApp or voice </p>
   * <h3> Default is <b> generic </b> </h3>
   */
  channel?: BulkMessagingChannel;
}

export interface SendBulkMessagePayload extends SendBulkMessageOptions {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string;
  type: BulkMessageType;
  channel: BulkMessagingChannel;
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
  /**
   * <p> String form of <b>message_id</b>. </p>
   * <p> Message IDs exceed <b>Number.MAX_SAFE_INTEGER</b>, so prefer this field
   * anywhere the value may be parsed as a number. </p>
   */
  message_id_str: string;
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

export interface SendTemplateMediaOptions extends SendTemplateOptions {
  /**
   * <p> The media object attached to the template. Required for this endpoint. </p>
   */
  media: MediaOptions;
}

export interface SendTemplateMediaPayload extends SendTemplateMediaOptions {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string;
}

export interface SendEmailOptions {
  /**
   * <p> The email address the notification is sent to </p>
   * <b> (Example: test@termii.com) </b>
   */
  email: string;
  /**
   * <p> The subject line of the email </p>
   */
  subject: string;
  /**
   * <p> The email configuration used to deliver the message. </p>
   * <p> It can be found on your [Termii dashboard]{@link https://accounts.termii.com/#/email-otp-config} </p>
   */
  email_configuration_id: string;
  /**
   * <p> The ID of the email template used </p>
   */
  template_id: string;
  /**
   * <p> Represents an object of <b>key: value</b> pairs substituted into the template </p>
   */
  variables: KeyValuePair;
}

export interface SendEmailPayload extends SendEmailOptions {
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}). */
  api_key: string;
}

export interface UploadContacts {
  /**
   * <p> The CSV file contents </p>
   * <b> (Example: new Blob([await fs.promises.readFile("contacts.csv")])) </b>
   */
  file: Blob;
  /**
   * <p> Name reported for the uploaded file. Defaults to <b>contacts.csv</b> </p>
   */
  filename?: string;
  /**
   * <p> ID of the phonebook the contacts are added to </p>
   */
  pid: string;
  /**
   * <p> Represents short numeric geographical codes developed to represent countries </p>
   * <b> (Example: 234 ) </b>
   */
  country_code: string;
}

interface Phonebook {
  id: string;
  name: string;
  total_number_of_contacts: string;
  date_created: string;
  last_updated: string;
}

export interface Phonebooks extends Page<Phonebook> {}

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
  /**
   * <p> A description of the contacts stored in the phonebook </p>
   */
  description?: string;
}

interface ContactKeyValue {
  key: string;
  value: string;
}

interface Contact {
  id: string | number;
  pid: string | number;
  phone_number: string;
  /**
   * <p> Contact attributes are returned as key/value pairs rather than fixed columns. </p>
   * <p> Fields such as <b>first_name</b> or <b>email_address</b> appear here when set. </p>
   */
  contact_list_key_value: ContactKeyValue[];
}

interface ContactPhonebook {
  id: string | number;
  applicationId: string | number;
  description: string | null;
  createdAt: string;
  phonebook_name: string;
  total_contact: number;
  total_campaign: number;
}

/**
 * <p> The contacts response nests its page under <b>data</b>, alongside the
 * owning phonebook and the column headers, rather than being a page itself. </p>
 */
export interface Contacts {
  headers: string[];
  phonebook: ContactPhonebook;
  data: Page<Contact>;
}

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

export interface Campaigns extends Page<Campaign> {}

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

export interface CampaignHistory extends Page<History> {}
