<template>
  <div class="component-tab-container">
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
          <el-form-item label="">
            <el-select v-model="queryForm.type" placeholder="请选择类型" @change="queryData">
              <el-option label="全部类型" :value="-1" />
              <el-option label="零件" :value="0" />
              <el-option label="耗材" :value="1" />
            </el-select>
          </el-form-item>
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
      <el-table-column label="零件图片" prop="amount" width="91">
        <template #default="{ row }">
          <el-image
            :src="row.componentImgUrl"
            style="width: 65px; height: 65px; display: block"
            @click="showImagePreview(row.componentImgUrl)"
          >
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="零件ID" prop="id" />
      <el-table-column label="零件名" :min-width="flexColumnWidth(list, '零件名', 'componentName')" prop="componentName" />
      <el-table-column align="center" label="类型" prop="type">
        <template #default="{ row }">
          <el-tag :type="row.type === 0 ? 'success' : 'warning'">
            {{ row.type === 0 ? '零件' : '耗材' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="零件采购总额(￥)" min-width="120" prop="componentPurchaseAmount" />
      <el-table-column label="供应商" :min-width="calculateBrColumnWidth(list, (row: any) => row._supplierName)" prop="supplierName">
        <template #default="{ row }">
          <el-tooltip content=" " :disabled="!row.overflow_supplierName" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row._supplierNameFull }}</div>
            </template>
            <span v-html="row._supplierName"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="采购总额(￥)" min-width="110" prop="totalPurchaseAmount">
        <template #default="{ row }">
          <el-tooltip content=" " :disabled="!row.overflow_totalPurchaseAmount" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row._totalPurchaseAmountFull }}</div>
            </template>
            <span v-html="row._totalPurchaseAmount"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="采购总数" min-width="100" prop="purchaseCount">
        <template #default="{ row }">
          <el-tooltip content=" " :disabled="!row.overflow_purchaseCount" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row._purchaseCountFull }}</div>
            </template>
            <span v-html="row._purchaseCount"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="单位" prop="unit">
        <template #default="{ row }">
          <el-tooltip content=" " :disabled="!row.overflow_unit" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row._unitFull }}</div>
            </template>
            <span v-html="row._unit"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="SKU" :min-width="calculateBrColumnWidth(list, (row: any) => row._sku)" prop="sku">
        <template #default="{ row }">
          <el-tooltip content=" " :disabled="!row.overflow_sku" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row._skuFull }}</div>
            </template>
            <span v-html="row._sku"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="产品经理" prop="productManagerName">
        <template #default="{ row }">
          <el-tooltip content=" " :disabled="!row.overflow_productManagerName" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row._productManagerNameFull }}</div>
            </template>
            <span v-html="row._productManagerName"></span>
          </el-tooltip>
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
import { calculateBrColumnWidth, flexColumnWidth } from '~/src/utils/tableColum'
import { IGetPurchaseStatisticsProductItem, IGetPurchaseStatisticsSupplierListReq } from '/@/type/purchase/statistics'

defineOptions({
  name: 'ComponentTab',
})

const props = defineProps<{
  list: IGetPurchaseStatisticsProductItem[]
  total: number
  queryForm: IGetPurchaseStatisticsSupplierListReq
}>()
const date = defineModel<[string, string]>('date', { required: true })
const listLoading = defineModel<boolean>('listLoading', { required: true })
const emit = defineEmits<{
  (e: 'query-data'): void
  (e: 'handle-current-change', val: number): void
  (e: 'handle-size-change', val: number): void
  (e: 'on-show-image-preview', url: string): void
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

const showImagePreview = (url: string) => {
  emit('on-show-image-preview', url)
}
</script>

<style lang="scss" scoped>
.component-tab-container {
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
    .clear-padding {
      padding-top: 0px !important;
      padding-bottom: 0px !important;
      .cell {
        padding-right: 0px !important;
        padding-left: 0px !important;
      }
    }
  }
}
</style>
