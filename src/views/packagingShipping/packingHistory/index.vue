<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border :cell-style="cellStyle"
      class="noneHoveTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
      @selection-change="setSelectRows"
    >
      <el-table-column type="selection"/>
      <el-table-column label="发货计划" min-width="120" prop="shipmentPlanDate">
        <template #default="{ row }">
          {{ row.shipmentPlanDate ? row.shipmentPlanDate.split(' ')[0] : '' }}
        </template>
      </el-table-column>
      <el-table-column label="装箱日期" min-width="115" prop="createTime">
        <template #default="{ row }">
          {{ formatDate(new Date(row.createTime)) }}
        </template>
      </el-table-column>
      <el-table-column label="装箱人员" prop="encasementUser" :width="flexColumnWidth(list, '装箱人员', 'encasementUser')"/>
      <el-table-column label="箱数" min-width="90" prop="numberOfBoxes"/>
      <el-table-column label="SHIPMENT ID" prop="shipmentId" :width="flexColumnWidth(list, 'SHIPMENT ID', 'shipmentId')"/>
      <el-table-column label="毛重(kg)" min-width="100" prop="grossWeight"/>
      <el-table-column label="长(cm)" min-width="90" prop="length"/>
      <el-table-column label="宽(cm)" min-width="90" prop="width"/>
      <el-table-column label="高(cm)" min-width="90" prop="height"/>
      <el-table-column label="总重量(kg)" min-width="110" prop="totalWeight"/>
      <el-table-column label="总体积(m3)" min-width="110" prop="totalVolume"/>
      <el-table-column label="箱规号" min-width="110" prop="encasementNo"/>
      <el-table-column label="站点" min-width="130" prop="planSiteName"/>
      <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')"/>
      <el-table-column label="Description" prop="description" :width="flexColumnWidth(list, 'Description', 'description')"/>
      <el-table-column label="数量" min-width="90" prop="number"/>
      <el-table-column label="产品总数" min-width="100" prop="productTotalNumber"/>
      <el-table-column label="备注" min-width="100" prop="remarks" >
        <template #default="{ row }">
          <el-tooltip content="" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip" >{{ row.remarks }}</div>
            </template>
            <el-text style="vertical-align: middle;" truncated>{{ row.remarks }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template #default="{ row }">
          <el-dropdown>
            <el-button text type="primary">
              下载模板文件
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
              <el-dropdown-item @click="handleDownloadFile1(row)">
                  <el-link type="primary" :underline="false" >下载模板文件</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="handleDownloadFile2(row)">
                  <el-link type="primary" :underline="false" >下载装箱文件</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="handleDownloadFile3(row)">
                  <el-link type="primary" :underline="false" >下载装箱表格</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-link style="display: none" type="primary" :underline="false" @click="handleDownloadFile4(row)">下载沃尔玛文件</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import type { CSSProperties } from 'vue'
import type { IGetShippedEncasementList } from '/@/type/packagingShipping/shippedType'
import { getShippedEncasementList } from '/@/api/devlocal/encasement'
import { downloadFileP } from '/@/api/devlocal/download'
import { formatDate } from '/@/utils/dateUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

const listLoading = ref<boolean>(false)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const list = ref<IGetShippedEncasementList[]>([])
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const selectRows = ref<any>([])
const setSelectRows = (value: any) => {
  selectRows.value = value
}

// 下载模板文件
const handleDownloadFile1 = async (row: IGetShippedEncasementList) => {
  await downloadFileP('/shipment/download/file1', {
    encasementId: row.id
  }).then((res) => {
    console.log(res);
  }).catch((error) => {
    console.log(error);
  })
}
// 已装箱发货列表-下载装箱文件
const handleDownloadFile2 = async (row: IGetShippedEncasementList) => {
  await downloadFileP('/shipment/download/file2', {
    encasementId: row.id
  }).then((res) => {
    console.log(res);
  }).catch((error) => {
    console.log(error);
  })
}
// 已装箱发货列表-下载装箱表格文件
const handleDownloadFile3 = async (row: IGetShippedEncasementList) => {
  await downloadFileP('/shipment/download/file3', {
    encasementId: row.id
  }).then((res) => {
    console.log(res);
  }).catch((error) => {
    console.log(error);
  })
}
// 已装箱发货列表-walmart
const handleDownloadFile4 = async (row: IGetShippedEncasementList) => {
  await downloadFileP('/shipment/download/walmart/file', {
    encasementId: row.id
  }).then((res) => {
    console.log(res);
  }).catch((error) => {
    console.log(error);
  })
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex !== 5 && data.columnIndex !== 12 && data.columnIndex !== 13 && data.columnIndex !== 14 && data.columnIndex !== 15) {
    return {
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'left'
  }
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getShippedEncasementList(queryForm)
  total.value = data?.total!
  list.value = data?.list!
  listLoading.value = false
}
onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.el-table :deep(.el-checkbox) {
  transform: scale(1.3);
  transform-origin: center;
}
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
</style>
