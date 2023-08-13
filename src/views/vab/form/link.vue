<template>
  <div class="link-container no-background-container">
    <vab-card>
      <template #header>基础用法</template>
      <el-space wrap>
        <el-link href="https://element.eleme.io" target="_blank">默认链接</el-link>
        <el-link type="primary">主要链接</el-link>
        <el-link type="success">成功链接</el-link>
        <el-link type="warning">警告链接</el-link>
        <el-link type="danger">危险链接</el-link>
        <el-link type="info">信息链接</el-link>
      </el-space>
    </vab-card>
    <vab-card>
      <template #header>禁用状态</template>
      <el-space wrap>
        <el-link disabled>默认链接</el-link>
        <el-link disabled type="primary">主要链接</el-link>
        <el-link disabled type="success">成功链接</el-link>
        <el-link disabled type="warning">警告链接</el-link>
        <el-link disabled type="danger">危险链接</el-link>
        <el-link disabled type="info">信息链接</el-link>
      </el-space>
    </vab-card>
    <vab-card>
      <template #header>下划线</template>
      <el-space wrap>
        <el-link :underline="false">无下划线</el-link>
        <el-link>有下划线</el-link>
      </el-space>
    </vab-card>
    <vab-card>
      <template #header>图标</template>
      <el-space wrap>
        <el-link :icon="Edit">编辑</el-link>
      </el-space>
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
import { Edit } from '@element-plus/icons-vue'

defineOptions({
  name: 'Link',
})
</script>
