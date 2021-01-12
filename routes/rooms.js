const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");
const { verifyJwt } = require("../middlewares/index");

router.post("/", verifyJwt, roomController.createRoom);

router.get("/", verifyJwt, roomController.getAllRooms);

router.get("/my-rooms", verifyJwt, roomController.getMyRooms);

router.get("/:id", verifyJwt, roomController.getRoom);

router.put("/", verifyJwt, roomController.updateRoom);

router.delete("/:id", verifyJwt, roomController.deleteRoom);

router.patch("/add-friend", verifyJwt, roomController.addFriendToRoom);
// expects req.body: { roomId, friendId };

router.patch("/exit-room", verifyJwt, roomController.exitFromRoom);
// expects req.body: { roomId };

module.exports = router;
