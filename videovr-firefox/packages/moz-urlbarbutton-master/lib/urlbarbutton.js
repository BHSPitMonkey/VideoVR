/*global require: false, exports: false */
/*jslint forin: true, indent: 2 */

var winUtils = require("sdk/deprecated/window-utils"),
  tabs = require('sdk/tabs'),
  UrlbarButton;

UrlbarButton = function (options) {
  "use strict";

  if (!options || !options.id) {
    return;
  }

  var windowTracker,
    // Methods used internally
    getContentDocument,
    // Methods exposed externally
    getButtons,
    setOptions,
    setImage,
    setTooltip,
    setVisibility,
    getVisibility,
    remove,
    clickEvent;

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

  getButtons = function (href) {
    var button, window,
      elements = [];

    if (typeof href === 'object') {;
      return [href];
    }

    for (window in winUtils.browserWindowIterator()) {
      if (!href || (window.gBrowser && href === getContentDocument(window).location.href)) {
        button = window.document.getElementById(options.id);
        if (button) {
          elements.push(button);
        }
      }
    }

    return elements;
  };

  setOptions = function (options, href) {
    var newClickEvent;

    if (options.onClick) {
      newClickEvent = function (event) {
        var doc = getContentDocument(event.originalTarget);
        options.onClick.call(doc, doc.location.href, event);
      };
    } else if (options.gotoUrl) {
      newClickEvent = function (event) {
        if (event.type !== "click" || event.button !== 0) {
          return;
        }
        tabs.open(options.gotoUrl);
      };
    }

    getButtons(href).forEach(function (button) {
      if (options.tooltip) {
        button.setAttribute("tooltiptext", options.tooltip);
      }
      if (options.image) {
        button.setAttribute("src", options.image);
      }
      if (options.show) {
        button.collapsed = false;
      } else if (options.hide) {
        button.collapsed = true;
      }
      if (clickEvent && newClickEvent) {
        button.removeEventListener("click", clickEvent);
      }
      if (newClickEvent) {
        button.addEventListener("click", newClickEvent);
      }
    });

    if (newClickEvent) {
      clickEvent = newClickEvent;
    }
  };

  setImage = function (src, href) {
    getButtons(href).forEach(function (button) {
      button.src = src;
    });
  };

  setVisibility = function (show, href) {
    getButtons(href).forEach(function (button) {
      button.collapsed = !show;
    });
  };

  getVisibility = function (href) {
    var shown;

    getButtons(href).forEach(function (button) {
      shown = (shown || !button.collapsed) ? true : false;
    });

    return shown;
  };

  remove = function () {
    windowTracker.unload();
  };

  windowTracker = new winUtils.WindowTracker({
    onTrack: function (window) {
      var button, urlbarIcons;

      urlbarIcons = window.document.getElementById("urlbar-icons");

      if (urlbarIcons && winUtils.isBrowser(window)) {
        button = window.document.getElementById(options.id);

        if (button) {
          button.parentNode.removeChild(button);
        }

        button = window.document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "image");

        button.id = options.id;
        button.className = "urlbar-icon";
        button.collapsed = true;

        setOptions(options, button);

        urlbarIcons.insertBefore(button, urlbarIcons.firstChild);
      }
    },
    onUntrack: function (window) {
      var button = window.document.getElementById(options.id);

      if (button) {
        button.parentNode.removeChild(button);
      }
    }
  });

  return {
    getButtons : getButtons,
    setImage : setImage,
    setOptions : setOptions,
    setVisibility : setVisibility,
    getVisibility : getVisibility,
    remove : remove
  };
};

exports.UrlbarButton = UrlbarButton;
