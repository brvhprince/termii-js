/**
 *   Project: termii-js
 *   File: global
 *   Created by pennycodes on 25/04/2023.
 *   Copyright termii-js
 */

export interface Paginator<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

interface Links {
  first: string
  last: string
  prev: string | null
  next: string | null
}

interface Meta {
  current_page: number
  from: number
  last_page: number
  path: string
  per_page: number
  to: number
  total: number
}
export interface Paginator2<T> {
  data: T[]
  links: Links
  meta: Meta
}



export interface PayloadResponse {
  code?: string
  message: string
}

export interface KeyValuePair {
  [key: string] : string
}

export interface QueryParams {
  page?: number
  api_key: string
}
