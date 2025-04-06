<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { SimpleScrollbar } from '@sa/materials';
import { useBoolean } from '@sa/hooks';
import type { RouteKey } from '@elegant-router/types';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useBlogStore } from '@/store';
import { GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useMenu, useMixMenuContext } from '../../../context';
import FirstLevelMenu from '../components/first-level-menu.vue';
import GlobalLogo from '../../global-logo/index.vue';
import MenuItem from '../components/menu-item.vue';

import { useNavigation } from '../useNavigation';

defineOptions({
  name: 'VerticalMixMenu'
});

const route = useRoute();
const appStore = useAppStore();
const themeStore = useThemeStore();
const blogStore = useBlogStore();
const { bool: drawerVisible, setBool: setDrawerVisible } = useBoolean();
const {
  allMenuList,
  childLevelMenus,
  activeFirstLevelMenuKey,
  setActiveFirstLevelMenuKey,
  getActiveFirstLevelMenuKey
  //
} = useMixMenuContext();

const { selectedKey } = useMenu();

/** 计算是否使用深色模式（仅在不是暗黑模式且侧边栏反色时为 true） */
const inverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted);

/** 计算是否有子菜单 */
const hasChildMenus = computed(() => childLevelMenus.value.length > 0);

/** 计算抽屉菜单是否可见（有子菜单并且抽屉打开或侧边栏固定时可见 */
const showDrawer = computed(() => hasChildMenus.value && (drawerVisible.value || appStore.mixSiderFixed));

/**
 * 处理菜单选择事件
 *
 * @param menu 选中的菜单项
 */
function handleSelectMixMenu(menu: BlogType.BlogMenuItem) {
  setActiveFirstLevelMenuKey(menu.path);

  if (menu.children?.length) {
    setDrawerVisible(true);
  } else {
    handleSelectMenu(menu.path);
  }
}

function handleResetActiveMenu() {
  setDrawerVisible(false);

  if (!appStore.mixSiderFixed) {
    getActiveFirstLevelMenuKey();
  }
}

const expandedKeys = ref<string[]>([]);

function updateExpandedKeys() {
  if (appStore.siderCollapse || !selectedKey.value) {
    expandedKeys.value = [];
    return;
  }
  expandedKeys.value = blogStore.getSelectedMenuKeyPath(selectedKey.value);
}

watch(
  () => route.name,
  () => {
    updateExpandedKeys();
  },
  { immediate: true }
);

const { navigate } = useNavigation();
function handleSelectMenu(key: string) {
  navigate(key);
}
</script>

<template>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <div class="h-full flex" @mouseleave="handleResetActiveMenu">
      <FirstLevelMenu
        :menu-list="allMenuList"
        :active-menu-key="activeFirstLevelMenuKey"
        :inverted="inverted"
        :sider-collapse="appStore.siderCollapse"
        :dark-mode="themeStore.darkMode"
        :theme-color="themeStore.themeColor"
        @select="handleSelectMixMenu"
        @toggle-sider-collapse="appStore.toggleSiderCollapse"
      >
        <GlobalLogo :show-title="false" :style="{ height: themeStore.header.height + 'px' }" />
      </FirstLevelMenu>
      <div
        class="relative h-full transition-width-300"
        :style="{ width: appStore.mixSiderFixed && hasChildMenus ? themeStore.sider.mixChildMenuWidth + 'px' : '0px' }"
      >
        <DarkModeContainer
          class="absolute-lt h-full flex-col-stretch nowrap-hidden shadow-sm transition-all-300"
          :inverted="inverted"
          :style="{ width: showDrawer ? themeStore.sider.mixChildMenuWidth + 'px' : '0px' }"
        >
          <header class="flex-y-center justify-between px-[12px]" :style="{ height: themeStore.header.height + 'px' }">
            <h2 class="text-[16px] text-primary font-bold">weiShaoY</h2>
            <PinToggler
              :pin="appStore.mixSiderFixed"
              :class="{ 'text-white:88 !hover:text-white': inverted }"
              @click="appStore.toggleMixSiderFixed"
            />
          </header>
          <SimpleScrollbar>
            <ElMenu mode="vertical" :default-active="selectedKey" @select="val => handleSelectMenu(val as RouteKey)">
              <MenuItem v-for="item in childLevelMenus" :key="item.path" :item="item" :index="item.path" />
            </ElMenu>
          </SimpleScrollbar>
        </DarkModeContainer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>
