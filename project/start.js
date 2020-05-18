// This file is what handles incoming requests and
// serves files to the browser, or executes server-side code

const express = require('express');
const app = express();
const locale = require('locale');
const fs = require('fs');
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
});

const supportedLocales = [
  'en',
  'es'
]

app.set('port', (process.env.PORT || 5000));

// was causing wonkiness but now seems fine
app.use(express.static(__dirname)); 

// getting image files
app.use(express.static('images'));
app.use(express.static('css'));
app.use(express.static('js'));

app.use(locale(supportedLocales))
app.use((req, res, next) => {
  // make locale available to views as `locale`
  res.locals.locale = req.locale
  next()
})

// views is directory for all template files
app.set('views', __dirname + '/html');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/index');
});

app.get('/about', function (request, response) {
  const content = fs.readFileSync(__dirname + '/data/about.en.md').toString();
  response.render('pages/about', {
    body: md.render(content)
  });
});

app.get('/form', function (request, response) {
  response.render('pages/form');
});

app.get('/healingvoices', function (request, response) {
  // load healing-voices.json
  const content = fs.readFileSync(__dirname + '/data/healing-voices.json');
  const hvItems = JSON.parse(content).items;
  response.render('pages/healingvoices', {
    hvItems: hvItems
  });
});

app.get('/media', function (request, response) {
  // load media.json
  var content = fs.readFileSync(__dirname + '/data/media.json');
  var mediaItems = JSON.parse(content);
  mediaItems = mediaItems.items;
  response.render('pages/media', {
    mediaItems: mediaItems
  });
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
