<template>
  <div>
    <vab-dialog v-model="operationStockVisible" title="系统操作日志" width="95%">
      <el-table :cell-style="cellStyle" :data="list" :header-cell-style="{ textAlign: 'center' }" max-height="60vh" stripe>
        <el-table-column label="操作之前价格" prop="operationBeforePrice" width="200" />
        <el-table-column label="操作之后价格" prop="operationAfterPrice" width="200" />
        <el-table-column label="操作类型" prop="operationType" width="100">
          <template #default="{ row }">
            <el-tag :type="row.operationType === 0 ? 'danger' : 'success'">
              {{ row.operationType === 0 ? '调减' : '调增' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作结果" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.operationResult === '失败' ? 'danger' : 'success'">
              {{ row.operationResult }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" min-width="150" prop="operationDate" />
        <el-table-column label="是否为最新日志" min-width="150">
          <template #default="{ row }">
            <el-tag :type="row.isLatest === 0 ? 'danger' : 'success'">
              {{ row.isLatest === 0 ? '不是' : '是' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150" prop="createTime" />
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
import {
  queryOperationStockLogList
} from '/@/api/devlocal/operationAutoMation'
import { IOperationStockLog } from '/@/type/storeOperation/operationStock'

defineOptions({
  name: 'VabDialogOperationStockLog',
})

const operationStockVisible = defineModel<boolean>('operationStockVisible', { required: true })
const id = defineModel<number>('id', { required: false })


watch(operationStockVisible, () => {
  if (operationStockVisible.value) {
    fetchData()
  }
})
const list = ref<IOperationStockLog[]>([])
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
  const { data } = await queryOperationStockLogList({
    pageNo: queryForm.pageNo,
    pageSize: queryForm.pageSize,
    id: id.value,
  })
  list.value = data?.list || []
  total.value = data?.total || 0
}
</script>
