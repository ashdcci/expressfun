// File : controller/home.js -->

//home controller
function home(){
	data 	= {};
	tomodel = {};
	model 	= require('../models/home_model');
};
home.prototype.constructor = home;


home.prototype.main = function(req,res){
	return res.render('index',{token:'hhihcsdihuihjkndvkjsnkjhuoihsdkjvbkjh'});
}

home.prototype.list =  function(req, res) {
	data.title = 'Users';
	model.all_users(tomodel,function(err,rows){
		data.rows = rows;
		if(rows.length > 0){
			result = {'status':1,'data':rows};
		}else{
			result = {'status':0,'data':rows};
		}
	  	return res.json(result);
	});
}

home.prototype.single_user = function(req, res){
	/* validations starts */
	console.log(req.params.id);
	// return;
	req.checkParams('id', 'id is required').notEmpty();
  	var errors = req.validationErrors();
  	if(errors){
  		res.json({ status: 0, messages: errors });
  		return;
  	}



  	/* validation ends */

	tomodel.id = req.params.id;
	console.log(tomodel);
	// return;
	model.single_user(tomodel,function(err,rows){
		if(err) throw err;
		data.rows = rows;
		if(rows.length > 0){
			result = {'status':1,'data':rows};
		}else{
			result = {'status':0,'data':rows};
		}
	  	return res.json(result);
	});
}

home.prototype.uploadData = function(req, res){
	var sampleFile;
	console.log(req.files);
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    sampleFile = req.files.image;
    var ext = getExtension(sampleFile.name);
    sampleFile.mv('public/images/'+Math.floor((Math.random() * 10000000) + 1)+'.'+ext, function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send('File uploaded!');
        }
    });
}

function getExtension(filename) {
    var ext = filename.split('.');
    return ext[ext.length - 1];
}


home.prototype.editProfile = function(req,res,next){

		// check variable exist and isset start


		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		var fname,lname,age,lat,lng,profile,fileName;
		if( typeof req.body.fname !== 'undefined' ) { fname = req.body.fname; }else{fname='';}
		if( typeof req.body.lname !== 'undefined' ) { lname = req.body.lname; }else{ lname=''; }
		if( typeof req.body.age !== 'undefined' ) { age = req.body.age; }else{ age = ''; }
		if( typeof req.body.lat !== 'undefined' ) { lat = req.body.lat; }else { lat = '';}
		if( typeof req.body.lng !== 'undefined' ) { lng = req.body.lng; }else { lng = '';}
		if( typeof req.body.profile !== 'undefined' ) { profile = req.body.profile; }else { profile = '';}

		// check variable exist and isset end
		tomodel.fname = fname;
		tomodel.lname = lname;
		tomodel.age = age;
		tomodel.lat = lat;
		tomodel.lng = lng;
		tomodel.profile_pic = profile;
		tomodel.access_token = token;

		if( req.files ) {
			//  upload stuff start here
				var sampleFile;
				if (!req.files) {
						return res.json({status:0,msg:'no files uploaded'});
						return;
				}

				sampleFile = req.files.image;
				var ext = getExtension(sampleFile.name);
				fileName = Math.floor((Math.random() * 10000000) + 1)+'.'+ext;
				sampleFile.mv('public/images/'+fileName, function(err) {
						if (err) {
							console.log(err);
							return res.json({status:0,msg:'problam in uplaoding files.'});
						}
						else {
							console.log(fileName);
							profile = fileName;
						}
				});

				//  update data model call start

				tomodel.profile_pic = fileName;
				// console.log(tomodel);
				// return;

				model.editProfile(tomodel,function(err,row){
					if(err) throw err;
					return res.json({status:1,msg:'Profile Updated'});
				});

		}else{
			//  update data model call start


			console.log(tomodel);
			return;

			model.editProfile(tomodel,function(err,row){
				if(err) throw err;
				getSingleUser(access_token,res);
				// return res.json({status:1,msg:'Profile Updated'});
			});
		}


		// next();
		// upadte data model call end
}


function getSingleUser(token,res){
	model.prototype.singleUser(function(err,row){

	});
}






module.exports = new home();
