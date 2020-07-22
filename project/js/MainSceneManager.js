function MainSceneManager(mainContainer, memorialContainer) {

  var curtain = document.getElementById("curtain");

  var bubbleScript = document.getElementById("bubble-script");

  var visibleScene = mainContainer;

  var hiddenScene = memorialContainer;

  var mainScene, lastCamPos, modalManager;

  var filterModal = {
    elem: document.getElementById("filter-modal"),
    state: "out",
    button: {
      elem: document.getElementById("filter-btn"),
      state: "in"
    }
  }

  var searchModal = {
    elem: document.getElementById("search-modal"),
    state: "out",
    button: {
      elem: document.getElementById("search-btn"),
      state: "in"
    }
  }

  var bubbles = [];

  var animateBbls = true;

  this.createEnvironment = function () {

    mainScene = new Environment(mainContainer, "css");

    modalManager = new ModalManager(filterModal, searchModal);

    bindModal(filterModal, searchModal);

    bindModal(searchModal, filterModal);

    bindSearchBtn();
  }

  function bindModal(modalToShow, modalToHide) {

    modalToShow.button.elem.className = 'inactive-button';

    modalToShow.button.elem.onclick = function() {

      toggleElems(modalToShow, modalToHide);

      if (modalToShow == filterModal) {

        filterBubbles(modalManager.getFilterParams());
      }
    };

    modalToShow.elem.addEventListener("click", function (event) {

      if (event.target == this) {

        toggleElems(modalToShow, modalToHide);
      }
    });
  }

  function toggleElems (modalToShow, modalToHide = null) {

    modalManager.toggleModal(modalToShow);

    modalManager.toggleButton(modalToShow);

    if (modalToHide && modalToHide.state == "in") {

      modalManager.toggleModal(modalToHide);

      modalManager.toggleButton(modalToHide);
    }
  }

  function bindSearchBtn() {

    document.getElementById("searchBtn").onclick = function() {

      toggleElems(searchModal);

      searchBubbles(modalManager.getSearchVal())
    };
  }

  function searchBubbles(name) {

    var searchVal = getWordArray(name);

    animateBbls = !animateBbls;

    for (var i = 0; i < bubbles.length; i ++) {

      var bubble = bubbles[i].getTestimony();

      var testimonyName = getWordArray(bubble.content.personal_info.name);

      var bubbleState;

      for (var j = 0; j < searchVal.length; j ++) {

        bubbleState = !testimonyName.find(word => word == searchVal[j]) ? "out" : "in";

        var isFound = bubbleState == "out" ? "not found" : "found";

        console.log(searchVal[j] + " " + isFound + " in " + bubble.content.personal_info.name);
      }

      console.log(bubble.content.personal_info.name + " is " + bubbleState);

      console.log("--------------------------------------");

      fade(bubble.bubbleObject.element, bubbleState);
    }

    animateBbls = !animateBbls;
  }

  function getWordArray (word) {

    var lowerCase = word.toLowerCase();

    var sansAccents = lowerCase.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    var arr = sansAccents.split(' ');

    return arr;
  }

  this.addSceneSubject = function (subject) {

    var bubble = subject.getTestimony();

    mainScene.addObject(bubble.bubbleObject);

    var bubbleParams = modalManager.createFltrBtn(bubble.content);

    for (var i = 0; i < bubbleParams.length; i ++) {

        bindParamClick(bubbleParams[i]);
    }

    bubbles.push(subject);
  }

  function bindParamClick(button) {

    var btn = button.getButton();

    btn.elem.onclick = function() { onParameterClick (button)};
  }

  function onParameterClick(button) {

    var btn = button.getButton();

    button.changeState();

    filterBubbles(modalManager.getFilterParams());
  }

  function filterBubbles(parameters) {

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

    toggleModalBtns();

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

  function toggleModalBtns() {

    toggleBtnVis(filterModal);

    toggleBtnVis(searchModal);
  }

  function toggleBtnVis(modal) {

    var visDirection = modal.button.state == "in" ? "out" : "in";

    fade(modal.button.elem, visDirection);

    modal.button.state = visDirection;
  }

  function transitionTo(scene) {

    var newHiddenScene = visibleScene;

    visibleScene = hiddenScene;

    hiddenScene = newHiddenScene;

    fade(curtain, "in");

    setTimeout( function() {

      visibleScene.style.left = '0em';

      hiddenScene.style.left= '-999em';

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

    toggleModalBtns();
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
