<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useRoute } from 'vue-router'

const route = useRoute()

const externalUrl = ref('')

onMounted(() => {
  if (route.meta.externalUrl) {
    externalUrl.value = route.meta.externalUrl as string
  }
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center bg-red"
  >
    <div>
      外链页面
    </div>

    <ElButton>
      再次打开
    </ElButton>
  </div>
</template>

<style scoped></style>
