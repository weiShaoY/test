<script setup lang="ts">
import type { Placement } from 'element-plus'

import { computed } from 'vue'

defineOptions({
  name: 'ThemeSchemaSwitch',
})

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true,
  tooltipPlacement: 'bottom',
})

const emit = defineEmits<Emits>()

type Props = {

  /** 主题方案 */
  themeSchema: UnionKey.ThemeScheme

  /** 显示工具提示 */
  showTooltip?: boolean

  /** 工具提示位置 */
  tooltipPlacement?: Placement
}

type Emits = {
  (e: 'switch'): void
}

function handleSwitch() {
  emit('switch')
}

const icons: Record<UnionKey.ThemeScheme, string> = {
  light: 'blog-theme-light',
  dark: 'blog-theme-dark',
  auto: 'blog-theme-auto',
}

const icon = computed(() => icons[props.themeSchema])

const tooltipContent = computed(() => {
  if (!props.showTooltip) { return '' }

  return '主题模式'
})
</script>

<template>
  <ButtonIcon
    :icon="icon"
    :tooltip-content="tooltipContent"
    :tooltip-placement="tooltipPlacement"
    @click="handleSwitch"
  />
</template>

<style scoped></style>
