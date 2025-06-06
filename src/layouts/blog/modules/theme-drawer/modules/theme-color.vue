<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme'

import SettingItem from '../components/setting-item.vue'

defineOptions({
  name: 'ThemeColor',
})

const themeStore = useThemeStore()

/**
 * 更新主题颜色
 *
 * @param color 选中的颜色
 * @param key 主题颜色的键
 */
function handleUpdateColor(color: string | null, key: App.Theme.ThemeColorKey) {
  if (color !== null) {
    themeStore.updateThemeColors(key, color)
  }
}

/** 预定义颜色选项 */
const swatches: string[] = [
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#0ea5e9',
  '#06b6d4',
  '#f43f5e',
  '#ef4444',
  '#ec4899',
  '#d946ef',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
]
</script>

<template>
  <ElDivider>
    主题颜色
  </ElDivider>

  <div
    class="flex-col-stretch gap-[12px]"
  >
    <ElTooltip
      placement="top-start"
    >
      <template
        #content
      >
        <p>
          <span
            class="pr-[12px]"
          >推荐颜色的算法参照</span>

          <br>

          <ElButton
            text
            tag="a"
            href="https://uicolors.app/create"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray"
          >
            https://uicolors.app/create
          </ElButton>
        </p>
      </template>

      <SettingItem
        key="recommend-color"
        label="应用推荐算法的颜色"
      >
        <ElSwitch
          v-model="themeStore.recommendColor"
        />
      </SettingItem>
    </ElTooltip>

    <SettingItem
      v-for="(_, key) in themeStore.themeColors"
      :key="key"
      :label="
        key === 'primary'
          ? '主色'
          : key === 'info'
            ? '信息色'
            : key === 'success'
              ? '成功色'
              : key === 'warning'
                ? '警告色'
                : key === 'error'
                  ? '错误色'
                  : ''
      "
    >
      <template
        v-if="key === 'info'"
        #suffix
      >
        <ElCheckbox
          v-model="themeStore.isInfoFollowPrimary"
        >
          跟随主色
        </ElCheckbox>
      </template>

      <ElColorPicker
        v-model="themeStore.themeColors[key]"
        class="w-[40px]"
        :disabled="key === 'info' && themeStore.isInfoFollowPrimary"
        :show-alpha="false"
        :predefine="swatches"
        @change="handleUpdateColor($event, key)"
      />
    </SettingItem>
  </div>
</template>

<style scoped></style>
