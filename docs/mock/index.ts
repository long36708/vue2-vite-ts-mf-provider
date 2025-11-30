/**
 * MSW 1.x 配置文件 - 统一入口
 * 根据环境自动选择浏览器或服务器端配置
 */

// 根据环境选择不同的 MSW 配置
const { setupMsw } = require('./browser');
const { server, startMswServer, stopMswServer, handlers } = require('./server');

module.exports = {
  setupMsw,
  server,
  startMswServer,
  stopMswServer,
  handlers,
};
