const express = require('express');
const router = express.Router();
const { List } = require("../models/List");

//리스크 저장 router
router.post("/saveList", (req, res) => {
    const list = new List(req.body);


    //list에 할 일 저장
    List.findOneAndUpdate(
        { writer: req.body.writer, category: req.body.category },
        { $push: { todos: req.body.todos } },
        (err, info) => {
        if (!info) { //todos가 처음 저장되는거면
            list.save((err, listInfo) => {
                if (err) return res.json({ success: false, err });
            });
            return res.json({ success: true, list });
        }
        return res.status(200).json({ success: true, info });
        }
    );
});

//리스트를 DB에서 가져와서 client로 보내기
router.get("/getList", (req, res) => {
    //client에서 writer, category, date 정보 전달해주어야 함
    List.findOne(
        {
            writer: req.body.writer,
            category: req.body.category,
            //날짜 관련해서 코드 작성
        }
    ).exec((err, list) => {
        if(err) return res.status(400).send(err);
        for(i = list.todos.length - 1; i >= 0; i--) {
            if(list.todos[i].today !== req.body.today) {
                list.todos.splice(i, 1);
            }
        }
        res.status(200).json({ 
            success: true,
            //listCount는 writer, category, date로 찾은 todos 안의 배열 개수
            listCount: list.todos.length,
            list
        });
    });
});

//오늘의 달성률 --> client로 total과 done 개수 보내기
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