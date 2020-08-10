function ModalManager(filterModal, searchModal) {

  var filter = new Filter(filterModal.elem);

  var search = new Search();

  this.toggleModal = function(modal) {

    var visDirection = modal.state == "in" ? "out" : "in";

    fade(modal.elem, visDirection);

    modal.state = visDirection;
  }

  this.toggleButton = function(modal) {

    var newState = modal.state == "in" ? 'active-button' : 'inactive-button';

    var oldState = newState == 'inactive-button' ? 'active-button' : 'inactive-button';

    modal.button.elem.removeClass = oldState;

    modal.button.elem.className = newState;
  }

  function fade(elem, direction) {

    elem.style.transition = direction == "in" ? 'visibility 0s linear, opacity 0.75s ease-in-out' : 'opacity 0.75s ease-in-out, visibility 0s linear 1s';

    elem.style.opacity = direction == "in" ? '1' : '0';

    elem.style.visibility = direction == "in" ? 'visible' : 'hidden';
  }

  this.createFltrBtn = function(content) {

    return filter.createBtn(content);
  }

  this.getFilterParams = function() {

    return filter.getActiveParams();
  }

  this.getSearchVal = function() {

    return search.getValue();
  }
}
