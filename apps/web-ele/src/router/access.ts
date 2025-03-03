import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@vben/types';

import { generateAccessible } from '@vben/access';
import { preferences } from '@vben/preferences';

import { ElMessage } from 'element-plus';

import { getAllMenusApi } from '#/api';
import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';

/**
 * 获取无权限时的回退组件
 * @returns {Promise<typeof import('*.vue')>} 无权限组件
 */
const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue');

/**
 * 生成访问权限配置
 * @param  options - 菜单和路由的生成配置选项
 * @returns 访问权限配置
 */
async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  /**
   * 页面组件映射
   * 用于动态导入 `../views/` 目录下的所有 `.vue` 文件
   */
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');

  /**
   * 布局组件映射
   */
  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };

  /**
   * 异步获取菜单列表
   * 通过 `ElMessage` 提示用户正在加载菜单
   */
  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      ElMessage({
        duration: 1500,
        message: `${$t('common.loadingMenu')}...`,
      });
      return await getAllMenusApi();
    },
    /**
     * 无权限跳转的页面
     */
    forbiddenComponent,
    /**
     * 页面组件和布局组件映射
     */
    layoutMap,
    pageMap,
  });
}

export { generateAccess };
