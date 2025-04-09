import type { App } from 'vue';
import { createPinia } from 'pinia';
import { resetSetupStore } from './plugins';

export * from './modules/blog';

/**
 * 设置 Vue store 插件 Pinia
 *
 * @param app - Vue 应用实例
 */
export function setupStore(app: App) {
  // 创建 Pinia 实例
  const store = createPinia();

  // 使用自定义插件 resetSetupStore
  store.use(resetSetupStore);

  // 将 Pinia 实例安装到 Vue 应用
  app.use(store);
}
