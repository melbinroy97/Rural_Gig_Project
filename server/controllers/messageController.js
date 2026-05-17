const Message = require('../models/Message');

// @desc    Get all conversations for user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar');

    // Group by conversation
    const conversations = [];
    const conversationIds = new Set();

    for (let msg of messages) {
      if (!conversationIds.has(msg.conversationId)) {
        conversationIds.add(msg.conversationId);
        
        const otherUser = msg.sender._id.toString() === req.user._id.toString() 
          ? msg.receiver 
          : msg.sender;

        conversations.push({
          conversationId: msg.conversationId,
          otherUser,
          lastMessage: msg.content,
          updatedAt: msg.createdAt,
          unread: msg.receiver._id.toString() === req.user._id.toString() && !msg.read
        });
      }
    }

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { conversationId: req.params.conversationId, receiver: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/messages/send
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, conversationId } = req.body;

    // Generate conversationId if not provided (e.g. senderId_receiverId sorted)
    let convId = conversationId;
    if (!convId) {
      const ids = [req.user._id.toString(), receiverId].sort();
      convId = `${ids[0]}_${ids[1]}`;
    }

    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      conversationId: convId,
      content
    });

    const createdMessage = await message.save();
    
    // Populate before sending back to client
    await createdMessage.populate('sender', 'name avatar');
    await createdMessage.populate('receiver', 'name avatar');

    // Emit via Socket.io if available
    if (req.io) {
        req.io.to(receiverId).emit('message received', createdMessage);
    }

    res.status(201).json(createdMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage
};
