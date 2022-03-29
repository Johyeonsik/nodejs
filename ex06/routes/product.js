var express = require('express');
var router = express.Router();

var db=require('../db');
/*상품목록 json데이터*/
router.get('/list', function(req, res, next) {
    var page=req.query.page;
    var start=(page-1)*4;
    //전체 데이타 갯수
    var sql = 'select count(*) tot from product';
    db.get().query(sql,function(err,rows){
        var tot = rows[0].tot;
        var sql = `select *,format(price,0) fprice from product order by code desc limit ${start},4`;
        db.get().query(sql,function(err,rows){
        res.send({rows:rows,tot:tot});
    });

  });
});

//상품등록
router.get('/insert',function(req,res){
    var sql='select max(code) mcode from product';
    db.get().query(sql,function(err,rows){
        var mcode=rows[0].mcode;
        var code='p'+ (parseInt(mcode.substring(1))+1);
        res.render('index',{title:'상품등록',pageName:'insert.ejs', code:code});

    });
  });
//파일업로드
var multer=require('multer');
var path='./public/upload';
var upload=multer({
    storage:multer.diskStorage({
        destination:(req, res, done)=>{
            done(null, path);
        },
        filename:(req, file, done)=>{
            done(null, Date.now()+'_'+file.originalname);
        }
    })
});
  //DB에 상품등록
  router.post('/insert',upload.single('image'),function(req,res){       //single (업로드되는 파일 변수)
      var code=req.body.code;
      var price=req.body.price;
      var name=req.body.name;
      var img=req.file.filename;
      var sql='insert into product(code,price,name,img) values(?,?,?,?)';
      db.get().query(sql,[code,price,name,img],function(err,rows){
          res.redirect('/');
      });
  });
//상품정보페이지
router.get('/read',function(req,res){
    var code=req.query.code;
    var sql='select * from product where code=?';
    db.get().query(sql,[code],function(err,rows){
        res.render('index',{title: '상품정보', vo:rows[0], pageName:'read.ejs'});
    });
});

//DB에 상품정보 수정
var fs=require('fs');
router.post('/update',upload.single('image'),function(req,res){        //포스트는 바디 겟은 쿼리
    var code=req.body.code;
    var name=req.body.name;
    var price=req.body.price;
    var img=req.body.oldImage;
    if(req.file!=null) {            //이미지가 바뀐경우 
        img=req.file.filename;
        //기존이미지가 있으면 삭제
        if(req.body.oldImage!='') {
            fs.unlink(path + '/' + req.body.oldImage,function(err){
                if(err) throw err;
            });
        }
    }
    var sql='update product set name=?, price=?, img=? where code=?';
    db.get().query(sql,[name,price,img,code], function(err,rows){
        res.redirect('/');
    });
});

//상품삭제
router.get('/delete',function(req,res){
    var code = req.query.code;
    var img=req.query.image;
    var sql='delete from product where code=?';
    db.get().query(sql,[code],function(err,rows){
        //기존이미지가 있으면 삭제
        if(img!='') {
            fs.unlink(path + '/' + img,function(err){
                if(err) throw err;
             
            });
        }
        res.redirect('/');

    });
});
module.exports = router;
