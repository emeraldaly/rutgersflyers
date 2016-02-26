var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var models = require('../models/models.js');
var yelp = require('yelp');

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
//register get and post
router.get('/register', function(req, res) {
  console.log(req.query.msg);
  res.render("register", {
    msg: req.query.msg
  });
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

router.get("/", function(req, res) {
  res.render("home")
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
//logout
router.get('/logout', function (req, res){
  req.logOut();
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});
module.exports = router;
