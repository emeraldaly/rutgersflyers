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
  address2: Sequelize.STRING,
  phoneNumber:Sequelize.STRING,
  website:Sequelize.STRING,
  date: Sequelize.DATE,
  time: Sequelize.TIME

});

var Review = connection.define('Review', {
  review: Sequelize.TEXT,
  rating:{
    type:Sequelize.INTEGER,
    min: 1, 
    max:5 
  }
});


var Category = connection.define('Category', {
  category: Sequelize.STRING
});

Category.hasMany(Venue);
Venue.hasMany(Review);
Review.belongsTo(Venue);

function yelpFunc(var1, var2) {

  yelp.search({ term: var1, location: var2 })
    .then(function (data) {
      console.log(data);
    })
  .catch(function (err) {
    console.error(err);
  });
}
yelpFunc("restaurants", "new brunswick");
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
function isAuth(req, res, next) {
  if(req.isAuthenticated()){
    return next();}
  res.redirect("/?no_authorization");
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


app.post("/venuesCreate", isAuth, function(req, res) {
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
      res.redirect("/?msg=Your email is already registered, please login.");}
    else {
      User.create({
        username: req.body.username,
        lname: req.body.lname,
        fname: req.body.fname,
        email: req.body.email,
        password: saltyhash(req.body.password)
      }).then(function() {
        res.redirect("/?msg=Thanks for registering, please login.");
      });
    }
  })
});
app.get("/", function(req, res){
  Review.findAll({
    include: [
    {model:Venue}
    ],
    order: [
      //     // Will escape username and validate DESC against a list of valid direction parameters
      ['createdAt', 'DESC']
    ]
  }).then(function(Reviews) {
      res.render('sortByNewest', {msg: req.query.msg,
        Reviews : Reviews
      })
  })
})

app.get("/auth", function(req, res){
  var x = req.user.username; 
  Review.findAll({
    include: [
    {model:Venue}
    ],
    order: [
      //     // Will escape username and validate DESC against a list of valid direction parameters
      ['createdAt', 'DESC']
    ]
  }).then(function(Reviews) {
    console.dir(Reviews)
      res.render('sortByNewest', {layout: 'maina.handlebars', user: x, msg: req.query.msg, Reviews: Reviews});
  })
})



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


