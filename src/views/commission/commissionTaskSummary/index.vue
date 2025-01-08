<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="美工图片" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form>
              <el-form-item label="站点">
                <el-select v-model="queryForm.site" @change="queryData">
                  <el-option v-for="item in siteList" :label="item.label" :value="item.id" :key="item.id" />
                </el-select>
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
          :header-cell-style="{ textAlign: 'center' }" :cell-style="cellStyle"
          :data="list"
        >
          <el-table-column label="实际完成日期" prop="actualFinishDate" min-width="120">
            <template #default="{ row }">
              {{ row.actualFinishDate ? formatDate(new Date(row.actualFinishDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="人员" prop="userName" :width="flexColumnWidth(list, '人员', 'userName')"></el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')"></el-table-column>
          <el-table-column label="状态" prop="status" min-width="100">
            <template #default="{ row }">
              <el-tag v-if="row.status === '未上架'" type="info" >{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '进行中'" type="success" >{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '已结束'" type="danger" >{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="任务ID" prop="taskId" min-width="100"></el-table-column>
          <el-table-column label="站点" prop="siteName" min-width="120"></el-table-column>
          <el-table-column label="提成模式" prop="mold" min-width="100"></el-table-column>
          <el-table-column label="设计任务" prop="designTask" min-width="110"></el-table-column>
          <el-table-column label="提前完成天数" prop="advanceDays" min-width="120">
            <template #default="{ row }">
              <el-text v-if="row.advanceDays >= 0" type="success">{{ row.advanceDays }}</el-text>
              <el-text v-if="row.advanceDays < 0" type="danger">{{ row.advanceDays }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="要求完成日期" prop="dueDate" min-width="120">
            <template #default="{ row }">
              {{ row.dueDate ? formatDate(new Date(row.dueDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="提成天数" prop="commissionDay" min-width="100"></el-table-column>
          <el-table-column label="合作提成比例" prop="cooperationProportion" min-width="120">
            <template #default="{ row }">
              {{ row.cooperationProportion ? (row.cooperationProportion * 100).toFixed(2) + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="单人提成比例" prop="singleProportion" min-width="120">
            <template #default="{ row }">
              {{ row.singleProportion ? (row.singleProportion * 100).toFixed(2) + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="合作权重" prop="cooperationWeight" min-width="100"></el-table-column>
          <el-table-column label="合作加成" prop="cooperationBonus" min-width="100"></el-table-column>
          <el-table-column label="最低要求转化率" prop="lowRate" min-width="130">
            <template #default="{ row }">
              {{ row.lowRate ? (row.lowRate * 100).toFixed(2) + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
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
import { getCommissionTaskPictureList } from '/@/api/devlocal/commission'
import { getSeasonalCoefficientSiteList } from '/@/api/devlocal/seasonalCoefficient'
import { IGetCommissionTaskPictureList, IGetCommissionTaskPictureListReq } from '/@/type/commission/commissionType'
import { formatDate } from '/@/utils/dateUtils'
import { flexColumnWidth } from '/@/utils/tableColum'
import { CSSProperties } from 'vue'

defineOptions({
  name: 'CommissionTask'
})
const list = ref<IGetCommissionTaskPictureList[]>([])
const activeName = ref<number>(0)
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const siteList = ref<{ id: number, label: string }[]>([])
const queryForm = reactive<any>({
  site: -1,
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const fetchSiteList = async () => {
  const { data } = await getSeasonalCoefficientSiteList()
  siteList.value = data
  siteList.value.unshift({ id: -1, label: '全部' })
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getCommissionTaskPictureList(queryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  if (data.columnIndex !== 2) {
    return {
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'center'
  }
}
onBeforeMount(() => {
  fetchSiteList()
  fetchData()
})
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
