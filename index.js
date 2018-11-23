"use strict";

const middleware = require('./middleware');

module.exports = function(options) {
  let defaults = {
    indexFile: '',
    indexUrl: '',
    port: 0,
    protocol: '',  
    host: '',
    jsdomOptions: {},
    onDomInit: () => {}
  };

  let context = {
    options: Object.assign({}, defaults, options)
  };

  return {
    route: middleware.route.bind(context),
    index: middleware.index.bind(context)
  }
};