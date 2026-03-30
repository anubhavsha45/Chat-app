const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    content: String,
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    seenBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
