<script setup lang="ts">
  defineProps<{ avatarList: { username: string; avatar: string }[] }>()
</script>

<template>
  <div class="vab-avatar-list">
    <el-tooltip
      v-for="(item, index) in avatarList"
      :key="index"
      :content="item.username"
      effect="dark"
      placement="top-start"
    >
      <el-avatar :size="40" :src="item.avatar" />
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
  .vab-avatar-list {
    :deep() {
      .el-avatar {
        display: inline-block;
        margin-left: -15px;
        cursor: pointer;
        border: 3px solid var(--el-color-white);
      }
    }
  }
</style>
