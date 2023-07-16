<script lang="ts" setup>
  defineOptions({
    name: 'CustomSvg',
  })
</script>

<template>
  <div class="custom-svg-container">
    <el-row :gutter="20">
      <el-col :lg="2" :md="3" :sm="8" :xl="2" :xs="6">
        <vab-card>
          <vab-icon icon="vab" is-custom-svg />
        </vab-card>
      </el-col>
      <el-col :lg="2" :md="3" :sm="8" :xl="2" :xs="6">
        <vab-card>
          <vab-icon icon="mall-fill" is-custom-svg />
        </vab-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .custom-svg-container {
    :deep() {
      .el-card__body {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60px;
        max-height: 60px;
        padding: calc(var(--el-padding) / 1.4);
        cursor: pointer;

        i {
          font-size: 28px;
          color: var(--el-color-grey);
          text-align: center;
          pointer-events: none;
          cursor: pointer;
          transition: var(--el-transition);
        }
      }
    }
  }
</style>
