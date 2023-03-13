<script setup lang="ts"></script>

<template>
  <vab-card class="pending" shadow="hover">
    <template #header>
      <vab-icon icon="information-line" />
      待处理
      <el-badge class="item" :value="12">
        <el-button>comments</el-button>
      </el-badge>
    </template>
  </vab-card>
</template>

<style lang="scss" scoped>
  .pending {
  }
</style>
