const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { auth } = require('../middleware/auth');

router.get("/auth", auth, (req, res) => {
    //여기까지 미들웨어를 통과해 왔다는 것은 Authentication이 True 라는 말이다.
    res.status(200).json({ 
        _id: req.user._id,
        isAuth: true,
        Name: req.user.Name,
        ID: req.user.ID,
        image: req.user.image,
        role: req.user.role
    });
});

router.post('/register', (req,res) => { //(endpoint, 콜백함수)
    //회원가입 할 때, 필요한 정보들을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.
    //이것들을 하기 위해서 User 모델을 가져와야 한다.
    const user = new User(req.body);

      //이 사이에 비밀번호를 암호화 시켜야 한다.

    //.save는 받아온 정보들이 User모델에 저장
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post('/login', (req, res) => {
    //요청된 id가 데이터베이스에 있는지 찾는다.
    User.findOne({ ID: req.body.ID }, (err, user) => {
        if(!user) { //user가 비어있으면(없다면)
            return res.json({
                loginSuccess: false,
                message: "제공된 아이디에 해당하는 유저가 없습니다."
            })
        }
        //요청된 id가 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
        user.comparePassword(req.body.Password, (err, isMatch) => {
            if(!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            //비밀번호까지 맞다면 토큰을 생성한다.
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                //토큰을 저장한다. 어디에? 쿠키 혹은 로컬스토로지에 저장할 수 있다.
                res.cookie("x_auth", user.token) //쿠키 스토리지에 name이 x_auth, value에 토큰이 들어간다.
                .status(200)
                .json({ loginSuccess: true, userId: user._id});
            });
        });
    });
});

router.get('/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id},
        {token: ""},
        (err, user) => {
            if(err) return res.json({ success: false, err});
            return res.status(400).send({
                success: true
            });
        });
});

module.exports = router;