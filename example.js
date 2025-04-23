/**
 * Project: termii-js
 * File: example
 * Author: wanpeninsula
 * Author URI: https://www.pennycodes.dev
 * Created: 23/04/2025 at 1:47 pm
 *
 * Copyright (c) 2025 termii-js. All rights reserved.
 */

const { Termii }  = require('./lib/index');

const termii = new Termii("api_key", "aaa");

// set new url
console.log({
  current: termii.client.defaults.baseURL, // 'https://api.ng.termii.com/api/'
});
termii.set_base_url("https://new.nigeria.com");

console.log({
  new: termii.client.defaults.baseURL, // 'https://new.nigeria.com'
});
