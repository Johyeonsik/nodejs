var express = require('express');
var router = express.Router();

var db=require('../db')
/* 로그인페이지로 이동 */
router.get('/login', function(req, res, next) {
  res.render('index',{title:"로그인",pageName:'login.ejs',userid:req.session.userid});  
});

//로그인 체크
router.post('/login',function(req,res){
  var result =0;            //아이디 없음
  var id =req.body.id;
  var pass = req.body.pass;
  var sql="select * from tbl_user where id=?";
  db.get().query(sql,[id],function(err,rows){
    if(rows.length==1){     //아이디가 존재
     if(rows[0].pass=pass){  //패스워드 일치
       result=1;            //로그인성공
       req.session.userid=id;
     }else{
       result=2;            //패스워드 불일치
     }
    }
    
    res.send({result:result});
  });
});

//로그아웃
router.get('/logout', function(req, res){
  req.session.destroy(); //세션부숴~~!~!~!뿌셔뿌쎠~~!~!~!
  res.redirect('/');
});
module.exports = router;
