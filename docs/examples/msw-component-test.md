# MSW 组件测试

本页面演示了如何在 VuePress 1.x 中测试和使用 MSW Mock API 组件。

## 组件预览

下面是 `MswTestSimple` 组件的实际运行效果：

<demo-container>
<template>
  <div class="msw-test">
    <h1>MSW Mock API 测试</h1>
    
    <!-- 用户信息测试 -->
    <div class="test-section">
      <h2>获取用户信息</h2>
      <button 
        @click="fetchUser" 
        :disabled="userLoading"
        class="btn-primary"
      >
        {{ userLoading ? '加载中...' : '获取用户信息' }}
      </button>
      <div v-if="userData" class="result-box">
        <p class="success">✅ 请求成功</p>
        <pre>{{ JSON.stringify(userData, null, 2) }}</pre>
      </div>
      <div v-if="userError" class="error-box">
        <p class="error">❌ 请求失败: {{ userError }}</p>
      </div>
    </div>
    
    <!-- 登录测试 -->
    <div class="test-section">
      <h2>用户登录</h2>
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label>用户名:</label>
          <input 
            v-model="loginForm.username" 
            type="text" 
            placeholder="请输入用户名"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label>密码:</label>
          <input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
            class="form-input"
          />
        </div>
        <button 
          type="submit"
          :disabled="loginLoading"
          class="btn-success"
        >
          {{ loginLoading ? '登录中...' : '登录' }}
        </button>
      </form>
      <div v-if="loginResult" class="result-box">
        <p class="success">✅ 登录成功</p>
        <pre>{{ JSON.stringify(loginResult, null, 2) }}</pre>
      </div>
      <div v-if="loginError" class="error-box">
        <p class="error">❌ 登录失败: {{ loginError }}</p>
      </div>
    </div>
    
    <!-- 文章列表测试 -->
    <div class="test-section">
      <h2>获取文章列表</h2>
      <button 
        @click="fetchPosts" 
        :disabled="postsLoading"
        class="btn-info"
      >
        {{ postsLoading ? '加载中...' : '获取文章列表' }}
      </button>
      <div v-if="postsData" class="result-box">
        <p class="success">✅ 请求成功</p>
        <div class="posts-list">
          <div v-for="post in postsData" :key="post.id" class="post-item">
            <h4>{{ post.title }}</h4>
            <p>{{ post.content }}</p>
          </div>
        </div>
      </div>
      <div v-if="postsError" class="error-box">
        <p class="error">❌ 请求失败: {{ postsError }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MswTestDemo',
  data() {
    return {
      userData: null,
      userLoading: false,
      userError: '',
      
      loginForm: {
        username: 'testuser',
        password: 'password123'
      },
      loginResult: null,
      loginLoading: false,
      loginError: '',
      
      postsData: null,
      postsLoading: false,
      postsError: ''
    };
  },
  methods: {
    async fetchUser() {
      this.userLoading = true;
      this.userError = '';
      this.userData = null;
      
      try {
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.userData = data;
      } catch (error) {
        this.userError = error instanceof Error ? error.message : '获取用户信息失败';
      } finally {
        this.userLoading = false;
      }
    },
    
    async login() {
      this.loginLoading = true;
      this.loginError = '';
      this.loginResult = null;
      
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.loginForm)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.loginResult = data;
      } catch (error) {
        this.loginError = error instanceof Error ? error.message : '登录失败';
      } finally {
        this.loginLoading = false;
      }
    },
    
    async fetchPosts() {
      this.postsLoading = true;
      this.postsError = '';
      this.postsData = null;
      
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        this.postsData = result.data || result;
      } catch (error) {
        this.postsError = error instanceof Error ? error.message : '获取文章列表失败';
      } finally {
        this.postsLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.msw-test {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  color: #409eff;
  margin-bottom: 15px;
}

.test-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.btn-primary, .btn-success, .btn-info {
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 15px;
}

.btn-primary { background: #409eff; }
.btn-success { background: #67c23a; }
.btn-info { background: #909399; }

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  opacity: 0.8;
}

.login-form .form-group {
  margin-bottom: 15px;
}

.login-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #409eff;
}

.result-box {
  margin-top: 15px;
  padding: 15px;
  background: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
}

.error-box {
  margin-top: 15px;
  padding: 15px;
  background: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 4px;
}

.success {
  color: #67c23a;
  font-weight: bold;
  margin-bottom: 10px;
}

.error {
  color: #f56c6c;
  font-weight: bold;
}

pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  margin: 0;
}

.posts-list {
  margin-top: 15px;
}

.post-item {
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.post-item h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.post-item p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}
</style>
</demo-container>

## 功能说明

### 1. 获取用户信息

- **接口**: `GET /api/user`
- **功能**: 测试获取用户基本信息
- **返回数据**: 包含用户 ID、姓名、邮箱等信息

### 2. 用户登录

- **接口**: `POST /api/login`
- **功能**: 模拟用户登录流程
- **参数**: 用户名和密码
- **返回数据**: 登录状态、token 和用户信息

### 3. 获取文章列表

- **接口**: `GET /api/posts`
- **功能**: 获取文章列表数据
- **支持**: 分页功能
- **返回数据**: 文章数组和分页信息

## MSW 配置

本演示依赖于 MSW 2.x 的 Mock API 配置，配置文件位于：

- **主应用**: `src/msw-setup.ts`
- **VuePress**: `docs/.vuepress/msw-setup.js`

### Mock API 列表

1. **用户信息接口**

   ```javascript
   http.get('/api/user', () => {
     return Response.json({
       id: 1,
       name: 'John Doe',
       email: 'john@example.com',
     });
   });
   ```

2. **登录接口**

   ```javascript
   http.post('/api/login', async ({ request }) => {
     const body = await request.json();
     return Response.json({
       success: true,
       token: 'mock-jwt-token',
       user: body.username,
     });
   });
   ```

3. **文章列表接口**
   ```javascript
   http.get('/api/posts', () => {
     return Response.json({
       data: [{ id: 1, title: '文章标题 1', content: '...' }],
     });
   });
   ```

## 使用场景

### 开发阶段

- 前端开发时后端接口尚未完成
- 需要模拟各种数据场景
- 测试错误处理和边界情况

### 测试阶段

- 单元测试和集成测试
- 端到端测试
- 性能测试

### 演示阶段

- 产品演示
- 技术分享
- 文档展示

## 优势

1. **无缝切换**: Mock 数据和真实 API 可以轻松切换
2. **类型安全**: TypeScript 提供完整的类型支持
3. **开发体验**: 类似真实 API 的调用方式
4. **灵活性**: 支持各种复杂的业务场景
5. **团队协作**: 前后端可以并行开发

## 注意事项

1. 确保在开发环境中启动了 MSW 服务器
2. Mock 数据应该尽可能接近真实数据结构
3. 定期更新 Mock 数据以保持与后端接口同步
4. 在生产环境中应该使用真实的后端接口

## 扩展功能

你可以基于这个组件扩展更多功能：

- 添加更多的 API 测试用例
- 实现数据缓存机制
- 添加请求重试功能
- 集成状态管理（Vuex）
- 添加单元测试

## 相关链接

- [MSW 官方文档](https://mswjs.io/)
- [Vue 2 文档](https://v2.vuejs.org/)
- [VuePress 文档](https://v1.vuepress.vuejs.org/)
