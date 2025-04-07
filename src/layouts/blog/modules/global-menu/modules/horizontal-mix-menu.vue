<!-- 顶部菜单混合模式 -->
<script setup lang="ts">
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useRouterPush } from '@/hooks/common/router';
import FirstLevelMenu from '../components/first-level-menu.vue';
import { useMenu, useMixMenuContext } from '../../../context';
import MenuItem from '../components/menu-item.vue';

defineOptions({
  name: 'HorizontalMixMenu'
});

const appStore = useAppStore();
const themeStore = useThemeStore();
const { allMenuList, childLevelMenus, activeFirstLevelMenuKey, setActiveFirstLevelMenuKey } = useMixMenuContext();
const { selectedKey } = useMenu();

const { routerPushByKeyWithMetaQuery } = useRouterPush();

/**
 * 处理选择混合菜单事件
 *
 * @param menu 菜单项
 */
function handleSelectMixMenu(menu: BlogType.BlogMenuItem) {
  setActiveFirstLevelMenuKey(menu.path);

  if (!menu.children?.length) {
    routerPushByKeyWithMetaQuery(menu.path);
  }
}
</script>

<template>
  <!-- 将菜单传送到全局头部菜单 -->
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <ElMenu
      ellipsis
      class="w-full"
      mode="horizontal"
      :default-active="selectedKey"
      @select="val => routerPushByKeyWithMetaQuery(val)"
    >
      <!-- 渲染子级菜单项 -->
      <MenuItem v-for="item in childLevelMenus" :key="item.path" :item="item" :index="item.path" />
    </ElMenu>
  </Teleport>
  <!-- 将一级菜单传送到全局侧边菜单 -->
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <FirstLevelMenu
      :menu-list="allMenuList"
      :active-menu-key="activeFirstLevelMenuKey"
      :sider-collapse="appStore.siderCollapse"
      :dark-mode="themeStore.darkMode"
      :theme-color="themeStore.themeColor"
      @select="handleSelectMixMenu"
      @toggle-sider-collapse="appStore.toggleSiderCollapse"
    />
  </Teleport>
</template>

<style scoped></style>
