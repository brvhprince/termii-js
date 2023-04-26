![npm (scoped)](https://img.shields.io/npm/v/@brvhprince/termii-js?color=%23FF7B37&style=flat-square)
![npm](https://img.shields.io/npm/dm/@brvhprince/termii-js?style=flat-square)

![NPM](https://img.shields.io/npm/l/@brvhprince/termii-js?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/brvhprince/termii-js?color=%23A4A61D&style=flat-square)
![GitHub top language](https://img.shields.io/github/languages/top/brvhprince/termii-js?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/brvhprince/termii-js)

![GitHub forks](https://img.shields.io/github/forks/brvhprince/termii-js?style=social)
![GitHub Repo stars](https://img.shields.io/github/stars/brvhprince/termii-js?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/brvhprince/termii-js?style=social)

![Twitter Follow](https://img.shields.io/twitter/follow/pennycodes?style=social)
# Termii NodeJs Library

> A Node client library for consuming the  [Termii API](https://www.developers.termii.com/)

## Prerequisites

This project requires NodeJS (version 14 or later) and Yarn.
[Node](http://nodejs.org/) and [Yarn](https://yarnpkg.com/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ yarn -v && node -v
1.22.19
v16.19.1
```

## Table of contents

- [Termii NodeJs Library](#Termii-NodeJs-Library)
    - [Prerequisites](#prerequisites)
    - [Table of contents](#table-of-contents)
    - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Usage](#usage)
        - [Import and Initialize](#import-and-initialize-the-library)
        - [Set Sender ID](#set-a-new-sender-id)
    - [Resources](#resources)
        - [Messaging](#messaging)
            - [Sender ID](#sender-id-documentation)
            - [Messages](#messages-documentation)
            - [Send Message Without Sender ID](#send-message-without-sender-id-documentation)
            - [Send Message With Template](#send-message-with-template-documentation)
            - [Phonebooks](#phonebooks-documentation)
            - [Contacts](#contacts-documentation)
            - [Campaigns](#campaigns-documentation)
        - [Token](#token-documentation)
          - [Send Token](#send-token-documentation)
          - [Email Token](#email-token-documentation)
          - [Send Voice Token](#send-voice-token-documentation)
          - [Make Voice Call](#make-voice-call-documentation)
          - [Send In App Token](#send-in-app-token-documentation)
          - [Verify Token](#verify-token-documentation)
        - [Insights](#insights-documentation)
          - [Account Balance](#balance-documentation)
          - [Phone Number Search](#search-documentation)
          - [Phone Number Status](#status-documentation)
          - [Inbox History](#history-documentation)
        - [Express Middleware](#middleware)
    - [Contributing](#contributing)
    - [Built With](#built-with)
    - [Versioning](#versioning)
    - [Authors](#authors)
    - [License](#license)

## Getting Started

You need to create a [Termii account](https://accounts.termii.com/#/register) if you don't have one already,
to get your API Key, Sender ID and Secret key.

> Termii-js was made for the browser, but works in any JavaScript runtime.

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)


To install and set up the library, run:

```sh
$ npm install @brvhprince/termii-js
```

Or if you prefer using Yarn:

```sh
$ yarn add @brvhprince/termii-js
```

## Usage

### Import and Initialize the library


```javascript
// using ES6 modules
import { Termii } from '@brvhprince/termii-js'

// using CommonJS modules
const { Termii } = require("@brvhprince/termii-js");

// Initialize

const provider = new Termii("api_key_here", "sender_id");
```

### Set a new Sender Id

```javascript
provider.set_sender_id("new_sender_id")
```

# Resources
Resources available on the API

| Name                                  | Description                                                                                                                                                        |
|---------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Messaging](#messaging-documentation) | Messaging allows you to send messages across SMS and WhatsApp Channels [Learn More](https://www.developers.termii.com/switch)                                      |
| [Token](#token-documentation)         | Generate, send and verify one-time-passwords [Learn More](https://www.developers.termii.com/token)                                                                 |
| [Insights](#insights-documentation)   | Retrieve real-time delivery report of messages sent to customers as well as the status of their contacts  [Learn More](https://www.developers.termii.com/insights) |
| [Middleware](#middleware)             | Express Middleware to handle webhook requests                                                                                                                      |


## Messaging [Documentation](https://www.developers.termii.com/switch)

Send messages to any country in the world across SMS and WhatsApp channel

### Sender ID  [Documentation](https://www.developers.termii.com/sender-id)

A Sender ID is the name or number that identifies the sender of an SMS message

*   **List Sender IDs**
    ```javascript
    
    // returns paginated results of 15 items per page
    const senderIds = await provider.messaging.list_sender_ids();
    
    // get page
    const nextSenderIds = await provider.messaging.list_sender_ids(2); 
    ```

*   **Request a new sender Id**
    ```javascript
    
    const payload = {
      // between 3 and 11 characters
      sender_id: "Penny",
      usecase: "Send promotional messages",
      company: "Pennycodes"
    }
    
    const response = await provider.messaging.request_sender_id(payload);
    
    console.log(response.code) // ok 
    ```

### Messages [Documentation](https://www.developers.termii.com/messaging)

This API allows businesses send text messages to their customers across different messaging channels

*   **Send Message**
    ```javascript
    
    const payload = {
      to: "233552345567",
      sms: "Hello there, welcome to Termii"
    }
    
    const response = await provider.messaging.send(payload);
    
    console.log(response.code) // ok 
    ```
*   **Send Bulk Message**
    ```javascript
    
    const payload = {
      to: ["23490555546", "23423490126999","23490555546"],
      sms: "Hello there, welcome to Termii"
    }
    
    const response = await provider.messaging.send_bulk(payload);
    
    console.log(response.code) // ok 
    ```

### Send Message Without Sender ID [Documentation](https://www.developers.termii.com/number)

This API allows businesses send messages to customers using Termii's auto-generated messaging numbers that adapt to customers location.

```javascript

const payload = {
  to: "233552345567",
  sms: "Hello there, welcome to Termii"
}

const response = await provider.messaging.send_without_sender_id(payload);

console.log(response.code) // ok 
```

### Send Message With Template [Documentation](https://www.developers.termii.com/templates)

Templates API helps businesses set a template for the one-time-passwords (pins) sent to their customers via whatsapp

```javascript

const payload = {
  phone_number: "233552345567",
  device_id: "device_one",
  template_id: "template_one",
  data: {
    product_name: "Termii",
    otp : 120435,
    expiry_time: "10 minutes"
  }
}

const response = await provider.messaging.send_with_template(payload);

console.log(response.code) // ok 
```

### Phonebooks [Documentation](https://www.developers.termii.com/phonebook)

Create, view & manage phonebooks using these APIs. Each phonebook can be identified by a unique ID, which makes it easier to edit or delete a phonebook.

* **List Phonebooks**

    ```javascript
    
   // returns paginated results of 15 items per page
    const phonebooks = await provider.messaging.list_phonebooks();
  
     // get page
    const nextPhonebooks = await provider.messaging.list_phonebooks(2);
    ```
  
* **Create Phonebook**

    ```javascript
    
    const payload =  {
      phonebook_name: "Royals",
      description: "My royal leads"  
  }
  
    const response = await provider.messaging.create_phonebook(payload);
  
    console.log(response.message) // Phonebook added successfully
    ```
  
* **Update Phonebook**

    ```javascript
    
    const payload =  {
      phonebook_name: "Premium" 
  }
  
    const response = await provider.messaging.update_phonebook("phonebook_id",payload);
  
    console.log(response.message) // Phonebook updated successfully
    ```
  
* **Delete Phonebook**

    ```javascript
    
    const response = await provider.messaging.delete_phonebook("phonebook_id");
  
    console.log(response.message) // Phonebook deleted successfully
    ```

### Contacts [Documentation](https://www.developers.termii.com/contacts)

Contacts API allows you manage (i.e. edit, update, & delete) contacts in your phonebook.

* **List Contacts of Phonebook**

    ```javascript
    
   // returns paginated results of 15 items per page
    const contacts = await provider.messaging.list_contacts("phonebook_id");
  
     // get page
    const nextContacts = await provider.messaging.list_contacts("phonebook_id", 2);
    ```
  
* **Create Contact**

    ```javascript
    
    const payload =  {
      phone_number: "556789909",
      country_code: "233"
  }
  
    const response = await provider.messaging.create_contact("phonebook_id",payload);
  
    console.log(response.data.id) // 3647982
    ```
  
* **Delete Contact**

    ```javascript
    
    const response = await provider.messaging.delete_contact("contact_id");
  
    console.log(response.message) // Contact deleted successfully
    ```

### Campaigns [Documentation](https://www.developers.termii.com/campaign)

Campaign API allows you to view, manage and send a campaign to a phonebook.

* **List Campaigns**

    ```javascript
    
   // returns paginated results of 15 items per page
    const campaigns = await provider.messaging.list_campaigns();
  
     // get page
    const nextCampaigns = await provider.messaging.list_campaigns(2);
    ```
  
* **Fetch Campaign History**

    ```javascript
    
   // returns paginated results of 15 items per page
    const history = await provider.messaging.get_campaign_history("campaign_id");
  
     // get page
    const nextHistory = await provider.messaging.get_campaign_history("campaign_id", 2);
    ```
  
* **Send Campaign**

    ```javascript
    
    const payload =  {
      phone_number: "556789909",
      country_code: "233",
      message: "Hello, Welcome to Termii",
      phonebook_id: "phonebook_id",
      campaign_type: "personalized"
  }
  
    const response = await provider.messaging.send_campaign(payload);
  
    console.log(response.message) // Your campaign has been scheduled
    ```


## Token [Documentation](https://www.developers.termii.com/token)

Token allows businesses generate, send and verify one-time-passwords.

### Send Token [Documentation](https://www.developers.termii.com/send-token)

The send token API allows businesses trigger one-time-passwords (OTP) across any available messaging channel on Termii.

```javascript

const payload = {
  to: "23490126727",
  pin_length: 6,
  message_text: "Your pin is"
}

const response = await provider.token.send_token(payload);

console.log(response.pinId) // 29ae67c2-c8e1-4165-8a51-8d3d7c298081
```

### Email Token [Documentation](https://www.developers.termii.com/email-token)

The email token API enables you to send one-time-passwords to an email address

```javascript

const payload = {
  email_address: "test@termii.com",
  code: "092471",
  email_configuration_id: "email_configuration_id_from_dashboard"
}

const response = await provider.token.email_token(payload);

console.log(response.code) // ok
```

### Send Voice Token [Documentation](https://www.developers.termii.com/voice-token)

The voice token API enables you to generate and trigger one-time passwords (OTP) through the voice channel to a phone number

```javascript

const payload = {
  phone_number: "23490126727"
}

const response = await provider.token.send_voice_token(payload);

console.log(response.pinId) // 29ae67c2-c8e1-4165-8a51-8d3d7c298081
```

### Make Voice Call [Documentation](https://www.developers.termii.com/voice-call)

The voice call API enables you to send messages from your application through our voice channel to a phone number

```javascript

const payload = {
  phone_number: "23490126727",
  code: 1223
}

const response = await provider.token.make_voice_call(payload);

console.log(response.pinId) // 29ae67c2-c8e1-4165-8a51-8d3d7c298081
```

### Send In App Token [Documentation](https://www.developers.termii.com/in-app-token)

This API returns OTP codes in JSON format which can be used within any web or mobile app.

```javascript

const payload = {
  phone_number: "23490126727",
  pin_length: 6
}

const response = await provider.token.send_in_app_token(payload);

console.log(response.status) // success
console.log(response.data.otp) // 522726
```

### Verify Token [Documentation](https://www.developers.termii.com/verify-token)

Verify token API, checks tokens sent to customers and returns a response confirming the status of the token.

```javascript

const payload = {
  pin_id: "pin_id",
  pin: 123456
}

const response = await provider.token.verify_token(payload);

console.log(response.verified) // True
```


## Insights [Documentation](https://www.developers.termii.com/insights)

Retrieve real-time delivery report of messages sent to customers as well as the status of their contacts

### Balance [Documentation](https://www.developers.termii.com/balance)
The Balance API returns your total balance and balance information from your wallet, such as currency.

```javascript
    
const balance = await provider.insights.balance();

console.log(balance.balance) // 19.85
```

### Search [Documentation](https://www.developers.termii.com/search)
The search API allows businesses verify phone numbers and automatically detect their status as well as current network

```javascript

const response = await provider.insights.search_phone_number("phone_number");

console.log(response.status) // DND blacklisted
```

### Status [Documentation](https://www.developers.termii.com/status)
The status API allows businesses to detect if a number is fake or has ported to a new network.

```javascript

const payload = {
  phone_number: "523353245594",
  country_code: "GH"
}
const response = await provider.insights.status_phone_number(payload);

console.log(response.result) // {@returns typeof array}
```

### History [Documentation](https://www.developers.termii.com/history)
This Inbox API returns reports for messages sent across the sms, voice & whatsapp channels.

```javascript

const inbox = await provider.insights.history();

console.log(inbox) // {@returns typeof array}
```

## Middleware

Express Middleware to handle Webhook Events

Add your webhook url in your [Termii Developer Console](https://accounts.termii.com/#/account/webhook/config)

```javascript
// using ES6 modules
import { Webhook } from '@brvhprince/termii-js'

// using CommonJS modules
const { Webhook } = require("@brvhprince/termii-js");

// Initialize

const provider = new Webhook("secret_key");

//Inbound-Message Received

provider.on("inbound", data => {
  // Act
  console.log("Here We are!");
});


//Outbound Message (Delivery Report)

provider.on("outbound", data => {
  // Act
  console.log("Here We are!");
});


//Device offline Notification

provider.on("device_status", data => {
  // Act
  console.log("Here We are!");
});


// Hooks with Express
app.post("/my/webhook/url", provider.middleware);

```

## Contributing

Please do :heart:

## Built With

* [TypeScript](https://www.typescriptlang.org/)

## Versioning

I use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/brvhprince/termii-js/tags).

## Authors

* **Prince Takyi** - *Initial work* - [Prince Takyi Akomea](https://github.com/brvprince)

See also the list of [contributors](https://github.com/brvhprince/termii-js/contributors) who participated in this project.

## License

[ISC License](LICENSE) © Prince Takyi Akomea
