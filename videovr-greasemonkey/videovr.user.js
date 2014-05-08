// ==UserScript==
// @name          VideoVR
// @namespace     https://github.com/BHSPitMonkey/VideoVR
// @description	  Turn videos into 3D virtual reality movie screens!
// @resource      ThreeJS https://cdn.jsdelivr.net/threejs/r62/three.min.js
// @resource      VRTheater https://raw.githubusercontent.com/BHSPitMonkey/VRTheater.js/master/vrtheater.js
// @grant         GM_getResourceText
// @grant         GM_registerMenuCommand
// ==/UserScript==

console.log("VideoVR userscript is running!");
//contentEval(GM_getResourceText("ThreeJS"));
//console.log(THREE);
var videos = document.getElementsByTagName("video");

if (videos.length == 0) {
    console.log("VideoVR found no video elements on the page.");
}
else {
    console.log("VideoVR found at least one video it can work with.");
    GM_registerMenuCommand("Start VR Mode", startVR, "s");

    // http://wiki.greasespot.net/Content_Script_Injection
    function contentEval(source) {
        // Create a script node holding this  source code.
        var script = document.createElement('script');
        script.setAttribute("type", "application/javascript");
        script.textContent = source;

        // Insert the script node into the page, so it will run, and immediately
        // remove it to clean up.
        document.body.appendChild(script);
        document.body.removeChild(script);
    }
}

function startVR() {
    console.log("Starting VR...");

    // Load THREE.js if it's not already present
    if (typeof THREE == "undefined") {
        console.log("Need to load THREE.js");
        contentEval(GM_getResourceText("ThreeJS"));
    }
    else {
        console.log("THREE already present");
    }
    console.log(THREE);

    // Load VRTheater.js if it's not already present
    if (typeof VRTheater == "undefined") {
        console.log("Need to load VRTheater");
        contentEval(GM_getResourceText("VRTheater"));
    }
    else {
        console.log("VRTheater already present");
    }
    console.log(VRTheater);
}
