/*global require: false, exports: false */
/*jslint indent: 2 */

var Ci = require("chrome").Ci,
  Cr = require("chrome").Cr,
  winUtils = require("sdk/deprecated/window-utils"),
  winUtilsNew = require("sdk/window/utils"),
  tabsUtils = require("sdk/tabs/utils"),
  ShowForPage;

ShowForPage = function (options) {
  "use strict";

  if (!options) {
    return;
  }

  var windowTracker, tabTracker,
    // Methods used internally
    getContentDocument, activeTab, windowPageShowEvent, windowLinkEvent, tabProgressListener,
    // Methods exposed externally
    remove;

  getContentDocument = function (windowElement) {
    var doc, pageWindow, pageTabBrowser;

    if (windowElement.gBrowser) {
      pageWindow = windowElement;
    } else {
      pageWindow = windowElement.ownerDocument.defaultView;
    }

    if (windowElement.tagName === 'tab') {
      pageTabBrowser = pageWindow.gBrowser.getBrowserForTab(windowElement);
      doc = pageTabBrowser.contentDocument;
    } else {
      doc = pageWindow.gBrowser.contentDocument;
    }

    return doc;
  };

  remove = function () {
    if (tabTracker) {
      tabTracker.unload();
    }
    if (windowTracker) {
      windowTracker.unload();
    }
  };

  activeTab = function () {
    return tabsUtils.getSelectedTab(winUtilsNew.getMostRecentBrowserWindow());
  };

  windowPageShowEvent = function (event) {
    var doc = event.originalTarget,
      href = doc.location.href;

    if (doc.defaultView.frameElement || href.indexOf('http') !== 0) {
      return;
    }

    options.onPageShow.call(doc, href, getContentDocument(activeTab()).location.href !== href);
  };

  windowLinkEvent = function (event) {
    var link = event.originalTarget,
      doc = link.ownerDocument,
      rel = link.rel && link.rel.toLowerCase(),
      href = doc.location.href,
      i,
      length,
      relStrings,
      rels,
      inBackground;

    if (!link || !doc || !rel || !link.href || doc.defaultView.frameElement || href.indexOf('http') !== 0) {
      return;
    }

    relStrings = rel.split(/\s+/);
    rels = {};
    for (i = 0, length = relStrings.length; i < length; i += 1) {
      rels[relStrings[i]] = true;
    }

    inBackground = (getContentDocument(activeTab()).location.href !== href);

    options.onLink.call(link, href, { rels : rels, href: link.href, title: link.title }, inBackground);
  };

  tabProgressListener = {
    QueryInterface: function (aIID) {
      if (aIID.equals(Ci.nsIWebProgressListener) || aIID.equals(Ci.nsISupportsWeakReference) || aIID.equals(Ci.nsISupports)) {
        return this;
      }
      throw Cr.NS_NOINTERFACE;
    },
    onLocationChange: function (aProgress, aRequest, aURI) {
      var doc = aProgress.DOMWindow.document,
        domReady = (doc.readyState === 'complete' || doc.readyState === 'interactive');

      options.onLocationChange.call(doc, aURI.spec, domReady);
    }
  };

  if (options.onLocationChange || options.onPageShow || options.onLink) {
    windowTracker = new winUtils.WindowTracker({
      onTrack: function (window) {
        var appcontent = window.document.getElementById("appcontent");

        if (!winUtilsNew.isBrowser(window)) {
          return;
        }

        if (options.onLocationChange || options.onPageShow) {
          Array.prototype.forEach.call(window.document.querySelectorAll("tabbrowser"), function (tabbrowser) {
            var doc, domReady;

            if (options.onLocationChange) {
              tabbrowser.addProgressListener(tabProgressListener);

              doc = tabbrowser.contentDocument;
              domReady = (doc.readyState === 'complete' || doc.readyState === 'interactive');

              options.onLocationChange.call(doc, doc.location.href, domReady);
            }
          });
        }
        if (options.onPageShow) {
          appcontent.addEventListener('pageshow', windowPageShowEvent, true);
        }
        if (options.onLink) {
          appcontent.addEventListener('DOMLinkAdded', windowLinkEvent);
        }
      },
      onUntrack: function (window) {
        var appcontent = window.document.getElementById("appcontent");

        if (!winUtilsNew.isBrowser(window)) {
          return;
        }

        if (options.onLocationChange) {
          Array.prototype.forEach.call(window.document.querySelectorAll("tabbrowser"), function (tabbrowser) {
            tabbrowser.removeProgressListener(tabProgressListener);
          });
        }
        if (options.onPageShow) {
          appcontent.removeEventListener('pageshow', windowPageShowEvent, true);
        }
        if (options.onLink) {
          appcontent.removeEventListener('DOMLinkAdded', windowLinkEvent);
        }
      }
    });
  }

  return {
    remove : remove
  };
};

exports.ShowForPage = ShowForPage;
