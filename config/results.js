var results = {

  showResults: function(table, cb) {
    var s = 'SELECT * FROM ' + table;
    connection.query(s, function(err, result) {
      if(err){ throw err }
      cb(results);
    });
  },
  showRatings: function(table, cb) {
    var s = 'SELECT * FROM ' + table;
    connection.query(s, function(err, result) {
      if(err) { throw err }
        cb(results);
    });
  },
  addVenues: function(table, venues, cb) {
    var s = 'INSERT INTO ' + table + '(name, address, phoneNumber, website) VALUES (?,?,?,?);';
    connection.query(s, [venue, address, number, website], function(err, result) {
      if (err) throw err;
      cb(results);
    });
  },
  addReview: function(table, reviews, cb) {
    var s = 'INSERT INTO ' + table + '(review, rating) VALUES (?,?);';
    connection.query(s, [review, rating], function(err, result) {
      if(err) throw err;
      cb(result);
    });
  },
};

module.exports = results;