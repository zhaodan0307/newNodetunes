var express = require('express');
var router = express.Router();


//因为这个是users这个controller，设置的就是/users，所以这里的/实际上是homepage/users/

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
