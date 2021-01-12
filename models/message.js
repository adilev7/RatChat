const mongoose = require("mongoose");
const dayjs = require("dayjs");

const messageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: false,
  },
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    unique: false,
    required: true,
  },
  createdAt: {
    type: String,
    default: dayjs().format("DD/MM/YYYY H:mm:ss"),
  },
});
const Message = mongoose.model("Message", messageSchema);

exports.Message = Message;
