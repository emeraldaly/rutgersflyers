//database setup
var mysql = require('mysql');
var Sequelize = require('sequelize');
var connection = new Sequelize('rutgersflyers_db', 'root');

var User = connection.define("User", {
  lname: Sequelize.STRING,
   fname: Sequelize.STRING,
   password: Sequelize.STRING,
   email: Sequelize.STRING 
});

exports.UserX = User;


connection.sync();



User.bulkCreate([
	{ lname: 'Bates', fname: 'Evan', password: 'tester', username: '11104eab@gmail.com' },
]);


