<script lang="ts" setup>
import { computed } from 'vue'

defineOptions({
  name: 'PinToggler',
})

const props = defineProps<Props>()

type Props = {

  /** 是否固定 */
  pin?: boolean
}

const icon = computed(() => (props.pin ? 'mdi-pin-off' : 'mdi-pin'))
</script>

<template>
  <ButtonIcon
    :tooltip-content="pin ? '取消固定' : '固定'"
    tooltip-placement="bottom-start"
    :z-index="100"
  >
    <SvgIcon
      :icon="icon"
    />
  </ButtonIcon>
</template>

<style scoped></style>
