const mongoose = require('mongoose');

class ChatIdManager {
    constructor(dbUri) {
        this.dbUri = dbUri;

        // 定义 ChatId Schema 和 Model
        const chatIdSchema = new mongoose.Schema({
            chatId: { type: Number, unique: true }, // chatId 为唯一值
        });

        this.ChatId = mongoose.model('ChatId', chatIdSchema);
    }

    // 连接到 MongoDB
    async connect() {
        try {
            await mongoose.connect(this.dbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
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
                console.log(`Saved new chatId: ${chatId}`);
            }
        } catch (err) {
            console.error('Error saving chatId:', err);
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
}

module.exports = ChatIdManager;
