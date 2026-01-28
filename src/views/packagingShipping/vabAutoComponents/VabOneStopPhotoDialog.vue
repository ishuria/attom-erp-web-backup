<template>
  <vab-dialog v-model="visible" :title="getCurrentPhotoTitle()" width="30%">
    <div style="text-align: center; padding: 20px">
      <!-- 隐藏的文件输入 -->
      <input ref="cameraInputRef" accept="image/*" capture="environment" style="display: none" type="file" @change="handleCameraCapture" />

      <!-- 拍摄提示卡片 - 可点击 -->
      <div class="photo-card" @click="triggerCamera">
        <!-- 连拍模式标签：只有“其他图片(新增)+手机端”才展示 -->
        <div v-if="isBurstMode" style="position: absolute; top: 8px; right: 12px">
          <el-tag size="small" type="success">连拍模式</el-tag>
        </div>

        <div class="photo-card-icon">
          <vab-icon icon="camera-fill" />
        </div>

        <h3 class="photo-card-title">{{ currentPhotoInfo?.title }}</h3>
        <p class="photo-card-desc">{{ currentPhotoInfo?.desc }}</p>

        <div class="photo-card-action">
          {{ currentPhotoPreview ? '点击重新拍摄' : isBurstMode ? '点击开始拍摄（拍完自动上传）' : '点击开始拍摄' }}
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
    <el-image-viewer v-if="imageViewerVisible" hide-on-click-modal :url-list="[currentPhotoPreview]" @close="imageViewerVisible = false" />

    <template #footer>
      <div style="display: flex; justify-content: space-between; width: 100%">
        <div>
          <el-button :disabled="currentPhotoIndex === 0" @click="goToPrevious">
            <vab-icon icon="arrow-left-line" style="margin-right: 4px" />
            上一张
          </el-button>

          <el-button :disabled="currentPhotoIndex >= requiredPhotos.length - 1" style="margin-left: 8px" @click="goToNext">
            下一张
            <vab-icon icon="arrow-right-line" style="margin-left: 4px" />
          </el-button>
        </div>

        <div>
          <el-button v-if="!isBurstMode" :disabled="pendingFiles.length === 0" type="success" @click="saveAndContinue">
            保存并继续
            <vab-icon icon="arrow-right-line" style="margin-left: 4px" />
          </el-button>

          <el-button v-else disabled :loading="isUploading" type="success">
            {{ isUploading ? '正在上传...' : '拍摄后自动上传' }}
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

/** -----------------------------
 * 类型定义
 * ----------------------------- */
