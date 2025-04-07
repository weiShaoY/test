<script setup lang="ts">
import { computed } from 'vue';
import type { Placement } from 'element-plus';

defineOptions({ name: 'ThemeSchemaSwitch' });

interface Props {
  /** 主题方案 */
  themeSchema: UnionKey.ThemeScheme;
  /** 显示工具提示 */
  showTooltip?: boolean;
  /** 工具提示位置 */
  tooltipPlacement?: Placement;
}

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true,
  tooltipPlacement: 'bottom'
});

interface Emits {
  (e: 'switch'): void;
}

const emit = defineEmits<Emits>();

function handleSwitch() {
  emit('switch');
}

const icons: Record<UnionKey.ThemeScheme, string> = {
  light: 'blog-theme-light',
  dark: 'blog-theme-dark',
  auto: 'blog-theme-auto'
};

const icon = computed(() => icons[props.themeSchema]);

const tooltipContent = computed(() => {
  if (!props.showTooltip) return '';

  return '主题模式';
});
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
