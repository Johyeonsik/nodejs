var express = require('express');
var router = express.Router();

var db=require('../db');
/* 상품목록 */
router.get('/', function(req, res, next) {
  res.render('index', { title: '한빛미디어',pageName:'list.ejs',userid:req.session.userid,username:req.session.username});
});

module.exports = router;
