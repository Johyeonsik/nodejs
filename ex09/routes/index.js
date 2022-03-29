var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '밀키트 쇼핑몰',pageName:'list.ejs' ,userid:req.session.userid});
});

module.exports = router;
