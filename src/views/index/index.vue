<script setup lang="ts">
  import PageHeader from './components/PageHeader.vue'
  import PageBanner from './components/PageBanner.vue'
  import VersionInformation from './components/VersionInformation.vue'
</script>

<template>
  <div class="index-container">
    <el-row :gutter="20">
      <el-col :lg="18" :md="24" :sm="24" :xl="18" :xs="24">
        <page-header />
      </el-col>
      <el-col :lg="6" :md="24" :sm="24" :xl="6" :xs="24">
        <page-banner />
      </el-col>
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <version-information />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .index-container {
    padding: 0 !important;
    background: $base-color-background !important;

    :deep() {
      .page-header {
        margin-bottom: 20px;
      }

      .access,
      .authorization,
      .version-information {
        min-height: 268px;
        margin-bottom: 20px;
      }

      .el-card {
        .el-card__header {
          position: relative;

          .card-header-tag {
            position: absolute;
            top: 15px;
            right: $base-margin;
          }

          > div > span {
            display: flex;
            align-items: center;

            i {
              margin-right: 3px;
            }
          }
        }

        .el-card__body {
          position: relative;

          .echarts {
            width: 100%;
            height: 127px;
          }

          .card-footer-tag {
            position: absolute;
            right: $base-margin;
            bottom: 15px;
          }
        }
      }

      .bottom {
        padding-top: 20px;
        margin-top: 5px;
        color: #595959;
        text-align: left;
        border-top: 1px solid $base-border-color;
      }
    }
  }
</style>
