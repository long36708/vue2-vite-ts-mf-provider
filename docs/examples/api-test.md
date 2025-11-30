# VuePress API 请求测试

这个页面演示了如何在 VuePress 文档页面中直接请求 API 接口，并由 MSW 进行 mock 拦截。

## API 测试界面

:::demo

```vue
<template>
  <div class="api-test-container">
    <h2>API 接口测试</h2>

    <!-- 获取用户信息测试 -->
    <div class="api-test-section">
      <h3>GET /api/user</h3>
      <button @click="getUserInfo" :disabled="loading.user">
        {{ loading.user ? '请求中...' : '获取用户信息' }}
      </button>
      <div
        v-if="result.user"
        class="result"
        :class="{ success: result.user.success, error: !result.user.success }"
      >
        <h4>{{ result.user.success ? '✅ 请求成功' : '❌ 请求失败' }}</h4>
        <pre>{{ JSON.stringify(result.user.data, null, 2) }}</pre>
      </div>
    </div>

    <!-- 用户登录测试 -->
    <div class="api-test-section">
      <h3>POST /api/login</h3>
      <div class="form-group">
        <input
          v-model="loginForm.username"
          type="text"
          placeholder="用户名 (admin)"
          class="input-field"
        />
        <input
          v-model="loginForm.password"
          type="password"
          placeholder="密码 (password)"
          class="input-field"
        />
      </div>
      <button @click="userLogin" :disabled="loading.login">
        {{ loading.login ? '登录中...' : '用户登录' }}
      </button>
      <div
        v-if="result.login"
        class="result"
        :class="{ success: result.login.success, error: !result.login.success }"
      >
        <h4>{{ result.login.success ? '✅ 登录成功' : '❌ 登录失败' }}</h4>
        <pre>{{ JSON.stringify(result.login.data, null, 2) }}</pre>
      </div>
    </div>

    <!-- 获取文章列表测试 -->
    <div class="api-test-section">
      <h3>GET /api/posts</h3>
      <div class="form-group">
        <input
          v-model.number="postsParams.page"
          type="number"
          placeholder="页码"
          min="1"
          class="input-field small"
        />
        <input
          v-model.number="postsParams.limit"
          type="number"
          placeholder="每页数量"
          min="1"
          max="20"
          class="input-field small"
        />
      </div>
      <button @click="getPosts" :disabled="loading.posts">
        {{ loading.posts ? '请求中...' : '获取文章列表' }}
      </button>
      <div
        v-if="result.posts"
        class="result"
        :class="{ success: result.posts.success, error: !result.posts.success }"
      >
        <h4>{{ result.posts.success ? '✅ 请求成功' : '❌ 请求失败' }}</h4>
        <pre>{{ JSON.stringify(result.posts.data, null, 2) }}</pre>
      </div>
    </div>

    <!-- 错误接口测试 -->
    <div class="api-test-section">
      <h3>GET /api/error</h3>
      <button @click="testError" :disabled="loading.error">
        {{ loading.error ? '请求中...' : '测试错误接口' }}
      </button>
      <div v-if="result.error" class="result error">
        <h4>❌ 错误响应</h4>
        <pre>{{ JSON.stringify(result.error.data, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: {
        user: false,
        login: false,
        posts: false,
        error: false,
      },
      result: {
        user: null,
        login: null,
        posts: null,
        error: null,
      },
      loginForm: {
        username: 'admin',
        password: 'password',
      },
      postsParams: {
        page: 1,
        limit: 5,
      },
    };
  },
  methods: {
    async getUserInfo() {
      this.loading.user = true;
      this.result.user = null;

      try {
        const response = await fetch('/api/user');
        const data = await response.json();

        this.result.user = {
          success: response.ok,
          data,
        };
      } catch (error) {
        this.result.user = {
          success: false,
          data: { message: error.message },
        };
      } finally {
        this.loading.user = false;
      }
    },

    async userLogin() {
      this.loading.login = true;
      this.result.login = null;

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.loginForm),
        });

        const data = await response.json();

        this.result.login = {
          success: response.ok,
          data,
        };
      } catch (error) {
        this.result.login = {
          success: false,
          data: { message: error.message },
        };
      } finally {
        this.loading.login = false;
      }
    },

    async getPosts() {
      this.loading.posts = true;
      this.result.posts = null;

      try {
        const params = new URLSearchParams({
          page: this.postsParams.page.toString(),
          limit: this.postsParams.limit.toString(),
        });

        const response = await fetch(`/api/posts?${params}`);
        const data = await response.json();

        this.result.posts = {
          success: response.ok,
          data,
        };
      } catch (error) {
        this.result.posts = {
          success: false,
          data: { message: error.message },
        };
      } finally {
        this.loading.posts = false;
      }
    },

    async testError() {
      this.loading.error = true;
      this.result.error = null;

      try {
        const response = await fetch('/api/error');
        const data = await response.json();

        this.result.error = {
          success: false,
          data,
        };
      } catch (error) {
        this.result.error = {
          success: false,
          data: { message: error.message },
        };
      } finally {
        this.loading.error = false;
      }
    },
  },
};
</script>

<style>
.api-test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.api-test-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.api-test-section h3 {
  margin-top: 0;
  color: #333;
}

.form-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.input-field {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.input-field.small {
  width: 100px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.result {
  margin-top: 15px;
  padding: 15px;
  border-radius: 4px;
}

.result.success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.result.error {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.result h4 {
  margin-top: 0;
  margin-bottom: 10px;
}

.result pre {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
</style>
```

