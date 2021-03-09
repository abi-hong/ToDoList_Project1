const express = require('express');
const router = express.Router();
const { List } = require("../models/List");


router.post("/save", (req, res) => {
    const list = new List(req.body);
    list.save((err, listInfo) => {
        if(err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, list  });
    });
});

router.get("/getList", (req, res) => {
    //리스트를 DB에서 가져와서 client로 보내기
    List.find()
        .populate('writer') //populate을 통해 User에 있는 모든 정보를 가져올 수 있음
        .exec((err, lists) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, lists })
        })
});

module.exports = router;