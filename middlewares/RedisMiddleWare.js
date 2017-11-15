/* Handle Mysql related queries
*/


var redis = require('redis');
var client = redis.createClient({host : 'localhost', port : 6379});

redis.debug = true;

client.on('error',function(error){
  console.log('error on'+ error);
});

module.exports = {
	getQueryCache: getQueryCache,
	setQueryCache: setQueryCache
};


function getQueryCache(key, next) {
  // console.log('get mysql:' + key);
	client.get('mysql:' + key, function (err, result) {
		// console.log('get1=>'+err, result);
		if (err || !result) return next(err);
		return next(null, JSON.parse(result));
	});
}

function setQueryCache(key, ttl, data, next) {
	
	client.setex('mysql:' + key, ttl, JSON.stringify(data), function(err, result) {
		if (err || !result) return next(err);
		return next(null, result);
	});
}
