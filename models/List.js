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
            id: Number,
            text: String,
            year: { type: Number, required: true },
            month: { type: Number, required: true },
            today: { type: Number, required: true },
            private: { type: Boolean, default: true },
            checked: { type: Boolean, default: false },
        },
        { _id: false }
        ),
    ],
});

const List = mongoose.model("List", listSchema);
module.exports = { List };