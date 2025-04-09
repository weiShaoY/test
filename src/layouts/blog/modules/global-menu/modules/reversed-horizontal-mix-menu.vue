<script setup lang="ts">
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app'

import { useRouterPush } from '@/hooks/common/router'

import { useAppStore } from '@/store/modules/app'

import { useBlogStore } from '@/store/modules/blog'

import { SimpleScrollbar } from '@sa/materials'

import { ref, watch } from 'vue'

import { useRoute } from 'vue-router'

import { useMenu, useMixMenuContext } from '../../../context'

import MenuItem from '../components/menu-item.vue'

defineOptions({
  name: 'ReversedHorizontalMixMenu',
})

const route = useRoute()

const appStore = useAppStore()

const blogStore = useBlogStore()

const { routerPushByKeyWithMetaQuery } = useRouterPush()

const {
  firstLevelMenus,
  childLevelMenus,
  activeFirstLevelMenuKey,
  setActiveFirstLevelMenuKey,
  isActiveFirstLevelMenuHasChildren,
} = useMixMenuContext()

const { selectedKey } = useMenu()

/**
 * 处理选择混合菜单事件
 *
 * @param key 路由键
 */
function handleSelectMixMenu(key: string) {
  setActiveFirstLevelMenuKey(key)

  if (!isActiveFirstLevelMenuHasChildren.value) {
    routerPushByKeyWithMetaQuery(key)
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

/** 更新展开的菜单项 */
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
  <!-- 将一级菜单传送到全局头部菜单 -->
  <Teleport
    :to="`#${GLOBAL_HEADER_MENU_ID}`"
  >
    <ElMenu
      ellipsis
      class="w-full"
      mode="horizontal"
      :default-active="activeFirstLevelMenuKey"
      @select="val => handleSelectMixMenu(val)"
    >
      <!-- 渲染一级菜单项 -->
      <MenuItem
        v-for="item in firstLevelMenus"
        :key="item.path"
        :item="item"
        :index="item.path"
      />
    </ElMenu>
  </Teleport>
  <!-- 将子级菜单传送到全局侧边菜单 -->
  <Teleport
    :to="`#${GLOBAL_SIDER_MENU_ID}`"
  >
    <SimpleScrollbar>
      <ElMenu
        mode="vertical"
        :default-active="selectedKey"
        :collapse="appStore.siderCollapse"
        @select="val => routerPushByKeyWithMetaQuery(val)"
      >
        <!-- 渲染子级菜单项 -->
        <MenuItem
          v-for="item in childLevelMenus"
          :key="item.path"
          :item="item"
          :index="item.path"
        />
      </ElMenu>
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
