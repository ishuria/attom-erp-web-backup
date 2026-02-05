<template>
  <div>
    <vab-dialog v-model="visible" title="发货数检查" width="60%">
      <el-table border class="noneHoverTable" :data="list" :header-cell-style="{ textAlign: 'center' }" @selection-change="setSelectedList">
        <el-table-column align="center" type="selection" />
        <el-table-column align="center" label="站点" min-width="135" prop="siteName" />
        <el-table-column align="center" label="发货计划" min-width="120" prop="shippingPlanDate" />
        <el-table-column align="left" label="渠道" prop="channelName" :width="flexColumnWidth(list, '渠道', 'channelName', 30)" />
        <el-table-column align="left" label="备注" prop="channelRemark" :width="flexColumnWidth(list, '备注', 'channelRemark')" />
        <el-table-column align="center" label="产品数量" min-width="100" prop="productCount" />
        <el-table-column align="center" label="重量" prop="weight" />
        <el-table-column align="center" label="体积" prop="volume" />
        <el-table-column align="center" label="箱数" prop="encasementCount" />
      </el-table>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="handleConfirm">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script setup lang="ts">
import { getOperationOrderShippingInspection, updateOperationOrderShipmentQuantity } from '/@/api/devlocal/productOrdering'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'VabShipmentQuantityInspection',
})

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue', 'confirm'])
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
    emit('confirm')
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
