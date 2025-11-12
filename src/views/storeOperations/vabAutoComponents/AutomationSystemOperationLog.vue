<template>
  <div>
    <vab-dialog v-model="visible" width="85%">
      <el-table :cell-style="{ textAlign: 'center' }" :data="list" :header-cell-style="{ textAlign: 'center' }" max-height="60vh" stripe>
        <el-table-column label="更新时间" min-width="100" prop="updateTime" />
        <el-table-column label="操作对象" min-width="110" prop="operationGroupName" />
        <el-table-column label="操作类型" min-width="100" prop="operationTypeName">
          <template #default="{ row }">
            <el-tag :type="row.operationTypeName === 0 ? 'danger' : 'success'">
              {{ row.operationTypeName === 0 ? '关广告' : '开广告' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作广告类型" min-width="120" prop="operationTypeName" />
        <el-table-column label="操作结果" min-width="100" prop="operationResult">
          <template #default="{ row }">
            <el-tag :type="row.operationResult === 0 ? 'danger' : 'success'">
              {{ row.operationResult === 0 ? '失败' : '成功' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作时">
          <el-table-column label="ACOS" min-width="90" prop="operationAcos">
            <template #default="{ row }">{{ row.operationAcos }}%</template>
          </el-table-column>
          <el-table-column label="剩余可售天数" min-width="110" prop="operationDays" />
          <el-table-column label="断货天数" min-width="100" prop="operationOutStockDays" />
          <el-table-column label="可售库存数" min-width="110" prop="operationStock" />
          <el-table-column label="毛利率" min-width="90" prop="operationGrossProfit">
            <template #default="{ row }">{{ row.operationGrossProfit }}%</template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="开广告设定">
          <el-table-column label="ACOS≤" min-width="90" prop="openAcos">
            <template #default="{ row }">{{ row.openAcos }}%</template>
          </el-table-column>
          <el-table-column label="断货天数≤" min-width="100" prop="openOutStockDays" />
          <el-table-column label="剩余可售天数≥" min-width="120" prop="openDays" />
          <el-table-column label="可售库存数≥" min-width="110" prop="openStock" />
          <el-table-column label="毛利率≥" min-width="110" prop="openGrossProfit">
            <template #default="{ row }">{{ row.openGrossProfit }}%</template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="关广告设定">
          <el-table-column label="断货天数≥" min-width="100" prop="closeOutStockDays" />
          <el-table-column label="剩余可售天数≤" min-width="120" prop="closeDays" />
          <el-table-column label="可售库存数≤" min-width="110" prop="closeStock" />
          <el-table-column label="毛利率≤" min-width="110" prop="closeGrossProfit">
            <template #default="{ row }">{{ row.closeGrossProfit }}%</template>
          </el-table-column>
        </el-table-column>

        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
        </template>
      </el-table>
      <vab-pagination
        :current-page="queryForm.pageNo"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { querySystemOperationLogListOperationAutoMation } from '~/src/api/devlocal/operationAutoMation'
import { IAutomationLogItem } from '/@/type/storeOperation/autoMation'

defineOptions({
  name: 'AutomationSystemOperationLog',
})

const props = defineProps<{
  modelValue: boolean
  id: number
}>()
const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
watch(visible, (val) => {
  if (val) {
    fetchData()
  }
})
const list = ref<IAutomationLogItem[]>([])
const total = ref<number>(0)
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
})
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const fetchData = async () => {
  const { data } = await querySystemOperationLogListOperationAutoMation({
    pageNo: queryForm.pageNo,
    pageSize: queryForm.pageSize,
    id: props.id,
  })
  list.value = data?.list || []
  total.value = data?.total || 0
}
</script>
