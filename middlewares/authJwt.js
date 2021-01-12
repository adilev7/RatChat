const jwt = require("jsonwebtoken");
const { secret } = require("../config/auth.config");

// Middleware for verifying the token recieved from the client's header on sign-in.

const verifyJwt = (req, res, next) => {
  // Check if a token exists under a header property named "x-access-token"
  const token = req.header("x-access-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");
  // if exists, verify the token using the 'secret'
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "Invalid Token." });
    }
    // after verification, save decoded object (the user) under req.user.
    req.user = decoded;
    next();
  });
  /* OR: */
  // try {
  //   const decoded = jwt.verify(token, config.get("jwtKey"));
  //   req.user = decoded;
  //   next();
  // } catch (ex) {
  //   res.status(400).send("Invalid token.");
  // }
};

module.exports = verifyJwt;
