<template>
  <div class="watermark-container">
    <el-button type="primary" @click="setWatermark(title)">添加水印</el-button>
    <el-button type="primary" @click="setCustomWatermark">添加自定义水印</el-button>
    <el-button type="danger" @click="setWatermark('')">移除水印</el-button>
  </div>
</template>

<script lang="ts" setup>
  import Watermark from '/@/utils/watermark'
  import { useSettingsStore } from '/@/store/modules/settings'
  import { ElMessageBox } from 'element-plus'

  defineOptions({
    value: 'Watermark',
  })
  const settingsStore = useSettingsStore()
  const { title } = storeToRefs(settingsStore)

  const setWatermark = (value: string) => {
    //@ts-ignore
    Watermark.set(value)
  }
  const setCustomWatermark = () => {
    ElMessageBox.prompt('请输入自定义水印', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      draggable: true,
    })
      .then(({ value }) => {
        if (value) setWatermark(value)
      })
      .catch(() => {})
  }
</script>

<style lang="scss" scoped>
  .watermark-container {
    :deep() {
      .el-button {
        margin-right: 10px;
        margin-bottom: 10px;
      }

      .el-button + .el-button {
        margin-right: 10px;
        margin-left: 0;
      }
    }
  }
</style>
