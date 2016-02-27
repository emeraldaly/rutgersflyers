var mysql = require('mysql');
console.log(process.env.JAWSDB_URL);
var connection = mysql.createConnection(process.env.JAWSDB_URL);
console.log("connection to db");
console.log(connection);
connection.connect();
module.exports = connection;
