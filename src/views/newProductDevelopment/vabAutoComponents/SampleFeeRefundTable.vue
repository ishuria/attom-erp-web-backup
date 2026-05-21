<template>
  <div class="sample-fee-refund-table-container">
    <vab-query-form>
      <vab-query-form-left-panel v-if="props.status === 2" :span="props.status === 2 ? 12 : 0">
        <!-- 可退金额筛选 -->
        <el-form-item label="可退金额">
          <el-select v-model="queryForm.refundAmountZero" placeholder="请选择" @change="queryData">
            <el-option label="全部" :value="-1" />
            <el-option label="为0" :value="0" />
            <el-option label="非0" :value="1" />
          </el-select>
        </el-form-item>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="props.status === 2 ? 12 : 24">
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
    <el-table
      v-loading="listLoading"
      border
      :cell-class-name="clearPadding"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
      @cell-click="handleCellClick"
    >
      <el-table-column label="图片" prop="componentImg" width="75">
        <template #default="{ row }">
          <el-image
            v-if="row.componentImg"
            fit="fill"
            :src="row.componentImg"
            style="width: 75px; height: 75px"
            @click="handlePreviewImage(row.componentImg)"
          >
            <template #error>
              <el-icon />
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column v-if="props.status === 1" label="退款日期" prop="refundDate" width="115">
        <template #default="{ row }">
          {{ row.refundDate ? row.refundDate.split(' ')[0] : '' }}
        </template>
      </el-table-column>
      <el-table-column label="下单日期" width="115">
        <template #default="{ row }">
          {{ row.createTime ? row.createTime.split(' ')[0] : '' }}
        </template>
      </el-table-column>
      <el-table-column v-if="props.status === 2" label="更新日期" width="115">
        <template #default="{ row }">
          {{ row.updateTime ? row.updateTime.split(' ')[0] : '' }}
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="sku" width="350">
        <template #default="{ row }">
          <span v-for="(sku, index) in row.sku" :key="index">
            {{ sku }}
            <br />
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="产品"
        :min-width="Math.max(flexColumnWidth(list, '产品', 'productName'), flexColumnWidth(list, '产品', 'mainSearchTerms'))"
        prop="productName"
      >
        <template #default="{ row }">
          {{ row.productName }}
          <br />
          {{ row.mainSearchTerms }}
        </template>
      </el-table-column>
      <el-table-column label="零件名" :min-width="flexColumnWidth(list, '零件名', 'componentName')" prop="componentName" />
      <el-table-column label="供应商" :min-width="flexColumnWidth(list, '供应商', 'supplier')" prop="supplier" />
      <el-table-column label="1688单号" :min-width="flexColumnWidth(list, '1688单号', 'orderNo1688')" prop="orderNo1688" />
      <el-table-column align="center" label="是否定大货" min-width="110" prop="isBulkGoods">
        <template #default="{ row }">
          <el-tag v-if="row.isBulkGoods === 1" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="拿样人" min-width="100" prop="userName" />
      <el-table-column align="center" label="拿样金额" min-width="100" prop="price" />
      <el-table-column align="center" label="可退金额" min-width="100" prop="bulkGoodsReturnable" />
      <!-- 样品可退证明（VabSample 上传的可退拿样金额证明，可多张），未退款/已退款均展示 -->
      <el-table-column v-if="props.status !== 2" label="样品可退证明" prop="proofImages" width="100">
        <template #default="{ row }">
          <div v-if="row.proofImages && row.proofImages.length" class="proof-img-list">
            <el-image
              v-for="(img, index) in row.proofImages"
              :key="index"
              fit="cover"
              :initial-index="index"
              :preview-src-list="row.proofImages"
              :preview-teleported="true"
              :src="img"
              :z-index="3000"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="拿样备注" min-width="200" prop="remark">
        <template #default="{ row }">
          <el-tooltip content=" " effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.remark }}</div>
            </template>
            <div class="multi-line-ellipsis-1">{{ row.remark }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="样品费退还跟进备注" min-width="200" prop="refundRemark">
        <template #default="{ row }">
          <el-tooltip content=" " effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.refundRemark }}</div>
            </template>
            <div class="multi-line-ellipsis-1">{{ row.refundRemark }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- 退款凭证仅在「已退款」展示，且只读（未退款的凭证已在退款弹窗内上传） -->
      <el-table-column v-if="props.status === 1" label="退款凭证" prop="refundProof" width="90">
        <template #default="{ row }">
          <div class="image-cell">
            <div v-if="row.refundProof" class="image-preview">
              <img alt="" :src="row.refundProof" />
              <div class="image-actions">
                <el-icon @click="handlePreviewImage(row.refundProof)"><zoom-in /></el-icon>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="props.status === 0" align="center" fixed="right" label="操作" width="100">
        <template #default="{ row }">
          <el-link type="primary" underline="never" @click="handleRefund(row)">退款</el-link>
          <el-link type="danger" underline="never" @click="handleUnrefund(row)">不可退款</el-link>
        </template>
      </el-table-column>
      <!-- 已退款（status===1）的「取消退款」按钮暂时注释掉 -->
      <!-- <el-table-column v-if="props.status === 1" align="center" fixed="right" label="操作" width="100">
        <template #default="{ row }">
          <el-link type="primary" underline="never" @click="handleCancelRefund(row)">取消退款</el-link>
        </template>
      </el-table-column> -->
      <el-table-column v-if="props.status === 2" align="center" fixed="right" label="操作" width="100">
        <template #default="{ row }">
          <el-link type="primary" underline="never" @click="handleCancelRefund(row)">移动到未退款</el-link>
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
    <vab-remark-dialog
      v-model="refundRemarkVisible"
      :remark="selectedRow.refundRemark"
      title="样品费退还跟进备注"
      @update:remark="handleUpdateRemark"
    />
    <!-- 退款确认弹窗 -->
    <sample-fee-refund-dialog
      v-model="refundDialogVisible"
      :row="selectedRow"
      :submitting="refundSubmitting"
      @confirm="handleRefundConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { Search, ZoomIn } from '@element-plus/icons-vue'
import {
  confirmSampleFeeRefund,
  getSampleFeeRefundList,
  updateSampleFeeRefund,
  updateSampleFeeRefundRemark,
} from '/@/api/devlocal/progressSample'
import { ISampleFeeRefundItem } from '/@/type/progress/sampleAndComponentType'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'SampleFeeRefundTable',
})

