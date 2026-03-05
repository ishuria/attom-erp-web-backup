<template>
  <div class="delete-column-container">
    <el-button type="primary" @click="handleShowUploadDialog('invoice')">电子发票导入</el-button>
    <el-button type="primary" @click="handleShowUploadDialog('merge')">PDF聚合</el-button>

    <vab-dialog v-model="visible" :close-on-click-modal="false" :title="title" width="30%">
      <el-upload v-model:file-list="fileList" :auto-upload="false" drag multiple :show-file-list="true">
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          将文件拖拽至此处或
          <em>点击上传</em>
        </div>
      </el-upload>
      <template #footer>
        <div style="text-align: center">
          <el-button :loading="loading" type="success" @click="handleUpload">生成</el-button>
        </div>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Tool',
})
import { UploadFilled } from '@element-plus/icons-vue'
import { invoiceImport, pdfMerge } from '~/src/api/devlocal/tool'

const visible = ref<boolean>(false)
const fileList = ref<any[]>([])
const loading = ref<boolean>(false)
const type = ref<string>('')
const title = ref<string>('')
const handleUpload = () => {
  // 验证文件
  if (fileList.value.length === 0) {
    $baseMessage('请至少上传一个PDF文件', 'warning')

    return
  }

  if (type.value === 'merge') {
    mergePdfs(fileList.value)
  } else if (type.value === 'invoice') {
    invoiceGenerate(fileList.value)
  }
}

const handleShowUploadDialog = (t: 'merge' | 'invoice') => {
  visible.value = true
  fileList.value = []
  loading.value = false
  if (t === 'merge') {
    title.value = 'PDF聚合'
    type.value = 'merge'
  } else if (t === 'invoice') {
    title.value = '电子发票导入'
    type.value = 'invoice'
  }
}
// 合并 PDF
async function mergePdfs(fileList: any[]) {
  loading.value = true
  const formData = new FormData()

  // 用 .raw 获取实际的 File 对象
  fileList.forEach((file) => {
    if (file.raw) {
      formData.append('files', file.raw)
    }
  })
  try {
    await pdfMerge(formData)

    $baseMessage('PDF合并成功', 'success')
    visible.value = false // 关闭弹窗
  } catch (error: any) {
    console.error('合并失败:', error)
    $baseMessage(error.response?.data?.message || '合并失败，请重试', 'error')
  } finally {
    loading.value = false
  }
}
// 电子发票导入
async function invoiceGenerate(fileList: any[]) {
  loading.value = true
  const formData = new FormData()

  // 用 .raw 获取实际的 File 对象
  fileList.forEach((file) => {
    if (file.raw) {
      formData.append('files', file.raw)
    }
  })
  try {
    const blobData = await invoiceImport(formData)

    // 检查是否返回了错误（JSON或HTML）
    if (blobData.type.includes('json') || blobData.type.includes('text/html') || blobData.type === '') {
      const text = await blobData.text()
      console.error('后端返回错误:', text)
      $baseMessage(text || '导入失败，请重试', 'error')
      return
    }

    if (blobData instanceof Blob) {
      const url = window.URL.createObjectURL(blobData)
      const link = document.createElement('a')
      link.href = url
      link.download = `电子发票_${Date.now()}.xlsx`
      link.click()
      window.URL.revokeObjectURL(url)
    }

    $baseMessage('电子发票导入成功', 'success')
    visible.value = false // 关闭弹窗
  } catch (error: any) {
    console.error('电子发票导入失败:', error)
    $baseMessage(error.response?.data?.message || '电子发票导入失败，请重试', 'error')
  } finally {
    loading.value = false
  }
}
</script>
