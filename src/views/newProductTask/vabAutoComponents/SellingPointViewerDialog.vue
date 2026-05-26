<template>
  <vab-dialog v-model="visible" title="查看卖点" top="4vh" width="96%" @close="handleClose">
    <div v-loading="loading" class="selling-point-dialog">
      <template v-if="sku">
        <div class="selling-point-header">
          <span class="sku-label">当前 SKU</span>
          <span class="sku-text">{{ sku }}</span>
        </div>

        <div class="selling-point-layout">
          <section class="selling-point-panel">
            <div v-for="field in leftTopFields" :key="field.label" class="readonly-field">
              <div class="readonly-label">{{ field.label }}</div>
              <div class="readonly-box" :class="field.className">{{ formatFieldValue(field.value) }}</div>
            </div>
            <div v-for="field in asinFields" :key="field.label" class="readonly-field">
              <div class="readonly-label">{{ field.label }}</div>
              <div class="readonly-box">
                <div v-if="field.list.length" class="asin-list">
                  <span v-for="asin in field.list" :key="asin" target="_blank" type="primary" underline="never">
                    {{ asin }}
                  </span>
                </div>
                <span v-else>暂无</span>
              </div>
            </div>
            <div v-for="field in leftBottomFields" :key="field.label" class="readonly-field">
              <div class="readonly-label">{{ field.label }}</div>
              <div v-if="field.isHtml" class="readonly-box readonly-box-html" :class="field.className">
                <wang-editor-viewer :content="getRichContent(field.value)" />
              </div>
              <div v-else class="readonly-box" :class="field.className">{{ formatFieldValue(field.value) }}</div>
            </div>
          </section>

          <section class="selling-point-panel selling-point-panel-main">
            <div class="readonly-field">
              <div class="readonly-label">功能/卖点/5点（重要性从高到低排列）</div>
              <div class="readonly-box readonly-box-giant">{{ formatFieldValue(detail.sellingPointContent) }}</div>
            </div>
          </section>

          <section class="selling-point-panel">
            <div v-for="field in rightFields" :key="field.label" class="readonly-field">
              <div class="readonly-label">{{ field.label }}</div>
              <div class="readonly-box" :class="field.className">{{ formatFieldValue(field.value) }}</div>
            </div>
          </section>
        </div>
      </template>
    </div>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { getArtDesignSelectionReasons, getArtDesignSellingPoint } from '/@/api/devlocal/imageTask'
import type { IGetSellingPoint } from '/@/type/listingTask/imageTaskType'

defineOptions({
  name: 'SellingPointDialog',
})

const props = defineProps<{
  sku: string
}>()

const visible = defineModel<boolean>('visible', {
  required: true,
})

const createEmptyDetail = (): IGetSellingPoint => ({
  id: null,
  competitiveAsin: '',
  competitiveProductDifferences: '',
  targetAudience: '',
  usageScenario: '',
  precautions: '',
  sellingPointContent: '',
  title1: '',
  title2: '',
  linkKeywordsTs: '',
  sellingPointContentTs: '',
})

const loading = ref(false)
const detail = reactive<IGetSellingPoint>(createEmptyDetail())
const selectionReasonOptions = ref<{ id: number; label: string }[]>([])
let requestIndex = 0