interface PhotoInfo {
  type: number
  sort: number
  title: string
  desc: string
  hasImage: boolean
  categoryName: string
  isAdd?: boolean
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

// dialog v-model
const visible = defineModel<boolean>({ default: false })

/** -----------------------------
 * 状态
 * ----------------------------- */
const currentPhotoIndex = ref<number>(0)
const currentPhotoPreview = ref<string>('')
const currentPhotoFile = ref<File | null>(null)
const cameraInputRef = ref<HTMLInputElement>()
const requiredPhotos = ref<PhotoInfo[]>([])
const imageViewerVisible = ref<boolean>(false)

const pendingFiles = ref<File[]>([])
const isUploading = ref(false)

// 当前项
const currentPhotoInfo = computed(() => requiredPhotos.value[currentPhotoIndex.value])

/** -----------------------------
 * 连拍模式：其他图片(type=3) + 新增(isAdd)
 * ----------------------------- */
const isBurstMode = computed(() => {
  const info = currentPhotoInfo.value
  return !!(info && info.type === 3 && info.isAdd)
})

/** -----------------------------
 * sort 缓存：避免 props 回写慢导致 sort 重复
 * ----------------------------- */
const localNextSort = ref<Record<number, number>>({})

const getListByType = (type: number) => {
  if (type === 0) return props.basePictureImgList
  if (type === 1) return props.componentDetailImgList
  if (type === 2) return props.finishedImgList
  if (type === 3) return props.otherImgList
  return []
}

const getMaxSort = (list: any[]) => {
  if (!list || list.length === 0) return -1
  return Math.max(...list.map((x: any) => x?.sort ?? -1))
}

const getNextSortSafe = (type: number) => {
  if (localNextSort.value[type] != null) return localNextSort.value[type]
  const maxSort = getMaxSort(getListByType(type))
  localNextSort.value[type] = maxSort + 1
  return localNextSort.value[type]
}

const findImgUrlByTypeSort = (type: number, sort: number) => {
  const list = getListByType(type)
  return list.find((x: any) => (x?.sort ?? -999) === sort)?.imgUrl || ''
}

/** -----------------------------
 * 初始化 requiredPhotos：每张图一个 item + 新增占位
 * ----------------------------- */
const buildTypeItems = (type: number, categoryName: string, desc: string, list: any[]) => {
  const items: PhotoInfo[] = (list || []).map((img: any, idx: number) => ({
    type,
    sort: img?.sort ?? idx,
    title: `${categoryName} (${idx + 1}/${list.length})`,
    desc,
    hasImage: true,
    categoryName,
    isAdd: false,
  }))

  items.push({
    type,
    sort: -1,
    title: `${categoryName}（新增）`,
    desc,
    hasImage: false,
    categoryName,
    isAdd: true,
  })

  return items
}

const initPhotoSession = () => {
  requiredPhotos.value = []

  // 基础图片
  props.basePictureImgList.forEach((item) => {
    requiredPhotos.value.push({
      type: 0,
      sort: item.sort,
      title: item.title,
      desc: item.desc,
      hasImage: !!item.imgUrl,
      categoryName: '基础图片',
      isAdd: false,
    })
  })

  requiredPhotos.value.push(...buildTypeItems(1, '零件细节', '展示产品局部细节，重要技术参数细节', props.componentDetailImgList))
  requiredPhotos.value.push(...buildTypeItems(2, '成品组装图', '展示产品组装后的图片，多角度拍摄', props.finishedImgList))
  requiredPhotos.value.push(...buildTypeItems(3, '其他图片', '其他需要记录的图片', props.otherImgList))

  const firstEmptyIndex = requiredPhotos.value.findIndex((item) => !item.hasImage)
  currentPhotoIndex.value = firstEmptyIndex >= 0 ? firstEmptyIndex : 0

  currentPhotoPreview.value = ''
  currentPhotoFile.value = null
  pendingFiles.value = []

  nextTick(() => setPreviewByCurrentIndex())
}

/** -----------------------------
 * 预览回填
 * ----------------------------- */
const setPreviewByCurrentIndex = () => {
  const info = currentPhotoInfo.value
  if (!info) {
    currentPhotoPreview.value = ''
    return
  }
  if (info.isAdd) {
    currentPhotoPreview.value = ''
    return
  }
  currentPhotoPreview.value = findImgUrlByTypeSort(info.type, info.sort)
}

/** -----------------------------
 * watch dialog
 * ----------------------------- */
watch(visible, (val) => {
  if (val) initPhotoSession()
  else {
    // 清理
    pendingFiles.value = []
    currentPhotoPreview.value = ''
    currentPhotoFile.value = null
    isUploading.value = false
  }
})

/** -----------------------------
 * 标题 & 进度
 * ----------------------------- */
const getCurrentPhotoTitle = () => {
  const info = currentPhotoInfo.value
  if (!info) return '拍摄质检图片'
  if (info.type === 0) {
    const baseDone = props.basePictureImgList.filter((x) => x.imgUrl).length
    return `基础图片 (${baseDone}/6)`
  }
  return info.categoryName
}

const getProgressText = () => {
  const info = currentPhotoInfo.value
  if (!info) return ''
  if (info.type === 0) return `基础图片已完成: ${props.basePictureImgList.filter((x) => x.imgUrl).length}/6`
  if (info.type === 1) return `零件细节已拍摄: ${props.componentDetailImgList.length} 张`
  if (info.type === 2) return `成品组装图已拍摄: ${props.finishedImgList.length} 张`
  if (info.type === 3) return `其他图片已拍摄: ${props.otherImgList.length} 张`
  return ''
}

/** -----------------------------
 * 跳转按钮
 * ----------------------------- */
const showSkipToNextTypeButton = () => {
  const info = currentPhotoInfo.value
  if (!info) return false
  return info.type === 1 || info.type === 2 || info.type === 3
}

const getSkipButtonText = () => {
  const info = currentPhotoInfo.value
  if (!info) return ''
  if (info.type === 1) return '拍摄成品组装图'
  if (info.type === 2) return '拍摄其他图片'
  if (info.type === 3) return '拍摄完成'
  return ''
}

const canSkipToNextType = () => {
  const info = currentPhotoInfo.value
  if (!info) return false
  if (info.type === 1) return props.componentDetailImgList.length > 0
  if (info.type === 2) return props.finishedImgList.length > 0
  if (info.type === 3) return true
  return false
}

const skipToNextType = () => {
  const info = currentPhotoInfo.value
  if (!info) return

  if (info.type === 3) {
    $baseMessage('质检图片拍摄完成！', 'success')
    visible.value = false
    return
  }

  const nextTypeIndex = requiredPhotos.value.findIndex((item, index) => index > currentPhotoIndex.value && item.type > info.type)
  if (nextTypeIndex !== -1) {
    currentPhotoIndex.value = nextTypeIndex
    currentPhotoPreview.value = ''
    currentPhotoFile.value = null
    pendingFiles.value = []
    nextTick(() => setPreviewByCurrentIndex())
  }
}

/** -----------------------------
 * 上一张 / 下一张
 * ----------------------------- */
const goToPrevious = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
    currentPhotoFile.value = null
    pendingFiles.value = []
    nextTick(() => setPreviewByCurrentIndex())
  }
}

