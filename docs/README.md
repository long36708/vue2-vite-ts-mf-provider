# Docs Package

这是 Vue2 Vite TS MF Provider 项目的独立文档包。

## 开发

在 docs 目录下运行：

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
# 或者
pnpm docs:dev

# 构建静态文件
pnpm build
# 或者
pnpm docs:build
```

## 从根目录运行

也可以从项目根目录运行：

```bash
# 启动文档开发服务器
npm run docs:dev

# 构建文档
npm run docs:build
```

## 访问地址

开发服务器默认运行在：http://localhost:8080/

:::demo

```vue
<template>
  <div>
    <button @click="doLogin">登录</button>
  </div>
</template>

<script>
export default {
  methods: {
    doLogin() {
      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          password: '123456',
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('登录结果:', data);
          // 这里可以添加登录成功后的逻辑
          if (data.code === 200) {
            // 保存 token 到本地存储
            localStorage.setItem('token', data.data.token);
            alert('登录成功！');
          } else {
            alert('登录失败：' + data.message);
          }
        })
        .catch(error => {
          console.error('登录失败:', error);
          alert('网络错误，请重试');
        });
    },
  },
};
</script>
```

:::
