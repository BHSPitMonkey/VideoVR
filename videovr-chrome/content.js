var videovr = {
  start: function () {
    // Three.js setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 2;
    this.renderer = new THREE.WebGLRenderer();
    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.position = "fixed";
    this.renderer.domElement.style.top = 0;
    this.renderer.domElement.style.left = 0;
    this.renderer.domElement.style.zIndex = 2999999999;
    this.renderer.domElement.webkitRequestFullscreen();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Add OculusRiftEffect
    this.effect = new THREE.OculusRiftEffect(this.renderer);
    this.effect.setSize( window.innerWidth, window.innerHeight );
    //effect.separation = 20;
    //effect.distortion = 0.1;
    //effect.fov = 110;
    
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

    // Begin rendering
    (function animloop(){
      requestAnimationFrame(animloop);
      if( videovr.video.readyState === videovr.video.HAVE_ENOUGH_DATA ){
        videovr.texture.needsUpdate = true;
      }
      videovr.effect.render(videovr.scene, videovr.camera);
    })();
  }
}

// Listen for messages from the background page
// (It actually listens for messages from anyone in the context,
//  but the background page is the one that interrests us)
chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  // If we've been asked to post grades...
  if (msg.action && (msg.action == "startVideoVRMode")) {
    // ...confirm we got the message and...
    response();
    // ...do what we do best: post grades !
    videovr.start();
  }
  else console.log(action);
});
