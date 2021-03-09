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

module.exports = router;