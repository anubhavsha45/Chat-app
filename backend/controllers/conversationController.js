const Conversation = require("../models/Conversation");
const catchAsync = require("./../utils/catchAsync");

exports.getConversations = catchAsync(async (req, res, next) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
  })
    .populate("participants", "name email")
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "name email",
      },
    })
    .sort({ updatedAt: -1 });

  const formattedConversations = conversations.map((conv) => {
    const otherUser = conv.participants.find(
      (p) => p._id.toString() !== req.user._id.toString(),
    );

    return {
      _id: conv._id,
      chatWith: otherUser, // 👈 only other user
      lastMessage: conv.lastMessage,
      updatedAt: conv.updatedAt,
    };
  });

  // 3. Send response
  res.status(200).json({
    status: "success",
    results: formattedConversations.length,
    data: {
      conversations: formattedConversations,
    },
  });
});
