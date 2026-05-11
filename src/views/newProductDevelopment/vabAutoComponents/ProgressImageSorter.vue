<template>
  <div class="progress-image-sorter">
    <vue-draggable
      v-model="localImages"
      :animation="150"
      class="image-list"
      draggable=".image-cell"
      ghost-class="ghost"
      @start="handleStart"
      @update="handleUpdate"
    >
      <div v-for="image in localImages" :key="image.imageId ?? image.imageUrl" class="image-cell">
        <div class="image-preview">
          <img :alt="String(image.imageId ?? '')" loading="lazy" :src="image.imageUrl" />
          <div class="image-actions">
            <el-icon @click.stop="$emit('preview', image)"><zoom-in /></el-icon>
            <el-icon @click.stop="$emit('remove', image)"><delete /></el-icon>
          </div>
        </div>
      </div>
    </vue-draggable>

    <div v-if="localImages.length < maxCount" class="image-cell" :style="{ marginLeft: localImages.length > 0 ? '8px' : 0 }">
      <div class="upload-placeholder" @click="$emit('upload')">
        <el-icon><plus /></el-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import type { ImageList } from '/@/type/progress/progressType'

type SortEvent = {
  oldIndex?: number
  newIndex?: number
  oldDraggableIndex?: number
  newDraggableIndex?: number
}

const props = withDefaults(
  defineProps<{
    images?: ImageList[]
    maxCount?: number
  }>(),
  {
    maxCount: 5,
  }
)

const emit = defineEmits<{
  preview: [image: ImageList]
  remove: [image: ImageList]
  upload: []
  sortChange: [images: ImageList[], idList: number[]]
}>()

const localImages = ref<ImageList[]>([])
const dragStartImages = ref<ImageList[]>([])

const copyImages = (images?: ImageList[]) => {
  return Array.isArray(images) ? [...images] : []
}

const moveImage = (images: ImageList[], oldIndex: number, newIndex: number) => {
  const nextImages = [...images]
  const [movedImage] = nextImages.splice(oldIndex, 1)

  if (!movedImage) return nextImages

  nextImages.splice(newIndex, 0, movedImage)
  return nextImages
}

watch(
  () => props.images,
  (images) => {
    localImages.value = copyImages(images)
  },
  {
    deep: true,
    immediate: true,
  }
)

const handleStart = () => {
  dragStartImages.value = copyImages(localImages.value)
}

const handleUpdate = (event: SortEvent) => {
  const oldIndex = event.oldDraggableIndex ?? event.oldIndex
  const newIndex = event.newDraggableIndex ?? event.newIndex

  if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return

  const sourceImages = dragStartImages.value.length > 0 ? dragStartImages.value : localImages.value
  const nextImages = moveImage(sourceImages, oldIndex, newIndex)

  localImages.value = nextImages
  emit(
    'sortChange',
    nextImages,
    nextImages.map((image) => image.imageId).filter((imageId): imageId is number => typeof imageId === 'number')
  )
  dragStartImages.value = []
}
</script>

<style lang="scss" scoped>
.progress-image-sorter {
  display: flex;
  align-items: center;
}

.ghost {
  background: #c8ebfb;
  opacity: 0.5;
}

.image-list {
  display: flex;
  gap: 8px;
  align-items: center;
}

.image-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 75px;

  .image-preview {
    position: relative;
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      cursor: move;
      object-fit: cover;
    }

    .image-actions {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0);
      opacity: 0;
      transition: all 0.3s;

      .el-icon {
        font-size: 20px;
        color: #fff;
        cursor: pointer;

        &:hover {
          transform: scale(1.1);
        }
      }
    }

    &:hover .image-actions {
      background: rgba(0, 0, 0, 0.45);
      opacity: 1;
    }
  }

  .upload-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);

    &:hover {
      border-color: var(--el-color-primary);

      .el-icon {
        color: var(--el-color-primary);
      }
    }

    .el-icon {
      font-size: 20px;
      color: #999;
    }
  }
}
</style>
