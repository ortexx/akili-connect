"use strict";

const polyfill = require('./polyfill');

module.exports = function(dom, url, _options) {
  const defaults = {
    timeout: 5000,
    onDomInit: dom => {}
  };

  let options = Object.assign({}, defaults, _options);
  let window = dom.window;

  for(let key in polyfill) {
    polyfill[key](window);
  }

  function close() {
    options.beforeSerialization && options.beforeSerialization(window);
    window.Akili && window.Akili.clearGlobals && window.Akili.clearGlobals();    
    const html = dom.serialize();
    options.afterSerialization && (html = options.afterSerialization(html));
    window.close();
    global.gc && global.gc();
    return html;
  }
  
  return Promise.resolve(options.onDomInit(dom)).then(() => {    
    url && window.history.pushState(null, '', url);

    return new Promise((resolve) => {
      let timeout;

      if(options.timeout) {
        timeout = setTimeout(() => {
          clearTimeout(timeout);
          console.warn('Server rendering has been stopped by timeout');
          resolve(close());
        }, options.timeout);
      }

      window.addEventListener('akili-init', () => {        
        timeout && clearTimeout(timeout);
        const serverData = JSON.stringify(window.AKILI_CLIENT);
        window.Akili.__root.innerHTML += `\n<script>window.AKILI_SERVER=${serverData}</script>\n`;
        resolve(close());
      });
    });
  });
};