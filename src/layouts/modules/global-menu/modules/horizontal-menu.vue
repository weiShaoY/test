<!-- 顶部菜单模式 -->
<script setup lang="ts">
import { GLOBAL_HEADER_MENU_ID } from '@/constants/app';
import { useBlogStore } from '@/store';
import { useMenu } from '../../../context';
import MenuItem from '../components/menu-item.vue';
import { useNavigation } from '../useNavigation';

defineOptions({ name: 'HorizontalMenu' });

const blogStore = useBlogStore();

const { selectedKey } = useMenu();

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
      @select="value => handleSelectMenu(value)"
    >
      <MenuItem v-for="item in blogStore.menuList" :key="item.path" :item="item" :index="item.path" />
    </ElMenu>
  </Teleport>
</template>

<style scoped></style>
