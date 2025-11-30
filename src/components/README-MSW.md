# MSW Mock API 测试组件

## 概述

`MswTestSimple.vue` 是一个用于测试 MSW 2.x Mock API 功能的 Vue 2 组件。

## 功能特性

### 1. 用户信息获取

- 测试 GET `/api/user` 接口
- 显示用户基本信息（ID、姓名、邮箱）

### 2. 用户登录

- 测试 POST `/api/login` 接口
- 支持自定义用户名和密码
- 返回登录状态和 token

### 3. 文章列表获取

- 测试 GET `/api/posts` 接口
- 支持分页数据
- 展示文章标题和内容

## 使用方法

1. 启动开发服务器：

   ```bash
   npm run vite:dev
   ```

2. 访问测试页面：

   ```
   http://localhost:4174/msw-test
   ```

3. 点击各个测试按钮进行 API 测试

## Mock API 接口

### GET /api/user

返回用户信息：

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://via.placeholder.com/100"
}
```

### POST /api/login

接收用户名和密码，返回登录结果：

```json
{
  "success": true,
  "token": "mock-jwt-token-1234567890",
  "user": "testuser",
  "expiresIn": 3600
}
```

### GET /api/posts

返回文章列表：

```json
{
  "data": [
    {
      "id": 1,
      "title": "文章标题 1",
      "content": "这是第 1 篇文章的内容..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

## 组件结构

```
MswTestSimple.vue
├── Template
│   ├── 用户信息测试区域
│   ├── 登录测试区域
│   └── 文章列表测试区域
├── Script
│   ├── Data Properties
│   └── Methods
└── Style
    └── Scoped CSS
```

## 技术栈

- Vue 2.7
- TypeScript
- MSW 2.x
- Fetch API

## 注意事项

1. 仅在开发环境中可用
2. 依赖 MSW 服务器正常启动
3. 使用原生 Fetch API 进行网络请求
4. 包含完整的错误处理机制
