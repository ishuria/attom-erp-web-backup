<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="已分配" :name="0">
        
      </el-tab-pane>
      <el-tab-pane label="未分配" :name="1"></el-tab-pane>
      <el-tab-pane label="已完成" :name="2"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'ImageTask'
})
const activeName = ref<number>(0)
</script>

<style lang="scss" scoped>
.tabs-table-container {
  :deep() {
    .el-tabs {
      border-radius: var(--el-border-radius-base);

      &__header {
        border-top-left-radius: var(--el-border-radius-base);
        border-top-right-radius: var(--el-border-radius-base);
      }

      &__nav-wrap {
        border-radius: var(--el-border-radius-base);
      }

      .el-tab-pane {
        display: flex;
        flex-direction: column;
        height: calc(var(--el-container-height) - var(--el-padding) - 52px) !important;

        .vab-query-form {
          // .left-panel { //自加
          //   margin-bottom: 15px !important;
          // }
          .el-form {
            .el-form-item:first-child {
              margin: 0 !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
            // .el-form-item:last-child { //自加
            //   margin: 0 !important;
            // }
          }
        }

        .el-table {
          flex: 1;
        }
      }
    }
  }
}
</style>
