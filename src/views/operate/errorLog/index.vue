<template>
  <div class="errorLog-container table-auto-height">
    <vab-error-log-content />
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'ErrorLog',
  })
</script>

<style lang="scss" scoped>
  :deep() {
    .vab-data-empty {
      min-height: calc(var(--el-keep-alive-height) - 105px) !important;
    }
  }
</style>
