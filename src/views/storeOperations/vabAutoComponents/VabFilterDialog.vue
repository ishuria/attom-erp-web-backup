<template>
  <vab-dialog v-model="dflag" :loading="props.loading" title="筛选" width="27%" @close="handleClose">
    <el-form ref="filterFormRef" label-position="right" label-width="auto" :model="filterForm" style="width: 100%; margin-right: 10px">
      <el-form-item label="上新天数">
        <div class="flex">
          <el-input-number v-model="filterForm.newArrivalMinDay" :min="0" placeholder="最小值" style="flex: 1" />
          <span style="color: #303133; white-space: nowrap">至</span>
          <el-input-number v-model="filterForm.newArrivalMaxDay" :min="0" placeholder="最大值" style="flex: 1" />
        </div>
      </el-form-item>
      <el-form-item label="ES总新">
        <div class="flex">
          <el-input-number v-model="filterForm.esTotalMin" :min="0" placeholder="最小值" style="flex: 1" />
          <span style="color: #303133; white-space: nowrap">至</span>
          <el-input-number v-model="filterForm.esTotalMax" :min="0" placeholder="最大值" style="flex: 1" />
        </div>
      </el-form-item>
      <el-form-item label="上海签收">
        <div class="flex">
          <el-input-number v-model="filterForm.signCountMin" :min="0" placeholder="最小值" style="flex: 1" />
          <span style="color: #303133; white-space: nowrap">至</span>
          <el-input-number v-model="filterForm.signCountMax" :min="0" placeholder="最大值" style="flex: 1" />
        </div>
      </el-form-item>
      <el-form-item v-if="props.classify === 0" label="当前售价">
        <div class="flex">
          <el-input-number v-model="filterForm.sellPriceMin" :min="0" placeholder="最小值" style="flex: 1" />
          <span style="color: #303133; white-space: nowrap">至</span>
          <el-input-number v-model="filterForm.sellPriceMax" :min="0" placeholder="最大值" style="flex: 1" />
        </div>
      </el-form-item>
      <el-form-item label="30天净利润">
        <div class="flex">
          <el-input-number v-model="filterForm.monthProfitMin" :min="0" placeholder="最小值" style="flex: 1" />
          <span style="color: #303133; white-space: nowrap">至</span>
          <el-input-number v-model="filterForm.monthProfitMax" :min="0" placeholder="最大值" style="flex: 1" />
        </div>
      </el-form-item>
      <el-form-item label="30天净利率%">
        <div class="flex">
          <el-input-number v-model="filterForm.monthInterestRateMin" :min="0" placeholder="最小值" style="flex: 1" />
          <span style="color: #303133; white-space: nowrap">至</span>
          <el-input-number v-model="filterForm.monthInterestRateMax" :min="0" placeholder="最大值" style="flex: 1" />
        </div>
      </el-form-item>
      <el-form-item label="月销售额">
        <div class="flex">
          <el-input-number v-model="filterForm.monthSalesVolumeMin" :min="0" placeholder="最小值" style="flex: 1" />
          <span style="color: #303133; white-space: nowrap">至</span>
          <el-input-number v-model="filterForm.monthSalesVolumeMax" :min="0" placeholder="最大值" style="flex: 1" />
        </div>
      </el-form-item>

      <el-form-item label="FBA差异">
        <div class="flex">
          <el-input-number v-model="filterForm.fbaMin" :min="0" placeholder="最小值" style="flex: 1" />
          <!-- <el-input type="number" placeholder="最小值" /> -->
          <span style="color: #303133; white-space: nowrap">至</span>
          <el-input-number v-model="filterForm.fbaMax" :min="0" placeholder="最大值" style="flex: 1" />
          <!-- <el-input type="number" v-model="filterForm.number6" placeholder="最大值" /> -->
        </div>
      </el-form-item>
      <el-form-item label="断货天数">
        <div class="flex">
          <el-input-number v-model="filterForm.outOfStockMin" :min="0" placeholder="最小值" style="flex: 1" />
          <span style="color: #303133; white-space: nowrap">至</span>
          <el-input-number v-model="filterForm.outOfStockMax" :min="0" placeholder="最大值" style="flex: 1" />
        </div>
      </el-form-item>
      <el-form-item label="预计下月仓储费">
        <div class="flex">
          <el-input-number v-model="filterForm.estimateNextMonthStorageFeeMin" placeholder="最小值" style="flex: 1" />
          <span style="color: #303133; white-space: nowrap">至</span>
          <el-input-number v-model="filterForm.estimateNextMonthStorageFeeMax" placeholder="最大值" style="flex: 1" />
        </div>
      </el-form-item>
      <el-form-item label="半年有货率">
        <div class="flex">
          <el-input-number v-model="filterForm.availableRateMin" :min="0" placeholder="最小值" style="flex: 1" />
          <span style="color: #303133; white-space: nowrap">至</span>
          <el-input-number v-model="filterForm.availableRateMax" :min="0" placeholder="最大值" style="flex: 1" />
        </div>
      </el-form-item>
      <el-form-item label="运营分类筛选">
        <div style="display: flex; gap: 10px; width: 100%">
          <el-select
            v-model="filterForm.operationUserId"
            placeholder="请选择运营人员"
            style="width: 5em"
            @change="handleGetOperationTypeById"
          >
            <el-option v-for="item in operationUserList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
          <el-select v-model="filterForm.operationTypeId" placeholder="请选择运营分类" style="flex: 1">
            <el-option v-for="item in operationTypeList" :key="item.id" :label="item.typeName" :value="item.id" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="广告">
        <el-select v-model="filterForm.advStatus" placeholder="请选择广告状态">
          <el-option v-for="item in adStatusOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="美工长期">
        <el-select v-model="filterForm.artLongTermFlag" clearable placeholder="请选择美工长期">
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="库龄筛选">
        <el-radio-group v-model="filterForm.warehouseAge">
          <el-radio :value="0">181-270</el-radio>
          <el-radio :value="1">271-360</el-radio>
          <el-radio :value="2">361+</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="销量趋势">
        <div style="display: flex; gap: 10px; width: 100%">
          <el-select v-model="filterForm.salesTrendDays" placeholder="时间范围" clearable style="flex: 1">
            <el-option label="近7天" :value="7" />
            <el-option label="近14天" :value="14" />
            <el-option label="近30天" :value="30" />
          </el-select>
          <el-select v-model="filterForm.salesTrendDirection" placeholder="趋势方向" clearable style="flex: 1">
            <el-option label="上升" :value="1" />
            <el-option label="下降" :value="2" />
          </el-select>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="text-align: center">
        <el-button type="danger" @click="clearFilterForm">清空</el-button>
        <el-button :loading="props.loading" type="primary" @click="handleConfirmFilter">确认</el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { getFrontPageProductManagerSelectOption, getOperationTypeUserList } from '~/src/api/devlocal/frontPage'
