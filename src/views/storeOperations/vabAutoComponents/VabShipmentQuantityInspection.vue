<template>
  <div>
    <vab-dialog v-model="visible" title="发货数检查">
      <el-table
        border
        :cell-style="{ textAlign: 'center' }"
        class="noneHoverTable"
        :data="list"
        :header-cell-style="{ textAlign: 'center' }"
        :span-method="objectSpanMethod"
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
        <el-button type="primary" @click="handleConfirm">确定</el-button>
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
const list = ref<any[]>([])
const selectedList = ref<any[]>([])
const setSelectedList = (rows: any[]) => {
  selectedList.value = list.value
    .filter((item) => {
      // 检查当前item是否在选中的rows中
      return rows.find((row) => row.shippingPlanDate + row.planSite === item.shippingPlanDate + item.planSite)
    })
    .map((item) => ({
      sku: item.sku,
      planSite: item.planSite,
      skuNumber: item.skuNumber,
      productCount: item.productCount,
    }))
  console.log(selectedList.value)
}

const handleConfirm = async () => {
  const { data } = await updateOperationOrderShipmentQuantity(selectedList.value)
  if (data) {
    $baseMessage('更新发货数成功！', 'success')
    visible.value = false
  } else {
    $baseMessage('更新发货数失败！', 'error')
  }
}

// col合并方法
const objectSpanMethod = ({ row, rowIndex, columnIndex }: any) => {
  // 设置需要合并的列
  if (
    columnIndex === 0 ||
    columnIndex === 1 ||
    columnIndex === 2 ||
    columnIndex === 3 ||
    columnIndex === 4 ||
    columnIndex === 5 ||
    columnIndex === 6
  ) {
    // 获取当前row的零件id
    const id = row.shippingPlanDate + row.planSite
    // 默认不跨行
    let rowspan = 1

    // 遍历后端返回的数据，计算相同ID的productCount总和
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      if (list.value[i].shippingPlanDate + list.value[i].planSite === id) {
        rowspan++
      } else {
        break
      }
    }

    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || list.value[rowIndex - 1].shippingPlanDate + list.value[rowIndex - 1].planSite !== id) {
      return { rowspan, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}

// 打开发货数检查
const fetchData = async () => {
  visible.value = true
  const { data } = await getOperationOrderShippingInspection()
  list.value = data
}
</script>

<style scoped lang="scss"></style>
