<template>
  <footer v-if="theme.showFooter" class="vab-footer">
    Copyright
    <vab-icon icon="copyright-line" />
    {{ fullYear }} {{ title }}
  </footer>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabFooter',
})

const fullYear = new Date().getFullYear()
const settingsStore = useSettingsStore()
const { title, theme } = storeToRefs(settingsStore)
</script>

<style lang="scss" scoped>
.vab-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 55px;
  padding: 0 var(--el-padding) 0 var(--el-padding);
  margin-top: -1px;
  color: var(--el-color-grey);
  background: var(--el-color-white);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);

  i {
    margin: 0 5px;
  }
}
</style>
