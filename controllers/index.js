var express = require('express');
var router = express.Router();

// passport for auth
const passport = require('passport')
//User这个model加入
const User = require('../models/user')



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//GET :/about
router.get('/about',function (req,res,next) {
  res.render('about', {
    title: 'About',
    content: 'This is some info about our music library'
  });
});

// GET: /register
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register'
  })
})

// POST: /register


var express = require('express');
var router = express.Router();

//这里要login后，req.user就获取了session中的user信息，然后我们把他传到前端去
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Node Tunes',
    user: req.user
  });
});

// GET: /about
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About this Site',
    content: 'This is some info about our music library',
    user: req.user
  })
})

// GET: /register
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register'
  })
})

// POST: /register
router.post('/register', (req, res) => {
  // use User Model & passport to create a new user in MongoDB.  Send password separately so it can be hashed by passport
  // req是指的发过来的form信息里面，的body.username这一栏，
  User.register(new User({ username: req.body.username }), req.body.password, (err, newUser) => {
    if (err) {
      console.log(err)
      res.render('register', {
        message: err
      })
    }
    else {
      // registration succeeded.  log user in and load main artist page
      req.login(newUser, (err) => {
        res.redirect('/artists')
      })
    }
  })
})

// GET: /login
router.get('/login', (req, res) => {
  // check the session for error messages
  let messages = req.session.messages || []
  req.session.messages = []

  res.render('login', {
    title: 'Login',
    messages: messages
  })
})

// POST: /login
// 查一下是否是ok的，如果不是ok的，就还是在login这个网页，
router.post('/login',passport.authenticate('local',{
  successRedirect: '/artists',
  failureRedirect: '/login',
  failureMessage: 'Invalid Login' // stored in the session object

}))

module.exports = router;
