<template>
  <vab-dialog v-model="visible" title="匹配报关项号文件上传" width="25%" @close="close">
    <el-alert class="upload-tip" :closable="false" show-icon title="请确保Excel中包含 SKU 和 项号列" type="warning" />

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
        <el-button :disabled="loading" @click="visible = false">取消</el-button>
        <el-button :disabled="!canSubmit" :loading="loading" :type="canSubmit ? 'primary' : 'info'" @click="handleSubmit">
          开始匹配并下载
        </el-button>
      </div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadUserFile } from 'element-plus'

defineOptions({
  name: 'DeclarationItemNoUpload',
})

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    loading?: boolean
  }>(),
  {
    loading: false,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'submit', value: { preOrderFiles: UploadUserFile[]; taxRefundFiles: UploadUserFile[] }): void
}>()

const preOrderFiles = ref<UploadUserFile[]>([])
const taxRefundFiles = ref<UploadUserFile[]>([])
const canSubmit = computed(() => preOrderFiles.value.length > 0 && taxRefundFiles.value.length > 0)
const visible = defineModel({ default: false })

const resetFiles = () => {
  preOrderFiles.value = []
  taxRefundFiles.value = []
}

const close = () => {
  visible.value = false
  resetFiles()
}

const handleSubmit = () => {
  if (props.loading) return
  if (preOrderFiles.value.length === 0) {
    $baseMessage('必须先上传装箱单Excel文件！', 'warning', 'hey')
    return
  }
  if (taxRefundFiles.value.length === 0) {
    $baseMessage('必须先上传报关单Excel文件！', 'warning', 'hey')
    return
  }
  emit('submit', {
    preOrderFiles: preOrderFiles.value,
    taxRefundFiles: taxRefundFiles.value,
  })
}
</script>

<style lang="scss" scoped>
.upload-tip {
  margin-bottom: 12px;
}
</style>
