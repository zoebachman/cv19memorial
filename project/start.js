// This file is what handles incoming requests and
// serves files to the browser, or executes server-side code

var express = require('express');
var app = express();
var fs = require('fs');

app.set('port', (process.env.PORT || 5000));

// was causing wonkiness but now seems fine
app.use(express.static(__dirname)); 

// getting image files
app.use(express.static('images')); 

// views is directory for all template files
app.set('views', __dirname + '/html');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/index');
});

app.get('/about', function (request, response) {
  response.render('pages/about');
});

app.get('/form', function (request, response) {
  response.render('pages/form');
});

app.get('/healingvoices', function (request, response) {
  // load healing-voices.json
  var content = fs.readFileSync('data/healing-voices.json');
  var hvItems = JSON.parse(content);
  hvItems = hvItems.items;
  response.render('pages/healingvoices', {
    hvItems: hvItems
  });
});

app.get('/healingvoices/valeriesmith', function (request, response) {
  // load media.json
  var content = fs.readFileSync('data/healing-voices.json');
  var hvItems = JSON.parse(content);
  hvItems = hvItems.items[0]; 
  response.render('pages/healingvoices/valeriesmith', {
    hvItems: hvItems
  });
});

app.get('/media', function (request, response) {
  // load media.json
  var content = fs.readFileSync('data/media.json');
  var mediaItems = JSON.parse(content);
  mediaItems = mediaItems.items;
  response.render('pages/media', {
    mediaItems: mediaItems
  });
});

app.get('/media/reforma', function (request, response) {
  // load media.json
  var content = fs.readFileSync('data/media.json');
  var mediaItems = JSON.parse(content);
  mediaItems = mediaItems.items[0]; 
  response.render('pages/media/reforma', {
    mediaItems: mediaItems
  });
});

app.get('/media/mileno', function (request, response) {
  // load media.json
  var content = fs.readFileSync('data/media.json');
  var mediaItems = JSON.parse(content);
  mediaItems = mediaItems.items[1]; 
  response.render('pages/media/mileno', {
    mediaItems: mediaItems
  });
});

app.get('/media/ruidoenlared', function (request, response) {
  // load media.json
  var content = fs.readFileSync('data/media.json');
  var mediaItems = JSON.parse(content);
  mediaItems = mediaItems.items[2]; 
  response.render('pages/media/ruidoenlared', {
    mediaItems: mediaItems
  });
});

app.get('/media/piedepagina', function (request, response) {
  // load media.json
  var content = fs.readFileSync('data/media.json');
  var mediaItems = JSON.parse(content);
  mediaItems = mediaItems.items[3]; 
  response.render('pages/media/piedepagina', {
    mediaItems: mediaItems
  });
});



app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
