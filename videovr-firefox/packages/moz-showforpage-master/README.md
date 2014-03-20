ShowForPage for Mozilla Add-on SDK
=======

The experimental `showforpage` API allows for acting on page load related events.

## Usage

    var showForPage = require('showforpage').ShowForPage,
      listeners;
    
    exports.main = function () {
      listeners = showForPage({
        onLocationChange : checkUrl,
        onPageShow : checkForStuffInHTML
      });
    };
    
    exports.onUnload = function (reason) {
      if (reason !== 'shutdown') {
        listeners.remove();
      }
    };

## Options

* **onLocationChange** - a callback that's called when the URL is changed. (optional)
* **onPageShow** - a callback that's called when the page has loaded. (optional)
* **onLink** - a callback that's called when a new link element has been added to the page. (optional)

### Option syntax: onLocationChange

Should be a function. Is called with the URL of the current page as a single argument and has the document of the page that is checked as its context.

### Option syntax: onPageShow

Same as `onLocationChange` but also includes an additional second parameter that is `true` if the background page is loaded in background and otherwise false. That second parameter is useful as it indicates that `onLocationChange` likely hasn't been called prior to `onPageShow`.

### Option syntax: onLink

Should be a function. Is called with the URL of the current page as its first argument, an object containing all link data as its second argument (rels, href and title) and includes a last parameter like `onPageShow` that indicates if the page is loaded in the background. The function is called with the link element as its context.

## How to use

Follow the Add-on SDK's documentation for [third party packages](https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/adding-menus.html).

## Other modules usable with this one

* [UrlbarButton](https://github.com/voxpelli/moz-urlbarbutton)

## In action in

* **Flattr Firefox Add-on**: [Source](https://github.com/flattr/fx-flattr-addon)

## Changelog

### 0.2.2

* Support for Firefox 29 by no longer using the tab-browser SDK module

### 0.2.1

* Support for Mozilla's Add-on SDK version 1.13b1

### 0.2.0

* New `onLink` listener that listens for new link elements that are added to the page
* No longer triggers `onPageShow` events on hash changes and tab selects - use `onLocationChange` change for that
* `onLocationChange` is now called in the context of the page document and is given a second parameter indicating whether the document has been loaded
* Triggers `onLocationChange` on active tabs on initialization

### 0.1.0

* Moved the `onLocationChange` and `onPageShow` listeners, that were called when a new page was loaded, in the [UrlbarButton](https://github.com/voxpelli/moz-urlbarbutton) module into this new module and then also removed the callbacks that were included as an argument when those listeners were called.
