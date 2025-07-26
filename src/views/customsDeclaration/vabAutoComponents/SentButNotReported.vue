<template>
  <!-- 已发未报 -->
  <vab-dialog v-model="visible" :draggable="false" class="dialog" title="已发未报" top="10vh" width="65%">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form inline :model="querySentForm" @submit.prevent>
          <el-form-item label="分类">
            <el-check-tag :checked="tab === 0" @change="onChangeStatus(0)">聚合</el-check-tag>
            <el-check-tag :checked="tab === 1" @change="onChangeStatus(1)">明细</el-check-tag>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
    </vab-query-form>
    <!-- 明细 -->
    <div v-if="tab === 1">
      <vab-query-form>
        <vab-query-form-right-panel :span="24">
          <el-form inline :model="querySentForm" @submit.prevent>
            <el-form-item>
              <el-input
                v-model.trim="querySentForm.keyWord"
                clearable
                placeholder="请输入搜索关键词"
                @input="querySentData"
                @keyup.enter="querySentData"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="sentListLoading" native-type="submit" type="primary" @click="querySentData" />
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table
        v-loading="sentListLoading"
        border
        class="noneHoveTable"
        :data="sentList"
        :header-cell-style="{ textAlign: 'center' }"
        :row-class-name="tableRowClassName"
        stripe
        style="height: calc(80vh - 200px); max-height: calc(80vh - 200px)"
        @cell-click="changeInput"
        @selection-change="setSelectRows"
      >
        <el-table-column label="Shipment ID" prop="shipmentId" :width="flexColumnWidth(sentList, 'Shipment-ID-', 'shipmentId')" />
        <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(sentList, 'SKU', 'sku')" />
        <el-table-column label="描述" prop="desc" :width="flexColumnWidth(sentList, '描述', 'desc')" />
        <el-table-column align="center" label="PO" prop="po" width="100" />
        <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(sentList, '零件名', 'componentName')" />
        <el-table-column
          align="center"
          label="PO零件数"
          prop="purchaseCount"
          :width="flexColumnWidth(sentList, 'PO零件数', 'purchaseCount')"
        />
        <el-table-column align="center" label="总发货数" prop="shippedQuantity" width="100" />
        <el-table-column align="center" label="总报关数" prop="customQuantity" width="100" />
        <el-table-column label="采购方" min-width="90" prop="purchase" :width="flexColumnWidth(sentList, '采购方', 'purchase')" />
        <el-table-column label="备注" min-width="100" prop="remark">
          <template #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.remark) }}</div>
              </template>
              <el-text style="vertical-align: middle" truncated>{{ removeHtmlTags(row.remark) }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <vab-pagination
        :current-page="querySentForm.pageNo"
        :page-size="querySentForm.pageSize"
        :total="sentTotal"
        @current-change="handleCurrentSentChange"
        @size-change="handleSizeSentChange"
      />
    </div>
    <!-- 聚合 -->
    <div v-if="tab === 0">
      <vab-query-form>
        <vab-query-form-left-panel>
          <template v-if="shipId">
            <el-button type="primary" @click="handleArchiveAgg">归档</el-button>
          </template>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel>
          <el-form inline :model="aggregationReq" @submit.prevent>
            <el-form-item>
              <el-input
                v-model.trim="aggregationReq.keyWord"
                clearable
                placeholder="请输入搜索关键词"
                @input="queryAggregationData"
                @keyup.enter="queryAggregationData"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                :icon="Search"
                :loading="aggregationListLoading"
                native-type="submit"
                type="primary"
                @click="queryAggregationData"
              />
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table
        v-loading="aggregationListLoading"
        border
        class="noneHoveTable"
        :data="aggregationList"
        :header-cell-style="{ textAlign: 'center' }"
        stripe
        @selection-change="setSelectAggRows"
        style="height: calc(80vh - 230px); max-height: calc(80vh - 230px)"
      >
        <el-table-column v-if="shipId" align="center" type="selection" />
        <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(aggregationList, 'SKU', 'sku')" />
        <el-table-column label="描述" prop="desc" :width="flexColumnWidth(aggregationList, '描述', 'desc')" />
        <el-table-column align="center" label="PO" prop="po" width="100" />
        <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(aggregationList, '零件名', 'componentName')" />
        <el-table-column
          align="center"
          label="PO零件数"
          prop="purchaseCount"
          :width="flexColumnWidth(aggregationList, 'PO零件数', 'purchaseCount')"
        />
        <el-table-column align="center" label="已发未报" min-width="120" prop="yfwbCount" />
        <el-table-column align="center" label="已报未发" min-width="120" prop="ybwfCount" />
        <el-table-column align="center" label="待发货" min-width="100" prop="pendingShipment" />
        <el-table-column align="center" label="待报关" min-width="100" prop="pendingCustomsClearance" />
        <el-table-column label="采购方" prop="purchase" :width="flexColumnWidth(aggregationList, '采购方', 'purchase')" />
      </el-table>
      <vab-pagination
        :current-page="aggregationReq.pageNo"
        :page-size="aggregationReq.pageSize"
        :total="aggregationTotal"
        @current-change="handleCurrentAggChange"
        @size-change="handleSizeAggChange"
      />
    </div>

    <template #footer v-if="shipId">
      <div v-if="tab === 0" style="text-align: center">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmAgg">确认</el-button>
      </div>
    </template>
  </vab-dialog>
  <vab-remark-dialog v-model="remarkVisible" :remark="remark" title="修改备注" @update:remark="handleUpdateRemark" />
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import {
  archiveShipmentYfwbAggregation,
  getMatchSentList,
  getShipmentYfwbAggregationList,
  submitMatchSentList,
  updateShipmentYfwbRemark,
} from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { IGetMatchPoListReq, IGetMatchSentList, IGetYfwbAggregationList } from '/@/type/customsDeclarationAndTaxRefund/matchPo'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'

defineOptions({
  name: 'SentButNotReported',
})

const props = defineProps<{
  modelValue: boolean
  shipId?: number
}>()
const emit = defineEmits(['update:modelValue', 'query-data'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const querySentForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const sentTotal = ref<number>(0)
const sentListLoading = ref<boolean>(false)
const sentList = ref<IGetMatchSentList[]>([])
const tab = ref<number>(0)
let copyRow: any
const aggregationTotal = ref<number>(0)
const aggregationListLoading = ref<boolean>(false)
const aggregationList = ref<IGetYfwbAggregationList[]>([])
const aggregationReq = reactive<IGetMatchPoListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const remark = ref<string>('')
const remarkVisible = ref<boolean>(false)

// 已发未报-明细多选
const selectRows = ref<IGetMatchSentList[]>([])
const setSelectRows = (value: IGetMatchSentList[]) => {
  selectRows.value = value
}
// 已发未报-聚合多选
const selectAggRows = ref<IGetYfwbAggregationList[]>([])
const setSelectAggRows = (value: IGetYfwbAggregationList[]) => {
  selectAggRows.value = value
}

const handleUpdateRemark = async (value: string) => {
  const { data } = await updateShipmentYfwbRemark({
    id: copyRow.id,
    remark: value,
  })
  if (data) {
    $baseMessage('修改备注成功!', 'success')
    remarkVisible.value = false
    copyRow.remark = value
  }
}
const handleConfirmAgg = async () => {
  if (selectAggRows.value.length === 0) {
    $baseMessage('您未选中任何行!', 'warning')
    return
  }
  const valid = selectAggRows.value.every((item) => item.pendingCustomsClearance && item.pendingCustomsClearance > 0)
  // const req = selectAggRows.value.map((item) => {
  //   return {
  //     poId: item.poId!,
  //     poComponentId: item.poComponentId!,
  //     sku: item.sku!,
  //   }
  // })
  let req: number[] = []
  selectAggRows.value.forEach((item) => {
    req.push(item.id)
  })
  if (valid) {
    const { data } = await submitMatchSentList({
      id: props.shipId!,
      list: req,
    })
    if (data) {
      $baseMessage('确认成功！', 'success')
      visible.value = false
      emit('query-data')
    }
  } else {
    $baseMessage('待报关数量不能为空或者不能为0', 'error')
    return
  }
}
// 已发未报-聚合归档
const handleArchiveAgg = async () => {
  if (selectAggRows.value.length === 0) {
    $baseMessage('您未选择任何行!', 'warning')
    return
  }
  $baseConfirm('确定要归档吗？', null, async () => {
    const req = selectAggRows.value.map((item) => {
      return {
        poId: item.poId!,
        poComponentId: item.poComponentId!,
        sku: item.sku!,
        id: item.id,
      }
    })
    const { data } = await archiveShipmentYfwbAggregation(req)
    if (data) {
      $baseMessage('聚合归档成功！', 'success')
      queryAggregationData()
    }
  })
}
const handleCurrentAggChange = (value: number) => {
  aggregationReq.pageNo = value
  fetchAggregationData()
}
const handleSizeAggChange = (value: number) => {
  aggregationReq.pageNo = 1
  aggregationReq.pageSize = value
  fetchAggregationData()
}
const queryAggregationData = () => {
  aggregationReq.pageNo = 1
  fetchAggregationData()
}
const changeInput = (row: any, column: any) => {
  if (column.label === '备注') {
    copyRow = row
    remarkVisible.value = true
    remark.value = row.remark
  }
}
const onChangeStatus = (value: number) => {
  tab.value = value
  if (tab.value === 0) {
    queryAggregationData()
  } else {
    querySentData()
  }
}
const querySentData = () => {
  querySentForm.pageNo = 1
  fetchSentData()
}
const handleCurrentSentChange = (value: number) => {
  querySentForm.pageNo = value
  fetchSentData()
}
const handleSizeSentChange = (value: number) => {
  querySentForm.pageNo = 1
  querySentForm.pageSize = value
  fetchSentData()
}
// 已发未报明细 获取数据
const fetchSentData = async () => {
  sentListLoading.value = true
  const { data } = await getMatchSentList(querySentForm)
  sentTotal.value = data.total
  sentList.value = data.list
  sentListLoading.value = false
}
// 已发未报 聚合获取数据
const fetchAggregationData = async () => {
  aggregationListLoading.value = true
  const { data } = await getShipmentYfwbAggregationList(aggregationReq)
  aggregationTotal.value = data.total
  aggregationList.value = data.list
  aggregationListLoading.value = false
}
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (!row.shipmentId) {
    return 'danger-row'
  }
}
onBeforeMount(() => {
  fetchAggregationData()
})
</script>

<style lang="scss" scoped>
.dialog {
  .el-dialog {
    height: 80vh;
    max-height: 80vh;
  }
  .vab-query-form {
    .top-panel {
      .el-form {
        .el-form-item:first-child {
          // margin: 0 !important;

          .el-check-tag,
          .el-form-item__label {
            margin: 0 10px 5px 0;
            border-radius: 99px;
          }
        }
      }
    }
  }

  .fixed-header {
    position: sticky;
    top: 0;
    z-index: 2;
    padding-bottom: 10px;
    background: #fff;
  }

  .table-container {
    height: calc(100vh - 220px);
    margin-top: 10px;
    overflow-y: auto;

    :deep(.el-table__header-wrapper) {
      position: sticky;
      top: 0;
      z-index: 1;
    }
  }
}
.noneHoveTable {
  :deep() {
    .danger-row > td {
      background-color: var(--el-color-danger-light-9) !important;
    }

    td {
      background-color: #ffffff !important;
    }
  }
}
</style>
