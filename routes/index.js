//var express = require('express');
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
		res.render('index', { title: 'main page'});
	});
	app.get('/register', function(req, res){
		res.render('register', { title: 'register page'});
	});
	app.post('/register', function(req, res){
		//res.render('index', { title: 'main page'});
	});
	app.get('/login', function(req, res){
		res.render('login', { title: 'login page'});
	});
	app.post('/login', function(req, res){
		//res.render('index', { title: 'main page'});
	});
	app.get('/post', function(req, res){
		res.render('post', { title: 'post page'});
	});
	app.post('/post', function(req, res){
		//res.render('index', { title: 'main page'});
	});
	app.get('/logout', function(req, res){
		//res.render('post', { title: 'post page'});
	});
};