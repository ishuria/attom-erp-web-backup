<script lang="ts" setup>
  import pkg from '~/package.json'

  const updateTime = import.meta.env.VITE_APP_UPDATE_TIME
  const { dependencies, devDependencies, version } = pkg
</script>

<template>
  <vab-card class="version-information" shadow="never">
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
          <td>
            vite
            <span>{{ devDependencies['vite'] }}</span>
          </td>
          <td></td>
          <td>
            vue
            <span>
              <span>{{ dependencies['vue'] }}</span>
            </span>
          </td>
          <td></td>
          <td>
            pinia
            <span>{{ dependencies['pinia'] }}</span>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            element-plus
            <span>{{ dependencies['element-plus'] }}</span>
          </td>
          <td></td>
          <td>
            @vueuse/core
            <span>{{ dependencies['@vueuse/core'] }}</span>
          </td>
          <td></td>
          <td>
            axios
            <span>{{ dependencies['axios'] }}</span>
          </td>
          <td></td>
        </tr>
      </table>
      <div class="version-information-rely">
        <a
          href="https://vue-admin-beautiful.com/authorization/shop-vite.html"
          target="_blank"
        >
          <el-button type="primary">
            <vab-icon icon="vip-diamond-line" />
            Vue Shop Vite ￥1399
          </el-button>
        </a>
        <a href="https://vue-admin-beautiful.com/admin-plus" target="_blank">
          <el-button type="warning">
            <vab-icon icon="vip-diamond-line" />
            admin-plus ￥799
          </el-button>
        </a>
      </div>
    </el-scrollbar>
  </vab-card>
</template>

<style lang="scss" scoped>
  .version-information {
    &-rely {
      min-width: 500px;
      height: 50px;
      padding-left: 10px;
      margin-top: 10px;
      line-height: 50px;
      text-align: left;
      border-radius: var(--el-border-radius-base);
    }

    .table {
      width: 100%;
      color: var(--el-color-black);
      border-collapse: collapse;
      background-color: var(--el-color-white);

      td {
        position: relative;
        padding: 11.5px 15px !important;
        overflow: hidden;
        font-size: var(--el-font-size-default);
        text-overflow: ellipsis;
        white-space: nowrap;
        border: 0;

        i {
          color: var(--el-color-success);
          vertical-align: -3px;
          cursor: pointer;
        }

        &:nth-child(odd) {
          width: 40%;
          font-weight: bold;
          color: var(--el-color-grey);
          background-color: var(--el-color-white);

          span {
            margin-left: 10px;
            font-weight: normal;
          }
        }
      }
    }
  }
</style>
