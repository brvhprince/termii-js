/**
 *   Project: termii-js
 *   File: Messaging
 *   Created by pennycodes on 25/04/2023.
 *   Copyright termii-js
 */

import type { PayloadResponse, QueryParams } from "../interface/global";
import {
  type AddContact,
  type AddPhonebook,
  type CampaignHistory,
  type Campaigns,
  type ContactResponse,
  type Contacts,
  type CreateContact,
  type CreatePhonebook,
  MessagingChannels,
  type Phonebooks,
  type RequestSenderIdOptions,
  type RequestSenderIdPayload,
  type SendBulkMessageOptions,
  type SendBulkMessagePayload,
  type SendCampaignOptions,
  type SendCampaignPayload,
  type SendEmailOptions,
  type SendEmailPayload,
  type SenderIDs,
  type SenderIdFilters,
  type SendMessageOptions,
  type SendMessagePayload,
  type SendMessageResponse,
  type SendTemplateMediaOptions,
  type SendTemplateMediaPayload,
  type SendTemplateOptions,
  type SendTemplatePayload,
  type SendWithoutSenderId,
  type SendWithoutSenderIdPayload,
  type UpdatePhonebook,
  type UploadContacts,
} from "../interface/messaging";
import type HttpClient from "../service/client";

class Messaging {
  constructor(
    private readonly client: HttpClient,
    private readonly api_key: string,
    private sender_id: string,
  ) {}

  /** Updates the sender ID used for subsequent requests. */
  public set_sender_id(sender_id: string): void {
    this.sender_id = sender_id.trim();
  }

  public async list_sender_ids(page?: number, filters?: SenderIdFilters): Promise<SenderIDs> {
    const params: QueryParams & SenderIdFilters = {
      api_key: this.api_key,
      page,
      ...filters,
    };

    return await this.client.get<SenderIDs>("sender-id", {
      params,
    });
  }

  public async request_sender_id(payload: RequestSenderIdOptions): Promise<PayloadResponse> {
    const { usecase, ...rest } = payload;

    const requestPayload: RequestSenderIdPayload = {
      api_key: this.api_key,
      // the API rejects the request as empty unless the use case arrives as use_case
      use_case: usecase,
      ...rest,
    };

    return await this.client.post<PayloadResponse>("sender-id/request", requestPayload);
  }
  public async send(payload: SendMessageOptions): Promise<SendMessageResponse> {
    const { channel, type, ...rest } = payload;
    const resolved = channel ?? MessagingChannels.GENERIC;

    const requestPayload: SendMessagePayload = {
      api_key: this.api_key,
      from: this.sender_id,
      channel: resolved,
      // the voice channel is only delivered when the message type matches it
      type: type ?? (resolved === MessagingChannels.VOICE ? "voice" : "plain"),
      ...rest,
    };

    return await this.client.post<SendMessageResponse>("sms/send", requestPayload);
  }
  public async send_bulk(payload: SendBulkMessageOptions): Promise<SendMessageResponse> {
    const { channel, type, ...rest } = payload;

    const requestPayload: SendBulkMessagePayload = {
      api_key: this.api_key,
      from: this.sender_id,
      channel: channel ?? MessagingChannels.GENERIC,
      type: type ?? "plain",
      ...rest,
    };

    return await this.client.post<SendMessageResponse>("sms/send/bulk", requestPayload);
  }
  public async send_without_sender_id(payload: SendWithoutSenderId): Promise<SendMessageResponse> {
    const requestPayload: SendWithoutSenderIdPayload = {
      api_key: this.api_key,
      ...payload,
    };

    return await this.client.post<SendMessageResponse>("sms/number/send", requestPayload);
  }
  public async send_with_template(payload: SendTemplateOptions): Promise<SendMessageResponse[]> {
    const requestPayload: SendTemplatePayload = {
      api_key: this.api_key,
      ...payload,
    };

    return await this.client.post<SendMessageResponse[]>("send/template", requestPayload);
  }

  /**
   * <p> Sends a template message with an attached media object. </p>
   * <p> Unlike {@link send_with_template}, the <b>media</b> object is required. </p>
   */
  public async send_with_template_media(payload: SendTemplateMediaOptions): Promise<SendMessageResponse[]> {
    const requestPayload: SendTemplateMediaPayload = {
      api_key: this.api_key,
      ...payload,
    };

    return await this.client.post<SendMessageResponse[]>("send/template/media", requestPayload);
  }

