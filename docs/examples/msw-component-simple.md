# MSW 组件测试

本页面演示了如何在 VuePress 1.x 中测试和使用 MSW Mock API 组件。

## 组件预览

下面是 MSW 测试组件的实际运行效果：

::: demo

```vue
<template>
  <div class="msw-demo">
    <h2>MSW Mock API 测试</h2>

    <div class="test-section">
      <h3>获取用户信息</h3>
      <button @click="fetchUser" :disabled="loading.user">
        {{ loading.user ? '加载中...' : '获取用户信息' }}
      </button>
      <div v-if="data.user" class="result">
        <strong>用户信息：</strong>
        <pre>{{ data.user }}</pre>
      </div>
      <div v-if="errors.user" class="error">错误：{{ errors.user }}</div>
    </div>

    <div class="test-section">
      <h3>用户登录</h3>
      <div class="form-group">
        <input v-model="loginForm.username" placeholder="用户名" />
        <input
          v-model="loginForm.password"
          type="password"
          placeholder="密码"
        />
      </div>
      <button @click="login" :disabled="loading.login">
        {{ loading.login ? '登录中...' : '登录' }}
      </button>
      <div v-if="data.login" class="result">
        <strong>登录结果：</strong>
        <pre>{{ data.login }}</pre>
      </div>
      <div v-if="errors.login" class="error">错误：{{ errors.login }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MswDemo',
  data() {
    return {
      loading: {
        user: false,
        login: false,
      },
      data: {
        user: null,
        login: null,
      },
      errors: {
        user: '',
        login: '',
      },
      loginForm: {
        username: 'testuser',
        password: 'password123',
      },
    };
  },
  methods: {
    async fetchUser() {
      this.loading.user = true;
      this.errors.user = '';
      this.data.user = null;

      try {
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        this.data.user = JSON.stringify(data, null, 2);
      } catch (error) {
        this.errors.user = error.message;
      } finally {
        this.loading.user = false;
      }
    },

    async login() {
      this.loading.login = true;
      this.errors.login = '';
      this.data.login = null;

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.loginForm),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        this.data.login = JSON.stringify(data, null, 2);
      } catch (error) {
        this.errors.login = error.message;
      } finally {
        this.loading.login = false;
      }
    },
  },
};
</script>

<style scoped>
.msw-demo {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.test-section h3 {
  margin-top: 0;
  color: #409eff;
}

button {
  background: #409eff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input {
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.result {
  margin-top: 15px;
  padding: 15px;
  background: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
}

.error {
  margin-top: 15px;
  padding: 15px;
  background: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 4px;
  color: #f56c6c;
}

pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  margin: 10px 0 0 0;
}
</style>
```

:::

## 功能说明

### 1. 获取用户信息

- **接口**: `GET /api/user`
- **功能**: 测试获取用户基本信息
- **返回数据**: 用户 ID、姓名、邮箱等

### 2. 用户登录

- **接口**: `POST /api/login`
- **功能**: 模拟用户登录流程
- **参数**: 用户名和密码
- **返回数据**: 登录状态和 token

## MSW 配置

这些接口由 MSW 2.x Mock 服务提供，配置文件位于：

- **主应用**: `src/msw-setup.ts`
- **VuePress**: `docs/.vuepress/msw-setup.js`

## 使用场景

1. **开发阶段**: 后端接口未完成时的前端开发
2. **测试阶段**: 单元测试和集成测试
3. **演示阶段**: 产品演示和技术分享

## 优势

- ✅ 无缝切换 Mock 和真实 API
- ✅ TypeScript 类型支持
- ✅ 类似真实 API 的调用方式
- ✅ 支持复杂业务场景
- ✅ 前后端并行开发

## 注意事项

- 确保在开发环境中启动了 MSW 服务器
- Mock 数据应尽可能接近真实数据结构
- 定期更新 Mock 数据保持同步

## 相关链接

- [MSW 官方文档](https://mswjs.io/)
- [Vue 2 文档](https://v2.vuejs.org/)
- [VuePress 文档](https://v1.vuepress.vuejs.org/)