app.get('/transportation', function(req, res) {
  Venue.findAll({
    where: {
      CategoryId: 2},
      include: [
      {model:Review}
      ]
  }).then(function(Venues){
    res.render("transportation", {
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
    debugger
    res.render('food', {
      Venues: Venues
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

app.get('/averages', function(req,res) {

  Review.findAndCountAll({
    where: {
      VenueId: 1}
  }).then(function(TestRat) {
    res.render('test', {
      TestRat : TestRat
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

app.post('/login',
    passport.authenticate('local', {
      successRedirect: '/auth?msg=Login successful.',
      failureRedirect: '/?msg=Login unsuccessful, please check your email and password or if you haven\'t done so, please register.'
    }));
//
//logout
app.get('/logout', function (req, res){
  req.logOut();
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});


app.post('/review/:venueId', function(req, res) {
  Review.create({
    review: req.body.review,
    rating:req.body.rating,
    VenueId: req.params.venueId
  }).then(function() {
    res.redirect('back');
  });
});

connection.sync();




//  Venue.bulkCreate([
//  { name: 'The Frog and the Peach', address: '29 Dennis St', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-846-3216', website: 'frogandpeach.com', CategoryId: 1, id: 500 },
//  { name: 'RU Hungry', address: '159 College Ave.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-246-2177', website: 'http://ruhungrynj.net/', CategoryId: 1, id: 501 },
//  { name: 'Fritz\'s Restaurant', address: '115 Easton Ave.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-543-0202', website: 'www.fritzsnb.com', CategoryId: 1, id: 502 },
//  { name: 'Destination Dogs', address: '101 Paterson St.', address2: 'New Brunswick\, NJ 08901',phoneNumber:'732-993-1016', website: 'www.destinationdogs.com', CategoryId: 1, id: 503},
//  { name: 'Inboston', address: '16 Condict St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-514-0765', website: 'www.inbostonchicken.com', CategoryId: 1, id: 504 },
//  { name: 'Veganized', address: '9 Spring St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-342-7412', website: 'www.veganizedfoods.com', CategoryId: 1, id: 505 },
//  { name: 'Clydz', address: '55 Paterson St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-846-6521', website: 'www.clydz.com', CategoryId: 1, id: 506 },
//  { name: 'Esquina Latina Restaurant /& Lounge', address: '335 George St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-543-1630', website: 'www.esquinalatinarestaurant.com', CategoryId: 1, id: 507 },
//  { name: 'Diesel /& Duke', address: '1339 Easton Ave.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-246-1001', website: 'www.dieselandduke.com', CategoryId: 1, id: 508 },
//  { name: 'Chapati House', address: '349 George St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-416-8787', website: 'chapatihousenj.com', CategoryId: 1, id: 509 },
//  { name: 'KBG Korean BBQ /& Grill', address: '6 Easton Ave.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-626-5406', website: 'www.iwantkbg.com', CategoryId: 1, id: 510 },
//  { name: 'El Oaxaqueño Mexican Restaurant', address: '260 Drift St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-545-6869', website: 'eloaxaqueno.com', CategoryId: 1, id: 511 },
//  { name: 'Due Mari', address: '78 Albany St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-296-1600', website: 'duemarinj.com', CategoryId: 1, id: 512 },
//  { name: 'Efes Restaurant', address: '32 Easton Ave.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-249-4100', website: 'www.efesgrill.com', CategoryId: 1, id: 513},
//  { name: 'Sahara Restaurant', address: '165 Easton Ave.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-246-3020', website: 'www.saharacafenj.com', CategoryId: 1, id: 514 },
//  { name: 'Dashen Ethiopian Cuisine', address: '88 Albany St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-249-0494', website: 'www.destaethiopiannj.com', CategoryId: 1,  id: 515 },
//  { name: 'The Dillinger Room', address: '338 George St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-214-0223', website: 'thedillingerroom.com', CategoryId: 1, id: 516 },
//  { name: 'Steakhouse 85', address: '85 Church St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-247-8585', website: 'www.steakhouse85.com', CategoryId: 1, id: 517 },
//  { name: 'My Way Korean Restaurant', address: '351 George St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-545-5757', website: 'www.mywaynj.com', CategoryId: 1, id: 518 },
//  { name: 'Mamoun\'s Falafel Restaurant', address: '58 Easton Ave.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-640-0794', website: 'mamouns.com', CategoryId: 1, id: 519 },
//  { name: 'Stuff Yer Face', address: '49 Easton Ave.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-247-1727', website: 'www.stuffyerface.com', CategoryId: 1, id: 520 },
//  { name: 'Thomas Sweet Ice Cream', address: '55 Easton Ave.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-828-3855', website: 'www.thomassweet.com', CategoryId: 1, id: 521 },
//  { name: 'Thai Noodle', address: '174 Easton Ave.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-247-6938', website: 'www.allmenus.com', CategoryId: 1, id: 522 },
//  { name: 'Eastonthai Kitchen', address: '144 Easton Ave.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-253-7722', website: 'www.scarletmenus.com', CategoryId: 1, id: 523 },
//  { name: 'Nirvani\s Indian Kitchen', address: '56 Easton Ave.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-253-0507', website: 'www.nirvaniskitchen.com', CategoryId: 1, id: 524 },
//  { name: 'Old Man Rafferty\'s', address: '106 Albany St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-846-6153', website: 'www.oldmanraffertys.com', CategoryId: 1, id: 525 },
//  { name: 'Hidden Grounds', address: '4C Easton Ave.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-317-4117', website: 'www.thehiddengrounds.com', CategoryId: 1, id: 526 },
//  { name: 'NJ Transit', address: 'French /& Albany Sts.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '(973) 275-5555', website: 'http://www.njtransit.com/', CategoryId: 2, id: 527 },      
//  { name: 'Coach Bus', address: '750 Somerset St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-249-1100', website: 'http://www.coachusa.com/', CategoryId: 2, id: 528 },    
//  { name: 'Newark Airport', address: '3 Brewster Rd.', address2: 'Newark\, NJ 07114', phoneNumber: '973-961-6000', website: 'http://www.panynj.gov/airports/newark-liberty.html', CategoryId: 2, id: 529 },    
//  { name: 'JFK Airport', address: 'JFK Airport', address2: 'New York\, NY 11430', phoneNumber: '718-244-4444', website: 'http://www.panynj.gov/airports/jfk.html', CategoryId: 2, id: 530 },   
//  { name: 'LaGuardia Airport', address: 'LaGuardia Airport', address2: 'New York\, NY 11371', phoneNumber: '718-533-3400', website: 'http://www.panynj.gov/airports/laguardia.html', CategoryId: 2, id: 531 },    
//  { name: 'RU NextBus', address: '55 Commercial Avenue', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-932-7744', website: 'http://rudots.rutgers.edu/campusbuses.shtml', CategoryId: 2, id: 532 },  
//  { name: 'The Knight Mover', address: '55 Commercial Avenue', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-932-7433', website: 'http://rudots.rutgers.edu/campusbuses.shtml', CategoryId: 2, id: 533 },  
//  { name: 'New BrunsQuick Shuttles', address: '55 Commercial Avenue', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-932-7744', website: 'http://rudots.rutgers.edu/campusbuses.shtml', CategoryId: 2, id: 534 }, 
//  { name: 'Uber', address: 'NA', address2: 'NA', phoneNumber: 'NA', website: 'www.uber.com', CategoryId: 2, id: 535 },  
//  { name: 'Library Shuttle', address: '55 Commercial Avenue', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-932-7744', website: 'http://rudots.rutgers.edu/campusbuses.shtml', CategoryId: 2, id: 536 },   
//  { name: 'All Brunswick Taxi', address: '139 Easton Ave.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-545-0900', website: 'http://www.yelp.com/biz/all-brunswick-taxi-new-brunswick', CategoryId: 2, id: 537 }, 
//  { name: 'Yellow Cab of New Brunswick', address: 'NA', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-246-2222', website: 'http://www.yellowcabnewbrunswick.com/', CategoryId: 2, id: 538 }, 
//  { name: 'ALLO Taxi', address: 'NA', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-214-1111', website: 'www.allotaxi.com', CategoryId: 2, id: 539 }, 
//  { name: 'SEPTA', address: '1234 Market Street.', address2: 'Philadelphia\, PA 19107', phoneNumber: '(215) 580-7800', website: 'http://www.septa.org/', CategoryId: 2, id: 540 },  
//  { name: 'PATH', address: 'NA', address2: 'NA', phoneNumber: '800-234-7284', website: 'http://www.panynj.gov/path/', CategoryId: 2, id: 541 },
//  { name: 'Key Foods', address: '95 Paterson St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-317-0590', website: 'http://www.keyfoodnewbrunswick.com/', CategoryId: 3, id: 542 },
//  { name: 'Robert Wood Johnson Fitness /& Wellness Center', address: '100 Kirkpatrick St., Suite 201', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-873-1222', website: 'http://rwjfitnesswellness.com/', CategoryId: 3, id: 543 },
//  { name: 'George Street Co-Op', address: '89 Morris St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-247-8280', website: 'http://georgestreetcoop.com/', CategoryId: 3, id: 544 },
//  { name: 'New Brunswick Post Office', address: '86 Bayard St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-545-6819', website: 'www.usps.com', CategoryId: 3, id: 545 },
//  { name: 'Saint Peter\'s University Hospital', address: '254 Easton Ave.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-745-8600', website: 'www.saintpetershcs.com', CategoryId: 3, id: 546 },
//  { name: 'Robert Wood Johnson University Hospital', address: '1 Robert Wood Johnson Pl.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-828-3000', website: 'www.rwjuh.edu', CategoryId: 3, id: 547 },
//  { name: 'Sparks Hair Design', address: '72 Easton Ave.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-828-1414', website: 'http://www.sparkshairdesign.com/', CategoryId: 3, id: 548 },
//  { name: 'Moda Hair Salon', address: '16 Easton Ave.', address2: 'New Brunswick/, NJ 08901', phoneNumber: '732-249-3636', website: 'http://modasalonnj.com/', CategoryId: 3, id: 549 },
//  { name: 'State Theater', address: '89 Morris St.', address2: 'New Brunswick\, NJ 08901', phoneNumber: '732-246-7469', website: 'http://www.statetheatrenj.org/', CategoryId: 3, id: 550 },
// { name: 'Organic Open Mic at the Cafe', address: '89 Morris St.', address2: 'New Brunswick\, NJ 08901', date: '2016-03-03', time: '19:00:00', phoneNumber: '732-247-8280', website: 'http://georgestreetcoop.com/', CategoryId: 4, id: 551 },
//  { name: 'Organic Open Mic at the Cafe', address: '89 Morris St.', address2: 'New Brunswick\, NJ 08901', date: '2016-03-10', time: '19:30:00', phoneNumber: '732-247-8280', website: 'http://georgestreetcoop.com/', CategoryId: 4, id: 552 },
//  { name: 'International Women\'s Day', address: '89 Morris St.', address2: 'New Brunswick\, NJ 08901', date: '2016-03-08', phoneNumber: '732-247-8280', website: 'http://georgestreetcoop.com/', CategoryId: 4, id: 553 },
// { name: 'The Positive Potluck', address: '89 Morris St.', address2: 'New Brunswick\, NJ 08901', date: '2016-03-11', time: '19:00:00', phoneNumber: '732-247-8280', website: 'http://georgestreetcoop.com/', CategoryId: 4, id: 554 },
// { name: 'Cult of Lunacy comedy show', address: '89 Morris St.', address2: 'New Brunswick\, NJ 08901', date: '2016-03-12', time: '19:00:00', phoneNumber: '732-247-8280', website: 'http://georgestreetcoop.com/', CategoryId: 4, id: 555 },
// { name: 'Lovey Williams: One Man Band', address: '15 Livingstonn Ave.', address2: 'New Brunswick\, NJ 08901', date: '2016-03-05', time: '10:00:00', phoneNumber: '732-246-7469', website: 'http://www.statetheatrenj.org/', CategoryId: 4, id: 556 },
// { name: 'Vienna Mozart Orchestra', address: '15 Livingstonn Ave.', address2: 'New Brunswick\, NJ 08901', date: '2016-03-05', time: '20:00:00', phoneNumber: '732-246-7469', website: 'http://www.statetheatrenj.org/', CategoryId: 4, id: 557 },
// { name: 'Galumpha', address: 'Cross Roads Theatre', address2: 'New Brunswick\, NJ 08901', date: '2016-03-06', time: '14:00:00', phoneNumber: '732-246-7469', website: 'http://www.statetheatrenj.org/', CategoryId: 4, id: 558 },
// { name: 'Howie Mandel', address: '15 Livingstonn Ave.', address2: 'New Brunswick\, NJ 08901', date: '2016-03-10', time: '20:00:00', phoneNumber: '732-246-7469', website: 'http://www.statetheatrenj.org/', CategoryId: 4, id: 559 },
// { name: 'The Chieftains', address: '15 Livingstonn Ave.', address2: 'New Brunswick\, NJ 08901', date: '2016-03-11', time: '20:00:00', phoneNumber: '732-246-7469', website: 'http://www.statetheatrenj.org/', CategoryId: 4, id: 560 },
// { name: 'Bobby Bandiera\'s Tribute to Bruce Springstein/, Bon Jovia/, Southside Johnny/, and Others', address: '15 Livingston Ave.', address2: 'New Brunswick\, NJ 08901', date: '2016-03-12', time: '20:00:00', phoneNumber: '732-246-7469', website: 'http://www.statetheatrenj.org/', CategoryId: 4, id: 561 } 
//  ]);
//Category.bulkCreate([
 //   { category: 'Food' },
  //  { category: 'Transportation' },
  //  { category: 'Services'},
  //  { category: 'Events' }

//]);
//Food
// Review.bulkCreate([
// { review: 'Really the best restaurant place for those so inclined to such things.', rating: '5', VenueId: 500 },
// { review: 'So amazing! Can\'t wait to go back again. Definitely recommend', rating: '5', VenueId: 501 },
// {review: 'Awful service. But the food is good.', rating: '3', VenueId: 502},
// {review: 'Such a great spot! Definitely a highlight in New Brunswick. This is going to be a regular place for me!', rating: '5', VenueId: 503},
// {review: 'Wish they had more selection. The ambience was meh. Good prices.', rating: '4', VenueId: 504},
// {review: 'Perfect if you\'re hungry. Bring your appetite!', rating: '5', VenueId: 505},
// {review: 'Hit the spot!', rating: '5', VenueId: 506},
// {review: 'Such great staff. They made us feel very welcome and gave us extra bread!', rating: '5', VenueId: 507},
// {review: 'Will never go back. We waited for over an hour to be seated. Our food was cold. And the waiter was very rude.', rating: '1', VenueId: 508},
// {review: 'A great find. The service, the food, and the location. It was a great meal and fast!', rating: '5', VenueId: 509},
// {review: 'Spicy, spicy, spicy. Yum :D', rating: '5', VenueId: 510},
// {review: 'A bit overpriced in my opinion.', rating: '3', VenueId: 511},
// {review: 'Difficult to find parking. But the food was good.', rating: '4', VenueId: 512},
// {review: 'Will definitely bring my friends here when they visit. Very good food.', rating: '5', VenueId: 513},
// {review: 'Great variety on the menu! A bit of a wait.', rating: '4', VenueId: 514},
// {review: 'Delicious. A bit loud which made catching up difficult.', rating: '4', VenueId: 515},
// {review: 'An outrage. How are they still in business? Will never go back here again.', rating: '1', VenueId: 516},
// {review: 'I loved the vibe. Great place.', rating: '5', VenueId: 517},
// {review: 'Scrumptious. Best meal I\'ve had all week.', rating: '5', VenueId: 518 },
// {review: 'I expect a lot when I go out and this fit the bill. The price was right. The service was good but not in my face. And the menu had a good selection.', rating: '5', VenueId: 519},
// {review: 'This was a great place to relax and catch up with friends. I\'ll be back!', rating: '5', VenueId: 520},
// {review: 'I had a great time here. The food was simple with no fuss. It hit the spot.', rating: '5', VenueId: 521},
// {review: 'So glad this restaurant came to New Brunswick! Perect for my busy schedule.', rating: '5', VenueId: 522},
// {review: 'The restaurant was ok. Not too much flavor.', rating: '3', VenueId: 523},
// {review: 'Classic!', rating: '5', VenueId: 524},
// {review: 'Greasy food. Poor service.', rating: '2', VenueId: 525},
// {review: 'Splendid evening. Good eats.', rating: '4', VenueId: 526},
// {review: 'They had live music and the food was delicious!', rating: '5', VenueId: 500},
// {review: 'Wonderful spot to get work done and get something to eat', rating: '5', VenueId: 501},
// {review: 'This is one of my favorite spots in New Brunswick!', rating: '5', VenueId: 502},
// {review: 'I eat here almost every day. I wish they delivered', rating: '4', VenueId: 503},
// {review: 'This is really good value and food. Get there early as it gets crowded quickly!', rating: '4', VenueId: 504},
// {review: 'You need a reservation. Very popular location! Worth the wait.', rating: '5', VenueId: 505},
// {review: 'This is a great place to go to study for midterms. There is space to spread out your books. The coffee is good and affordable!', rating: '5', VenueId: 506},
// {review: 'They know me by name! Very personable staff.', rating: '5', VenueId: 507},
// {review: 'This is a must go to in New Brunswick. The food isn\'t the best, but it\'s a tradition!', rating: '5', VenueId: 508},
// {review: 'Great selection and flavor.', rating: '5', VenueId: 509},
// {review: 'This is the best spot to go! I highly recommend you try this restaurant. Scrumptiousdeliocious!', rating: '5', VenueId: 510},
// {review: 'If you\'re looking for a good meal that is affordable. This is a great spot!', rating: '5', VenueId: 511},
// {review: 'The bathrooms are gross. The service is not great. It is a fast place to get a meal, but definitely nothing special.', rating: '3', VenueId: 512},
// {review: 'Perfect spot for busy students. I eat here all the time. Good price. Good food. Good wifi.', rating: '5', VenueId: 513},
// {review: 'The food is good. The setting isn\'t anything special.', rating: '4', VenueId: 514},
// {review: 'Definitely worth checking this place out! The food was good. They split our bill amongst a big group.', rating: '5', VenueId: 515},
// {review: 'I proposed to my wife here. It is a special spot!', rating: '5', VenueId: 516},
// {review: 'Two thumbs up. Great menu and service. Clean and fun decor.', rating: '5', VenueId: 517},
// {review: 'Simple and fast.', rating: '4', VenueId: 518},
// {review: 'They have trivia nights every Thursday and karaoke on Mondays. Great spot to come with friends.', rating: '5', VenueId: 519}, 
// {review: 'I always come here after class. Great place to recharge.', rating: '5', VenueId: 520},
// {review: 'Love this place. Definitely recommend.', rating: '5', VenueId: 521}
// ]);

// Review.bulkCreate([
// {review: 'NJ Transit makes getting to NY very easy!', rating: '5', VenueId: 527},
// {review: 'NJ Transit is always on time.', rating: '5', VenueId: 527},
// {review: 'The Coach bus is a great way to get to NY. More affordable than the train!', rating: '5', VenueId: 528},
// {review: 'The Coach bus was gross. It smelled. Horrible.', rating: '3', VenueId: 528},
// {review: 'It is really convenient to get the Newark Airport from New Brunswick. Competitive flight prices too!', rating: '5', VenueId: 529},
// {review: 'Newark Airport is convenient. But why does it cost more to get there than to NYC??', rating: '3', VenueId: 529},
// {review: 'JFK Airport goes everywhere in the world. Super convenient.', rating: '5', VenueId: 530},
// {review: 'Such a pain to get to JFK.', rating: '3', VenueId: 530},
// {review: 'LaGuardia is hard to get to, but you can get anywhere from there!', rating: '4', VenueId: 531},
// {review: 'My favorite airport is LaGuardia. However, I hate to fly. So, maybe I\'m not the best judge.', rating: '2', VenueId: 531},
// {review: 'RU Nextbus goes everywhere, but there are so many people competiting for seats and on the weekends they don\'t run enough.', rating: '3', VenueId: 532},
// {review: 'RU Nextbus has made it possible to avoid having a car! Woot.', rating: '5', VenueId: 532},
// {review: 'The Knight Mover is the cool way to get around', rating: '5', VenueId: 533},
// {review: 'How are you going to get there? The KNIGHT RIDER. Expect a long wait.', rating: '3', VenueId: 533},
// {review: 'New BrunsQuick Shuttles really is faster. Call ahead!', rating: '4', VenueId: 534},
// {review: 'I\'m glad there are several options of how to get around.', rating: '4', VenueId: 534},
// {review: 'Who wants to wait for a bus or bother with tip. I always Uber to get where I need to be. They recently reduced the fares in NJ!', rating: '5', VenueId: 535},
// {review: 'Uber is the most efficient way to get around. Avoid the hassle of finding parking.', rating: '5', VenueId: 535},
// {review: 'Who approves these drivers? Scary.', rating: '2', VenueId: 535},
// {review: 'Who has heard of the Library shuttle?', rating: '4', VenueId: 536},
// {review: 'Everyone loves the library.. best mode of transport!', rating: '5', VenueId: 536},
// {review: 'I\'m old school all the way and like this taxi service.', rating: '4', VenueId: 537},
// {review: 'The taxi is overpriced and takes forever.', rating: '1', VenueId: 537},
// {review: 'What is with these price hike periods? I\'d rather walk', rating: '3', VenueId: 535},
// {review: 'Yellow Cab all the way!', rating: '5', VenueId: 538},
// {review: 'Yellow Cab is the devil.', rating: '2', VenueId: 538},
// {review: 'Allo I want a taxi sir. Great service.', rating: '4', VenueId: 539},
// {review: 'They never came. Horrible.', rating: '1', VenueId: 539},
// {review: 'SEPTA makes it easy to get to Philly.', rating: '5', VenueId: 540},
// {review: 'You have to change at Trenton, but it gets you to Philly and around PA.', rating: '5', VenueId: 540},
// {review: 'The PATH gets you to Jersey City and into the city.', rating: '4', VenueId: 541},
// {review: 'Crazy people on the bus.', rating: '3', VenueId: 541},
// {review: 'There are so many ways to get around!', rating: '4', VenueId: 541}
// ]);

// //Services
// Review.bulkCreate([
// {review: 'Key Foods gives free rides home! And there is a 5% discount for Rutgers students.', rating: '5', VenueId: 542},
// {review: 'Key Foods has a great selection.', rating: '4', VenueId: 542},
// {review: 'Robert Wood Johnson Fitness /& Wellness Center has the absolute best trainers!', rating: '5', VenueId: 543},
// {review: 'Robert Wood Johnson Fitness /& Wellness Center motivates me to get in shape. I love starting my day at this gym.', rating: '5', VenueId: 543},
// {review: 'George Street Co-Op is a bit pricey, but it\'s worth it for the quality of the products. Also has fun events! A real community.', rating: '5', VenueId: 544},
// {review: 'George Street Co-Op is too expensive.', rating: '4', VenueId: 544},
// {review: 'New Brunswick Post Office has a convenient location and good hours.', rating: '5', VenueId: 545},
// {review: 'New Brunswick Post Office has good service.', rating: '5', VenueId: 545},
// {review: 'Saint Peter\'s University Hospital took care of my family!', rating: '5', VenueId: 546},
// {review: 'Saint Peter\'s University Hospital was comfortable and professional.', rating: '4', VenueId: 546},
// {review: 'Robert Wood Johnson University Hospital lived up to its reputation.', rating: '5', VenueId: 547},
// {review: 'Robert Wood Johnson University Hospital helped make a difficult situation more comfortable.', rating: '4', VenueId: 547},
// {review: 'Sparks Hair Design always gives me a great cut.', rating: '5', VenueId: 548},
// {review: 'Sparks Hair Design is my go to salon.', rating: '5', VenueId: 548},
// {review: 'State Theatre has so many great shows. We love bringing our family here.', rating: '5', VenueId: 550},
// {review: 'Going to the State Theatre is a great break from studying.', rating: '5', VenueId: 550},
// {review: 'The State Theatre brings in so many great shows. Wish there were more kid shows.', rating: '4', VenueId: 550},
// {review: 'State Theatre is a nice theatre!', rating: '5', VenueId: 550},
// {review: 'Moda Hair Salon knows how to style hair excellently.', rating: '5', VenueId: 549},
// {review: 'Moda Hair Salon has great customer service.', rating: '4', VenueId: 549},
// {review: 'This was my first time at Moda Hair Salon. I\'d come back!', rating: '4', VenueId: 540},
// {review: 'Saint Peter\'s University Hospital was very professional. Obviously most visits to the hospital are difficult.', rating: '3', VenueId: 546},
// {review: 'George Street Co-Op feels like a real community! Love the quality.', rating: '5', VenueId: 544},
// {review: 'Key Foods has everything I needed and they drove me home!', rating: '4', VenueId: 542},
// {review: 'Robert Wood Johnson Fitness \& Wellness Center helped me lose 30 lbs with the #2 requested trainer of the gym!', rating: '5', VenueId: 543}
// ]);


// //Events
// Review.bulkCreate([
// {review: 'Met so many great people.', rating: '5', VenueId: 551},
// {review: 'Started on time, but not many people attended.', rating: '4', VenueId: 551},
// {review: 'Looking forward to this event!', rating: '5', VenueId: 552},
// {review: 'Fun time!', rating: '4', VenueId: 552},
// {review: 'Fun event!', rating: '5', VenueId: 553},
// {review: 'Great performance!', rating: '5', VenueId: 553},
// {review: 'So fun to get out and relax here.', rating: '4', VenueId: 554},
// {review: 'A nice break from studying!', rating: '3', VenueId: 554},
// {review: 'NY is close, but New Brunswick has great events too!', rating: '5', VenueId: 557},
// {review: 'Had a nice time!', rating: '5', VenueId: 557},
// {review: 'Looking forward to coming back.', rating: '5', VenueId: 556},
// {review: 'I saw this last year. I\'d like something new!.', rating: '4', VenueId: 556},
// {review: 'Subpar.', rating: '3', VenueId: 556},
// {review: 'My view was blocked and the staff talked through the performance.', rating: '4', VenueId: 557},
// {review: 'Enjoyed my time here!.', rating: '4', VenueId: 557},
// {review: 'Looking forward to coming back. Always have a god time.', rating: '5', VenueId: 558},
// {review: 'Could use a bit of a pick-up in the decor.', rating: '4', VenueId: 558},
// {review: 'Superb time!!', rating: '5', VenueId: 559},
// {review: 'I\'d rather go to NY. Not much of a comparison.', rating: '3', VenueId: 559},
// {review: '5 stars!!', rating: '5', VenueId: 560},
// {review: 'There was no intermission and the tickets were steep!', rating: '3', VenueId: 560},
// {review: 'Lovely time.', rating: '5', VenueId: 561},
// {review: 'Great family event!', rating: '5', VenueId: 561}
// ]);


//database connection
app.listen(PORT, function() {
  console.log("Listening on:" + PORT)
});
