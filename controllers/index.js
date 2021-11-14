var express = require('express');
var router = express.Router();





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

module.exports = router;
