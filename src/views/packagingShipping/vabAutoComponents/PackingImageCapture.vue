<template>
  <div class="packing-image-capture">
    <input ref="cameraInputRef" accept="image/*" capture="environment" multiple style="display: none" type="file" @change="handleChange" />

    <el-button plain type="primary" @click="cameraInputRef?.click()">
      <vab-icon icon="camera-fill" />
      <span>{{ imageList.length ? '继续拍照' : '拍照上传' }}</span>
    </el-button>

    <div v-if="imageList.length" class="capture-list">
      <div v-for="(image, index) in imageList" :key="image.uid" class="capture-item">
        <el-image fit="cover" :src="image.url" @click="showImagePreview(index)" />
        <el-button circle class="capture-delete" size="small" type="danger" @click.stop="removeImage(index)">
          <vab-icon icon="delete-bin-line" />
        </el-button>
      </div>
    </div>

    <el-image-viewer v-if="previewVisible" hide-on-click-modal :url-list="previewList" @close="previewVisible = false" />
  </div>
</template>

<script lang="ts" setup>
import type { PackingImageItem } from '/@/type/packagingShipping/shippedType'

defineOptions({
  name: 'PackingImageCapture',
})

const emit = defineEmits<{
  change: [value: PackingImageItem[]]
}>()

const imageList = defineModel<PackingImageItem[]>({ default: () => [] })
const cameraInputRef = ref<HTMLInputElement>()
const previewVisible = ref<boolean>(false)
const previewList = ref<string[]>([])

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  target.value = ''
  if (files.length === 0) return

  const images = files.map((file) => ({
    uid: generateUUID(),
    name: file.name,
    file,
    url: URL.createObjectURL(file),
  }))
  imageList.value = [...imageList.value, ...images]
  emit('change', imageList.value)
}

const showImagePreview = (index: number) => {
  const urls = imageList.value.map((image) => image.url)
  previewList.value = [...urls.slice(index), ...urls.slice(0, index)]
  previewVisible.value = true
}

const removeImage = (index: number) => {
  const nextImages = [...imageList.value]
  const [removed] = nextImages.splice(index, 1)
  if (removed?.url) {
    URL.revokeObjectURL(removed.url)
  }

  imageList.value = nextImages
  emit('change', nextImages)
}

onBeforeUnmount(() => {
  imageList.value.forEach((image) => {
    if (image.url) URL.revokeObjectURL(image.url)
  })
})

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
</script>

<style lang="scss" scoped>
.packing-image-capture {
  width: 100%;

  .el-button span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
}

.capture-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.capture-item {
  position: relative;
  width: 64px;
  height: 64px;

  .el-image {
    width: 64px;
    height: 64px;
    cursor: pointer;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
  }
}

.capture-delete {
  position: absolute;
  top: -7px;
  right: -7px;
  width: 18px;
  height: 18px;
  min-height: 18px;
}
</style>
