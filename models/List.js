const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId, //User모델에서 모든 정보를 가져온다.
        ref: 'User'
    },
    category: {
        type: String,
        required: true
    },
    content:[
        new mongoose.Schema(
            {
                toDo: String,
                date: { type: String, required: true },
                private: { type: Boolean, default: true },
                done: { type: Boolean, default: false },
            }, { _id: false } //한 아이디에 여러개의 list이기 때문에 false 작성
        )
    ]
});

const List = mongoose.model('List', listSchema);
module.exports = { List };