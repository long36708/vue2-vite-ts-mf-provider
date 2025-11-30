<!--
 * @Author: longmo
 * @Date: 2025-11-28
 * @LastEditTime: 2025-11-28
 * @FilePath: src/components/MswTest.vue
 * @Description: MSW Mock API 测试组件
-->
<template>
  <div class="msw-test">
    <div class="test-card">
      <div class="card-header">
        <h2>MSW Mock API 测试</h2>
      </div>

      <!-- 用户信息测试 -->
      <div class="test-section">
        <h3>获取用户信息</h3>
        <button
          @click="fetchUser"
          class="btn btn-primary"
          :disabled="userLoading"
        >
          {{ userLoading ? '加载中...' : '获取用户信息' }}
        </button>
        <div v-if="userData" class="result-box">
          <span class="tag tag-success">请求成功</span>
          <pre>{{ JSON.stringify(userData, null, 2) }}</pre>
        </div>
        <div v-if="userError" class="error-box">
          <span class="tag tag-danger">请求失败</span>
          <p>{{ userError }}</p>
        </div>
      </div>

      <!-- 登录测试 -->
      <div class="test-section">
        <h3>用户登录</h3>
        <form class="login-form" @submit.prevent="login">
          <div class="form-group">
            <label for="username">用户名:</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              placeholder="请输入用户名"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="password">密码:</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              class="form-input"
            />
          </div>
          <button
            type="submit"
            class="btn btn-success"
            :disabled="loginLoading"
          >
            {{ loginLoading ? '登录中...' : '登录' }}
          </button>
        </form>
        <div v-if="loginResult" class="result-box">
          <span class="tag tag-success">登录成功</span>
          <pre>{{ JSON.stringify(loginResult, null, 2) }}</pre>
        </div>
        <div v-if="loginError" class="error-box">
          <span class="tag tag-danger">登录失败</span>
          <p>{{ loginError }}</p>
        </div>
      </div>

      <!-- 文章列表测试 -->
      <div class="test-section">
        <h3>获取文章列表</h3>
        <button
          @click="fetchPosts"
          class="btn btn-info"
          :disabled="postsLoading"
        >
          {{ postsLoading ? '加载中...' : '获取文章列表' }}
        </button>
        <div v-if="postsData" class="result-box">
          <span class="tag tag-success">请求成功</span>
          <div class="posts-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>标题</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="post in postsData" :key="post.id">
                  <td>{{ post.id }}</td>
                  <td>{{ post.title }}</td>
                  <td>{{ post.content }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="postsError" class="error-box">
          <span class="tag tag-danger">请求失败</span>
          <p>{{ postsError }}</p>
        </div>
      </div>

      <!-- 批量测试 -->
      <div class="test-section">
        <h3>批量测试</h3>
        <button
          @click="batchTest"
          class="btn btn-warning"
          :disabled="batchLoading"
        >
          {{ batchLoading ? '测试中...' : '批量测试所有接口' }}
        </button>
        <div v-if="batchResults.length > 0" class="result-box">
          <span class="tag tag-success">批量测试完成</span>
          <div
            v-for="(result, index) in batchResults"
            :key="index"
            class="batch-result"
          >
            <h4>{{ result.name }}</h4>
            <span
              :class="['tag', result.success ? 'tag-success' : 'tag-danger']"
            >
              {{ result.success ? '成功' : '失败' }}
            </span>
            <pre v-if="result.data">{{
              JSON.stringify(result.data, null, 2)
            }}</pre>
            <p v-if="result.error" class="error-text">{{ result.error }}</p>
          </div>
        </div>
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
  avatar?: string;
}

interface LoginData {
  success: boolean;
  token: string;
  user?: string;
  expiresIn?: number;
}

interface PostData {
  id: number;
  title: string;
  content: string;
}

interface BatchResult {
  name: string;
  success: boolean;
  data?: any;
  error?: string;
}

export default defineComponent({
  name: 'MswTest',
  data() {
    return {
      // 用户信息相关
      userData: null as UserData | null,
      userLoading: false,
      userError: '',

      // 登录相关
      loginForm: {
        username: 'testuser',
        password: 'password123',
      },
      loginResult: null as LoginData | null,
      loginLoading: false,
      loginError: '',

      // 文章列表相关
      postsData: null as PostData[] | null,
      postsLoading: false,
      postsError: '',

      // 批量测试相关
      batchResults: [] as BatchResult[],
      batchLoading: false,
    };
  },
  methods: {
    // 获取用户信息
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

    // 用户登录
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

    // 获取文章列表
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
        // 处理分页响应格式
        this.postsData = result.data || result;
      } catch (error) {
        this.postsError =
          error instanceof Error ? error.message : '获取文章列表失败';
      } finally {
        this.postsLoading = false;
      }
    },

    // 批量测试
    async batchTest(): Promise<void> {
      this.batchLoading = true;
      this.batchResults = [];

      const tests = [
        { name: '获取用户信息', method: this.fetchUser },
        { name: '获取文章列表', method: this.fetchPosts },
        { name: '用户登录', method: this.login },
      ];

      for (const test of tests) {
        try {
          await test.method();
          this.batchResults.push({
            name: test.name,
            success: true,
            data: this.getResultData(test.name),
          });
        } catch (error) {
          this.batchResults.push({
            name: test.name,
            success: false,
            error: error instanceof Error ? error.message : '未知错误',
          });
        }
      }

      this.batchLoading = false;
    },

    // 获取测试结果数据
    getResultData(testName: string): any {
      switch (testName) {
        case '获取用户信息':
          return this.userData;
        case '用户登录':
          return this.loginResult;
        case '获取文章列表':
          return this.postsData;
        default:
          return null;
      }
    },
  },
});
</script>

<style scoped>
.msw-test {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: #f5f7fa;
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.card-header h2 {
  margin: 0;
  color: #303133;
  font-size: 20px;
}

.test-section {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.test-section:last-child {
  border-bottom: none;
}

.test-section h3 {
  margin: 0 0 15px 0;
  color: #409eff;
  font-size: 16px;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #409eff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #66b1ff;
}

.btn-success {
  background: #67c23a;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #85ce61;
}

.btn-info {
  background: #909399;
  color: white;
}

.btn-info:hover:not(:disabled) {
  background: #a6a9ad;
}

.btn-warning {
  background: #e6a23c;
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background: #ebb563;
}

/* 表单样式 */
.login-form {
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #606266;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 结果展示样式 */
.result-box {
  margin-top: 15px;
  padding: 15px;
  background-color: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
}

.error-box {
  margin-top: 15px;
  padding: 15px;
  background-color: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 4px;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.tag-success {
  background: #f0f9ff;
  color: #67c23a;
  border: 1px solid #e1f3d8;
}

.tag-danger {
  background: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fde2e2;
}

.result-box pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  margin-top: 10px;
  white-space: pre-wrap;
}

/* 表格样式 */
.posts-table {
  margin-top: 15px;
  overflow-x: auto;
}

.posts-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.posts-table th,
.posts-table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #e4e7ed;
}

.posts-table th {
  background: #f5f7fa;
  font-weight: bold;
  color: #606266;
}

.posts-table tr:hover {
  background: #f5f7fa;
}

/* 批量测试结果样式 */
.batch-result {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fafafa;
}

.batch-result h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.error-text {
  color: #f56c6c;
  margin-top: 5px;
}
</style>
