module.exports = function(app){

	//Controllers++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	var homeController     	= require('../controllers/Home');
	var authController     	= require('../controllers/AuthController');
	var venueController = require('../controllers/VenueController');
	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// console.log(app);
	//Routes+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	app.post('/api/login',authController.login);
	app.get('/', function(req, res, next){
		res.render('index',{token:'hjvgghsvdhgchjbkjsdcbkj'});
	});
	app.get('/reset_password/:token',authController.resetPassword);
	app.post('/updatePassword',authController.updateForgotPassword);
	app.post('/upload_s3',homeController.upload_s3);
	app.use('/api/',function(req, res, next) {

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];
	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
	      if (err) {
	        return res.json({ success: 0, message: 'Failed to authenticate token.' });
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
	});
	app.get('/api', homeController.list);
	app.get('/api/all', homeController.list);
	app.get('/api/single/:id', homeController.single_user);
	app.get('/api/single-user', homeController.single_user);
	app.post('/api/single-user', homeController.single_user);
	app.post('/api/upload',homeController.uploadData);
	/* auth routes start */
	app.post('/api/sendForgotPasswordMail',authController.sendForgotPasswordMail);
	app.get('/token',authController.generateToken);
	app.post('/api/edit-profile',homeController.editProfile);
	/*auth routes end */

	/* venue routes start */
	app.post('/api/add-post',venueController.addPostVenue);
	app.get('/api/fetch-single-post/:venue_id/:id',venueController.fetchSinglePostVenue);
	app.get('/api/fetch-all-post/:venue_id',venueController.fetchSinglePostVenue);
	/* venue routes end */
	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

}
