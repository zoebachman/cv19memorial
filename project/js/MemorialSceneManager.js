function MemorialSceneManager (container) {

  var memorialScene, lastDegree, elements, degrees;

  this.createEnvironment = function () {

    memorialScene = new Environment(container, "webgl");

    memorialScene.resetControls();

    createModel();
  }

  function createModel() {

    var geometry = new THREE.SphereGeometry( 500, 60, 40 );

    var material = new THREE.MeshBasicMaterial({

        side: THREE.DoubleSide,

        map: new THREE.TextureLoader().load( '/textures/2020_0514_cave_pano_test.png' )
    });

    var mesh = new THREE.Mesh( geometry, material );

    mesh.scale.set( - 1, 1, 1 );

    memorialScene.addObject( mesh );
  }

  this.resetControls = function () {

    if (elements[1] && elements[1].children[0].tagName == "VIDEO" && !elements[1].children[0].paused) {

      elements[1].children[0].pause();

      elements[1].children[1].style.visibility = 'visible';
    }

    elements = null;

    degrees = null;

    memorialScene.resetControls();
  }

  this.setMemorialContent = function (content) {

    elements = content.elements;

    degrees = content.degrees;
  }

  this.update = function () {

    if (elements != null && degrees != null) {

      getAngle();
    }

    memorialScene.update();
  }

  function getAngle () {

    var angle = memorialScene.getAngle();

    if (angle != lastDegree) {

      console.log(angle);

      updateMemorialDisplay( angle );

      lastDegree = angle;
    }
  }

  function updateMemorialDisplay( degree ) {

    if (degrees != null && degrees.length > 0) {

      for (i = 0; i < degrees.length; i ++) {

        if (degree >= degrees[i][0] && degree < degrees[i][1]) {

          if (elements[i].style.opacity != '1') {

            elements[i].style.opacity = '1';
          }

        } else {

          if (elements[i].style.opacity != '0') {

            elements[i].style.opacity = '0';

            if (elements[i].children[0].tagName == "VIDEO" && !elements[i].children[0].paused) {

              elements[i].children[0].pause();

              elements[i].children[1].style.visibility = 'visible';
            }
          }
        }
      }
    }
  }
}
