<template>
  <vab-dialog v-model="visible" title="上传图片" width="20%" @close="closeImageUploadDialog">
    <div class="upload-dialog-content" @paste="handlePaste">
      <!-- 上传区域 -->
      <div class="upload-area">
        <!-- 上半部分上传 -->
        <el-upload :auto-upload="false" class="upload-zone" drag :on-change="handleImageBeforeUpload" :show-file-list="false">
          <vab-icon class="image-icon" icon="image-add-fill" />
          <div class="el-upload__text">
            拖拽图片到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>

        <!-- 分割线 -->
        <el-divider class="divider"><span class="divider-text">或</span></el-divider>

        <!-- 输入框 -->
        <el-input
          v-model="imageUrl"
          class="url-input"
          clearable
          placeholder="粘贴截图"
          @change="handleImageUrl"
          @clear="handleClearImageUrl"
        />
      </div>

      <!-- 图片预览区域 -->
      <div v-if="previewUrl" class="preview-area" @click="imagePreviewOpen(previewUrl)">
        <img alt="预览图" :src="previewUrl" />
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

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'imageUpload', value: File): void
}>()
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

watch(visible, (val) => {
  if (val) {
    imageUrl.value = ''
    previewUrl.value = ''
  }
})
// 要上传的图片文件
let imageFile: File
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
const handleImageUrl = () => {
  previewUrl.value = imageUrl.value
}
const handleClearImageUrl = () => {
  previewUrl.value = ''
}
const closeImageUploadDialog = () => {
  visible.value = false
}

// 预览图片
const previewImage = (file: File) => {
  previewUrl.value = URL.createObjectURL(file)
}
// 生成预览链接
const handleImageBeforeUpload = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  // console.log(uploadFile)
  // console.log(uploadFiles)
  if (uploadFile.raw) {
    imageFile = uploadFile.raw
    previewImage(imageFile!)
  }
}
// 确认上传
const confirmUpload = () => {
  // console.log(previewUrl.value)
  if (previewUrl.value.startsWith('blob:')) {
    emit('imageUpload', imageFile)
  }
}
// 处理粘贴事件
const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items) return
  const imageItem = Array.from(items).find((item) => item.type.includes('image'))
  if (imageItem) {
    const file = imageItem.getAsFile()
    if (file) {
      imageFile = file
      previewImage(file)
    }
  }
}
// 组件销毁时释放 URL
onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
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
