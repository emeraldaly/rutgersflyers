var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var models = require('../models/models.js');
var yelpyodel = require('yelp');

var yelp = new yelpyodel({
  consumer_key: 'YyYLFGh2r0HzFGhENX21YA',
  consumer_secret: 'echqVZjby1_xDWMOwW1twwIE0is',
  token: 'BpQbEeWyTT0vEiek3OI8OiZisCVvPucX',
  token_secret: '7PYYhCqDr8awrETlGYWHEiCW__M'
});
 
// See http://www.yelp.com/developers/documentation/v2/search_api 
function yelpFunc() {
 var  var1 = 'food';
  var var2 = "new brunswick";

  yelp.search({term:var1, location:var2})
.then(function (data) {
  console.log(data);
})
.catch(function (err) {
  console.error(err);
});
}


yelpFunc();


//passport definition and bcrypt check
passport.use('local', new LocalStrategy({
  passReqToCallback: true, 
  usernameField: 'email',
  passwordField: "password"
},
function(req, email, password, done) {
  models.UserX.findOne({ 
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
router.get('/register', function(req, res) {
  console.log(req.query.msg);
  res.render("register", {
    msg: req.query.msg
  });
});

router.post("/venuesCreate", function(req, res) {
  models.VenueX.create({
    name:req.body.name,
    address:req.body.phoneNumber,
    phoneNumber:req.body.phoneNumber,
    website:req.body.website,
    CategoryId:req.body.CategoryId
    }).then(function() {
    res.redirect('/');
})
});

router.post("/register", function(req, res){
  console.log(req.body);
  models.UserX.findOne({where: {email: req.body.email}}).then(function(results) {
    if(results){
      res.redirect("/login?msg=Your email is already registered. Please login");}
    else {
      models.UserX.create({
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
router.get('/test', function(req, res){
var x = yelp.search({term: 'food', location: 'Philadelphia'});   
//models.VenuesX.create({
  //name: data.businesses[0].name,
  //phoneNumber: data.businesses[0].display_phone,
 // website: 'www' + data.businesses[0].name + '.com', 
 // address: data.businesses[0].display_address[0]+data.businesses[0].display_address[1]
//})
});

router.get("/", function(req, res) {
  res.render("home");
})

//login get and post

router.get('/login', function(req, res) {
  res.render('login', {
    msg: req.query.msg
  });
});

router.post('/login', 
    passport.authenticate('local', {
      successRedirect: '/teachers?msg=login successful',
      failureRedirect: '/login?msg=login unsuccessful, please check your email and password or if you haven\'t done so, please register'
    }));

//results
router.get('/results', function (req, req) {
  res.render('/detailResults', {
    msg: req.query.msg
  });
});
router.get('/ctgresults', function (req, req) {
  res.render('/categoryResults', {
    msg: req.query.msg
  });
});
//logout
router.get('/logout', function (req, res){
  req.logOut();
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});
module.exports = router;
