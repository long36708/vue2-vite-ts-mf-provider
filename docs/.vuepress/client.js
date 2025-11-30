/**
 * VuePress 1.x 客户端配置
 * 在这里可以添加客户端特定的 MSW 设置
 */

// 如果需要在客户端也使用 MSW（例如在构建后的静态站点中）
// 可以在这里进行设置
export default ({ Vue, options, router, siteData }) => {
  // 客户端初始化代码
  if (process.env.NODE_ENV === 'development') {
    console.log('VuePress client initialized in development mode');
  }
};
