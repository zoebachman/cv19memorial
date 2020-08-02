function Environment(container, envType) {

  var screenDimensions = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  var scene = buildScene();

  var camera = buildCamera( screenDimensions );

  var renderer = buildRender( screenDimensions );

  var controls = createControls( camera, renderer );

  function buildScene() {

    var scene = new THREE.Scene();

    return scene;
  }

  function buildCamera({ width, height }) {

    var camera;

    if (envType == "css") {

      camera = new THREE.PerspectiveCamera( 75, width / height, 1, 5000 );

      camera.position.set( 600, 400, 5000 );

      camera.lookAt( 0, 0, 0 );

    } else {

      camera = new THREE.PerspectiveCamera( 50, width / height, 1, 10000 );
    }

    return camera;
  }

  function buildRender({ width, height }) {

    var renderer;

    if (envType == "css") {

      renderer = new THREE.CSS3DRenderer();

    } else {

      renderer = new THREE.WebGLRenderer({alpha: true, antialias:true});

      renderer.setClearColor(0x004444);
    }

    renderer.setSize( width, height );

    container.appendChild( renderer.domElement );

    return renderer;
  }

  function createControls ( camera, renderer ) {

    var controls;

    if (envType == "css") {

      controls = new THREE.TrackballControls( camera, renderer.domElement );

    } else {

      controls = new THREE.OrbitControls(camera, renderer.domElement);

      controls.minPolarAngle = Math.PI/2;

      controls.maxPolarAngle = Math.PI/2;
    }

    return controls;
  }

  this.getControlsTarget = function () {

    return controls.target;
  }

  this.setControlsTo = function (position) {

    controls.target = position;
  }

  this.getCameraPos = function () {

    return { x : camera.position.x, y : camera.position.y, z : camera.position.z } ;
  }

  this.setCameraTo = function(pos) {

    camera.position.x = pos.x;

    camera.position.y = pos.y;

    camera.position.z = pos.z;
  }

  this.resetControls = function() {

    controls.reset();

    controls.enableZoom = false;

    controls.enablePan = false;

    controls.object.position.set(0, 0, 200);

    controls.target.set(0, 0, 0);

    controls.update();
  }

  this.addObject = function (obj) {

    scene.add(obj);
  }

  this.update = function () {

    controls.update();

    renderer.render( scene, camera );
  }

  this.getAngle = function () {
    
    var angle = controls.getAzimuthalAngle() * (180/Math.PI);

    if (angle <= 0) {

      angle = Math.abs(angle);

    } else {

      angle = (180 - angle) + 180;
    }

    return angle;
  }
}
