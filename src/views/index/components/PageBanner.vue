<script lang="ts" setup></script>

<template>
  <div class="page-banner">
    <el-carousel height="145px">
      <el-carousel-item />
    </el-carousel>
  </div>
</template>

<style lang="scss" scoped>
  .page-banner {
    :deep() {
      .el-carousel {
        border-radius: var(--el-border-radius-base);
        &__item {
          background: linear-gradient(
            to right,
            var(--el-color-primary-light-1),
            var(--el-color-primary)
          );
        }
      }
    }
  }
</style>
