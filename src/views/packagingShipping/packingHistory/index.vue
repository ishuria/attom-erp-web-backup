<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
          </el-form-item>
          <el-form-item>
            <el-button :loading="listLoading" :icon="Search" type="primary" native-type="submit" @click="queryData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border stripe
      class="noneHoveTable"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="cellStyle"
      :data="list"
      @selection-change="setSelectRows"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="发货计划" prop="shipmentPlanDate" min-width="100"></el-table-column>
      <el-table-column label="装箱日期" prop="createTime" min-width="115">
        <template #default="{ row }">
          {{ formatDate(new Date(row.createTime)) }}
        </template>
      </el-table-column>
      <el-table-column label="装箱人员" prop="encasementUser" min-width="100"></el-table-column>
      <el-table-column label="箱数" prop="numberOfBoxes" min-width="90"></el-table-column>
      <el-table-column label="SHIPMENT ID" prop="shipmentId" :width="flexColumnWidth(list, 'SHIPMENT ID', 'shipmentId')"></el-table-column>
      <el-table-column label="毛重(kg)" prop="grossWeight" min-width="100"></el-table-column>
      <el-table-column label="长(cm)" prop="length" min-width="90"></el-table-column>
      <el-table-column label="宽(cm)" prop="width" min-width="90"></el-table-column>
      <el-table-column label="高(cm)" prop="height" min-width="90"></el-table-column>
      <el-table-column label="总重量(kg)" prop="totalWeight" min-width="110"></el-table-column>
      <el-table-column label="总体积(m3)" prop="totalVolume" min-width="110"></el-table-column>
      <el-table-column label="箱规号" prop="encasementNo" min-width="110"></el-table-column>
      <el-table-column label="站点" prop="planSiteName" min-width="130"></el-table-column>
      <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')"></el-table-column>
      <el-table-column label="Description" prop="description" :width="flexColumnWidth(list, 'Description', 'description')"></el-table-column>
      <el-table-column label="数量" prop="number" min-width="90"></el-table-column>
      <el-table-column label="产品总数" prop="productTotalNumber" min-width="100"></el-table-column>
      <el-table-column label="备注" prop="remarks" min-width="100" show-overflow-tooltip ></el-table-column>
      <el-table-column label="操作" fixed="right" width="180">
        <template #default="{ row }">
          <el-dropdown>
            <el-button text type="primary" @click="">
              下载模板文件
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
              <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="handleDownloadFile1(row)">下载模板文件</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="handleDownloadFile2(row)">下载装箱文件</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="handleDownloadFile3(row)">下载装箱表格</el-link>
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
import { Search, ArrowDown } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'
import { IGetShippedEncasementList } from '/@/type/packagingShipping/shippedType'
import { getShippedEncasementList } from '/@/api/devlocal/encasement'
import { downloadFile } from '/@/api/devlocal/download'
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
  await downloadFile('/shipment/download/file1', {
    encasementId: row.id
  }).then((res) => {
    console.log(res);
  }).catch((error) => {
    console.log(error);
  })
}
// 已装箱发货列表-下载装箱文件
const handleDownloadFile2 = async (row: IGetShippedEncasementList) => {
  await downloadFile('/shipment/download/file2', {
    encasementId: row.id
  }).then((res) => {
    console.log(res);
  }).catch((error) => {
    console.log(error);
  })
}
// 已装箱发货列表-下载装箱表格文件
const handleDownloadFile3 = async (row: IGetShippedEncasementList) => {
  await downloadFile('/shipment/download/file3', {
    encasementId: row.id
  }).then((res) => {
    console.log(res);
  }).catch((error) => {
    console.log(error);
  })
}
// 已装箱发货列表-walmart
const handleDownloadFile4 = async (row: IGetShippedEncasementList) => {
  await downloadFile('/shipment/download/walmart/file', {
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
