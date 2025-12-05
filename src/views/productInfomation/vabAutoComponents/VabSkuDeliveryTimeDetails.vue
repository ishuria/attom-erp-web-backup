
<template>
  <div>
    <el-dialog v-model="visible" title="Sku交期" top="5vh" width="1200px">
      <div class="dialog-content">
        <!-- 上半部分：折线图 -->
        <div class="chart-section">
          <div class="chart-header">
            <span>交期趋势图</span>

            <el-date-picker
              v-model="chartTimeRange"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              style="max-width: 300px"
              type="daterange"
              unlink-panels
            />
          </div>
          <div ref="chartContainer" class="chart-container">
<!--            <vab-chart :option="lineChartOption" />-->
            <div></div>
          </div>
        </div>

        <!-- 下半部分：搜索框、表格和分页 -->
        <div class="table-section">
          <vab-query-form>
            <vab-query-form-right-panel :span="24">
              <el-form inline :model="queryForm" @submit.prevent>
                <el-form-item>
                  <el-input
                    v-model="queryForm.keyWord"
                    clearable
                    placeholder="请输入搜索关键词"
                    @input="queryData"
                    @keyup.enter="queryData"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
                </el-form-item>
              </el-form>
            </vab-query-form-right-panel>
          </vab-query-form>
          <el-table
            v-loading="listLoading"
            border
            :cell-style="{ textAlign: 'center' }"
            :header-cell-style="{ textAlign: 'center' }"
            max-height="700"
            stripe
          >
            <el-table-column label="PO" min-width="100" prop="po" />
            <el-table-column label="打包日期" min-width="100" prop="startTime" />
            <el-table-column label="打包工时(分钟)" min-width="110" prop="workingHours" />
            <el-table-column label="完成数量" min-width="100" prop="goodCount" />
            <el-table-column label="每个用时(秒)" min-width="110" prop="eachTime" />
            <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 700px" />
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
      </div>
    </el-dialog>
  </div>
</template>


<script setup lang="ts">

import { IGetPackingTimeDetailsReq } from '/@/type/productInformation/skuCustomsClearance.ts'
import { Search } from '@element-plus/icons-vue'


defineOptions({
  name: 'VabSkuDeliveryTimeDetails',
})


const props = defineProps<{
  modelValue: boolean
  sku: string
}>()

const queryForm = reactive<IGetPackingTimeDetailsReq>({
  sku: props.sku,
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const chartTimeRange = ref<[Date, Date]>([new Date(new Date().setMonth(new Date().getMonth() - 6)), new Date()])
const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
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

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const fetchData = async () => {
  listLoading.value = true
  queryForm.sku = props.sku

  listLoading.value = false
}


</script>

<style scoped>

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px 20px 20px;
}

.chart-section {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}

.chart-container {
  height: 280px;
}

.table-section {
  display: flex;
  flex-direction: column;
}
</style>
