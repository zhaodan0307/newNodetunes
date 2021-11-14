var express = require('express');
var router = express.Router();




// GET: /artists => show index view
router.get('/', function(req, res, next) {
    res.render('artists/index', { title:'试一下' });
});

// make public
module.exports = router