  /**
   * <p> Delivers a product notification to a customer via email. </p>
   */
  public async send_email_notification(payload: SendEmailOptions): Promise<SendMessageResponse> {
    const requestPayload: SendEmailPayload = {
      api_key: this.api_key,
      ...payload,
    };

    return await this.client.post<SendMessageResponse>("templates/send-email", requestPayload);
  }

  public async list_phonebooks(page?: number): Promise<Phonebooks> {
    const params: QueryParams = {
      api_key: this.api_key,
      page,
    };

    return await this.client.get<Phonebooks>("phonebooks", {
      params,
    });
  }

  public async create_phonebook(payload: CreatePhonebook): Promise<PayloadResponse> {
    const requestPayload: AddPhonebook = {
      api_key: this.api_key,
      ...payload,
    };

    return await this.client.post<PayloadResponse>("phonebooks", requestPayload);
  }
  public async update_phonebook(id: string, name: string, description?: string): Promise<PayloadResponse> {
    const requestPayload: UpdatePhonebook = {
      api_key: this.api_key,
      phonebook_name: name,
      description,
    };

    return await this.client.patch<PayloadResponse>(`phonebooks/${id}`, requestPayload);
  }
  public async delete_phonebook(phonebook_id: string): Promise<PayloadResponse> {
    return await this.client.delete<PayloadResponse>(`phonebooks/${phonebook_id}`, {
      params: {
        api_key: this.api_key,
      },
    });
  }

  public async list_contacts(phonebook_id: string | number, page?: number): Promise<Contacts> {
    const params: QueryParams = {
      api_key: this.api_key,
      page,
    };

    return await this.client.get<Contacts>(`phonebooks/${phonebook_id}/contacts`, {
      params,
    });
  }

  public async create_contact(phonebook_id: string, payload: CreateContact): Promise<ContactResponse> {
    const requestPayload: AddContact = {
      api_key: this.api_key,
      ...payload,
    };

    return await this.client.post<ContactResponse>(`phonebooks/${phonebook_id}/contacts`, requestPayload);
  }

  /**
   * <p> Adds multiple contacts to a phonebook from a CSV file. </p>
   * <p> The request is sent as <b>multipart/form-data</b>: pass the file contents
   * as a <b>Blob</b>, for example <b>new Blob([await fs.promises.readFile(path)])</b>. </p>
   */
  public async upload_contacts(payload: UploadContacts): Promise<PayloadResponse> {
    const form = new FormData();

    form.append("file", payload.file, payload.filename ?? "contacts.csv");

    // Sent as a typed blob rather than a plain field: the API binds this part by
    // content type and rejects the request as missing if it arrives untyped
    form.append(
      "contact",
      new Blob(
        [
          JSON.stringify({
            pid: payload.pid,
            country_code: payload.country_code,
            api_key: this.api_key,
          }),
        ],
        { type: "application/json" },
      ),
    );

    // Content-Type is left unset so the boundary generated for this form is used
    // rather than the client's default application/json
    return await this.client.post<PayloadResponse>("phonebooks/contacts/upload", form, {
      headers: { "Content-Type": undefined },
    });
  }

  public async delete_contact(contact_id: string | number): Promise<PayloadResponse> {
    return await this.client.delete<PayloadResponse>(`phonebook/contact/${contact_id}`, {
      params: {
        api_key: this.api_key,
      },
    });
  }

  public async send_campaign(payload: SendCampaignOptions): Promise<PayloadResponse> {
    const { channel, message_type, remove_duplicate, ...rest } = payload;

    const requestPayload: SendCampaignPayload = {
      api_key: this.api_key,
      sender_id: this.sender_id,
      channel: channel ?? MessagingChannels.GENERIC,
      message_type: message_type ?? "plain",
      remove_duplicate: remove_duplicate ?? "yes",
      ...rest,
    };

    return await this.client.post<PayloadResponse>("sms/campaigns/send", requestPayload);
  }

  public async list_campaigns(page?: number): Promise<Campaigns> {
    const params: QueryParams = {
      api_key: this.api_key,
      page,
    };

    return await this.client.get<Campaigns>("sms/campaigns", {
      params,
    });
  }

  public async get_campaign_history(campaign_id: string, page?: number): Promise<CampaignHistory> {
    const params: QueryParams = {
      api_key: this.api_key,
      page,
    };

    return await this.client.get<CampaignHistory>(`sms/campaigns/${campaign_id}`, {
      params,
    });
  }

  /**
   * <p> Re-sends a campaign that previously failed. </p>
   */
  public async retry_campaign(campaign_id: string): Promise<PayloadResponse> {
    return await this.client.patch<PayloadResponse>(`sms/campaigns/${campaign_id}`, {
      api_key: this.api_key,
    });
  }
}

export default Messaging;
