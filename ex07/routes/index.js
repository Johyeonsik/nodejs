var express = require('express');
const { DEC8_BIN } = require('mysql/lib/protocol/constants/charsets');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '상품관리', pageName:'list.ejs',userif:req.session.userid});
});



module.exports = router;
