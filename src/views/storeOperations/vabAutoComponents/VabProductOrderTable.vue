<template>
  <div>
    <vab-dialog v-model="visible" title="订货明细" width="800px">
      <el-table border :cell-style="{ textAlign: 'center' }" :data="list" :header-cell-style="{ textAlign: 'center' }" stripe>
        <el-table-column label="订货日期" min-width="120" prop="releaseDate">
          <template #default="{ row }">
            {{ row.releaseDate !== null ? row.releaseDate.split(' ')[0] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="PO" min-width="100" prop="po" />
        <el-table-column label="订货数量" min-width="100" prop="packageTaskCount" />
        <el-table-column label="站点" min-width="125" prop="sendSite" />
        <el-table-column label="原始预计到货时间" min-width="130" prop="arrivalDate">
          <template #default="{ row }">
            <!-- 如果到货时间小于今天并且未到货 则标红 -->
            <el-text
              :type="
                row.arrivalDate !== null && row.arrivalDate.split(' ')[0] < new Date().toISOString().split('T')[0] && row.status === 0
                  ? 'danger'
                  : ''
              "
            >
              {{ row.arrivalDate !== null ? row.arrivalDate.split(' ')[0] : '-' }}
            </el-text>
          </template>
        </el-table-column>
        <el-table-column label="到货状态" min-width="100" prop="status">
          <template #default="{ row }">
            <el-tag :type="row.status === 0 ? 'warning' : 'success'">{{ row.status === 0 ? '未到货' : '已到货' }}</el-tag>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
        </template>
      </el-table>
    </vab-dialog>
  </div>
</template>

<script setup lang="ts">
import { IGetOperationOrderTable } from '/@/type/storeOperation/productOrdering'

defineOptions({
  name: 'VabProductOrderTable',
})
const props = defineProps<{
  modelValue: boolean
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
