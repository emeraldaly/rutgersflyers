var y = require('yelp');
var Yelp = require('yelp');
 
var yelp = new Yelp({
  consumer_key: 'YyYLFGh2r0HzFGhENX21YA',
  consumer_secret: 'echqVZjby1_xDWMOwW1twwIE0is',
  token: 'BpQbEeWyTT0vEiek3OI8OiZisCVvPucX',
  token_secret: '7PYYhCqDr8awrETlGYWHEiCW__M'
});
 
// See http://www.yelp.com/developers/documentation/v2/search_api 
yelp.search({ term: 'food', location: 'Montreal' })
.then(function (data) {
//  console.log(data);
})
.catch(function (err) {
  console.error(err);
});
 
// See http://www.yelp.com/developers/documentation/v2/business 
yelp.business('yelp-san-francisco')
//  .then(console.log)
  .catch(console.error);
 
yelp.phoneSearch({ phone: '+15555555555' })
//  .then(console.log)
  .catch(console.error);
 
// A callback based API is also available: 
yelp.business('yelp-san-francisco', function(err, data) {
  if (err) return console.log(error);
//  console.log(data);
});

module.exports.byelp = yelp.business;
