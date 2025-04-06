// src/stores/index.ts
// 2025-04-06---20:19---星期天

import { defineStore } from 'pinia';

import { ref } from 'vue';

import { routeList } from '@/router/list';

import { getSelectedMenuKeyPathByKey } from './menu';

/** 博客模块 */
export const useBlogStore = defineStore('blog', () => {
  const menuList = ref<BlogType.BlogMenuItem[]>([]);

  /** 获取并更新菜单列表 */
  function getMenuList() {
    /**
     * 递归生成菜单列表
     *
     * @param routes 路由列表
     * @returns 处理后的菜单项数组
     */
    function generateMenuList(routes: RouterType.BlogRouteRecordRaw[] = routeList): BlogType.BlogMenuItem[] {
      return routes
        .filter(route => route.meta && !route.meta.isHideInMenu) // 过滤掉隐藏路由
        .map(route => {
          const menuItem: BlogType.BlogMenuItem = route;

          // 递归处理子路由
          if (route.children?.length) {
            menuItem.children = generateMenuList(route.children);

            // 如果子菜单为空，则删除children属性
            if (menuItem.children.length === 0) {
              delete menuItem.children;
            }
          }
          return menuItem;
        });
    }

    menuList.value = generateMenuList();
  }

  // 初始化菜单
  getMenuList();

  /**
   * 获取选中的菜单键路径
   *
   * @param selectedKey 选中的菜单键
   * @returns 选中的菜单键路径数组
   */
  function getSelectedMenuKeyPath(selectedKey: string) {
    return getSelectedMenuKeyPathByKey(selectedKey, menuList.value);
  }
  return {
    /** 菜单列表 */
    menuList,
    /** 获取选中的菜单键路径 */
    getSelectedMenuKeyPath
  };
});
