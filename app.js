
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./config/routes')(app);
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser')
var expressValidator = require('express-validator');
var multer  = require('multer');
var mysql = require('mysql');
var connection;
var Home = require('./controllers/Home');
var fileUpload = require('express-fileupload');
var app = express();


// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(expressValidator());
app.use(express.methodOverride());
app.use(express.multipart());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);





app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
app.use(bodyParser.json())
app.use(multer({
  dest: __dirname + '/public/',
}));

var upload = multer({
  dest: __dirname + '/public/',
})
// add validation methods to request
var done=false;


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



/* connection object creation start*/

// function connectionDB(){
	var connection = mysql.createConnection({
		  host: 'localhost',
		  user: 'root',
		  password: 'signity',
		  database: 'test'
		})

	connection.connect()
// }	


/* connection object creation end */





function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}

function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}

function errorHandler (err, req, res, next) {
  res.status(500).send(err)
}


// app.get('/', routes.index);
// app.get('/users', user.list);

// app.get('/use/1/', user.list);

// app.get('/chk/:id',function(req,res,next){
// 	// console.log('Time:', Date.now())
// 	var d = new Date(),
//         month = '' + (d.getMonth() + 1),
//         day = '' + d.getDate(),
//         year = d.getFullYear();

//     if (month.length < 2) month = '0' + month;
//     if (day.length < 2) day = '0' + day;

//     var dt =  [year, month, day].join('-');

// 	next()
// 		res.send('check 1 triggered'+ dt+month+day+year);
// 	})
// app.get('/chk/:id',function(req,res){
// 		res.send('check 2 triggered');
// 	})

// app.get('/book/:id', function (req, res, next) {
//   console.log('ID:', req.params.id)
//   next()
// })



// app.post('/test-page', function(req, res) {
// 	res.status('200').send(req.body);
// // req.checkBody("username", "Enter a valid email address.").isEmail();
// 	// req.checkBody('username', 'Username is required').notEmpty();
//  //  	req.checkBody('password', 'Password is required').notEmpty();

//  //  	var errors = req.validationErrors();

//  //  	if(errors){
//  //  		res.render('register', { flash: { type: 'alert-danger', messages: errors }});
//  //  	}else{
//  //  		var name = req.body
//  //    	console.log(req);
//  //    	res.status('200').send(name);
//  //  	}
//  //  	next()
//     // ...
// });


// app.post('/pages/create', function(req, res) {
//   req.checkBody('username', 'Username is required').notEmpty();
//   req.checkBody('password', 'Password is required').notEmpty();
//   req.checkBody('display', 'DisplayName is required').notEmpty();
//   req.checkBody('email', 'Email is required').notEmpty();
//   req.checkBody('email', 'Email does not appear to be valid').isEmail();


//   var errors = req.validationErrors();
//   if (errors) {
//     res.status('500').send(errors);
//     return;
//   } else {
//   	res.send('no errors');
//     // normal processing here
//   }
// });




// // app.post('/profile', upload.single('file'), function (req, res, next) {
// //   // req.file is the `avatar` file
// //   // req.body will hold the text fields, if there were any
// //   res.status('200').send(req.files);
// // })

// app.post('/upload', upload.single('file'), function(req, res) {
	

//   if (req.files) {
//     console.log(req.files);
//     uploadPath = __dirname + '/public/';
// 	return res.send(uploadPath);
//     // return res.send('file uploaded222');
//   }
//   res.end('not uploaded');
// });



// /* database related operations */
// app.post('/insert-user',user.insert);
// app.post('/delete-user',user.delete);
// app.post('/all-user',user.all_users);
// app.post('/get-user-by-id',user.single_user);

// /* end database related operations */




// app.post('/upload1', function(req, res) {
// 	var sampleFile, uploadPath;
// 	console.dir(req.files);
// 	if (!req.files) {
// 		res.status(400).send('No files were uploaded.');
// 		return;
// 	}

// 	sampleFile = req.files.sampleFile;

// 	uploadPath = __dirname + '/public/' + sampleFile.name;
// 	console.log(uploadPath);

// 	sampleFile.mv(uploadPath, function(err) {
// 		if (err) {
// 			res.status(500).send(err);
// 		}
// 		else {
// 			res.send('File uploaded to ' + uploadPath);
// 		}
// 	});
// });


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
