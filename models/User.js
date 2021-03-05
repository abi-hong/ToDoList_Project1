//유저 모델과 스키마 만들기
const mongoose = require('mongoose'); //몽구스 모델 가져오기
const bcrypt = require('bcrypt'); //비밀번호를 암호화할 때, 필요한 bcrypt 가져오기 
const saltRounds = 10; //salt가 몇 글자인지를 나타낸다.
const jwt = require('jsonwebtoken');

//유저 스키마를 만든다!
const userSchema = mongoose.Schema({
    nickName: {
        type: String,
        minlength: 2,
        maxlength: 10,
        required: true,
        trim: true,
        unique: 1
    },
    id: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 10,
        required: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5,
        required: true
    },
    role: {
        //관리자 유저 혹은 일반 유저일 수도 있기에 role을 부여한다.
        type: Number,
        default: 0
    },
    image: String,
    token: {
        //토큰을 할당해서 유효성을 검사할 수 있다.
        type: String
    },
    tokenExp: {
        //토큰을 사용할 수 있는 기간을 부여한다.
        type: Number
    }
})

userSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')) { //비밀번호가 변경될 때만 bcrypt를 이용해서 암호화하도록 설정한다.
        
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else { //비밀번호가 아닌 다른 걸 바꿀땐, 
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword 1234567와  암호화된 비밀번호가 같은지 체크해야 한다.
    //띠리서 plainPassword를 암호화한 후 DB에 있는 비번과 비교해야 한다.
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    //jsonwebtoken을 이용해서 토큰을 생성한다.
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    //user._id + 'secretToken' = token
    //-->
    //'secretToken' --> user._id
    user.token = token;
    user.save (function(err, user) {
        if(err) return cb(err);
        cb(null, user);
    })

}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    //가져온 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 토큰과 데이터베이스에 보관된 토큰이 일치하는 확인
        user.findOne({ "_id": decoded, "token": token}, function (err, user) {
            if(err) return cb(err);
            cb(null, user);
        })
    })
}
// 스키마를 모델로 변환하여 내보내기 합니다.
const User = mongoose.model('User', userSchema) // (이 모델의 이름, 스키마 이름)
module.exports = {User} //다른 곳에서도 이 모델이 쓰일 수 있게 export 해준다.
