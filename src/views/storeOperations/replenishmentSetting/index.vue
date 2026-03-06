<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-space>
          <span>站点</span>
          <el-select v-model="site" placeholder="请选择站点" @change="handleChangeSite">
            <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
          <el-button type="primary" @click="handleUpdate">批量修改</el-button>
          <el-popover placement="bottom-start" trigger="click" :width="300">
            <template #reference>
              <el-button :icon="Filter" :type="hasFilter ? 'warning' : 'default'">筛选</el-button>
            </template>
            <el-form label-position="top" label-width="120px" :model="filterForm">
              <el-form-item label="30个可售日销量">
                <el-input-number v-model="filterForm.available30SalesMin" :min="0" placeholder="最小值" style="width: 100%" />
                <div style="margin: 8px 0; text-align: center">至</div>
                <el-input-number v-model="filterForm.available30SalesMax" :min="0" placeholder="最大值" style="width: 100%" />
              </el-form-item>
              <el-form-item label="半年有货率(%)">
                <el-input-number v-model="filterForm.availableRateMin" :max="100" :min="0" placeholder="最小值" style="width: 100%" />
                <div style="margin: 8px 0; text-align: center">至</div>
                <el-input-number v-model="filterForm.availableRateMax" :max="100" :min="0" placeholder="最大值" style="width: 100%" />
              </el-form-item>
              <el-form-item>
                <el-button style="width: 100%" type="primary" @click="handleFilter">确定</el-button>
              </el-form-item>
              <el-form-item>
                <el-button style="width: 100%" @click="handleResetFilter">重置</el-button>
              </el-form-item>
            </el-form>
          </el-popover>
        </el-space>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keydown.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      ref="tableRef"
      v-loading="listLoading"
      border
      :cell-class-name="clearPadding"
      class="noneHoveTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
      @cell-click="cellClick"
      @selection-change="setSelectRows"
      @sort-change="handleSortChange"
    >
      <el-table-column align="center" fixed type="selection" width="45" />
      <el-table-column align="center" label="图片" prop="skuUrl" width="75">
        <template #default="{ row }">
          <el-image fit="fill" :src="row.skuUrl" style="display: block; width: 75px; height: 75px" @click="showPreviewImage(row.skuUrl)">
            <template #error>
              <el-icon />
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" min-width="200" prop="sku" :width="calculateBrColumnWidth(list, (row: any) => row._sku)">
        <template #default="{ row }">
          <span v-html="row._sku"></span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品分类" min-width="200" prop="type1" />
      <el-table-column align="center" label="维持库存天数" min-width="120" prop="stockPileNumberDays" sortable="custom" />
      <el-table-column align="center" label="最小维持库存数量" min-width="140" prop="minStockPilNumber" sortable="custom" />
      <el-table-column align="center" label="交期安全天数" min-width="120" prop="safetyLeadTime" sortable="custom" />
      <el-table-column align="center" label="平均交期(近10次)" min-width="140" prop="avgLead" sortable="custom" />
      <el-table-column align="center" label="交期平均波动" min-width="120" prop="avgLeadFluctuation" sortable="custom" />
      <el-table-column align="center" label="30个可售日销量" min-width="130" prop="available30Sales" sortable="custom" />
      <el-table-column align="center" label="半年有货率" min-width="110" prop="availableRate" sortable="custom">
        <template #default="{ row }">{{ row.availableRate }}%</template>
      </el-table-column>
      <el-table-column align="left" label="备注" min-width="110" prop="remark" />
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
    <!-- 批量修改 -->
    <vab-dialog
      v-model="updateVisible"
      :before-close="handlerCloseDialog"
      class="moldDialog"
      :close-on-click-modal="false"
      title="批量修改"
      width="500"
    >
      <el-divider style="margin-top: 0" />
      <el-form class="demo-form" label-position="right" label-width="auto" :model="form" style="max-width: 340px; margin: 0 auto">
        <el-form-item label="产品分类" prop="kindId">
          <el-select v-model="form.kindId" clearable filterable placeholder="请选择产品类别">
            <el-option v-for="item in merchandiseTypeList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="维持库存天数" prop="stockPileNumberDays">
          <el-input v-model.number="form.stockPileNumberDays" clearable />
        </el-form-item>
        <el-form-item label="最小维持库存数量" prop="minStockPilNumber">
          <el-input v-model.number="form.minStockPilNumber" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="updateVisible = false">退出</el-button>
        <el-button type="primary" @click="handleSubmit">完成</el-button>
      </template>
    </vab-dialog>
    <vab-remark-dialog v-model="remarkVisible" :remark="remark" title="修改备注" @update:remark="handleUpdateRemark" />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script lang="ts" setup>
import { Filter, Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { getProductReplenList, updateProductReplenParams, updateReplenRemark } from '/@/api/devlocal/productInformation'
import { getSeasonalCoefficientSite, getSeasonalCoefficientSiteList } from '/@/api/devlocal/seasonalCoefficient'
import { calculateBrColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'ReplenishmentSetting',
})

let _row: any
const remarkVisible = ref<boolean>(false)
const remark = ref<string>('')
const handleUpdateRemark = async (val: string) => {
  const { data } = await updateReplenRemark({ id: _row.id, remark: val })
  if (data) {
    _row.remark = val
    remarkVisible.value = false
    $baseMessage('修改备注成功！', 'success')
  } else {
    $baseMessage('修改备注失败！', 'error')
  }
}

