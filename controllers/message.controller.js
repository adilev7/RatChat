const db = require("../models/index");
const _ = require("lodash");

exports.createMessage = async (req, res) => {
  const { _id: userId, username } = req.user;
  const { roomId, text } = req.body;
  const room = await db.Room.findById(roomId)
    .exec()
    .then((room) => room)
    .catch((err) => {
      res.status(400).send("Invalid Request");
      console.error(err);
    });
  // if (room) {
  if (!room) {
    return res.status(400).send("Invalid Request");
  }
  new db.Message({ userId, username, roomId, text }, { unique: false })
    .save()
    .then((message) =>
      res.send({ message: "Successfully created message", message })
    )
    .catch((err) => console.log(err));
  // }
};

exports.getAllMessages = (req, res) => {
  db.Message.find()
    .then((messages) => res.send(messages))
    .catch((err) => {
      res.status(500).send(err);
      console.error(err);
    });
};

exports.getMessage = (req, res) => {
  const id = req.params.id;
  db.Message.findById(id)
    .then((message) => {
      res.send(message);
      return message;
    })
    .catch((err) => {
      res.status(500).send(err);
      console.log(err);
    });
};

exports.getMyMessages = (req, res) => {
  const userId = req.user._id; // decoded jwt
  db.Message.find({ userId })
    .then((rooms) => res.send(rooms))
    .catch((err) => {
      res.status(500).send(err);
      console.log(err);
    });
};

exports.updateMessage = async (req, res) => {
  const { _id: msgId, roomId } = req.body;
  if (!req.body) {
    return res.status(400).send({ message: "Invalid Request" });
  }
  const room = await db.Room.findById(roomId)
    .exec()
    .then((room) => room)
    .catch((err) => console.error(err));
  if (!room) return res.status(400).send({ message: "Invalid Request" });
  db.Message.findByIdAndUpdate(msgId, req.body, {
    useFindAndModify: false,
  })
    .then((message) => {
      if (!message) {
        return res.status(406).send("Message does not exist or was not found");
      }
      return res.send({ message: "Successfully updated message", message });
    })
    .catch((err) => {
      res.status(400).send({ message: "Invalid Request" });
      console.log(err);
    });
};

exports.deleteMessage = (req, res) => {
  const id = req.params.id;
  if (!req.params) {
    res.status(400).send("Request cannot be empty");
  }
  db.Message.findByIdAndRemove(id, { useFindAndModify: false })
    .then((message) => {
      if (!message) {
        res.status(406).send("Message does not exist or was not found");
      }
      return res.send({ message: "Successfully deleted message", message });
    })
    .catch((err) => {
      res.status(400).send(err);
      console.log(err);
    });
};
