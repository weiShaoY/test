/**
 * 获取缓存路由名
 *
 * @param routes Vue 路由数组（两级）
 * @returns 缓存路由名
 */
export function getCacheRouteNames(routes: RouterType.BlogRouteRecordRaw[]) {
  const cacheNames: string[] = []

  routes.forEach((route) => {
    // 仅获取具有组件的最后两级路由
    route.children?.forEach((child) => {
      if (child.component && child.meta?.keepAlive) {
        cacheNames.push(child.name as string)
      }
    })
  })

  return cacheNames
}
