<template>
  <vab-dialog
    v-model="dflag"
    :loading="props.loading"
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
          <span style=" color: #303133;white-space: nowrap">至</span>
          <el-input-number
            v-model="filterForm.newArrivalMaxDay"
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
          <span style=" color: #303133;white-space: nowrap">至</span>
          <el-input-number
            v-model="filterForm.signCountMax"
            :min="0"
            placeholder="最大值"
            style="flex: 1"
          />
        </div>
      </el-form-item>
      <el-form-item label="当前售价">
        <div class="flex">
          <el-input-number
            v-model="filterForm.sellPriceMin"
            :min="0"
            placeholder="最小值"
            style="flex: 1"
          />
          <span style=" color: #303133;white-space: nowrap">至</span>
          <el-input-number
            v-model="filterForm.sellPriceMax"
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
          <span style=" color: #303133;white-space: nowrap">至</span>
          <el-input-number
            v-model="filterForm.monthSalesVolumeMax"
            :min="0"
            placeholder="最大值"
            style="flex: 1"
          />
        </div>
      </el-form-item>
    
      
      <el-form-item label="运营分类筛选">
        <el-select v-model="filterForm.operationTypeId" placeholder="请选择运营分类"/>
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

defineOptions({
  name: 'VabFilterWalmartDialog'
})
const dflag = ref<boolean>(false)
const props = defineProps<{
  filterVisible: boolean
  loading: boolean
}>()
watchEffect(() => {
  dflag.value = props.filterVisible
})
const emit = defineEmits(['updateVisible', 'updateFilter'])
const filterForm = reactive<any>({
  newArrivalMinDay: null,
  newArrivalMaxDay: null,
  signCountMin: null,
  signCountMax: null,
  sellPriceMin: null,
  sellPriceMax: null,
  monthSalesVolumeMin: null,
  monthSalesVolumeMax: null,
  operationTypeId: null,
})
const filterFormRef = ref<FormInstance>()
const handleConfirmFilter = () => {
  emit('updateFilter', filterForm)
}
const clearFilterForm = () => {
  Object.assign(filterForm, {
    newArrivalMinDay: null,
    newArrivalMaxDay: null,
 
    signCountMin: null,
    signCountMax: null,
   
    monthSalesVolumeMin: null,
    monthSalesVolumeMax: null,

    sellPriceMin: null,
    sellPriceMax: null,
  
    operationTypeId: null,
  
  })
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