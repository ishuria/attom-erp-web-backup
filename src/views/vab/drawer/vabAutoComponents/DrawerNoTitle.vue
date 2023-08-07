<template>
  <el-button type="primary" @click="drawer = true">打开</el-button>

  <el-drawer v-model="drawer" title="我是标题" :with-header="false">
    <span>我是标题</span>
  </el-drawer>
</template>

<script lang="ts" setup>
const drawer = ref<boolean>(false)
</script>
