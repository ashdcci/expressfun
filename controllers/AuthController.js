	// File : controller/AuthController.js -->

	//Auth controller
	function auth(app){
		data 	= {};
		tomodel = {};
		model 	= require('../models/auth_model');
		mailer 	= require('../config/mail');
		jwt =  require('jsonwebtoken');
		superSecret = 'b1N3xXrpwNPrsLZH2GmCa95TbuU6hvvKQYVDcKSKrg4PfiOCm_X8A5G_hpLvTmD_';
	};
	auth.prototype.constructor = auth;
	var crypto    = require('crypto');
	// var superSecret = 'b1N3xXrpwNPrsLZH2GmCa95TbuU6hvvKQYVDcKSKrg4PfiOCm_X8A5G_hpLvTmD_';
	/* login start */
	auth.prototype.login = function(req, res , callback){

		/* get variables list and check for validation */
		/* schema defined */
		var result,req_route,device_token;
		var schema = {
			 'email': {
					in: 'body',
					notEmpty: {
			    	errorMessage:"Email field is required"
			    },
			    isEmail: {
			      errorMessage: 'Invalid Email'
			    },
			  },
			  'password': {
			    notEmpty: true,
			    errorMessage: 'Invalid Password' // Error message for the parameter
			  },
			  'device_id': {
				    notEmpty: {
					    errorMessage: 'Device Id Required' // Error message for the parameter
					}
				}
			};

		/*schema defined end */
		req.checkBody(schema);
		req.sanitizeBody('postparam').toBoolean();
	  	req.sanitizeParams('urlparam').toBoolean();
	  	req.sanitizeQuery('getparam').toBoolean();

	  	// OR find the relevent param in all areas
	  	req.sanitize('postparam').toBoolean();
	  	var errors = req.validationErrors();
	  	if(errors){
	  		res.json({ status: 0, messages: errors[0] });
	  		return;
	  	}

	  	/* check user login from model  */
	  	tomodel.email = req.body.email;
	  	password = crypto.createHash("md5")
	                   .update(req.body.password)
	                   .digest('hex');
	  	tomodel.password = password;


	  	/* check request route from login */

	  	if( typeof req.body.route !== 'undefined' ) { req_route = req.body.route; }else{ req_route = 1; }
	  	if( typeof req.body.device_token !== 'undefined' ) { device_token = req.body.device_token; }else{ device_token = 1; }

	  	if(req_route==1){
	  		/*  from login */
	  		model.login(tomodel,function(err,rows){
				if(err){ throw err };
				data.rows = rows;
				if(rows.length > 0){
					/* update login stuff */

					updateToken(rows[0].id);
					getSingleUser(rows[0].id,res);
					// result = {'status':1,'msg':'Login Successfully','data':rows};
				}else{
					result = {'status':0,'msg':'Login Failed','data':[]};
					return res.json(result);
				}

			});

	  	}else{
	  		/* from register */
				tomodel.device_token = '';
				tomodel.device_id = '';

				checkMail(req.body.email,res);

	  		model.register(tomodel,function(err,rows){
					if(err){ throw err };
					data.rows = rows;
					if(rows.insertId > 0){
						getSingleUser(rows.insertId,res);
					}else{
						result = {'status':0,'msg':'Login Failed','data':[]};
						return res.json(result);
					}
				});
	  	}

	  	return;

	}

	function updateToken(id){

		var exp_time = Math.floor(Date.now() / 1000) + (3600 * 3600);
		var token = jwt.sign({
								  exp: exp_time,
								  data: Math.floor((Math.random() * 1000000000) + 1).toString()
								}, superSecret);
		tomodel.user_id = id;
		tomodel.access_token = token;
		model.updateToken(tomodel,function(err,rows){
			if(err) throw err;
		});
		return id;
	}

	function getSingleUser(id,res){
		var result = '';
			model.single_user(id,function(err1,rw){
				return res.json({'status':1,'msg':'Login Successfully with first','data':rw});
			});
		return result;
	}


	function checkMail(email,res){
		model.checkMail(email,function(err,rows){
			if(rows.length > 0){
				return res.json({'status':0,'msg':'Email Already Exists','data':[]});
			}
		});
	}

	/* login end */



	/* forgot password module start*/
	auth.prototype.sendForgotPasswordMail = function(req, res, next){
		var access_token = crypto.createHash("md5")
														 .update(Math.floor((Math.random() * 10000) + 1).toString())
														 .digest('hex');

				req.app.mailer.send('forgot_password', {
				    to: req.body.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.
				    subject: 'Test Email', // REQUIRED.
						token : access_token,
				    otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
				  }, function (err) {
				    if (err) {
				      // handle error
							console.log(err);
				      return res.json({status:0,msg:'There was an error sending the email'});

				    }
						var data1 = {};
						data1.email = req.body.email;
						data1.access_token = access_token;
						model.resetPasswordReq(data1,function(err,rows){
							if(err) throw err;
							return res.json({status:1,msg:'mail send'});
						});


		  });
	}

	auth.prototype.resetPassword = function(req,res,next){
		return res.render('../views/reset_password', { token: req.params.token, message: 'reset password' });
	}

	auth.prototype.updateForgotPassword = function(req, res, next){
			// get values
			var schema = {
					'token':{
							notEmpty:true,
							errorMessage:'token is required'
					},
				  'password': {
				    notEmpty: true,
				    errorMessage: 'Invalid Password' // Error message for the parameter
				  },
					'cpassword': {
				    notEmpty: true,
				    errorMessage: 'Invalid Password Confirmation' // Error message for the parameter
				  }
				};

			/*schema defined end */
			req.checkBody(schema);

			// check token
			token = req.body.token;
			password = req.body.password;
			cpassword = req.body.cpassword;
			if(password!=cpassword){
				return res.json({status:0,msg:'Passsword Mismatch'});
			}
			//   token exists check
			checkTokenEmail(token,res);

			// update password
			tomodel.password = crypto.createHash("md5")
															 .update(password)
															 .digest('hex');
			tomodel.token = token;
			model.updatePassword(tomodel,function(err,rows){
				if(err) throw err;
				deletePassToken(token,res);
				return res.render('success_password',{status:1,msg:'password updated'});
			});

	}
	/* forgot password module end*/

	auth.prototype.requireAuthentication = function(req, res, next){
		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		var	superSecret1 = 'b1N3xXrpwNPrsLZH2GmCa95TbuU6hvvKQYVDcKSKrg4PfiOCm_X8A5G_hpLvTmD_';
		  // decode token
		  if (token) {

		    // verifies secret and checks exp
		    jwt.verify(token, superSecret1, function(err, decoded) {
		      if (err) {
		        return res.json({ success: false, message: 'Failed to authenticate token.' });
		      } else {
		        // if everything is good, save to request for use in other routes
		        req.decoded = decoded;
		        next();
		      }
		    });

		  } else {

		    // if there is no token
		    // return an error
		    return res.status(403).send({
		        success: false,
		        message: 'No token provided.'
		    });

		  }
		// next();
	}

	/* generate jwt token */
	function checkTokenEmail(token,res){
		model.checkTokenEmail(token,function(err,rows){
			if(err) throw err;
			if(rows.length==0){
				return res.json({status:0,msg:'Token Expired or Invalid'});
			}
		});
	}

	function deletePassToken(token,res){
		model.deletePassToken(token,function(err,row){
			if(err) throw err;
		});
	}

	auth.prototype.generateToken = function(req,res,next){

		var exp_time = Math.floor(Date.now() / 1000) + (3600 * 3600);
		var token = jwt.sign({
								  exp: exp_time,
								  data: Math.floor((Math.random() * 1000000000) + 1).toString()
								}, superSecret);
		return res.json({'token':token,'expire_time_unix':exp_time});
		next();
	}


	auth.prototype.checkToken = function(req,res,next){
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
	  // decode token
	  if (token) {
			model.checkToken(token,function(err,rows){
				if(err) throw err;
				if(rows.length == 0){
					return res.json({ success: 0, message: 'Failed to authenticate token.' });
				}
			});
		}else{

		}
	}

	/* end generate jwt token */


	module.exports = new auth();
