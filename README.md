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
it manually:

* Download and extract a copy of this repository (
  [ZIP download](https://github.com/BHSPitMonkey/VideoVR/archive/master.zip))
* Visit [chrome://extensions/](chrome://extensions/)
* Ensure that the "Developer mode" checkbox is checked
* Click **Load unpacked extension...**
* Browse to the **videovr-chrome** directory
* Click **Open** (or **OK** or **Done**)

## Controls

The following controls are supported in the viewer:

* **Zoom in**: Up arrow key
* **Zoom out**: Down arrow key
* **Play/Pause**: Spacebar

## Limitations

VideoVR currently will not work with videos on pages where cross-domain 
security rules apply (for instance, Vimeo.com). This is because we are not 
allowed to access the video as a WebGL texture when this is the case.

YouTube and directly-visited video file URLs both appear to be unaffected.

## Roadmap

* ~~Correct proportions in fullscreen mode~~
* ~~Capture basic input~~
  * ~~Zoom controls~~ (Now supported via up/down arrows)
  * ~~Playback controls~~ (Now supported via spacebar to play/pause)
* 3D video support (ala VR Cinema 3D)
* Capture gamepad input
* Capture HMD sensor input using vr.js

## Libraries used

* Three.JS
* OculusRiftEffect.js (from http://github.com/troffmo5, slightly modified)

## License

Authors of included third-party code retain all rights to their contributions.
All other content in this repository is not yet licensed for reuse.
