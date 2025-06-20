<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" :lazy="true" type="border-card" >
      <el-tab-pane label="供应商" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel :span="4">
            <el-date-picker v-model="date" type="daterange" />
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="20">
            <el-form :model="queryForm" inline @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keydown.enter="queryData" @input="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" type="primary" :loading="listLoading" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table border stripe>
          <el-table-column prop="name" label="供应商" />
          <el-table-column prop="amount" label="总采购金额" />
          <el-table-column prop="date" label="操作" />
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination 
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="产品" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel :span="4">
            <el-date-picker v-model="date" type="daterange" />
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="20">
            <el-form :model="queryForm" inline @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keydown.enter="queryData" @input="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" type="primary" :loading="listLoading" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table border stripe>
          <el-table-column prop="name" label="SKU图片" />
          <el-table-column prop="count" label="SKU" />
          <el-table-column prop="amount" label="产品经理" />
          <el-table-column prop="amount" label="零件图片" />
          <el-table-column prop="amount" label="零件ID" />
          <el-table-column prop="amount" label="零件名" />
          <el-table-column prop="amount" label="供应商" />
          <el-table-column prop="amount" label="采购总额" />
          <el-table-column prop="amount" label="采购总数" />
          <el-table-column prop="amount" label="单位" />
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination 
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { TabPaneProps } from 'element-plus'
import { getThisYearStringTime } from '/@/utils/dateUtils'

defineOptions({
  name: 'ProcurementStatistics',
})

const date = ref<[string, string]>(getThisYearStringTime())
const listLoading = ref<boolean>(false)
const activeName = ref<number>(0)
const queryForm = reactive<any>({

})
const total = ref<number>(0)
const handleCurrentChange = (val: number) => {
  queryForm.pageNo = val
  // fetchData()
}
const handleSizeChange = (val: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = val
  // fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const handleTabClick = (tab: TabPaneProps) => {
  activeName.value = Number(tab.name)
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
          .el-form {
            .el-form-item:first-child {
              margin-bottom: 5px !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
            .el-form-item:last-child {
              margin-bottom: 5px !important;
            }
          }
        }

        .el-table {
          flex: 1;
          .clear-padding {
            padding-top: 0px !important;
            padding-bottom: 0px !important;
            .cell {
              padding-right: 0px !important;
              padding-left: 0px !important;
            }
          }
        }
      }
    }
  }
}
</style>