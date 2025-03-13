<template>
  <vab-dialog
    v-model="dflag"
    title="上传图片"
    width="20%"
    @close="closeImageUploadDialog"
  >
    <div class="upload-dialog-content" @paste="handlePaste">
      <!-- 上传区域 -->
      <div class="upload-area">
        <!-- 上半部分上传 -->
        <el-upload
          :auto-upload="false"
          class="upload-zone"
          drag
          :on-change="handleImageBeforeUpload"
          :show-file-list="false"
        >
          <vab-icon class="image-icon" icon="image-add-fill" />
          <div class="el-upload__text">
            拖拽图片到此处，或 <em>点击上传</em>
          </div>
        </el-upload>

        <!-- 分割线 -->
        <el-divider class="divider"><span class="divider-text">或</span></el-divider>

        <!-- 输入框 -->
        <el-input
          v-model="imageUrl"
          class="url-input"
          placeholder="粘贴截图 / 图片链接"
          @keyup.enter="handleImageUrl"
        />
      </div>
      
      <!-- 图片预览区域 -->
      <div v-if="previewUrl" class="preview-area" @click="imagePreviewOpen(previewUrl)">
        <img alt="预览图" :src="previewUrl">
      </div>
    </div>
    <template #footer>
      <el-button @click="closeImageUploadDialog">取消</el-button>
      <el-button :disabled="!previewUrl" type="primary" @click="confirmUpload">确认上传</el-button>
    </template>
  </vab-dialog>
  <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
</template>

<script lang="ts" setup>
import type { UploadFile, UploadFiles } from 'element-plus'
defineOptions({
  name: 'VabImageUpload',
})
const dflag = ref<boolean>(false)
const props = defineProps<{ imageUploadVisible: boolean }>()
const emit = defineEmits<{
  (e: 'update:imageUploadVisible', value: boolean): void
}>()
watchEffect(() => {
  dflag.value = props.imageUploadVisible
})

// 预览的图片链接
const previewUrl = ref('')
// 图片链接
const imageUrl = ref('')
// 图片预览
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewOpen = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = [url]
}
// 处理图片链接
const handleImageUrl = async () => {
  if (!imageUrl.value) {
    $baseMessage('请输入图片链接', 'warning')
    return
  }
  
  try {
    // 尝试加载图片
    previewUrl.value = imageUrl.value
  } catch (error) {
    console.error(error)
    $baseMessage('无效的图片链接', 'error')
  }
}
const closeImageUploadDialog = () => {
  emit('update:imageUploadVisible', false)
}

// 预览图片
const previewImage = (file: File) => {
  const reader = new FileReader()
  reader.addEventListener('load', (e) => {
    previewUrl.value = e.target?.result as string
  })
  reader.readAsDataURL(file)
}

const handleImageBeforeUpload = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  //
  console.log(uploadFile)
  console.log(uploadFiles)
}
// 确认上传
const confirmUpload = async () => {
  //
}

// 处理粘贴事件
const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items) return

  const imageItem = Array.from(items).find(item => item.type.includes('image'))
  if (imageItem) {
    const file = imageItem.getAsFile()
    if (file) {
      previewImage(file)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-dialog-content {
  .upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    
    .upload-zone {
      width: 100%;
   
      .image-icon {
        margin-bottom: 8px;
        font-size: 28px;
        color: #999;
      }
      
      .upload-text {
        font-size: 14px;
        color: #606266;
      }
    }
    
    .divider {
      width: 60%;
      margin: 20px 0;
      font-size: 14px;
      color: #999;

      .divider-text {
        color: #999;
      }
    }
    
    .url-input {
      width: 100%;
      
      :deep(.el-input__inner) {
        text-align: center;
      }
    }
  }
  
  // 图片预览区域
  .preview-area {
    margin-top: 15px;
    text-align: center;
    
    img {
      max-width: 100%;
      max-height: 200px;
      object-fit: contain;
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>