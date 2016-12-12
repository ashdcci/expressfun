	// File : models/home_model.js -->

	//Common-parts-of-all-models++++++++++++++++++++++++++++++++++
	model 					= require('./model');
	var home_model 			= function(){ };
	home_model.prototype.constructor  	= home_model;
	home_model.prototype     		= model;
	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	//Fetch all contacts
	home_model.prototype.all_users = function(data,callback) {
		sql = "SELECT * FROM users";
		this.execute(sql,callback);
	};

	home_model.prototype.single_user = function(data,callback){
		sql = "select id,fname,lname,date_format(created_at,'%b %d, %Y') as dt from users where id ="+data.id+" ";
	console.log(sql,data);
	// return;
		// this.execute(sql,callback);
	};

	home_model.prototype.editProfile = function(data,callback){
		// console.log(data);
		// return;
		var sql = 'update users set '+
			' fname = case when "'+data.fname+'"<>"" then "'+data.fname+'" else fname end, '+
			' lname = case when "'+data.lname+'"<>"" then "'+data.lname+'" else lname end, '+
			' age = case when "'+data.age+'"<>"" then "'+data.age+'" else age end, '+
			' lat = case when "'+data.lat+'"<>"" then "'+data.lat+'" else lat end, '+
			' lng = case when "'+data.lng+'"<>"" then "'+data.lng+'" else lng end, '+
			' profile_pic = case when "'+data.profile_pic+'"<>"" then "'+data.profile_pic+'" else profile_pic end '+
			'where access_token = "'+data.access_token+'" ';
			console.log(sql);
			this.execute(sql,callback);
	}


	home_model.prototype.getIdByToken = function(data,callback){
		var sql = 'select id from users where access_token ="'+data.access_token+'" ';
		this.execute(sql,callback);
	}



	module.exports = new home_model();
