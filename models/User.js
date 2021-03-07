
const mongoose = require("mongoose"); // 모듈 가져오기
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 10,
        required: true, // 필수값
        unique: true, // 고유한 값이어야 함
    },
    ID: {
        type: String,
        trim: true, // 공백 없애줌
        minlength: 5,
        maxlength: 10,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    image: String,
    token: {
        // 유효성 관리
        type: String,
    },
    tokenExp: {
        // 토큰 사용할 수 있는 기간
        type: Number,
    },
});

// 암호화된 비밀번호 만들기
userSchema.pre("save", function (next) {
    var user = this;
    if (user.isModified("password")) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    // 암호화 후 db에 있는 비밀번호와 같은지 확인
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function (cb) {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), "secretToken"); // token 생성
    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    });
};

userSchema.statics.findByToken = function (token, cb) {
    var user = this;
    // decode token
    jwt.verify(token, "secretToken", function (err, decoded) {
        user.findOne({ _id: decoded, token: token }, function (err, user) {
        if (err) return cb(err);
        cb(null, user);
        });
    });
};

const User = mongoose.model("User", userSchema); // 스키마와 mongoDB 연결
module.exports = { User };