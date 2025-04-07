// src/stores/index.ts
// 2025-04-06---20:19---星期天

import { defineStore } from 'pinia';

import { ref } from 'vue';

import { routeList } from '@/router/list';

import { getMenuList, getSelectedMenuKeyPathByKey } from './utils';

/** 博客模块 */
export const useBlogStore = defineStore('blog', () => {
  const menuList = ref<BlogType.BlogMenuItem[]>([]);

  menuList.value = getMenuList(routeList);

  const menuFunc = ref({
    /**
     * 获取选中的菜单键路径
     *
     * @param selectedKey 选中的菜单键
     * @returns 选中的菜单键路径数组
     */
    getSelectedMenuKeyPath(selectedKey: string) {
      return getSelectedMenuKeyPathByKey(selectedKey, menuList.value);
    }
  });

  return {
    /** 菜单列表 */
    menuList,
    menuFunc
  };
});
