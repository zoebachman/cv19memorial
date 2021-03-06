function Parameter(label, container, array) {

  var divElem = document.createElement('div');

  var spanElem = document.createElement('span');

  divElem.appendChild(spanElem);

  var button = {
    elem: divElem,
    array: array,
    label: label,
    state: "inactive"
  };

  button.elem.children[0].innerHTML = button.label;

  container.appendChild(button.elem);

  this.getButton = function () {

    return button;
  }

  this.changeState = function() {

    var newState = button.state != "active" ? "active" : "inactive";

    var oldState = newState != "inactive" ? "inactive" : "active";

    if (newState == "inactive" && button.array.length > 1) {

      button.state = newState;

      button.elem.className = newState;

      button.elem.classList.remove = oldState;

      button.array.splice(button.array.lastIndexOf(button.label), 1);

    } else if (newState == "active" && !button.array.find(paramVal => paramVal == button.label)){

      button.state = newState;

      button.elem.className = newState;

      button.elem.classList.remove = oldState;

      button.array.push(button.label);
    }

    // console.log(button.array);
    //
    // console.log(button.label + " is " + button.state);
  }
}
