// 引入 express 和 body-parser 模块
const express = require('express');
const bodyParser = require('body-parser');

// 定义 WebhookServer 类
class WebhookServer {
    /**
     * WebhookServer 构造函数
     * @param {number} port - Webhook 服务器端口号，默认为 3001
     */
    constructor(port) {
        this.app = express(); // 创建 Express 应用实例
        this.port = port || 3001; // 设置 Webhook 服务器端口号

        // 使用 body-parser 中间件解析 JSON 数据
        this.app.use(bodyParser.text());
    }

    /**
     * 设置 Webhook 路由及处理函数
     * @param {string} route - Webhook 路由
     * @param {function} handler - 处理函数
     */
    setWebhookRoute(route, handler) {
        this.app.post(route, (req, res) => {
          const text = req.body;
      
          console.log(`Webhook received on route ${route}:`, text);
      
          handler(text);
      
          res.status(200).send('Webhook received successfully');
        });
    }

    /**
     * 启动 Webhook 服务器
     */
    start() {
        this.app.listen(this.port, () => {
            console.log(`Webhook server is running on port ${this.port}`); // 打印 Webhook 服务器启动信息
        });
    }
}

module.exports = WebhookServer;

