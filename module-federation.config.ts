/**
 * @Author: longmo
 * @Date: 2025-11-22 22:34:07
 * @LastEditTime: 2025-11-22 23:25:47
 * @FilePath: module-federation.config.ts
 * @Description: 模块联邦配置
 */
console.log('process.env.ENV', process.env.ENV);
export const moduleFederationConfig = {
  name: 'vue2_vite_provider',
  manifest: true,
  filename: 'remoteEntry.js',
  dev: true,
  dts: true,
  exposes: {
    './Utils': './src/utils',
    './Components': './src/components/index',
    './BaseButton': './src/components/BaseButton.vue',
    './add': './src/utils/add.ts',
  },
  // shared: ['vue'],
  // shared: process.env.ENV === 'PRD'  ? [] : ['vue'],
  // shared: [
  //   {
  //     vue: {
  //       singleton: true,
  //       requiredVersion: '^3.0.0',
  //     },
  //   },
  // ],
};
