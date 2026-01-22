<template>
  <vab-dialog v-model="visible" :title="getCurrentPhotoTitle()" width="30%">
    <div style="text-align: center; padding: 20px">
      <!-- 隐藏的文件输入 -->
      <input
        ref="cameraInputRef"
        accept="image/*"
        capture="environment"
        style="display: none"
        type="file"
        @change="handleCameraCapture"
      />

      <!-- 拍摄提示卡片 - 可点击 -->
      <div class="photo-card" @click="triggerCamera">
        <div class="photo-card-icon">
          <vab-icon icon="camera-fill" />
        </div>
        <h3 class="photo-card-title">{{ currentPhotoInfo?.title }}</h3>
        <p class="photo-card-desc">{{ currentPhotoInfo?.desc }}</p>
        <div class="photo-card-action">
          {{ currentPhotoPreview ? '点击重新拍摄' : '点击开始拍摄' }}
        </div>
      </div>

      <!-- 已拍摄的图片预览 - 点击查看大图 -->
      <div v-if="currentPhotoPreview" class="photo-preview" @click="showImageViewer">
        <el-image fit="contain" :src="currentPhotoPreview" />
      </div>

      <!-- 进度提示 -->
      <div class="progress-text">
        {{ getProgressText() }}
      </div>
    </div>

    <!-- 图片查看器 -->
    <el-image-viewer
      v-if="imageViewerVisible"
      hide-on-click-modal
      :url-list="[currentPhotoPreview]"
      @close="imageViewerVisible = false"
    />

    <template #footer>
      <div style="display: flex; justify-content: space-between; width: 100%">
        <div>
          <el-button :disabled="currentPhotoIndex === 0" @click="goToPrevious">
            <vab-icon icon="arrow-left-line" style="margin-right: 4px" />
            上一张
          </el-button>
        </div>
        <div>
          <el-button :disabled="!currentPhotoPreview" type="success" @click="saveAndContinue">
            保存并继续
            <vab-icon icon="arrow-right-line" style="margin-left: 4px" />
          </el-button>
          <el-button v-if="showSkipToNextTypeButton()" :disabled="!canSkipToNextType()" type="primary" @click="skipToNextType">
            {{ getSkipButtonText() }}
            <vab-icon icon="arrow-right-double-line" style="margin-left: 4px" />
          </el-button>
        </div>
      </div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { uploadPackageInspectionImage } from '/@/api/devlocal/packagingShipping'

defineOptions({
  name: 'VabOneStopPhotoDialog',
})

interface PhotoInfo {
  type: number
  sort: number
  title: string
  desc: string
  hasImage: boolean
  categoryName: string
}

interface Props {
  reportId: number
  basePictureImgList: any[]
  componentDetailImgList: any[]
  finishedImgList: any[]
  otherImgList: any[]
}

