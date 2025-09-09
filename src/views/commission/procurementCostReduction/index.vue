<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item label="人员">
            <el-select v-model="costQueryForm.userId" :disabled="disabledSelect" placeholder="请选择人员" @change="costQueryData">
              <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="发放月份">
            <el-select v-model="costQueryForm.month" placeholder="请选择发放月份" @change="costQueryData">
              <el-option v-for="item in monthList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-text style="margin-left: 10px">提成总金额：</el-text>
            <el-text type="success">{{ amount4 }}元</el-text>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="costQueryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model="costQueryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="costQueryData"
              @keyup.enter="costQueryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="costQueryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoverTable"
      :data="costList"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
    >
      <el-table-column label="PO日期" min-width="120" prop="poReleaseDate">
        <template #default="{ row }">
          {{ row.poReleaseDate ? formatDate(new Date(row.poReleaseDate)) : '' }}
        </template>
      </el-table-column>

      <el-table-column label="降本人员" prop="userName" width="100" />
      <el-table-column label="图片" prop="skuImgUrl" width="75">
        <template #default="{ row }">
          <el-image :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row.skuImgUrl)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="SKU"
        prop="sku"
        :width="Math.max(flexColumnWidth(costList, 'SKU', 'sku'), flexColumnWidth(costList, '零件名', 'componentName'))"
      >
        <template #header>
          SKU
          <br />
          零件名
        </template>
        <template #default="{ row }">
          {{ row.sku }}
          <br />
          {{ row.componentName }}
        </template>
      </el-table-column>
      <el-table-column label="零件图片" prop="componentImgUrl" width="75">
        <template #header>
          零件
          <br />
          图片
        </template>
        <template #default="{ row }">
          <el-image
            :src="row.componentImgUrl"
            style="display: block; width: 75px; height: 75px"
            @click="imagePreviewShow(row.componentImgUrl)"
          >
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="100" prop="status">
        <template #default="{ row }">
          <el-tag v-if="row.status === '暂停'" type="warning">{{ row.status }}</el-tag>
          <el-tag v-if="row.status === '进行中'" type="success">{{ row.status }}</el-tag>
          <el-tag v-if="row.status === '已结束'" type="danger">{{ row.status }}</el-tag>
          <el-tag v-if="row.status === '待审核'" type="primary">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="PO" min-width="100" prop="po" />
      <el-table-column label="本PO提成￥" min-width="120" prop="currentPoCommission">
        <template #default="{ row }">
          {{ row.currentPoCommission ? '￥' + row.currentPoCommission : '' }}
        </template>
      </el-table-column>

      <el-table-column label="零件付款日期" min-width="125" prop="compnentPayDate">
        <template #default="{ row }">
          {{ row.compnentPayDate ? formatDate(new Date(row.compnentPayDate)) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="PO零件单价￥" min-width="130" prop="poComponentUnitPrice">
        <template #default="{ row }">
          {{ row.poComponentUnitPrice ? '￥' + row.poComponentUnitPrice : '' }}
        </template>
      </el-table-column>
      <el-table-column label="PO零件数量" min-width="120" prop="poComponentCount" />
      <el-table-column label="PO零件单位" min-width="120" prop="poComponentUnit" />
      <el-table-column label="供应商" prop="suppliserName" :width="flexColumnWidth(costList, '供应商', 'suppliserName')" />
      <el-table-column label="提成比例" min-width="120" prop="commissionProportion">
        <template #default="{ row }">
          {{ row.commissionProportion ? row.commissionProportion + '%' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="提成开始日期" min-width="125" prop="startDate">
        <template #default="{ row }">
          {{ row.startDate ? formatDate(new Date(row.startDate)) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="提成结束日期" min-width="125" prop="endDate">
        <template #default="{ row }">
          {{ row.endDate ? formatDate(new Date(row.endDate)) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="剩余提成天数" min-width="130">
        <template #default="{ row }">{{ row.remainingDays }} / {{ row.commissionDays }}</template>
      </el-table-column>
      <el-table-column label="优化前单价￥" min-width="125" prop="optimizationBefore">
        <template #default="{ row }">
          {{ row.optimizationBefore ? '￥' + row.optimizationBefore : '' }}
        </template>
      </el-table-column>
      <el-table-column label="优化后单价￥" min-width="125" prop="optimizationAfter">
        <template #default="{ row }">
          {{ row.optimizationAfter ? '￥' + row.optimizationAfter : '' }}
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template #default="{ row }">
          <el-link type="primary" underline="never" @click="showPrices">历史单价</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="costQueryForm.pageNo"
      :page-size="costQueryForm.pageSize"
      :total="total"
      @current-change="handleCostCurrentChange"
      @size-change="handleCostSizeChange"
    />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <vab-dialog v-model="viewPricesVisible" title="历史价格和单价查看">
      <vab-query-form>
        <vab-query-form-right-panel :span="24">
          <el-form inline :model="priceForm" @submit.prevent>
            <el-form-item>
              <el-input v-model="priceForm.keyWord" clearable placeholder="请输入搜索关键词" @input="" @keyup.enter="" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" type="primary" @click="" />
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table border :header-cell-style="{ textAlign: 'center' }">
        <el-table-column label="PO日期" min-width="115" prop="" />
        <el-table-column label="PO" min-width="110" prop="" />
        <el-table-column label="出厂单价" min-width="100" prop="" />
        <el-table-column label="未税单价" min-width="100" prop="" />
        <el-table-column label="含税单价" min-width="100" prop="" />
        <el-table-column label="货币" min-width="100" prop="" />
        <el-table-column label="供应商" min-width="200" prop="" />
      </el-table>
      <vab-pagination
        :current-page="priceForm.pageNo"
        :page-size="priceForm.pageSize"
        :total="priceTotal"
        @current-change="handlePriceCurrentChange"
        @size-change="handlePriceSizeChange"
      />
      <template #footer></template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { getCostReductionUserList, getReductionCostDetailList, getReductionCostDetailMonth } from '/@/api/devlocal/commission'
import type { IGetReductionCostDetailList, IGetReductionCostDetailListReq } from '/@/type/commission/commissionType'
import { flexColumnWidth } from '/@/utils/tableColum'
import { formatDate } from '/@/utils/dateUtils'
import type { CSSProperties } from 'vue'
import { useAclStore } from '/@/store/modules/acl'
import { ROLE_PURCHASER_CODE, ROLE_PURCHASINGASSISTANT_CODE, ROLE_SUPPLY_CHAIN_MANG_CODE } from '~/src/const/role'
import { useUserStore } from '~/src/store/modules/user'

defineOptions({
  name: 'ProcurementCostReduction',
})

const currentRoleCode = useAclStore().getRole[0]
const disabledSelect = computed(() => {
  return (
    currentRoleCode === ROLE_PURCHASER_CODE ||
    currentRoleCode === ROLE_PURCHASINGASSISTANT_CODE ||
    currentRoleCode === ROLE_SUPPLY_CHAIN_MANG_CODE
  )
})
const userName = useUserStore().username
const userList = ref<{ id: number; label: string }[]>([])
const priceTotal = ref<number>(0)
const viewPricesVisible = ref<boolean>(false)
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const costList = ref<IGetReductionCostDetailList[]>([])
const amount4 = ref<number>(0)
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const costQueryForm = reactive<IGetReductionCostDetailListReq>({
  keyWord: '',
  userId: -1,
  month: '',
  pageNo: 1,
  pageSize: 20,
})
const priceForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const handlePriceCurrentChange = (value: number) => {
  priceForm.pageNo = value
  // fetchPriceData()
}
const handlePriceSizeChange = (value: number) => {
  priceForm.pageNo = 1
  priceForm.pageSize = value
  // fetchPriceData()
}
const priceQueryData = () => {
  priceForm.pageNo = 1
  // fetchPriceData()
}
const showPrices = () => {
  viewPricesVisible.value = true
}
const handleCostCurrentChange = (value: number) => {
  costQueryForm.pageNo = value
  fetchCostData()
}
const handleCostSizeChange = (value: number) => {
  costQueryForm.pageNo = 1
  costQueryForm.pageSize = value
  fetchCostData()
}
const costQueryData = () => {
  costQueryForm.pageNo = 1
  fetchCostData()
}

const fetchCostData = async () => {
  listLoading.value = true
  const { data } = await getReductionCostDetailList(costQueryForm)
  if (data) {
    total.value = data.total
    costList.value = data.list
    costList.value.forEach((item) => {
      if (item.commissionProportion) {
        item.commissionProportion = parseFloat((item.commissionProportion * 100).toFixed(2))
      }
    })
  }
  amount4.value = data.totalBonus || 0
  listLoading.value = false
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === 'SKU') {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片' || data.column.label === '零件图片') {
    return 'clear-padding'
  }
  return ''
}
const fetchUserList = async () => {
  const { data } = await getCostReductionUserList()
  userList.value = data
  userList.value.unshift({ id: -1, label: '全部' })
  if (disabledSelect.value) {
    costQueryForm.userId = userList.value.find((item) => item.label === userName)?.id || -1
  }
}
const monthList = ref<string[]>([])
const fetchMonthList = async () => {
  const { data } = await getReductionCostDetailMonth()
  monthList.value = data

  costQueryForm.month = monthList.value[0] || ''
}
onBeforeMount(async () => {
  await fetchMonthList()
  await fetchUserList()
  await fetchCostData()
})
</script>

<style lang="scss" scoped>
.noneHoverTable {
  .clear-padding {
    padding-top: 0;
    padding-bottom: 0;
  }
}
.noneHoverTable {
  :deep(.cell) {
    padding-right: 0;
    padding-left: 0;
  }
}
</style>
