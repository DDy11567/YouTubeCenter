Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

var DESCRIPTION = "YouTube Center Startup Service";
var CONTRACTID = "@ytcenter/ytcenter-startup-service;1";
var CLASSID = Components.ID("{338b51a4-0709-4971-ac89-18e82be90a93}");

var {getChromeWinForContentWin} = require("getChromeWinForContentWin");

var startupRun = false;

var filename = "resource://ytcenter/data/YouTubeCenter.js";

// Bug 1051238, https://bugzilla.mozilla.org/show_bug.cgi?id=1051238
var frameScriptURL = "resource://ytcenter/libs/framescript.js?" + Math.random();

var whitelist = [ /^http(s)?:\/\/(www\.)?youtube\.com\//, /^http(s)?:\/\/((apis\.google\.com)|(plus\.googleapis\.com))\/([0-9a-zA-Z-_\/]+)\/widget\/render\/comments\?/ ];
var blacklist = [ ];

var file = null;

function loadFile(scriptName) {
  let request = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Ci.nsIXMLHttpRequest);
  request.open("GET", scriptName, true);
  request.overrideMimeType("text/plain");
  request.send(null);
<<<<<<< HEAD
  
=======

>>>>>>> master
  return request.responseText;
}

function shimFileAccess(detail) {
  var fileaccess = require("fileaccess");
<<<<<<< HEAD
  
  var data = detail.data;
  
  var method = data.method;
  var args = data.args;
  
=======

  var data = detail.data;

  var method = data.method;
  var args = data.args;

>>>>>>> master
  return fileaccess[method].apply(null, args);
}

function startup(aService) {
  if (startupRun) return;
  startupRun = true;
<<<<<<< HEAD
  
  var messageManager = Cc["@mozilla.org/globalmessagemanager;1"].getService(Ci.nsIMessageListenerManager);
  messageManager.addMessageListener("fileaccess-shim", shimFileAccess);
  messageManager.loadFrameScript(frameScriptURL, true);
  
=======

  var messageManager = Cc["@mozilla.org/globalmessagemanager;1"].getService(Ci.nsIMessageListenerManager);
  messageManager.addMessageListener("fileaccess-shim", shimFileAccess);
  messageManager.loadFrameScript(frameScriptURL, true);

>>>>>>> master
  unload(function(){
    messageManager.removeMessageListener("fileaccess-shim", shimFileAccess);
  });
}

function elementInserted(aService, doc, win) {
  // Check if chrome win is available
  let chromeWindow = getChromeWinForContentWin(win);
  if (chromeWindow) {
    if (!doc || !win || !doc.location) return;
<<<<<<< HEAD
    
    var {loadScript} = require("sandbox");
    file = file || loadFile(filename);
    
=======

    var {loadScript} = require("sandbox");
    file = file || loadFile(filename);

>>>>>>> master
    try {
      this.window.QueryInterface(Ci.nsIDOMChromeWindow);
      // Never ever inject scripts into a chrome context window.
      return;
    } catch(e) {
      // Ignore, it's good if we can't QI to a chrome window.
    }

    var url = doc.location.href;
    loadScript(whitelist, blacklist, filename, file, win, url);
  } else {
    // e10s
    startup(aService);
  }
}

function StartupService() {
  unload(this.unload.bind(this));
}

StartupService.prototype.init = function(){
  let registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
  registrar.registerFactory(this.classID, this.classDescription, this.contractID, this);
<<<<<<< HEAD
  
  let catMan = Cc['@mozilla.org/categorymanager;1'].getService(Ci.nsICategoryManager);
  for each (let category in this.xpcom_categories)
    catMan.addCategoryEntry(category, this.contractID, this.contractID, false, true);
  
  
=======

  let catMan = Cc['@mozilla.org/categorymanager;1'].getService(Ci.nsICategoryManager);
  for each (let category in this.xpcom_categories)
    catMan.addCategoryEntry(category, this.contractID, this.contractID, false, true);


>>>>>>> master
  var observerService = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);

  observerService.addObserver(this, "document-element-inserted", true);
  observerService.addObserver(this, "xpcom-category-entry-removed", true);
  observerService.addObserver(this, "xpcom-category-cleared", true);
};
StartupService.prototype.unload = function(){
  let registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
  Services.tm.currentThread.dispatch(function(){
    registrar.unregisterFactory(this.classID, this);
  }.bind(this), Ci.nsIEventTarget.DISPATCH_NORMAL);
<<<<<<< HEAD
  
  try {
    var observerService = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);
    
=======

  try {
    var observerService = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);

>>>>>>> master
    observerService.removeObserver(this, "document-element-inserted");
    observerService.removeObserver(this, "xpcom-category-entry-removed");
    observerService.removeObserver(this, "xpcom-category-cleared");
  } catch (e) {
    Cu.reportError(e);
  }

  let catMan = Cc["@mozilla.org/categorymanager;1"].getService(Ci.nsICategoryManager);
  for each (let category in this.xpcom_categories)
    catMan.deleteCategoryEntry(category, this.contractID, false);
};

StartupService.prototype.classDescription = DESCRIPTION;
StartupService.prototype.classID = CLASSID;
StartupService.prototype.contractID = CONTRACTID;
StartupService.prototype.QueryInterface = XPCOMUtils.generateQI([
  Ci.nsIObserver,
  Ci.nsISupports,
  Ci.nsISupportsWeakReference,
  Ci.nsIWindowMediatorListener,
  Ci.nsIContentPolicy
]);
StartupService.prototype.xpcom_categories = ["content-policy"];
StartupService.prototype.shouldLoad = function(contentType, contentLocation, requestOrigin, node, mimeTypeGuess, extra) {
  return Ci.nsIContentPolicy.ACCEPT;
};
StartupService.prototype.shouldProcess = function(contentType, contentLocation, requestOrigin, insecNode, mimeType, extra) {
  return Ci.nsIContentPolicy.ACCEPT;
};

StartupService.prototype.observe = function(subject, topic, data, additional) {
  try {
    switch (topic) {
      case "document-element-inserted":
        let doc = subject;
        let win = doc && doc.defaultView;
<<<<<<< HEAD
        
=======

>>>>>>> master
        elementInserted(this, doc, win);
        break;
      case "xpcom-category-entry-removed":
      case "xpcom-category-cleared": {
        let category = data;
        if (this.xpcom_categories.indexOf(category) < 0)
          return;
        if (topic == "xpcom-category-entry-removed" && subject instanceof Ci.nsISupportsCString && subject.data != this.contractID)
          return;
        let catMan = Cc["@mozilla.org/categorymanager;1"].getService(Ci.nsICategoryManager);
        catMan.addCategoryEntry(category, this.contractID, this.contractID, false, true);
        break;
      }
    }
  } catch (e) {
    Cu.reportError(e);
  }
};
StartupService.prototype.createInstance = function(outer, id) {
  if (outer)
    throw Cr.NS_ERROR_NO_AGGREGATION;
  return this.QueryInterface(id);
};

exports["StartupService"] = StartupService;
<<<<<<< HEAD
exports["startup"] = startup;
=======
exports["startup"] = startup;
>>>>>>> master
