var express = require('express');
var router = express.Router();

var db=require('../db');

/* 특정도서의 리뷰목록 */
router.get('/list', function(req, res, next) {
  var code=req.query.code;
  var sql='select *, date_format(date, "%Y-%m-%d %T") fdate from tbl_review where code=? order by id desc';
  db.get().query(sql, [code], function(err, rows){
      res.send(rows);
  });
});
//DB에 리뷰등록 
router.post('/insert', function(req,res){
    var code=req.body.code;
    var uid=req.body.uid;
    var text=req.body.text;
    var sql="insert into tbl_review(code,uid,text) values(?,?,?)";
    db.get().query(sql, [code,uid,text], function(err, rows){
        res.sendStatus(200);
    });
});

router.get('/delete', function(req,res){
    var id=req.query.id;
    var uid=req.query.uid;
    var sql="delete from tbl_review where id=? and uid=?"
    db.get().query(sql,[id,uid], function(err,rows){
        res.sendStatus(200);
    });
});

//db 에서 리뷰삭제
router.post('/delete',function(req,res){
    var id = req.body.id;
    var sql='delete from tbl_review where id=?';
    db.get().query(sql, [id], function(err,rows){
        res.sendStatus(200);        //보내줄 데이터가 없을때
    });
});
module.exports = router;