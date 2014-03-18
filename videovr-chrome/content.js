var videovr = {
  started: false,
  iconClicked: function() {
    if (this.started == false) {
      // start() has not yet run
      this.start();
    }
    else {
      // start() has already been run
      // Just try to fullscreen the canvas
      if (this.canvas !== undefined)
        this.canvas.webkitRequestFullscreen();
    }
  },
  destroy: function() {
    this.canvas.parentNode.removeChild(this.canvas);
    this.started = false;
  },
  start: function () {
    if (this.started == true) {
      this.canvas.webkitRequestFullscreen();
      return;
    }
    this.started = true;
    
    // Three.js setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer();
    this.canvas = this.renderer.domElement;
    document.body.appendChild(this.canvas);
    this.canvas.style.position = "fixed";
    this.canvas.style.top = 0;
    this.canvas.style.left = 0;
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.zIndex = 2999999999;
    this.canvas.style.outline = "none";
    this.canvas.tabIndex = 1000;
    this.canvas.webkitRequestFullscreen();
    this.canvas.focus();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    // Add OculusRiftEffect
    this.effect = new THREE.OculusRiftEffect(this.renderer);
    this.effect.setSize(this.width, this.height);
    //effect.separation = 20;
    //effect.distortion = 0.1;
    //effect.fov = 110;

    document.addEventListener("webkitfullscreenchange", function () {
      if (videovr.effect !== undefined && videovr.canvas !== undefined)
        videovr.effect.setSize(window.innerWidth, window.innerHeight);
    }, false);
    
    // Grab the video element from the page
    var videos = document.getElementsByTagName('video');
    if (videos.length < 1) {
      alert("This only works on pages containing a video element.");
      return;
    }
    else if (videos.length > 1) {
      alert("This only works on pages containing only one video element.");
      return;
    }
    this.video = videos[0];

    // Set up a rectangular plane object as a screen
    var geometry = new THREE.PlaneGeometry(15, 15*(this.video.videoHeight/this.video.videoWidth));
    this.texture = new THREE.Texture(this.video);
    var material = new THREE.MeshBasicMaterial( { map: this.texture, overdraw: true, side:THREE.DoubleSide } );
    this.sceen = new THREE.Mesh( geometry, material );
    this.sceen.position.z = -10;
    this.scene.add( this.sceen );

    // Set up skybox thing
    var cubegeometry = new THREE.CubeGeometry(100, 100, 200);
    var cubematerial = new THREE.MeshBasicMaterial( { color: 0x111111, side: THREE.BackSide } );
    var cube = new THREE.Mesh( cubegeometry, cubematerial );
    this.scene.add( cube );

    // Begin rendering to canvas
    (function animloop(){
      try {
        if (videovr.canvas.height != videovr.height || videovr.canvas.width != videovr.width) {
          videovr.width = videovr.canvas.width;
          videovr.height = videovr.canvas.height;
          videovr.effect.setSize(videovr.width, videovr.height);
          videovr.camera.aspect = videovr.width / window.height;
          videovr.camera.updateProjectionMatrix();
        }
        if( videovr.video.readyState === videovr.video.HAVE_ENOUGH_DATA ){
          videovr.texture.needsUpdate = true;
        }
        videovr.effect.render(videovr.scene, videovr.camera);
        requestAnimationFrame(animloop);
      } catch (e) {
        alert("Sorry, this video isn't supported.");
        videovr.destroy();
      }
    })();
    
    // Set up keyboard capture
    this.canvas.onkeydown = function(e) {
      e = e || window.event;
      switch (e.keyCode) {
        case 38: // up arrow
          videovr.sceen.position.z += 1; // move screen closer
          if (videovr.sceen.position.z > -1)
            videovr.sceen.position.z = -1; // limit closeness
          break;
        case 40: // down arrow
          videovr.sceen.position.z -= 1; // move screen farther
          if (videovr.sceen.position.z < -99)
            videovr.sceen.position.z = -99; // limit distance
          break;
        case 32: // spacebar
          // play/pause
          if (videovr.video.paused)
            videovr.video.play();
          else
            videovr.video.pause();
          break;
        case 27: // esc
          videovr.destroy();
          break;
      }
    };

    // Listen for double click
    this.canvas.addEventListener('dblclick', function(e){ 
      e.target.webkitRequestFullscreen();
    });
  }
};

// Listen for messages from the background page
// (It actually listens for messages from anyone in the context,
// but the background page is the one that interests us)
chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  // If we've been asked to post grades...
  if (msg.action && (msg.action == "startVideoVRMode")) {
    // ...confirm we got the message and...
    response();
    // ...do what we do best: post grades !
    videovr.iconClicked();
  }
  else console.log(action);
});
