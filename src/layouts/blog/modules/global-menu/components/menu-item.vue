<script setup lang="ts">
interface Props {
  item: BlogType.BlogMenuItem;
}

const { item } = defineProps<Props>();

/** 判断是否有子菜单 */
const hasChildren = item.children && item.children.length > 0;
</script>

<template>
  <!-- 父项 -->
  <ElSubMenu v-if="hasChildren" :index="item.path">
    <template #title>
      <SvgIcon v-if="item.meta.icon" :icon="item.meta.icon" :size="20" class="mr-2" />
      <span class="ib-ellipsis">{{ item.meta.title }}</span>
    </template>
    <MenuItem v-for="child in item.children" :key="child.path" :item="child" :index="child.path"></MenuItem>
  </ElSubMenu>

  <!-- 子项 -->
  <ElMenuItem v-else>
    <SvgIcon v-if="item.meta.icon" :key="item.path" :icon="item.meta.icon" :size="20" class="mr-2" />
    <template #title>
      <div class="w-full flex items-center justify-between">
        <span class="ib-ellipsis">
          {{ item.meta.title }}
        </span>

        <div class="flex items-center">
          <!-- 外链徽标 -->
          <SvgIcon v-if="item.meta.externalUrl" icon="blog-menu-externalUrl" :size="16" />

          <!-- 文本徽标 -->
          <div
            v-else-if="item.meta.textBadge"
            class="m-auto h-[16px] min-w-5 rounded-[5px] bg-[#fd4e4e] p-x-1 text-center text-[10px] text-white leading-5"
          >
            {{ item.meta.textBadge }}
          </div>

          <!-- 图标徽标 -->
          <SvgIcon v-else-if="item.meta.iconBadge" :icon="item.meta.iconBadge" :size="16" />
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
