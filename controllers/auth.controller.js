const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User, validateUser } = require("../models/user");

/* Sign-Up */
exports.signup = async (req, res) => {
  // 'validateUser' function (Joi) ("../models/user") returns error if exists.
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // If no error, create a new User.
  let user = new User(
    _.pick(req.body, ["username", "email", "password", "friends"])
  );
  // Hash the provided password before saving in DB.
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.save((err, doc) => {
    if (err) res.status(500).send({ error: err });
    return;
  });
  res.status(200).send(_.pick(user, ["username", "email", "createdAt"]));
};

exports.signin = async (req, res) => {
  // 'validate' function (Joi) (line 45) returns error if exists
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // If no error, find a user that matches the provided username.
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).send({ message: "Invalid username or password" });
  }
  // If a user that matches the username was found, compare passwords via bcrypt.
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send({ message: "Invalid username or password" });
  }
  // Jwt Sign - instead of using jwt.sign() here, use the custom method of the User mongoose schema (created in "../model/User.js").
  return res.status(200).send({ token: user.generateAuthToken() });
};

const validate = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(2).max(30).required(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(user);
};
