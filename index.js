"use strict";

require('./pre');

const path = require('path');
const middleware = require('./middleware');

let options = {
  indexFile: '',
  indexUrl: '',
  port: 0,
  protocol: '',  
  host: '',
  timeout: 10000,
  jsdomOptions: {},
  onDomInit: (dom) => {}
};

module.exports = function(_options) {
  Object.assign(options, _options);

  let context = {
    options: options
  };

  return {
    route: middleware.route.bind(context),
    index: middleware.index.bind(context)
  }
};

