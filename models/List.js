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
        new mongoose.Schema({
        toDO: String,
        date: { type: Date, default: Date.now },
        private: { type: Boolean, default: true },
        })
    ]
});

const List = mongoose.model('List', listSchema);
module.exports = { List };