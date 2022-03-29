var express = require('express');
var router = express.Router();

var db=require('../db');
/* 상품목록 */
router.get('/list', function(req, res, next) {
    var page=req.query.page;
    var start=(page-1)*8;
    var word=req.query.word;

    var sql ="select count(*) total from tbl_book where title like ?";
    db.get().query(sql,['%'+word+'%'],function(err,rows){
        var total= rows[0].total;

    var sql='select *,format(price,0) fprice from tbl_book where title like ? order by code desc limit ?,8';
    db.get().query(sql,['%'+word+'%',start],function(err,rows){
        res.send({rows:rows, total:total, userid:req.session.userid, username:req.session.username});
    });

    });
});
//도서정보 페이지로 이동
router.get('/read',function(req,res){
    var code = req.query.code;
    var sql ='select b.*,r.uid,format(price,0) fprice from tbl_book b, tbl_review r where b.code=r.code and b.code= ?';
    db.get().query(sql, [code], function(err,rows){
        var vo = rows[0];
        res.render('index',{pageName:'read.ejs', userid:req.session.userid, username:req.session.username, vo:vo});
    });
});
module.exports = router;
