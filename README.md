# akili-connect [![npm version](https://badge.fury.io/js/akili-connect.svg)](https://badge.fury.io/js/akili-connect)
Library to implement server-side rendering for [Akili framework](https://github.com/ortexx/akili).  
It is based on [jsdom](https://github.com/tmpvar/jsdom).

## Example

```js
const akiliConnect = require('akili-connect');
const express = require('express');
const path = require('path');
const app = express();

const middleware = akiliConnect({
  indexFile: path.join(__dirname, 'public/templates/index.html')
});

app.get('/', middleware.route);
app.get('/home', middleware.route);
app.get('/docs/*', middleware.route);
app.get('*', middleware.index);

app.listen(3000, function () {
  console.log('Server run on 3000 port');
});
```

## Description

All you need is to use __route__ middleware for the necessary routing path
and __index__ middleware to get index file.

## Options

* {string} [__indexFile__] - path to index file. Required if you going to use __index__ middleware
* {string} [__indexUrl__] - index middleware url 
* {number} [__port__] - application port
* {string} [__protocol__] - application protocol
* {string} [__host__] - application host 
* {number} [__timeout__=5000] - time after which the application will be rendered in any case, 
even if it did not have time to fully load
* {Object} [__jsdomOptions__] - jsdom options 
* {function} [__onDomInit__] - called after DOM creation. 
You can change window state here before Akili application is initialized.
* {function} [__beforeSerialization__] - called before DOM serialization. 
You can get __window__ object and do anything with it last time.
* {function} [__afterSerialization__] - called after DOM serialization. 
You can get the actual html and change it last time. You have to return a new html string.

## Polyfills
You might need missing functions in jsdom or stubs for them.
You can write it yourself.

```js
const polyfill = require('akili-connect/polyfill');

polyfill.someFunction = (window) => {
  window.someFunction = () => {};
};
```

## Client side
Don't forget to initialize your Akili application on the client side!  
Server sends the part of html to replace only [the root](https://akilijs.com/docs/compilation) element content.

```javascript
document.addEventListener('DOMContentLoaded', () => {
  Akili.init(document.body).catch((err) => console.error(err));;
});
```

```javascript
if(window.AKILI_SSR) {
  // the server-side rendering
}
else {
  // the client-side rendering
}
```

