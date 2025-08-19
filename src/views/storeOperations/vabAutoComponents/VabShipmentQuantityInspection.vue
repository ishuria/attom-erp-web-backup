<template>
  <div>
    <vab-dialog v-model="visible" title="发货数检查">
      <el-table
        border
        :cell-style="{ textAlign: 'center' }"
        class="noneHoverTable"
        :data="list"
        :header-cell-style="{ textAlign: 'center' }"
        @selection-change="setSelectedList"
      >
        <el-table-column type="selection" />
        <el-table-column label="站点" prop="siteName" />
        <el-table-column label="发货计划" prop="shippingPlanDate" />
        <el-table-column label="产品数量" prop="productCount" />
        <el-table-column label="重量" prop="weight" />
        <el-table-column label="体积" prop="volume" />
        <el-table-column label="箱数" prop="encasementCount" />
      </el-table>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="handleConfirm">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script setup lang="ts">
import { getOperationOrderShippingInspection, updateOperationOrderShipmentQuantity } from '~/src/api/devlocal/productOrdering'

defineOptions({
  name: 'VabShipmentQuantityInspection',
})

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
watch(visible, (newVal) => {
  if (newVal) {
    fetchData()
  }
})
const loading = ref(false)
const list = ref<any[]>([])
const selectedList = ref<any[]>([])
const setSelectedList = (rows: any[]) => {
  selectedList.value = rows.map((item) => ({
    planSite: item.planSite,
    shippingPlanDate: item.shippingPlanDate,
  }))
}

const handleConfirm = async () => {
  if (selectedList.value.length === 0) {
    $baseMessage('请选择需要检查的发货数！', 'warning')
    return
  }
  loading.value = true
  const { data } = await updateOperationOrderShipmentQuantity(selectedList.value)
  if (data) {
    $baseMessage('更新发货数成功！', 'success')
    visible.value = false
  } else {
    $baseMessage('更新发货数失败！', 'error')
  }
  loading.value = false
}

// 打开发货数检查
const fetchData = async () => {
  visible.value = true
  const { data } = await getOperationOrderShippingInspection()
  list.value = data
}
</script>

<style scoped lang="scss"></style>
