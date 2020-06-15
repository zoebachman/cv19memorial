import * as THREE from '/js/three/build/three.module.js';

import { TrackballControls } from '/js/three/jsm/controls/TrackballControls.js';
import { TWEEN } from '/js/three/jsm/libs/tween.module.min.js';
import { CSS3DRenderer, CSS3DSprite } from '/js/three/jsm/renderers/CSS3DRenderer.js';

var css_camera, css_scene, css_renderer;
var css_controls;

var lastCamPos;

var testimonyContent = [];

var objects = [];
var animationDirections = [];
var animateBbls = true;

var mainOverlay = document.getElementById("intro");
var logoDiv = document.getElementById("logo").children[0];
var instructions = document.getElementById("directions");
var toolTipTextContainer = document.getElementById("cursorTextContainer");
var mainScene = document.getElementById("main-container");
var fadeToDiv = document.getElementById("fadeScreen");
var returnBtn = document.getElementById("return_btn");
var memorialScene = document.getElementById("memorial-scene");
var memorialOverlay = document.getElementById("overlay");

var hasVisitedMemorial = false;

initiate();
calculateWidths(window.innerWidth);

window.onload = function() {
  returnBtn.addEventListener("click", function (event) {
    fadeTo("main");
    zoomTestimonial("out", lastCamPos , 1000);
    animateBbls = !animateBbls;
  });

  window.addEventListener( 'resize', onWindowResize, false );

  animateLogo();
}

function onWindowResize() {
  location.reload();
}

function calculateWidths(winWidth) {
  if (winWidth <= 600) {
    overlay.style.width = "80%";
    logoDiv.parentElement.style.width = "50%";
  } else if (winWidth > 600 && winWidth < 1200) {
    overlay.style.width = (80 - ((winWidth - 600) * 0.042)) + "%";
    logoDiv.parentElement.style.width = (50 - ((winWidth - 600) * 0.05)) + "%";
  } else if (winWidth >= 1200) {
    overlay.style.width = "45%";
    logoDiv.parentElement.style.width = "20%";
  }
}

var lastImgX = 0;

function animateLogo() {
  var animationInterval = setInterval(function(){
    var percentage = (lastImgX / (46865 - 455)) * 100;
    logoDiv.style.backgroundPosition = percentage + '% 0%';
    lastImgX = lastImgX + 455;
    if (lastImgX > 46865) {
      clearInterval(animationInterval);
      instructions.style.opacity = '1';
      instructions.children[1].addEventListener("click", function (event) {
        directionAppearance('hidden', '0', 'opacity 1s ease-in-out, visibility 0s linear 1s');
      });
    }
  }, 50);
  animationInterval;
}

function initiate() {
  createCssScene();
  createRenderer();
  createControl();
  $.ajax({
    url: '/data/cv19memorial_responses.csv',
    dataType: 'text',
  }).done(createTestimonial);
  animate();
}

function createCssScene() {
  css_scene = new THREE.Scene();

  css_camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000);
  css_camera.position.set( 600, 400, 5000 );
  css_camera.lookAt( 0, 0, 0 );
}

function createRenderer() {
  css_renderer = new CSS3DRenderer();
  css_renderer.setSize( window.innerWidth, window.innerHeight );
  mainScene.appendChild( css_renderer.domElement );
}

function createControl() {
  css_controls = new TrackballControls(css_camera, css_renderer.domElement );
}

function animate() {
  requestAnimationFrame( animate );

  css_controls.update();

  if(animateBbls) {
    animateBubbles();
  }

  TWEEN.update();

  css_renderer.render( css_scene, css_camera );
}

