<script setup lang="ts" generic="T extends Record<string, unknown>, K = never">
import { VueDraggable } from 'vue-draggable-plus'

defineOptions({
  name: 'TableColumnSetting',
})

/** 定义列模型，类型为 UI.TableColumnCheck[]，且为必填 */
const columns = defineModel<UI.TableColumnCheck[]>('columns', {
  required: true,
})
</script>

<template>
  <ElPopover
    placement="bottom-end"
    trigger="click"
  >
    <template
      #reference
    >
      <ElButton>
        <template
          #icon
        >
          <SvgIcon
            icon="setting"
            class="text-icon"
          />
        </template>
        列设置
      </ElButton>
    </template>

    <VueDraggable
      v-model="columns"
      :animation="150"
      filter=".none_draggable"
    >
      <div
        v-for="item in columns"
        :key="item.prop"
        class="h-[36px] flex-y-center rd-[4px] hover:bg-primary hover:bg-opacity-20"
      >
        <icon-mdi-drag
          class="mr-[8px] h-full cursor-move text-icon"
        />

        <ElCheckbox
          v-model="item.checked"
          class="none_draggable flex-1"
        >
          {{ item.label }}
        </ElCheckbox>
      </div>
    </VueDraggable>
  </ElPopover>
</template>

<style scoped></style>
