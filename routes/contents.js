var express = require('express');
var router = express.Router();
const db = require('../models')
const sequelize = require("sequelize");
const Op = sequelize.Op;

// JWT 
const jwt = require('jsonwebtoken')

// MySQL -----------------------------
var mysql = require('mysql');

//Connection 객체 생성 
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'test1'
});

// Connect
connection.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    } else console.log('DB 연결 되었습니다. ')
});
// ------------------------------------


router.get('/list', function(req, res) {
    connection.query('SELECT * FROM contents', function(err, rows) {
        res.send(rows);
    });
});

router.post('/search', function(req, res) {
    let content = req.body.search.search_content
    let mode = ''
    if (req.body.search.search_mode == "제목") mode = "subject"
    if (req.body.search.search_mode == "내용") mode = "contents"
    if (req.body.search.search_mode == "작성자") mode = "author"
    connection.query('SELECT * FROM contents WHERE ' + mode + ' LIKE "%' + content + '%";', function(err, rows) {
        res.send({
            data: rows,
            success: true
        });
    });

    // if (req.body.search.search_mode == "제목") {
    //     db.Content.findAll({
    //             where: {
    //                 subject: {
    //                     [Op.like]: "%" + content + "%"
    //                 }
    //             }
    //         })
    //         .then((data) => {
    //             res.send({ success: true, data: data })
    //         })

});



// 토큰 유효성 검증

// 이 위에는 login, register가 있는데 로그인 시에는 토큰이 없으므로, 로그인은 토큰 검증을 하지 않아야하기 때문에
// 위에 위치시키며 토큰 검증이 필요한 작업들은 아래에 위치시킨다.
// /* 이므로 이 아래의 모든 요청들은 이 작업을 수행한 후에 진행된다.

router.use('/*', function(req, res, next) {
    console.log(req.headers.authorization)
    const request_token = req.headers.authorization
    try {
        jwt.verify(request_token, 'WebTokenTest');
        console.log('유효한 토큰입니다.')
        next();
    } catch {
        res.send({
            message: 'tokenInvalid'
        })
    }

    //var decoded_data = jwt.verify(token, 'secret_key');
    // console.log(decoded_data.issuer) 출력결과: inwoo
})



router.post('/write', function(req, res) {
    // db에 새로운 글 추가
    console.log(req.body.content.subject)
    db.Content.create({ subject: req.body.content.subject, contents: req.body.content.contents, author: req.body.content.author })
        .then(() => {
            res.status(200).send({ message: "success" });
        });
});

router.post('/update', function(req, res) {
    // 게시판 글의 인덱스 값을 받아 그에 맞는 id 값을 얻은 후, 그 값을 가지고 db의 글을 식별하여 업데이트한다.
    connection.query('SELECT * FROM contents', function(err, data) {
        var userid = data[req.body.content.index].id
        const content = {
            'subject': req.body.content.subject,
            'contents': req.body.content.contents,
            'author': req.body.content.author
        };
        console.log(userid)
        db.Content.update({ subject: content.subject, contents: content.contents, author: content.author }, { where: { id: userid } })
            .then(() => {
                res.status(200).send({ message: "success" });
            });
    });
});

router.post('/delete', function(req, res) {
    connection.query('SELECT * FROM contents', function(err, data) {
        var userid = data[req.body.number].id
        db.Content.destroy({ where: { id: userid } })
            .then(() => {
                res.status(200).send({ message: "success" });
            });
    });
});





module.exports = router;