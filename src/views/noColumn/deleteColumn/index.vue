<template>
  <div class="delete-column-container">
    <el-alert
      v-if="theme.layout == 'column'"
      :closable="false"
      title="单栏页面演示"
    />
    <el-alert
      v-else
      :closable="false"
      title="当前布局不支持单栏页面演示"
      type="error"
    />
  </div>
</template>

<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'
  defineOptions({
    name: 'DeleteColumn',
  })

  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
</script>
