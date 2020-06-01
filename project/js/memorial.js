var testimonyInfo_container = document.getElementById("testimony__info");
var personalInfo_container = testimonyInfo_container.children[0];
var testimonyType_container = testimonyInfo_container.children[1];
var mediaContainer = document.getElementById("testimony_media");
var testimonyContainer = document.getElementById("testimony-wrapper");

var testimonyElements;
var angleIncrement;
var elementDegrees;

function createMemorialContent(content) {
  testimonyElements = [];
  elementDegrees = [];

  removeChildren([personalInfo_container, testimonyType_container, mediaContainer, testimonyContainer]);

  createHeaderElem([content[0][0]], "H2", personalInfo_container);
  createHeaderElem([content[0][1], content[0][2]], "H3", personalInfo_container);
  createHeaderElem([content[0][3]], "H4", personalInfo_container);
  createTestimonyTxtElem(content[1], "p", testimonyType_container);

  testimonyElements.push(testimonyInfo_container);

  if(content[2]){
    var portraitElem = document.createElement("div");
    portraitElem.style.backgroundImage = 'url(/images/portraits/' + content[2] + ')';
    portraitElem.className = "testimony_portrait";

    mediaContainer.appendChild(portraitElem);
    testimonyElements.push(mediaContainer);
  }

  if (content[3]) {
    createVideo(content[3]);
  }

  if (content[4]) {
    createTestimonyText(content[4].split(' '));
  }

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

  // console.log(testimonyElements);

  angleIncrement = 360/(testimonyElements.length );

  for(var i = 0; i < testimonyElements.length; i ++) {

    // console.log("If degree is between " + i * angleIncrement + " and " + ((i + 1) * angleIncrement) + ", item " + (i + 1) + " will be shown.");

    elementDegrees.push([i * angleIncrement, (i + 1) * angleIncrement]);
  }
}

function resetMemorialControls() {
  control.reset();
  control.enableZoom = false;
  control.enablePan = false;
  control.object.position.set(0, 0, 200);
  control.target.set(0, 0, 0);
  control.update();
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

function createHeaderElem(headerTxt, headerType, headerCont) {
  var finalText = "";

  for(var i = 0; i < headerTxt.length; i ++) {
    if(headerTxt[i]){
      finalText += headerTxt[i];
    }
  }

  if (finalText != "") {
    var headerTxtCont = document.createElement(headerType);
    headerCont.appendChild(headerTxtCont);

    var headerTxtNode = document.createTextNode(finalText);
    headerTxtCont.appendChild(headerTxtNode);
  }
}

function createVideo(vid_content){
  var videoElem = document.createElement("VIDEO");
  var poster_src = vid_content.substring(0, vid_content.lastIndexOf("."));

  videoElem.src = "/images/portraits/" + vid_content;
  videoElem.poster = "/images/portraits/vid_thumbnails/" + poster_src + ".png";

  mediaContainer.appendChild(videoElem);

  videoElem.onclick = function() {
    if (videoElem.paused && mediaContainer.style.opacity == '1') {
      videoElem.play();
    } else {
      videoElem.pause();
    }
  };

  testimonyElements.push(mediaContainer);
}

function createTestimonyTxtElem(content, elemType, container, testimonyElemContainer) {
  if (content) {
    var dom_el = document.createElement(elemType);
    var txt = document.createTextNode(content);

    dom_el.appendChild(txt);
    container.appendChild(dom_el);
  }
}

function createTestimonyText(testimonyContent) {
  var elem = createTestimonyParagraph();

  for (var i = 0; i < testimonyContent.length; i++) {
    elem.innerHTML += (testimonyContent[i] + ' ');
    // console.log(elem.scrollHeight, elem.clientHeight);
    if (isOverflown(elem)) {
      elem.parentNode.parentNode.removeChild(elem.parentNode);
      testimonyElements.pop();

      var newContent = testimonyContent.slice(0, i);
      var modifiedArray = testimonyContent.slice(i);

      // console.log("overflow detected at " + testimonyContent[i]);

      createTestimonyText(newContent);
      createTestimonyText(modifiedArray);
      break;
    }
  }
}

function isOverflown(element) {
  return element.scrollHeight > element.clientHeight;
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

function getTextNodeHeight(textNode) {
  var height = 0;
  if (document.createRange) {
    var range = document.createRange();
    range.selectNodeContents(textNode);
    if (range.getBoundingClientRect) {
      var rect = range.getBoundingClientRect();
      if (rect) {
        height = rect.bottom - rect.top;
      }
    }
  }
  return height;
}

function showContent(degree) {
  if(elementDegrees != null && elementDegrees.length > 0) {
    // console.log("angle in memorial " + degree);
    for (i = 0; i < elementDegrees.length; i ++) {
      if (degree >= elementDegrees[i][0] && degree < elementDegrees[i][1]) {
        if (testimonyElements[i].style.opacity != '1') {
          testimonyElements[i].style.opacity = '1';
        }
      } else {
        if (testimonyElements[i].style.opacity != '0') {
          testimonyElements[i].style.opacity = '0';
          if (testimonyElements[i] == mediaContainer && testimonyElements[i].children[0].tagName == "VIDEO" && !testimonyElements[i].children[0].paused) {
            testimonyElements[i].children[0].pause();
          }
        }
      }
    }
  }
}
