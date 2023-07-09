<template>
  <el-upload
    v-model:file-list="fileList"
    action="/uploadFlie"
    :before-remove="beforeRemove"
    :limit="3"
    multiple
    :on-exceed="handleExceed"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
  >
    <el-button type="primary">点击上传</el-button>
    <template #tip>
      <div class="el-upload__tip">jpg/png 文件需小于500kb</div>
    </template>
  </el-upload>
</template>
<script lang="ts" setup>
  import type { UploadProps, UploadUserFile } from 'element-plus'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const fileList = ref<UploadUserFile[]>([])

  const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
    console.log(file, uploadFiles)
  }

  const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
    console.log(uploadFile)
  }

  const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    ElMessage.warning(
      `限制为3个文件，您选择了${files.length}个文件，加起来总共$${
        files.length + uploadFiles.length
      }个文件`
    )
  }

  const beforeRemove: UploadProps['beforeRemove'] = (uploadFile) => {
    return ElMessageBox.confirm(`是否取消上传 ${uploadFile.name} ？`).then(
      () => true,
      () => false
    )
  }
</script>
