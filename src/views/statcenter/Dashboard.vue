<!--
 * @Author: 淋雨的小丸子 chu1204505056@126.com
 * @Date: 2022-10-24 12:52:31
 * @LastEditors: 淋雨的小丸子 chu1204505056@126.com
 * @LastEditTime: 2023-06-10 03:19:12
 * @FilePath: \shop-vite\src\views\statcenter\Dashboard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup></script>

<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <!-- 实时支付金额 -->
        <payment />
      </el-col>
      <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <!-- 支付概况 -->
      </el-col>
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <!-- Top5商品金额 -->
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <!-- 流量概况 -->
        <flow />
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <!-- 经营报表 -->
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .dashboard-container {
    padding: 0 !important;
    background: var(--el-background-color) !important;
    border: 0 !important;
    :deep() {
      .payment {
        height: 400px;
      }
      .el-card__header {
        padding-top: 25px;
        padding-bottom: 0;
        font-size: 16px;
        font-weight: bolder;
        border-bottom: 0;
      }
      .el-card__body {
        padding-bottom: 25px;
        .line-one {
          display: inline-flex;
          align-items: center;
          font-size: 32px;
          font-weight: 700;
          line-height: 42px;
        }
        .extra-text {
          margin: 10px 0 10px 0;
        }
      }
    }
  }
</style>
