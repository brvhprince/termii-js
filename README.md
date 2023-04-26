[![npm version](https://badge.fury.io/js/angular2-expandable-list.svg)](https://badge.fury.io/js/angular2-expandable-list)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Termii NodeJs Library

> A Node client library for consuming the  [Termii API](https://www.developers.termii.com/)

## Prerequisites

You need to create a [Termii account](https://accounts.termii.com/#/register), if you don't have one already,
to get your API Key, and Secret key.


## Table of contents

- [Termii NodeJs Library](#Termii-NodeJs-Library)
    - [Prerequisites](#prerequisites)
    - [Table of contents](#table-of-contents)
    - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Usage](#usage)
        - [Serving the app](#serving-the-app)
        - [Running the tests](#running-the-tests)
        - [Building a distribution version](#building-a-distribution-version)
        - [Serving the distribution version](#serving-the-distribution-version)
    - [API](#api)
        - [useBasicFetch](#usebasicfetch)
            - [Options](#options)
        - [fetchData](#fetchdata)
    - [Contributing](#contributing)
    - [Credits](#credits)
    - [Built With](#built-with)
    - [Versioning](#versioning)
    - [Authors](#authors)
    - [License](#license)

## Getting Started

Termii-js was made for the browser, but works in any JavaScript runtime.

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)


To install and set up the library, run:

```sh
$ npm install brvhprince/termii-js
```

Or if you prefer using Yarn:

```sh
$ yarn add brvhprince/termii-js
```

## Usage

### Import and Initialize the library


```javascript
// using ES6 modules
import { Termii } from 'termii-js'

// using CommonJS modules
const Termii = require('termii-js')

// Initialize

const provider = new Termii("api_key_here", "sender_id");
```

### Set a new Sender Id

```javascript
provider.set_sender_id("new_sender_id")
```

## Resources
Products available on the API

| Name                      | Description                                                                                                                                                        |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Messaging](#messaging)   | Messaging allows you to send messages across SMS and WhatsApp Channels [Learn More](https://www.developers.termii.com/switch)                                      |
| [Token](#token)           | Generate, send and verify one-time-passwords [Learn More](https://www.developers.termii.com/token)                                                                 |
| [Insights](#insights)     | Retrieve real-time delivery report of messages sent to customers as well as the status of their contacts  [Learn More](https://www.developers.termii.com/insights) |
| [Middleware](#middleware) | Express Middleware to handle webhook requests                                                                                                                      |


### Messaging

**List Sender IDs [Documentation](https://www.developers.termii.com/sender-id)**
```javascript

// returns paginated results of 15 items per page
const senderIds = await provider.messaging.list_sender_ids();

// get page
const nextSenderIds = await provider.messaging.list_sender_ids(2); 
```

**Request a new sender Id [Documentation](https://www.developers.termii.com/sender-id)**
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
**Send Message [Documentation](https://www.developers.termii.com/messaging)**
```javascript

const payload = {
  to: "233552345567",
  sms: "Hello there, welcome to Termii"
}

const response = await provider.messaging.send(payload);

console.log(response.code) // ok 
```
**Send Bulk Message [Documentation](https://www.developers.termii.com/messaging)**
```javascript

const payload = {
  to: ["23490555546", "23423490126999","23490555546"],
  sms: "Hello there, welcome to Termii"
}

const response = await provider.messaging.send_bulk(payload);

console.log(response.code) // ok 
```

## API

### useBasicFetch

```js
useBasicFetch(url: string = '', delay: number = 0)
```

Supported options and result fields for the `useBasicFetch` hook are listed below.

#### Options

`url`

| Type | Default value |
| --- | --- |
| string | '' |



### fetchData

```js
fetchData(url: string)
```

Perform an asynchronous http request against a given url

```tsx
type Joke = {
  value: {
    id: number;
    joke: string;
  };
};

const ChuckNorrisJokes: React.FC = () => {
  const { data, fetchData, error, loading } = useBasicFetch<Joke>();
  const [jokeId, setJokeId] = useState(1);

  useEffect(() => {
    fetchData(`https://api.icndb.com/jokes/${jokeId}`);
  }, [jokeId, fetchData]);

  const handleNext = () => setJokeId(jokeId + 1);

  if (error) {
    return <p>Error</p>;
  }

  const jokeData = data && data.value;

  return (
    <div className="Comments">
      {loading && <p>Loading...</p>}
      {!loading && jokeData && (
        <div>
          <p>Joke ID: {jokeData.id}</p>
          <p>{jokeData.joke}</p>
        </div>
      )}
      {!loading && jokeData && !jokeData.joke && <p>{jokeData}</p>}
      <button disabled={loading} onClick={handleNext}>
        Next Joke
      </button>
    </div>
  );
};
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Add your changes: `git add .`
4.  Commit your changes: `git commit -am 'Add some feature'`
5.  Push to the branch: `git push origin my-new-feature`
6.  Submit a pull request :sunglasses:

## Credits

TODO: Write credits

## Built With

* Dropwizard - Bla bla bla
* Maven - Maybe
* Atom - ergaerga
* Love

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/brvhprince/termii-js/tags).

## Authors

* **John Doe** - *Initial work* - [Prince Takyi Akomea](https://github.com/brvprince)

See also the list of [contributors](https://github.com/brvhprince/termii-js/contributors) who participated in this project.

## License

[ISC License](LICENSE) © Prince Takyi Akomea
