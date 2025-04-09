import { SetupStoreId } from '@/enum'

import { router } from '@/router'

import { routeList } from '@/router/list'

import { findBlogRouteByPath } from '@/router/utils'

import { defineStore } from 'pinia'

import {
  nextTick,
  ref,
} from 'vue'

import { useTabStore } from '../tab'

import { getCacheRouteNames } from './shared'

export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const tabStore = useTabStore()

  /** 首页路由地址 */
  const routeHome = ref(import.meta.env.VITE_ROUTER_BLOG_HOME_PATH)

  /** 缓存路由数组 */
  const cacheRoutes = ref<string[]>([])

  /** 排除缓存路由数组，用于重置路由缓存 */
  const excludeCacheRoutes = ref<string[]>([])

  /**
   * 获取缓存路由
   *
   * @param routes Vue 路由数组
   */
  function getCacheRoutes(routes: RouterType.BlogRouteRecordRaw[]) {
    cacheRoutes.value = getCacheRouteNames(routes)
  }

  /**
   * 重置路由缓存
   *
   * @param routePath 路由键，默认值为当前路由名
   */
  async function resetRouteCache(routePath?: string) {
    const routeName = routePath
      ? findBlogRouteByPath(routeList, routePath)?.name
      : (router.currentRoute.value.name as string)

    excludeCacheRoutes.value.push(routeName as string)

    await nextTick()

    excludeCacheRoutes.value = []
  }

  function init() {
    getCacheRoutes(routeList)
  }

  init()

  return {
    cacheRoutes,
    excludeCacheRoutes,
    resetRouteCache,
  }
})
