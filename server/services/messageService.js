const conversationRepository = require('../repositories/conversationRepository');
const messageRepository = require('../repositories/messageRepository');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');

class MessageService {
  async getConversations(userId) {
    const conversations = await conversationRepository.findByUser(userId);
    
    return conversations.map(conv => {
      const otherUser = conv.participants.find(p => p._id.toString() !== userId.toString());
      return {
        conversationId: conv._id,
        otherUser,
        lastMessage: conv.lastMessage,
        updatedAt: conv.updatedAt
      };
    });
  }

  async getMessages(conversationId, userId) {
    // Mark messages in conversation as read for the current user
    await messageRepository.markAsRead(conversationId, userId);
    return await messageRepository.findByConversationId(conversationId);
  }

  async sendMessage(senderId, messageData) {
    const { receiverId, content, conversationId } = messageData;

    let convId = conversationId;
    let conversation;

    if (!convId) {
      // Find or create conversation between these two
      conversation = await conversationRepository.findByParticipants([senderId, receiverId]);
      if (!conversation) {
        conversation = await conversationRepository.create([senderId, receiverId], content);
      } else {
        await conversationRepository.updateLastMessage(conversation._id, content);
      }
      convId = conversation._id;
    } else {
      await conversationRepository.updateLastMessage(convId, content);
    }

    const message = await messageRepository.create({
      sender: senderId,
      receiver: receiverId,
      conversationId: convId.toString(),
      content
    });

    await message.populate('sender', 'name avatar');
    await message.populate('receiver', 'name avatar');

    return message;
  }
}

module.exports = new MessageService();
