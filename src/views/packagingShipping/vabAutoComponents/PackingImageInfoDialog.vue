<template>
  <vab-dialog v-model="visible" title="装箱图片" width="60%">
    <div class="packing-image-info-grid">
      <el-image
        v-for="(imageUrl, index) in imageList"
        :key="`${imageUrl}-${index}`"
        class="packing-image-info-img"
        close-on-press-escape
        fit="cover"
        hide-on-click-modal
        :preview-src-list="imageList"
        :src="imageUrl"
      >
        <template #error>
          <div class="packing-image-info-error">
            <el-icon>
              <icon-picture />
            </el-icon>
            <span>图片加载失败</span>
          </div>
        </template>
      </el-image>
    </div>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Picture as IconPicture } from '@element-plus/icons-vue'

defineOptions({
  name: 'PackingImageInfoDialog',
})
const visible = defineModel<boolean>({ default: false })

defineProps<{
  imageList: string[]
}>()
</script>

<style lang="scss" scoped>
.packing-image-info-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 32px 54px;
  max-height: 60vh;
  overflow: auto;
}

.packing-image-info-img {
  width: 100%;
  aspect-ratio: 16 / 9;
  cursor: pointer;
}

.packing-image-info-error {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);

  .el-icon {
    font-size: 32px;
  }

  span {
    font-size: 13px;
  }
}

@media (max-width: 1200px) {
  .packing-image-info-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .packing-image-info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
}
</style>
