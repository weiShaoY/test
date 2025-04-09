/**
 * 查找当前路由的父路由路径
 *
 * @param routes 路由配置数组
 * @param currentPath 当前路由path
 * @returns 父路由path（如果是一级路由则返回自身path）
 */
export function findParentRoutePath(currentPath: string, routes: RouterType.BlogRouteRecordRaw[]): string | null {
  // 特殊情况处理
  if (currentPath === '/') { return null }

  // 递归查找函数
  function findRoute(
    routeList: RouterType.BlogRouteRecordRaw[],
    parentPath: string | null = null,
  ): { found: boolean, parentPath: string | null } {
    for (const route of routeList) {
      // 如果找到当前路由
      if (route.path === currentPath) {
        return {
          found: true,
          parentPath: parentPath || route.path, // 如果没父级则返回自身
        }
      }

      // 如果有子路由，递归查找
      if (route.children?.length) {
        const result = findRoute(route.children, route.path)

        if (result.found) {
          return result
        }
      }
    }

    return {
      found: false,
      parentPath: null,
    }
  }

  const { found, parentPath } = findRoute(routes)

  return found ? parentPath : null
}

/**
 * 递归查找与目标路径匹配的路由
 *
 * @param routeList 路由数组
 * @param routePath 要匹配的目标路径
 * @returns 返回匹配到的路由对象，未找到则返回undefined
 */
export function findBlogRouteByPath(
  routeList: RouterType.BlogRouteRecordRaw[],
  routePath: string,
): RouterType.BlogRouteRecordRaw | undefined {
  // 路径标准化处理：去除末尾斜杠，确保格式统一
  const normalizePath = (path: string) => path.replace(/\/+$/, '')

  // 遍历路由数组
  for (const route of routeList) {
    // 检查当前路由路径是否匹配
    if (route.path && normalizePath(route.path) === normalizePath(routePath)) {
      return route
    }

    // 如果当前路由不匹配，递归检查其子路由
    if (route.children) {
      const foundInChildren = findBlogRouteByPath(route.children, routePath)

      if (foundInChildren) {
        return foundInChildren
      }
    }
  }

  // 未找到匹配路由
  return undefined
}
