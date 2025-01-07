<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="美工图片" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form>
              <el-form-item label="站点">
                <el-select></el-select>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form :model="queryForm" inline @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @keyup.enter="queryData" @input="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="listLoading" :icon="Search" @click="queryData" ></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border stripe
          :header-cell-style="{ textAlign: 'center' }"
        >
          <el-table-column label="实际完成日期" prop="actualFinishDate" min-width="120"></el-table-column>
          <el-table-column label="人员" prop="userName" min-width="100"></el-table-column>
          <el-table-column label="SKU" prop="sku" min-width="200"></el-table-column>
          <el-table-column label="状态" prop="status" min-width="100"></el-table-column>
          <el-table-column label="任务ID" prop="taskId" min-width="100"></el-table-column>
          <el-table-column label="站点" prop="siteName" min-width="110"></el-table-column>
          <el-table-column label="提成模式" prop="mold" min-width="100"></el-table-column>
          <el-table-column label="设计任务" prop="designTask" min-width="100"></el-table-column>
          <el-table-column label="提前完成天数" prop="advanceDays" min-width="120"></el-table-column>
          <el-table-column label="要求完成日期" prop="dueDate" min-width="120"></el-table-column>
          <el-table-column label="提成天数" prop="commissionDay" min-width="100"></el-table-column>
          <el-table-column label="合作提成比例" prop="cooperationProportion" min-width="120"></el-table-column>
          <el-table-column label="单人提成比例" prop="singleProportion" min-width="120"></el-table-column>
          <el-table-column label="合作权重" prop="cooperationWeight" min-width="100"></el-table-column>
          <el-table-column label="合作加成" prop="cooperationBonus" min-width="100"></el-table-column>
          <el-table-column label="最低要求转化率" prop="lowRate" min-width="130"></el-table-column>
          <el-table-column label="操作" min-width="" fixed="right">
            <template #default="{ row }">
              <el-link type="primary" :underline="false" >修改</el-link>
              <el-link type="danger" :underline="false" >暂停</el-link>
              <el-link type="success" :underline="false" >继续</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"></el-empty>
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
      <el-tab-pane label="美工长期" :name="1">

      </el-tab-pane>
      <el-tab-pane label="产品开发设计" :name="2">

      </el-tab-pane>
      <el-tab-pane label="采购降本" :name="3">

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'

defineOptions({
  name: 'CommissionTask'
})
const activeName = ref<number>(0)
const listLoading = ref<boolean>(false)
const total = ref<number>(0)

const queryForm = reactive<any>({

})
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
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
          .el-form {
            .el-form-item:first-child {
              // margin: 0 !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
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
