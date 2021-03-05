const { User } = require('../models/User');
let auth = (req, res, next) => {
    //인증 처리를 하는 곳
    //client 쿠키에서 토큰을 가져오기
    let token = req.cookies.x_auth;
    //토큰을 복화화한 후, 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })
        //유저가 있으면
        req.token = token;
        req.user = user;
        next(); //미들웨어에서 넘어갈 수 있도록
    })
    //유저가 있으면 인증 OK

    //유저가 없으면 인증 NO

}
module.exports = {auth};