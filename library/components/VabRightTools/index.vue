<template>
  <div class="vab-right-tools">
    <vab-search v-if="!isHorizontal" class="hidden-xs-only" />
    <vab-dark
      :style="!isHorizontal ? '' : { marginLeft: 'var(--el-margin)' }"
    />
    <vab-color-picker />
    <vab-error-log class="hidden-xs-only" />
    <vab-theme />
    <vab-lock />
    <vab-notice />
    <vab-language />
    <vab-full-screen />
    <vab-refresh />
    <vab-avatar />
  </div>
</template>

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

<style lang="scss" scoped>
  .vab-right-tools {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>
