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

      <el-form-item label="上海签收">
        <div class="flex">
          <el-input-number v-model="filterForm.signCountMin" :min="0" placeholder="最小值" style="flex: 1" />
          <span style="color: #303133; white-space: nowrap">至</span>
          <el-input-number v-model="filterForm.signCountMax" :min="0" placeholder="最大值" style="flex: 1" />
        </div>
      </el-form-item>
      <el-form-item label="当前售价">
        <div class="flex">
          <el-input-number v-model="filterForm.sellPriceMin" :min="0" placeholder="最小值" style="flex: 1" />
          <span style="color: #303133; white-space: nowrap">至</span>
          <el-input-number v-model="filterForm.sellPriceMax" :min="0" placeholder="最大值" style="flex: 1" />
        </div>
      </el-form-item>
      <el-form-item label="月净利润">
        <div class="flex">
          <el-input-number v-model="filterForm.monthProfitMin" :min="0" placeholder="最小值" style="flex: 1" />
          <span style="color: #303133; white-space: nowrap">至</span>
          <el-input-number v-model="filterForm.monthProfitMax" :min="0" placeholder="最大值" style="flex: 1" />
        </div>
      </el-form-item>

      <el-form-item label="月销售额">
        <div class="flex">
          <el-input-number v-model="filterForm.monthSalesVolumeMin" :min="0" placeholder="最小值" style="flex: 1" />
          <span style="color: #303133; white-space: nowrap">至</span>
          <el-input-number v-model="filterForm.monthSalesVolumeMax" :min="0" placeholder="最大值" style="flex: 1" />
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
      <el-form-item label="库龄筛选">
        <el-radio-group v-model="filterForm.warehouseAge">
          <el-radio :value="0">181-270</el-radio>
          <el-radio :value="1">271-360</el-radio>
          <el-radio :value="2">361+</el-radio>
        </el-radio-group>
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
import { getOperationTypeUserList } from '~/src/api/devlocal/frontPage'
import { getWalmartOptionUserList } from '~/src/api/devlocal/productPerformance'
import { useUserStore } from '~/src/store/modules/user'

defineOptions({
  name: 'VabFilterWalmartDialog',
})
const dflag = ref<boolean>(false)
const props = defineProps<{
  filterVisible: boolean
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
  const { data } = await getWalmartOptionUserList()
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
        'signCountMin',
        'signCountMax',
        'sellPriceMin',
        'sellPriceMax',
        'monthProfitMin',
        'monthProfitMax',
        'monthSalesVolumeMin',
        'monthSalesVolumeMax',
      ]

      numberFields.forEach((field) => {
        if (savedData[field] === '' || savedData[field] === undefined) {
          savedData[field] = null
        }
      })

      if (savedData.warehouseAge !== undefined && savedData.warehouseAge !== null) {
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
  signCountMin: null,
  signCountMax: null,
  sellPriceMin: null,
  sellPriceMax: null,
  monthProfitMin: null,
  monthProfitMax: null,
  monthSalesVolumeMin: null,
  monthSalesVolumeMax: null,
  operationTypeId: null,
  warehouseAge: null,
  operationUserId: null,
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
    sellPriceMin: null,
    sellPriceMax: null,
    monthProfitMin: null,
    monthProfitMax: null,
    monthSalesVolumeMin: null,
    monthSalesVolumeMax: null,
    operationTypeId: null,
    warehouseAge: null,
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
