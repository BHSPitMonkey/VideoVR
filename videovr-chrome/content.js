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
  start: function () {
    if (this.started == true)
      return;
    // Three.js setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 10;
    this.renderer = new THREE.WebGLRenderer();
    this.canvas = this.renderer.domElement;
    document.body.appendChild(this.canvas);
    this.canvas.style.position = "fixed";
    this.canvas.style.top = 0;
    this.canvas.style.left = 0;
    this.canvas.style.zIndex = 2999999999;
    this.canvas.style.outline = "none";
    this.canvas.tabIndex = 1000;
    this.canvas.webkitRequestFullscreen();
    
    // Add OculusRiftEffect
    this.effect = new THREE.OculusRiftEffect(this.renderer);
    this.effect.setSize( window.innerWidth, window.innerHeight );
    //effect.separation = 20;
    //effect.distortion = 0.1;
    //effect.fov = 110;

    document.addEventListener("webkitfullscreenchange", function () {
      console.log("fullscreenchange");
      console.log(videovr.canvas.height);
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
    
    // Set up a rectangular plane object
    var geometry = new THREE.PlaneGeometry(16, 9);
    this.texture = new THREE.Texture(this.video);
    var material = new THREE.MeshBasicMaterial( { map: this.texture, overdraw: true, side:THREE.DoubleSide } );
    //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var plane = new THREE.Mesh( geometry, material );
    this.scene.add( plane );
    
    // Set up skybox thing
    var cubegeometry = new THREE.CubeGeometry(50, 50, 50);
    var cubematerial = new THREE.MeshBasicMaterial( { color: 0x111111, side: THREE.BackSide } );
    var cube = new THREE.Mesh( cubegeometry, cubematerial );
    this.scene.add( cube );

    // Begin rendering to canvas
    (function animloop(){
      requestAnimationFrame(animloop);
      if( videovr.video.readyState === videovr.video.HAVE_ENOUGH_DATA ){
        videovr.texture.needsUpdate = true;
      }
      videovr.effect.render(videovr.scene, videovr.camera);
    })();
    
    // Set up keyboard capture
    this.canvas.onkeydown = function(e) {
      e = e || window.event;
      switch (e.keyCode) {
        case 38: // up arrow
          videovr.camera.position.z -= 1; // move in
          break;
        case 40: // down arrow
          videovr.camera.position.z += 1; // move out
          break;
        case 32: // spacebar
          // play/pause
          if (videovr.video.paused)
            videovr.video.play();
          else
            videovr.video.pause();
          break;
      }
    };
  }
};

// Listen for messages from the background page
// (It actually listens for messages from anyone in the context,
//  but the background page is the one that interrests us)
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
