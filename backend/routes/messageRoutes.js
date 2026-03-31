const express = require("express");
const router = express.Router();

const messageController = require("./../controllers/messageController");
const authController = require("./../controllers/authController");

router.use(authController.protect);

router.post("/", messageController.sendMessage);

router.get("/:convoId", messageController.getMessage);

module.exports = router;
