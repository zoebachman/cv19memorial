function Memorial(content) {
  var infoContainer = document.getElementById("testimony-info");
  var personalContainer = infoContainer.children[0];
  var typeContainer = infoContainer.children[1];
  var mediaContainer = document.getElementById("testimony-media");
  var testimonyContainer = document.getElementById("testimony-wrapper");
  var testimonyElements = [infoContainer];
  var elementDegrees = [];

  var memorialContent = {
    personalInfo : createInfoElems([[[content.personal_info.name], "H2"], [[content.personal_info.age, content.personal_info.dod], "H3"], [[content.location.region, content.location.country], "H4"]]),
    type : createTypeElem(content.type, "p"),
    media: [],
    text: []
  };

  createMemorialContent();

  function createMemorialContent() {

    if (content.img_src || content.media_src) {

      createMediaElem();
    }

    if (content.text) {

      createTestimonyText(content.text.split(' '));
    }

    calcAngleIncrements();

    console.log(memorialContent);
  }

  function createInfoElems (elemArray) {

    var finalArray = [];

    for (var i = 0; i < elemArray.length; i++ ) {

      var finalText = "";

      for (var j = 0; j < elemArray[i][0].length; j ++) {

        if (elemArray[i][0][j]){

          finalText += elemArray[i][0][j];
        }
      }

      if (finalText != "") {

        var textContainer = document.createElement(elemArray[i][1]);

        var textNode = document.createTextNode(finalText);

        textContainer.appendChild(textNode);

        finalArray.push(textContainer);
      }
    }

    return finalArray;
  }

  function createTypeElem(text, tag) {

    if (text) {

      var elem = document.createElement(tag);

      var txt = document.createTextNode(text);

      elem.appendChild(txt);

      return elem;
    }
  }

  function createMediaElem() {

    if (content.media_src) {

      createVideo(content.media_src);

    } else if (content.img_src) {

      var portraitElem = document.createElement("div");

      portraitElem.style.backgroundImage = 'url(/images/portraits/' + content.img_src + ')';

      testimonyElements.push(mediaContainer);

      memorialContent.media.push(portraitElem);
    }
  }

  function createVideo(vid_content) {

    var videoElem = document.createElement("VIDEO");

    var posterElem = document.createElement("div");

    posterElem.style.backgroundImage = 'url(/images/icons/vid_overlay.png)';

    videoElem.src = "/images/portraits/" + vid_content;

    mediaContainer.onclick = function() {

      if (videoElem.paused && mediaContainer.style.opacity == '1') {

        mediaContainer.children[1].style.visibility = 'hidden';

        videoElem.play();

      } else {

        mediaContainer.children[1].style.visibility = 'visible';

        videoElem.pause();
      }
    };

    testimonyElements.push(mediaContainer);

    memorialContent.media.push(videoElem, posterElem);
  }

  function createTestimonyText(testimonyContent) {

    var elem = createTestimonyParagraph();

    for (var i = 0; i < testimonyContent.length; i++) {

      elem.innerHTML += (testimonyContent[i] + ' ');

      if (isOverflown(elem)) {

        elem.parentNode.parentNode.removeChild(elem.parentNode);

        testimonyElements.pop();

        var newContent = testimonyContent.slice(0, i);

        var modifiedArray = testimonyContent.slice(i);

        createTestimonyText(newContent);

        createTestimonyText(modifiedArray);

        return;
      }
    }

    memorialContent.text.push(elem.parentNode);

    elem.parentNode.parentNode.removeChild(elem.parentNode);
  }

  function createTestimonyParagraph() {

    var blockquoteElem = document.createElement("blockquote");

    blockquoteElem.className = "text";

    var testimony_txtContainer = document.createElement("div");

    blockquoteElem.appendChild(testimony_txtContainer);

    testimonyContainer.appendChild(blockquoteElem);

    testimonyElements.push(blockquoteElem);

    return testimony_txtContainer;
  }

  function isOverflown(element) {

    return element.scrollHeight > element.clientHeight;
  }

  function removeChildren(parents) {

    for(var i = 0; i < parents.length; i ++) {

      var child = parents[i].lastElementChild;

      while (child) {

        parents[i].removeChild(child);

        child = parents[i].lastElementChild;
      }
    }
  }

  function calcAngleIncrements() {

    angleIncrement = 360/(testimonyElements.length );

    for(var i = 0; i < testimonyElements.length; i ++) {

      elementDegrees.push([i * angleIncrement, (i + 1) * angleIncrement]);
    }
  }

  this.getMemorialContent = function() {

    if (mediaContainer.children.length > 0 && mediaContainer.children[0].tagName == "VIDEO") {

      mediaContainer.onclick = null;
    }

    removeChildren([personalContainer, typeContainer, mediaContainer, testimonyContainer]);

    for (var i = 0; i < memorialContent.personalInfo.length; i++) {

      personalContainer.appendChild(memorialContent.personalInfo[i]);
    }

    typeContainer.appendChild(memorialContent.type);

    for (var i = 0; i < memorialContent.media.length; i++) {

      mediaContainer.appendChild(memorialContent.media[i]);
    }

    for (var i = 0; i < memorialContent.text.length; i++) {

      testimonyContainer.appendChild(memorialContent.text[i]);
    }

    padLastParagraph();

    return { elements: testimonyElements, degrees: elementDegrees };
  }

  function padLastParagraph() {

    var lastElement = testimonyElements[testimonyElements.length - 1].children[0];

    if (lastElement.parentElement.className == "text") {

      var textNode = lastElement.firstChild;

      var newParagraph = document.createElement("p");

      newParagraph.appendChild(textNode);

      removeChildren(lastElement);

      lastElement.appendChild(newParagraph);

      var textPadding = 0;

      while(Math.round(newParagraph.scrollHeight) < lastElement.clientHeight) {

        var newPadding = (lastElement.clientHeight - newParagraph.scrollHeight) / 2;

        textPadding += newPadding;

        newParagraph.style.paddingTop = textPadding + "px";

        newParagraph.style.paddingBottom = textPadding + "px";
      }
    }
  }
}