const splitAsinList = (value?: string) =>
  (value || '')
    .split(/[\n,，\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)

const asinFields = computed(() => [
  { label: '竞品ASIN', list: splitAsinList(detail.competitiveAsin) },
  { label: '同赛道ASIN', list: splitAsinList(detail.sameTrackAsin) },
])

const productDifferencesOptions = [
  { id: 0, label: '非常大' },
  { id: 1, label: '大' },
  { id: 2, label: '中' },
  { id: 3, label: '小' },
  { id: 4, label: '无差异化' },
]

const leftTopFields = computed(() => [
  { label: '产品差异化程度', value: getProductDifferencesLabel(detail.productDifferences) },
  { label: '选品理由一句话概括', value: getSelectionReasonLabel(detail.summary) },
  { label: '主要卖点以及与竞品相比差异化的地方', value: detail.competitiveProductDifferences, className: 'readonly-box-large' },
  { label: '目标客群', value: detail.targetAudience, className: 'readonly-box-large' },
  { label: '产品使用场景', value: detail.usageScenario },
  { label: '材质', value: detail.material },
  { label: '本产品知名品牌', value: detail.brand },
])

const leftBottomFields = computed(() => [
  { label: '链接关键词', value: detail.linkKeywords, className: 'readonly-box-large', isHtml: false },
  { label: '图片配色，风格和道具选用要求拍摄注意事项', value: detail.precautions, className: 'readonly-box-extra-large', isHtml: true },
])

const rightFields = computed(() => [
  { label: '标题1', value: detail.title1, className: 'readonly-box-large' },
  { label: '标题2', value: detail.title2, className: 'readonly-box-large' },
  { label: '链接关键词(译文)', value: detail.linkKeywordsTs, className: 'readonly-box-large' },
  { label: '功能/卖点/5点(译文)', value: detail.sellingPointContentTs, className: 'readonly-box-tall' },
])

const resetDetail = () => {
  Object.assign(detail, createEmptyDetail())
}

const fetchSelectionReasonOptions = async () => {
  if (selectionReasonOptions.value.length) return
  try {
    const { data } = await getArtDesignSelectionReasons()
    selectionReasonOptions.value = data
  } catch (error) {
    console.error('获取选品理由下拉列表失败:', error)
  }
}

const fetchSellingPoint = async () => {
  if (!visible.value || !props.sku) return
  const currentRequest = ++requestIndex

  try {
    loading.value = true
    resetDetail()
    const [{ data }] = await Promise.all([getArtDesignSellingPoint({ sku: props.sku }), fetchSelectionReasonOptions()])
    if (currentRequest === requestIndex) {
      Object.assign(detail, createEmptyDetail(), data)
    }
  } catch (error) {
    console.error('获取卖点详情失败:', error)
  } finally {
    if (currentRequest === requestIndex) {
      loading.value = false
    }
  }
}

const handleClose = () => {
  requestIndex += 1
  loading.value = false
}

const getAmazonAsinUrl = (asin: string) => `https://www.amazon.com/dp/${asin}`
const getProductDifferencesLabel = (value?: number) => {
  return productDifferencesOptions.find((item) => item.id === value)?.label || '暂无'
}
const getSelectionReasonLabel = (value?: number | null) => {
  if (value === undefined || value === null) return '暂无'
  return selectionReasonOptions.value.find((item) => item.id === Number(value))?.label || String(value)
}
const formatFieldValue = (value?: string | number | null) => String(value ?? '') || '暂无'

// wangEditor 存的「视觉空」HTML (<p><br></p>) 要识别成空，让 viewer 显示 el-empty
const getRichContent = (value?: string | null): string => {
  if (!value) return ''
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = value
  const hasImage = tempDiv.querySelector('img') !== null
  const text = (tempDiv.textContent || '').trim()
  return hasImage || text ? value : ''
}

watch(
  () => [visible.value, props.sku],
  () => {
    fetchSellingPoint()
  }
)
</script>

<style lang="scss" scoped>
.selling-point-dialog {
  min-height: 260px;
  max-height: 78vh;
  overflow: auto;
  padding-right: 4px;
}

.selling-point-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: fit-content;
  max-width: 100%;
  margin-bottom: 18px;
  padding: 0 0 0 12px;
  border-left: 4px solid var(--el-color-primary);
  color: var(--el-text-color-primary);
}

.sku-label {
  align-self: flex-start;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
}

.sku-text {
  overflow-wrap: anywhere;
  align-self: flex-start;
  color: var(--el-color-primary);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
}

.selling-point-header-tip {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.selling-point-layout {
  display: grid;
  grid-template-columns: minmax(380px, 1.12fr) minmax(420px, 1fr) minmax(360px, 0.95fr);
  gap: 18px;
  align-items: flex-start;
  min-width: 1180px;
  padding-bottom: 10px;
}

.selling-point-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.selling-point-panel-main {
  position: sticky;
  top: 0;
}

.readonly-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.readonly-label {
  color: var(--el-text-color-primary);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
}

.readonly-box {
  width: 100%;
  min-height: 42px;
  padding: 12px 14px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  background: #f8fafc;
  color: var(--el-text-color-regular);
  font-size: 16px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
}

.asin-list :deep(.el-link) {
  font-size: 16px;
}

.readonly-box-large {
  min-height: 86px;
}

.readonly-box-extra-large {
  min-height: 170px;
}

.readonly-box-html {
  padding: 8px 10px;
  white-space: normal;

  :deep(img) {
    max-width: 100%;
    height: auto;
  }

  :deep(.el-empty) {
    padding: 12px 0;
  }
}

.readonly-box-tall {
  min-height: 520px;
}

.readonly-box-giant {
  min-height: 900px;
}

.asin-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
}

@media (max-width: 1280px) {
  .selling-point-layout {
    grid-template-columns: minmax(340px, 1fr) minmax(380px, 1fr) minmax(340px, 1fr);
    min-width: 1080px;
  }
}

@media (max-width: 900px) {
  .selling-point-dialog {
    max-height: 76vh;
  }

  .selling-point-layout {
    grid-template-columns: 1fr;
    min-width: 0;
  }

  .selling-point-panel-main {
    position: static;
  }

  .readonly-box-tall,
  .readonly-box-giant {
    min-height: 260px;
  }
}
</style>
