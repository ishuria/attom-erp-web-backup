<script setup>
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
    padding: 0 $base-padding 0 $base-padding;
    color: var(--el-color-grey);
    background: var(--el-color-white);
    border-top: 1px dashed var(--el-border-color-light);
    border-right: 1px solid var(--el-border-color-light);
    border-bottom: 1px solid var(--el-border-color-light);
    border-left: 1px solid var(--el-border-color-light);
    border-bottom-right-radius: var(--el-border-radius-base);
    border-bottom-left-radius: var(--el-border-radius-base);

    i {
      margin: 0 5px;
    }
  }
</style>
