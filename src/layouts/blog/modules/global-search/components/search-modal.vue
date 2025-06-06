<script lang="ts" setup>
import type { InputInstance } from 'element-plus'

import { useAppStore } from '@/store/modules/app'

import { useBlogStore } from '@/store/modules/blog'

import { onKeyStroke, useDebounceFn } from '@vueuse/core'

import {
  computed,
  ref,
  shallowRef,
} from 'vue'

import { useRouter } from 'vue-router'

import SearchFooter from './search-footer.vue'

import SearchResult from './search-result.vue'

defineOptions({
  name: 'SearchModal',
})

const router = useRouter()

const appStore = useAppStore()

const blogStore = useBlogStore()

const isMobile = computed(() => appStore.isMobile)

const keyword = ref('')

const activePath = ref('')

const resultOptions = shallowRef<BlogType.BlogMenuItem[]>([])

const handleSearch = useDebounceFn(search, 300)

const visible = defineModel<boolean>('show', {
  required: true,
})

const searchInput = ref<InputInstance>()

function search() {
  resultOptions.value = blogStore.searchMenuList.filter((menu) => {
    const trimKeyword = keyword.value.toLocaleLowerCase().trim()

    const title = menu.meta.title.toLocaleLowerCase()

    return trimKeyword && title.includes(trimKeyword)
  })
  activePath.value = resultOptions.value[0]?.path ?? ''
}

function handleClose() {
  // handle with setTimeout to prevent user from seeing some operations
  setTimeout(() => {
    visible.value = false
    resultOptions.value = []
    keyword.value = ''
  }, 200)
}

/** key up */
function handleUp() {
  const { length } = resultOptions.value

  if (length === 0) {
    return
  }

  const index = getActivePathIndex()

  if (index === -1) {
    return
  }

  const activeIndex = index === 0 ? length - 1 : index - 1

  activePath.value = resultOptions.value[activeIndex].path
}

/** key down */
function handleDown() {
  const { length } = resultOptions.value

  if (length === 0) {
    return
  }

  const index = getActivePathIndex()

  if (index === -1) {
    return
  }

  const activeIndex = index === length - 1 ? 0 : index + 1

  activePath.value = resultOptions.value[activeIndex].path
}

function getActivePathIndex() {
  return resultOptions.value.findIndex(item => item.path === activePath.value)
}

/** key enter */
function handleEnter() {
  if (resultOptions.value?.length === 0 || activePath.value === '') {
    return
  }

  handleClose()
  router.push(activePath.value)
}

function registerShortcut() {
  onKeyStroke('Escape', handleClose)
  onKeyStroke('Enter', handleEnter)
  onKeyStroke('ArrowUp', handleUp)
  onKeyStroke('ArrowDown', handleDown)
}

/** open dialog and set input focus */
function setFocus() {
  setTimeout(() => {
    searchInput.value?.focus()
  })
}

registerShortcut()
</script>

<template>
  <ElDialog
    v-model="visible"
    :show-close="false"
    append-to-body
    class="search-modal fixed left-0 right-0"
    :class="[isMobile ? 'size-full top-[0px] rounded-0' : 'w-[630px] top-[50px]']"
    @open-auto-focus="setFocus"
    @close="handleClose"
  >
    <ElInput
      ref="searchInput"
      v-model="keyword"
      clearable
      placeholder="请输入关键词搜索"
      @input="handleSearch"
    >
      <template
        #prefix
      >
        <icon-uil-search
          class="text-[15px]"
        />
      </template>

      <template
        v-if="isMobile"
        #append
      >
        <ElButton
          type="primary"
          plain
          @click="handleClose"
        >
          取消
        </ElButton>
      </template>
    </ElInput>

    <div>
      <ElEmpty
        v-if="resultOptions.length === 0"
        description="无数据"
        :image-size="50"
      />

      <SearchResult
        v-else
        v-model:path="activePath"
        :options="resultOptions"
        @enter="handleEnter"
      />
    </div>

    <template
      #footer
    >
      <SearchFooter
        v-if="!isMobile"
      />
    </template>
  </ElDialog>
</template>

<style lang="scss">
.search-modal {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 10px 15px 0;
  }
  .el-dialog__footer {
    border-top-width: 1px;
  }
}
</style>
