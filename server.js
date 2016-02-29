//express setup
var express = require('express');
var app = express();
var PORT = process.env.PORT || 9000;
var expressHandlebars = require('express-handlebars');
//code below is for used for partials


//passport
var passport = require('passport');
var session = require('express-session');
//bcrypt
var bcrypt = require("bcryptjs");

//bodyParser
var bodyParser = require('body-parser');
require("dotenv").config();
var LocalStrategy = require('passport-local').Strategy;
var yelpyodel = require('yelp');
var mysql = require('mysql');
var Sequelize = require('sequelize');
if(process.env.NODE_ENV === 'production') {
  // HEROKU DB
  console.log(process.env.JAWSDB_URL);

  var connection = new Sequelize(process.env.JAWSDB_URL);
}
else {
  // LOCAL DB
  var connection = new Sequelize('rutgersflyers_db', 'root');
}
var yelp = new yelpyodel({
  consumer_key: 'YyYLFGh2r0HzFGhENX21YA',
  consumer_secret: 'echqVZjby1_xDWMOwW1twwIE0is',
  token: 'BpQbEeWyTT0vEiek3OI8OiZisCVvPucX',
  token_secret: '7PYYhCqDr8awrETlGYWHEiCW__M'
});
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


var hbs = require('express-handlebars').create();
 
hbs.getPartials().then(function (partials) {
    console.log(partials);
    });

var User = connection.define ('User',{
 username : {
    type : Sequelize.STRING,
    unique : true,
    allowNull: false
  },
   password: {
    type:Sequelize.STRING,
    unique: true,
    allowNull:false
   },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lname: Sequelize.STRING,
  fname: Sequelize.STRING
 });

 var Venue = connection.define('Venue', {  
 name:  Sequelize.STRING,
 address: Sequelize.STRING,
 phoneNumber:Sequelize.STRING,
 website:Sequelize.STRING 
 });

 var Review = connection.define('Review', {
 review: Sequelize.TEXT,
 rating:{
  type:Sequelize.INTEGER,
   min: 1, 
   max:5 
  },
 });

 var Category = connection.define('Category', {
  category: Sequelize.STRING
 });
  Category.hasMany(Venue);
 Venue.hasMany(Review);

function yelpFunc(var1, var2) {

  yelp.search({ term: var1, location: var2 })
.then(function (data) {
  console.log(data);
})
.catch(function (err) {
  console.error(err);
});
}

//passport definition and bcrypt check
passport.use('local', new LocalStrategy({
  passReqToCallback: true,
  usernameField: 'email',
  passwordField: "password"
},
function(req, email, password, done) {
  User.findOne({
    where: {
      email: email
    }
  })
  .then(function(user){
    if(user){
      bcrypt.compare(password, user.dataValues.password, function(err, user) {
        if (user) {
          console.log(user);
          //if password is correct authenticate the user with cookie
          done(null, { id: email, username: email });
        } else{
          done(null, null);
        }
      });
    } else {
      done(null, null);
    }
  });
}));

//bcrypt define
function saltyhash(pass) {
  var salt = bcrypt.genSaltSync(10);
  console.log(salt);
  var hash = bcrypt.hashSync(pass, salt);
  return hash;
}


//ROUTES
//call yelp API

//register get and post
app.get('/register', function(req, res) {
  console.log(req.query.msg);
  res.render("register", {
    msg: req.query.msg
  });
});


app.post("/venuesCreate", function(req, res) {
 Venue.create({
    name:req.body.name,
    address:req.body.address,
    phoneNumber:req.body.phoneNumber,
    website:req.body.website,
    CategoryId:req.body.CategoryId
    }).then(function() {
    res.redirect('/');
})
});

app.post("/register", function(req, res){
  console.log(req.body);
  User.findOne({where: {email: req.body.email}}).then(function(results) {
    if(results){
      res.redirect("/login?msg=Your email is already registered. Please login");}
    else {
      User.create({
        username: req.body.username,
        lname: req.body.lname,
        fname: req.body.fname,
        email: req.body.email,
        password: saltyhash(req.body.password)
      }).then(function() {
        console.log(req.user);
        res.redirect("/login?msg=Thanks for registering, please login.");
      });
    }
  })
});


app.get("/", function(req, res) {
  res.redirect("/food");
});