function createTestimonial(data) {
  var allRows = data.split(/\r?\n|\r/);
  for(var i = 0; i < allRows.length; i ++) {
    var testimony_data = allRows[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
    if(testimony_data){
      var name, age, dod, location, type, img_src, media_src = undefined, testimony_txt;
      if (testimony_data[1] == "Losing a loved one" && testimony_data[5] != "null") {

        if (testimony_data[5] != "null" && testimony_data[6] != "null") {
          name = testimony_data[5] + " " + testimony_data[6];
        } else if (testimony_data[5] != "null") {
          name = testimony_data[5];
        } else if (testimony_data[6] != "null") {
          name = testimony_data[6];
        }

        if (testimony_data[8] != "null") {
          age = "Age: " + testimony_data[8] + ", ";
        } else {
          age = undefined;
        }

        if (testimony_data[7] != "null") {
          dod = "Date of Passing: " + testimony_data[7];
        } else {
          dod = undefined;
        }
      } else {

        if (testimony_data[2] != "null" && testimony_data[3] != "null") {
          name = testimony_data[2] + " " + testimony_data[3];
        } else if (testimony_data[2] != "null") {
          name = testimony_data[2];
        } else if (testimony_data[3] != "null") {
          name = testimony_data[3];
        }

        if (testimony_data[4] != "null") {
          age = "Age: " + testimony_data[4];
        } else {
          age = undefined;
        }
        dod = undefined;
      }

      if (testimony_data[11] != "null") {
        location = testimony_data[11];

        if (testimony_data[12] != "null") {
          location = testimony_data[12].replace(/['"]+/g, '') + ", " + testimony_data[11] ;
        }
      } else {
        location = undefined;
      }

      type = testimony_data[1];

      if (testimony_data[10] != "null") {
        var media_ref = testimony_data[10].substring(testimony_data[10].lastIndexOf("/") + 1, testimony_data[10].length);
        var media_type = media_ref.substring(media_ref.lastIndexOf(".") + 1, media_ref.length);

        if(media_type == "mp4") {
          img_src = undefined;
          media_src = media_ref;
        } else {
          img_src = media_ref;
        }
      } else {
        img_src = undefined;
      }

      if (testimony_data[9] != "null") {
        testimony_txt = testimony_data[9].replace(/['"]+/g, '');
      } else {
        testimony_txt = undefined;
      }

      testimonyContent.push([[name, age, dod, location], type, media_src, img_src, testimony_txt]);
    }
  }
  createBubbles();
}

function createBubbles() {
  for (var i = 0; i < testimonyContent.length; i ++) {
    var name = testimonyContent[i][0][0];
    var testimonialImg = testimonyContent[i][3];

    var testimonial = document.createElement('div');
    testimonial.className = 'testimonial testimonialContainer';

    var image = document.createElement('div');
    image.className = 'testimonial testimonialImage';

    if (testimonialImg) {
      image.style.backgroundImage = 'url(/images/portraits/' + testimonialImg + ')';
    } else {
      testimonial.style.background = 'linear-gradient(135deg, rgba(91, 70, 129, 0.55) 0%, rgba(30, 147, 186, 0.55) 100%)';
    }

    var text = document.createElement('span');
    text.innerHTML = name;

    testimonial.appendChild(image);
    testimonial.appendChild(text);

    var object = new CSS3DSprite(testimonial);
    object.position.x = Math.random() * 4000 - 2000,
    object.position.y = Math.random() * 4000 - 2000,
    object.position.z = Math.random() * 4000 - 2000;
    css_scene.add( object );

    object.element.onclick = function() { onTestimonialClick(this)};
    object.element.onmouseover = function() { onTestimonialMouseIn(this)};
    object.element.onmouseout = function() { onTestimonialMouseOut()};
    object.element.ontouchstart = function() { onTestimonialClick(this)};

    objects.push( object );

    var bubbleDirection = {
      x : (Math.random() * .6) - .4,
      y : (Math.random() * .6) - .4,
      z : (Math.random() * .6) - .4
    }

    animationDirections.push(bubbleDirection);
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

function onTestimonialMouseIn(testimonialContainer) {
  var testimonialText = testimonialContainer.childNodes[1];

  toolTipTextContainer.innerHTML = testimonialText.innerHTML;
  toolTipTextContainer.style.top = event.clientY + "px";
  toolTipTextContainer.style.left = event.clientX + "px";
  toolTipTextContainer.style.display = "block";
}

function onTestimonialMouseOut() {
  toolTipTextContainer.style.display = "none";
}

function onTestimonialClick(testimonialContainer) {
  var testimonialIndex = Array.from(testimonialContainer.parentElement.children).indexOf(testimonialContainer);

  animateBbls = !animateBbls;

  beginTestimonialTransition(objects[testimonialIndex]);
  createMemorialContent(testimonyContent[testimonialIndex]);
}

function beginTestimonialTransition(testimonial) {
  var position = css_controls.target;
  var target = testimonial.position;
  var tween = new TWEEN.Tween(position).to(target, 500);

  toolTipTextContainer.style.display = "none";

  tween.onUpdate(function(){
    css_controls.target = position;
  });

  tween.onComplete(function(){
    lastCamPos = { x: css_camera.position.x, y: css_camera.position.y, z: css_camera.position.z };
    zoomTestimonial("in", target, 0);
    fadeTo("memorial");
  });

  tween.start();
}

function zoomTestimonial(direction, target, delay) {
  var cam = css_camera.position;
  var newTarget;
  var zTween;

  if (direction == "in") {
    if (target.z > cam.z) {
      newTarget = {x : target.x, y : target.y, z : (target.z - 200)};
    } else if (target.z < cam.z) {
      newTarget = {x : target.x, y : target.y, z : (target.z + 200)};
    }
    zTween = new TWEEN.Tween(cam).to(newTarget, 1000).delay(delay);
  } else {
    zTween = new TWEEN.Tween(cam).to(target, 1000).delay(delay);
  }

  zTween.onUpdate(function(){
    css_camera.position.x = cam.x;
    css_camera.position.y = cam.y;
    css_camera.position.z = cam.z;
  });

  zTween.start();
}

function fadeTo(scene) {
  var sceneToShow = scene == "memorial" ? memorialScene : mainScene;
  var sceneToHide = scene == "memorial" ? mainScene : memorialScene;

  fadeToDiv.style.visibility = 'visible';
  fadeToDiv.style.backgroundColor = 'rgba(0, 0, 0, 1)';
  setTimeout(function() {
    fadeToDiv.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    sceneToShow.style.left= '0em';
    sceneToHide.style.left = '-999em';
    if (scene == "main") {
      resetMemorialControls();
      returnBtn.style.visibility = 'hidden';
      directionAppearance('hidden', '0', null);
    } else {
      if (hasVisitedMemorial == false) {
        instructions.children[0].children[0].innerHTML = "rotate clockwise to reveal the testimony";
        mainOverlay.style.background = 'rgba(0, 0, 0, 0.95)';
        instructions.style.color = '#f4eae0';
        instructions.children[1].style.color = '#f4eae0';
        directionAppearance('visible', '1', null);
        hasVisitedMemorial = true;
      }
      memorialOverlay.style.visibility = "visible";
      returnBtn.style.visibility = 'visible';
    }
    setTimeout(function() {
      fadeToDiv.style.visibility = 'hidden';
    }, 1000);
  }, 1000);
}

function directionAppearance(visibility, opacity, transition) {
  if (transition) {
    mainOverlay.style.transition = transition;
  } else {
    mainOverlay.style.removeProperty('transition');
  }
  mainOverlay.style.opacity = opacity;
  mainOverlay.style.visibility = visibility;
}
