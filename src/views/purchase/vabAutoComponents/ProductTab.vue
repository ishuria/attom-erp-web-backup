<template>
  <div class="supplier-tab-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item>
            <el-date-picker
              v-model="date"
              :clearable="false"
              :disabled-date="(time: Date) => time.getTime() > Date.now()"
              type="daterange"
              @change="queryData"
            />
          </el-form-item>
          <el-form-item label="站点">
            <el-select
              v-model="queryForm.sites"
              class="multiple-select"
              clearable
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
              multiple
              placeholder="全部站点"
              style="width: 250px"
              @change="queryData"
            >
              <template #header>
                <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">所有</el-checkbox>
              </template>
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="站点聚合">
            <el-checkbox v-model="queryForm.siteAggregate" :false-value="0" :true-value="1" />
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keydown.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table v-loading="listLoading" border :data="list" stripe>
      <el-table-column type="selection" width="38" />
      <el-table-column label="SKU" prop="sku">
        <template #default="{ row }">
          <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)">
            {{ row.sku }}
            <vab-icon icon="file-copy-2-fill" />
          </span>
          <br />
          {{ row.productName }}
        </template>
      </el-table-column>
      <el-table-column label="图片" width="82">
        <template #default="{ row }">
          <el-image :src="row.skuImageUrl" style="width: 100%; height: 100%" @click="showImagePreview(row.skuImageUrl)">
            <template #error>
              <el-icon />
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="站点" prop="siteName" />
      <el-table-column label="采购量柱状图" />
      <el-table-column label="SKU采购总套数" />
      <el-table-column label="SKU采购总额" />
      <el-table-column label="SKU采购平均值" />
      <el-table-column label="主体供应商" />
      <el-table-column label="SKU零件数量" />
      <el-table-column label="产品经理" />

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
import { CheckboxValueType } from 'element-plus'
import { IGetPurchaseStatisticsProductListReq, IGetPurchaseStatisticsSupplierItem } from '/@/type/purchase/statistics'
import handleClipboard from '/@/utils/clipboard'

defineOptions({
  name: 'ProductTab',
})

const props = defineProps<{
  list: IGetPurchaseStatisticsSupplierItem[]
  total: number
  queryForm: IGetPurchaseStatisticsProductListReq
  siteList: { id: number; label: string }[]
}>()
const date = defineModel<[string, string]>('date', { required: true })
const listLoading = defineModel<boolean>('listLoading', { required: true })
const emit = defineEmits<{
  (e: 'query-data'): void
  (e: 'handle-current-change', val: number): void
  (e: 'handle-size-change', val: number): void
  (e: 'on-show-image-preview', url: string): void
}>()

const checkAll = ref<boolean>(false)
const indeterminate = ref<boolean>(false)
const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    props.queryForm.sites = props.siteList.map((_) => _.id)
    // 全选的时候获取数据
    queryData()
  } else {
    props.queryForm.sites = []
    // 取消全选获取数据
    queryData()
  }
}
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
