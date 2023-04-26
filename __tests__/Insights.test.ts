/**
 *   Project: termii-js
 *   File: Insights.test
 *   Created by pennycodes on 26/04/2023.
 *   Copyright termii-js
 */
import Insights from "../src/apps/Insights";
import HttpClient from "../src/service/client";
import { QueryParams } from "../src/interface/global";
import {
  InboxHistory,
  SearchQueryParams,
  Balance,
  SearchResponse,
  StatusQueryPayload,
  StatusResponse
} from "../src/interface/insights";
// Mock HttpClient to avoid actual API calls
jest.mock("../src/service/client");

describe("Insights", () => {
  let client: jest.Mocked<HttpClient>;
  let insights: Insights;

  const options = {
    baseURL: "https://example.com",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };


  beforeEach(() => {
    client = new HttpClient(options) as jest.Mocked<HttpClient>;
    insights = new Insights(client, 'API_KEY', 'SENDER_ID');
  });

  describe("balance", () => {
    it("returns balance when called with valid params", async () => {

      const expectedBalance: Balance = {
        user: "Penny Codes",
        balance: 100.0,
        currency: "USD"
      };
      client.get.mockResolvedValue(expectedBalance);

      const balance = await insights.balance();

      const params: QueryParams = {
        api_key: "API_KEY",
      };

      expect(client.get).toHaveBeenCalledWith("get-balance", {
        params,
      });
      expect(balance).toEqual(expectedBalance);
    });
  });

  describe("search_phone_number", () => {
    it("returns search response when called with valid params", async () => {

      const phoneNumber = "1234567890";
      const expectedResponse: SearchResponse = {
        network: "", network_code: "", number: "", status: ""
      };

      client.get.mockResolvedValue(expectedResponse);

      const searchResponse = await insights.search_phone_number(phoneNumber);


      const params: SearchQueryParams = {
        api_key: "API_KEY",
        phone_number: phoneNumber
      };
      expect(client.get).toHaveBeenCalledWith("check/dnd", {
        params,
      });
      expect(searchResponse).toEqual(expectedResponse);

    });
  });

  describe("status_phone_number", () => {
    it("returns status response when called with valid params", async () => {

      const expectedResponse: StatusResponse = {
        result: []
      };

      const queryParams: StatusQueryPayload = {
        phone_number: "1234567890",
        country_code: "GHS",
        api_key: "API_KEY"
      };

      client.get.mockResolvedValue(expectedResponse);

      const statusResponse = await insights.status_phone_number(queryParams);

      expect(client.get).toHaveBeenCalledWith("insight/number/query", {
        params: queryParams,
      });
      expect(statusResponse).toEqual(expectedResponse);
    });
  });

  describe("history", () => {
    it("returns inbox history when called with valid params", async () => {

      const expectedInboxHistory: InboxHistory[] = []

      client.get.mockResolvedValue(expectedInboxHistory);

      const inboxHistory = await insights.history();

      const params: QueryParams = {
        api_key: "API_KEY",
      };

      expect(client.get).toHaveBeenCalledWith("sms/inbox", {
        params,
      });

      expect(inboxHistory).toEqual(expectedInboxHistory);
    });
  });
});
