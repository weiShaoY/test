// src/stores/index.ts
// 2025-04-06---20:19---星期天

import { router } from '@/router'

import { routeList } from '@/router/list'

import { defineStore } from 'pinia'

import { computed, ref } from 'vue'

import {
  getBreadcrumbsByRoute,
  getMenuList,
  getSelectedMenuKeyPathByKey,
  transformMenuToSearchMenuList,
} from './utils'

/** 博客模块 */
export const useBlogStore = defineStore('blog', () => {
  const menuList = ref<BlogType.BlogMenuItem[]>([])

  menuList.value = getMenuList(routeList)

  const menuFunc = ref({
    /**
     * 获取选中的菜单键路径
     *
     * @param selectedKey 选中的菜单键
     * @returns 选中的菜单键路径数组
     */
    getSelectedMenuKeyPath(selectedKey: string) {
      return getSelectedMenuKeyPathByKey(selectedKey, menuList.value)
    },
  })

  const searchMenuList = computed(() => transformMenuToSearchMenuList(menuList.value))

  const breadcrumbList = computed(() =>
    getBreadcrumbsByRoute(router.currentRoute.value as any, menuList.value),
  )

  console.log('%c Line:113 🍊 breadcrumbList', 'color:#33a5ff', breadcrumbList.value)
  return {
    /** 菜单列表 */
    menuList,
    menuFunc,
    searchMenuList,
    breadcrumbList,
  }
})
