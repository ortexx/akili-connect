"use strict";

const middleware = require('./middleware');

module.exports = function(_options) {
  let defaults = {
    indexFile: '',
    indexUrl: '',
    port: 0,
    protocol: '',  
    host: '',
    timeout: 5000,
    jsdomOptions: {},
    onDomInit: () => {}
  };

  let context = {
    options: Object.assign({}, defaults, _options)
  };

  return {
    route: middleware.route.bind(context),
    index: middleware.index.bind(context)
  }
};