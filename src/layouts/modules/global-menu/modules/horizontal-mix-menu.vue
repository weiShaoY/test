<script setup lang="ts">
import type { RouteKey } from '@elegant-router/types';
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useNavigation } from '../useNavigation';
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

function handleSelectMixMenu(menu: BlogType.BlogMenuItem) {
  setActiveFirstLevelMenuKey(menu.path);

  if (!menu.children?.length) {
    handleSelectMenu(menu.path);
  }
}

const { navigate } = useNavigation();
function handleSelectMenu(key: string) {
  navigate(key);
}
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <ElMenu
      ellipsis
      class="w-full"
      mode="horizontal"
      :default-active="selectedKey"
      @select="val => handleSelectMenu(val as RouteKey)"
    >
      <MenuItem v-for="item in childLevelMenus" :key="item.path" :item="item" :index="item.path" />
    </ElMenu>
  </Teleport>
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
