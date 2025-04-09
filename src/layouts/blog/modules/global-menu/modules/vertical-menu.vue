<script setup lang="ts">
import { GLOBAL_SIDER_MENU_ID } from '@/constants/app'

import { useRouterPush } from '@/hooks/common/router'

import { useAppStore } from '@/store/modules/app'

import { useBlogStore } from '@/store/modules/blog'

import { SimpleScrollbar } from '@sa/materials'

import { ref, watch } from 'vue'

import { useRoute } from 'vue-router'

import { useMenu } from '../../../context'

import MenuItem from '../components/menu-item.vue'

defineOptions({
  name: 'VerticalMenu',
})
const { routerPushByKeyWithMetaQuery } = useRouterPush()

const route = useRoute()

const appStore = useAppStore()

const blogStore = useBlogStore()

const { selectedKey } = useMenu()

const expandedKeys = ref<string[]>([])

/** 更新展开的菜单项 */
function updateExpandedKeys() {
  // 如果侧边栏折叠,或者没有选中的菜单项,则清空展开的菜单项
  if (appStore.siderCollapse || !selectedKey.value) {
    expandedKeys.value = []
  }

  // 如果每次 要展开的菜单项
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
    <!-- 将菜单传送到全局侧边菜单 -->
    <SimpleScrollbar>
      <ElMenu
        mode="vertical"
        :default-active="selectedKey"
        :default-openeds="expandedKeys"
        :collapse="appStore.siderCollapse"
        @select="value => routerPushByKeyWithMetaQuery(value)"
      >
        <!-- 渲染菜单项 -->
        <MenuItem
          v-for="item in blogStore.menuList"
          :key="item.path"
          :item="item"
          :index="item.path"
        />
      </ElMenu>
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
