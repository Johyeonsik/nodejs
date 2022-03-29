var express = require('express');
var router = express.Router();

var db=require('../db');
/* 상품목록 */
router.get('/list', function(req, res, next) {
    var sql='select *,format(price,0) fprice from tbl_food order by code desc';
    db.get().query(sql,function(err,rows){
        res.send(rows);
    });
});
//상품등록 페이지
router.get('/insert',function(req,res){
    res.render('index',{title:'상품등록',pageName:'insert.ejs'})
});

//파일업로드
var multer = require('multer');
var path='./public/images';
var upload = multer({
    storage:multer.diskStorage({
        destination:(req,file,done)=>{
            done(null,path);
        },
        filename:(req,file,done)=>{
            done(null,Date.now()+"_"+file.originalname);
        }
    })
});

//DB에 상품등록
router.post('/insert',upload.single('image'),function(req,res){
    var title = req.body.title;
    var price = req.body.price;
    var image = '/images/' + req.file.filename;
    var sql = 'insert into tbl_food(title,price,image) values(?,?,?)';
    db.get().query(sql,[title,price,image],function(err,rows){
        res.redirect('/');
    });
});
module.exports = router;
