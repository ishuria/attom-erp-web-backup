<template>
  <vab-dialog
    v-model="dflag"
    title="筛选"
    width="27%"
    @close="handleClose"
  >
    <el-form
      ref="filterFormRef"
      label-position="right"
      label-width="auto"
      :model="filterForm"
      style="width: 100%; margin-right: 10px"
    >
      <el-form-item label="上新天数">
        <div class="flex">
          <el-input-number
            v-model="filterForm.newArrivalMinDay"
            :min="0"
            placeholder="最小值"
            style="flex: 1"
          />
          <span style="white-space: nowrap; color: #303133">至</span>
          <el-input-number
            v-model="filterForm.newArrivalMaxDay"
            :min="0"
            placeholder="最大值"
            style="flex: 1"
          />
        </div>
      </el-form-item>
      <el-form-item label="ES总新">
        <div class="flex">
          <el-input-number
            v-model="filterForm.esTotalMin"
            :min="0"
            placeholder="最小值"
            style="flex: 1"
          />
          <span style="white-space: nowrap; color: #303133">至</span>
          <el-input-number
            v-model="filterForm.esTotalMax"
            :min="0"
            placeholder="最大值"
            style="flex: 1"
          />
        </div>
      </el-form-item>
      <el-form-item label="上海签收">
        <div class="flex">
          <el-input-number
            v-model="filterForm.signCountMin"
            :min="0"
            placeholder="最小值"
            style="flex: 1"
          />
          <span style="white-space: nowrap; color: #303133">至</span>
          <el-input-number
            v-model="filterForm.signCountMax"
            :min="0"
            placeholder="最大值"
            style="flex: 1"
          />
        </div>
      </el-form-item>
    
      
      <el-form-item label="30天净利润">
        <div class="flex">
          <el-input-number
            v-model="filterForm.monthProfitMin"
            :min="0"
            placeholder="最小值"
            style="flex: 1"
          />
          <span style="white-space: nowrap; color: #303133">至</span>
          <el-input-number
            v-model="filterForm.monthProfitMax"
            :min="0"
            placeholder="最大值"
            style="flex: 1"
          />
        </div>
      </el-form-item>
      <el-form-item label="30天净利率%">
        <div class="flex">
          <el-input-number
            v-model="filterForm.monthInterestRateMin"
            :min="0"
            placeholder="最小值"
            style="flex: 1"
          />
          <span style="white-space: nowrap; color: #303133">至</span>
          <el-input-number
            v-model="filterForm.monthInterestRateMax"
            :min="0"
            placeholder="最大值"
            style="flex: 1"
          />
        </div>
      </el-form-item>
      <el-form-item label="月销售额">
        <div class="flex">
          <el-input-number
            v-model="filterForm.monthSalesVolumeMin"
            :min="0"
            placeholder="最小值"
            style="flex: 1"
          />
          <span style="white-space: nowrap; color: #303133">至</span>
          <el-input-number
            v-model="filterForm.monthSalesVolumeMax"
            :min="0"
            placeholder="最大值"
            style="flex: 1"
          />
        </div>
      </el-form-item>
    
      <el-form-item label="FBA差异">
        <div class="flex">
          <el-input-number
            v-model="filterForm.fbaMin"
            :min="0"
            placeholder="最小值"
            style="flex: 1"
          />
          <!-- <el-input type="number" placeholder="最小值" /> -->
          <span style="white-space: nowrap; color: #303133">至</span>
          <el-input-number
            v-model="filterForm.fbaMax"
            :min="0"
            placeholder="最大值"
            style="flex: 1"
          />
          <!-- <el-input type="number" v-model="filterForm.number6" placeholder="最大值" /> -->
        </div>
      </el-form-item>
      <el-form-item label="运营分类筛选">
        <el-select v-model="filterForm.operationTypeId" placeholder="请选择运营分类"/>
      </el-form-item>
      <el-form-item label="广告">
        <el-select v-model="filterForm.advStatus" placeholder="请选择广告状态">
          <el-option 
            v-for="item in adStatusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="text-align: center">
        <el-button type="danger" @click="clearFilterForm">清空</el-button>
        <el-button type="primary" @click="handleConfirmFilter">确认</el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
  </vab-dialog>

</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { adStatusOption } from '../constantOption'

defineOptions({
  name: 'VabFilterDialog'
})
const dflag = ref<boolean>(false)
const props = defineProps<{
  filterVisible: boolean
}>()
watchEffect(() => {
  dflag.value = props.filterVisible
})
const emit = defineEmits(['updateVisible', 'updateFilter'])
const filterForm = reactive<any>({
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
  advStatus: null
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
    operationTypeId: null,
    advStatus: null
  })
}
const handleClose = () => {
  emit('updateVisible', false)
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}
</style>