# MSW 基础测试

这是一个简单的 MSW Mock API 测试页面，演示了基本的 API 调用功能。

## 测试按钮

<div id="msw-test-container">
  <button onclick="testMswApi()">测试 MSW API</button>
  <div id="result"></div>
</div>

<script>
async function testMswApi() {
  const resultDiv = document.getElementById('result');
  const button = event.target;
  
  button.disabled = true;
  button.textContent = '测试中...';
  
  try {
    // 测试获取用户信息
    const response = await fetch('/api/user');
    const data = await response.json();
    
    resultDiv.innerHTML = `
      <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border: 1px solid #b3d8ff; border-radius: 4px;">
        <h4>✅ 请求成功</h4>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${JSON.stringify(data, null, 2)}</pre>

      </div>
    `;

} catch (error) {
resultDiv.innerHTML = `       <div style="margin-top: 20px; padding: 15px; background: #fef0f0; border: 1px solid #fbc4c4; border-radius: 4px; color: #f56c6c;">
        <h4>❌ 请求失败</h4>
        <p>${error.message}</p>
      </div>
    `;
} finally {
button.disabled = false;
button.textContent = '测试 MSW API';
}
}
</script>

## 功能说明

### 测试的接口

1. **GET /api/user**
   - 获取用户基本信息
   - 返回用户 ID、姓名、邮箱等

### 使用说明

1. 点击"测试 MSW API"按钮
2. 等待请求完成
3. 查看返回的结果或错误信息

## MSW 配置

这些接口由 MSW 2.x Mock 服务提供，配置文件位于：

- **主应用**: `src/msw-setup.ts`
- **VuePress**: `docs/.vuepress/msw-setup.js`

### Mock 数据示例

```javascript
// 用户信息接口
http.get('/api/user', () => {
  return Response.json({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://via.placeholder.com/100',
  });
});
```

## 验证步骤

1. 启动 VuePress 开发服务器：

   ```bash
   cd docs
   npm run dev
   ```

2. 访问本页面并点击测试按钮

3. 检查浏览器开发者工具的网络面板，确认请求被 MSW 拦截

## 预期结果

- 请求应该被 MSW 拦截
- 返回预定义的 mock 数据
- 网络面板中显示请求状态为 200
- 不会发送真实的网络请求

## 故障排除

### 常见问题

1. **请求失败**
   - 检查 MSW 服务器是否正常启动
   - 确认配置文件路径正确

2. **Mock 数据不匹配**
   - 检查 MSW 配置中的接口路径
   - 确认 HTTP 方法匹配

3. **CORS 错误**
   - MSW 会自动处理 CORS，无需额外配置

## 扩展测试

你可以基于这个基础测试扩展更多功能：

- 添加 POST 请求测试
- 测试错误处理
- 添加请求参数验证
- 测试异步操作

## 相关链接

- [MSW 官方文档](https://mswjs.io/)
- [VuePress 文档](https://v1.vuepress.vuejs.org/)
- [Fetch API 文档](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
