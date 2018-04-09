"use strict";

const df = require('jsdom/lib/jsdom/browser/documentfeatures');
const applyDocumentFeatures = df.applyDocumentFeatures;

df.applyDocumentFeatures = function(documentImpl, features = {}) {
  if(Array.isArray(features.FetchExternalResources)) {
    features.FetchExternalResources = features.FetchExternalResources.filter(item => {
      return ['link', 'iframe', 'frame'].indexOf(item) == -1;
    });
  }

  return applyDocumentFeatures.apply(this, arguments);
};