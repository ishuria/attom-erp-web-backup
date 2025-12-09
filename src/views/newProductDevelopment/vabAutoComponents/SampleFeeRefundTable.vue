<template>
  <div class="sample-fee-refund-table-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keyup.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table v-loading="listLoading" border :data="list" stripe>
      <el-table-column label="图片" prop="imgUrl" width="75">
        <template #default="{ row }">
          <el-image v-if="row.imgUrl" fit="fill" :src="row.imgUrl" style="width: 75px; height: 75px">
            <template #error>
              <el-icon />
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="产品" min-width="120" prop="productName" />
      <el-table-column label="零件名" min-width="120" prop="componentName" />
      <el-table-column label="拿样人" min-width="100" prop="samplePerson" />
      <el-table-column label="供应商" min-width="120" prop="supplier" />
      <el-table-column label="1688单号" min-width="120" prop="1688OrderNumber" />
      <el-table-column label="拿样金额" min-width="100" prop="sampleAmount" />
      <el-table-column label="可退金额" min-width="100" prop="refundableAmount" />
      <el-table-column label="拿样备注" min-width="150" prop="sampleRemark" show-overflow-tooltip />
      <el-table-column label="样品费退还跟进备注" min-width="180" prop="refundFollowupRemark" show-overflow-tooltip />
      <el-table-column label="退款凭证" min-width="120" prop="refundProof" />
      <el-table-column v-if="props.status === 0" fixed="right" label="操作" width="100">
        <template #default="{ row }">
          <el-link type="primary" underline="never" @click="handleRefund(row)">退款</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

defineOptions({
  name: 'SampleFeeRefundTable',
})

interface Props {
  /**
   * 状态：0-未退款, 1-已退款, 2-不可退款
   */
  status: number
}

const props = defineProps<Props>()

const list = ref<any[]>([])
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  status: props.status,
})

// 查询数据
const queryData = async () => {
  listLoading.value = true
  try {
    // TODO: 调用实际的 API
    // const { data } = await getSampleFeeRefundList({
    //   ...queryForm,
    //   status: props.status,
    // })
    // list.value = data.list || []
    // total.value = data.total || 0

    // 临时模拟数据
    list.value = []
    total.value = 0
  } catch (error) {
    console.error('查询失败:', error)
  } finally {
    listLoading.value = false
  }
}

// 分页变化
const handleCurrentChange = (pageNo: number) => {
  queryForm.pageNo = pageNo
  queryData()
}

const handleSizeChange = (pageSize: number) => {
  queryForm.pageSize = pageSize
  queryForm.pageNo = 1
  queryData()
}

// 退款操作
const handleRefund = (row: any) => {
  // TODO: 实现退款逻辑
  console.log('退款:', row)
}

// 监听状态变化，重新查询
watch(
  () => props.status,
  () => {
    queryForm.status = props.status
    queryForm.pageNo = 1
    queryData()
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.sample-fee-refund-table-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  :deep() {
    .el-table {
      flex: 1;
    }
  }
}
.el-table :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.el-table :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
</style>
