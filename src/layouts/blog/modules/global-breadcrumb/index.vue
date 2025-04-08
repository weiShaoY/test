<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core';
import { useThemeStore } from '@/store/modules/theme';
import { useBlogStore } from '@/store';
import { router } from '@/router';

defineOptions({ name: 'GlobalBreadcrumb' });

const themeStore = useThemeStore();
const blogStore = useBlogStore();

interface BreadcrumbContentProps {
  breadcrumb: BlogType.BlogMenuItem;
}

const [DefineBreadcrumbContent, BreadcrumbContent] = createReusableTemplate<BreadcrumbContentProps>();

function handleClickMenu(path: string) {
  router.push(path);
}
</script>

<template>
  <ElBreadcrumb v-if="themeStore.header.breadcrumb.visible">
    <!-- 定义组件开始：面包屑内容 -->
    <DefineBreadcrumbContent v-slot="{ breadcrumb }">
      <div class="i-flex-y-center align-middle">
        <SvgIcon
          v-if="themeStore.header.breadcrumb.showIcon && breadcrumb.meta.icon"
          class="mr-[4px] text-icon"
          :icon="breadcrumb.meta.icon"
        />

        {{ breadcrumb.meta.title }}
      </div>
    </DefineBreadcrumbContent>

    <!-- 定义组件端：面包屑内容 -->
    <ElBreadcrumbItem v-for="item in blogStore.breadcrumbList" :key="item.path">
      <ElDropdown v-if="item.options?.length" @command="handleClickMenu">
        <BreadcrumbContent :breadcrumb="item" />
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem v-for="option in item.options" :key="option.path" :command="option.path">
              {{ option.meta.title }}
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <BreadcrumbContent v-else :breadcrumb="item" />
    </ElBreadcrumbItem>
  </ElBreadcrumb>
</template>

<style scoped></style>