const goToNext = () => {
  if (currentPhotoIndex.value < requiredPhotos.value.length - 1) {
    currentPhotoIndex.value++
    currentPhotoFile.value = null
    pendingFiles.value = []
    nextTick(() => setPreviewByCurrentIndex())
  }
}

/** -----------------------------
 * 相机触发 & 查看器
 * ----------------------------- */
const triggerCamera = () => {
  lastUserCameraClickAt.value = Date.now()
  cameraInputRef.value?.click()
}

const showImageViewer = () => {
  imageViewerVisible.value = true
}

/** -----------------------------
 * 上传接口封装
 * ----------------------------- */
const uploadOneFile = async (file: File, type: number, sortToUse: number) => {
  const uploadImgForm = new FormData()
  uploadImgForm.append('file', file)
  uploadImgForm.append('reportId', String(props.reportId))
  uploadImgForm.append('type', String(type))
  uploadImgForm.append('sort', String(sortToUse))
  const { data } = await uploadPackageInspectionImage(uploadImgForm)
  return data
}

const wantAutoReopen = ref(false) // 是否希望上传后自动继续拍
const lastUserCameraClickAt = ref(0) // 最近一次用户手势打开相机的时间
/** -----------------------------
 * 2 秒后尝试再次弹出相机 + 兜底提示
 * ----------------------------- */
const reopenCameraAfterUpload = () => {
  // 只有在“刚刚用户点过相机”的短窗口内才尝试自动弹
  // 超过这个窗口，浏览器更容易拦截，干脆提示用户点一下更稳
  const delta = Date.now() - lastUserCameraClickAt.value
  const withinGestureWindow = delta < 8000 // 你可以调 5~10 秒

  if (!withinGestureWindow) {
    $baseMessage('上传成功，请点击卡片继续拍摄', 'success')
    return
  }

  let fired = false

  const fireOnce = () => {
    if (fired) return
    fired = true

    window.removeEventListener('focus', fireOnce)
    document.removeEventListener('visibilitychange', onVisChange)

    cameraInputRef.value?.click()

    setTimeout(() => {
      $baseMessage('如未自动弹出相机，请点击卡片继续拍摄', 'warning')
    }, 600)
  }

  const onVisChange = () => {
    if (document.visibilityState === 'visible') {
      setTimeout(fireOnce, 200)
    }
  }

  window.addEventListener('focus', fireOnce, { once: true })
  document.addEventListener('visibilitychange', onVisChange)

  // 兜底
  setTimeout(() => {
    if (!fired) fireOnce()
  }, 1200)
}

