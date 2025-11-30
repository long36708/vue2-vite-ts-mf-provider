# MSW 1.x Mock 配置

本目录包含 MSW (Mock Service Worker) 1.x 的所有配置文件，用于模拟 API 请求和响应。

## 文件结构

- `browser.js` - 浏览器端的 MSW 配置
- `server.js` - Node.js 环境下的 MSW 配置
- `index.js` - 统一入口文件

## 使用方法

### 在浏览器环境中使用

```javascript
const { setupMsw } = require('./mock/browser.js');

// 初始化 MSW
setupMsw();
```

### 在 Node.js 环境中使用（如测试）

```javascript
const { startMswServer } = require('./mock/server.js');

// 启动服务器
startMswServer();
```

## API 列表

当前 mock 的 API 接口包括：

- `GET /api/user` - 获取用户信息
- `POST /api/login` - 用户登录
- `GET /api/posts` - 获取文章列表
- `GET /api/posts/:id` - 获取文章详情
- `POST /api/posts` - 创建文章
- `GET /api/error` - 错误示例
- `GET /api/slow` - 延迟响应示例

## 注意事项

本配置使用的是 MSW 1.x 版本，与 2.x 版本的主要区别：

1. 使用 `rest` API 而不是 `http` API
2. 请求和响应处理语法略有不同
3. 不需要处理私有类字段等现代 JavaScript 语法

## 自定义配置

如需修改或添加 API mock，请编辑对应的环境配置文件（browser.js 或 server.js）。
