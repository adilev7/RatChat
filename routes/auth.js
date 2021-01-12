const { checkSignUpAvailability } = require("../middlewares/index");
const controller = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();

/* Sign-Up */
router.post("/signup", checkSignUpAvailability, controller.signup);

/* Sign-In */
router.post("/signin", controller.signin);

module.exports = router;
