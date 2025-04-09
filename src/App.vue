<script setup lang="ts">
import type { WatermarkProps } from 'element-plus'

import zhCn from 'element-plus/es/locale/lang/zh-cn'

import { computed } from 'vue'

import { useThemeStore } from './store/modules/theme'

defineOptions({
  name: 'App',
})

const themeStore = useThemeStore()

const watermarkProps = computed<WatermarkProps>(() => {
  return {
    content: themeStore.watermark.visible ? themeStore.watermark.text || 'SoybeanAdmin' : '',
    cross: true,
    fontSize: 16,
    lineHeight: 16,
    gap: [100, 120],
    rotate: -15,
    zIndex: 9999,
  }
})
</script>

<template>
  <ElConfigProvider
    :locale="zhCn"
  >
    <AppProvider>
      <ElWatermark
        class="h-full"
        v-bind="watermarkProps"
      >
        <RouterView
          class="bg-layout"
        />
      </ElWatermark>
    </AppProvider>
  </ElConfigProvider>
</template>

<style scoped></style>
