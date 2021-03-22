const mongoose = require("mongoose"); // 모듈 가져오기
const Schema = mongoose.Schema;

const listSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        required: true,
    },
    todos: [
        new mongoose.Schema(
        {
            id: Number, //리스트 별 id(배열의 인덱스)를 나타냄, client에서 구분하기 쉽도록
            text: String,
            year: { type: Number, required: true },
            month: { type: Number, required: true },
            today: { type: Number, required: true },
            privated: { type: Boolean, default: true },
            checked: { type: Boolean, default: false },
        },
        { _id: false }
        ),
    ],
});

const List = mongoose.model("List", listSchema);
module.exports = { List };