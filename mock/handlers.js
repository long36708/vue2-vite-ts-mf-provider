import { http, HttpResponse } from 'msw';

// 模拟用户数据
const users = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    token: 'admin-token-123456',
    userInfo: {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
    },
  },
  {
    id: 2,
    username: 'user',
    password: '123456',
    token: 'user-token-123456',
    userInfo: {
      id: 2,
      username: 'user',
      email: 'user@example.com',
      role: 'user',
    },
  },
];

// 登录接口
export const loginHandler = http.post('/api/login', async ({ request }) => {
  const body = await request.json();
  const { username, password } = body;

  // 模拟网络延迟 - 在MSW 2.x中，delay不再作为响应函数使用
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (user) {
    return HttpResponse.json(
      {
        code: 200,
        message: '登录成功',
        data: {
          token: user.token,
          userInfo: user.userInfo,
        },
      },
      { status: 200 }
    );
  } else {
    return HttpResponse.json(
      {
        code: 401,
        message: '用户名或密码错误',
        data: null,
      },
      { status: 401 }
    );
  }
});

// 获取用户信息接口
export const getUserInfoHandler = http.get('/api/user/info', ({ request }) => {
  const token = request.headers.get('Authorization');

  if (!token) {
    return HttpResponse.json(
      {
        code: 401,
        message: '未授权',
        data: null,
      },
      { status: 401 }
    );
  }

  const user = users.find(u => token.includes(u.token));

  if (user) {
    return HttpResponse.json(
      {
        code: 200,
        message: '获取用户信息成功',
        data: user.userInfo,
      },
      { status: 200 }
    );
  } else {
    return HttpResponse.json(
      {
        code: 401,
        message: 'token无效',
        data: null,
      },
      { status: 401 }
    );
  }
});

// 退出登录接口
export const logoutHandler = http.post('/api/logout', () => {
  return HttpResponse.json(
    {
      code: 200,
      message: '退出登录成功',
      data: null,
    },
    { status: 200 }
  );
});

// 导出所有处理器
export const handlers = [loginHandler, getUserInfoHandler, logoutHandler];
