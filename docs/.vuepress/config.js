// VuePress 文档配置，支持 MSW 1.x
const path = require('path');
module.exports = {
  title: 'Vue2 Vite TS MF Provider',
  description:
    'Vue2 TypeScript Starter project for Vite with Module Federation',
  base: '/longmo/',
  dest: '.vuepress/dist/longmo',
  // temp: '.temp',
  // cache: '.cache',
  lastUpdated: '最近更新',
  // 主题配置
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '测试', link: '/test-msw.html' },
      { text: '组件', link: '/examples/' },
      {
        text: 'GitHub',
        link: 'https://github.com/long36708/vue2-vite-ts-mf-provider.git',
      },
    ],
    // 配置侧边栏部分
    sidebar: {
      '/examples/': [
        {
          title: '使用指南',
          collapsable: true,
          path: '/examples/',
        },
        {
          title: 'Button 按钮',
          sidebarDepth: 1,
          path: '/examples/base-button/',
        },
      ],
    },
  },

  // 插件配置
  plugins: [
    '@vuepress/plugin-active-header-links',
    '@vuepress/plugin-nprogress',
    '@vuepress/plugin-search',
    'demo-container-v2.7',
  ],
  chainWebpack(config) {
    // 1. 支持 .mjs 扩展
    // config.resolve.mainFields.clear();
    // config.resolve.mainFields.merge(['main', 'browser']);
    // 2. 修改 js 规则，处理 .js 和 .mjs，并包含 msw 及其依赖
    // config.module
    //   .rule('js')
    //   .test(/\.(js|mjs)$/)
    //
    //   // 👇 关键：匹配 msw 和它的依赖（如 headers-polyfill）
    //   .include.add(filepath => {
    //     // 匹配路径中包含以下任一模块（兼容 pnpm 嵌套结构）
    //     const mswDeps = ['msw', 'headers-polyfill', 'cookie'];
    //     return mswDeps.some(
    //       dep =>
    //         (filepath.includes(
    //           `${path.sep}node_modules${path.sep}.pnpm${path.sep}`
    //         ) &&
    //           filepath.includes(`/${dep}@`)) ||
    //         filepath.includes(
    //           `${path.sep}node_modules${path.sep}${dep}${path.sep}`
    //         )
    //     );
    //   })
    //   .end()
    //
    //   .use('babel-loader')
    //   .loader('babel-loader')
    //   .tap(options => {
    //     return {
    //       ...options,
    //       plugins: [
    //         ...(options.plugins || []),
    //         [require.resolve('@babel/plugin-transform-class-static-block')],
    //         [require.resolve('@babel/plugin-transform-optional-chaining')],
    //       ],
    //     };
    //   });
  },
  // 构建配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, '../src'),
        // // 添加 headers-polyfill 别名映射
        // 'headers-polyfill': path.resolve(
        //   __dirname,
        //   'node_modules/headers-polyfill/lib/index.js'
        // ),

        // Fix for babel-runtime core-js path issues - comprehensive mapping
        ...(() => {
          const coreJsMappings = {};
          const commonModules = [
            'object/assign',
            'symbol',
            'symbol/iterator',
            'promise',
            'array/from',
            'array/includes',
            'array/find',
            'array/find-index',
            'string/includes',
            'string/starts-with',
            'string/ends-with',
            'map',
            'set',
            'weak-map',
            'weak-set',
          ];

          commonModules.forEach(module => {
            coreJsMappings[`core-js/library/fn/${module}`] =
              `core-js/es/${module}`;
          });

          return coreJsMappings;
        })(),
      },
    },
    module: {
      rules: [
        {
          test: /\.(mjs|js|cjs)$/,
          include: /node_modules/,
          type: 'javascript/auto',
          use: {
            loader: 'babel-loader',
            options: {
              // fix: [BABEL] Note: The code generator has deoptimised the styling of
              // node_modules\element-ui\lib\element-ui.common.js as it exceeds the max of 500KB.
              // https://github.com/vuejs/vuepress/issues/3003 所有处理的文件都不会被压缩，可能增加构建体积
              compact: false,
              presets: ['@babel/preset-env'],
              plugins: [
                [require.resolve('@babel/plugin-transform-class-static-block')],
                [require.resolve('@babel/plugin-transform-optional-chaining')],
              ],
            },
          },
        },
      ],
    },
    // module: {
    //   rules: [
    //     {
    //       test: /node_modules\/msw\/.+\.(m?js)$/,
    //       use: {
    //         loader: 'babel-loader',
    //         options: {
    //           presets: [
    //             [
    //               '@babel/preset-env',
    //               {
    //                 targets: {
    //                   browsers: ['> 1%', 'last 2 versions'],
    //                 },
    //                 useBuiltIns: 'usage',
    //                 corejs: 3,
    //               },
    //             ],
    //           ],
    //           plugins: [
    //             '@babel/plugin-proposal-class-properties',
    //             '@babel/plugin-proposal-private-methods',
    //             '@babel/plugin-proposal-private-property-in-object',
    //           ],
    //         },
    //       },
    //     },
    //   ],
    // },
  },

  // 简化 PostCSS 配置，避免版本冲突
  postcss: {
    plugins: [require('autoprefixer')],
  },
};
