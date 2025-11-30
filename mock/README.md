# MSW Mock 服务

这个项目使用 MSW (Mock Service Worker) 2.x 来模拟 API 接口，主要用于开发阶段的接口测试。

## 文件结构

```
mock/
├── handlers.js     # API 接口处理器
├── browser.js      # 浏览器环境配置
├── server.js       # Node.js 环境配置
├── index.js        # 入口文件
└── README.md       # 说明文档
```

## 已实现的接口

### 1. 登录接口

- **地址**: `POST /api/login`
- **参数**: `{ username, password }`
- **测试账号**:
  - admin / 123456 (管理员)
  - user / 123456 (普通用户)

### 2. 获取用户信息

- **地址**: `GET /api/user/info`
- **请求头**: `Authorization: Bearer <token>`

### 3. 退出登录

- **地址**: `POST /api/logout`

## 使用方法

### 在 VuePress 中使用

Mock 服务已经集成到 VuePress 配置中，在开发环境下会自动启动。

1. 启动开发服务器：

```bash
npm run docs:dev
```

2. 访问 `/api-demo.html` 页面查看接口文档和测试示例

### 在其他项目中使用

#### 浏览器环境

```javascript
import { startMockWorker } from './mock/browser';
startMockWorker();
```

#### Node.js 环境

```javascript
import { startMockServer } from './mock/server';
startMockServer();
```

## 自定义接口

在 `handlers.js` 中添加新的接口处理器：

```javascript
import { http, HttpResponse } from 'msw';

export const newHandler = http.get('/api/new-endpoint', ({ request }) => {
  return HttpResponse.json(
    {
      code: 200,
      message: '成功',
      data: 'your data',
    },
    { status: 200 }
  );
});

// 记得将新处理器添加到 handlers 数组中
export const handlers = [
  // ... 其他处理器
  newHandler,
];
```

## 注意事项

1. Mock 服务只在开发环境下启动
2. 所有接口都有模拟的网络延迟，更接近真实环境
3. 使用 MSW 的优势是不需要修改现有的 API 调用代码
4. 支持复杂的请求匹配和响应模拟
