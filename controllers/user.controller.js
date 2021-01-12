const db = require("../models/index");
const _ = require("lodash");

exports.getAllUsers = (req, res) => {
  db.User.find()
    .then((users) => {
      const usersPick = users.map((user) => {
        return _.pick(user, ["_id", "username", "email", "friends"]);
      });
      res.send(usersPick);
    })
    .catch((err) => res.send(err));
};

exports.getFriends = async (req, res) => {
  const friendsIdArr = req.user.friends;
  await db.User.find({ _id: { $in: friendsIdArr } })
    .then((users) => {
      const usersPick = users.map((user) => {
        return _.pick(user, ["_id", "username", "email", "friends"]);
      });
      res.send(usersPick);
    })
    .catch((err) => res.send(err));
};

exports.getUser = (req, res) => {
  const id = req.params.id;
  db.User.findById(id)
    .then((user) => {
      const userPick = _.pick(user, ["_id", "username", "email", "friends"]);
      res.send(userPick);
    })
    .catch((err) => res.send(err));
};

exports.updateUser = (req, res) => {
  if (!req.body) {
    return res.status(404).send({ message: "Data cannot be empty" });
  }
  const id = req.body._id;
  db.User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(() => res.send("User Updated Successfuly!"))
    .catch((err) => res.send(err));
};

exports.deleteUser = (req, res) => {
  const id = req.params.id;
  db.User.findByIdAndRemove(id, { useFindAndModify: false })
    .then(() => res.send("User Has Been Removed"))
    .catch((err) => res.send(err));
};

exports.addFriend = async (req, res) => {
  const friendId = req.body.friendId;
  const currentUserId = req.user._id;
  // Check if the providen friend ID belongs to a real user
  await db.User.findById(friendId).exec((err, data) => {
    if (err || !data) {
      return res.status(400).send(err);
    }
    db.User.updateOne(
      { _id: currentUserId },
      { $addToSet: { friends: friendId } }
    ).exec((err, data) => {
      if (err) {
        return res.send(err);
      }
      req.user.friends = [friendId, ...req.user.friends];
      return res.send(`User ${friendId} has been added to your friends list`);
    });
  });
};

exports.removeFriend = (req, res) => {
  const currentUser = req.user; // decoded jwt
  const friendId = currentUser.friends.find(
    (friend) => friend === req.body.friendId
  );
  if (!friendId) {
    return res.status(404).send("Invalid Request");
  }
  db.User.updateOne(
    { _id: currentUser._id },
    { $pull: { friends: friendId } }
  ).exec((err, data) => {
    if (err) {
      return res.send(err);
    }
    req.user.friends = req.user.friends.filter((id) => id != friendId);
    return res.send(`User ${friendId} has been removed from your friends list`);
  });
};
