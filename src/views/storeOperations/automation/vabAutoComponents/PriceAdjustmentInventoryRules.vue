<template>
  <div class="price-adjustment-inventory-rules-tab">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline :model="queryForm">
          <el-form-item>
            <el-button type="primary">批量修改</el-button>
            <el-button type="primary">默认参数</el-button>
          </el-form-item>
          <el-form-item label="站点">
            <el-select v-model="queryForm.sites" placeholder="请选择站点" @change="handleQueryData">
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="运营">
            <el-select v-model="queryForm.operationUserId" placeholder="请选择运营人员" @change="handleQueryData">
              <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="handleQueryData"
              @keyup.enter="handleQueryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="loading" type="primary" @click="handleQueryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table v-loading="loading" border :cell-style="cellStyle" :data="list" :header-cell-style="{ textAlign: 'center' }" stripe>
      <el-table-column fixed="left" type="selection" width="38" />
      <el-table-column label="图片" width="75">
        <template #default="{ row }">
          <el-image fit="fill" :src="row.skuImg" style="display: block; width: 75px; height: 75px" @click="handleImagePreview(row.skuImg)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="sku" />
      <el-table-column label="站点" prop="siteName" width="135" />
      <el-table-column label="运营" prop="operationUser" width="95" />
      <el-table-column label="规则开关" prop="ruleStatus" width="95">
        <template #default="{ row }">
          <el-switch
            v-model="row.ruleStatus"
            :active-value="1"
            :inactive-value="0"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          />
        </template>
      </el-table-column>
      <el-table-column label="最低价" prop="minPrice" />
      <el-table-column label="最高价" prop="maxPrice" />
      <el-table-column label="提高价格（满足全部条件）">
        <el-table-column label="剩余可售天数≤" min-width="125" prop="openDays" />
        <el-table-column label="可售总库存数≤" min-width="125" prop="openStock" />
        <el-table-column label="断货天数≥" min-width="95" prop="openOutStockDays" />
        <el-table-column label="Rating≥" min-width="90" prop="openAdvAcos" />
      </el-table-column>
      <el-table-column label="降低价格条件组1（满足全部条件）">
        <el-table-column label="断货天数≤" min-width="95" prop="closeOutStockDays" />
        <el-table-column label="剩余可售天数≥" min-width="125" prop="closeAdvAcos" />
        <el-table-column label="剩余含在途可售天数≥" min-width="125" prop="closeRating" />
        <el-table-column label="可售总库存数≥" min-width="125" prop="closeGrossProfit" />
      </el-table-column>
      <el-table-column label="降低价格条件组2">
        <el-table-column label="Rating≤" min-width="110" prop="openAdvAcos" />
      </el-table-column>
      <el-table-column label="系统最新操作日期" prop="lastUpdateTime" width="110">
        <template #header>
          系统最新
          <br />
          操作日期
        </template>
      </el-table-column>
      <el-table-column label="价格" />
      <el-table-column label="操作结果" prop="operationResult" width="100">
        <template #default="{ row }">
          <el-tag :type="row.operationResult === 0 ? 'danger' : 'success'">
            {{ row.operationResult === 0 ? '失败' : '成功' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-link type="primary" underline="never">系统操作日志</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <vab-pagination
      :page-no="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'
import { IAutoMationQueryReq } from '/@/type/storeOperation/autoMation'

defineOptions({
  name: 'PriceAdjustmentInventoryRules',
})

interface Props {
  siteList: Array<{ id: number; label: string }>
  operateUserList: Array<{ id: number; label: string }>
  list: Array<any>
  loading: boolean
  total: number
}
const props = defineProps<Props>()
const queryForm = defineModel<IAutoMationQueryReq>('queryForm', { required: true })
const emit = defineEmits<{
  'image-preview': [url: string]
  'query-data': []
  'size-change': [value: number]
  'current-change': [value: number]
}>()

const handleSizeChange = (value: number) => {
  emit('size-change', value)
}
const handleCurrentChange = (value: number) => {
  emit('current-change', value)
}
const handleQueryData = () => {
  emit('query-data')
}
const handleImagePreview = (url: string) => {
  emit('image-preview', url)
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === 'SKU') {
    return {
      textAlign: 'left',
    }
  } else if (label !== '站点' && label !== '运营') {
    return {
      cursor: 'pointer',
      textAlign: 'center',
    }
  }
  return {
    textAlign: 'center',
  }
}
</script>

<style lang="scss" scoped>
.price-adjustment-inventory-rules-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-table {
    flex: 1;
  }
}
</style>
