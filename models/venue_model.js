// File : models/venue_model.js -->

//Common-parts-of-all-models++++++++++++++++++++++++++++++++++
model 					= require('./model');
var venue_model 			= function(){ };
venue_model.prototype.constructor  	= venue_model;
venue_model.prototype     		= model;
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

venue_model.prototype.addModelPost = function(data, callback){

  var sql = 'insert into venue_post(user_id,content,post_image)values'+
  ' ((select id from users where access_token ="'+data.access_token+'" limit 1),"'+data.content+'","'+data.image+'") ';
  this.execute(sql,callback);
}

venue_model.prototype.fetchSinglePost = function(data,callback){
  var sql = 'select id,user_id,case when post_image<>"" then concat("'+data.image_path+'",post_image)  else content end as content'+
  ' from venue_post where id ='+data.id+' ';
  this.execute(sql, callback);
}

module.exports = new venue_model();
