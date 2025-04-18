<script setup lang="ts">
/** 定义组件选项 */
defineOptions({
  name: 'TableHeaderOperation',
})

/** 定义组件属性 */
defineProps<Props>()

/** 定义组件事件 */
const emit = defineEmits<Emits>()

/** 组件属性类型 */
type Props = {

  /** 是否禁用删除按钮 */
  disabledDelete?: boolean

  /** 加载状态 */
  loading?: boolean
}

/** 组件事件类型 */
type Emits = {

  /** 添加事件 */
  (e: 'add'): void

  /** 删除事件 */
  (e: 'delete'): void

  /** 刷新事件 */
  (e: 'refresh'): void
}

/** 定义列模型 */
const columns = defineModel<UI.TableColumnCheck[]>('columns', {
  default: () => [],
})

/** 添加操作 */
function add() {
  emit('add')
}

/** 批量删除操作 */
function batchDelete() {
  emit('delete')
}

/** 刷新操作 */
function refresh() {
  emit('refresh')
}
</script>

<template>
  <ElSpace
    direction="horizontal"
    wrap
    justify="end"
    class="lt-sm:w-[200px]"
  >
    <slot
      name="prefix"
    />

    <slot
      name="default"
    >
      <ElButton
        plain
        type="primary"
        @click="add"
      >
        <template
          #icon
        >
          <icon-ic-round-plus
            class="text-icon"
          />
        </template>
        新增
      </ElButton>

      <ElPopconfirm
        title="确认删除吗？"
        @confirm="batchDelete"
      >
        <template
          #reference
        >
          <ElButton
            type="danger"
            plain
            :disabled="disabledDelete"
          >
            <template
              #icon
            >
              <icon-ic-round-delete
                class="text-icon"
              />
            </template>
            批量删除
          </ElButton>
        </template>
      </ElPopconfirm>
    </slot>

    <ElButton
      @click="refresh"
    >
      <template
        #icon
      >
        <icon-mdi-refresh
          class="text-icon"
          :class="{ 'animate-spin': loading }"
        />
      </template>
      刷新
    </ElButton>

    <TableColumnSetting
      v-model:columns="columns"
    />

    <slot
      name="suffix"
    />
  </ElSpace>
</template>

<style scoped></style>
