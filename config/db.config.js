const mongoose = require("mongoose");
require("dotenv").config();

const connectionOptions = {
  username: process.env.MONGO_USER || "",
  password: process.env.MONGO_PASS || "",
  host: process.env.MONGO_HOST || "",
  db: process.env.MONGO_DB || "",
};

function createURI({ username, password, host, db }) {
  if (username && password) {
    return `mongodb+srv://${username}:${password}@${host}/${db}?retryWrites=true&w=majority`;
  }
  return `mongodb://${host}/${db}`;
}

function connect(options = connectionOptions) {
  return mongoose.connect(createURI(options), {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: false,
    //useCreateIndex: true,
  });
}

module.exports = connect;
