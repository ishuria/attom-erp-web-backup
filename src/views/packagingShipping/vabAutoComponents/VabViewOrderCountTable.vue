<template>
  <div>
    <vab-dialog v-model="visible" :title="`${sku} 订货数量`" width="20%">
      <el-table border :data="list" stripe>
        <el-table-column align="center" label="订货日期" min-width="120" prop="releaseDate">
          <template #default="{ row }">
            {{ row.releaseDate !== null ? row.releaseDate.split(' ')[0] : '-' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="PO" prop="po" />
        <el-table-column align="center" label="订单总数" prop="packageTaskCount" />
      </el-table>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { IGetOperationOrderTable } from '/@/type/storeOperation/productOrdering'

defineOptions({
  name: 'VabViewOrderCountTable',
})

const props = defineProps<{
  modelValue: boolean
  sku: string
  list: IGetOperationOrderTable[]
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>
