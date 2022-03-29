var express = require('express');
const res = require('express/lib/response');
var router = express.Router();

var db = require('../db')
/* 캠핑장 목록 */
router.get('/list', function(req, res, next) {
    var sql ='select * from tbl_camp order by cid desc';
    db.get().query(sql,function(err,rows){
        res.send(rows);
    });
});
//캠핑장 등록 
router.get('/insert', function(req,res){
    res.render('index',{title:'캠핑장등록',pageName:'insert.ejs'});
});
    
//DB캠핑장 등록
router.post('/insert',function(req,res){
    var name =req.body.name;
    var tel = req.body.tel;
    var address=req.body.address;
    var sql='insert into tbl_camp(name,tel,address) values(?,?,?)';
    db.get().query(sql,[name,tel,address],function(err,rows){
       res.redirect('/'); 
    });
});
//캠핑장 정보 페이지
router.get('/read', function(req,res){
    var cid=req.query.cid;
    var sql="select * from tbl_camp where cid=?";
    db.get().query(sql, [cid], function(err, rows){
        res.render('index', {title:'캠핑장정보', pageName:'read.ejs', vo:rows[0]});
    });
});
//캠핑장 정보 수정
router.post('/update', function(req,res){
    var cid=req.body.cid;
    var name=req.body.name;
    var tel=req.body.tel;
    var address=req.body.address;
    var sql="update tbl_camp set name=?, tel=?, address=? where cid=?";
    db.get().query(sql, [name,tel,address,cid], function(err, rows){
        res.redirect('/');
    });
});

//db에서 캠핑장정보 삭제
router.get('/delete',function(req,res){
    var cid = req.query.cid;
    var sql='delete from tbl_camp where cid =?';
    db.get().query(sql,[cid],function(err,rows){
        res.redirect('/');
    });
});
module.exports = router;
