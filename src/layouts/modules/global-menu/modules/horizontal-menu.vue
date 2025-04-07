<!-- 顶部菜单模式 -->
<script setup lang="ts">
import { GLOBAL_HEADER_MENU_ID } from '@/constants/app';
import { useBlogStore } from '@/store';
import { useRouterPush } from '@/hooks/common/router';
import { useMenu } from '../../../context';
import MenuItem from '../components/menu-item.vue';

defineOptions({ name: 'HorizontalMenu' });
const { routerPushByKeyWithMetaQuery } = useRouterPush();

const blogStore = useBlogStore();

const { selectedKey } = useMenu();
</script>

<template>
  <!-- 将菜单传送到全局头部菜单 -->
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <ElMenu
      ellipsis
      class="w-full"
      mode="horizontal"
      :default-active="selectedKey"
      @select="value => routerPushByKeyWithMetaQuery(value)"
    >
      <!-- 渲染菜单项 -->
      <MenuItem v-for="item in blogStore.menuList" :key="item.path" :item="item" :index="item.path" />
    </ElMenu>
  </Teleport>
</template>

<style scoped></style>
