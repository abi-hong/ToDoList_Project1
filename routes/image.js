const express = require('express');
const router = express.Router();
//const { Image } = require('../models/Image');
const { User } = require('../models/User');

const { auth } = require('../middleware/auth');
const multer = require('multer');
//const ffmpeg = require("fluent-ffmpeg"); //썸네일 저장

//multer 모듈을 통해서 post로 전송된 파일의 저장경로와 파일명 등을 처리하기 위해서
//DiskStorage 엔진이 필요하다.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') //cb콜백함수를 통해 전송된 파일 저장 디렉토리 설정 
    },
    filename: (req, file, cb) => { //cb콜백함수를 통해 전송된 파일 이름 설정
        cb(null, `${Date.now()}_${file.originalname}`) 
    },
    fileFilter: (req, file, cb) => { //업로드할 파일을 필터링 할 수 있도록 설정하는 부분
        const ext = path.extname(file.originalname) //ext는 확장자명
        if (ext !== '.jpg') {
            return cb(res.status(400).end('only jpg, png is allowed'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } //업로드에 대한 제한사항 설정, 파일 사이즈는 5MB로 제한
});

//upload에 multer관련 설정을 담아 라우터에서 req.file로 업로드한 이미지 정보에
//접근이 가능하도록 한다.
//single은 이미지 업로드시 이미지 파일 하나를 받겠다.
const upload = multer({storage: storage}).single('profile_img');


router.post('/uploadfiles', (req, res) => {
    //client에서 보낸 이미지를 server에 저장
    //multer 모듈 사용
    const user = new User(req.body);

    upload(req, res, err => {
        if(err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
    })

    user.save((err, doc) => {
        if(err) return es.json({ success: false, err})
        res.status(200).json({ success: true })
    })
    
})

module.exports = router;