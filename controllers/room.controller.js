const db = require("../models/index");
const _ = require("lodash");

const findRoom = async (allRoomUsers) => {
  const room = await db.Room.findOne({
    isGroup: false,
    roomUsers: { $all: allRoomUsers },
  })
    .exec()
    .then((data) => data)
    .catch((err) => {
      throw err;
    });
  return room;
};

exports.createRoom = async (req, res) => {
  const currentUserId = req.user._id; // Room creator
  const usersForRoom = req.body.roomUsers; // All users except creator
  const allRoomUsers = [currentUserId, ...usersForRoom]; // All room users
  let allowRoom = false;
  let isGroup = false;
  // Check if each user exists
  await db.User.find({ _id: { $in: [...allRoomUsers] } })
    .exec()
    .then((data) => {
      // .exec((err, data) => {
      // if (err || !data.length) throw err;
      if (!data || !data.length) throw "Invalid Request";
      allRoomUsersDb = data.map((user) => user._id.toString());
      allowRoom =
        allRoomUsers.length === allRoomUsersDb.length &&
        allRoomUsers.every((item) => allRoomUsersDb.includes(item));

      if (!allowRoom) {
        return res.status(400).send("Invalid Request");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("Invalid Request");
    });
  // If private room (2 people or less) check if room exists
  //If the room exists, res.send() it
  if (allRoomUsers.length <= 2) {
    const room = await findRoom(allRoomUsers, isGroup);
    if (room) {
      return res.send({ message: "This room already exists", room });
    }
  } else {
    isGroup = true;
  }

  if (allowRoom) {
    new db.Room({ roomUsers: allRoomUsers, isGroup })
      .save()
      .then((room) => res.send({ message: "Successfully created room", room }))
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.getAllRooms = (req, res) => {
  db.Room.find()
    .then((rooms) => res.send(rooms))
    .catch((err) => {
      res.status(500).send(err);
      console.log(err);
    });
};

exports.getRoom = (req, res) => {
  const id = req.params.id;
  db.Room.findById(id)
    .then((room) => {
      res.send(room);
      return room;
    })
    .catch((err) => {
      res.status(500).send(err);
      console.log(err);
    });
};

exports.getMyRooms = (req, res) => {
  const id = req.user._id; // decoded jwt
  db.Room.find({ roomUsers: id })
    .then((rooms) => res.send(rooms))
    .catch((err) => {
      res.status(500).send(err);
      console.log(err);
    });
};

exports.getRoomsByFriend = (req, res) => {
  const currentUser = req.user; // decoded jwt
  const friendId = currentUser.friends.find(
    (friend) => friend === req.params._id
  );

  db.Room.find({ roomUsers: { $all: [currentUser._id, friendId] } })
    .then((rooms) => res.send(rooms))
    .catch((err) => {
      throw err;
    });
};

exports.updateRoom = (req, res) => {
  if (!req.body) {
    return res.status(404).send({ message: "Data cannot be empty" });
  }
  const id = req.body._id;
  db.Room.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((room) => {
      if (!room) {
        res.status(406).send("Room does not exist or was not found");
      }
      return res.send({ message: "Successfully updated room", room });
    })
    .catch((err) => {
      res.status(400).send(err);
      console.log(err);
    });
};

exports.deleteRoom = (req, res) => {
  const id = req.params.id;
  if (!req.params) {
    res.status(400).send("Request cannot be empty");
  }
  db.Room.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(406).send("Room does not exist or was not found");
      }
      return res.send({ message: "Successfully deleted room", room });
    })
    .catch((err) => {
      res.status(400).send(err);
      console.log(err);
    });
};

exports.addFriendToRoom = async (req, res) => {
  const roomId = req.body.roomId;
  const friendId = req.body.friendId;
  const currentUserId = req.user._id; // decoded jwt
  const hasFriend = await db.User.find({
    _id: currentUserId,
    friends: { $in: friendId },
  })
    .exec()
    .then((data) => data)
    .catch((err) => console.error(err));
  if (!hasFriend) {
    return res
      .status(406)
      .send(`User ${friendId} was not found in your friends list`);
  }
  await db.User.findOne({ _id: friendId }).exec((err, data) => {
    if (err) {
      return res.send(err);
    }
    db.Room.updateOne(
      { _id: roomId },
      { $addToSet: { roomUsers: [friendId] } }
    ).exec((err, data) => {
      if (err) {
        return res.status(500).send("An unexpected error occured");
      }
      return res.send({
        message: `User ${friendId} has been sucessfully added`,
        data,
      });
    });
  });
};

exports.exitFromRoom = (req, res) => {
  const roomId = req.body.roomId;
  const userId = req.user._id; // decoded jwt
  db.Room.updateOne(
    { _id: roomId },
    { $pull: { roomUsers: userId }, $addToSet: { hasLeft: userId } }
  )
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
};
