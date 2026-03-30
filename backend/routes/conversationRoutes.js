const express = require("express");
const router = express.Router();

const conversationController = require("../controllers/conversationController");
const authController = require("../controllers/authController");

router.use(authController.protect);

// Get all conversations of logged-in user
router.get("/", conversationController.getConversations);

module.exports = router;