// 点击备注单元格
const cellClick = (row: any, column: any) => {
  if (column.property === 'remark') {
    remarkVisible.value = true
    remark.value = row.remark!
    _row = row
  }
}
const siteList = ref<{ id: number; label: string }[]>([])
const queryForm = reactive<any>({
  keyWord: '',
  site: 0,
  pageNo: 1,
  pageSize: 20,
  orderByField: '',
  orderDirection: '',
  available30SalesMin: undefined,
  available30SalesMax: undefined,
  availableRateMin: undefined,
  availableRateMax: undefined,
})

// 筛选表单
const filterForm = reactive({
  available30SalesMin: undefined as number | undefined,
  available30SalesMax: undefined as number | undefined,
  availableRateMin: undefined as number | undefined,
  availableRateMax: undefined as number | undefined,
})

// 判断是否有筛选条件
const hasFilter = computed(() => {
  return (
    filterForm.available30SalesMin !== undefined ||
    filterForm.available30SalesMax !== undefined ||
    filterForm.availableRateMin !== undefined ||
    filterForm.availableRateMax !== undefined
  )
})

const tableRef = ref<TableInstance>()
const site = ref<number>(0)
const list = ref<any>([])
const listLoading = ref<boolean>(true)
const total = ref<number>(0)
const updateVisible = ref<boolean>(false)
// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const showPreviewImage = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
// 批量修改数据表单
const form = reactive<any>({
  ids: '',
  kindId: null,
  stockPileNumberDays: null,
  minStockPilNumber: null,
})
// const formRules = reactive<FormRules>({
//   kindId: [{ required: true, message: '请选择产品类别', trigger: 'change' }],
//   stockPileNumberDays: [{ required: true, message: '请填写维持库存天数', trigger: 'blur' }],
//   minStockPilNumber: [{ required: true, message: '请填写最小维持库存数量', trigger: 'blur' }],
// })
const selectRows = ref<any>([])
const setSelectRows = (value: string) => {
  selectRows.value = value
}
const handlerCloseDialog = () => {
  updateVisible.value = false
}
const merchandiseTypeList = ref<{ id: number; label: string }[]>([])
const handleUpdate = async () => {
  if (selectRows.value.length > 0) {
    updateVisible.value = true
    // formRef.value?.resetFields()
    const { data } = await getSeasonalCoefficientSite({ site: site.value })
    merchandiseTypeList.value = data
  } else {
    $baseMessage('您未选中任何行', 'warning', 'hey')
  }
}
const ids = ref<any>([]) // 产品补货计ids使用
const handleSubmit = async () => {
  // formRef.value?.validate(async (isValid: boolean) => {
  //   if (isValid) {

  ids.value = selectRows.value.map((item: any) => item.id)
  form.ids = `${ids.value}`
  const { data } = await updateProductReplenParams({
    ...form,
  })
  if (data) {
    updateVisible.value = false
    fetchData()
    $baseMessage('批量修改成功', 'success', 'hey')
  }
  selectRows.value = []
}

const handleChangeSite = (value: any) => {
  queryForm.site = value
  fetchData()
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getProductReplenList(queryForm)
  list.value = data.list
  list.value.forEach((item: any) => {
    item._sku = `${item.sku}<br />${item.desc}`
  })
  total.value = data.total
  listLoading.value = false
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const handleCurrentChange = (val: number) => {
  queryForm.pageNo = val
  fetchData()
}
const handleSizeChange = (val: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = val
  fetchData()
}
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  // console.log(prop, order)
  if (queryForm.orderByField === prop) {
    if (!order) {
      if (queryForm.orderDirection === 'asc') {
        column.order = 'descending'
      } else if (queryForm.orderDirection === 'desc') {
        column.order = 'ascending'
      }
    }
  } else {
    column.order = 'descending'
  }
  queryForm.orderByField = prop
  queryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  queryData()
}
const fetchSiteList = async () => {
  const { data } = await getSeasonalCoefficientSiteList()
  siteList.value = data
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.columnIndex === 1) {
    return 'clear-padding'
  }
  return ''
}

// 处理筛选
const handleFilter = () => {
  queryForm.available30SalesMin = filterForm.available30SalesMin
  queryForm.available30SalesMax = filterForm.available30SalesMax
  queryForm.availableRateMin = filterForm.availableRateMin
  queryForm.availableRateMax = filterForm.availableRateMax
  queryData()
}

// 重置筛选
const handleResetFilter = () => {
  filterForm.available30SalesMin = undefined
  filterForm.available30SalesMax = undefined
  filterForm.availableRateMin = undefined
  filterForm.availableRateMax = undefined
  queryForm.available30SalesMin = undefined
  queryForm.available30SalesMax = undefined
  queryForm.availableRateMin = undefined
  queryForm.availableRateMax = undefined
  queryData()
}
onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  fetchSiteList()
  fetchData()
})
</script>

<style lang="scss" scoped>
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}
:deep(.moldDialog .el-dialog__body) {
  padding-top: 0;
}
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
.noneHoveTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoveTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
:deep(.el-checkbox) {
  transform: scale(1.2);
}
</style>
