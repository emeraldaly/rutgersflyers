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



//User.bulkCreate([
//	{ lname: 'Bates', fname: 'Evan', password: 'tester', username: '11104eab', email:'111104eab@gmail.com' },
//]);
//Venues
//{}