interface Emits {
  (e: 'photoUploaded', data: { type: number; sort: number; imgData: any }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 使用 defineModel 替代 modelValue
const visible = defineModel<boolean>({ default: false })

const currentPhotoIndex = ref<number>(0)
const currentPhotoPreview = ref<string>('')
const currentPhotoFile = ref<File | null>(null)
const cameraInputRef = ref<HTMLInputElement>()
const requiredPhotos = ref<PhotoInfo[]>([])
const imageUploadIndex = ref<number>(0)
const imageViewerVisible = ref<boolean>(false)

const currentPhotoInfo = computed(() => {
  return requiredPhotos.value[currentPhotoIndex.value]
})

// 监听弹窗打开，初始化数据
watch(visible, (val) => {
  if (val) {
    initPhotoSession()
  }
})

// 初始化拍摄会话
const initPhotoSession = () => {
  requiredPhotos.value = []

  // 1. 添加基础图片（6张固定）
  props.basePictureImgList.forEach((item) => {
    requiredPhotos.value.push({
      type: 0,
      sort: item.sort,
      title: item.title,
      desc: item.desc,
      hasImage: !!item.imgUrl,
      categoryName: '基础图片',
    })
  })

  // 2. 添加零件细节（不限数量，至少1张标记）
  requiredPhotos.value.push({
    type: 1,
    sort: 0,
    title: '零件细节',
    desc: '展示产品局部细节，重要技术参数细节',
    hasImage: false,
    categoryName: '零件细节',
  })

  // 3. 添加成品组装图（不限数量，至少1张标记）
  requiredPhotos.value.push({
    type: 2,
    sort: 0,
    title: '成品组装图',
    desc: '展示产品组装后的图片，多角度拍摄',
    hasImage: false,
    categoryName: '成品组装图',
  })

  // 4. 添加其他图片（不限数量，可选）
  requiredPhotos.value.push({
    type: 3,
    sort: 0,
    title: '其他图片',
    desc: '其他需要记录的图片',
    hasImage: false,
    categoryName: '其他图片',
  })

  // 从第一个没有图片的项开始
  const firstEmptyIndex = requiredPhotos.value.findIndex((item) => !item.hasImage)
  currentPhotoIndex.value = firstEmptyIndex >= 0 ? firstEmptyIndex : 0
  currentPhotoPreview.value = ''
  currentPhotoFile.value = null

  // 自动触发第一张拍摄
  nextTick(() => {
    triggerCamera()
  })
}

// 获取当前照片标题
const getCurrentPhotoTitle = () => {
  const info = currentPhotoInfo.value
  if (!info) return '拍摄质检图片'

  if (info.type === 0) {
    // 基础图片：显示当前是第几张
    const basePhotoIndex = requiredPhotos.value.slice(0, currentPhotoIndex.value + 1).filter((p) => p.type === 0).length
    return `基础图片 (${basePhotoIndex}/6)`
  } else {
    // 其他类型：显示类型名称
    return info.categoryName
  }
}

// 获取进度文本
const getProgressText = () => {
  const info = currentPhotoInfo.value
  if (!info) return ''

  if (info.type === 0) {
    const completedBase = props.basePictureImgList.filter((item) => item.imgUrl).length
    return `基础图片已完成: ${completedBase}/6`
  } else if (info.type === 1) {
    return `零件细节已拍摄: ${props.componentDetailImgList.length} 张`
  } else if (info.type === 2) {
    return `成品组装图已拍摄: ${props.finishedImgList.length} 张`
  } else if (info.type === 3) {
    return `其他图片已拍摄: ${props.otherImgList.length} 张`
  }
  return ''
}

// 是否显示跳过按钮
const showSkipToNextTypeButton = () => {
  const info = currentPhotoInfo.value
  if (!info) return false

  // 零件细节、成品组装图、其他图片时显示
  return info.type === 1 || info.type === 2 || info.type === 3
}

// 获取跳过按钮文本
const getSkipButtonText = () => {
  const info = currentPhotoInfo.value
  if (!info) return ''

  if (info.type === 1) return '拍摄成品组装图'
  if (info.type === 2) return '拍摄其他图片'
  if (info.type === 3) return '拍摄完成'
  return ''
}

// 是否可以跳到下一个类型
const canSkipToNextType = () => {
  const info = currentPhotoInfo.value
  if (!info) return false

  // 零件细节和成品组装图至少需要1张
  if (info.type === 1) {
    return props.componentDetailImgList.length > 0
  }
  if (info.type === 2) {
    return props.finishedImgList.length > 0
  }
  // 其他图片可以直接完成
  if (info.type === 3) {
    return true
  }
  return false
}

// 跳到下一个类型
const skipToNextType = () => {
  const info = currentPhotoInfo.value
  if (!info) return

  if (info.type === 3) {
    // 其他图片 - 完成拍摄
    $baseMessage('质检图片拍摄完成！', 'success')
    visible.value = false
    return
  }

  // 查找下一个类型的第一个
  const nextTypeIndex = requiredPhotos.value.findIndex((item, index) => index > currentPhotoIndex.value && item.type > info.type)

  if (nextTypeIndex !== -1) {
    currentPhotoIndex.value = nextTypeIndex
    currentPhotoPreview.value = ''
    currentPhotoFile.value = null

    // 自动触发拍摄
    nextTick(() => {
      triggerCamera()
    })
  }
}

// 上一张
const goToPrevious = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
    currentPhotoPreview.value = ''
    currentPhotoFile.value = null

    // 自动触发拍摄
    nextTick(() => {
      triggerCamera()
    })
  }
}

// 触发摄像头
const triggerCamera = () => {
  if (cameraInputRef.value) {
    cameraInputRef.value.click()
  }
}

