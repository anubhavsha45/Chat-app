const express = require("express");
const router = express.Router();

const messageController = require("./../controllers/messageController");
const authController = require("./../controllers/authController");

// Protect all routes
router.use(authController.protect);

// Send message
router.post("/", messageController.sendMessage);

// Get messages of a conversation
router.get("/:convoId", messageController.getMessage);

module.exports = router;
