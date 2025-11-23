module.exports = {
  title: 'Vue2 Vite TS MF Provider',
  description:
    'Vue2 TypeScript Starter project for Vite with Module Federation',
  base: '/',
  dest: 'dist/docs',
  temp: '.temp',
  cache: '.cache',

  // 主题配置
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
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

  // 构建配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, '../src'),
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
            'weak-set'
          ];
          
          commonModules.forEach(module => {
            coreJsMappings[`core-js/library/fn/${module}`] = `core-js/es/${module}`;
          });
          
          return coreJsMappings;
        })(),
      },
    },
  },

  // 简化 PostCSS 配置，避免版本冲突
  postcss: {
    plugins: [require('autoprefixer')],
  },
};
