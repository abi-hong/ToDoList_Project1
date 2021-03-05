
const express = require('express') //다운받은 express 모듈 가져오기
const app = express() //express function을 이용해서 express app을 만듬
const port = 5000 //5000 port를 backserver로 둔다.
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User'); // 회원가입할 때, 필요하기 때문에 User모델을 가져온다.

const config = require('./config/key');
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

//몽구스를 이용해서 app과 서버를 연결할 것!
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))
//route 디렉토리에 오면 Hello World!를 출력되게 한다.


//register Route
app.post('/api/users/register', (req, res) => { //(endpoint, 콜백함수)
    //회원가입 할 때, 필요한 정보들을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.
    //이것들을 하기 위해서 User 모델을 가져와야 한다.
    const user = new User(req.body)

    //이 사이에 비밀번호를 암호화 시켜야 한다.

    //받아온 정보들이 User모델에 저장됨 .save는 
    user.save((err) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req,res) => {
    //요청된 id가 데이터베이스에 있는지 찾는다.
    User.findOne({id: req.body.id }, (err, user) => {
        if(!user) { //user가 비어있으면(없다면)
            return res.json({
                loginSuccess: false,
                message: "제공된 아이디에 해당하는 유저가 없습니다."
            })
        }
        //요청된 id가 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) 
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            //비밀번호까지 맞다면 토큰을 생성한다.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
                //토큰을 저장한다. 어디에? 쿠키 혹은 로컬스토로지에 저장할 수 있다.
                res.cookie("x_auth", user.token) //쿠키 스토리지에 name이 x_auth, value에 토큰이 들어간다.
                .status(200)
                .json({loginSuccess: true, userId: user._id})
            })

        })
    })
    //비밀번호까지 맞다면 토큰을 생성하기
})

app.get('/api/users/auth', auth,(req, res) => { //auth 미드웨어
    //여기까지 미들웨어를 통과해 왔다는 것은 Authentication이 True 라는 말이다.
    res.status(200).json({
        _id : req.user.id,
        //isAdmin: req.user.role === 0? false: true,
        isAuth: true,
        nickName: req.user.nickName,
        role: req.user.role
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id},
        {token: ""},
        (err, user) => {
            if(err) return res.json({ success: false, err});
            return res.status(200).send({ success: true})
        })
})

app.listen(
    port, () => console.log(`Example app listening on port ${port}!`)
)
//이 app이 5000번에 listen을 하면 console에  출력된다.

