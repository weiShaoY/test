<script lang="ts" setup>
import { useBoolean } from '@sa/hooks'

import SearchModal from './components/search-modal.vue'

defineOptions({
  name: 'GlobalSearch',
})

const { bool: show, toggle } = useBoolean()
</script>

<template>
  <ButtonIcon
    tooltip-content="搜索"
    @click="toggle"
  >
    <icon-uil-search />
  </ButtonIcon>

  <SearchModal
    v-model:show="show"
  />
</template>

<style lang="scss" scoped></style>
