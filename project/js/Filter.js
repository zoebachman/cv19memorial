function Filter(content, container, button) {

  var modalState = "out";

  var btnVis = "in";

  var buttons = [];

  var activeParams = {
    locations: [],
    types: []
  };

  this.createContent = function () {

    var locations = [];

    var testimonyTypes = [];

    for (var i = 0; i < content.length; i ++) {

      if (!testimonyTypes.find(type => type == content[i].type)) {

        testimonyTypes.push(content[i].type);
      }

      if (!locations.find(location => location == content[i].location.country)) {

        locations.push(content[i].location.country);
      }
    }

    container.appendChild(createButtons(locations, activeParams.locations));

    container.appendChild(createButtons(testimonyTypes, activeParams.types));

    button.className = 'inactive-button';

    button.onclick = function() { toggleElements(container, button) };

    container.addEventListener("click", function (event) {

      if (event.target == this) {

        toggleElements(container, button);
      }
    });

    return buttons;
  }

  function toggleElements(container, button) {

    toggleModal(container);

    toggleButton(button);
  }

  function createButtons(parameters, paramArray) {

    var paramContainer = document.createElement('div');

    for (var i = 0; i < parameters.length; i ++) {

      var parameter = new Parameter(parameters[i], paramContainer, paramArray);

      parameter.changeState();

      buttons.push(parameter);
    }

    return paramContainer;
  }

  function toggleButton(button) {

    var newState = modalState == "in" ? 'active-button' : 'inactive-button';

    var oldState = newState == 'inactive-button' ? 'active-button' : 'inactive-button';

    button.removeClass = oldState;

    button.className = newState;
  }

  function toggleModal(modal) {

    var visDirection = modalState == "in" ? "out" : "in";

    fade(modal, visDirection);

    modalState = visDirection;
  }

  this.toggleBtnVis = function () {

    var visDirection = btnVis == "in" ? "out" : "in";

    fade(button, visDirection);

    btnVis = visDirection;
  }

  function fade(elem, direction) {

    elem.style.transition = direction == "in" ? 'visibility 0s linear, opacity 0.75s ease-in-out' : 'opacity 0.75s ease-in-out, visibility 0s linear 1s';

    elem.style.opacity = direction == "in" ? '1' : '0';

    elem.style.visibility = direction == "in" ? 'visible' : 'hidden';
  }

  this.getActiveParams = function () {

    return activeParams;
  }
}
