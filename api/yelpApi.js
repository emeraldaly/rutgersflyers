var Yelp = require('yelp');

var whatever = 'hello yelp';



var yelp = new Yelp({
 consumer_key: 'YyYLFGh2r0HzFGhENX21YA',
 consumer_secret: 'echqVZjby1_xDWMOwW1twwIE0is',
 token: 'BpQbEeWyTT0vEiek3OI8OiZisCVvPucX',
 token_secret: '7PYYhCqDr8awrETlGYWHEiCW__M',
 });
//module.exports = function(){
// See http://www.yelp.com/developers/documentation/v2/search_api 
var yelpFind = yelp.search({ term: 'food', location: 'New Brunswick' })
.then(function (data) {
 //console.log(data);
})
.catch(function (err) {
 console.error(err);

});
//}
exports.yelpFind = yelpFind;

//module.exports = yelpFind;
