var crypto = require('crypto');
User = require('../models/user.js');
//var router = express.Router();

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
*/

module.exports = function(app){
	app.get('/', function(req, res){
		res.render('index', { title: '主頁'});
	});
	app.get('/register', function(req, res){
		res.render('register', { title: '註冊'});
	});
	app.post('/register', function(req, res){
		var name = req.body.name,
			password = req.body.password,
			password_chk = req.body['password_check'];
		if(password != password_chk){
			req.flash('error', 'password is not same');
			return res.redirect('/register');
		}
		//res.render('index', { title: 'main page'});
	});
	app.get('/login', function(req, res){
		res.render('login', { title: '登錄'});
	});
	app.post('/login', function(req, res){
		//res.render('index', { title: 'main page'});
	});
	app.get('/post', function(req, res){
		res.render('post', { title: '發表'});
	});
	app.post('/post', function(req, res){
		//res.render('index', { title: 'main page'});
	});
	app.get('/logout', function(req, res){
		//res.render('post', { title: 'post page'});
	});
};