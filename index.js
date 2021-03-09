
const express = require("express");
const app = express();
const port = 4000;
const bodyParser = require("body-parser"); // client에서 보낸 데이터를 해석해서 req.body 객체로 만들어줌
const cookieParser = require("cookie-parser"); // 요청에 동봉된 쿠키를 해석해 req.cookies 객체로 만들어줌
const config = require("./config/key");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const mongoose = require("mongoose");
// database 연결
mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

app.use("/api/users", require("./routes/users"));
app.use("/api/users", require("./routes/image"));
app.use("/api/list", require("./routes/list"));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
}); // port 4000번 넣어서 이 앱을 실행하는 것