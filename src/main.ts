/** Vue main script */
import Vue from 'vue';

import teleport from '@logue/vue2-helpers/teleport';

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import '@/assets/main.css';

// 在开发环境中启动 MSW 1.x
if (import.meta.env.DEV) {
  import('@/mock/server.js').then(({ startMswServer }) => {
    startMswServer();
    console.log('MSW setup completed');
  });
}

Vue.config.productionTip = false;
Vue.component('Teleport', teleport);

const vue = new Vue({
  // @ts-expect-error
  router,
  store,
  render: h => h(App),
});

// Run!
vue.$mount('#app');
