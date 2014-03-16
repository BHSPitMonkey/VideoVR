# VideoVR Browser Extension

## Description

VideoVR is a browser extension (currently only for Chrome) allowing videos in
web pages to be displayed in a format suitable for a VR head-mounted display
(namely the Oculus Rift).

Once installed, an icon will appear in the address bar when viewing a page
containing an HTML5 video element (such as YouTube in some cases).
Clicking this icon creates a 3D environment ready for viewing through the HMD.

(Note: Fullscreen is not yet working as intended. Due to a bug, you must click 
the VR icon twice in order to properly activate fullscreen.)

## How to get it

Once stable, VideoVR will be available for free through the Chrome Web Store
(and hopefully later as a Firefox Add-on). For now, you will need to install
it manually from [chrome://extensions/](chrome://extensions/).

## Roadmap

* Correct proportions in fullscreen mode
* Capture basic input
  * Zoom controls
  * Playback controls
* 3D video support (ala VR Cinema 3D)
* Capture gamepad input
* Capture HMD sensor input using vr.js

## Libraries used

* Three.JS
* OculusRiftEffect.js (from http://github.com/troffmo5)

## License

Authors of included third-party code retain all rights to their contributions.
All other content in this repository is not yet licensed for reuse.
