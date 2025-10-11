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
      <el-form-item label="运营分类筛选">
        <el-select v-model="filterForm.operationTypeId" placeholder="请选择运营分类" />
      </el-form-item>
      <el-form-item label="广告">
        <el-select v-model="filterForm.advStatus" placeholder="请选择广告状态">
          <el-option v-for="item in adStatusOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="库龄筛选">
        <el-checkbox-group v-model="filterForm.warehouseAge">
          <el-checkbox :value="0">有库龄181+</el-checkbox>
          <el-checkbox :value="1">有库龄271+</el-checkbox>
          <el-checkbox :value="2">有库龄361+</el-checkbox>
        </el-checkbox-group>
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
}>()
watchEffect(() => {
  dflag.value = props.filterVisible
})

watch(
  () => props.filterVisible,
  (newVal) => {
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
      ]

      numberFields.forEach((field) => {
        if (savedData[field] === '' || savedData[field] === undefined) {
          savedData[field] = null
        }
      })

      if (savedData.warehouseAge !== undefined && savedData.warehouseAge !== null) {
        if (Array.isArray(savedData.warehouseAge)) {
          savedData.warehouseAge = [...savedData.warehouseAge]
        } else {
          savedData.warehouseAge = [savedData.warehouseAge]
        }
      } else {
        savedData.warehouseAge = []
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
  operationTypeId: null,
  advStatus: null,
  warehouseAge: [],
})
const filterFormRef = ref<FormInstance>()
const handleConfirmFilter = () => {
  // 库龄有0的 只传0 有1的 只传1 有2的 只传2
  if (filterForm.warehouseAge.includes(0)) {
    filterForm.warehouseAge = 0
  } else if (filterForm.warehouseAge.includes(1)) {
    filterForm.warehouseAge = 1
  } else if (filterForm.warehouseAge.includes(2)) {
    filterForm.warehouseAge = 2
  }
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
    operationTypeId: null,
    advStatus: null,
    warehouseAge: [],
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
