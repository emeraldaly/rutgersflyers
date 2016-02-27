//express setup
var express = require('express');
var app = express();
var PORT = process.env.NODE_ENV || 9000;
var expressHandlebars = require('express-handlebars');
//passport
var passport = require('passport');
var passportLocal = require('passport-local');
//var session = require('express-session');

//bcrypt
var bcrypt = require("bcryptjs");

//bodyParser
var bodyParser = require('body-parser');

//middleware
app.use(express.static('public'));
app.use(require('express-session')({
  secret: "rutgerpridesecrets",
  resave: true,
  saveUninitialized: true,
  cookie: {secure: false, maxAge: (1000 * 60 * 60 * 24 * 30) },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({
    extended: false
}));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    done(null, { id: id, username: id })
});
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
var routes = require('./controllers/rutgersController.js');
app.use('/', routes);

//database connection
  app.listen(PORT, function() {
      console.log("Listening on:" + PORT)
  });
