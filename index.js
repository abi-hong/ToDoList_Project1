
const express = require('express') //다운받은 express 모듈 가져오기
const app = express() //express function을 이용해서 express app을 만듬
const port = 5000 //5000 port를 backserver로 둔다.
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//const { auth } = require('./middleware/auth');
//const { User } = require('./models/User'); // 회원가입할 때, 필요하기 때문에 User모델을 가져온다.
const config = require('./config/key');

//몽구스를 이용해서 app과 서버를 연결할 것!
const mongoose = require('mongoose');
const connect = mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
    }).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.use(bodyParser.urlencoded({extended: true})); //application/x-www-form-urlencoded
app.use(bodyParser.json()); //application/json
app.use(cookieParser());

app.use('/api/users', require('./routes/users'));
app.use('/api/image', require('./routes/image'));



app.get('/', (req, res) => res.send('Hello World!'))
//route 디렉토리에 오면 Hello World!를 출력되게 한다.


app.listen(
    port, () => console.log(`Example app listening on port ${port}!`)
)
//이 app이 5000번에 listen을 하면 console에  출력된다.

