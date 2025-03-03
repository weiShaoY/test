import { initPreferences } from '@vben/preferences';
import { unmountGlobalLoading } from '@vben/utils';

import { overridesPreferences } from './preferences';

/**
 * 应用初始化完成后，再进行页面加载和渲染
 */
async function initApplication() {
  /**
   * 获取当前环境
   *  'prod' 代表生产环境，'dev' 代表开发环境
   */
  const env = import.meta.env.PROD ? 'prod' : 'dev';

  /**
   * 获取应用版本
   * 应用版本号
   */
  const appVersion = import.meta.env.VITE_APP_VERSION;

  /**
   * 生成命名空间
   * 用于存储偏好设置、区分不同项目数据
   * 格式为 `namespace-version-env`
   */
  const namespace = `${import.meta.env.VITE_APP_NAMESPACE}-${appVersion}-${env}`;

  /**
   * 初始化应用偏好设置
   */
  await initPreferences({
    namespace,
    overrides: overridesPreferences,
  });

  /**
   * 启动应用并挂载
   * 加载 Vue 应用的主要逻辑及视图
   */
  const { bootstrap } = await import('./bootstrap');

  await bootstrap(namespace);

  /**
   * 移除全局 loading
   * 释放资源，提升用户体验
   */
  unmountGlobalLoading();
}

// 执行应用初始化
initApplication();
