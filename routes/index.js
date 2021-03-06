var crypto = require('crypto');
User = require('../models/user.js');
Post = require('../models/post.js')

var multer = require('multer');
//var upload = multer({dest: './public/images'});
var storage = multer.diskStorage({
    destination: './public/images',
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

module.exports = function(app) {
    app.get('/', function(req, res) {
        Post.getAll(null, function(err, posts) {
            if (err) {
                posts = [];
            }
            res.render('index', {
                title: '主頁',
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString(),
                posts: posts
            });
        });
    });

    app.get('/register', isLogin);
    app.get('/register', function(req, res) {
        res.render('register', {
            title: '註冊',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
        //console.log('register:', req.session.user);
    });

    app.post('/register', isLogin);
    app.post('/register', function(req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_chk = req.body['password_check'];
        if (password != password_chk) {
            console.log('pw is not same');
            req.flash('error', 'password is not same');
            return res.redirect('/register');
        }

        //產生密碼md5
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');

        var newUser = new User({
            name: req.body.name,
            password: password,
            email: req.body.email
        });

        //確認user是否已存在
        User.get(newUser.name, function(err, user) {
            if (user) {
                req.flash('error', 'user is duplicated');
                return res.redirect('/register');
            }
            //console.log('success111:', user);

            //insert user
            newUser.save(function(err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/register');
                }
                req.session.user = user;

                //console.log('success222:', user);
                req.flash('success', '註冊成功');
                res.redirect('/');
            });
        });

        //res.render('index', { title: 'main page'});
    });

    app.get('/login', isLogin);
    app.get('/login', function(req, res) {
        res.render('login', {
            title: '登錄',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/login', isLogin);
    app.post('/login', function(req, res) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');

        User.get(req.body.name, function(err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/login');
            }

            if (!user) {
                req.flash('error', 'wrong name');
                return res.redirect('/login');
            }

            if (user.password !== password) {
                req.flash('error', '密碼錯了');
                return res.redirect('/login');
            }

            req.session.user = user;
            req.flash('success', 'Login Ok');
            res.redirect('/');
        });
        //res.render('index', { title: 'main page'});
    });

    app.get('/upload', isNotLogin);
    app.get('/upload', function(req, res) {
        res.render('upload', {
            title: '上傳',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/upload', isNotLogin);
    app.post('/upload', upload.single('file1'), function(req, res) {
        req.flash('success', 'upload success');
        res.redirect('/');
    });

    //查詢某使用者之所有文章
    app.get('/u/:name', function(req, res) {
        User.get(req.params.name, function(err, user) {
            if (!user) {
                req.flash('error', '用戶不存在');
                return res.redirect('/');
            }

            Post.getAll(user.name, function(err, posts) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/');
                }

                res.render('user', {
                    title: user.name,
                    posts: posts,
                    user: req.session.user,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            });
        });
    });

    //依條件查詢文章
    app.get('/u/:name/:day/:title', function(req, res) {
        Post.getOne(req.params.name, req.params.day, req.params.title, function(err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('article', {
                title: req.params.title,
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        });
    });

    //編輯文章
    app.get('/edit/:name/:day/:title', isNotLogin);
    app.get('/edit/:name/:day/:title', function(req, res) {
        Post.edit(req.params.name, req.params.day, req.params.title, function(err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('edit', {
                title: 'Edit',
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        });
    });


    app.get('/post', isNotLogin);
    app.get('/post', function(req, res) {
        res.render('post', {
            title: '發表',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/post', isNotLogin);
    app.post('/post', function(req, res) {
        var curUser = req.session.user,
            post = new Post(curUser.name, req.body.title, req.body.post);

        post.save(function(err) {
            if (err) {
                req.flash('error', err);
                console.log('post:', err);
                return res.redirect('/');
            }


            req.flash('success', 'post success');
            res.redirect('/');
        });
    });

    app.get('/logout', isNotLogin);
    app.get('/logout', function(req, res) {
        req.session.user = null;
        req.flash('success', 'Logout');
        res.redirect('/');
        //res.render('post', { title: 'post page'});
    });

    function isLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', 'you have Logined');
            res.redirect('back');
        }
        next();
    }

    function isNotLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', 'you have not Logined');
            res.redirect('/login');
        }
        next();
    }
};
