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
  <div class="vab-right-tools">
    <vab-search v-if="!isHorizontal" class="hidden-xs-only" />
    <vab-dark
      :style="!isHorizontal ? '' : { marginLeft: 'var(--el-margin)' }"
    />
    <vab-color-picker />
    <vab-theme />
    <vab-error-log />
    <vab-notice />
    <vab-full-screen class="hidden-xs-only" />
    <vab-language />
    <vab-refresh />
    <vab-avatar />
  </div>
</template>

<style lang="scss" scoped>
  .vab-right-tools {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>
