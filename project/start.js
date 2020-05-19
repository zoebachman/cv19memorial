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
  // override Accept-Language browser locale if URL has ?lang=* query
  if (req.query.lang) {
    req.locale = req.query.lang
  }
  // make locale available to views as <%= locale %>
  res.locals.locale = req.locale
  next()
})

// views is directory for all template files
app.set('views', __dirname + '/html');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/index');
});

app.get('/about', function (request, response, next) {
  const contentFile = `${__dirname}/content/about.${request.locale}.md`
  if (!fs.existsSync(contentFile)) {
    response.status(404).send(`404: Language "${request.locale}" not supported<br><br>Try <a href="${request.path}">this one</a>.`)
    return next()
  }
  const content = fs.readFileSync(contentFile).toString();
  response.render('pages/about', {
    body: md.render(content)
  });
});

app.get('/form', function (request, response) {
  response.render('pages/form');
});

app.get('/healingvoices', function (request, response, next) {
  const contentFile = `${__dirname}/content/healing-voices.${request.locale}.md`
  if (!fs.existsSync(contentFile)) {
    response.status(404).send(`404: Language "${request.locale}" not supported<br><br>Try <a href="${request.path}">this one</a>.`)
    return next()
  }
  const content = fs.readFileSync(contentFile).toString();
  response.render('pages/healing-voices', {
    body: md.render(content)
  });
});

app.get('/media', function (request, response, next) {
  const contentFile = `${__dirname}/content/media.${request.locale}.md`
  if (!fs.existsSync(contentFile)) {
    response.status(404).send(`404: Language "${request.locale}" not supported<br><br>Try <a href="${request.path}">this one</a>.`)
    return next()
  }
  const content = fs.readFileSync(contentFile).toString();
  response.render('pages/media', {
    body: md.render(content)
  });
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
