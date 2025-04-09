<script setup lang="ts">
import { transformColorWithOpacity } from '@sa/color'

import { SimpleScrollbar } from '@sa/materials'

import { createReusableTemplate } from '@vueuse/core'

import { computed } from 'vue'

defineOptions({
  name: 'FirstLevelMenu',
})

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

type Props = {
  menuList: BlogType.BlogMenuItem[]
  activeMenuKey?: string
  inverted?: boolean
  siderCollapse?: boolean
  darkMode?: boolean
  themeColor: string
}

type Emits = {
  (e: 'select', menu: BlogType.BlogMenuItem): boolean
  (e: 'toggleSiderCollapse'): void
}

type MixMenuItemProps = {

  /**
   * 菜单项的标签（名称）
   *
   * @example
   *   仪表盘;
   */
  title: BlogType.BlogMenuItem['meta']['title']

  /**
   * 菜单项的图标
   *
   * @example
   *   <SvgIcon icon="home" />;
   */
  icon?: BlogType.BlogMenuItem['meta']['icon']

  /**
   * 是否为当前激活的菜单项
   *
   * @example
   *   true;
   */
  active: boolean

  /**
   * 是否为迷你模式（小尺寸显示）
   *
   * @default false
   */
  isMini?: boolean
}

const [DefineMixMenuItem, MixMenuItem] = createReusableTemplate<MixMenuItemProps>()

const selectedBgColor = computed(() => {
  const { darkMode, themeColor } = props

  const light = transformColorWithOpacity(themeColor, 0.1, '#ffffff')

  const dark = transformColorWithOpacity(themeColor, 0.3, '#000000')

  return darkMode ? dark : light
})

function handleClickMixMenu(menu: BlogType.BlogMenuItem) {
  emit('select', menu)
}

function toggleSiderCollapse() {
  emit('toggleSiderCollapse')
}
</script>

<template>
  <!-- 定义可复用的 MixMenuItem 组件 -->
  <DefineMixMenuItem
    v-slot="{ title, icon, active, isMini }"
  >
    <div
      class="mx-[4px] mb-[6px] flex-col-center cursor-pointer rounded-[8px] bg-transparent px-[4px] py-[8px] transition-300 hover:bg-[rgb(0,0,0,0.08)]"
      :class="{
        'text-primary selected-mix-menu': active,
        'text-white:65 hover:text-white': inverted,
        '!text-white !bg-primary': active && inverted,
      }"
    >
      <!-- 动态加载图标 -->
      <SvgIcon
        v-if="icon"
        :icon="icon"
        :class="isMini ? 'text-icon-small' : 'text-icon-large'"
      />

      <!-- 菜单项标签 -->
      <p
        class="w-full ellipsis-text text-center text-[12px] transition-height-300"
        :class="[isMini ? 'h-0 pt-0' : 'h-[20px] pt-[4px]']"
      >
        {{ title }}
      </p>
    </div>
  </DefineMixMenuItem>
  <!-- 定义结束 -->

  <!-- 主布局 -->
  <div
    class="h-full flex-col-stretch flex-1-hidden"
  >
    <slot />

    <SimpleScrollbar>
      <!-- 遍历菜单列表，渲染 MixMenuItem -->
      <MixMenuItem
        v-for="menu in menuList"
        :key="menu.path"
        :title="menu.meta.title"
        :icon="menu.meta.icon"
        :active="menu.path === activeMenuKey"
        :is-mini="siderCollapse"
        @click="handleClickMixMenu(menu)"
      />
    </SimpleScrollbar>

    <!-- 侧边栏折叠按钮 -->
    <MenuToggler
      arrow-icon
      :collapsed="siderCollapse"
      :z-index="99"
      :class="{ 'text-white:88 !hover:text-white': inverted }"
      @click="toggleSiderCollapse"
    />
  </div>
</template>

<style scoped>
.selected-mix-menu {
  background-color: v-bind(selectedBgColor);
}
</style>
