<script lang="ts" setup>
  import { CircleCloseFilled } from '@element-plus/icons-vue'

  const visible = ref<boolean>(false)
</script>

<template>
  <el-button type="primary" @click="visible = true">自定义头部抽屉</el-button>
  <el-drawer v-model="visible" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">这是个自定义头部抽屉</h4>
      <el-button :icon="CircleCloseFilled" type="danger" @click="close">
        关闭
      </el-button>
    </template>
    这是抽屉内容
  </el-drawer>
</template>
