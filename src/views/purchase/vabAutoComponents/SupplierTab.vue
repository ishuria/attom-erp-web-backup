<template>
  <div class="supplier-tab-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="4">
        <el-date-picker
          v-model="date"
          :clearable="false"
          :disabled-date="(time: Date) => time.getTime() > Date.now()"
          type="daterange"
          @change="queryData"
        />
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="20">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keydown.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table v-loading="listLoading" border :data="list" stripe>
      <el-table-column label="供应商" prop="supplierName" />
      <el-table-column label="总采购金额(￥)" prop="totalPurchaseAmount" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-link type="primary" underline="never" @click="showProductDetail(row)">产品明细</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
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
import { IGetPurchaseStatisticsSupplierItem, IGetPurchaseStatisticsSupplierListReq } from '/@/type/purchase/statistics'

defineOptions({
  name: 'SupplierTab',
})

const props = defineProps<{
  list: IGetPurchaseStatisticsSupplierItem[]
  total: number
  queryForm: IGetPurchaseStatisticsSupplierListReq
}>()
const date = defineModel<[string, string]>('date', { required: true })
const listLoading = defineModel<boolean>('listLoading', { required: true })
const emit = defineEmits<{
  (e: 'query-data'): void
  (e: 'handle-current-change', val: number): void
  (e: 'handle-size-change', val: number): void
  (e: 'on-show-product-detail', row: IGetPurchaseStatisticsSupplierItem): void
}>()

const queryData = () => {
  emit('query-data')
}

const handleCurrentChange = (val: number) => {
  emit('handle-current-change', val)
}

const handleSizeChange = (val: number) => {
  emit('handle-size-change', val)
}

const showProductDetail = (row: IGetPurchaseStatisticsSupplierItem) => {
  emit('on-show-product-detail', row)
}
</script>

<style lang="scss" scoped>
.supplier-tab-container {
  height: calc(var(--el-container-height) - var(--el-padding) - 52px) !important;
  display: flex;
  flex-direction: column;

  .vab-query-form {
    .left-panel {
      margin-bottom: 5px !important;
    }
    .el-form {
      .el-form-item:first-child {
        margin-bottom: 5px !important;

        .el-check-tag,
        .el-form-item__label {
          margin: 0 10px 5px 0;
          border-radius: 99px;
        }
      }
      .el-form-item:last-child {
        margin-bottom: 5px !important;
      }
    }
  }
  .el-table {
    flex: 1;
  }
}
</style>
