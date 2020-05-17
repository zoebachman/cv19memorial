
import * as THREE from '/js/three/build/three.module.js';

import { TrackballControls } from '/js/three/jsm/controls/TrackballControls.js';
import { TWEEN } from '/js/three/jsm/libs/tween.module.min.js';
import { CSS3DRenderer, CSS3DSprite } from '/js/three/jsm/renderers/CSS3DRenderer.js';

var camera, scene, renderer;
var controls;

var particlesTotal = 50;
var objects = [];
var animationDirections = [];
var animateBbls = true;
var lastCamPos;

var testimonyContent = [];

var toolTipTextContainer = document.getElementById("cursorTextContainer");
var sceneContainer = document.getElementById("main-container");
var fadeToDiv = document.getElementById("fadeScreen");
var closeBtn = document.getElementById("close_btn");

init();
animate();

window.onload = function() {
  sceneContainer.addEventListener("mouseover", function (event) {
    onTestimonialMouseIn(event);
  });
  sceneContainer.addEventListener("mouseout", function (event) {
    onTestimonialMouseOut(event);
  });
  sceneContainer.addEventListener("click", function (event) {
    onTestimonialClick(event);
  });
  closeBtn.addEventListener("click", function (event) {
    fadeModal("out");
  });
}

function init() {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
  camera.position.set( 600, 400, 5000 );
  camera.lookAt( 0, 0, 0 );

  scene = new THREE.Scene();

  $.ajax({
    url: '/data/cv19memorial _english_responses.csv',
    dataType: 'text',
  }).done(createTestimonial);

  renderer = new CSS3DRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  sceneContainer.appendChild( renderer.domElement );

  controls = new TrackballControls( camera, renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );
}

function animate() {
  requestAnimationFrame( animate );

  controls.update();
  if(animateBbls) {
    animateBubbles();
  }
  TWEEN.update();
  renderer.render( scene, camera );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function createTestimonial(data) {
  var allRows = data.split(/\r?\n|\r/);
  for(var i = 0; i < allRows.length; i ++) {
    var testimony_data = allRows[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
    if(testimony_data){
      var name = testimony_data[0];
      var testimonialText = testimony_data[4].replace(/['"]+/g, '');
      var testimonialImg = testimony_data[5].substring(testimony_data[5].lastIndexOf("/") + 1, testimony_data[5].length);

      var testimonial = document.createElement('div');
      testimonial.className = 'testimonial testimonialContainer';

      var image = document.createElement('div');
      image.className = 'testimonial testimonialImage';
      image.style.backgroundImage = 'url(/images/portraits/' + testimonialImg + ')';

      var text = document.createElement('span');
      text.innerHTML = name;

      testimonial.appendChild(image);
      testimonial.appendChild(text);

      var object = new CSS3DSprite(testimonial);
      object.position.x = Math.random() * 4000 - 2000,
      object.position.y = Math.random() * 4000 - 2000,
      object.position.z = Math.random() * 4000 - 2000;
      scene.add( object );

      objects.push( object );

      var bubbleDirection = {
        x : (Math.random() * .6) - .4,
        y : (Math.random() * .6) - .4,
        z : (Math.random() * .6) - .4
      }

      animationDirections.push(bubbleDirection);
    }
  }
}

function animateBubbles() {
  for (var i = 0; i < objects.length; i ++) {
    if (objects[i].position.x > 2000 || objects[i].position.x < -2000 ) {
      animationDirections[i].x = -animationDirections[i].x;
    }
    if (objects[i].position.y > 2000 || objects[i].position.y < -2000 ) {
      animationDirections[i].y = -animationDirections[i].y;
    }
    if (objects[i].position.z > 2000 || objects[i].position.z < -2000 ) {
      animationDirections[i].z = -animationDirections[i].z;
    }

    objects[i].position.x += animationDirections[i].x;
    objects[i].position.y += animationDirections[i].y;
    objects[i].position.z += animationDirections[i].z;
  }
}

function onTestimonialMouseIn(evt) {
  if(evt.target &&  evt.target.className == "testimonial testimonialImage"){
    var testimonialContainer = evt.target.parentNode;
    var testimonialText = testimonialContainer.childNodes[1];

    toolTipTextContainer.innerHTML = testimonialText.innerHTML;
    toolTipTextContainer.style.top = evt.clientY + "px";
    toolTipTextContainer.style.left = evt.clientX + "px";
    toolTipTextContainer.style.display = "block";
  }
}

function onTestimonialMouseOut(evt) {
  if(evt.target &&  evt.target.className == "testimonial testimonialImage"){
    toolTipTextContainer.style.display = "none";
  }
}

function onTestimonialClick(evt) {
  if(evt.target &&  evt.target.className == "testimonial testimonialImage"){
    var testimonialContainer = evt.target.parentNode;
    var testimonialIndex = Array.from(testimonialContainer.parentElement.children).indexOf(testimonialContainer);

    animateBbls = false;
    lastCamPos = camera;
    beginTestimonialTransition(objects[testimonialIndex]);
  }
}

function beginTestimonialTransition(testimonial) {
  var position = controls.target;
  var target = testimonial.position;
  var tween = new TWEEN.Tween(position).to(target, 500);

  toolTipTextContainer.style.display = "none";

  tween.onUpdate(function(){
    controls.target = position;
  });

  tween.onComplete(function(){
    zoomTestimonial("in", target);
    fadeModal("in");
  });

  tween.start();
}

function zoomTestimonial(direction, target) {
  var cam = camera.position;
  var target =  direction == "in" ? target : { x: target.x, y: target.y, z: 1500 };
  var zTween = new TWEEN.Tween(cam).to(target, 1000);

  zTween.onUpdate(function(){
    camera.position.z = cam.z;
  });

  zTween.start();
}

function fadeModal(direction) {
  var currentOpacity = { percentage : direction == "in" ? 0 : 1 };
  var transitionOpacity = { percentage : direction == "in" ? 1 : 0 };
  var fadeTween = new TWEEN.Tween(currentOpacity).to(transitionOpacity, 1100);

  fadeTween.onUpdate(function(){
    fadeToDiv.style.backgroundColor = 'rgba(0, 0, 0, ' + currentOpacity.percentage + ')';
  });

  if (direction == "in") {
    fadeToDiv.style.visibility = 'visible';
    fadeTween.start();
    fadeTween.onComplete(function() {
      closeBtn.style.visibility = 'visible';
    });

  } else {
    closeBtn.style.visibility = 'hidden';
    zoomTestimonial("out", lastCamPos);
    fadeTween.start();
    fadeTween.onComplete(function() {
      fadeToDiv.style.visibility = 'hidden';
      animateBbls = true;
    });
  }
}
