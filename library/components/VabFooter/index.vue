<script lange="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'

  const fullYear = new Date().getFullYear()
  const settingsStore = useSettingsStore()
  const { title } = storeToRefs(settingsStore)
</script>

<template>
  <footer class="vab-footer">
    Copyright
    <vab-icon icon="copyright-line" />
    {{ fullYear }} {{ title }}
  </footer>
</template>

<style lang="scss" scoped>
  .vab-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 55px;
    padding: 0 var(--el-padding) 0 var(--el-padding);
    color: var(--el-color-grey);
    background: var(--el-color-white);
    border-top: 1px dashed var(--el-border-color);
    border-right: 1px solid var(--el-border-color);
    border-bottom: 1px solid var(--el-border-color);
    border-left: 1px solid var(--el-border-color);
    border-bottom-right-radius: var(--el-border-radius-base);
    border-bottom-left-radius: var(--el-border-radius-base);

    i {
      margin: 0 5px;
    }
  }
</style>
