<!--
 * @Author: longmo
 * @Date: 2025-11-28
 * @LastEditTime: 2025-11-28
 * @FilePath: src/components/MswTestSimple.vue
 * @Description: MSW Mock API 测试组件 (简化版)
-->
<template>
  <div class="msw-test">
    <h1>MSW Mock API 测试</h1>

    <!-- 用户信息测试 -->
    <div class="test-section">
      <h2>获取用户信息</h2>
      <button @click="fetchUser" :disabled="userLoading">
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
      <form @submit.prevent="login">
        <div>
          <label>用户名:</label>
          <input
            v-model="loginForm.username"
            type="text"
            placeholder="请输入用户名"
          />
        </div>
        <div>
          <label>密码:</label>
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
          />
        </div>
        <button type="submit" :disabled="loginLoading">
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
      <button @click="fetchPosts" :disabled="postsLoading">
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

<script lang="ts">
import { defineComponent } from 'vue';

interface UserData {
  id: number;
  name: string;
  email: string;
}

interface LoginData {
  success: boolean;
  token: string;
  user?: string;
}

interface PostData {
  id: number;
  title: string;
  content: string;
}

export default defineComponent({
  name: 'MswTestSimple',
  data() {
    return {
      userData: null as UserData | null,
      userLoading: false,
      userError: '',

      loginForm: {
        username: 'testuser',
        password: 'password123',
      },
      loginResult: null as LoginData | null,
      loginLoading: false,
      loginError: '',

      postsData: null as PostData[] | null,
      postsLoading: false,
      postsError: '',
    };
  },
  methods: {
    async fetchUser(): Promise<void> {
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
        this.userError =
          error instanceof Error ? error.message : '获取用户信息失败';
      } finally {
        this.userLoading = false;
      }
    },

    async login(): Promise<void> {
      this.loginLoading = true;
      this.loginError = '';
      this.loginResult = null;

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.loginForm),
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

    async fetchPosts(): Promise<void> {
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
        this.postsError =
          error instanceof Error ? error.message : '获取文章列表失败';
      } finally {
        this.postsLoading = false;
      }
    },
  },
});
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

button {
  background: #409eff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 15px;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #66b1ff;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

input:focus {
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
