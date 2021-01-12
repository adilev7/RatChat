const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { verifyJwt } = require("../middlewares/index");

router.post("/", verifyJwt, messageController.createMessage);
// expects req.body: { roomId, text }

router.get("/", verifyJwt, messageController.getAllMessages);

router.get("/my-messages", verifyJwt, messageController.getMyMessages);

router.get("/:id", verifyJwt, messageController.getMessage);

router.put("/", verifyJwt, messageController.updateMessage);

router.delete("/:id", verifyJwt, messageController.deleteMessage);

module.exports = router;
