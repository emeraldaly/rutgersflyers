//database setup
var mysql = require('mysql');
var Sequelize = require('sequelize');

var connection = new Sequelize('rutgersflyers_db', 'root');


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

exports.UserX = User;


 var Category = connection.define('Category', {
  category: Sequelize.STRING
 });

exports.CategoryX = Category;

 var Venue = connection.define('Venue', {  
 name:  Sequelize.STRING,
 address: Sequelize.STRING,
 phoneNumber:Sequelize.STRING,
 website:Sequelize.STRING 
 });

exports.VenueX = Venue;
 
 var Review = connection.define('Review', {
 review: Sequelize.TEXT,
 rating:{
  type:Sequelize.INTEGER,
   min: 1, 
   max:5 
  },
 });
 
exports.ReviewX = Review;

 Category.hasMany(Venue);
 Venue.hasMany(Review);
 


connection.sync();



// User.bulkCreate([
// 	{ lname: 'Bates', fname: 'Evan', password: 'tester', username: '11104eab', email:'111104eab@gmail.com' },
//    { lname: 'Svenson', fname: 'Richard', password: 'tester', username: 'Richardinhouse', email:'richardinhouse@gmail.com' },
//    { lname: 'Varga', fname: 'Taylor', password: 'tester', username: 'cuttlefish01', email:'cuttlefish@gmail.com' },
//    { lname: 'Wong', fname: 'Kaleigh', password: 'tester', username: 'kwong1', email:'kwong1@gmail.com' },
//    { lname: 'Blackwell', fname: 'Hillary', password: 'tester', username: 'hblackwell', email:'hblackwell@gmail.com' },
//    { lname: 'Tryst', fname: 'Tristan', password: 'tester', username: 'tt_ru', email:'tt_ru@gmail.com' }
// ]);

// Venue.bulkCreate([
// { name: 'The Frog and the Peach', address: '29 Dennis St', phoneNumber: '(732)846-3216', website: 'frogandpeach.com' },
// { name: 'RU Hungry', address: 'New Brunswick', phoneNumber: '(732)246-2177', website: 'http://ruhungrynj.net/' }
// { name: 'NJ Transit', address: 'French & Albany Sts., New Brunswick, NJ 08901', phoneNumber: '(973) 275-5555', website: 'http://www.njtransit.com/' }      
// { name: 'NJ Bus Station', address: '750 Somerset St., New Brunswick, NJ 08901', phoneNumber: '(732) 249-1100', website: 'http://www.coachusa.com/' }    
// { name: 'Newark Airport', address: '3 Brewster Rd, Newark, NJ 07114', phoneNumber: '(973) 961-6000', website: 'http://www.panynj.gov/airports/newark-liberty.html' }    
// { name: 'JFK Airport', address: 'New York, NY 11430', phoneNumber: '(718) 244-4444', website: 'http://www.panynj.gov/airports/jfk.html' }    
// { name: 'LaGuardia Airport', address: 'New York, NY 11371', phoneNumber: '(718) 533-3400', website: 'http://www.panynj.gov/airports/laguardia.html' }    
// { name: 'RU NextBus', address: '', phoneNumber: '', website: '' }    
// { name: 'Uber', address: '', phoneNumber: '', website: '' }    
// { name: 'Yellow Cab', address: '', phoneNumber: '', website: '' } 
// { name: 'SEPTA', address: '1234 Market Street, Philadelphia, PA 19107', phoneNumber: '(215) 580-7800', website: 'http://www.septa.org/' }  
// { name: 'PATH', address: '', phoneNumber: '', website: 'http://www.panynj.gov/path/' }         
// ]);

// Category.bulkCreate([
//   { category: 'Food' },
//   { category: 'Transportation' },
//   { category: 'Services'},
//   { category: 'Events' }

//   ]);



