import type { RouteKey } from '@elegant-router/types';

import { useEventListener } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { SetupStoreId } from '@/enum';

import { useRouterPush } from '@/hooks/common/router';

import { router } from '@/router';

import { localStg } from '@/utils/storage';

import { useThemeStore } from '../theme';

import {
  extractTabsByAllRoutes,
  filterTabsByIds,
  filterTabsByPath,
  findTabByRouteName,
  getAllTabs,
  getFixedTabPaths,
  getTabByRoute,
  getTabPathByRoute,
  isTabInTabs
} from './shared';

/** Tab 状态管理 */
export const useTabStore = defineStore(SetupStoreId.Tab, () => {
  /** 主题状态管理 */
  const themeStore = useThemeStore();

  /** 路由跳转工具 */
  const { routerPush } = useRouterPush(false);

  /** Tab 列表 */
  const tabs = ref<App.Global.Tab[]>([]);

  /** 首页 Tab */
  const homeTab = ref<App.Global.Tab>({
    path: '/blog/aaa',
    label: 'aaa',
    fullPath: '/blog/aaa'
  });

  /** 初始化首页 Tab */
  function initHomeTab() {
    // homeTab.value = getDefaultHomeTab(router, routeStore.routeHome);
  }

  /** 所有 Tab（包括首页 Tab） */
  const allTabs = computed(() => getAllTabs(tabs.value, homeTab.value));

  /** 当前激活的 Tab Path */
  const activeTabPath = ref<string>('');

  /**
   * 设置当前激活的 Tab 路径
   *
   * @param path Tab 路径
   */
  function setActiveTabPath(path: string) {
    activeTabPath.value = path;
  }

  /**
   * 初始化 Tab 状态管理
   *
   * @param currentRoute 当前路由
   */
  function initTabStore(currentRoute: RouterType.BlogRouteRecordRaw) {
    const storageTabs = localStg.get('globalTabs');

    if (themeStore.tab.cache && storageTabs) {
      const extractedTabs = extractTabsByAllRoutes(router, storageTabs);

      tabs.value = extractedTabs;
    }

    addTab(currentRoute);
  }

  /**
   * 添加 Tab
   *
   * @param route 路由信息
   * @param active 是否激活该 Tab
   */
  function addTab(route: RouterType.BlogRouteRecordRaw, active = true) {
    const tab = getTabByRoute(route);

    const isHomeTab = tab.path === homeTab.value?.path;

    if (!isHomeTab && !isTabInTabs(tab.path, tabs.value)) {
      tabs.value.push(tab);
    }

    if (active) {
      setActiveTabPath(tab.path);
    }
  }

  /**
   * 移除 Tab
   *
   * @param tabPath Tab 路径
   */
  async function removeTab(tabPath: string) {
    const isRemoveActiveTab = activeTabPath.value === tabPath;

    const updatedTabs = filterTabsByPath(tabPath, tabs.value);

    function update() {
      tabs.value = updatedTabs;
    }

    if (!isRemoveActiveTab) {
      update();
      return;
    }

    const activeTab = updatedTabs.at(-1) || homeTab.value;

    if (activeTab) {
      await switchRouteByTab(activeTab);
      update();
    }
  }

  /** 移除当前激活的 Tab */
  async function removeActiveTab() {
    await removeTab(activeTabPath.value);
  }

  /**
   * 根据路由名称移除 Tab
   *
   * @param routeName 路由名称
   */
  async function removeTabByRouteName(routeName: RouteKey) {
    const tab = findTabByRouteName(routeName, tabs.value);

    if (!tab) {
      return;
    }

    await removeTab(tab.path);
  }

  /**
   * 清除所有 Tab（排除指定的 Tab）
   *
   * @param excludes 需要排除的 Tab ID 列表
   */
  async function clearTabs(excludes: string[] = []) {
    const remainTabPaths = [...getFixedTabPaths(tabs.value), ...excludes];

    const removedTabsPaths = tabs.value.map(tab => tab.path).filter(path => !remainTabPaths.includes(path));

    const isRemoveActiveTab = removedTabsPaths.includes(activeTabPath.value);

    const updatedTabs = filterTabsByIds(removedTabsPaths, tabs.value);

    function update() {
      tabs.value = updatedTabs;
    }

    if (!isRemoveActiveTab) {
      update();
      return;
    }

    const activeTab = updatedTabs[updatedTabs.length - 1] || homeTab.value;

    await switchRouteByTab(activeTab);
    update();
  }

  /**
   * 根据 Tab 切换路由
   *
   * @param tab Tab 信息
   */
  async function switchRouteByTab(tab: App.Global.Tab) {
    const fail = await routerPush(tab.fullPath);

    if (!fail) {
      setActiveTabPath(tab.path);
    }
  }

  /**
   * 清除左侧 Tab
   *
   * @param tabPath 当前 Tab 路径
   */
  async function clearLeftTabs(tabPath: string) {
    const tabIds = tabs.value.map(tab => tab.path);

    const index = tabIds.indexOf(tabPath);

    if (index === -1) {
      return;
    }

    const excludes = tabIds.slice(index);

    await clearTabs(excludes);
  }

  /**
   * 清除右侧 Tab
   *
   * @param tabPath 当前 Tab 路径
   */
  async function clearRightTabs(tabPath: string) {
    const isHomeTab = tabPath === homeTab.value?.path;

    if (isHomeTab) {
      clearTabs();
      return;
    }

    const tabIds = tabs.value.map(tab => tab.path);

    const index = tabIds.indexOf(tabPath);

    if (index === -1) {
      return;
    }

    const excludes = tabIds.slice(0, index + 1);

    await clearTabs(excludes);
  }

  /**
   * 设置 Tab 的新标签
   *
   * @param label 新标签
   * @param tabId Tab ID（默认为当前激活的 Tab ID）
   */
  function setTabLabel(label: string, tabId?: string) {
    const path = tabId || activeTabPath.value;

    const tab = tabs.value.find(item => item.path === path);

    if (!tab) {
      return;
    }

    tab.oldLabel = tab.label;
    tab.newLabel = label;
  }

  /**
   * 重置 Tab 的标签
   *
   * @param tabPath Tab ID（默认为当前激活的 Tab ID）
   */
  function resetTabLabel(tabPath?: string) {
    const path = tabPath || activeTabPath.value;

    const tab = tabs.value.find(item => item.path === path);

    if (!tab) {
      return;
    }

    tab.newLabel = undefined;
  }

  /**
   * 判断 Tab 是否固定
   *
   * @param tabPath Tab 路径
   */
  function isTabRetain(tabPath: string) {
    if (tabPath === homeTab.value?.path) {
      return true;
    }

    const fixedTabIds = getFixedTabPaths(tabs.value);

    return fixedTabIds.includes(tabPath);
  }

  /** 缓存 Tab */
  function cacheTabs() {
    if (!themeStore.tab.cache) {
      return;
    }

    localStg.set('globalTabs', tabs.value);
  }

  // 在页面关闭或刷新时缓存 Tab
  useEventListener(window, 'beforeunload', () => {
    cacheTabs();
  });

  return {
    /** 所有 Tab */
    tabs: allTabs,

    /** 当前激活的 Tab Path */
    activeTabPath,

    /** 初始化首页 Tab */
    initHomeTab,

    /** 初始化 Tab 状态管理 */
    initTabStore,

    /** 添加 Tab */
    addTab,

    /** 移除 Tab */
    removeTab,

    /** 移除当前激活的 Tab */
    removeActiveTab,

    /** 根据路由名称移除 Tab */
    removeTabByRouteName,

    /** 清除所有 Tab */
    clearTabs,

    /** 清除左侧 Tab */
    clearLeftTabs,

    /** 清除右侧 Tab */
    clearRightTabs,

    /** 根据 Tab 切换路由 */
    switchRouteByTab,

    /** 设置 Tab 的新标签 */
    setTabLabel,

    /** 重置 Tab 的标签 */
    resetTabLabel,

    /** 判断 Tab 是否固定 */
    isTabRetain,

    /** 根据路由获取 Tab ID */
    getTabIdByRoute: getTabPathByRoute,

    /** 缓存 Tab */
    cacheTabs
  };
});
