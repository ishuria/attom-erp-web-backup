<template>
  <vab-dialog v-model="visible" title="匹配报关项号文件上传" width="25%" @close="close">
    <el-alert class="upload-tip" :closable="false" show-icon title="请确保Excel中包含 SKU 和 项号列" type="warning" />

    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="form-section">
      <el-form-item label="ShipmentId" prop="shipmentId">
        <el-input v-model="form.shipmentId" placeholder="请输入 ShipmentId" clearable />
      </el-form-item>
    </el-form>

    <el-upload v-model:file-list="preOrderFiles" :auto-upload="false" drag multiple :show-file-list="true">
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        将装箱单Excel文件拖拽至此处或
        <em>点击上传</em>
      </div>
    </el-upload>

    <el-upload v-model:file-list="taxRefundFiles" :auto-upload="false" drag multiple :show-file-list="true">
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        将报关单Excel文件拖拽至此处或
        <em>点击上传</em>
      </div>
    </el-upload>
    <template #footer>
      <div style="text-align: center">
        <el-button :disabled="loading" @click="close">取消</el-button>
        <el-button :disabled="!canSubmit" :loading="loading" :type="canSubmit ? 'primary' : 'info'" @click="handleSubmit">
          开始匹配并下载
        </el-button>
      </div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import { downloadFilePDH } from '/@/api/devlocal/download'

defineOptions({
  name: 'DeclarationItemNoUpload',
})

const formRef = ref<FormInstance>()
const form = reactive({
  shipmentId: '',
})
const rules: FormRules = {
  shipmentId: [{ required: true, message: '请输入 ShipmentId', trigger: 'blur' }],
}
const preOrderFiles = ref<UploadUserFile[]>([])
const taxRefundFiles = ref<UploadUserFile[]>([])
const loading = ref(false)
const canSubmit = computed(
  () => !!form.shipmentId.trim() && preOrderFiles.value.length > 0 && taxRefundFiles.value.length > 0,
)
const visible = defineModel({ default: false })

const resetFiles = () => {
  preOrderFiles.value = []
  taxRefundFiles.value = []
  form.shipmentId = ''
  formRef.value?.clearValidate()
}

const close = () => {
  visible.value = false
  resetFiles()
}

const handleSubmit = async () => {
  if (loading.value) return
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  if (preOrderFiles.value.length === 0) {
    $baseMessage('必须先上传装箱单Excel文件！', 'warning', 'hey')
    return
  }
  if (taxRefundFiles.value.length === 0) {
    $baseMessage('必须先上传报关单Excel文件！', 'warning', 'hey')
    return
  }
  const formData = new FormData()
  formData.append('shipmentId', form.shipmentId.trim())
  preOrderFiles.value.forEach((item) => {
    if (item.raw) formData.append('files', item.raw)
  })
  taxRefundFiles.value.forEach((item) => {
    if (item.raw) formData.append('files', item.raw)
  })
  loading.value = true
  try {
    await downloadFilePDH('/shipment/file/check', formData)
    $baseMessage('匹配并下载完成！', 'success', 'hey')
    close()
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.upload-tip {
  margin-bottom: 12px;
}
.form-section {
  margin-bottom: 12px;
}
</style>
