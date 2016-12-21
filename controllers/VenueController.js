// File : controller/VenueController.js -->

//Venue controller
function venue(){
  data 	= {};
  tomodel = {};
  model 	= require('../models/venue_model');
  jwt =  require('jsonwebtoken');
  superSecret = 'b1N3xXrpwNPrsLZH2GmCa95TbuU6hvvKQYVDcKSKrg4PfiOCm_X8A5G_hpLvTmD_';
};
venue.prototype.constructor = venue;
var crypto    = require('crypto');


  /*
  modules

  1. add venue
  2. show venue
  3. add post to venue
  4. delete post
  5. add favourite to venue
  */
 /* add venue start */
 venue.prototype.addVenue = function(req, res , next){

 }
 /*add venue stop */


//  show venue start

// show venue end


// add post to venue start
  venue.prototype.addPostVenue = function(req, res, next){
    // validation start
    //check if files upload
    var content,image;
    if( typeof req.body.content !== 'undefined' ) { content = req.body.content; }else { content = '';}
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(req.files){
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
        tomodel.content = content;
				tomodel.image = fileName;
        tomodel.access_token = token;
				// console.log(tomodel);
				// return;

				model.addModelPost(tomodel,function(err,row){
					if(err) throw err;
					  fetchSinglePost(row.insertId, req, res);
				});
    }else{

      var schema = {
        'content': {
			    notEmpty: true,
			    errorMessage: 'Content Field Missing' // Error message for the parameter
			  }
      };
      req.checkBody(schema);
      var errors = req.validationErrors();
      if(errors){
        res.json({ status: 0, messages: errors[0] });
        return;
      }

      tomodel.image = '';
      tomodel.content = content;
      tomodel.access_token = token;

      model.addModelPost(tomodel,function(err,row){
        if(err) throw err;
        fetchSinglePost(row.insertId, req, res);
      });
    }


    // validation end
  }

  function getExtension(filename) {
      var ext = filename.split('.');
      return ext[ext.length - 1];
  }

  function fetchSinglePost(id, req, res){
    tomodel.id = id;
    tomodel.image_path = req.app.get('post_image_path');
    model.fetchSinglePost(tomodel,function(err, row){
      if(err) throw err;
      if(row.length > 0){
          return res.json({status:1,data:row});
      }else{
          return res.json({status:1,data:[]});
      }

    });
  }
// add post to venue end


// fetch all post start

// fetch all post end

//  delete post to venue start
  venue.prototype.deletePostVenue = function(req, res, next){

  }
// delete psot to venue end


// add favourite to venue start

  venue.prototype.addFavouriteVenue = function(req, res, next){

  }

// fetch single post

  venue.prototype.fetchSinglePostVenue = function(req, res, next){
    var schema = {
      'id': {
        notEmpty: true,
        errorMessage: 'id field is required' // Error message for the parameter
      },
      'venue_id': {
        notEmpty: true,
        errorMessage: 'venue id field is required' // Error message for the parameter
      },

    };
    req.checkParams(schema);
    var errors = req.validationErrors();
    if(errors){
      res.json({ status: 0, messages: errors[0] });
      return;
    }
    // return;
    var id = req.params.id;
    tomodel.id = id;
    tomodel.venue_id = req.params.venue_id;
    tomodel.image_path = req.app.get('post_image_path');

    var data = [];
    model.fetchSinglePostVenue(tomodel,function(err, rows){
      console.log('rows=> '+rows);
      // if(rows.length > 0){
      //   data = rows;
      // }
      return res.json({status:1,data:rows});
    });

  }

  // fetch all post venue


  venue.prototype.fetchAllPostVenue = function(req, res, next){
    // validation start
    var schema = {
      'venue_id':{
        notEmpty: true,
        errorMessage:'venue id field is required'
      }
    };

    req.checkParams(schema);
    var errors = req.validationErrors();
    if(errors){
      res.json({ status: 0, messages: errors[0] });
      return;
    }
    // validation end

    var id = req.params.venue_id;
    tomodel.id = id;
    tomodel.image_path = req.app.get('post_image_path');
    var data = [];

    // model start
    model.fetchAllPostVenue(tomodel,function(err, rows){
      if(err) throw err;
      if(rows.length > 0){
        data = rows;
      }
      res.json({status: 1,data:data});
    });
    // model end

  }


// add favourite to venue end
module.exports = new venue();
