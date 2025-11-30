# MSW 2.x 集成演示

这是一个在 VuePress 1.x 中使用 MSW 2.x 的演示页面。

## API Mock 示例

以下是通过 MSW mock 的 API 示例：

### 获取用户信息

<demo-container>
<template>
  <div>
    <el-button @click="fetchUser" type="primary">获取用户信息</el-button>
    <div v-if="user" style="margin-top: 20px;">
      <el-card>
        <h3>用户信息：</h3>
        <p><strong>ID:</strong> {{ user.id }}</p>
        <p><strong>姓名:</strong> {{ user.name }}</p>
        <p><strong>邮箱:</strong> {{ user.email }}</p>
      </el-card>
    </div>
    <div v-if="error" style="margin-top: 20px;">
      <el-alert type="error" :title="error" show-icon></el-alert>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      error: null
    }
  },
  methods: {
    async fetchUser() {
      try {
        this.error = null;
        const response = await fetch('/api/user');
        const data = await response.json();
        this.user = data;
      } catch (err) {
        this.error = '获取用户信息失败: ' + err.message;
      }
    }
  }
}
</script>
</demo-container>

### 用户登录

<demo-container>
<template>
  <div>
    <el-form :model="loginForm" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="login" type="primary">登录</el-button>
      </el-form-item>
    </el-form>
    <div v-if="loginResult" style="margin-top: 20px;">
      <el-alert type="success" title="登录成功" show-icon>
        <p>Token: {{ loginResult.token }}</p>
      </el-alert>
    </div>
    <div v-if="loginError" style="margin-top: 20px;">
      <el-alert type="error" :title="loginError" show-icon></el-alert>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginResult: null,
      loginError: null
    }
  },
  methods: {
    async login() {
      try {
        this.loginError = null;
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.loginForm)
        });
        const data = await response.json();
        this.loginResult = data;
      } catch (err) {
        this.loginError = '登录失败: ' + err.message;
      }
    }
  }
}
</script>
</demo-container>

## 说明

1. **MSW 服务器端集成**: 在 `.vuepress/msw-setup.js` 中配置了 mock API
2. **VuePress 配置**: 在 `.vuepress/config.js` 中启动了 MSW 服务器
3. **CommonJS 兼容**: 使用 `require()` 语法来兼容 VuePress 1.x 的 CommonJS 模块系统

## 添加新的 Mock API

要添加新的 mock API，请在 `.vuepress/msw-setup.js` 文件中的 `handlers` 数组中添加新的处理程序：

```javascript
rest.get('/api/new-endpoint', (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({ message: 'This is a new mock endpoint' })
  );
});
```

然后重启 VuePress 开发服务器即可。
