const polyfill = require('./polyfill');

let options = {
  timeout: 10000,
  onDomInit: (dom) => {}
};

module.exports = function(dom, url, _options) {
  options = Object.assign({}, options, _options);

  let window = dom.window;
  let timeout;

  for(let key in polyfill) {
    polyfill[key](window);
  }

  return Promise.resolve(options.onDomInit(dom)).then(() => {
    url && window.history.pushState(null, '', url);

    return new Promise((resolve) => {
      if(options.timeout) {
        timeout = setTimeout(() => {
          clearTimeout(timeout);
          console.warn('Server rendering has been stopped by timeout');
          resolve(dom.serialize());
        }, options.timeout);
      }

      window.addEventListener('akili-init', () => {
        timeout && clearTimeout(timeout);
        resolve(dom.serialize());
      });
    });
  });
};