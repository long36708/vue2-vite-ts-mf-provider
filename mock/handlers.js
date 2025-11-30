import { rest } from 'msw';

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
export const loginHandler = rest.post('/api/login', (req, res, ctx) => {
  const { username, password } = req.body;

  // 模拟网络延迟
  ctx.delay(1000);

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (user) {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: '登录成功',
        data: {
          token: user.token,
          userInfo: user.userInfo,
        },
      })
    );
  } else {
    return res(
      ctx.status(401),
      ctx.json({
        code: 401,
        message: '用户名或密码错误',
        data: null,
      })
    );
  }
});

// 获取用户信息接口
export const getUserInfoHandler = rest.get(
  '/api/user/info',
  (req, res, ctx) => {
    const token = req.headers.get('Authorization');

    // 模拟网络延迟
    ctx.delay(500);

    if (!token) {
      return res(
        ctx.status(401),
        ctx.json({
          code: 401,
          message: '未授权',
          data: null,
        })
      );
    }

    const user = users.find(u => token.includes(u.token));

    if (user) {
      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: '获取用户信息成功',
          data: user.userInfo,
        })
      );
    } else {
      return res(
        ctx.status(401),
        ctx.json({
          code: 401,
          message: 'token无效',
          data: null,
        })
      );
    }
  }
);

// 退出登录接口
export const logoutHandler = rest.post('/api/logout', (req, res, ctx) => {
  ctx.delay(300);
  return res(
    ctx.status(200),
    ctx.json({
      code: 200,
      message: '退出登录成功',
      data: null,
    })
  );
});

// 导出所有处理器
export const handlers = [loginHandler, getUserInfoHandler, logoutHandler];
