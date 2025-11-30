// MSW 1.x 浏览器端配置
// 这个文件将在浏览器环境中运行

const { setupWorker } = require('msw');
const { rest } = require('msw');

// 定义 API 处理程序
const handlers = [
  // GET /api/user - 获取用户信息
  rest.get('/api/user', (req, res, ctx) => {
    console.log('MSW: Intercepted GET /api/user');
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://via.placeholder.com/100x100',
      })
    );
  }),

  // POST /api/login - 登录接口
  rest.post('/api/login', (req, res, ctx) => {
    console.log('MSW: Intercepted POST /api/login');

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 1,
          name: 'Admin User',
          username: 'admin',
          email: 'admin@example.com',
        },
      })
    );
  }),

  // GET /api/posts - 获取文章列表
  rest.get('/api/posts', (req, res, ctx) => {
    console.log('MSW: Intercepted GET /api/posts');
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const limit = parseInt(req.url.searchParams.get('limit') || '10');

    const posts = Array.from({ length: limit }, (_, i) => ({
      id: (page - 1) * limit + i + 1,
      title: `文章标题 ${(page - 1) * limit + i + 1}`,
      content: `这是第 ${(page - 1) * limit + i + 1} 篇文章的内容...`,
      author: `作者${(page - 1) * limit + i + 1}`,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    }));

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: posts,
        pagination: {
          page,
          limit,
          total: 100,
          totalPages: Math.ceil(100 / limit),
        },
      })
    );
  }),

  // GET /api/error - 错误接口
  rest.get('/api/error', (req, res, ctx) => {
    console.log('MSW: Intercepted GET /api/error');
    return res(
      ctx.status(500),
      ctx.json({
        success: false,
        message: '服务器内部错误',
        code: 'INTERNAL_SERVER_ERROR',
      })
    );
  }),

  // 通用 fallback 处理
  rest.all('*', (req, res, ctx) => {
    console.log('MSW: Unmatched request:', req.method, req.url);
    return res(
      ctx.status(404),
      ctx.json({
        success: false,
        message: 'API 接口不存在',
        path: new URL(req.url).pathname,
      })
    );
  }),
];

// 设置 worker
const worker = setupWorker(...handlers);

// 启动 worker
function setupMsw() {
  worker
    .start({
      onUnhandledRequest: 'warn',
    })
    .then(() => {
      console.log('🔶 MSW: Mock worker started successfully');
    })
    .catch(error => {
      console.error('🔴 MSW: Failed to start mock worker:', error);
    });

  console.log('MSW: Browser worker started successfully');
  window.mswWorker = worker; // 方便调试
}

// 导出
module.exports = { setupMsw };
