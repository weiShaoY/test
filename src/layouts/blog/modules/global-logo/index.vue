<script setup lang="ts">
defineOptions({
  name: 'GlobalLogo',
})

withDefaults(defineProps<Props>(), {
  showTitle: true,
})

type Props = {

  /** Whether to show the title */
  showTitle?: boolean
}

</script>

<template>
  <RouterLink
    to="/"
    class="w-full flex items-center justify-center nowrap-hidden"
  >
    <SystemLogo
      class="text-[32px] text-primary"
    />

    <h2
      v-show="showTitle"
      class="pl-[8px] text-[16px] text-primary font-bold transition duration-300 ease-in-out"
    >
      weiShaoY
    </h2>
  </RouterLink>
</template>

<style scoped></style>
