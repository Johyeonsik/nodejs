var express = require('express');
var router = express.Router();

var db=require('../db');
/* 상품목록 */
router.get('/list', function(req, res, next) {
  var page=req.query.page;
  var start=(page-1)*4;
  var sql='select count(*) total from tbl_jewelry';
  db.get().query(sql,function(err,rows){
    var total=rows[0].total;
    var sql ='select *,format(price,0) fprice from tbl_jewelry order by code desc limit ?,4';
    db.get().query(sql,[start],function(err,rows){
      res.send({rows:rows,total:total});
    });
 
  });
});

// 상품등록 페이지로 이동
router.get('/insert',function(req,res){
  res.render('index',{title:'상품등록', pageName:'insert.ejs'});
});

/*이미지 업로드 */
var multer = require('multer');
var path = './public/images'; 
var upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, done) => {
      done(null, path);
    }, 
    filename: (req, file, done) => { 
      done(null, Date.now()+'_' + file.originalname);
    }, 
  })
});

//상품 DB에 등록
router.post('/insert',upload.single('image'),function(req,res){
  var title=req.body.title;
  var price=req.body.price;
  var image=req.file.filename;
  var sql='insert into tbl_jewelry(title,price,image) values(?,?,?)';
  db.get().query(sql,[title,price,image],function(err,rows){
    res.redirect('/');
  });
});

//상품정보페이지 이동
router.get('/read',function(req,res){
  var code = req.query.code;
  var sql='select * from tbl_jewelry where code=?';
  db.get().query(sql,[code],function(err,rows){
    var vo = rows[0];
    res.render('index',{title:'상품정보',pageName:'read.ejs',vo:vo});
  });
});

//상품정보 수정
var fs = require('fs');

router.post('/update',upload.single('image'),function(req,res){
  var code = req.body.code;
  var title = req.body.title;
  var price = req.body.price;
  var image = req.body.oldImage;

  //이미지가 바뀐경우
  if(req.file != null) {
    
    image=req.file.filename;         //새로운 이미지네임을 image로 
   
    fs.unlink(path +"/"+ req.body.oldImage,function(err){            //기존이미지 삭제
      if(err) throw err;
      
    });
  }

  var sql = 'update tbl_jewelry set title=?,price=?,image=? where code=?';
  db.get().query(sql,[title,price,image,code],function(err,rows){
    res.redirect('/');
  });
});
module.exports = router;

