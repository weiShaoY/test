<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'

import { useThemeStore } from '@/store/modules/theme'

import LayoutModeCard from '../components/layout-mode-card.vue'

import SettingItem from '../components/setting-item.vue'

defineOptions({
  name: 'LayoutMode',
})

const appStore = useAppStore()

const themeStore = useThemeStore()

function handleReverseHorizontalMixChange(value: boolean | string | number) {
  themeStore.setLayoutReverseHorizontalMix(value as boolean)
}
</script>

<template>
  <ElDivider>
    布局模式
  </ElDivider>
  {{ themeStore.layout.mode }}
  <LayoutModeCard
    v-model:mode="themeStore.layout.mode"
    :disabled="appStore.isMobile"
  >
    <template
      #vertical
    >
      <div
        class="layout-sider h-full w-[18px]"
      />

      <div
        class="vertical-wrapper"
      >
        <div
          class="layout-header"
        />

        <div
          class="layout-main"
        />
      </div>
    </template>

    <template
      #vertical-mix
    >
      <div
        class="layout-sider h-full w-[8px]"
      />

      <div
        class="layout-sider h-full w-[16px]"
      />

      <div
        class="vertical-wrapper"
      >
        <div
          class="layout-header"
        />

        <div
          class="layout-main"
        />
      </div>
    </template>

    <template
      #horizontal
    >
      <div
        class="layout-header"
      />

      <div
        class="horizontal-wrapper"
      >
        <div
          class="layout-main"
        />
      </div>
    </template>

    <template
      #horizontal-mix
    >
      <div
        class="layout-header"
      />

      <div
        class="horizontal-wrapper"
      >
        <div
          class="layout-sider w-[18px]"
        />

        <div
          class="layout-main"
        />
      </div>
    </template>
  </LayoutModeCard>

  <SettingItem
    v-if="themeStore.layout.mode === 'horizontal-mix'"
    label="一级菜单与子级菜单位置反转"
    class="mt-[16px]"
  >
    <ElSwitch
      v-model="themeStore.layout.reverseHorizontalMix"
      @change="handleReverseHorizontalMixChange"
    />
  </SettingItem>
</template>

<style scoped>
.layout-header {
  --uno: h-16px bg-primary rd-4px;
}

.layout-sider {
  --uno: bg-primary-300 rd-4px;
}

.layout-main {
  --uno: flex-1 bg-primary-200 rd-4px;
}

.vertical-wrapper {
  --uno: flex-1 flex-col gap-6px;
}

.horizontal-wrapper {
  --uno: flex-1 flex gap-6px;
}
</style>
