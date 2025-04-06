import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useContext } from '@sa/hooks';
import { useBlogStore } from '@/store';
import { findParentRoutePath } from '@/router/utils';

//  全局可访问的菜单状态上下文
//  用于在不同的菜单组件之间共享菜单数据
//  mix-menu 上下文的唯一标识符
//  useMixMenu 提供实际业务逻辑的hook
//  setupMixMenuContext 在组件setup中初始化上下文
//  useMixMenuContext 在组件setup中获取上下文
export const { setupStore: setupMixMenuContext, useStore: useMixMenuContext } = useContext('mix-menu', useMixMenu);

function useMixMenu() {
  const route = useRoute();
  const blogStore = useBlogStore();
  // const { selectedKey } = useMenu();

  /** 当前激活的一级菜单 key */
  const activeFirstLevelMenuKey = ref('');

  /**
   * 设置当前激活的一级菜单 key
   *
   * @param key - 需要设置的一级菜单 key
   */
  function setActiveFirstLevelMenuKey(key: string) {
    activeFirstLevelMenuKey.value = key;
  }

  /** 获取当前激活的一级菜单 key，并更新 `activeFirstLevelMenuKey` */
  function getActiveFirstLevelMenuKey() {
    // const firstLevelRouteName = selectedKey.value;

    const firstLevelRouteName = findParentRoutePath(route.path, blogStore.menuList);

    setActiveFirstLevelMenuKey(firstLevelRouteName as string);
  }

  /** 所有菜单项 */
  const allMenuList = computed<BlogType.BlogMenuItem[]>(() => blogStore.menuList);

  /** 一级菜单（去除子菜单，仅保留顶层菜单项） */
  const firstLevelMenus = computed<BlogType.BlogMenuItem[]>(() =>
    blogStore.menuList.map(menu => {
      const { children: _, ...rest } = menu;

      return rest;
    })
  );

  /** 当前激活的一级菜单下的子菜单 */
  const childLevelMenus = computed<BlogType.BlogMenuItem[]>(
    () => blogStore.menuList.find(menu => menu.path === activeFirstLevelMenuKey.value)?.children || []
  );

  /** 计算当前激活的一级菜单是否有子菜单 */
  const isActiveFirstLevelMenuHasChildren = computed(() => {
    if (!activeFirstLevelMenuKey.value) {
      return false;
    }

    const findItem = allMenuList.value.find(item => item.path === activeFirstLevelMenuKey.value);

    return Boolean(findItem?.children?.length);
  });

  /** 监听路由变化，自动更新当前激活的一级菜单 key */
  watch(
    () => route.name,
    () => {
      getActiveFirstLevelMenuKey();
    },
    { immediate: true }
  );

  return {
    /** 所有菜单项 */
    allMenuList,
    /** 一级菜单（仅包含顶层菜单项，不包含子菜单） */
    firstLevelMenus,
    /** 当前激活的一级菜单下的子菜单 */
    childLevelMenus,
    /** 当前激活的一级菜单是否有子菜单 */
    isActiveFirstLevelMenuHasChildren,
    /** 当前激活的一级菜单 key */
    activeFirstLevelMenuKey,
    /** 设置当前激活的一级菜单 key */
    setActiveFirstLevelMenuKey,
    /** 计算并设置当前激活的一级菜单 key */
    getActiveFirstLevelMenuKey
  };
}

/**
 * 获取当前选中菜单项Key的自定义Hook 用于根据当前路由确定哪个菜单项应该被高亮显示
 *
 * @returns 当前选中的菜单 key
 */
export function useMenu() {
  // 获取当前路由对象，包含路由路径、参数、元信息等
  const route = useRoute();

  /** 计算当前选中菜单项的Key 这是一个响应式计算属性，当路由变化时会自动重新计算 */
  const selectedKey = computed(() => {
    // 从路由元信息(meta)中解构出两个关键属性:
    // hideInMenu - 布尔值，表示该路由是否应该在菜单中隐藏
    // activeMenu - 当路由需要隐藏时，指定哪个菜单项应该被激活
    const { hideInMenu, activeMenu } = route.meta;

    // 获取当前路由的名称，并确保其为字符串类型
    // 路由name通常用于唯一标识路由
    const path = route.path as string;

    /**
     * 计算最终的路由名称(用于菜单选中状态)
     *
     * 1. 如果路由设置了hideInMenu为true，则使用activeMenu指定的菜单项
     * 2. 否则直接使用当前路由name
     * 3. 最后使用 || 操作符确保总是返回一个有效值
     */
    const routePath = (hideInMenu ? activeMenu : name) || path;

    // 返回计算出的菜单项Key
    return routePath;
  });

  // 返回包含selectedKey的对象，可以在组件中解构使用
  return {
    selectedKey
  };
}
