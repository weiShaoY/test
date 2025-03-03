import { createApp, watchEffect } from 'vue';

import { registerAccessDirective } from '@vben/access';
import { initTippy, registerLoadingDirective } from '@vben/common-ui';
import { MotionPlugin } from '@vben/plugins/motion';
import { preferences } from '@vben/preferences';
import { initStores } from '@vben/stores';
import '@vben/styles';
import '@vben/styles/ele';

import { useTitle } from '@vueuse/core';
import { ElLoading } from 'element-plus';

import { $t, setupI18n } from '#/locales';

import { initComponentAdapter } from './adapter/component';
import App from './app.vue';
import { router } from './router';

/**
 * 启动 Vue 应用
 * @param {string} namespace - 应用命名空间，用于存储状态及配置信息
 */
async function bootstrap(namespace: string) {
  /**
   * 初始化组件适配器
   * 主要用于适配不同组件库的行为
   */
  await initComponentAdapter();

  /**
   * 创建 Vue 应用实例
   */
  const app = createApp(App);

  /**
   * 注册 Element Plus 提供的 `v-loading` 指令
   */
  app.directive('loading', ElLoading.directive);

  /**
   * 注册 Vben 提供的 `v-loading` 和 `v-spinning` 指令
   * 由于 `Element Plus` 也提供 `v-loading`，这里通过 `loading: false` 禁用 Vben 的 `v-loading`
   */
  registerLoadingDirective(app, {
    loading: false, // 不注册 Vben 提供的 v-loading 指令
    spinning: 'spinning',
  });

  /**
   * 配置国际化 (i18n)
   */
  await setupI18n(app);

  /**
   * 初始化 Pinia Store
   * 用于状态管理
   */
  await initStores(app, { namespace });

  /**
   * 安装权限指令
   * 用于控制元素的显示与权限
   */
  registerAccessDirective(app);

  /**
   * 初始化 Tippy.js
   * 提供工具提示功能
   */
  initTippy(app);

  /**
   * 配置路由及路由守卫
   */
  app.use(router);

  /**
   * 配置 Motion 插件
   * 提供动画支持
   */
  app.use(MotionPlugin);

  /**
   * 监听路由变化，动态更新页面标题
   */
  watchEffect(() => {
    if (preferences.app.dynamicTitle) {
      /**
       * 当前路由的标题
       * @type {string | undefined}
       */
      const routeTitle = router.currentRoute.value.meta?.title;

      /**
       * 生成完整的页面标题
       * 格式：`当前页面标题 - 应用名称`
       * @type {string}
       */
      const pageTitle =
        (routeTitle ? `${$t(routeTitle)} - ` : '') + preferences.app.name;

      useTitle(pageTitle);
    }
  });

  /**
   * 挂载 Vue 应用到 DOM
   */
  app.mount('#app');
}

export { bootstrap };
