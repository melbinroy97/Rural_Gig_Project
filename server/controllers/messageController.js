const messageService = require('../services/messageService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all conversations for user
// @route   GET /api/v1/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const conversations = await messageService.getConversations(req.user._id);
  res.json(conversations);
});

// @desc    Get messages in a conversation
// @route   GET /api/v1/messages/:conversationId/messages
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const messages = await messageService.getMessages(req.params.conversationId, req.user._id);
  res.json(messages);
});

// @desc    Send a message
// @route   POST /api/v1/messages/send
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const message = await messageService.sendMessage(req.user._id, req.body);

  // Emit via Socket.io if available
  if (req.io) {
    req.io.to(req.body.receiverId).emit('message received', message);
  }

  res.status(201).json(message);
});

module.exports = {
  getConversations,
  getMessages,
  sendMessage
};