// 显示图片查看器
const showImageViewer = () => {
  imageViewerVisible.value = true
}

// 处理拍摄结果
const handleCameraCapture = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    currentPhotoFile.value = file
    // 生成预览
    const reader = new FileReader()
    reader.onload = (e) => {
      currentPhotoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // 清空 input 以便重复拍摄
  target.value = ''
}

// 保存并继续
const saveAndContinue = async () => {
  if (!currentPhotoFile.value) {
    $baseMessage('请先拍摄图片', 'warning')
    return
  }

  try {
    // 上传图片
    const photoInfo = requiredPhotos.value[currentPhotoIndex.value]
    let uploadImgForm = new FormData()
    uploadImgForm.append('file', currentPhotoFile.value)
    uploadImgForm.append('reportId', String(props.reportId))
    uploadImgForm.append('type', String(photoInfo.type))

    if (photoInfo.type === 0) {
      // 基础图片使用 sort
      uploadImgForm.append('sort', String(photoInfo.sort))
      imageUploadIndex.value = photoInfo.sort
    } else {
      // 零件细节、成品组装图、其他图片使用递增的 sort
      if (photoInfo.type === 1) {
        const maxSort =
          props.componentDetailImgList.length > 0 ? Math.max(...props.componentDetailImgList.map((item: any) => (item as any).sort ?? -1)) : -1
        imageUploadIndex.value = maxSort + 1
      } else if (photoInfo.type === 2) {
        const maxSort = props.finishedImgList.length > 0 ? Math.max(...props.finishedImgList.map((item: any) => (item as any).sort ?? -1)) : -1
        imageUploadIndex.value = maxSort + 1
      } else if (photoInfo.type === 3) {
        const maxSort = props.otherImgList.length > 0 ? Math.max(...props.otherImgList.map((item: any) => (item as any).sort ?? -1)) : -1
        imageUploadIndex.value = maxSort + 1
      }
      uploadImgForm.append('sort', String(imageUploadIndex.value))
    }

    const { data } = await uploadPackageInspectionImage(uploadImgForm)

    if (data) {
      // 通知父组件更新数据
      emit('photoUploaded', {
        type: photoInfo.type,
        sort: photoInfo.type === 0 ? photoInfo.sort : imageUploadIndex.value,
        imgData: data,
      })

      $baseMessage('图片上传成功', 'success')

      // 判断下一步行为
      if (photoInfo.type === 0) {
        // 基础图片：移动到下一张基础图片
        const nextBaseIndex = requiredPhotos.value.findIndex((item, index) => index > currentPhotoIndex.value && item.type === 0)
        if (nextBaseIndex !== -1) {
          currentPhotoIndex.value = nextBaseIndex
          currentPhotoPreview.value = ''
          currentPhotoFile.value = null
          nextTick(() => {
            triggerCamera()
          })
        } else {
          // 基础图片全部完成，跳到零件细节
          skipToNextType()
        }
      } else {
        // 零件细节、成品组装图、其他图片：继续当前类型
        currentPhotoPreview.value = ''
        currentPhotoFile.value = null
        nextTick(() => {
          triggerCamera()
        })
      }
    } else {
      $baseMessage('图片上传失败', 'error')
    }
  } catch (error) {
    console.error('上传失败:', error)
    $baseMessage('图片上传失败', 'error')
  }
}

</script>

<style lang="scss" scoped>
.photo-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 30px 20px;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.45);

    &::before {
      opacity: 1;
    }

    .photo-card-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .photo-card-action {
      transform: scale(1.05);
    }
  }

  &:active {
    transform: translateY(-2px);
  }
}

.photo-card-icon {
  font-size: 48px;
  color: #fff;
  margin-bottom: 16px;
  transition: transform 0.3s ease;
  display: inline-block;
}

.photo-card-title {
  color: #fff;
  margin: 0 0 12px 0;
  font-size: 22px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.photo-card-desc {
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 20px 0;
  font-size: 14px;
  line-height: 1.6;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.photo-card-action {
  display: inline-flex;
  align-items: center;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.photo-preview {
  position: relative;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  :deep(.el-image) {
    display: block;
    max-width: 100%;
    max-height: 400px;
    width: 100%;
    border-radius: 12px;
  }
}

.progress-text {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  display: inline-block;
}
</style>
