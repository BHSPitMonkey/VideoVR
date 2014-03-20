The experimental `showforpage` API allows for acting on page load related events.

## Example ##

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

<api name="ShowForPage">
@class

Module exports `ShowForPage` constructor allowing users to add methods that are called when a new page is loaded.

<api name="ShowForPage">
@constructor
Creates a object that adds all of the listeners.

@param options {Object}
  Options for the listeners, with the following parameters:

@prop [onLocationChange] {Function}
  A callback called when the location is changed in the location bar. Is called with the page document as its context and the URL of the page as its first parameter and whether the DOM is ready or not as its second parameter.

@prop [onPageShow] {Function}
  Same as `onLocationChange`, but instead called when the page is loaded. Its second parameter indicates whether the page is loaded outside of the active tab or not. This second parameter is useful as `onLocationChange` isn't called on those pages and one might want to be proactive in checking them.

@prop [onLink] {Function}
   A callback called when a new link element is added to the page. Is called with the URL of the current page as its first argument, an object containing all link data as its second argument (rels, href and title) and like `onPageShow` includes a last parameter that indicates if the page is loaded in the background or not. The function is called with the link element as its context.
</api>

<api name="remove">
@method
Removes the listeners from the browser, should eg. be used when a restartless add-on is disabled or uninstalled.
</api>
</api>
