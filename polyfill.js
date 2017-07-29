exports['Element.prototype.scrollIntoView'] = (window) => {
  if(!window.Element.prototype.scrollIntoView) {
    window.Element.prototype.scrollIntoView = () => {};
  }  
};