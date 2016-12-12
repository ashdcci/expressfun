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
//Create-server++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
http.createServer(app).listen(8082,function(){
  console.log("Connected & Listen to port 8082");
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