app.get("/events", function(req, res) {
  Venue.findAll({
    where: {
      CategoryId: 4},
    include: [
    {model: Review}
    ]
  }).then(function(Venues){
    res.render("events", {Venues: Venues})
  });
});

app.get("/services", function(req, res) {
  Venue.findAll({
    where: {
      CategoryId: 3},
    include: [
    {model:Review}
    ]
  }).then(function(Venues){
    res.render("services", {
      Venues: Venues
    })
  });
});

app.get('/food', function(req,res) {
  Venue.findAll({
    where: {
      CategoryId: 1},
    include: [
      {model:Review}
    ]
  }).then(function(Venues) {
    res.render('food', {
      Venues : Venues
    })
});
  });

app.get('/food/:p', function(req,res) {
  var x = req.params.p;
  console.log(x);
  Venue.findAll({
    where: {
      "id" : x},
    include: [
      {model:Review}
    ]
  }).then(function(Venues) {
    res.render('foodDetail', {
      Venues: Venues
    })
});
  });

app.get('/events/:p', function(req,res) {
  var x = req.params.p;
  
  console.log(x);
  Venue.findAll({
    where: {
      "id" : x},
    include: [
      {model:Review}
    ]
  }).then(function(Venues) {
    res.render('eventsDetail', {
      Venues : Venues
    })
});
  });

app.get('/services/:p', function(req,res) {
  var x = req.params.p;
  Venue.findAll({
    where: {
      "id" : x},
    include: [
      {model:Review}
    ]
  }).then(function(Venues) {
    res.render('servicesDetail', {
      Venues : Venues
    })
});
  });

app.get('/transportation/:p', function(req,res) {
  var x = req.params.p;
  console.log(x);
  Venue.findAll({
    where: {
      "id" : x},
    include: [
      {model:Review}
    ]
  }).then(function(Venues) {
    res.render('transportationDetail', {
      Venues : Venues
    })
});
  });


app.get("/transportation", function(req, res) {
  Venue.findAll({
    where: {
      CategoryId: 2},
  include: [
  {model:Review}
  ]
  }).then(function(Venues){
    res.render("transportation", {
      Venues: {Venues}
    })
  });
});


app.get('/login', function(req, res) {
  res.render('login', {
    msg: req.query.msg
  });
});

app.post('/login',
    passport.authenticate('local', {
      successRedirect: '/teachers?msg=login successful',
      failureRedirect: '/login?msg=login unsuccessful, please check your email and password or if you haven\'t done so, please register'
    }));
//logout
app.get('/logout', function (req, res){
  req.logOut();
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});
connection.sync();

// User.bulkCreate([
// 	{ lname: 'Bates', fname: 'Evan', password: 'tester', username: '11104eab', email:'111104eab@gmail.com' },
//    { lname: 'Svenson', fname: 'Richard', password: 'tester', username: 'Richardinhouse', email:'richardinhouse@gmail.com' },
//    { lname: 'Varga', fname: 'Taylor', password: 'tester', username: 'cuttlefish01', email:'cuttlefish@gmail.com' },
//    { lname: 'Wong', fname: 'Kaleigh', password: 'tester', username: 'kwong1', email:'kwong1@gmail.com' },
//    { lname: 'Blackwell', fname: 'Hillary', password: 'tester', username: 'hblackwell', email:'hblackwell@gmail.com' },
//    { lname: 'Tryst', fname: 'Tristan', password: 'tester', username: 'tt_ru', email:'tt_ru@gmail.com' }
// ]);

Review.bulkCreate([
    {review: "Really the best restaurant place for those so inclined to such things.", rating: "5"}
 ]);

//Venue.bulkCreate([
//{ name: 'The Frog and the Peach', address: '29 Dennis St', phoneNumber: '(732)846-3216', website: 'frogandpeach.com' },
// { name: 'RU Hungry', address: 'New Brunswick', phoneNumber: '(732)246-2177', website: 'http://ruhungrynj.net/' }
//]);

Category.bulkCreate([
   { category: 'Food' },
   { category: 'Transportation' },
   { category: 'Services'},
   { category: 'Events' }


   ]);
//database connection
  app.listen(PORT, function() {
      console.log("Listening on:" + PORT)
  });
