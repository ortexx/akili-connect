const polyfill = require('./polyfill');

module.exports = function(dom, url, indexUrl,  _options) {
  let defaults = {
    timeout: 10000,
    onDomInit: (dom) => {}
  };

  options = Object.assign({}, defaults, _options);

  let window = dom.window;

  for(let key in polyfill) {
    polyfill[key](window);
  }

  function close() {
    let html = dom.serialize();

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
        window.document.documentElement.setAttribute('akili-server', indexUrl);
        window.Akili.deinit && window.Akili.deinit();           
        resolve(close());
      });
    });
  });
};