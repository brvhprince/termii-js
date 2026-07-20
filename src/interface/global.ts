/**
 *   Project: termii-js
 *   File: global
 *   Created by pennycodes on 25/04/2023.
 *   Copyright termii-js
 */

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  sort: Sort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

/**
 * <p> Paginated response wrapper returned by the v3 API. </p>
 * <p> Replaces the <b>Paginator</b> and <b>Paginator2</b> shapes used up to v2:
 * results now live under <b>content</b> rather than <b>data</b>. </p>
 */
export interface Page<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  sort: Sort;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PayloadResponse {
  code?: string;
  message: string;
}

export interface KeyValuePair {
  [key: string]: string;
}

export interface QueryParams {
  /**
   * Page number to return results for
   */
  page?: number;
  /**
   * Number of results to return per page
   */
  size?: number;
  /** Your API key (It can be found on your [Termii Dashboard]{@link https://accounts.termii.com/#/}).
   */
  api_key: string;
}
