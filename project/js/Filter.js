function Filter(modal) {

  var locationContainer = createDiv();

  var typeContainer = createDiv();

  var locations = [];

  var testimonyTypes = [];

  var activeParams = {
    locations: [],
    types: []
  };

  this.createBtn = function (content) {

    var buttons = [];

    if (!testimonyTypes.find(type => type == content.type)) {

      buttons.push(createButton(content.type, typeContainer , activeParams.types));

      testimonyTypes.push(content.type);
    }

    if (!locations.find(location => location == content.location.country)) {

      buttons.push(createButton(content.location.country, locationContainer, activeParams.locations));

      locations.push(content.location.country);
    }

    return buttons;
  }

  function createDiv() {

    var paramContainer = document.createElement('div');

    modal.appendChild(paramContainer);

    return paramContainer;
  }

  function createButton(parameter, paramContainer, paramArray) {

    var parameter = new Parameter(parameter, paramContainer, paramArray);

    parameter.changeState();

    return parameter;
  }

  this.getActiveParams = function () {

    return activeParams;
  }
}
