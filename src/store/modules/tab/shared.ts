import type { RouteKey } from '@elegant-router/types'

import type { Router } from 'vue-router'

// import { getRoutePath } from '@/router/elegant/transform';

/**
 * 获取所有标签页
 *
 * @param tabs 标签页数组
 * @param homeTab 主页标签页
 * @returns 更新后的标签页数组
 */
export function getAllTabs(tabs: App.Global.Tab[], homeTab?: App.Global.Tab) {
  if (!homeTab) {
    return []
  }

  const filterHomeTabs = tabs.filter(tab => tab.path !== homeTab.path)

  const fixedTabs = filterHomeTabs.filter(isFixedTab).sort((a, b) => a.fixedIndex! - b.fixedIndex!)

  const remainTabs = filterHomeTabs.filter(tab => !isFixedTab(tab))

  const allTabs = [homeTab, ...fixedTabs, ...remainTabs]

  return updateTabsLabel(allTabs)
}

/**
 * 判断是否为固定标签页
 *
 * @param tab 标签页
 * @returns 是否为固定标签页
 */
function isFixedTab(tab: App.Global.Tab) {
  return tab.fixedIndex !== undefined && tab.fixedIndex !== null
}

/**
 * 根据路由获取标签页 path
 *
 * @param route 路由
 * @returns 标签页 path
 */
export function getTabPathByRoute(route: RouterType.BlogRouteRecordRaw) {
  const {
    path,
    query = {
    } as any,
    meta,
  } = route

  let id = path

  // 如果路由支持多标签页
  if (meta.multiTab) {
    const queryKeys = Object.keys(query).sort()

    const qs = queryKeys.map(key => `${key}=${query[key]}`).join('&')

    id = `${path}?${qs}`
  }

  return id
}

/**
 * 根据路由获取标签页
 *
 * @param route 路由
 * @returns 标签页
 */
export function getTabByRoute(route: RouterType.BlogRouteRecordRaw) {
  const { path, fullPath = path, meta } = route

  const { title, fixedIndexInTab } = meta

  // 从 getRouteIcons 函数中获取图标和本地图标
  const { icon } = getRouteIcons(route)

  const label = title || ''

  const tab: App.Global.Tab = {
    path: getTabPathByRoute(route),
    label,
    fullPath,
    fixedIndex: fixedIndexInTab,
    icon,
  }

  return tab
}

/**
 * 获取路由图标
 *
 * @param route 路由
 * @returns 图标和本地图标
 */
export function getRouteIcons(route: RouterType.BlogRouteRecordRaw) {
  // 设置图标的默认值
  let icon: string = route?.meta?.icon || import.meta.env.VITE_MENU_ICON

  // 如果路由有匹配的路由记录
  if (route.matched) {
    // 从匹配的路由记录中找到当前路由
    const currentRoute = route.matched.find(r => r.name === route.name)

    // 如果当前路由的 meta 中有图标，则覆盖默认值
    icon = currentRoute?.meta?.icon || icon
  }

  return {
    icon,
  }
}

/**
 * 判断标签页是否在标签页数组中
 *
 * @param tabPath 标签页 ID
 * @param tabs 标签页数组
 * @returns 是否在标签页数组中
 */
export function isTabInTabs(tabPath: string, tabs: App.Global.Tab[]) {
  return tabs.some(tab => tab.path === tabPath)
}

/**
 * 根据 ID 过滤标签页
 *
 * @param tabPath 标签页 ID
 * @param tabs 标签页数组
 * @returns 过滤后的标签页数组
 */
export function filterTabsByPath(tabPath: string, tabs: App.Global.Tab[]) {
  return tabs.filter(tab => tab.path !== tabPath)
}

/**
 * 根据 标签路径 数组过滤标签页
 *
 * @param tabPaths 标签页 ID 数组
 * @param tabs 标签页数组
 * @returns 过滤后的标签页数组
 */
export function filterTabsByIds(tabPaths: string[], tabs: App.Global.Tab[]) {
  return tabs.filter(tab => !tabPaths.includes(tab.path))
}

/**
 * 根据所有路由提取标签页
 *
 * @param router 路由器
 * @param tabs 标签页数组
 * @returns 提取后的标签页数组
 */
export function extractTabsByAllRoutes(router: Router, tabs: App.Global.Tab[]) {
  const routes = router.getRoutes()

  const routePaths = routes.map(route => route.path)

  return tabs.filter(tab => routePaths.includes(tab.path))
}

/**
 * 获取固定标签页
 *
 * @param tabs 标签页数组
 * @returns 固定标签页数组
 */
export function getFixedTabs(tabs: App.Global.Tab[]) {
  return tabs.filter(isFixedTab)
}

/**
 * 获取固定标签页 ID
 *
 * @param tabs 标签页数组
 * @returns 固定标签页 ID 数组
 */
export function getFixedTabPaths(tabs: App.Global.Tab[]) {
  const fixedTabs = getFixedTabs(tabs)

  return fixedTabs.map(tab => tab.path)
}

/**
 * 更新标签页标签
 *
 * @param tabs 标签页数组
 * @returns 更新后的标签页数组
 */
function updateTabsLabel(tabs: App.Global.Tab[]) {
  const updated = tabs.map(tab => ({
    ...tab,
    label: tab.newLabel || tab.oldLabel || tab.label,
  }))

  return updated
}

/**
 * 根据路由名称查找标签页
 *
 * @param name 路由名称
 * @param tabs 标签页数组
 * @returns 找到的标签页
 */
export function findTabByRouteName(name: RouteKey, tabs: App.Global.Tab[]) {
  // const routePath = getRoutePath(name);
  // const tabId = routePath;
  // const multiTabId = `${routePath}?`;
  // return tabs.find(tab => tab.path === tabId || tab.path.startsWith(multiTabId));
}
