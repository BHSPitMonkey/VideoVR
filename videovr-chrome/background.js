// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Update the declarative rules on install or upgrade.
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        // When a page contains a <video> tag...
        new chrome.declarativeContent.PageStateMatcher({
          css: ["video"]
        })
      ],
      // ... show the page action.
      actions: [new chrome.declarativeContent.ShowPageAction() ]
    }]);
  });
});

// Do this when the pageAction icon is clicked
chrome.pageAction.onClicked.addListener(function(tab) {
    console.log("Calling content_script...");
    chrome.tabs.sendMessage(tab.id, { action: "startVideoVRMode" }, function() {
        console.log("Callback fired");
        if (chrome.runtime.lastError) {
            console.log("There was error?");
            // The error indicates that the content script
            // has not been injected yet. Inject it and...
            console.log("Injecting content script");
            chrome.tabs.executeScript(tab.id, {
                file: "lib/three.js"
            }, function() {
                chrome.tabs.executeScript(tab.id, {
                    file: "lib/OculusRiftEffect.js"
                }, function() {
                    chrome.tabs.executeScript(tab.id, {
                        file: "content.js"
                    }, function() {
                      if (!chrome.runtime.lastError) {
                          // ...if injected successfully, send the message anew
                          onPageActionClicked(tab);
                      }
                      else {
                        console.log("Another error?");
                      }
                    });
                });
            });
        } else {
            // The content script called our response callback,
            // confirming that it is there and got our message
            console.log("Message got through !");
            
            // Try to fullscreen the element from here...
            chrome.tabs.executeScript(tab.id, {
              code: "videovr.renderer.domElement.webkitRequestFullscreen();"
            });
        }
    });
});
