// File : models/auth_model.js -->

	//Common-parts-of-all-models++++++++++++++++++++++++++++++++++
	model 					= require('./model');
	var auth_model 			= function(){ };
	auth_model.prototype.constructor  	= auth_model;
	auth_model.prototype     		= model;
	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	/*login modules start here */
	auth_model.prototype.login = function(data,callback){
		var sql = "SELECT * FROM users where email ='"+data.email+"' and password = '"+data.password+"' ";
		// console.log(sql);
		this.execute(sql,callback);
	}

	auth_model.prototype.checkMail = function(data,callback){
		var sql = "SELECT id FROM users where email ='"+data+"' ";
		this.execute(sql,callback);
	}

	auth_model.prototype.register = function(data, callback){
		var sql = 'insert into users(email,password,device_token,device_id)'+
		'values("'+data.email+'","'+data.password+'","'+data.device_token+'","'+data.device_id+'")';
		this.execute(sql,callback);
	}

	auth_model.prototype.single_user = function(data,callback){
		sql = "select * from users where id ="+data+" ";
		this.execute(sql,callback);
	};


	auth_model.prototype.updateToken = function(data,callback){
		var sql = 'update users set access_token ="'+data.access_token+'" where id = '+data.user_id+' ';
		console.log(sql);
		this.execute(sql,callback);
	}


	/* login module end here */


	// forgot password module start here
	auth_model.prototype.resetPasswordReq = function(data,callback){
		var sql = 'insert into password_resets(email,token)values'+
		'("'+data.email+'","'+data.access_token+'")';
		this.execute(sql,callback);
	}


	auth_model.prototype.checkTokenEmail = function(data,callback){
		var sql = 'select id from password_resets where token = "'+data+'" ';
		this.execute(sql,callback);
	}

	auth_model.prototype.updatePassword = function(data,callback){
		var sql = 'update users set password = "'+data.password+'" where'+
		' email = (select email from password_resets where token ="'+data.token+'" limit 1 ) ';
		this.execute(sql,callback);
	}

	auth_model.prototype.deletePassToken = function(data,callback){
		var sql = 'delete from password_resets where token = "'+data+'" ';
		this.execute(sql,callback);
	}







	// forgot password module end here


	module.exports = new auth_model();
