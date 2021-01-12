const express = require("express");
const router = express.Router();

const { verifyJwt } = require("../middlewares/index");
const userController = require("../controllers/user.controller");

/* Sign-In */
router.get("/signin", verifyJwt, (req, res) => {
  res.status(200).send("successfuly verified!");
});

router.get("/", verifyJwt, userController.getAllUsers);

router.get("/friends", verifyJwt, userController.getFriends);

router.get("/:id", verifyJwt, userController.getUser);

router.put("/", verifyJwt, userController.updateUser);

router.delete("/:id", verifyJwt, userController.deleteUser);

router.patch("/add-friend", verifyJwt, userController.addFriend);
//expects req.body.friendId ==> 'friendId'

router.patch("/remove-friend", verifyJwt, userController.removeFriend);
//expects req.body.friendId ==> 'friendId'

module.exports = router;
