/** 获取并更新菜单列表 */
export function getMenuList(routeList: RouterType.BlogRouteRecordRaw[]) {
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

  return generateMenuList();
}

/**
 * 查找菜单路径 - 通过深度优先搜索(DFS)查找目标菜单key在菜单树中的路径
 *
 * @example
 *   const menuTree = {
 *     key: '1',
 *     children: [{ key: '1-1' }, { key: '1-2', children: [{ key: '1-2-1' }] }]
 *   };
 *   findMenuPath('1-2-1', menuTree); // 返回 ['1', '1-2', '1-2-1']
 *
 * @param targetKey 目标菜单项的key值，用于匹配查找
 * @param menu 菜单树节点，从该节点开始向下搜索
 * @returns 返回从根节点到目标节点的key路径数组，如果未找到则返回null
 */
function findMenuPath(targetKey: string, menu: BlogType.BlogMenuItem): string[] | null {
  // 存储当前搜索路径的数组
  const pathList: string[] = [];

  /**
   * 深度优先搜索(DFS)递归函数
   *
   * @param item 当前遍历的菜单节点
   * @returns 布尔值，表示是否找到目标key
   */
  function dfs(item: BlogType.BlogMenuItem): boolean {
    // 将当前节点的key加入路径列表
    pathList.push(item.path);

    // 基础情况：找到目标key
    if (item.path === targetKey) {
      return true;
    }

    // 如果有子节点，递归搜索每个子节点
    if (item.children) {
      for (const child of item.children) {
        // 如果子节点搜索返回true，表示已找到，直接返回
        if (dfs(child)) {
          return true;
        }
      }
    }

    // 当前分支未找到目标，回溯：移除最后添加的key
    pathList.pop();

    // 返回未找到
    return false;
  }

  // 从传入的menu节点开始搜索
  if (dfs(menu)) {
    // 如果找到，返回完整路径
    return pathList;
  }

  // 未找到目标key，返回null
  return null;
}

/**
 * 根据选中的菜单项key，获取其在菜单树中的完整路径
 *
 * @param selectedKey
 * @param menuList
 */
export function getSelectedMenuKeyPathByKey(selectedKey: string, menuList: BlogType.BlogMenuItem[]) {
  // 初始化存储路径的数组
  const keyPath: string[] = [];
  // 遍历菜单树，使用some可以在找到后立即停止遍历
  menuList.some(menu => {
    // 调用findMenuPath查找当前菜单项及其子菜单中是否存在目标key
    const path = findMenuPath(selectedKey, menu);
    // 将查找结果转换为布尔值
    const find = Boolean(path?.length);
    // 如果找到匹配的路径
    if (find) {
      // 将找到的路径展开并添加到keyPath数组中
      // 这里使用非空断言(!)因为我们已确认path有值
      keyPath.push(...path!);
    }
    // 返回查找结果，如果为true会停止后续遍历
    return find;
  });

  return keyPath;
}

/**
 * 转换菜单为搜索菜单
 *
 * @param menus - menus
 * @param treeMap
 */
export function transformMenuToSearchMenuList(menus: BlogType.BlogMenuItem[], treeMap: BlogType.BlogMenuItem[] = []) {
  if (menus && menus.length === 0) return [];
  return menus.reduce((acc, cur) => {
    if (!cur.children) {
      acc.push(cur);
    }
    if (cur.children && cur.children.length > 0) {
      transformMenuToSearchMenuList(cur.children, treeMap);
    }
    return acc;
  }, treeMap);
}

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
