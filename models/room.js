const dayjs = require("dayjs");
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomUsers: [{ type: String, required: true, unique: true }],
    hasLeft: [String],
    isGroup: { type: Boolean, default: false },
    createdAt: {
      type: String,
      default: dayjs().format("DD/MM/YYYY H:mm:ss"),
    },
  },
  { autoIndex: false }
);
const Room = mongoose.model("Room", roomSchema);

exports.Room = Room;
