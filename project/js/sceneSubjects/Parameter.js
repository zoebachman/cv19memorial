function Parameter(label, container, array) {

  var button = {
    elem: document.createElement('div'),
    array: array,
    label: label,
    state: null
  };

  button.elem.innerHTML = button.label;

  container.appendChild(button.elem);

  this.getButton = function () {

    return button;
  }
}
