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
      <div class="w-full flex items-center">
        <span class="ib-ellipsis">{{ item.meta.title }}</span>

        <div v-if="item.meta.externalUrl" class="absolute bottom-0 right-5 top-0 m-auto">
          <SvgIcon icon="blog-menu-externalUrl" :size="20" />
        </div>

        <!-- 文本徽标 -->
        <div
          v-else-if="item.meta.textBadge"
          class="absolute bottom-0 right-5 top-0 m-auto h-[20px] min-w-5 rounded-[5px] bg-[#fd4e4e] p-x-1 text-center text-[12px] text-white leading-5"
        >
          {{ item.meta.textBadge }}
        </div>

        <!-- 图标徽标 -->
        <div v-else-if="item.meta.iconBadge" class="absolute bottom-0 right-5 top-0 m-auto">
          <SvgIcon :icon="item.meta.iconBadge" :size="20" />
        </div>
      </div>
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
