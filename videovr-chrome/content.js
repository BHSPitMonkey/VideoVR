var videovr = {
  MODE_3D_NONE: 0,
  MODE_3D_HORIZONTAL: 1,
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
  zoom: function(val) {
    if (val == 1) { // Zoom in
      this.sceen.position.z += 1; // Move screen closer
      if (this.sceen.position.z > -1)
        this.sceen.position.z = -1; // Limit closeness
    }    
    else if (val == -1) { // Zoom out
      this.sceen.position.z -= 1; // Move screen farther
      if (this.sceen.position.z < -99)
        this.sceen.position.z = -99; // Limit distance
    }
  },
  start: function() {
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
    
    // Set initial 3D mode
    this.mode3d = videovr.MODE_3D_NONE;
    var yttitles = document.getElementsByClassName('ytp-menu-title');
    for (var i=0; i<yttitles.length; i++) {
      if (yttitles[i].innerText == "3D") {
        this.mode3d = videovr.MODE_3D_HORIZONTAL;
        break;
      }
    }
    //effect.separation = 20;
    //effect.distortion = 0.1;
    //effect.fov = 110;
    
    // Define mappings for 3D modes
    this.mappings_3d_none = [
      [new THREE.Vector2(0, 1), new THREE.Vector2(0, 0), new THREE.Vector2(1, 1)],
      [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)]
    ];
    this.mappings_3d_horizontal_left = [
      [new THREE.Vector2(0, 1), new THREE.Vector2(0, 0), new THREE.Vector2(0.5, 1)],
      [new THREE.Vector2(0, 0), new THREE.Vector2(0.5, 0), new THREE.Vector2(0.5, 1)]
    ];
    this.mappings_3d_horizontal_right = [
      [new THREE.Vector2(0.5, 1), new THREE.Vector2(0.5, 0), new THREE.Vector2(1, 1)],
      [new THREE.Vector2(0.5, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)]
    ];

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
    this.geometry = new THREE.PlaneGeometry(15, 15*(this.video.videoHeight/this.video.videoWidth));
    this.texture = new THREE.Texture(this.video);
    var material = new THREE.MeshBasicMaterial( { map: this.texture, overdraw: true, side:THREE.FrontSide } );
    this.sceen = new THREE.Mesh( this.geometry, material );
    this.sceen.position.z = -10;
    this.scene.add( this.sceen );
    
    console.log(this.geometry.faceVertexUvs[0]);

    // Set up skybox thing
    var cubegeometry = new THREE.CubeGeometry(100, 100, 200);
    var cubematerial = new THREE.MeshBasicMaterial( { color: 0x111111, side: THREE.BackSide } );
    var cube = new THREE.Mesh( cubegeometry, cubematerial );
    this.scene.add( cube );

    // Begin rendering to canvas
    (function animloop(){
      try {
        // Detect changes in canvas size and adjust as necessary
        if (videovr.canvas.height != videovr.height || videovr.canvas.width != videovr.width) {
          videovr.width = videovr.canvas.width;
          videovr.height = videovr.canvas.height;
          videovr.effect.setSize(videovr.width, videovr.height);
          videovr.camera.aspect = videovr.width / window.height;
          videovr.camera.updateProjectionMatrix();
        }
        // Tell the texture to re-read from the video
        if( videovr.video.readyState === videovr.video.HAVE_ENOUGH_DATA ){
          videovr.texture.needsUpdate = true;
        }
        // Render the scene
        if (videovr.mode3d == videovr.MODE_3D_NONE) {
          videovr.geometry.faceVertexUvs[0] = videovr.mappings_3d_none
          videovr.geometry.uvsNeedUpdate = true;
        }
        videovr.effect.render(videovr.scene, videovr.camera, function() {
          if (videovr.mode3d == videovr.MODE_3D_HORIZONTAL) {
            videovr.geometry.faceVertexUvs[0] = videovr.mappings_3d_horizontal_left;
            videovr.geometry.uvsNeedUpdate = true;
          }
        }, function() {
          if (videovr.mode3d == videovr.MODE_3D_HORIZONTAL) {
            videovr.geometry.faceVertexUvs[0] = videovr.mappings_3d_horizontal_right;
            videovr.geometry.uvsNeedUpdate = true;
          }
        });
        requestAnimationFrame(animloop);
      } catch (e) {
        alert("Sorry, this video isn't supported.");
        console.log(e);
        videovr.destroy();
      }
    })();
    
    // Set up keyboard capture
    this.canvas.onkeydown = function(e) {
      e = e || window.event;
      switch (e.keyCode) {
        case 38: // up arrow
          videovr.zoom(1);
          break;
        case 40: // down arrow
          videovr.zoom(-1);
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
        case 77: // M
          videovr.mode3d = (videovr.mode3d + 1) % 2;
          break;
      }
    };

    // Listen for double click
    this.canvas.addEventListener('dblclick', function(e){ 
      e.target.webkitRequestFullscreen();
    });
    
    // Listen for mouse wheel
    this.canvas.addEventListener('mousewheel',function(e){
      var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
      videovr.zoom(delta);
      return false;
    }, false);


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
