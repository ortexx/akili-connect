const jsdom = require('jsdom');
const render = require('./render');
const crypto = require('crypto');

exports.route = function (req, res, next) {
  let options = Object.assign({}, this.options.jsdomOptions, {
    resources: "usable",
    runScripts: "dangerously"
  });
  
  let host = this.options.host || req.hostname;
  let protocol = this.options.protocol || req.protocol;
  let port = this.options.port || req.headers.host.split(':')[1];
  let url = this.options.indexUrl || crypto.randomBytes(64).toString('hex');
  
  url = indexUrl = (protocol + '://' + host) + (port? ':' + port: '') + ('/' + url);
  
  jsdom.JSDOM.fromURL(url, options).then(dom => {
    return render(dom, req.originalUrl, url, this.options).then((html) => {
      res.send(html);
    })
  }).catch(next);
};

exports.index = function (req, res, next) {
  if(!this.options.indexFile) {
    return next(new Error('You have to set index file path'));
  }

  res.sendFile(this.options.indexFile);
};