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
      <div class="i-flex-y-center gap-2 align-middle">
        <SvgIcon
          v-if="themeStore.header.breadcrumb.showIcon && breadcrumb.meta.icon"
          class="mr-[4px] text-icon"
          :size="20"
          :icon="breadcrumb.meta.icon"
        />

        <!-- 外链徽标 -->
        <span>
          {{ breadcrumb.meta.title }}
        </span>

        <SvgIcon v-if="breadcrumb.meta.externalUrl" icon="blog-menu-externalUrl" :size="16" />

        <!-- 文本徽标 -->
        <div
          v-else-if="breadcrumb.meta.textBadge"
          class="m-auto h-[16px] min-w-5 rounded-[5px] bg-[#fd4e4e] p-x-1 text-center text-[10px] text-white leading-5"
        >
          {{ breadcrumb.meta.textBadge }}
        </div>

        <!-- 图标徽标 -->
        <SvgIcon v-else-if="breadcrumb.meta.iconBadge" :icon="breadcrumb.meta.iconBadge" :size="16" />
      </div>
    </DefineBreadcrumbContent>

    <!-- 定义组件端：面包屑内容 -->
    <ElBreadcrumbItem v-for="item in blogStore.breadcrumbList" :key="item.path">
      <ElDropdown v-if="item.options?.length" @command="handleClickMenu">
        <BreadcrumbContent :breadcrumb="item" />
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem v-for="option in item.options" :key="option.path" :command="option.path">
              <div class="flex items-center">
                <SvgIcon v-if="item.meta.icon" :key="item.path" :icon="item.meta.icon" :size="20" class="mr-2" />
                <div class="flex items-center gap-1">
                  <span>
                    {{ option.meta.title }}
                  </span>

                  <!-- 外链徽标 -->
                  <SvgIcon v-if="option.meta.externalUrl" icon="blog-menu-externalUrl" :size="16" />

                  <!-- 文本徽标 -->
                  <div
                    v-else-if="option.meta.textBadge"
                    class="m-auto h-[16px] min-w-5 rounded-[5px] bg-[#fd4e4e] p-x-1 text-center text-[10px] text-white leading-5"
                  >
                    {{ option.meta.textBadge }}
                  </div>

                  <!-- 图标徽标 -->
                  <SvgIcon v-else-if="option.meta.iconBadge" :icon="option.meta.iconBadge" :size="16" />
                </div>
              </div>
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <BreadcrumbContent v-else :breadcrumb="item" />
    </ElBreadcrumbItem>
  </ElBreadcrumb>
</template>

<style scoped></style>
