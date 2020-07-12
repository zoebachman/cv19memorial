var mainSceneContainer = document.getElementById("main-scene");
var memorialSceneContainer = document.getElementById("memorial-scene");
var mainSceneManager, memorialSceneManage;

init();

function init () {
  window.onload = function() {

    loadScript('/js/MainSceneManager.js', createMainScene);

    bindCloseBtns();

    bindReturnBtn();

    animateLogo();
  }

  window.addEventListener('resize', onWindowResize, false);
}

function loadScript(uri, callBack) {

  var script = document.createElement('script');

  script.src = uri;

  script.onload = function(stuff) {

    callBack();
  };

  document.getElementsByTagName('body')[0].appendChild(script);
}

function createMainScene() {

  mainSceneManager = new MainSceneManager(mainSceneContainer);

  loadScript('/js/MemorialSceneManager.js', createMemorialScene);
}

function createMemorialScene() {

  memorialSceneManager = new MemorialSceneManager(memorialSceneContainer);

  loadScript('/js/Environment.js', createScenes);
}

function createScenes() {

  mainSceneManager.createEnvironment();

  memorialSceneManager.createEnvironment();

  loadScript('/js/sceneSubjects/Bubble.js', createSceneSubjects);
}

function createSceneSubjects() {

   $.ajax({

     url: '/data/cv19memorial_responses.csv',

     dataType: 'text',

   }).done(createTestimonies);
}

function createTestimonies(data) {

  var testimonyContent = [];

  var allRows = data.split(/\r?\n|\r/);

  for (var i = 0; i < allRows.length; i ++) {

    var testimony_data = allRows[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);

    if (testimony_data) {

      var testimonyInfo = {
        personal_info: null,
        location: {
          region: null,
          country: null
        },
        type: null,
        img_src: null,
        media_src: null,
        text: null
      };

      if (testimony_data[1] == "Losing a loved one" && testimony_data[5] != "null") {

        testimonyInfo.personal_info = formatPersonalInfo(testimony_data[5], testimony_data[6], testimony_data[8], testimony_data[7]);

      } else {

        testimonyInfo.personal_info = formatPersonalInfo(testimony_data[2], testimony_data[3], testimony_data[4], "null");
      }

      if (testimony_data[11] != "null") {

        testimonyInfo.location.country = testimony_data[11];

        if (testimony_data[12] != "null") {

          testimonyInfo.location.region = testimony_data[12].replace(/['"]+/g, '') + ", ";
        }
      }

      testimonyInfo.type = testimony_data[1];

      if (testimony_data[10] != "null") {

        var media_ref = testimony_data[10].substring(testimony_data[10].lastIndexOf("/") + 1, testimony_data[10].length);

        var media_type = media_ref.substring(media_ref.lastIndexOf(".") + 1, media_ref.length);

        if(media_type == "mp4") {

          testimonyInfo.media_src = media_ref;

        } else {

          testimonyInfo.img_src = media_ref;
        }
      }

      if (testimony_data[9] != "null") {

        testimonyInfo.text = testimony_data[9].replace(/['"]+/g, '');
      }

      testimonyContent.push(testimonyInfo);
    }
  }

  createBubbles(testimonyContent);

  createFilter(testimonyContent);
}

function formatPersonalInfo(firstName, lastName, age, dod) {

  var personalInfo = {
    name: undefined,
    age: undefined,
    dod: undefined
  };

  if (firstName != "null" && lastName != "null") {

    personalInfo.name = firstName + " " + lastName;

  } else if (firstName != "null") {

    personalInfo.name = firstName;

  } else if (lastName != "null") {

    personalInfo.name = lastName;
  }

  if (age != "null" && dod != "null") {

    personalInfo.age = "Age: " + age + ", ";

    personalInfo.dod = "Date of Passing: " + dod;

  } else if (age != "null") {

    personalInfo.age = "Age: " + age;

  } else if (dod != "null") {

    personalInfo.dod = "Date of Passing: " + dod;
  }

  return personalInfo;
}

function createBubbles(testimonyContent) {

  for (var i = 0; i < testimonyContent.length ; i++) {

    var bubble = new Bubble(testimonyContent[i]);

    mainSceneManager.addSceneSubject(bubble);

    bindTestimonyClick(bubble.getTestimony());
  }

  update();
}

function createFilter(content) {

  var filter = new Filter(content);

  loadScript('/js/sceneSubjects/Parameter.js', filter.createContent);

  bindFilterBtn(filter);
}

function bindFilterBtn(fltr) {

  var filterBtn = document.getElementById("filter-btn");

  filterBtn.onclick = function() {

    mainSceneManager.filterBubbles(fltr.toggleModal());
  };
}

function bindTestimonyClick(bubble) {

  bubble.bubbleObject.element.onclick = function() { onTestimonyClick (bubble)};

  bubble.bubbleObject.element.ontouchstart = function() { onTestimonyClick (bubble)};
}

function onTestimonyClick(testimony) {

  mainSceneManager.beginTestimonyTransition(testimony.bubbleObject);

  if (testimony.memorialContent) {

    memorialSceneManager.setMemorialContent(testimony.memorialContent.getMemorialContent());

  } else {

    testimony.memorialContent = new Memorial(testimony.content);

    memorialSceneManager.setMemorialContent(testimony.memorialContent.getMemorialContent());
  }
}

function bindCloseBtns() {

  var directions = document.getElementsByClassName("instructions");

  for( var i = 0;  i < directions.length; i ++) {

    directions[i].children[1].onclick = function() {

      fadeOut(this.parentElement);
    }
  }
}

function fadeOut(elem) {

  elem.style.opacity = '0';

  elem.style.visibility = 'hidden';
}

function bindReturnBtn() {

  var returnBtn = document.getElementById("return_btn");

  returnBtn.addEventListener("click", function (event) {

    mainSceneManager.resetCamera();

    memorialSceneManager.resetControls();
  });
}

function animateLogo() {

  var logoContainer = document.getElementById("logo-container");

  var logo = document.getElementById("logo").children[0];

  var lastXpos = 0;

  calcElemWidth(logo.parentElement, 20, 50, 0.05);

  var animationInterval = setInterval( function(){

    var percentage = (lastXpos / (46865 - 455)) * 100;

    logo.style.backgroundPosition = percentage + '% 0%';

    lastXpos = lastXpos + 455;

    if (lastXpos > 46865) {

      clearInterval(animationInterval);

      fadeOut(logoContainer);
    }

  }, 50);

  animationInterval;
}

function calcElemWidth(elem, minWidth, maxWidth, growthRate) {

  if (window.innerWidth <= 600) {

    elem.style.width = maxWidth + "%";

  } else if (window.innerWidth > 600 && window.innerWidth < 1200) {

    elem.style.width = (maxWidth - ((window.innerWidth - 600) * growthRate)) + "%";

  } else if (window.innerWidth >= 1200) {

    elem.style.width = minWidth + "%";
  }
}

function onWindowResize () {

  location.reload();
}

function update () {

  requestAnimationFrame(update);

  mainSceneManager.update();

  memorialSceneManager.update();
}
