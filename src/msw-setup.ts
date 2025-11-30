/**
 * MSW 2.x setup for Vue 2 application
 * 在主应用中设置 MSW mock 服务
 */

import { setupServer } from 'msw/node';
import { http } from 'msw';

// 创建 mock API 处理程序
export const handlers = [
  // 获取用户信息
  http.get('/api/user', ({ request }) => {
    return Response.json({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://via.placeholder.com/100',
    });
  }),

  // 用户登录
  http.post('/api/login', async ({ request }) => {
    const body = (await request.json()) as {
      username: string;
      password: string;
    };

    // 模拟登录验证
    if (body.username && body.password) {
      return Response.json({
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: body.username,
        expiresIn: 3600,
      });
    } else {
      return Response.json(
        { success: false, error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }
  }),

  // 获取文章列表
  http.get('/api/posts', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

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

    return Response.json({
      data: posts,
      pagination: {
        page,
        limit,
        total: allPosts.length,
        totalPages: Math.ceil(allPosts.length / limit),
      },
    });
  }),

  // 获取文章详情
  http.get('/api/posts/:id', ({ params }) => {
    const postId = parseInt(params.id as string);

    if (isNaN(postId) || postId < 1) {
      return Response.json({ error: '无效的文章 ID' }, { status: 404 });
    }

    return Response.json({
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
    });
  }),

  // 创建文章
  http.post('/api/posts', async ({ request }) => {
    const body = (await request.json()) as { title: string; content: string };

    if (!body.title || !body.content) {
      return Response.json(
        { success: false, error: '标题和内容不能为空' },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      data: {
        id: Math.floor(Math.random() * 1000) + 100,
        title: body.title,
        content: body.content,
        author: '当前用户',
        createdAt: new Date().toISOString(),
        tags: [],
      },
    });
  }),

  // 错误示例
  http.get('/api/error', () => {
    return Response.json(
      { error: '服务器内部错误', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }),

  // 延迟响应示例
  http.get('/api/slow', async () => {
    // 模拟 2 秒延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    return Response.json({
      message: '这是一个延迟响应',
      delay: 2000,
    });
  }),
];

// 创建 MSW 服务器
export const server = setupServer(...handlers);

// 启动服务器
export function startMswServer() {
  server.listen({
    onUnhandledRequest: 'warn',
  });
  console.log('🔶 MSW 2.x server started for Vue app');
}

// 关闭服务器
export function stopMswServer() {
  server.close();
  console.log('🔶 MSW 2.x server stopped');
}

// 在开发环境中自动启动
if (import.meta.env.DEV) {
  startMswServer();
}
