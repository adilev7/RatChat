const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/auth.config");
const dayjs = require("dayjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255,
    },
    friends: [String],
    createdAt: {
      type: String,
      default: dayjs().format("DD/MM/YYYY H:mm:ss"),
    },
  },
  { autoIndex: false }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    // jwt.sign(payload,secret)
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      friends: this.friends,
      createdAt: this.createdAt,
    },
    secret
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(2).max(30).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
