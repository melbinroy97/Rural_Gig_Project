const Conversation = require('../models/Conversation');

class ConversationRepository {
  async findByUser(userId) {
    return await Conversation.find({
      participants: { $in: [userId] }
    })
    .populate('participants', 'name avatar')
    .sort({ updatedAt: -1 });
  }

  async findByParticipants(participants) {
    return await Conversation.findOne({
      participants: { $all: participants }
    });
  }

  async create(participants, lastMessage) {
    return await Conversation.create({ participants, lastMessage });
  }

  async updateLastMessage(id, messageText) {
    return await Conversation.findByIdAndUpdate(id, {
      lastMessage: messageText
    }, { new: true });
  }

  async findById(id) {
    return await Conversation.findById(id).populate('participants', 'name avatar');
  }
}

module.exports = new ConversationRepository();
