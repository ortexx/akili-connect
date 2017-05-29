const polyfill = require('./polyfill');

let options = {
  timeout: 10000,
  onDomInit: (dom) => {}
};

module.exports = function(dom, url, _options) {
  options = Object.assign({}, options, _options);

  let start = new Date().getTime();
  let window = dom.window;

  for(let key in polyfill) {
    polyfill[key](window);
  }

  return Promise.resolve(options.onDomInit(dom)).then(() => {
    url && window.history.pushState(null, '', url);

    return new Promise((resolve) => {
      let interval = setInterval(() => {
        let isDone = false;

        if(options.timeout && new Date().getTime() - start > options.timeout) {
          console.warn('Server rendering has been stopped by timeout');
          isDone = true;
        }

        if(window.Akili && window.Akili.__init) {
          isDone = true;
        }

        if(isDone) {
          clearInterval(interval);
          resolve(dom.serialize());
        }
      }, 1);
    });
  });
};