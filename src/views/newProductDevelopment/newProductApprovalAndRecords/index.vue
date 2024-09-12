<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <h3>
        新品审核与记录
      </h3>
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.productKeyWord" @keyup.enter.native="queryData" clearable
              placeholder="请输入搜索关键词" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
              @click="queryData"></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table ref="tableRef" :header-cell-style="{ 'text-align': 'center' }" border stripe :data="dataList"
      @cell-click="reviewTableInputChage" :span-method="objectSpanMethod">
      <el-table-column label="提交日期" prop="createTime" align="center" width="110">
        <template #default="{ row }">
          <span>{{ formatDate(new Date(row.createTime)) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="SKU图片" width="100">
        <template #default="{ row }">
          <el-image style="width: 75px; height: 75px" :src="row.skuImage" fit="fill" />
        </template>
      </el-table-column>
      <el-table-column label="SKU" width="300" prop="sku">
        <template #default="{ row }">
          {{ formattedProgressLog(row.sku) }}
        </template>
      </el-table-column>
      <el-table-column label="产品" width="200" prop="productName">
        <template #default="{ row }">
          {{ formattedProgressLog(row.productName) }}
        </template>
      </el-table-column>
      <el-table-column label="首单PO" min-width="90" prop="po" align="center">
        <template #default="{ row }">
          {{ row.po }}
        </template>
      </el-table-column>
      <el-table-column label="首单实际成本" width="130" prop="firstRealCost" align="center">
        <template #default="{ row }">
          {{ row.firstRealCost }}
        </template>
      </el-table-column>
      <el-table-column label="审批成本" min-width="100" prop="totalCost" align="center">
        <template #default="{ row }">
          {{ row.totalCost }}
        </template>
      </el-table-column>
      <el-table-column label="相差" min-width="70" prop="difference" align="center">
        <template #default="{ row }">
          {{ row.difference }}
        </template>
      </el-table-column>
      <el-table-column label="OEM" prop="oem" align="center" width="70">
        <template #default="{ row }">
          <el-checkbox :disabled="true" v-model="row.oem" :true-value="1" :false-value="0" size="large"
            class="custom-checkbox" />
        </template>
      </el-table-column>
      <el-table-column label="产品经理" align="center" min-width="100" prop="productManager">
        <template #default="{ row }">
          <div v-html="row.productManager"></div>
        </template>
      </el-table-column>
      <el-table-column label="产品设计" align="center" min-width="100" prop="productDesign">
        <template #default="{ row }">
          {{ row.productDesign }}
        </template>
      </el-table-column>
      <el-table-column label="立项日期" prop="projectInitiationDate" align="center" width="110">
        <template #default="{ row }">
          <span>{{ formatDate(new Date(row.projectInitiationDate)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批日期" prop="reviewDate" align="center" width="100">
        <template #default="{ row }">
          <span> {{ row.reviewDate != null ? formatDate(new Date(row.reviewDate)) : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="耗时" min-width="100" prop="timeConsuming" align="center">
        <template #default="{ row }">
          {{ row.timeConsuming }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="审批状态" min-width="140" prop="reviewStatus">
        <template #default="{ row }">
          <span :class="generateStatus(row.reviewStatus).color">
            {{ generateStatus(row.reviewStatus).text }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="审批人" align="center" min-width="100" prop="reviewPersonName">
        <template #default="{ row }">
          {{ row.reviewPersonName }}
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" label="操作" :width="!foldOperation ? 215 : 120">
        <template #default="{ row }">
          <el-dropdown>
            <el-button text type="primary" @click="handleOrderProcess(row)">
              {{ (row.reviewStatus === 0 || row.reviewStatus === 2) ? '编辑' : '查看' }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="row.reviewStatus === 1">
                  <el-link type="primary" :underline="false" @click="handleOrderReview(row)">审批和PO发布</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false">分数明细</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <vab-pagination :current-page="queryForm.pageNo" :page-size="queryForm.pageSize" :total="total"
      @current-change="handleCurrentChange" @size-change="handleSizeChange" />
    <!-- <default-table-edit ref="editRef" @fetch-data="fetchData" /> -->
    <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if="imagePreviewVisible" />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Delete, Plus, Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { doDelete, getList } from '/@/api/table'
import { useRoutesStore } from '/@/store/modules/routes'
import { useSettingsStore } from '/@/store/modules/settings'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleMatched, handleTabs } from '/@/utils/routes'
import { getDataAttribute, getSpecificChildren } from '~/src/utils/nodeUtils'
import { IReviewQueryReq, IReviewQueryResp } from '/@/type/review/review'
import { getReviewList } from '/@/api/devlocal/orderingReview'
import { formatDate } from '/@/utils/dateUtils'

defineOptions({
  name: 'DefaultTable',
})


interface SpanMethodProps {
  row: IReviewQueryResp
  column: TableColumnCtx<IReviewQueryResp>
  rowIndex: number
  columnIndex: number
}


const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta, addVisitedRoute } = tabsStore
const editRef = ref<any>(null)
const tableRef = ref<TableInstance>()
const list = ref<any>([])
const listLoading = ref<boolean>(true)
const total = ref<number>(0)
const selectRows = ref<any>([])
const queryForm = reactive<IReviewQueryReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const foldOperation = ref<boolean>(false)
const settingsStore = useSettingsStore()

const dataList = ref<IReviewQueryResp[]>()
const formattedProgressLog = (str: string) => {
  return str
    .replace(/([\u4e00-\u9fa5]) ([a-zA-Z])/g, '$1<br>$2')
    .replace(/([a-zA-Z]) ([\u4e00-\u9fa5])/g, '$1<br>$2');
};
// table单击修改
const reviewTableInputChage = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  // 处理图片放大预览
  let el = getSpecificChildren(cell, "img")[0];
  if (getDataAttribute(el, 'img') && getSpecificChildren(cell, "img")[0]) {
    updateUploadPriviewVisible()
    setPreviewList(row.SKUimg)
  }
}


// 审批状态对应的文本和颜色
const generateStatus = (value: number) => {
  switch (value) {
    case 0:
      return { text: "编辑中", color: "status-editing" };
    case 1:
      return { text: "待审核", color: "status-editing" };
    case 2:
      return { text: "主管审批未通过", color: "status-failed" };
    case 3:
      return { text: "SKU创建", color: "status-editing" };
    case 4:
      return { text: "运营分货", color: "status-editing" };
    case 5:
      return { text: "待发布PO", color: "status-editing" };
    case 6:
      return { text: "已完成", color: "status-finished" };
    default:
      return { text: "未知", color: "status-editing" };
  }
}

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getReviewList(queryForm)
  dataList.value = data.list
  total.value = data.total
  listLoading.value = false
}

const handleOrderReview = (row: IReviewQueryResp) => {
  // console.log(row);
  router.push({
    path: '/newProductDevelopment/orderingReview',
    query: {
      reviewId: row.reviewMainId,
      reviewStatus: row.reviewStatus,
      reviewStepNo: row.reviewStepNo,
      timestamp: Date.now(),
    },
  })


}

const handleOrderProcess = (row: IReviewQueryResp) => {
  router.push({
    path: '/newProductDevelopment/orderingProcess',
    query: {
      timestamp: Date.now(),
    },
  })
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}

const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}

const setSelectRows = (value: string) => {
  selectRows.value = value
}
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 预览图片列表
const imagePriviewList = ref<string[]>([])
// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false;
}
// 控制图片是否预览
const updateUploadPriviewVisible = () => {
  imagePreviewVisible.value = true
}
// 修改图片预览列表
const setPreviewList = (imageUrl: string) => {
  imagePriviewList.value = []
  imagePriviewList.value.push(imageUrl)
}

// 列表col合并方法
const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: SpanMethodProps) => {
  // 设置需要合并的列
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 9 || columnIndex === 10
    || columnIndex === 11 || columnIndex === 12 || columnIndex === 13 || columnIndex === 14
    || columnIndex === 15 || columnIndex === 16

  ) {
    // 获取当前row的id
    const reviewMainId = row.reviewMainId;
    // 默认不跨行
    let rowspan = 1;
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < dataList.value.length; i++) {
      // 如果id一样需要合并
      if (dataList.value[i].reviewMainId === reviewMainId) {
        rowspan++;
      } else {
        break;
      }
    }

    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || dataList.value[rowIndex - 1].reviewMainId !== reviewMainId) {
      return { rowspan, colspan: 1 };
    } else {
      return { rowspan: 0, colspan: 0 };
    }
  }
}

onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  fetchData()
})

</script>

<style lang="scss" scoped>
// 选中且不被禁用的样式
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #4A62E7;
  border-color: #4A62E7;
}

// 选中且被禁用的样式
::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background: rgb(10, 108, 245);
  border-color: rgb(10, 108, 245);
}

// 选中后中间的 “✔” 的样式
::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #fff;
}



.status-editing {
  color: orange;
}

.status-failed {
  color: red;
}

.status-success {
  color: black;
}

.status-finished {
  color: green;
}

.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}

// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.5px;
}
</style>