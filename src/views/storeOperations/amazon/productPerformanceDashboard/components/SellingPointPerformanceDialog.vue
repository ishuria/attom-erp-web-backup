<template>
  <vab-dialog v-model="visible" title="5 点优化" width="640px" :close-on-click-modal="false" @close="handleClose">
    <div class="selling-point-performance-dialog">
      <div v-if="skuLabel" class="sku-meta">
        <span class="sku-meta-label">当前 SKU</span>
        <span class="sku-meta-value">{{ skuLabel }}</span>
      </div>
      <el-form :model="form" label-position="right" label-width="120px">
        <el-form-item label="产品主品名">
          <el-input v-model="form.productName" placeholder="可选" maxlength="200" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="核心关键词">
          <el-input v-model="form.coreKeywordsUser" type="textarea" :rows="2" placeholder="可选，使用换行或逗号分隔" />
        </el-form-item>
        <el-form-item label="主卖点">
          <el-input v-model="form.mainSellingPoints" type="textarea" :rows="4" placeholder="可选，每条卖点一行" />
        </el-form-item>
        <el-form-item label="竞品 ASIN">
          <el-input v-model="form.competitorAsins" type="textarea" :rows="2" placeholder="可选，多个 ASIN 用逗号分隔" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">提交</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { SellingPointPerformancePayload } from '/@/type/ai/chat'

defineOptions({
  name: 'SellingPointPerformanceDialog',
})

const props = defineProps<{
  row: any
  submitting?: boolean
}>()

const visible = defineModel<boolean>('visible', { required: true })

const emit = defineEmits<{
  submit: [payload: SellingPointPerformancePayload]
}>()

const createEmptyForm = () => ({
  productName: '',
  coreKeywordsUser: '',
  mainSellingPoints: '',
  competitorAsins: '',
})

const form = reactive(createEmptyForm())

const skuLabel = computed(() => {
  const row = props.row
  if (!row) return ''
  return row.sku || row.asin || ''
})

const handleSubmit = () => {
  const operationSkuId = props.row?.id
  if (operationSkuId == null || operationSkuId === '') {
    $baseMessage('当前数据缺少业务标识，无法发起 5 点优化', 'error')
    return
  }
  const payload: SellingPointPerformancePayload = { operationSkuId }
  const productName = form.productName.trim()
  const coreKeywordsUser = form.coreKeywordsUser.trim()
  const mainSellingPoints = form.mainSellingPoints.trim()
  const competitorAsins = form.competitorAsins.trim()
  if (productName) payload.productName = productName
  if (coreKeywordsUser) payload.coreKeywordsUser = coreKeywordsUser
  if (mainSellingPoints) payload.mainSellingPoints = mainSellingPoints
  if (competitorAsins) payload.competitorAsins = competitorAsins
  emit('submit', payload)
}

const handleClose = () => {
  Object.assign(form, createEmptyForm())
}
</script>

<style lang="scss" scoped>
.selling-point-performance-dialog {
  padding: 0 4px;
}

.sku-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.sku-meta-label {
  color: var(--el-text-color-secondary);
}

.sku-meta-value {
  font-weight: 600;
  color: var(--el-text-color-primary);
}
</style>
