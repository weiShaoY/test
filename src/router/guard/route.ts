import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationRaw,
  Router,
} from 'vue-router'

/**
 * create route guard
 *
 * @param router router instance
 */
export function createRouteGuard(router: Router) {
  // 注册全局前置路由守卫
  router.beforeEach(async (to, from, next) => {
    // 初始化路由，获取可能的跳转位置
    const location = await initRoute(to)

    // 如果有跳转位置，则直接跳转
    if (location) {
      next(location)
      return
    }

    // 情况5：正常情况下的路由跳转处理
    handleRouteSwitch(to, from, next)
  })
}

/**
 * initialize route
 *
 * @param to to route
 */
async function initRoute(to: RouteLocationNormalized): Promise<RouteLocationRaw | null> {
  // 定义404路由名称常量
  const notFoundRoute = 'not-found'

  // 判断当前是否是404路由
  const isNotFoundRoute = to.name === notFoundRoute

  // 情况4：权限路由已初始化且不是404路由，允许访问
  if (!isNotFoundRoute) {
    return null
  }

  // 否则返回null（保持404状态）
  return null
}

function handleRouteSwitch(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  // route with href
  if (to.meta.href) {
    window.open(to.meta.href, '_blank')

    next({
      path: from.fullPath,
      replace: true,
      query: from.query,
      hash: to.hash,
    })

    return
  }

  next()
}
