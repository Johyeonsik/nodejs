var express = require('express');
var router = express.Router();

var db=require('../db')
/* GET home page. */
router.get('/list', function(req, res, next) {
    var page=req.query.page;
    var start=(page-1)*8;
    var word=req.query.word;

    var sql ="select count(*) total from tbl_food where title like ?";
    db.get().query(sql,['%'+word+'%'],function(err,rows){
        var total= rows[0].total;

        var sql="select *,format(price,0) fprice from tbl_food where title like ? order by code desc limit ?,8";    
    db.get().query(sql,['%'+word+'%',start],function(err,rows){
        res.send({rows:rows,total:total,userid:req.session.userid});     //페이지를 출력할땐 랜드 / 데이터를 출력할땐 샌드 
    });
                    
    });
});

//상품정보 페이지로 이동
router.get('/read',function(req,res){
    var code = req.query.code;
    var sql="select *,format(price,0) fprice from tbl_food where code=?";
    db.get().query(sql,[code],function(err,rows){
        var vo = rows[0];
        res.render('index',{title:'상품정보',pageName:'read.ejs',vo:vo ,userid:req.session.userid});
    });
});
module.exports = router;
