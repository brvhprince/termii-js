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
import { PayloadResponse, QueryParams, Unauthorized } from "../interface/global";
import { AxiosError } from "axios";
import HttpClient from "../service/client";

class Messaging {

  private readonly message = "Messaging API Error";

  constructor(
    private readonly client: HttpClient,
    private readonly api_key: string,
    private readonly sender_id: string
  ) {}

  public async listSenderIds(page?:number): Promise<SenderIDs | Unauthorized> {
    try {

      let params: QueryParams = {
        api_key: this.api_key,
        page
      };

      return await this.client.get<SenderIDs>("sender-id", {
        params
      });


    }
    catch (e) {
      return {
        message: this.message,
        error: e as AxiosError
      }
    }
  }

  public async requestSenderId(payload: RequestSenderIdOptions): Promise<PayloadResponse | Unauthorized> {
    try {
      const requestPayload: RequestSenderIdPayload = {
        api_key: this.api_key,
        ...payload
      }

      return await this.client.post<PayloadResponse>("sender-id/request", requestPayload)

    }
    catch (e) {
      return {
        message: this.message,
        error: e as AxiosError
      }
    }

  }

  public async send(payload: SendMessageOptions): Promise<SendMessageResponse | Unauthorized>
  {
    try {
      const requestPayload: SendMessagePayload = {
        api_key: this.api_key,
        from: this.sender_id,
        channel: MessagingChannels.GENERIC,
        type: "plain",
        ...payload

      }

      return await this.client.post<SendMessageResponse>("sms/send", requestPayload)
    }
    catch (e) {
      return {
        message: this.message,
        error: e as AxiosError
      }
    }
  }
  public async sendBulk(payload: SendBulkMessageOptions): Promise<SendMessageResponse | Unauthorized>
  {
    try {
      const requestPayload: SendBulkMessagePayload = {
        api_key: this.api_key,
        from: this.sender_id,
        channel: MessagingChannels.GENERIC,
        type: "plain",
        ...payload

      }

      return await this.client.post<SendMessageResponse>("sms/send/bulk", requestPayload)
    }
    catch (e) {
      return {
        message: this.message,
        error: e as AxiosError
      }
    }
  }
  public async sendWithoutSenderId(payload: SendWithoutSenderId): Promise<SendMessageResponse | Unauthorized>
  {
    try {
      const requestPayload: SendWithoutSenderIdPayload = {
        api_key: this.api_key,
        ...payload
      }

      return await this.client.post<SendMessageResponse>("sms/number/send", requestPayload)
    }
    catch (e) {
      return {
        message: this.message,
        error: e as AxiosError
      }
    }
  }
  public async sendWithTemplate(payload: SendTemplateOptions): Promise<SendMessageResponse[] | Unauthorized>
  {
    try {
      const requestPayload: SendTemplatePayload = {
        api_key: this.api_key,
        ...payload
      }

      return await this.client.post<SendMessageResponse[]>("send/template", requestPayload)
    }
    catch (e) {
      return {
        message: this.message,
        error: e as AxiosError
      }
    }
  }

  public async listPhonebooks(page?:number): Promise<Phonebooks | Unauthorized> {
    try {

      let params: QueryParams = {
        api_key: this.api_key,
        page
      };

      return await this.client.get<Phonebooks>("phonebooks", {
        params
      });


    }
    catch (e) {
      return {
        message: this.message,
        error: e as AxiosError
      }
    }
  }


  public async createPhonebook(payload: CreatePhonebook): Promise<PayloadResponse | Unauthorized>
  {
    try {
      const requestPayload: AddPhonebook = {
        api_key: this.api_key,
        ...payload
      }

      return await this.client.post<PayloadResponse>("phonebooks", requestPayload)
    }
    catch (e) {
      return {
        message: this.message,
        error: e as AxiosError
      }
    }
  }
  public async updatePhonebook(id: string, name: string): Promise<PayloadResponse | Unauthorized>
  {
    try {
      const requestPayload: UpdatePhonebook = {
        api_key: this.api_key,
        phonebook_name:  name
      }

      return await this.client.patch<PayloadResponse>(`phonebooks/${id}`, requestPayload)
    }
    catch (e) {
      return {
        message: this.message,
        error: e as AxiosError
      }
    }
  }
  public async deletePhonebook(phonebook_id: string): Promise<PayloadResponse | Unauthorized>
  {
    try {

      return await this.client.delete<PayloadResponse>(`phonebooks/${phonebook_id}`, {
        params: {
          api_key: this.api_key
        }
      })
    }
    catch (e) {
      return {
        message: this.message,
        error: e as AxiosError
      }
    }
  }


  public async listContacts(phonebook_id: string | number, page?:number): Promise<Contacts | Unauthorized> {
    try {

      let params: QueryParams = {
        api_key: this.api_key,
        page
      };

      return await this.client.get<Contacts>(`phonebooks/${phonebook_id}/contacts`, {
        params
      });


    }
    catch (e) {
      return {
        message: this.message,
        error: e as AxiosError
      }
    }
  }

  public async createContact(phonebook_id: string, payload: CreateContact): Promise<ContactResponse | Unauthorized>
  {
    try {
      const requestPayload: AddContact = {
        api_key: this.api_key,
        ...payload
      }

      return await this.client.post<ContactResponse>(`phonebooks/${phonebook_id}/contacts`, requestPayload)
    }
    catch (e) {
      return {
        message: this.message,
        error: e as AxiosError
      }
    }
  }

  public async deleteContact(contact_id: string|number): Promise<PayloadResponse | Unauthorized>
  {
    try {

      return await this.client.delete<PayloadResponse>(`phonebook/contact/${contact_id}`, {
        params: {
          api_key: this.api_key
        }
      })
    }
    catch (e) {
      return {
        message: this.message,
        error: e as AxiosError
      }
    }
  }

  public async sendCampaign(payload: SendCampaignOptions): Promise<PayloadResponse | Unauthorized>
  {
    try {
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
    catch (e) {
      return {
        message: this.message,
        error: e as AxiosError
      }
    }
  }


  public async listCampaigns(page?:number): Promise<Campaigns | Unauthorized> {
    try {

      let params: QueryParams = {
        api_key: this.api_key,
        page
      };

      return await this.client.get<Campaigns>("sms/campaigns", {
        params
      });


    }
    catch (e) {
      return {
        message: this.message,
        error: e as AxiosError
      }
    }
  }

  public async getCampaignHistory(campaign_id:string): Promise<CampaignHistory | Unauthorized> {
    try {

      let params: QueryParams = {
        api_key: this.api_key
      };

      return await this.client.get<CampaignHistory>(`sms/campaigns/${campaign_id}`, {
        params
      });


    }
    catch (e) {
      return {
        message: this.message,
        error: e as AxiosError
      }
    }
  }

}

export default Messaging
