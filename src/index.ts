/**
 *   Project: termii-js
 *   File: index
 *   Created by pennycodes on 25/04/2023.
 *   Copyright termii-js
 */

import Termii from "./common/Termii";
import Webhook from "./common/Webhook";

export type { Page, Pageable, PayloadResponse, Sort } from "./interface/global";
export type {
  BulkMessageType,
  BulkMessagingChannel,
  MessageType,
  SenderIdFilters,
  SenderIdStatus,
} from "./interface/messaging";
// MessagingChannels is a runtime enum, so consumers need the value, not just the type
export { MessagingChannels } from "./interface/messaging";
export { Termii, Webhook };
