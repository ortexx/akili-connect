const polyfill = require('./polyfill');

module.exports = function(dom, url, _options) {
  const defaults = {
    onDomInit: dom => {}
  };

  const options = Object.assign({}, defaults, _options);
  const window = dom.window;
  window.AKILI_SSR = true;
  
  for(let key in polyfill) {
    polyfill[key](window);
  }

  function close() {
    if(window.AKILI_CLIENT && window.Akili && window.Akili.__root) {
      const serverData = JSON.stringify(window.AKILI_CLIENT);
      window.Akili.__root.innerHTML += `\n<script>window.AKILI_SERVER=${serverData}</script>\n`;
    }
    
    options.beforeSerialization && options.beforeSerialization(window);
    const html = dom.serialize();
    options.afterSerialization && (html = options.afterSerialization(html));
    window.Akili && window.Akili.destroy(); 
    window.close();
    return html;
  }
  
  return Promise.resolve(options.onDomInit(dom)).then(() => {
    url && window.history.pushState(null, '', url);

    return new Promise(resolve => {
      window.addEventListener('akili-init', () => resolve(close()));
    });
  });
};