import { useUserStore } from '~/src/store/modules/user'
import { adStatusOption } from '../constantOption'

defineOptions({
  name: 'VabFilterDialog',
})
const dflag = ref<boolean>(false)
const props = defineProps<{
  filterVisible: boolean
  classify: number
  loading: boolean
  savedFilterData?: any
  operationUserId?: number
}>()
watchEffect(() => {
  dflag.value = props.filterVisible
})
const myName = useUserStore().getUsername
const operationUserList = ref<{ id: number; label: string }[]>([])
const fetchOperationUserList = async () => {
  const { data } = await getFrontPageProductManagerSelectOption({ type: 3 })
  operationUserList.value = data
  operationUserList.value.unshift({ id: -1, label: '全部' })
  filterForm.operationUserId = props.operationUserId || -1

  handleGetOperationTypeById(filterForm.operationUserId)
}
const operationTypeList = ref<{ id: number; typeName: string }[]>([])
const handleGetOperationTypeById = async (id: number) => {
  if (id === -1) {
    const currentId = operationUserList.value.find((item) => item.label.includes(myName))?.id || -1
    const { data } = await getOperationTypeUserList({ userId: currentId })
    operationTypeList.value = data
    return
  } else {
    const { data } = await getOperationTypeUserList({ userId: id })
    operationTypeList.value = data
  }
}
watch(
  () => props.filterVisible,
  (newVal) => {
    if (newVal) {
      fetchOperationUserList()
    }
    if (newVal && props.savedFilterData) {
      const savedData = { ...props.savedFilterData }

      const numberFields = [
        'newArrivalMinDay',
        'newArrivalMaxDay',
        'esTotalMin',
        'esTotalMax',
        'signCountMin',
        'signCountMax',
        'sellPriceMin',
        'sellPriceMax',
        'monthProfitMin',
        'monthProfitMax',
        'monthInterestRateMin',
        'monthInterestRateMax',
        'monthSalesVolumeMin',
        'monthSalesVolumeMax',
        'fbaMin',
        'fbaMax',
        'estimateNextMonthStorageFeeMin',
        'estimateNextMonthStorageFeeMax',
        'availableRateMin',
        'availableRateMax',
      ]

      numberFields.forEach((field) => {
        if (savedData[field] === '' || savedData[field] === undefined) {
          savedData[field] = null
        }
      })

      if (savedData.warehouseAge !== undefined && savedData.warehouseAge !== null) {
        // 如果是数组，取第一个值；否则直接使用
        if (Array.isArray(savedData.warehouseAge)) {
          savedData.warehouseAge = savedData.warehouseAge.length > 0 ? savedData.warehouseAge[0] : null
        } else {
          savedData.warehouseAge = savedData.warehouseAge
        }
      } else {
        savedData.warehouseAge = null
      }

      Object.assign(filterForm, savedData)
    }
  },
  { immediate: true }
)
const emit = defineEmits(['updateVisible', 'updateFilter'])
const filterForm = reactive<any>({
  newArrivalMinDay: null,
  newArrivalMaxDay: null,
  esTotalMin: null,
  esTotalMax: null,
  signCountMin: null,
  signCountMax: null,
  sellPriceMin: null,
  sellPriceMax: null,
  monthProfitMin: null,
  monthProfitMax: null,
  monthInterestRateMin: null,
  monthInterestRateMax: null,
  monthSalesVolumeMin: null,
  monthSalesVolumeMax: null,
  fbaMin: null,
  fbaMax: null,
  estimateNextMonthStorageFeeMin: null,
  estimateNextMonthStorageFeeMax: null,
  operationTypeId: null,
  advStatus: null,
  artLongTermFlag: null,
  warehouseAge: null,
  availableRateMin: null,
  availableRateMax: null,
  operationUserId: null,
  salesTrendDays: null,
  salesTrendDirection: null,
})
const filterFormRef = ref<FormInstance>()
const handleConfirmFilter = () => {
  emit('updateFilter', filterForm)
}
const clearFilterForm = () => {
  Object.assign(filterForm, {
    newArrivalMinDay: null,
    newArrivalMaxDay: null,
    esTotalMin: null,
    esTotalMax: null,
    signCountMin: null,
    signCountMax: null,
    monthProfitMin: null,
    monthProfitMax: null,
    monthInterestRateMin: null,
    monthInterestRateMax: null,
    monthSalesVolumeMin: null,
    monthSalesVolumeMax: null,
    fbaMin: null,
    fbaMax: null,
    estimateNextMonthStorageFeeMin: null,
    estimateNextMonthStorageFeeMax: null,
    operationTypeId: null,
    advStatus: null,
    artLongTermFlag: null,
    warehouseAge: null,
    availableRateMin: null,
    availableRateMax: null,
    salesTrendDays: null,
    salesTrendDirection: null,
  })

  emit('updateFilter', filterForm)
}
const handleClose = () => {
  emit('updateVisible', false)
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  gap: 20px;
  align-items: center;
  width: 100%;
}
</style>
