<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { RouteKey } from '@elegant-router/types';
import { SimpleScrollbar } from '@sa/materials';
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useBlogStore } from '@/store/modules/blog';
import { useMenu, useMixMenuContext } from '../../../context';
import MenuItem from '../components/menu-item.vue';
import { useNavigation } from '../useNavigation';

defineOptions({ name: 'ReversedHorizontalMixMenu' });

const route = useRoute();
const appStore = useAppStore();
const blogStore = useBlogStore();

const {
  firstLevelMenus,
  childLevelMenus,
  activeFirstLevelMenuKey,
  setActiveFirstLevelMenuKey,
  isActiveFirstLevelMenuHasChildren
} = useMixMenuContext();
const { selectedKey } = useMenu();

function handleSelectMixMenu(key: RouteKey) {
  setActiveFirstLevelMenuKey(key);

  if (!isActiveFirstLevelMenuHasChildren.value) {
    handleSelectMenu(key);
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
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <ElMenu
      ellipsis
      class="w-full"
      mode="horizontal"
      :default-active="activeFirstLevelMenuKey"
      @select="val => handleSelectMixMenu(val as RouteKey)"
    >
      <MenuItem v-for="item in firstLevelMenus" :key="item.path" :item="item" :index="item.path" />
    </ElMenu>
  </Teleport>

  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <SimpleScrollbar>
      <ElMenu
        mode="vertical"
        :default-active="selectedKey"
        :collapse="appStore.siderCollapse"
        @select="val => handleSelectMenu(val as RouteKey)"
      >
        <MenuItem v-for="item in childLevelMenus" :key="item.path" :item="item" :index="item.path" />
      </ElMenu>
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
