var mysql = require('mysql');
console.log(process.env.JAWSDB_URL);
var connection = mysql.createConnection(process.env.JAWSDB_URL);
console.log("connection to db");
console.log(connection);
connection.connect();
module.exports = connection;


var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'l3855uft9zao23e2.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user     : 'n5tkx0xeokxdtu87',
  password : 'gm5xdj7gvjwjab4t',
  database : 'ky27j3b15lysjawy'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
 
  console.log('The solution is: ', rows[0].solution);
});
 
connection.end();
