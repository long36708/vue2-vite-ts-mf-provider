// const { setupMsw } = require('./msw-browser');

// const { setupMsw } = require('../mock/index');
/**
 * @Author: longmo
 * @Date: 2025-11-23 23:38:32
 * @LastEditTime: 2025-11-30 20:41:51
 * @FilePath: docs/.vuepress/enhanceApp.js
 * @Description:
 */
const ElementUI = require('element-ui');
require('element-ui/lib/theme-chalk/index.css');

// 注册全局组件
export default ({ Vue, isServer }) => {
  // 将全局组件注册到 Vue 实例
  Vue.use(ElementUI);
  if (!isServer) {
    // require('./msw-browser').setupMsw();
    import('../../mock/browser')
      .then(({ startMockWorker }) => {
        startMockWorker();
      })
      .catch(error => {
        console.error('Failed to load MSW:', error);
      });
  }
  // 在客户端添加 MSW 支持
  // if (typeof window !== 'undefined') {
  //   try {
  //     // 延迟执行，确保页面加载完成
  //     if (document.readyState === 'loading') {
  //       document.addEventListener('DOMContentLoaded', setupMsw);
  //     } else {
  //       setupMsw();
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }
};
