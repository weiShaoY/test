import type { NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router';
import type { RouteKey, RoutePath } from '@elegant-router/types';

import { useRouteStore } from '@/store/modules/route';

/**
 * create route guard
 *
 * @param router router instance
 */
export function createRouteGuard(router: Router) {
  // 注册全局前置路由守卫
  router.beforeEach(async (to, from, next) => {
    // 初始化路由，获取可能的跳转位置
    const location = await initRoute(to);

    // 如果有跳转位置，则直接跳转
    if (location) {
      next(location);
      return;
    }

    // 情况5：正常情况下的路由跳转处理
    handleRouteSwitch(to, from, next);
  });
}

/**
 * initialize route
 *
 * @param to to route
 */
async function initRoute(to: RouteLocationNormalized): Promise<RouteLocationRaw | null> {
  // 获取路由存储实例
  const routeStore = useRouteStore();

  // 定义404路由名称常量
  const notFoundRoute: RouteKey = 'not-found';
  // 判断当前是否是404路由
  const isNotFoundRoute = to.name === notFoundRoute;

  // 情况4：权限路由已初始化且不是404路由，允许访问
  if (!isNotFoundRoute) {
    return null;
  }

  // 情况5：被404路由捕获，检查该路由是否真实存在
  const exist = await routeStore.getIsAuthRouteExist(to.path as RoutePath);
  const noPermissionRoute: RouteKey = '403'; // 无权限路由名称

  // 如果路由存在但无权限访问，则跳转403页面
  if (exist) {
    const location: RouteLocationRaw = {
      name: noPermissionRoute
    };

    return location;
  }

  // 否则返回null（保持404状态）
  return null;
}

function handleRouteSwitch(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  // route with href
  if (to.meta.href) {
    window.open(to.meta.href, '_blank');

    next({ path: from.fullPath, replace: true, query: from.query, hash: to.hash });

    return;
  }

  next();
}
