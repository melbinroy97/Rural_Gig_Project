const Message = require('../models/Message');

class MessageRepository {
  async findByConversationId(conversationId) {
    return await Message.find({ conversationId })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 });
  }

  async create(messageData) {
    return await Message.create(messageData);
  }

  async markAsRead(conversationId, receiverId) {
    return await Message.updateMany(
      { conversationId, receiver: receiverId, read: false },
      { $set: { read: true } }
    );
  }

  async findUserMessages(userId) {
    return await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar');
  }
}

module.exports = new MessageRepository();
