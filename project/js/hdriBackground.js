var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container, control, currentDegree;

var WIDTH, HEIGHT;

window.addEventListener('load', init, false);

function init() {
  createScene();
  createModel();
  render();
  createOrbit();
  loop();
}

function createScene() {
  scene = new THREE.Scene();
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  aspectRatio = WIDTH/HEIGHT;
  fieldOfView = 50;
  nearPlane = 1;
  farPlane = 10000;

  camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
}

function createModel() {
  var geometry = new THREE.SphereGeometry( 500, 60, 40 );

  var material = new THREE.MeshBasicMaterial( {
      map: new THREE.TextureLoader().load( 'textures/2020_0514_cave_pano_test.png' )
  } );

  var mesh = new THREE.Mesh( geometry, material );
  mesh.scale.set( - 1, 1, 1 );

  scene.add( mesh );
}

function render() {
  renderer = new THREE.WebGLRenderer({alpha: true, antialias:true});
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0x004444);
  renderer.render(scene, camera);
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);
}

function createOrbit() {
  control = new THREE.OrbitControls(camera, renderer.domElement);
  control.enableZoom = false;
  control.enablePan = false;
  control.minPolarAngle = Math.PI/2;
  control.maxPolarAngle = Math.PI/2;
  control.object.position.set(0, 0, 200);
  control.target.set(0, 0, 0);
  control.update();
}

function loop() {
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
  control.update();
  getAngle(control.getAzimuthalAngle());
}

function getAngle(radian) {
  var angle = radian * (180/Math.PI);
  if (angle <= 0) {
    angle = Math.abs(angle);
  } else {
    angle = (180 - angle) + 180;
  }
  showContent(angle);
}
