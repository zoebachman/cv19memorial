function SceneManager() {

  var mainSceneContainer = document.getElementById("main-world");

  var memorialSceneContainer = document.getElementById("memorial-world");

  var mainSceneManager, memorialSceneManager;

  this.createScenes = function() {

    mainSceneManager = new MainSceneManager(mainSceneContainer);

    memorialSceneManager = new MemorialSceneManager(memorialSceneContainer);

    mainSceneManager.createEnvironment();

    memorialSceneManager.createEnvironment();
  }

  this.createSceneSubjects = function() {

     $.ajax({

       url: '/data/cv19memorial_responses.csv',

       dataType: 'text',

     }).done(createTestimonies);
  }

  this.toggleFilterBtns = function() {

    mainSceneManager.toggleModalBtns();
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

  this.resetScenes = function() {

    mainSceneManager.resetCamera();

    memorialSceneManager.resetControls();
  }

  this.update = function () {

    mainSceneManager.update();

    memorialSceneManager.update();
  }
}
