var cursorTipText = document.getElementById("cursorTipText");

function Bubble(testimonyContent) {

  var testimony = {
    content : testimonyContent,
    bubbleObject: null,
    memorialContent : null,
  }

  var animationRate = {
    x : (Math.random() * .6) - .4,
    y : (Math.random() * .6) - .4,
    z : (Math.random() * .6) - .4
  }

  var container = document.createElement('div');

  container.className = 'testimony testimonyContainer';

  var image = document.createElement('div');

  image.className = 'testimony testimonyImage';

  if (testimony.content.img_src) {

    image.style.backgroundImage = 'url(/images/portraits/' + testimony.content.img_src + ')';

  } else {

    container.style.background = 'linear-gradient(135deg, rgba(91, 70, 129, 0.55) 0%, rgba(30, 147, 186, 0.55) 100%)';
  }

  var text = document.createElement('span');

  text.innerHTML = testimony.content.personal_info.name;

  container.appendChild(image);

  container.appendChild(text);

  testimony.bubbleObject = createObject(container);

  function createObject(elem) {

    var sprite = new THREE.CSS3DSprite(elem);

    sprite.position.x = Math.random() * 4000 - 2000,

    sprite.position.y = Math.random() * 4000 - 2000,

    sprite.position.z = Math.random() * 4000 - 2000;

    sprite.element.onmouseover = function() { onTestimonyMouseIn (testimony.bubbleObject.element)};

    sprite.element.onmouseout = function() { onTestimonyMouseOut ()};

    return sprite;
  }

  function onTestimonyMouseIn(testimonyContainer) {

    var testimonyText = testimonyContainer.childNodes[1];

    cursorTipText.innerHTML = testimonyText.innerHTML;

    cursorTipText.style.top = event.clientY + "px";

    cursorTipText.style.left = event.clientX + "px";

    cursorTipText.style.display = "block";
  }

  function onTestimonyMouseOut() {

    cursorTipText.style.display = "none";
  }

  this.getTestimony = function () {

    return testimony;
  }

  this.setMemorialContent = function () {

    testimony.memorialContent = new Memorial(testimony.content);
  }

  this.animateBubble = function () {

    if (testimony.bubbleObject.position.x > 2000 || testimony.bubbleObject.position.x < -2000) {

      animationRate.x = -animationRate.x;
    }

    if (testimony.bubbleObject.position.y > 2000 || testimony.bubbleObject.position.y < -2000) {

      animationRate.y = -animationRate.y;
    }

    if (testimony.bubbleObject.position.z > 2000 || testimony.bubbleObject.position.z < -2000) {

      animationRate.z = -animationRate.z;
    }

    testimony.bubbleObject.position.x += animationRate.x;

    testimony.bubbleObject.position.y += animationRate.y;
    
    testimony.bubbleObject.position.z += animationRate.z;
  }
}
