<script setup lang="ts">
  import pkg from '~/package.json'
  const updateTime = import.meta.env.VITE_APP_UPDATE_TIME
  const { dependencies, devDependencies } = pkg
</script>

<template>
  <vab-card class="version-information" shadow="hover">
    <template #header>
      <vab-icon icon="information-line" />
      信息
      <el-tag class="card-header-tag">部署时间:{{ updateTime }}</el-tag>
    </template>
    <el-scrollbar>
      <table class="table">
        <tr>
          <td>vue</td>
          <td>
            {{ dependencies['vue'] }}
            <el-popover
              content="已升级至最新版本"
              placement="top-start"
              trigger="hover"
              :width="200"
            >
              <template #reference>
                <vab-icon icon="arrow-up-line" />
              </template>
            </el-popover>
          </td>
          <td>vite</td>
          <td>{{ devDependencies['vite'] }}</td>
        </tr>
        <tr>
          <td>pinia</td>
          <td>{{ dependencies['pinia'] }}</td>
          <td>vue-router</td>
          <td>{{ dependencies['vue-router'] }}</td>
        </tr>
        <tr>
          <td>vue-i18n</td>
          <td>{{ dependencies['vue-i18n'] }}</td>
          <td>element-plus</td>
          <td>
            {{ dependencies['element-plus'] }}
            <el-popover
              content="已升级至最新版本"
              placement="top-start"
              trigger="hover"
              :width="200"
            >
              <template #reference>
                <vab-icon icon="arrow-up-line" />
              </template>
            </el-popover>
          </td>
        </tr>
        <tr>
          <td>授权渠道</td>
          <td colspan="3">
            <a
              href="https://vue-admin-beautiful.com/authorization"
              target="_blank"
            >
              <el-button type="primary">shop-vite ￥599</el-button>
            </a>
            <a
              href="https://vue-admin-beautiful.com/admin-plus"
              target="_blank"
            >
              <el-button type="primary">admin-plus ￥799</el-button>
            </a>
            <a
              href="https://github.com/chuzhixin/vue-admin-beautiful/"
              target="_blank"
            >
              <el-button type="warning">开源免费版</el-button>
            </a>
          </td>
        </tr>
        <tr>
          <td>注意事项</td>
          <td colspan="3">
            shop-vite目前仅对已购买admin-plus的用户开放购买渠道，未购买admin-plus系列产品的用户请勿下单，后期具体开放时间待定。
          </td>
        </tr>
      </table>
    </el-scrollbar>
  </vab-card>
</template>

<style lang="scss" scoped>
  .version-information {
    .table {
      width: 100%;
      color: #666;
      border-collapse: collapse;
      background-color: #fff;

      td {
        position: relative;
        padding: 9px 15px !important;
        overflow: hidden;
        font-size: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
        border: 1px solid #e6e6e6;

        i {
          color: var(--el-color-success);
          vertical-align: -3px;
          cursor: pointer;
        }

        &:nth-child(odd) {
          width: 20%;
          text-align: right;
          background-color: #f7f7f7;
        }
      }
    }
  }
</style>
