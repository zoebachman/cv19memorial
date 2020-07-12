function Filter(testimonies) {

  var content = testimonies;

  var filterModal = document.getElementById("filter-modal");

  var modalState = "out";

  var activeParams = {
    locations: [],
    types: []
  };

  var testimonyTypes = [];

  var locations = [];

  this.createContent = function () {

    for (var i = 0; i < content.length; i ++) {

      if (!testimonyTypes.find(type => type == content[i].type)) {

        testimonyTypes.push(content[i].type);
      }

      if (!locations.find(location => location == content[i].location.country)) {

        locations.push(content[i].location.country);
      }
    }

    createButtons(testimonyTypes, activeParams.types);

    createButtons(locations, activeParams.locations);
  }

  function createButtons(parameters, paramArray) {

    var paramContainer = document.createElement('div');

    for (var i = 0; i < parameters.length; i ++) {

      var parameter = new Parameter(parameters[i], paramContainer, paramArray);

      bindParamClick(parameter.getButton());
    }

    filterModal.appendChild(paramContainer);
  }

  function bindParamClick(button) {

    button.elem.onclick = function() { onParameterClick (button)};

    changeState(button);
  }

  function onParameterClick(button) {

    changeState(button);
  }

  function changeState(btn) {

    var newState = btn.state != "active" ? "active" : "inactive";

    var oldState = newState != "inactive" ? "inactive" : "active";

    if (newState == "inactive" && btn.array.length > 1) {

      btn.state = newState;

      btn.elem.className = newState;

      btn.elem.classList.remove = oldState;

      btn.array.splice(btn.array.lastIndexOf(btn.label), 1);

    } else if (newState == "active" && !btn.array.find(paramVal => paramVal == btn.label)){

      btn.state = newState;

      btn.elem.className = newState;

      btn.elem.classList.remove = oldState;

      btn.array.push(btn.label);
    }
  }

  this.toggleModal = function () {

    var fadeDirection = modalState == "in" ? "out" : "in";

    fadeModal(fadeDirection)

    modalState = fadeDirection;

    if (fadeDirection == "out") {

      return activeParams;

    } else {

      return null;
    }
  }

  function fadeModal(direction) {

    filterModal.style.transition = direction == "in" ? 'visibility 0s linear, opacity 0.75s ease-in-out' : 'opacity 0.75s ease-in-out, visibility 0s linear 1s';

    filterModal.style.opacity = direction == "in" ? '1' : '0';

    filterModal.style.visibility = direction == "in" ? 'visible' : 'hidden';
  }

  this.getActiveParams = function () {

    return activeParams;
  }
}
