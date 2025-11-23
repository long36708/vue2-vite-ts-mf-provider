/**
 * @Author: longmo
 * @Date: 2025-11-23 23:38:32
 * @LastEditTime: 2025-11-23 23:39:23
 * @FilePath: docs/.vuepress/enhanceApp.js
 * @Description:
 */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 注册全局组件
export default ({ Vue, options, router, siteData }) => {
  // 将全局组件注册到 Vue 实例
  Vue.use(ElementUI);
};
