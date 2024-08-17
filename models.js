const mongoose = require('mongoose');

const chatIdSchema = new mongoose.Schema({
  chatId: { type: Number, unique: true },
});

const ChatId = mongoose.model('ChatId', chatIdSchema);

class ChatIdManager {
  constructor(dbUri) {
    this.dbUri = dbUri;
    mongoose.connect(this.dbUri, {});
    this.ChatId = ChatId;
  }

  // 连接到 MongoDB
  async connect() {
    try {
      await mongoose.connect(this.dbUri, {
      });
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Failed to connect to MongoDB', err);
    }
  }

  // 保存新的 chatId，如果已存在则不保存
  async saveChatId(chatId) {
    try {
      const existingChatId = await this.ChatId.findOne({ chatId });
      if (!existingChatId) {
        const newChatId = new this.ChatId({ chatId });
        await newChatId.save();
        console.log('已保存 ' + newChatId);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error saving chatId:', err);
      throw err;
    }
  }

  // 获取所有 chatId
  async getAllChatIds() {
    try {
      const chatIds = await this.ChatId.find();
      return chatIds;
    } catch (err) {
      console.error('Error retrieving chatIds:', err);
      throw err;
    }
  }

  // 检查 chatId 是否已存在
  async chatIdExists(chatId) {
    try {
      const existingChatId = await this.ChatId.findOne({ chatId });
      // 如果查询到了 chatId，返回 true，否则返回 false
      return !!existingChatId;
    } catch (err) {
      // 如果出现异常，打印错误信息并重新抛出异常
      console.error('Error checking if chatId exists:', err);
      throw err;
    }
  }

  // 删除 chatId
  async deleteChatId(chatId) {
    try {
      await this.ChatId.deleteOne({ chatId });
      console.log('已删除 ' + chatId);
      return true;
    } catch (err) {
      console.error('Error deleting chatId:', err);
      throw err;
    }
  }
}

module.exports = ChatIdManager;