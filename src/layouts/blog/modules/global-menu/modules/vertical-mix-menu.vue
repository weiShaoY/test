<script setup lang="ts">
import { GLOBAL_SIDER_MENU_ID } from '@/constants/app'

import { useRouterPush } from '@/hooks/common/router'

import { useBlogStore } from '@/store'

import { useAppStore } from '@/store/modules/app'

import { useThemeStore } from '@/store/modules/theme'

import { useBoolean } from '@sa/hooks'

import { SimpleScrollbar } from '@sa/materials'

import {
  computed,
  ref,
  watch,
} from 'vue'

import { useRoute } from 'vue-router'

import { useMenu, useMixMenuContext } from '../../../context'

import GlobalLogo from '../../global-logo/index.vue'

import FirstLevelMenu from '../components/first-level-menu.vue'

import MenuItem from '../components/menu-item.vue'

defineOptions({
  name: 'VerticalMixMenu',
})

const route = useRoute()

const appStore = useAppStore()

const themeStore = useThemeStore()

const blogStore = useBlogStore()

const { bool: drawerVisible, setBool: setDrawerVisible } = useBoolean()

const {
  allMenuList,
  childLevelMenus,
  activeFirstLevelMenuKey,
  setActiveFirstLevelMenuKey,
  getActiveFirstLevelMenuKey,

  //
} = useMixMenuContext()

const { selectedKey } = useMenu()

/** 计算是否使用深色模式（仅在不是暗黑模式且侧边栏反色时为 true） */
const inverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted)

/** 计算是否有子菜单 */
const hasChildMenus = computed(() => childLevelMenus.value.length > 0)

/** 计算抽屉菜单是否可见（有子菜单并且抽屉打开或侧边栏固定时可见 */
const showDrawer = computed(() => hasChildMenus.value && (drawerVisible.value || appStore.mixSiderFixed))

const { routerPushByKeyWithMetaQuery } = useRouterPush()

/**
 * 处理选择混合菜单事件
 *
 * @param menu 菜单项
 */
function handleSelectMixMenu(menu: BlogType.BlogMenuItem) {
  setActiveFirstLevelMenuKey(menu.path)

  if (menu.children?.length) {
    setDrawerVisible(true)
  }
  else {
    routerPushByKeyWithMetaQuery(menu.path)
  }
}

/** 重置激活的菜单项 */
function handleResetActiveMenu() {
  setDrawerVisible(false)

  if (!appStore.mixSiderFixed) {
    getActiveFirstLevelMenuKey()
  }
}

const expandedKeys = ref<string[]>([])

function updateExpandedKeys() {
  if (appStore.siderCollapse || !selectedKey.value) {
    expandedKeys.value = []
    return
  }

  expandedKeys.value = blogStore.menuFunc.getSelectedMenuKeyPath(selectedKey.value)
}

watch(
  () => route.name,
  () => {
    updateExpandedKeys()
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <Teleport
    :to="`#${GLOBAL_SIDER_MENU_ID}`"
  >
    <div
      class="h-full flex"
      @mouseleave="handleResetActiveMenu"
    >
      <!-- 一级菜单 -->
      <FirstLevelMenu
        :menu-list="allMenuList"
        :active-menu-key="activeFirstLevelMenuKey"
        :inverted="inverted"
        :sider-collapse="appStore.siderCollapse"
        :dark-mode="themeStore.darkMode"
        :theme-color="themeStore.themeColor"
        @select="handleSelectMixMenu"
        @toggle-sider-collapse="appStore.toggleSiderCollapse"
      >
        <!-- 全局 Logo -->
        <GlobalLogo
          :show-title="false"
          :style="{ height: `${themeStore.header.height}px` }"
        />
      </FirstLevelMenu>

      <div
        class="relative h-full transition-width-300"
        :style="{ width: appStore.mixSiderFixed && hasChildMenus ? `${themeStore.sider.mixChildMenuWidth}px` : '0px' }"
      >
        <DarkModeContainer
          class="absolute-lt h-full flex-col-stretch nowrap-hidden shadow-sm transition-all-300"
          :inverted="inverted"
          :style="{ width: showDrawer ? `${themeStore.sider.mixChildMenuWidth}px` : '0px' }"
        >
          <!-- 顶部栏 -->
          <header
            class="flex-y-center justify-between px-[12px]"
            :style="{ height: `${themeStore.header.height}px` }"
          >
            <h2
              class="text-[16px] text-primary font-bold"
            >
              weiShaoY
            </h2>

            <PinToggler
              :pin="appStore.mixSiderFixed"
              :class="{ 'text-white:88 !hover:text-white': inverted }"
              @click="appStore.toggleMixSiderFixed"
            />
          </header>
          <!-- 滚动条容器 -->
          <SimpleScrollbar>
            <ElMenu
              mode="vertical"
              :default-active="selectedKey"
              @select="val => routerPushByKeyWithMetaQuery(val)"
            >
              <!-- 子级菜单项 -->
              <MenuItem
                v-for="item in childLevelMenus"
                :key="item.path"
                :item="item"
                :index="item.path"
              />
            </ElMenu>
          </SimpleScrollbar>
        </DarkModeContainer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>
