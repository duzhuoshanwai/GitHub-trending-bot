const TelegramBot = require('node-telegram-bot-api');
const ChatIdManager = require('./models'); 

// 读取环境变量
require('dotenv').config();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MONGODB_URL = process.env.MONGODB_URL;

console.log(TELEGRAM_BOT_TOKEN);
console.log(MONGODB_URL);

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {polling: true});
const chatIdManager = new ChatIdManager(MONGODB_URL);

// // 使用mongodb存储用户的 chatId
// let chatIdList = [];



// 监听任何类型的消息，并保存用户的 chatId
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    await chatIdManager.saveChatId(chatId);
    bot.sendMessage(chatId, '已收到你的消息');
});


// 示例推送消息给所有用户
async function pushMessageToAllUsers(message) {
    try {
        const chatIds = await chatIdManager.getAllChatIds();
        chatIds.forEach(({ chatId }) => {
            bot.sendMessage(chatId, message);
        });
    } catch (err) {
        console.error('Error sending message to all users:', err);
    }
}

// 每隔一段时间推送消息（例如每隔30秒）
setInterval(() => {
    pushMessageToAllUsers('这是一个定时推送的消息');
}, 30000);
