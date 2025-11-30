import { setupWorker } from 'msw';
import { handlers } from './handlers';

// 设置 Service Worker
export const worker = setupWorker(...handlers);

// 启动 mock 服务
export const startMockWorker = () => {
  worker
    .start({
      // onUnhandledRequest: 'warn',
      // 生产环境下的额外配置
      quiet: false, // 保持日志输出以便调试
      onUnhandledRequest(request, print) {
        // Ignore any requests containing "cdn.com" in their URL.
        if (
          request.url.href.includes('/favicon.ico') ||
          request.url.href.includes('/assets') ||
          request.url.href.includes('.hot-update.json')
        ) {
          return;
        }

        console.debug(worker);

        // Otherwise, print an unhandled request warning.
        print.warning();
      },
    })
    .then(() => {
      console.log('🔶 MSW: Mock worker started successfully');
    })
    .catch(error => {
      console.error('🔴 MSW: Failed to start mock worker:', error);
    });
};
