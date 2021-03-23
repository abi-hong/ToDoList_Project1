const express = require('express');
const router = express.Router();
const { List } = require("../models/List");

//리스크 저장 router
// client에서 post 요청할 때 writer 정보(User)를 함께 보내줘야 함
router.post("/saveList", (req, res) => {
    const list = new List(req.body);
    List.findOneAndDelete(
        {
            writer: req.body.writer,
            category: req.body.category,
            "todos.year": req.body.year,
            "todos.month": req.body.month,
            "todos.today": req.body.today
        }
    ).exec()
    .then((info) => {
        //빈 배열로 남아있지 않게 조건 넣어줌
        if(req.body.todos.length !== 0)
        {
            list.save((err, listInfo) => {
                if(err) return res.json({ success: false, err });
            });
            //다시 생각해보기
            return res.json({ success: true, listInfo });
        }
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

//리스트를 DB에서 가져와서 client로 보내기
router.post("/getList", (req, res) => {
    //client에서 writer, category, date 정보 전달해주어야 함
    List.findOne(
    {
        writer: req.body.writer,
        category: req.body.category,
        "todos.year": req.body.year,
        "todos.month": req.body.month,
        "todos.today": req.body.today,
    }).exec()
    .then((list) => {
        if(!list) //작성된 리스트가 없더라도 화면 상에 뜨기 위해
            return res.json({ success: true, list });
    })
    .then((list) => {
        return res.status(200).json({
            success: true,
            listCount: list.todos.length, //listCount는 writer, category, date로 찾은 todos 안의 배열 개수
            list,
        })
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

//달성률(오늘, 이달) --> client로 total과 done 개수 보내기
router.post("/getSuccess", (req, res) => {
    let todayTotal = 0;
    let todayDone = 0;
    let monthTotal = 0;
    let monthDone = 0;
    
    List.find({
        writer: req.body.writer,
        "todos.year": req.body.year,
        "todos.month": req.body.month
    })
    .exec()
    .then((list) => {
        for(i = 0; i < list.length; i++) {
            for(j = 0; j < list[i].todos.length; j++) {
                if(list[i].todos[j].checked === true) monthDone++;
                if(list[i].todos[j].today === req.body.today) {
                    todayTotal++;
                    if(list[i].todos[j].checked === true) todayDone++;
                }
            }
        }
        return res.status(200).json({
            success: true,
            todayTotal,
            todayDone,
            monthTotal,
            monthDate
        });
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});




module.exports = router; 