const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

// 회원가입 route
router.post("/register", (req, res) => {
    const user = new User(req.body);
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err }); // 에러 발생 시 client에게 json 형식으로 에러 있다고 전달
        return res.status(200).json({ success: true }); // 저장 성공 시 client에게 json 형식으로 정보 전달
    });
});

// 로그인 route
router.post("/login", (req, res) => {
  // 요청된 id가 database에 있는지 찾기
    User.findOne({ id: req.body.id }, (err, user) => {
        // user collection 안에 이메일 가진 유저 없다면
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다.",
            });
        }
    // 요청된 id가 database에 있다면, 비밀번호 같은지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      // 비밀번호 맞지 않다면
        if (!isMatch) {
            return res.json({
                loginSuccess: false,
                message: "비밀번호가 틀렸습니다.",
            });
        }
      // 비밀번호 맞다면 token 생성
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            // cookie에 token 저장
            res.cookie("x_auth", user.token).status(200).json({
            loginSuccess: true,
            userId: user._id,
            });
        });
        });
    });
});

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAuth: true,
        name: req.user.name,
        ID: req.user.ID,
        image: req.user.image,
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate(
        { _id: req.user._id },
        { token: "" }, // 토큰 지우기
        (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({ success: true });
        }
    );
});

module.exports = router;