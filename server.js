//express setup
var express = require('express');
var app = express();
var PORT = process.env.NODE_ENV || 8080;

var expressHandlebars = require('express-handlebars');

//database setup
//update name of database!
var Sequelize = require('sequelize');
var connection = new Sequelize('rutgersflyers_db', 'root');

//passport
var passport = require('passport');
var passportLocal = require('passport-local');

//bcrypt
var bcrypt = require("bcryptjs");

//bodyParser
var bodyParser = require('body-parser');

//middleware
app.use(require('express-session')({
  secret: "rutgerpridesecrets",
  resave: true,
  saveUninitialized: true,
  cookie: {secure: false, maxAge: (1000 * 60 * 60 * 24 * 30) },
}));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// database connection via sequelize
connection.sync().then(function() {
  app.listen(PORT, function() {
      console.log("Listening on:" + PORT)
  });
});
