<template>
  <vab-dialog v-model="visible" title="退款" width="30%" @close="handleClose">
    <div class="refund-dialog-content">
      <!-- 退款凭证上传区 -->
      <div class="upload-area">
        <el-upload
          v-loading="uploading"
          :auto-upload="false"
          class="upload-zone"
          drag
          :on-change="handleFileChange"
          :show-file-list="false"
        >
          <template v-if="proofUrl">
            <img alt="退款凭证" class="proof-preview" :src="proofUrl" />
          </template>
          <template v-else>
            <vab-icon class="image-icon" icon="image-add-fill" />
            <div class="el-upload__text">
              拖拽 / 粘贴 退款凭证图片到此处，或
              <em>点击上传</em>
            </div>
          </template>
        </el-upload>
      </div>

      <!-- 金额与原因 -->
      <el-form class="refund-form" label-width="110px">
        <el-form-item label="自动识别金额">
          <el-input disabled :model-value="recognizedAmountText" placeholder="上传退款凭证后自动识别金额" />
        </el-form-item>
        <el-form-item label="可退金额">
          <el-input disabled :model-value="refundableAmountText" />
        </el-form-item>
        <el-form-item :required="reasonRequired" label="原因">
          <el-input
            v-model="refundReason"
            :placeholder="reasonRequired ? '可退金额与识别金额不一致，原因必填' : '请输入原因（选填）'"
            :rows="3"
            type="textarea"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button :disabled="props.submitting" @click="handleClose">取消</el-button>
      <el-button :disabled="!proofUrl" :loading="props.submitting" type="primary" @click="handleConfirm">确认退款</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { UploadFile } from 'element-plus'
import { updateSampleFeeRefundProof } from '/@/api/devlocal/progressSample'
import { ISampleFeeRefundItem } from '/@/type/progress/sampleAndComponentType'

defineOptions({
  name: 'SampleFeeRefundDialog',
})

const props = defineProps<{
  modelValue: boolean
  row: ISampleFeeRefundItem
  submitting?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', value: { refundAmount: number; refundReason: string }): void
}>()

const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const uploading = ref<boolean>(false)
const proofUrl = ref<string>('')
const recognizedAmount = ref<number | null>(null)
const refundReason = ref<string>('')

const recognizedAmountText = computed(() => (recognizedAmount.value === null ? '' : `${recognizedAmount.value}`))
const refundableAmountText = computed(() => props.row?.bulkGoodsReturnable ?? '')

// 可退金额与识别金额不一致时，原因必填（识别金额为空时不强制）
const reasonRequired = computed(() => {
  if (recognizedAmount.value === null) return false
  return Number(props.row?.bulkGoodsReturnable) !== Number(recognizedAmount.value)
})

// 打开时重置状态，并在弹窗打开期间于 document 上监听粘贴（不依赖焦点落点）
watch(visible, (val) => {
  if (val) {
    proofUrl.value = ''
    recognizedAmount.value = null
    refundReason.value = ''
    document.addEventListener('paste', handlePaste)
  } else {
    document.removeEventListener('paste', handlePaste)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('paste', handlePaste)
})

// 上传凭证并识别金额
const uploadProof = async (file: File) => {
  uploading.value = true
  try {
    const form = new FormData()
    form.append('file', file)
    form.append('id', `${props.row.sampleId}`)
    const { data } = await updateSampleFeeRefundProof(form)
    if (data?.proofUrl) {
      proofUrl.value = data.proofUrl
      recognizedAmount.value = data.refundAmount
      $baseMessage('退款凭证上传成功！', 'success')
    } else {
      $baseMessage('退款凭证上传失败！', 'error')
    }
  } catch (error) {
    console.error(error)
  } finally {
    uploading.value = false
  }
}

const handleFileChange = (uploadFile: UploadFile) => {
  if (uploadFile.raw) {
    uploadProof(uploadFile.raw)
  }
}

const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items) return
  const imageItem = Array.from(items).find((item) => item.type.includes('image'))
  const file = imageItem?.getAsFile()
  if (file) {
    uploadProof(file)
  }
}

const handleClose = () => {
  visible.value = false
}

const handleConfirm = () => {
  if (!proofUrl.value) {
    $baseMessage('请先上传退款凭证', 'warning')
    return
  }
  if (reasonRequired.value && !refundReason.value.trim()) {
    $baseMessage('可退金额与识别退款金额不一致，请填写原因', 'warning')
    return
  }
  emit('confirm', {
    refundAmount: recognizedAmount.value as number,
    refundReason: refundReason.value.trim(),
  })
}
</script>

<style lang="scss" scoped>
.refund-dialog-content {
  .upload-area {
    .upload-zone {
      width: 100%;

      .image-icon {
        margin-bottom: 8px;
        font-size: 28px;
        color: #999;
      }

      .proof-preview {
        max-width: 100%;
        max-height: 180px;
        object-fit: contain;
      }
    }
  }

  .refund-form {
    margin-top: 16px;
  }
}
</style>
