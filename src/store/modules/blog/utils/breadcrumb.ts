/**
 * 将菜单转换为面包屑
 *
 * @param menu
 */
function transformMenuToBreadcrumb(menu: BlogType.BlogMenuItem) {
  const { children, ...rest } = menu;

  const breadcrumb: BlogType.Breadcrumb = {
    ...rest
  };

  if (children?.length) {
    breadcrumb.options = children.map(transformMenuToBreadcrumb);
  }

  return breadcrumb;
}

/**
 * 根据当前路由信息和菜单列表生成对应的面包屑路径
 *
 * @param route 当前的路由对象
 * @param menus 全部菜单列表
 * @returns 面包屑数组
 */
export function getBreadcrumbsByRoute(
  route: RouterType.BlogRouteRecordRaw,
  menus: BlogType.BlogMenuItem[]
): BlogType.Breadcrumb[] {
  // 获取当前路由的名称作为 key
  const path = route.path as string;

  // 获取当前路由中 meta 中定义的 activeMenu，用于激活状态处理
  // const activeKey = route.meta?.activeMenu;

  // 遍历所有菜单
  for (const menu of menus) {
    // 如果当前菜单 key 与路由 key 相同，直接返回该菜单的面包屑
    if (menu.path === path) {
      console.log('%c Line:178 🍯 menu', 'color:#ffdd4d', menu);
      return [transformMenuToBreadcrumb(menu)];
    }

    // 如果当前菜单 key 与路由的 activeMenu 相同
    // if (menu.path === activeKey) {
    //   // 定义路由分隔符（一般用于嵌套路由 key，例如：parent_child）
    //   const ROUTE_DEGREE_SPLITTER = '_';

    //   // 解析出当前路由的父级 key
    //   const parentKey = key.split(ROUTE_DEGREE_SPLITTER).slice(0, -1).join(ROUTE_DEGREE_SPLITTER);

    //   // 获取当前路由对应的菜单（可能是子级）
    //   const breadcrumbMenu = getGlobalMenuByBaseRoute(route);

    //   // 如果父级 key 与 activeMenu 不同，说明是非嵌套路由，直接返回单级面包屑
    //   if (parentKey !== activeKey) {
    //     return [transformMenuToBreadcrumb(breadcrumbMenu)];
    //   }

    //   // 否则为多级嵌套菜单，返回父子两个面包屑
    //   return [transformMenuToBreadcrumb(menu), transformMenuToBreadcrumb(breadcrumbMenu)];
    // }

    // 如果当前菜单有子菜单，递归处理子菜单
    if (menu.children?.length) {
      const result = getBreadcrumbsByRoute(route, menu.children);

      // 如果在子菜单中找到了匹配的面包屑路径，添加父级菜单信息并返回
      if (result.length > 0) {
        return [transformMenuToBreadcrumb(menu), ...result];
      }
    }
  }

  // 如果没有匹配成功，返回空数组
  return [];
}
