var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '주소목록' , pageName:'address_list.ejs'});
});

module.exports = router;
