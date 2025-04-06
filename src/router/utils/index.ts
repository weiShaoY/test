/**
 * 查找当前路由的父路由路径
 *
 * @param routes 路由配置数组
 * @param currentPath 当前路由path
 * @returns 父路由path（如果是一级路由则返回自身path）
 */
export function findParentRoutePath(currentPath: string, routes: RouterType.BlogRouteRecordRaw[]): string | null {
  // 特殊情况处理
  if (currentPath === '/') return null;

  // 递归查找函数
  function findRoute(
    routeList: RouterType.BlogRouteRecordRaw[],
    parentPath: string | null = null
  ): { found: boolean; parentPath: string | null } {
    for (const route of routeList) {
      // 如果找到当前路由
      if (route.path === currentPath) {
        return {
          found: true,
          parentPath: parentPath || route.path // 如果没父级则返回自身
        };
      }

      // 如果有子路由，递归查找
      if (route.children?.length) {
        const result = findRoute(route.children, route.path);
        if (result.found) {
          return result;
        }
      }
    }
    return { found: false, parentPath: null };
  }

  const { found, parentPath } = findRoute(routes);
  return found ? parentPath : null;
}
