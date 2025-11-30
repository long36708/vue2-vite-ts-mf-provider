# MSW 2.x 集成到 VuePress 1.x

本项目演示了如何在 VuePress 1.x 中集成 MSW 2.x 进行 API mock。

## 项目结构

```
docs/
├── .vuepress/
│   ├── config.js          # VuePress 配置（包含 MSW 启动）
│   ├── enhanceApp.js       # 应用增强
│   ├── client.js          # 客户端配置
│   └── msw-setup.js       # MSW 服务器配置
├── examples/
│   └── msw-demo.md        # MSW 演示页面
└── package.json           # 依赖配置
```

## 关键配置

### 1. package.json 依赖

```json
{
  "dependencies": {
    "msw": "^2.12.3",
    "vuepress": "^1.9.10"
  }
}
```

### 2. MSW 服务器配置 (.vuepress/msw-setup.js)

MSW 2.x 使用 ESM 模块，需要动态导入来兼容 VuePress 1.x 的 CommonJS：

```javascript
async function setupMsw() {
  const { setupServer } = await import('msw/node');
  const { http } = await import('msw');

  const handlers = [
    http.get('/api/user', ({ request }) => {
      return Response.json({ id: 1, name: 'John Doe' });
    }),
    // 更多 API...
  ];

  const server = setupServer(...handlers);
  server.listen();
}
```

### 3. VuePress 配置 (.vuepress/config.js)

在配置文件顶部启动 MSW 服务器：

```javascript
// 启动 MSW 服务器
require('./msw-setup');

module.exports = {
  // VuePress 配置...
};
```

## 使用说明

1. 安装依赖：

   ```bash
   cd docs
   npm install
   ```

2. 启动开发服务器：

   ```bash
   npm run dev
   ```

3. 访问 http://localhost:8080/examples/msw-demo/ 查看 MSW 演示

## 注意事项

1. **模块系统兼容性**: VuePress 1.x 使用 CommonJS，而 MSW 2.x 主要为 ESM 设计，需要使用 `require()` 语法

2. **服务器端 Mock**: MSW 在 Node.js 环境中运行，拦截所有 HTTP 请求

3. **开发环境**: 主要用于开发环境的 API mock，生产环境需要真实的后端服务

4. **热重载**: 修改 MSW 配置后需要重启开发服务器

## 扩展 Mock API

在 `msw-setup.js` 的 `handlers` 数组中添加新的 API mock：

```javascript
http.post('/api/new-endpoint', async ({ request }) => {
  const body = await request.json();
  return Response.json({
    success: true,
    id: 123,
    received: body,
  });
});
```

## 故障排除

1. **模块导入错误**: 确保使用 `require()` 而不是 `import`
2. **端口冲突**: 检查是否有其他服务占用相同端口
3. **CORS 问题**: MSW 会自动处理 CORS，无需额外配置
