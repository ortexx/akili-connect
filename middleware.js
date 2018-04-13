"use strict";

const jsdom = require('jsdom');
const render = require('./render');
const crypto = require('crypto');
const urlLib = require('url');

exports.route = function (req, res, next) {
  let options = Object.assign({}, this.options.jsdomOptions, {
    resources: "usable",
    runScripts: "dangerously"
  });
  
  let host = this.options.host || req.connection.localAddress.replace(/^::1/, '127.0.0.1').replace(/^::ffff:/, '');
  let protocol = this.options.protocol || req.connection.encrypted? 'https': 'http';
  let port = this.options.port || req.connection.localPort;  
  let serverUrl = urlLib.format({ hostname: host, port: port, protocol: protocol });
  let url = this.options.indexUrl || serverUrl + '/' + crypto.randomBytes(24).toString('hex').split('').join('_-/');
  
  jsdom.JSDOM.fromURL(url, options).then(dom => {
    return render(dom, req.originalUrl, this.options).then(html => res.send(html));
  }).catch(next);
};

exports.index = function (req, res, next) {
  if(!this.options.indexFile) {
    return next(new Error('You have to set the index file path'));
  }

  res.sendFile(this.options.indexFile);
};