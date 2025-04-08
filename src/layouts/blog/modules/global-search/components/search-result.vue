<script lang="ts" setup>
import { useThemeStore } from '@/store/modules/theme';

defineOptions({ name: 'SearchResult' });

type Props = {
  options: BlogType.BlogMenuItem[];
};

defineProps<Props>();

interface Emits {
  (e: 'enter'): void;
}

const emit = defineEmits<Emits>();

const theme = useThemeStore();

const active = defineModel<string>('path', { required: true });

async function handleMouseEnter(item: BlogType.BlogMenuItem) {
  active.value = item.path;
}

function handleTo() {
  emit('enter');
}
</script>

<template>
  <ElScrollbar>
    <div class="pb-[12px]">
      <template v-for="item in options" :key="item.path">
        <div
          class="mt-[8px] h-[56px] flex-y-center cursor-pointer justify-between rounded-[4px] bg-[#e5e7eb] px-[14px] dark:bg-dark"
          :style="{
            background: item.path === active ? theme.themeColor : '',
            color: item.path === active ? '#fff' : ''
          }"
          @click="handleTo"
          @mouseenter="handleMouseEnter(item)"
        >
          <SvgIcon v-if="item.meta.icon" :icon="item.meta.icon" class="icon mr-[3px] p-[2px] text-[20px]" />

          <span class="ml-[5px] flex-1">
            {{ item.meta.title }}
          </span>
          <icon-ant-design-enter-outlined class="icon mr-[3px] p-[2px] text-[20px]" />
        </div>
      </template>
    </div>
  </ElScrollbar>
</template>

<style lang="scss" scoped></style>
