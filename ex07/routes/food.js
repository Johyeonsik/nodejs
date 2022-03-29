var express = require('express');
const { DEC8_BIN } = require('mysql/lib/protocol/constants/charsets');
var router = express.Router();

var db=require('../db');
/* 상품목록 1.*/
router.get('/list', function(req, res, next) {
    var page=req.query.page;
    var start=(page-1)*4;
    var sql='select count(*) total from tbl_food';      //전체데이타갯수
    db.get().query(sql,function(err,rows){
        var total=rows[0].total;
        sql ='select *, format(price,0) fprice from tbl_food order by code desc limit ?,4';
        db.get().query(sql,[start],function(err,rows){
            res.send({rows:rows,total:total});
    });
  
  });
});


//상품등록 페이지
router.get('/insert',function(req,res){
    res.render('index',{title:'상품등록',pageName:'insert.ejs'});
});

//파일 업로드
var multer = require('multer');
var path='./public/images';
var upload = multer({
    storage:multer.diskStorage({
        destination:(req,file,done)=>{
            done(null,path);
        },
        filename:(req,file,done) =>{
            done(null,Date.now()+"_"+file.originalname);
        }
    })
});
//DB에 상품등록
router.post('/insert',upload.single('image'),function(req,res){
    var title=req.body.title;
    var price=req.body.price;
    var image='/images/'+req.file.filename;
    var sql='insert into tbl_food(title,price,image) values(?,?,?)';
    db.get().query(sql,[title,price,image],function(err,rows){
        res.redirect('/');
    });
});

//상품정보
router.get('/read',function(req,res){
    var code=req.query.code;
    var sql='select * from tbl_food where code=?';
    db.get().query(sql,[code],function(err,rows){
        var vo =rows[0];
        res.render('index',{title:'상품정보', pageName:'read.ejs', vo:vo});
    })
    
});

//DB에 상품정보 수정
var fs = require('fs');
router.post('/update',upload.single('image'),function(req,res){
    var code = req.body.code;
    var title = req.body.title;
    var price = req.body.price;
    var image=req.body.oldImage;
    
    if(req.file!=null) {        //이미지가 바뀐경우
        image='/images/'+req.file.filename;
        fs.unlink('./public'+req.body.oldImage,function(err){  //예전이미지 삭제
            if(err) throw err;
        });
    }
    var sql = 'update tbl_food set title=?,price=?,image=? where code=?';
    db.get().query(sql,[title,price,image,code],function(err,rows){
        res.redirect('/');
    });
});

//DB에서 상품정보 삭제
router.get('/delete',function(req,res){
    var code =req.query.code;
    var image=req.query.image;
    if(image!="") {
        fs.unlink('./public'+image,function(err){  //예전이미지 삭제
            if(err) throw err;
        });
    }
    var sql='delete from tbl_food where code=?';
    db.get().query(sql,[code],function(err,rows){
        res.redirect('/');
    });
});
module.exports = router;
