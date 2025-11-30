## 测试 msw 实现 mock

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
