<script setup lang="ts">
interface Props {
  item: BlogType.BlogMenuItem;
}

const { item } = defineProps<Props>();

/** 判断是否有子菜单 */
const hasChildren = item.children && item.children.length > 0;
</script>

<template>
  <ElSubMenu v-if="hasChildren" :index="item.path">
    <template #title>
      <SvgIcon v-if="item.meta.icon" :icon="item.meta.icon" />
      <span class="ib-ellipsis">{{ item.meta.title }}</span>
    </template>
    <MenuItem v-for="child in item.children" :key="child.path" :item="child" :index="child.path"></MenuItem>
  </ElSubMenu>
  <ElMenuItem v-else>
    <SvgIcon v-if="item.meta.icon" :key="item.path" :icon="item.meta.icon" />
    <template #title>
      <span class="ib-ellipsis">{{ item.meta.title }}</span>
    </template>
  </ElMenuItem>
</template>

<style scoped>
.ib-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
}
</style>
