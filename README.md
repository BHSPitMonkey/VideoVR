# VideoVR Browser Extension

## ⚠️ Deprecation Notice ⚠️

### This extension is unsupported and no longer being developed.

This software was developed before modern standards like WebVR/WebXR existed;
The approaches used in this extension are no longer necessary today.

Instead, consider using a VR-ready web browser such as 
[Firefox](https://www.mozilla.org/firefox/) for PC) or 
[Firefox Reality](https://mixedreality.mozilla.org/firefox-reality) (for 
standalone VR devices).

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

You can get VideoVR from the Chrome Web Store here:
https://chrome.google.com/webstore/detail/llboikkjbdkhngdjpmgaflalnplfilgl

(Hopefully there will be a Firefox version ready in the near future as well.)

You can also install the most recent version of the code into Chrome by loading
the extension manually:

* Download and extract a copy of this repository (
  [ZIP download](https://github.com/BHSPitMonkey/VideoVR/archive/master.zip))
* Visit [chrome://extensions/](chrome://extensions/)
* Ensure that the "Developer mode" checkbox is checked
* Click **Load unpacked extension...**
* Browse to the **videovr-chrome** directory
* Click **Open** (or **OK** or **Done**)

## Controls

The following controls are supported in the viewer:

|                    | Keyboard | Mouse        | Gamepad |
| ------------------ | -------- | ------------ | ------- |
| **Zoom in**        | Up       | Scroll up    |         |
| **Zoom out**       | Down     | Scroll down  |         |
| **Play/Pause**     | Space    |              |         |
| **Fullscreen**     |          | Double click |         |
| **Toggle 3D mode** | M        |              |         |

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
* ~~3D video support (ala VR Cinema 3D)~~ (Now supporting side-by-side 3D videos via 'M' key)
* Capture gamepad input
* Capture HMD sensor input using vr.js

## Libraries used

* Three.JS
* OculusRiftEffect.js (from http://github.com/troffmo5, slightly modified)

## License

Authors of included third-party code retain all rights to their contributions.
(Both Three.JS and OculusRiftEffect.js were licensed by their original authors
under the terms of the MIT License.)

All other software in this repository is provided under the MIT License.
Please see LICENSE for the full license text.
