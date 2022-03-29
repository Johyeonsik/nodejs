var express = require('express');
var router = express.Router();

var db=require('../db');
/* 로그인페이지로 이동 */
router.get('/login', function(req, res, next) {
  res.render('index',{pageName:'login.ejs' ,userid:req.session.userid,username:req.session.username});//유저네임 추가
});
//로그인 체크
router.post('/login',function(req,res){
  var id = req.body.id;
  var pass = req.body.pass;
  var sql = 'select * from tbl_user where id=?';
  var result = 0;             //아이디 존재여부
  db.get().query(sql,[id],function(err,rows){
    if (rows.length==1) {     //아이디 존재
      if(rows[0].pass==pass) {    //비밀번호 일치
        result=1;
        req.session.userid=id
        req.session.username=rows[0].name //유저네임가져오기
      }else {
        result =2;               //비밀번호 불일치
      }
    }
    res.send({result:result});
  });
});

//로그아웃
router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect('/');
});
module.exports = router;
