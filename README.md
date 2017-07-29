# akili-connect [![npm version](https://badge.fury.io/js/akili-connect.svg)](https://badge.fury.io/js/akili-connect)
Library to implement server rendering for [Akili framework](https://github.com/ortexx/akili).  
It is based on [jsdom](https://github.com/tmpvar/jsdom).

## Example

```js
const akiliConnect = require('akili-connect');
const express = require('express');
const path = require('path');

const app = express();

let middleware = akiliConnect({
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

* {string} __indexFile__ - path to index file
* {string} [__indexUrl__] - index middleware url (if you want to change __*__ to something special)
* {number} [__port__] - the application port, by default it will be set automatically
* {string} [__protocol__] - the application port, by default it will be set automatically 
* {string} [__host__] - the application host, by default it will be set automatically 
* {number} [__timeout__=10000] - The time after which the application will be rendered in any case, 
even if it did not have time to fully load
* {Object} [__jsdomOptions__] - jsdom options 
* {function} [__onDomInit__] - the function which will be called after dom creation. 
You can change window state here before Akili application will be initialized.

## Polyfills
You might need missing functions in jsdom or stubs for them.
You can write it yourself.

```js
const polyfill = require('akili-connect/polyfill');

polyfill.someFunction = ((window) => {
  window.someFunction = () => {};
});
```

## Client side
Don't forget to initialize your Akili application on the client side!

```javascript
document.addEventListener('DOMContentLoaded', () => {
  Akili.init();
});
```
