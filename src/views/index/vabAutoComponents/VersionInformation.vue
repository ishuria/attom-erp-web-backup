<script setup lang="ts">
  import pkg from '~/package.json'
  const updateTime = import.meta.env.VITE_APP_UPDATE_TIME
  const { dependencies, devDependencies, version } = pkg
</script>

<template>
  <vab-card class="version-information" shadow="hover">
    <template #header>
      <vab-icon icon="information-line" />
      信息

      <el-tag class="card-header-tag">
        当前版本：V{{ version }} &nbsp; 部署时间:{{ updateTime }}
      </el-tag>
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
            <!--  <a
              href="https://vue-admin-beautiful.com/authorization"
              target="_blank"
            > -->
            <el-button type="primary">shop-vite ￥XXXX</el-button>
            <!--  </a> -->
            <a
              href="https://vue-admin-beautiful.com/admin-plus"
              target="_blank"
            >
              <el-button type="warning">admin-plus</el-button>
            </a>
          </td>
        </tr>
        <tr>
          <td>注意事项</td>
          <td colspan="3">
            vite-shop目前正交付第三方开发，售价未知，暂不对外出售，当前演示地址不代表最终品质，后续将逐步完善，我们有信心做国内最好的shop-vite商城模版，感谢您的耐心等待。
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
      color: var(--el-color-black);
      border-collapse: collapse;
      background-color: var(--el-color-white);

      td {
        position: relative;
        padding: 9px 15px !important;
        font-size: 14px;
        border: 1px solid #e6e6e6;

        i {
          color: var(--el-color-success);
          vertical-align: -3px;
          cursor: pointer;
        }

        &:nth-child(odd) {
          width: 20%;
          text-align: right;
          background-color: var(--el-color-white);
        }
      }
    }
  }
</style>
