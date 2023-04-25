/**
 *   Project: termii-js
 *   File: Messaging
 *   Created by pennycodes on 25/04/2023.
 *   Copyright termii-js
 */
import {
  AddContact,
  AddPhonebook, CampaignHistory, Campaigns,
  ContactResponse,
  Contacts,
  CreateContact,
  CreatePhonebook,
  MessagingChannels,
  Phonebooks,
  RequestSenderIdOptions,
  RequestSenderIdPayload,
  SendBulkMessageOptions,
  SendBulkMessagePayload,
  SendCampaignOptions,
  SendCampaignPayload,
  SenderIDs,
  SendMessageOptions,
  SendMessagePayload,
  SendMessageResponse,
  SendTemplateOptions,
  SendTemplatePayload,
  SendWithoutSenderId,
  SendWithoutSenderIdPayload,
  UpdatePhonebook
} from "../interface/messaging";
import { PayloadResponse, QueryParams } from "../interface/global";
import HttpClient from "../service/client";

class Messaging {

  constructor(
    private readonly client: HttpClient,
    private readonly api_key: string,
    private readonly sender_id: string
  ) {}

  public async list_sender_ids(page?:number): Promise<SenderIDs> {

      let params: QueryParams = {
        api_key: this.api_key,
        page
      };

      return await this.client.get<SenderIDs>("sender-id", {
        params
      });



  }

  public async request_sender_id(payload: RequestSenderIdOptions): Promise<PayloadResponse> {

      const requestPayload: RequestSenderIdPayload = {
        api_key: this.api_key,
        ...payload
      }

      return await this.client.post<PayloadResponse>("sender-id/request", requestPayload)

  }

  public async send(payload: SendMessageOptions): Promise<SendMessageResponse>
  {

      const requestPayload: SendMessagePayload = {
        api_key: this.api_key,
        from: this.sender_id,
        channel: MessagingChannels.GENERIC,
        type: "plain",
        ...payload

      }

      return await this.client.post<SendMessageResponse>("sms/send", requestPayload)

  }
  public async send_bulk(payload: SendBulkMessageOptions): Promise<SendMessageResponse>
  {

      const requestPayload: SendBulkMessagePayload = {
        api_key: this.api_key,
        from: this.sender_id,
        channel: MessagingChannels.GENERIC,
        type: "plain",
        ...payload

      }

      return await this.client.post<SendMessageResponse>("sms/send/bulk", requestPayload)


  }
  public async send_without_sender_id(payload: SendWithoutSenderId): Promise<SendMessageResponse>
  {
      const requestPayload: SendWithoutSenderIdPayload = {
        api_key: this.api_key,
        ...payload
      }

      return await this.client.post<SendMessageResponse>("sms/number/send", requestPayload)

  }
  public async send_with_template(payload: SendTemplateOptions): Promise<SendMessageResponse[]>
  {

      const requestPayload: SendTemplatePayload = {
        api_key: this.api_key,
        ...payload
      }

      return await this.client.post<SendMessageResponse[]>("send/template", requestPayload)

  }

  public async list_phonebooks(page?:number): Promise<Phonebooks> {

      let params: QueryParams = {
        api_key: this.api_key,
        page
      };

      return await this.client.get<Phonebooks>("phonebooks", {
        params
      });


  }


  public async create_phonebook(payload: CreatePhonebook): Promise<PayloadResponse>
  {

      const requestPayload: AddPhonebook = {
        api_key: this.api_key,
        ...payload
      }

      return await this.client.post<PayloadResponse>("phonebooks", requestPayload)

  }
  public async update_phonebook(id: string, name: string): Promise<PayloadResponse>
  {

      const requestPayload: UpdatePhonebook = {
        api_key: this.api_key,
        phonebook_name:  name
      }

      return await this.client.patch<PayloadResponse>(`phonebooks/${id}`, requestPayload)

  }
  public async delete_phonebook(phonebook_id: string): Promise<PayloadResponse>
  {

      return await this.client.delete<PayloadResponse>(`phonebooks/${phonebook_id}`, {
        params: {
          api_key: this.api_key
        }
      })

  }


  public async list_contacts(phonebook_id: string | number, page?:number): Promise<Contacts> {

      let params: QueryParams = {
        api_key: this.api_key,
        page
      };

      return await this.client.get<Contacts>(`phonebooks/${phonebook_id}/contacts`, {
        params
      });

  }

  public async create_contact(phonebook_id: string, payload: CreateContact): Promise<ContactResponse>
  {

      const requestPayload: AddContact = {
        api_key: this.api_key,
        ...payload
      }

      return await this.client.post<ContactResponse>(`phonebooks/${phonebook_id}/contacts`, requestPayload)

  }

  public async delete_contact(contact_id: string|number): Promise<PayloadResponse>
  {

      return await this.client.delete<PayloadResponse>(`phonebook/contact/${contact_id}`, {
        params: {
          api_key: this.api_key
        }
      })

  }

  public async send_campaign(payload: SendCampaignOptions): Promise<PayloadResponse>
  {
      const requestPayload: SendCampaignPayload = {
        api_key: this.api_key,
        sender_id: this.sender_id,
        channel: MessagingChannels.GENERIC,
        message_type: "plain",
        remove_duplicate: "yes",
       ...payload
      }

      return await this.client.post<PayloadResponse>("sms/campaigns/send", requestPayload)

  }


  public async list_campaigns(page?:number): Promise<Campaigns> {

      let params: QueryParams = {
        api_key: this.api_key,
        page
      };

      return await this.client.get<Campaigns>("sms/campaigns", {
        params
      });

  }

  public async get_campaign_history(campaign_id:string): Promise<CampaignHistory> {

      let params: QueryParams = {
        api_key: this.api_key
      };

      return await this.client.get<CampaignHistory>(`sms/campaigns/${campaign_id}`, {
        params
      });

  }

}

export default Messaging
