function Search () {

  var searchField = document.getElementById("searchField");

  this.getValue = function () {

    var searchVal = searchField.value;

    setTimeout( function() {

      searchField.value = "";

    }, 500);

    return searchVal;
  }
}
