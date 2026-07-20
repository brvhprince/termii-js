# Changelog

## 3.0.0

Migration to the Termii v3 API. This release contains breaking changes to
response types — see **Breaking changes** before upgrading.

### Fixed

- **Webhook signatures never verified.** `Webhook.middleware` read the
  `X-Termii-Signature` header with capitals, but Node lowercases incoming header
  names, so the comparison always failed and no event was ever emitted.
- **`Webhook` could not be constructed.** `esModuleInterop` was not enabled, so
  `import mitt from "mitt"` compiled to `mitt_1.default()`, which is `undefined`
  in mitt's CommonJS build. `new Webhook()` threw a `TypeError` for every
  CommonJS consumer.
- Signature comparison now uses `crypto.timingSafeEqual` instead of `===`.
- `Webhook` prefers `request.rawBody` when present. Re-serialising a parsed body
  can reorder keys and change whitespace, producing a hash that never matches the
  bytes Termii signed. See **Webhook raw body** below.
- Tests imported three types from the compiled `lib/` output rather than `src/`,
  so those types were validated against stale build artifacts.
- **Explicit `undefined` clobbered defaults.** `send`, `send_bulk` and
  `send_campaign` spread the caller's payload over their defaults, so passing
  `channel: undefined` sent `channel: undefined` instead of falling back to
  `generic`. The same applied to `type`, `message_type` and `remove_duplicate`.
- `MessagingChannels.VOICE` now sends `type: "voice"`. The voice channel is not
  delivered when the type does not match it. An explicit `type` still wins.

### Breaking changes

- **Pagination.** The v3 API returns a Spring-style page. `Paginator` and
  `Paginator2` are removed and replaced by a single `Page<T>`:

  | Removed (v2)             | Now (v3)         |
  | ------------------------ | ---------------- |
  | `data`                   | `content`        |
  | `total`                  | `totalElements`  |
  | `last_page`              | `totalPages`     |
  | `current_page`           | `number`         |
  | `per_page`               | `size`           |
  | `links` / `meta`         | `pageable`       |

  Affects `list_sender_ids`, `list_phonebooks`, `list_campaigns` and
  `get_campaign_history`. Read results from `.content` instead of `.data`.

- **`list_contacts`** no longer returns a page directly. The response is now
  `{ headers, phonebook, data }`, where `data` is the `Page<Contact>`. Contact
  attributes moved from fixed columns to a `contact_list_key_value` array.

- **Default base URL** is now `https://v3.api.termii.com/api/`. Base URLs are
  account-specific; pass yours as the third constructor argument if it differs.

- **`MessagingChannels` is no longer a `const enum`**, so it now emits a runtime
  object. This makes it usable under `isolatedModules` and Babel.

- `SendMessageResponse.message_id_str` and four new `TokenResponse` fields are
  required, which will surface as type errors in code that builds these objects
  literally (test fixtures, mocks).

- `SenderID.status` is now `"active" | "pending" | "blocked"` (was
  `"block" | "unblock"`), and `created_at` is now `createdAt`.

- **Message types are now a union**, not `string`:
  `MessageType = "plain" | "unicode" | "encrypted" | "voice"`. Code passing a
  `string` variable will need a cast or a narrower declaration.

- **`send_bulk` is narrowed to what the bulk endpoint accepts.** `channel` is
  `BulkMessagingChannel` (`dnd | generic`) and `type` is `BulkMessageType`
  (excludes `voice`). Bulk delivery supports neither WhatsApp nor voice, so
  these calls previously typechecked and then failed at the API.

### Added

- `send_with_template_media` — `POST send/template/media`
- `send_email_notification` — `POST templates/send-email`
- `upload_contacts` — `POST phonebooks/contacts/upload` (multipart CSV)
- `retry_campaign` — `PATCH sms/campaigns/{campaign_id}`
- `list_sender_ids` accepts `name` and `status` filters
- `update_phonebook` accepts a `description`
- `MessagingChannels.VOICE`
- `Termii` constructor accepts an optional `base_url`

### Tooling

- Replaced tslint and Prettier with Biome. Formatting settings carried over
  (120 columns, double quotes, trailing commas, 2-space indent).
- Updated axios, mitt, jest 30, TypeScript 5.9, and added an explicit
  `@types/node` pinned to match the Node 22 runtime.

### Webhook raw body

Termii signs the raw request bytes. To verify reliably, capture them:

```js
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);
```

Without this the library falls back to `JSON.stringify(request.body)`, which
only matches when key order happens to round-trip unchanged.

### Not changed — needs verification

- **`delete_contact`** still calls `DELETE phonebook/contact/{contact_id}`, which
  does not appear in the v3 docs. The documented replacement,
  `DELETE phonebooks/{phonebook_id}/contacts`, carries no contact identifier and
  is the same path used to list and create contacts, so it may delete every
  contact in the phonebook. Left unchanged pending confirmation.
- **`send_with_template`** still returns `SendMessageResponse[]`. The docs render
  a single object, but as a schema table that may have flattened an array.
- **`Token.send_voice_call`** still posts to `sms/otp/call`. The docs page for
  voice call shows `sms/otp/send/voice` — identical to the voice token page but
  with different parameters, which looks like a documentation error.