/** -----------------------------
 * 连拍自动上传：拍完立即上传，上传成功后 2s 再弹相机
 * （只用于 isBurstMode）
 * ----------------------------- */
const autoUploadPending = async () => {
  if (isUploading.value) return
  if (pendingFiles.value.length === 0) return
  if (!isBurstMode.value) return

  const info = currentPhotoInfo.value
  if (!info || info.type !== 3 || !info.isAdd) return

  try {
    isUploading.value = true

    // sort 起点（用缓存避免重复）
    let nextSort = getNextSortSafe(3)

    for (let i = 0; i < pendingFiles.value.length; i++) {
      const file = pendingFiles.value[i]
      const data = await uploadOneFile(file, 3, nextSort)

      if (!data) {
        $baseMessage(`第 ${i + 1} 张上传失败`, 'error')
        return
      }

      emit('photoUploaded', { type: 3, sort: nextSort, imgData: data })
      nextSort++
      localNextSort.value[3] = nextSort
    }

    $baseMessage('上传成功', 'success')

    // 清理
    pendingFiles.value = []
    currentPhotoFile.value = null
    currentPhotoPreview.value = ''

    // 上传成功自动弹相机
    reopenCameraAfterUpload()
  } catch (e) {
    console.error(e)
    $baseMessage('图片上传失败', 'error')
  } finally {
    isUploading.value = false
  }
}

/** -----------------------------
 * 拍摄结果回调：
 * - 连拍模式：拍完立即 autoUploadPending
 * - 非连拍：只缓存，等用户点“保存并继续”
 * ----------------------------- */
const handleCameraCapture = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  target.value = ''
  if (files.length > 0) {
    pendingFiles.value = files

    // 预览第一张（可选）
    currentPhotoFile.value = files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      currentPhotoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(files[0])

    // 连拍：拍完立即上传
    if (isBurstMode.value) {
      await autoUploadPending()
    }
  } else {
    pendingFiles.value = []
    currentPhotoFile.value = null
    currentPhotoPreview.value = ''
  }
}

/** -----------------------------
 * 非连拍：保存并继续（保留原逻辑）
 * ----------------------------- */
const saveAndContinue = async () => {
  if (!currentPhotoFile.value) {
    $baseMessage('请先拍摄图片', 'warning')
    return
  }

  const info = currentPhotoInfo.value
  if (!info) return

  try {
    // 单张上传（基础图/零件/组装/其他覆盖）
    let sortToUse = info.sort

    if (info.type === 0) {
      sortToUse = info.sort
    } else {
      if (info.isAdd) {
        sortToUse = getNextSortSafe(info.type)
        localNextSort.value[info.type] = sortToUse + 1
      } else {
        sortToUse = info.sort
      }
    }

    const data = await uploadOneFile(currentPhotoFile.value, info.type, sortToUse)

    if (!data) {
      $baseMessage('图片上传失败', 'error')
      return
    }

    emit('photoUploaded', { type: info.type, sort: sortToUse, imgData: data })
    $baseMessage('图片上传成功', 'success')

    currentPhotoPreview.value = ''
    currentPhotoFile.value = null
    pendingFiles.value = []

    // 基础图片：跳下一张基础图或下一类
    if (info.type === 0) {
      const nextBaseIndex = requiredPhotos.value.findIndex((item, index) => index > currentPhotoIndex.value && item.type === 0)
      if (nextBaseIndex !== -1) {
        currentPhotoIndex.value = nextBaseIndex
        nextTick(() => setPreviewByCurrentIndex())
      } else {
        skipToNextType()
      }
      return
    }

    // 新增占位：继续拍（非连拍情况下）
    if (info.isAdd) {
      setTimeout(() => triggerCamera(), 100)
      return
    }

    // 已有项：下一张
    if (currentPhotoIndex.value < requiredPhotos.value.length - 1) {
      currentPhotoIndex.value++
      nextTick(() => setPreviewByCurrentIndex())
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
