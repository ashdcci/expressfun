
/*
 * GET users listing.
 */

var mysql = require('mysql');
	var connection =  mysql.createConnection({
		  host: 'localhost',
		  user: 'root',
		  password: 'signity',
		  database: 'test'
		})
connection.connect()

exports.list = function(req, res){

// var data = [];
// data.push('test');

//   res.json(data);


res.json(JSON.stringify({ a: 1 }));

};



exports.insert = function(req, res, next){
	var rr = Math.random().toString(36).substring(7);
	var sql = 'insert into users(fname,lname,email,password)values("a","b","a@ab.cc","'+rr+'")';
	var query = connection.query(sql, function(err, result) {
	  				if(!err){
						res.end('query executed'+ result.insertId)
					}res.end(err)
});
console.log(query.sql);
};


exports.delete = function(req, res, next){
	var del = 'delete from users where id = ? ';
	var query = connection.query(del,[req.body.id],function(err, result){
		if(!err){
			res.end('row deleted');
		}res.end(err)
	});
};


exports.all_users = function(req, res, next){
	var q = 'select id,fname,date_format(created_at,"%b %d,%Y") as dt from users';
	var query = connection.query(q,function(err, result){
		if(!err){
			msg = {'status':1,'data':result};
			res.json(msg);
		}res.end(err)
	});
};

exports.single_user = function(req, res, next){
	var q = 'select id,fname,date_format(created_at,"%b %d,%Y") as dt from users where id = ? ';
	var query = connection.query(q,[req.body.id],function(err, result){
		if (err) throw err;
			if(result.length > 0){
				msg = {'status':1,'data':result};
			}else{
				msg = {'status':0,'data':result};
			}
			res.json(msg);
		
	});
};