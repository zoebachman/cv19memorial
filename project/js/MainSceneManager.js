function MainSceneManager(container) {

  var curtain = document.getElementById("curtain");

  var bubbleScript = document.getElementById("bubble-script");

  var mainScene, lastCamPos, sceneToHide, sceneToShow;

  var bubbles = [];

  var animateBbls = true;

  this.createEnvironment = function () {

    mainScene = new Environment(container, "css");
  }

  this.addSceneSubject = function (subject) {

    var bubble = subject.getTestimony();

    mainScene.addObject(bubble.bubbleObject);

    bubbles.push(subject);
  }

  this.filterBubbles = function (parameters) {

    animateBbls = !animateBbls;

    for (var i = 0; i < bubbles.length; i ++) {

      var bubble = bubbles[i].getTestimony();

      var bubbleState = !parameters.locations.find(location => location == bubble.content.location.country) || !parameters.types.find(type => type == bubble.content.type) ? "out" : "in";

      fade(bubble.bubbleObject.element, bubbleState);
    }

    animateBbls = !animateBbls;
  }

  this.beginTestimonyTransition = function(testimony) {

    var position = mainScene.getControlsTarget();

    var target = testimony.position;

    var tween = new TWEEN.Tween(position).to(target, 500);

    cursorTipText.style.display = "none";

    animateBbls = !animateBbls;

    tween.onUpdate( function() {

      mainScene.setControlsTo(position);
    });

    tween.onComplete( function() {

      lastCamPos = mainScene.getCameraPos();

      zoomTestimony("in", target, 0);

      transitionTo("memorial");
    });

    tween.start();
  }

  function transitionTo(scene) {

    sceneToHide = sceneToHide != mainSceneContainer ? mainSceneContainer : memorialSceneContainer;

    sceneToShow = sceneToShow != memorialSceneContainer ? memorialSceneContainer : mainSceneContainer;

    fade(curtain, "in");

    setTimeout( function() {

      sceneToShow.style.left = '0em';

      sceneToHide.style.left= '-999em';

      fade(curtain, "out");

    }, 1000);
  }

  function fade(elem, direction) {

    elem.style.transition = direction == "in" ? 'visibility 0s linear, opacity 1.5s ease-in-out' : 'opacity 1.5s ease-in-out, visibility 0s linear 1s';

    elem.style.opacity = direction == "in" ? '1' : '0';

    elem.style.visibility = direction == "in" ? 'visible' : 'hidden';
  }

  function zoomTestimony(direction, target, delay) {

    var cam = mainScene.getCameraPos();

    var newTarget;

    var zTween;

    if (direction == "in") {

      if (target.z > cam.z) {

        newTarget = { x : target.x, y : target.y, z : (target.z - 200) };

      } else if (target.z < cam.z) {

        newTarget = { x : target.x, y : target.y, z : (target.z + 200) };
      }

      zTween = new TWEEN.Tween(cam).to(newTarget, 1000).delay(delay);

    } else {

      zTween = new TWEEN.Tween(cam).to(target, 1000).delay(delay);
    }

    zTween.onUpdate( function(){

      mainScene.setCameraTo( cam );

    });

    zTween.start();
  }

  this.resetCamera = function() {

    transitionTo("main");

    zoomTestimony("out", lastCamPos , 1000);

    animateBbls = !animateBbls;
  }

  this.update = function() {

    mainScene.update();

    if(bubbles.length > 0 && animateBbls) {

      animateBubbles();
    }

    TWEEN.update();
  }

  function animateBubbles() {

    for (var i = 0; i < bubbles.length; i ++) {

      bubbles[i].animateBubble();
    }
  }
}