interface Props {
  /**
   * 状态：0-未退款, 1-已退款, 2-不可退款
   */
  status: number
}
const emit = defineEmits(['imagePreview'])
const handlePreviewImage = (url: string) => {
  emit('imagePreview', url)
}
const props = defineProps<Props>()

const list = ref<ISampleFeeRefundItem[]>([])
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  status: props.status,
  refundAmountZero: -1,
})
const refundRemarkVisible = ref<boolean>(false)
const refundDialogVisible = ref<boolean>(false)
const refundSubmitting = ref<boolean>(false)
const handleUpdateRemark = async (remark: string) => {
  const { data } = await updateSampleFeeRefundRemark({
    id: selectedRow.sampleId,
    refundRemark: remark,
  })
  if (data) {
    $baseMessage('更新成功', 'success')
    refundRemarkVisible.value = false
    selectedRow.refundRemark = remark
  } else {
    $baseMessage('更新失败', 'error')
  }
}
let selectedRow: ISampleFeeRefundItem = {} as ISampleFeeRefundItem
const handleCellClick = (row: any, column: any) => {
  if (column.label === '样品费退还跟进备注') {
    refundRemarkVisible.value = true
    selectedRow = row
  }
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片' || data.column.label === '退款凭证') {
    return 'clear-padding'
  }
  return ''
}
// 查询数据
const fetchData = async () => {
  listLoading.value = true
  try {
    const { data } = await getSampleFeeRefundList({
      ...queryForm,
      status: props.status,
    })
    list.value = data.list || []
    total.value = data.total || 0
  } catch (error) {
    console.error('查询失败:', error)
  } finally {
    listLoading.value = false
  }
}

// 暴露方法给父组件
defineExpose({
  fetchData,
})
const queryData = async () => {
  queryForm.pageNo = 1
  fetchData()
}
// 分页变化
const handleCurrentChange = (pageNo: number) => {
  queryForm.pageNo = pageNo
  fetchData()
}

const handleSizeChange = (pageSize: number) => {
  queryForm.pageSize = pageSize
  queryForm.pageNo = 1
  fetchData()
}

// 退款操作：打开退款确认弹窗
const handleRefund = (row: any) => {
  selectedRow = row
  refundDialogVisible.value = true
}
// 退款确认：携带凭证、识别金额、原因提交
const handleRefundConfirm = async (payload: { refundAmount: number; refundReason: string }) => {
  if (refundSubmitting.value) return
  refundSubmitting.value = true
  try {
    const { data } = await confirmSampleFeeRefund({
      id: selectedRow.sampleId,
      status: 1,
      refundAmount: payload.refundAmount,
      refundReason: payload.refundReason,
    })
    if (data) {
      $baseMessage('退款成功', 'success')
      refundDialogVisible.value = false
      fetchData()
    } else {
      $baseMessage('退款失败', 'error')
    }
  } finally {
    refundSubmitting.value = false
  }
}
const handleUnrefund = async (row: any) => {
  const { data } = await updateSampleFeeRefund({
    id: row.sampleId,
    refundStatus: 2,
  })
  if (data) {
    $baseMessage('不可退款成功', 'success')
    fetchData()
  } else {
    $baseMessage('不可退款失败', 'error')
  }
}
const handleCancelRefund = (row: any) => {
  const confirmText = props.status === 1 ? '确定要取消退款吗' : '确定要移动到未退款吗'
  $baseConfirm(confirmText, '系统提示', async () => {
    const { data } = await updateSampleFeeRefund({
      id: row.sampleId,
      refundStatus: 0,
    })
    if (data) {
      $baseMessage('取消退款成功', 'success')
      fetchData()
    } else {
      $baseMessage('取消退款失败', 'error')
    }
  })
}

// 监听状态变化，更新查询表单状态（不自动查询，由父组件控制）
watch(
  () => props.status,
  (newStatus) => {
    queryForm.status = newStatus
  }
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
// 样品可退证明缩略图列表
.proof-img-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px 0;

  .el-image {
    width: 40px;
    height: 40px;
    cursor: pointer;
    border: 1px solid var(--el-border-color);
    border-radius: 2px;
  }
}
// 图片样式
.image-cell {
  width: 100%;
  height: 75px;

  // 有图片时的样式
  .image-preview {
    position: relative;
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
      object-fit: fill;
    }

    .image-actions {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0);
      opacity: 0;
      transition: all 0.3s ease;

      .el-icon {
        font-size: 20px;
        color: #fff;
        cursor: pointer;

        &:hover {
          transform: scale(1.1);
        }
      }
    }

    &:hover .image-actions {
      background: rgba(0, 0, 0, 0.45); // 悬停时的背景色
      opacity: 1; // 悬停时完全显示
    }
  }
  // 没图片时的样式
  .upload-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);

    &:hover {
      border-color: var(--el-color-primary);
      .el-icon {
        color: var(--el-color-primary);
      }
    }

    .el-icon {
      font-size: 20px;
      color: #999;
    }
  }
}
</style>
