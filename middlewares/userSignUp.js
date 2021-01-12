const db = require("../models/index");

const checkSignUpAvailability = (req, res, next) => {
  db.User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ error: err });
      return;
    }
    if (user) {
      res.status(400).send({ message: "Username already in use." });
      return;
    }
  });
  db.User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ error: err });
      return;
    }
    if (user) {
      res.status(400).send({ message: "Email already in use." });
      return;
    }
  });
  next();
};

module.exports = checkSignUpAvailability;
