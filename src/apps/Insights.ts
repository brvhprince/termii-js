/**
 *   Project: termii-js
 *   File: Insights
 *   Created by pennycodes on 25/04/2023.
 *   Copyright termii-js
 */
import HttpClient from "../service/client";
import {
  Balance,
  InboxHistory,
  SearchQueryParams,
  SearchResponse,
  StatusQueryParams,
  StatusQueryPayload,
  StatusResponse,
} from "../interface/insights";
import { QueryParams } from "../interface/global";
class Insights {
  constructor(
    private readonly client: HttpClient,
    private readonly api_key: string,
    private readonly sender_id: string,
  ) {}

  public async balance(): Promise<Balance> {
    const params: QueryParams = {
      api_key: this.api_key,
    };

    return await this.client.get<Balance>("get-balance", {
      params,
    });
  }
  public async search_phone_number(phone_number: string): Promise<SearchResponse> {
    const params: SearchQueryParams = {
      api_key: this.api_key,
      phone_number,
    };

    return await this.client.get<SearchResponse>("check/dnd", {
      params,
    });
  }
  public async status_phone_number(payload: StatusQueryParams): Promise<StatusResponse> {
    const params: StatusQueryPayload = {
      api_key: this.api_key,
      country_code: "GH",
      ...payload,
    };

    return await this.client.get<StatusResponse>("insight/number/query", {
      params,
    });
  }
  public async history(): Promise<InboxHistory> {
    const params: QueryParams = {
      api_key: this.api_key,
    };

    return await this.client.get<InboxHistory>("sms/inbox", {
      params,
    });
  }
}

export default Insights;
