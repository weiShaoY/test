<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'

defineOptions({
  name: 'ThemeButton',
})

const appStore = useAppStore()
</script>

<template>
  <ButtonIcon
    icon="setting"
    tooltip-content="主题配置"
    @click="appStore.openThemeDrawer"
  />
</template>

<style scoped></style>