:::

## MSW Mock 配置

当前页面使用的 API 接口由 MSW 2.x 进行 mock，配置文件位于：

**VuePress 客户端配置**: `docs/public/msw-client.js` 和 `docs/.vuepress/enhanceApp.js`

### 可用的 Mock API

1. **GET /api/user** - 获取用户信息

   ```javascript
   http.get('/api/user', ({ request }) => {
     return Response.json({
       id: 1,
       name: 'John Doe',
       email: 'john@example.com',
       avatar: 'https://via.placeholder.com/100x100',
     });
   });
   ```

2. **POST /api/login** - 用户登录

   ```javascript
   http.post('/api/login', async ({ request }) => {
     const body = await request.json();

     // 模拟登录验证
     if (body.username === 'admin' && body.password === 'password') {
       return Response.json({
         success: true,
         token: 'mock-jwt-token-' + Date.now(),
         user: {
           id: 1,
           name: 'Admin User',
           username: 'admin',
           email: 'admin@example.com',
         },
       });
     } else {
       return Response.json(
         {
           success: false,
           message: '用户名或密码错误',
         },
         { status: 401 }
       );
     }
   });
   ```

3. **GET /api/posts** - 获取文章列表（支持分页）

   ```javascript
   http.get('/api/posts', ({ request }) => {
     const url = new URL(request.url);
     const page = parseInt(url.searchParams.get('page') || '1');
     const limit = parseInt(url.searchParams.get('limit') || '10');

     const posts = Array.from({ length: limit }, (_, i) => ({
       id: (page - 1) * limit + i + 1,
       title: `文章标题 ${(page - 1) * limit + i + 1}`,
       content: `这是第 ${(page - 1) * limit + i + 1} 篇文章的内容...`,
       author: `作者${(page - 1) * limit + i + 1}`,
       createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
     }));

     return Response.json({
       success: true,
       data: posts,
       pagination: {
         page,
         limit,
         total: 100,
         totalPages: Math.ceil(100 / limit),
       },
     });
   });
   ```

4. **GET /api/error** - 错误接口测试
   ```javascript
   http.get('/api/error', ({ request }) => {
     return Response.json(
       {
         success: false,
         message: '服务器内部错误',
         code: 'INTERNAL_SERVER_ERROR',
       },
       { status: 500 }
     );
   });
   ```

## 验证步骤

### 1. 检查 MSW 状态

打开浏览器开发者工具，在 Console 中查看：

- 应该看到 "MSW: Browser worker started successfully" 消息
- Network 面板中应该看到请求被 [MSW] 标记
- 可以通过 `window.mswWorker` 访问 MSW worker 实例

### 2. 测试 API 请求

1. **获取用户信息**: 点击 "获取用户信息" 按钮，应该返回用户数据
2. **用户登录**:
   - 使用正确的凭据: `admin` / `password`，应该返回成功响应
   - 使用错误的凭据，应该返回 401 错误
3. **获取文章列表**: 设置页码和每页数量，应该返回分页数据
4. **错误接口**: 点击 "测试错误接口"，应该返回 500 错误

### 3. 验证 Mock 数据

返回的数据应该与 `docs/.vuepress/enhanceApp.js` 中定义的数据结构一致。

### 4. 网络请求验证

在浏览器开发者工具的 Network 面板中：

- 所有 API 请求都应该被 MSW 拦截
- 请求状态应该显示为 [MSW]
- 响应时间应该很短（因为是本地 mock）

## 故障排除

### 常见问题

1. **请求没有被拦截**
   - 检查浏览器控制台是否有 "MSW: Browser worker started successfully" 消息
   - 确认没有 JavaScript 错误
   - 刷新页面重试

2. **返回真实网络请求（404/500 错误）**
   - 重启 VuePress 开发服务器
   - 检查 `docs/.vuepress/enhanceApp.js` 文件是否正确配置
   - 确认 MSW 包已正确安装

3. **CORS 错误**
   - MSW 会自动处理 CORS，无需额外配置
   - 如果仍有 CORS 问题，检查是否有其他中间件干扰

4. **登录接口返回错误**
   - 确认使用正确的凭据：`admin` / `password`
   - 检查请求 Content-Type 是否为 `application/json`

### 调试技巧

1. 使用浏览器开发者工具的 Network 面板查看请求详情
2. 在 Console 中查看 MSW 的日志输出（以 "MSW:" 开头）
3. 检查请求 URL 是否与 mock 配置匹配
4. 使用 `console.log(window.mswWorker)` 查看 MSW worker 状态
5. 在 `enhanceApp.js` 中添加更多调试信息

### 重启方法

如果 MSW 工作不正常，可以尝试：

1. 刷新浏览器页面
2. 重启 VuePress 开发服务器
3. 清除浏览器缓存

## 扩展功能

你可以基于这个页面扩展更多功能：

- 添加更多 API 测试用例
- 实现请求参数验证
- 添加错误场景测试
- 集成性能监控
- 添加请求重试机制

## 相关链接

- [MSW 官方文档](https://mswjs.io/)
- [VuePress 文档](https://v1.vuepress.vuejs.org/)
- [Fetch API 文档](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
