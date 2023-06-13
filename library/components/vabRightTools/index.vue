<script lang="ts" setup>
  defineOptions({
    name: 'VabRightTools',
  })
  defineProps({
    isHorizontal: {
      type: Boolean,
      default: false,
    },
  })
</script>

<template>
  <vab-search v-if="!isHorizontal" class="hidden-xs-only" />
  <vab-dark :style="!isHorizontal ? '' : { marginLeft: 'var(--el-margin)' }" />
  <vab-color-picker />
  <vab-theme />
  <vab-error-log />
  <vab-notice />
  <vab-full-screen class="hidden-xs-only" />
  <vab-language />
  <vab-refresh />
  <vab-avatar />
</template>
