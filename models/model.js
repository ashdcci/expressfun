	// File : models/model.js -->
	var model = function() {
		db = require('../config/db');
	};

var RedisMiddleware = require('../middlewares/RedisMiddleWare');
var crypto = require('crypto');
	model.prototype.execute = function(sql,callback){
		db.query(sql,function(err,rows){
			  		callback(err, rows);
		});
	};


		model.prototype.execute1 = function(query,ttl,callback){
			var cache = true;

			// If no time to live (ttl)  caching disabled
			if (typeof ttl !== 'number') {
				next = ttl;
				cache = false;
			}

			if (cache) {

					var hash = crypto.createHash('sha1').update(query).digest('hex');

					RedisMiddleware.getQueryCache(hash, function(err, data) {
						// console.log('data=> '+data);
						if (err || !data) {
							db.query(query,function(err,result){
								RedisMiddleware.setQueryCache(hash, ttl, result, function(err, data) {

									if (err || !data) return next(console.log('Error getting redis cache'));
									callback(err, result);

								});
							});

						} else {
							callback(err,data);
						}
					});

				} else {
					db.query(query,function(err,result){
							callback(err, result);

					});
				}



		};


	module.exports = new model();

	function _execute(query,ttl,cache,next){
		var hash = crypto.createHash('sha1').update(query).digest('hex');
		db.query(query,function(err,result){

			if (cache) {
				RedisMiddleware.setQueryCache(hash, ttl, result.json, function(err, data) {

					if (err || !data) return next(console.log('Error getting redis cache'));
					next(result);
				});

			} else {
				// return result;
				next(result);
			}

		});



	}
