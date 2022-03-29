var express = require('express');
const { sendStatus } = require('express/lib/response');
var router = express.Router();

var db = require('../db');


/* 상품 판매목록 */
router.get('/list', function(req, res, next) {
    var code = req.query.code;
    var sql='select * , format(price*quantity,0) sum,date_format(sdate,"%Y-%m-%d") fdate  from sale where code =? order by id desc';
    db.get().query(sql,[code],function(err,rows){
        res.send(rows);
    });
});
//DB에 매출등록
router.post('/insert',function(req,res){
    var code =req.body.code;
    var sdate=req.body.sdate;
    var price = req.body.price;
    var quantity=req.body.quantity;
    var sql='insert into sale(code,sdate,price,quantity) values(?,?,?,?)';
    db.get().query(sql,[code,sdate,price,quantity],function(err,rows){
        res.sendStatus(200);
    })
})

//db에 매출수정
router.post('/update',function(req,res){
    var id = req.body.id;
    var price = req.body.price;
    var quantity=req.body.quantity;
    var sql='update sale set price=?,quantity=? where id=?';
    db.get().query(sql,[price,quantity,id],function(err,rows){
        res.sendStatus(200);
    });
});

//db에 매출삭제
router.post('/delete',function(req,res){
    var id = req.body.id;
    var sql='delete from sale where id =?';
    db.get().query(sql,[id],function(err,rows){
        res.sendStatus(200);
    });
});
module.exports = router;
