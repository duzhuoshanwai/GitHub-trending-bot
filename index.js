/**
 * @file 主程序入口文件
 * @author du_zhuo
 * @description
 * 1. 导入依赖模块
 * 2. 从环境变量中读取必要的配置信息
 * 3. 创建 WebhookServer 实例并启动服务器
 * 4. 创建 TelegramBot 实例并监听消息和命令
 * 5. 创建 ChatIdManager 实例并连接到 MongoDB
 */


const TelegramBot = require('node-telegram-bot-api');
const ChatIdManager = require('./models'); 
const WebhookServer = require('./webhookServer');
const PORT = process.env.PORT || 3001;


// 读取环境变量
require('dotenv').config();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MONGODB_URL = process.env.MONGODB_URL;

console.log(TELEGRAM_BOT_TOKEN);
console.log(MONGODB_URL);


// 创建 WebhookServer 实例
const webhookServer = new WebhookServer(PORT);

// 设置 Webhook 路由和处理逻辑
webhookServer.setWebhookRoute('/webhook', async (data) => {
    try {
        // 处理接收到的数据并推送给所有chatid
        const chatIdManager = new ChatIdManager(MONGODB_URL);
        await chatIdManager.connect();
        const chatIds = await chatIdManager.getAllChatIds();
        for (const chatId of chatIds) {
            await bot.sendMessage(chatId.chatId, data);
        }
    } catch (err) {
        console.error('Error processing received data:', err);
    }
});

// 启动服务器
webhookServer.start();

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
    polling: true,
  });

// const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
//     polling: true,
//     request: {
//       proxy: "http://127.0.0.1:20171",
//     },
//   });
const chatIdManager = new ChatIdManager(MONGODB_URL);

chatIdManager.connect();


// 监听所有消息
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // 排除所有命令
    if (text.startsWith('/')) {
        return; // 直接返回，不进行任何处理
    }

    const exists = await chatIdManager.chatIdExists(chatId); // 判断 chatId 是否存在
    if (exists) {
        bot.sendMessage(chatId, '您已经绑定过啦，需要解绑请使用 /unbind');
    } else {
        bot.sendMessage(chatId, '请输入 /bind 进行绑定');
    }
});

// 监听命令 /bind
bot.onText(/\/bind/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const success = await chatIdManager.saveChatId(chatId);
        if (success) {
            bot.sendMessage(chatId, '绑定成功，您可以使用 /unbind 来解绑');
        } else {
            bot.sendMessage(chatId, '绑定失败，您已经绑定过啦');
        }
    } catch (err) {
        console.error('Error saving chatId:', err);
        bot.sendMessage(chatId, '绑定失败，请重试或者联系@du_zhuo');
    }
});

// 监听命令 /unbind
bot.onText(/\/unbind/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const success = await chatIdManager.deleteChatId(chatId);
        if (success) {
            bot.sendMessage(chatId, '解除绑定成功，您可以使用 /bind 来重新绑定');
        } else {
            bot.sendMessage(chatId, '解除绑定失败，您还没有绑定');
        }
    } catch (err) {
        console.error('Error deleting chatId:', err);
        bot.sendMessage(chatId, '解除绑定，请重试或者联系@du_zhuo');
    }
});




