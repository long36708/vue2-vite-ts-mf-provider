/**
 * MSW 1.x setup for Vue 2 application
 * 在主应用中设置 MSW mock 服务
 */

const { setupServer } = require('msw/node');
const { rest } = require('msw');

// 创建 mock API 处理程序
const handlers = [
  // 获取用户信息
  rest.get('/api/user', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://via.placeholder.com/100',
      })
    );
  }),

  // 用户登录
  rest.post('/api/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: 'admin',
        expiresIn: 3600,
      })
    );
  }),

  // 获取文章列表
  rest.get('/api/posts', (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const limit = parseInt(req.url.searchParams.get('limit') || '10');

    // 模拟分页数据
    const allPosts = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: `文章标题 ${i + 1}`,
      content: `这是第 ${i + 1} 篇文章的内容。这是一段示例文本，用于展示 MSW mock API 的功能。`,
      author: `作者${(i % 5) + 1}`,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      tags: [`标签${(i % 3) + 1}`, `分类${(i % 2) + 1}`],
    }));

    const start = (page - 1) * limit;
    const posts = allPosts.slice(start, start + limit);

    return res(
      ctx.status(200),
      ctx.json({
        data: posts,
        pagination: {
          page,
          limit,
          total: allPosts.length,
          totalPages: Math.ceil(allPosts.length / limit),
        },
      })
    );
  }),

  // 获取文章详情
  rest.get('/api/posts/:id', (req, res, ctx) => {
    const postId = parseInt(req.params.id);

    if (isNaN(postId) || postId < 1) {
      return res(ctx.status(404), ctx.json({ error: '无效的文章 ID' }));
    }

    return res(
      ctx.status(200),
      ctx.json({
        id: postId,
        title: `文章标题 ${postId}`,
        content: `这是文章 ${postId} 的详细内容。包含更多的信息和详细描述。`,
        author: `作者${(postId % 5) + 1}`,
        createdAt: new Date(
          Date.now() - postId * 24 * 60 * 60 * 1000
        ).toISOString(),
        tags: [`标签${(postId % 3) + 1}`, `分类${(postId % 2) + 1}`],
        views: Math.floor(Math.random() * 1000) + 100,
        likes: Math.floor(Math.random() * 100) + 10,
      })
    );
  }),

  // 创建文章
  rest.post('/api/posts', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: {
          id: Math.floor(Math.random() * 1000) + 100,
          title: '新文章',
          content: '新文章内容',
          author: '当前用户',
          createdAt: new Date().toISOString(),
          tags: [],
        },
      })
    );
  }),

  // 错误示例
  rest.get('/api/error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        error: '服务器内部错误',
        code: 'INTERNAL_ERROR',
      })
    );
  }),

  // 延迟响应示例
  rest.get('/api/slow', (req, res, ctx) => {
    return res(
      // 模拟 2 秒延迟
      ctx.delay(2000),
      ctx.status(200),
      ctx.json({
        message: '这是一个延迟响应',
        delay: 2000,
      })
    );
  }),
];

// 创建 MSW 服务器
const server = setupServer(...handlers);

// 启动服务器
function startMswServer() {
  server.listen({
    onUnhandledRequest: 'warn',
  });
  console.log('🔶 MSW 1.x server started for Vue app');
}

// 关闭服务器
function stopMswServer() {
  server.close();
  console.log('🔶 MSW 1.x server stopped');
}

// 在开发环境中自动启动
if (process.env.NODE_ENV === 'development') {
  startMswServer();
}

module.exports = {
  server,
  startMswServer,
  stopMswServer,
  handlers,
};
