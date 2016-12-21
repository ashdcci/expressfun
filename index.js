// File : index.js -->

//Requires+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var express 		= require('express');
var app         	= express();
var parser 		= require('body-parser');
var http	 	= require('http');
var path = require('path');
var crypto = require('crypto');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');
var mailer = require('express-mailer');
var jwt = require('jsonwebtoken');
var morgan      = require('morgan');
var schedule = require('node-schedule');
var Upload = require('s3-uploader');
var AWS = require('aws-sdk');
var fs = require('fs');
var redis = require('redis');
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Uses+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mailer.extend(app, {
  from: 'Ashish <ashish.dadhich11@gmail.com>',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'donotreplyonme@gmail.com',
    pass: 'signity@123'
  }
});
app.set('superSecret','b1N3xXrpwNPrsLZH2GmCa95TbuU6hvvKQYVDcKSKrg4PfiOCm_X8A5G_hpLvTmD_');
app.set('AWS_KEY','AKIAIKWFTGIQWNM4PYFA');
app.set('AWS_SECRET','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');
app.set('AWS_PATH','https://s3-us-west-2.amazonaws.com/powwowapi/uploads/');
app.set('post_image_path','http://localhost:8082/images/');
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use(expressValidator());
app.use(fileUpload());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
var routes                	= require('./config/routes')(app);
var client = require('./config/filesystem')(app);
app.set('client',client);
AWS.config.update({ accessKeyId: app.get('AWS_KEY'), secretAccessKey: app.get('AWS_SECRET') });
app.set('fs',fs);

// app.set('AWS',AWS);
// console.log(new AWS.S3());
//Create-server++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
http.createServer(app).listen(8081,function(){
  console.log("Connected & Listen to port 8082");
});

var j = schedule.scheduleJob('* * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// redis server config+++++++++++++++++++++++++++++++++++++++++++++++++++++

var redisClient = redis.createClient({host : 'localhost', port : 6379});

redisClient.on('ready',function() {
 console.log("Redis is ready");
});

redisClient.on('error',function() {
 console.log("Error in Redis");
});


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


/*
aws bucket config
's3' => [
			'driver' => 's3',
			'key'    => env('AWS_KEY'),
			'secret' => env('AWS_SECRET'),
			'region' => 'us-west-2',
			'bucket' => 'powwowapi',
		],

    AWS_KEY=AKIAIKWFTGIQWNM4PYFA
    AWS_SECRET=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
    AWS_PATH=https://s3-us-west-2.amazonaws.com/powwowapi/uploads/

 */
