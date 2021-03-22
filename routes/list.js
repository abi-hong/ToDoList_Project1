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
        if(req.body.todos.length !== 0)
        //추가!!
    })
    .catch((err) => {
        res.status(400).send(err);
    })
});

//리스트를 DB에서 가져와서 client로 보내기
router.get("/getList", (req, res) => {
    //client에서 writer, category, date 정보 전달해주어야 함
    List.findOne(
        {
            writer: req.body.writer,
            category: req.body.category,
            "todos.year": req.body.year,
            "todos.month": req.body.month,
            "todos.today": req.body.today,
        }
    ).exec()
    .then((list) => {
        if(!list)
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
        
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});


router.get("/getTodaySuccess", (req, res) => {
    let total = 0;
    let done = 0;
    List.find({
        writer: req.body.writer,
        todos: {
            $elemMatch:{
                year: req.body.year,
                month: req.body.month,
                today: req.body.today
            }
        }
    })
    .exec()
    .then((list) => {
        for(i = 0; i < list.length; i++) {
            total += list[i].todos.length;
            for(j = 0; j < list[i].todos.length; j++) {
                if(list[i].todos[j].checked === true) done += 1;
            }
        }
        res.status(200).json({
            success: true,
            total,
            done
        });
    })
    .catch((err) => {
        res.status(400).send(err);
    })
})

//이달의 달성률
router.get("/getMonthSuccess", (req, res) => {
    let total = 0;
    let done = 0;
    List.find({
        writer: req.body.writer,
        todos: {
            $elemMatch: {
                year: req.body.year,
                month: req.body.month
            }
        }
    })
    .exec()
    .then((list) => {
        for (i = 0; i < list.length; i++) {
            total += list[i].todos.length;
            for(j = 0; j < list[i].todos.length; j++) {
                if(list[i].todos[j].checked === true) done += 1;
            }
        }
        res.status(200).json({
            success: true,
            total,
            done
        });
    })
    .catch((err) => {
        res.status(400).send(err);
    })
})

module.exports = router; 