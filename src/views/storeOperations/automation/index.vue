<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="广告库存规则" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline :model="queryForm">
              <el-form-item>
                <el-button type="primary" @click="">批量修改</el-button>
                <el-button type="primary" @click="">默认参数</el-button>
              </el-form-item>
              <el-form-item label="站点">
                <el-select v-model="queryForm.siteId" placeholder="请选择站点">
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="运营">
                <el-select v-model="queryForm.operationUserId" placeholder="请选择运营人员">
                  <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-style="{ textAlign: 'center' }"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
        >
          <el-table-column type="selection" width="38" />
          <el-table-column label="产品图片" />
          <el-table-column label="SKU" />
          <el-table-column label="站点" />
          <el-table-column label="运营" />
          <el-table-column label="规则开关" />
          <el-table-column label="操作对象" />
          <el-table-column label="开启广告（满足全部条件）">
            <el-table-column label="剩余可售天数" />
            <el-table-column label="可售库存数" />
            <el-table-column label="断货天数" />
            <el-table-column label="广告ACOS" />
          </el-table-column>
          <el-table-column label="关闭广告（满足任一条件）">
            <el-table-column label="断货天数" />
            <el-table-column label="剩余可售天数" />
            <el-table-column label="可售库存数" />
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-link type="primary" underline="never" @click="">系统操作日志</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
          </template>
        </el-table>
        <vab-pagination v-model:limit="queryForm.pageSize" v-model:page="queryForm.pageNo" :total="total" @pagination="fetchData" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'

defineOptions({
  name: 'Automation',
})

const activeName = ref(0)
const queryForm = reactive<any>({
  keyWord: '',
})
const listLoading = ref<boolean>(false)
const list = ref<any>([])
const siteList = ref<any>([])
const operateUserList = ref<any>([])
const total = ref<number>(0)
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const fetchData = () => {
  // fetchData()
}
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
          .left-panel {
            margin-bottom: 5px !important;
          }
          .right-panel {
            margin-bottom: 5px !important;
          }
        }

        .el-table {
          flex: 1;
          .el-table__body {
            .cell {
              max-height: 81.2px;
            }
          }
          .clear-padding {
            padding-top: 0px;
            padding-bottom: 0px;
          }
          .clear-padding .cell {
            padding-right: 0px;
            padding-left: 0px;
          }
        }
      }
      .el-checkbox {
        transform: scale(1.2); // 放大 20%
        transform-origin: center; // 确保放大从中心开始
      }
    }
  }
}
</style>
