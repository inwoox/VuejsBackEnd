var express = require('express');
var router = express.Router();

// bcrypt
var bcrypt = require('bcrypt-nodejs');

// Sequelize 를 사용하기 위한 models import
const db = require("../models")

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


router.post('/login', (req, res) => {
    console.log('받았습니다.', req.body.user.userid, req.body.user.password)
    const getToken = () => {
        return new Promise((resolve, reject) => {
            db.Usertable.findOne({ userid: req.body.user.userid })
                .then((data) => {
                    console.log('로그인 정보 확인되었습니다. USER ID : ' + data.userid + '\n')
                        // 패스워드 비교
                    if (bcrypt.compareSync(req.body.user.password, data.password)) {
                        jwt.sign({
                                id: req.body.user.userid,
                                password: req.body.user.password
                            },
                            secretKey = 'WebTokenTest', { expiresIn: '1h', issuer: 'inwoo', subject: 'userAccessToken' },
                            function(err, AccessToken) {
                                if (err) reject(err)
                                else {
                                    resolve(AccessToken)
                                    console.log('AccessToken 발급 : ' + AccessToken)
                                }
                            })

                    } else {
                        console.log('패스워드가 잘못되었습니다.')
                        res.send({
                            message: 'fail',
                            userId: req.body.user.userid
                        });
                    }
                })
        });
    }
    getToken().then(AccessToken => {
        res.send({
            message: 'success',
            AccessToken,
            userId: req.body.user.userid
        });
    })
})

/* POST user Register */
router.post('/signUp', function(req, res) {
    const user = {
        'userid': req.body.user.userid,
        'name': req.body.user.name,
        'password': req.body.user.password
    };


    connection.query('SELECT userid FROM usertables WHERE userid = "' + user.userid + '"', function(err, row) {
        if (row[0] == undefined) { //  동일한 아이디가 없을경우,

            // bcrypt를 이용하여 패스워드를 암호화하여 저장
            const salt = bcrypt.genSaltSync();
            const encryptedPassword = bcrypt.hashSync(user.password, salt);

            // 쿼리 방식으로 입력하기
            //connection.query('INSERT INTO users (userid,name,password) VALUES ("' + user.userid + '","' + user.name + '","' + encryptedPassword + '")');

            // Sequelize (ORM) 을 사용하여 입력하기 
            db.Usertable.create({ userid: user.userid, name: user.name, password: encryptedPassword })
                .then(() => {
                    res.status(200).send({
                        success: true,
                        message: "success",
                    })
                });

            // res.json({ success: true, message: 'Sing Up Success!' })

        } else {
            res.json({
                success: false,
                message: 'Sign Up Failed Please use anoter ID'
            })
        }
    });
});

router.post('/idCheck', function(req, res) {
    connection.query('SELECT userid FROM usertables WHERE userid = "' + req.body.userid + '"', function(err, row) {
        if (row[0] == undefined) {
            res.send({
                success: true
            })
        } else {
            res.send({
                success: false
            })
        }
    })
});




// 토큰 유효성 검증

// 이 위에는 login, register가 있는데 로그인 시에는 토큰이 없으므로, 로그인은 토큰 검증을 하지 않아야하기 때문에
// 위에 위치시키며 토큰 검증이 필요한 작업들은 아래에 위치시킨다.
// /* 이므로 이 아래의 모든 요청들은 이 작업을 수행한 후에 진행된다.

router.use('/*', function(req, res, next) {
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

/* GET users listing. */
router.get('/list', function(req, res) {
    connection.query('SELECT * FROM usertables', function(err, rows) {
        res.send(rows);
    });
});



module.exports = router;