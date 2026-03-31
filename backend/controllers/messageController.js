const appError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const Message = require("./../models/Message");
const Conversation = require("./../models/Conversation");
const { getIO, onlineUsers } = require("../socket");
exports.sendMessage = catchAsync(async (req, res, next) => {
  const io = getIO();

  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    return next(new appError("Please provide receiver and content", 400));
  }

  // Prevent self messaging
  if (receiverId === req.user._id.toString()) {
    return next(new appError("You cannot message yourself", 400));
  }

  // Find conversation (1-to-1 only)
  let conversation = await Conversation.findOne({
    participants: {
      $all: [req.user._id, receiverId],
      $size: 2,
    },
  });

  // Create if not exists
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, receiverId],
    });
  }

  // Create message
  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    content,
  });

  // Update last message
  conversation.lastMessage = message._id;
  await conversation.save();

  // Populate sender
  const populatedMessage = await message.populate("sender", "name email");

  //find reciever socket
  const receiverSocketId = onlineUsers.get(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("receiveMessage", {
      message: populatedMessage,
    });
  }

  res.status(201).json({
    status: "success",
    data: {
      message: populatedMessage,
    },
  });
});

exports.getMessage = catchAsync(async (req, res, next) => {
  const { convoId } = req.params;

  // 1. Check conversation exists
  const conversation = await Conversation.findById(convoId);

  if (!conversation) {
    return next(new appError("Conversation not found", 404));
  }

  // 2. Security check
  const isUserInConversation = conversation.participants.some(
    (el) => el.toString() === req.user._id.toString(),
  );

  if (!isUserInConversation) {
    return next(new appError("You are not part of this conversation", 403));
  }

  // 3. Get messages (AFTER auth check)
  const messages = await Message.find({
    conversation: convoId,
  })
    .populate("sender", "name email")
    .sort({ createdAt: 1 });

  // 4. Send response
  res.status(200).json({
    status: "success",
    results: messages.length,
    data: {
      messages,
    },
  });
});
