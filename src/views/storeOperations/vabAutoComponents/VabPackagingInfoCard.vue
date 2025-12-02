<template>
  <vab-card class="vab-packaging-info-card card3" style="height: 150px">
    <el-container v-loading="loading" style="display: flex; gap: 10px; align-items: center">
      <el-aside style="width: 2.5em">
        <el-text style="letter-spacing: 0.3em; writing-mode: vertical-lr">包装信息</el-text>
      </el-aside>
      <!-- 内容 -->
      <el-main style="flex: 1; padding: 0">
        <div class="grid-container">
          <div class="grid-item" data-label="amazon">
            <el-tooltip
              content="自量产品包装尺寸"
              :disabled="isOverflow"
              effect="dark"
              placement="top"
              popper-style="font-size: var(--el-font-size-base)"
            >
              <div class="grid-title" @mouseenter="tooltipIsDisHandler($event)">自量产品包装尺寸</div>
            </el-tooltip>
            <el-tooltip
              :content="`${packagingInfo?.length}×${packagingInfo?.width}×${packagingInfo?.height} cm`"
              :disabled="isOverflow"
              effect="dark"
              placement="top"
              popper-style="font-size: var(--el-font-size-base)"
            >
              <div class="grid-value" @mouseenter="tooltipIsDisHandler($event)">
                {{ packagingInfo?.length }}×{{ packagingInfo?.width }}×{{ packagingInfo?.height }} cm
              </div>
            </el-tooltip>
          </div>
          <div class="grid-item">
            <el-tooltip
              content="亚马逊产品包装尺寸"
              :disabled="isOverflow"
              effect="dark"
              placement="top"
              popper-style="font-size: var(--el-font-size-base)"
            >
              <div class="grid-title" @mouseenter="tooltipIsDisHandler($event)">亚马逊产品包装尺寸</div>
            </el-tooltip>
            <el-tooltip
              :content="`${packagingInfo?.amazonLength}×${packagingInfo?.amazonWidth}×${packagingInfo?.amazonHeight} cm`"
              :disabled="isOverflow"
              effect="dark"
              placement="top"
              popper-style="font-size: var(--el-font-size-base)"
            >
              <div class="grid-value" @mouseenter="tooltipIsDisHandler($event)">
                {{ packagingInfo?.amazonLength }}×{{ packagingInfo?.amazonWidth }}×{{ packagingInfo?.amazonHeight }}
                cm
              </div>
            </el-tooltip>
          </div>

          <div class="grid-item">
            <el-tooltip
              content="重量 (自量/亚马逊)"
              :disabled="isOverflow"
              effect="dark"
              placement="top"
              popper-style="font-size: var(--el-font-size-base)"
            >
              <div class="grid-title" @mouseenter="tooltipIsDisHandler($event)">重量 (自量/亚马逊)</div>
            </el-tooltip>
            <el-tooltip
              :content="`${packagingInfo?.weight}g / ${packagingInfo?.amazonWeight}g`"
              :disabled="isOverflow"
              effect="dark"
              placement="top"
              popper-style="font-size: var(--el-font-size-base)"
            >
              <div class="grid-value" @mouseenter="tooltipIsDisHandler($event)">
                {{ packagingInfo?.weight }}g / {{ packagingInfo?.amazonWeight }}g
              </div>
            </el-tooltip>
          </div>
          <div class="grid-item" data-label="fba">
            <el-tooltip
              content="FBA (自量/亚马逊)"
              :disabled="isOverflow"
              effect="dark"
              placement="top"
              popper-style="font-size: var(--el-font-size-base)"
            >
              <div class="grid-title" @mouseenter="tooltipIsDisHandler($event)">FBA (自量/亚马逊)</div>
            </el-tooltip>
            <el-tooltip
              :content="`${packagingInfo?.selfAssessmentFba} / ${packagingInfo?.amazonFba}`"
              :disabled="isOverflow"
              effect="dark"
              placement="top"
              popper-style="font-size: var(--el-font-size-base)"
            >
              <div class="grid-value" @mouseenter="tooltipIsDisHandler($event)">
                <span class="grid-value-green">${{ packagingInfo?.selfAssessmentFba }}</span>
                /
                <span>${{ packagingInfo?.amazonFba }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-main>
      <!-- 右侧图片 -->
      <el-aside :style="{ maxWidth: imageHeight + 'px', maxHeight: imageHeight + 'px', padding: '0' }">
        <el-image :src="packagingInfo?.imgUrl" style="display: block; border-radius: 10px">
          <template #error><el-icon /></template>
        </el-image>
        <el-button v-if="sku" size="small" style="width: 100%; margin-top: 8px" type="primary" @click="handleViewInspectionImages">
          查看质检图片
        </el-button>
      </el-aside>
    </el-container>
  </vab-card>
  <!-- 质检图片对话框 -->
  <vab-dialog v-model="inspectionImagesVisible" title="质检图片" width="80%">
    <div v-loading="inspectionImagesLoading" style="min-height: 400px">
      <!-- 基础图片 -->
      <div v-if="inspectionImages.basePictureImgList.length > 0" style="margin-bottom: 30px">
        <h3 style="margin-bottom: 15px; font-size: 16px; font-weight: 600">基础图片</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 15px">
          <el-image
            v-for="(item, index) in inspectionImages.basePictureImgList"
            :key="index"
            fit="cover"
            :src="item.imgUrl"
            style="width: 150px; height: 150px; border-radius: 8px; cursor: pointer"
            @click="handlePreviewImage(item.imgUrl)"
          >
            <template #error>
              <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: #999">
                <el-icon><picture-icon /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
      </div>
      <!-- 零件细节图片 -->
      <div v-if="inspectionImages.componentPictureImgList.length > 0" style="margin-bottom: 30px">
        <h3 style="margin-bottom: 15px; font-size: 16px; font-weight: 600">零件细节图片</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 15px">
          <el-image
            v-for="(item, index) in inspectionImages.componentPictureImgList"
            :key="index"
            fit="cover"
            :src="item.imgUrl"
            style="width: 150px; height: 150px; border-radius: 8px; cursor: pointer"
            @click="handlePreviewImage(item.imgUrl)"
          >
            <template #error>
              <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: #999">
                <el-icon><picture-icon /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
      </div>
      <!-- 成品组装图 -->
      <div v-if="inspectionImages.assemblyDrawingPictureImgList.length > 0">
        <h3 style="margin-bottom: 15px; font-size: 16px; font-weight: 600">成品组装图</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 15px">
          <el-image
            v-for="(item, index) in inspectionImages.assemblyDrawingPictureImgList"
            :key="index"
            fit="cover"
            :src="item.imgUrl"
            style="width: 150px; height: 150px; border-radius: 8px; cursor: pointer"
            @click="handlePreviewImage(item.imgUrl)"
          >
            <template #error>
              <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: #999">
                <el-icon><picture-icon /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
      </div>
      <!-- 无图片提示 -->
      <el-empty
        v-if="
          !inspectionImagesLoading &&
          inspectionImages.basePictureImgList.length === 0 &&
          inspectionImages.componentPictureImgList.length === 0 &&
          inspectionImages.assemblyDrawingPictureImgList.length === 0
        "
        description="暂无质检图片"
        style="min-height: 300px"
      />
    </div>
  </vab-dialog>
  <el-image-viewer v-if="previewVisible" hide-on-click-modal :url-list="[previewImageUrl]" @close="previewVisible = false" />
</template>

<script lang="ts" setup>
import { Picture as PictureIcon } from '@element-plus/icons-vue'
import { getNewPackageInspectionImages } from '/@/api/devlocal/packagingShipping'
import type { PictureImgList } from '/@/type/packagingShipping/packagingType'
import type { IGetOperationAmazonPackagingInformationRes } from '/@/type/storeOperation/productAnalysisType'

defineOptions({
  name: 'VabPackagingInfoCard',
})

interface Props {
  packagingInfo?: IGetOperationAmazonPackagingInformationRes
  loading?: boolean
  sku?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  sku: '',
})

const isOverflow = ref(false)
const imageHeight = ref<number>(0)
const inspectionImagesVisible = ref<boolean>(false)
const inspectionImagesLoading = ref<boolean>(false)
const inspectionImages = ref<{
  basePictureImgList: Array<{ id: number; imgUrl: string }>
  componentPictureImgList: Array<{ id: number; imgUrl: string }>
  assemblyDrawingPictureImgList: Array<{ id: number; imgUrl: string }>
}>({
  basePictureImgList: [],
  componentPictureImgList: [],
  assemblyDrawingPictureImgList: [],
})

const tooltipIsDisHandler = (event: any) => {
  if (event.target.clientWidth < event.target.scrollWidth) {
    isOverflow.value = false
  } else {
    isOverflow.value = true
  }
}

// 动态设置图片列高度
const setImageHeight = () => {
  const container = document.querySelector('.vab-packaging-info-card')
  if (!container) return

  const dom1 = container.querySelector('div[data-label="amazon"]')
  const dom2 = container.querySelector('div[data-label="fba"]')

  if (dom1 && dom2) {
    const height1 = dom1.getBoundingClientRect()
    const height2 = dom2.getBoundingClientRect()
    imageHeight.value = height2.bottom - height1.top
  }
}

// 查看质检图片
const handleViewInspectionImages = async () => {
  if (!props.sku) {
    return
  }
  inspectionImagesVisible.value = true
  inspectionImagesLoading.value = true
  try {
    const { data } = await getNewPackageInspectionImages({ sku: props.sku })
    if (data) {
      inspectionImages.value = {
        basePictureImgList: (data.basePictureImgList || []) as PictureImgList[],
        componentPictureImgList: (data.componentPictureImgList || []) as PictureImgList[],
        assemblyDrawingPictureImgList: (data.assemblyDrawingPictureImgList || []) as PictureImgList[],
      }
    }
  } catch (error) {
    console.error('获取质检图片失败:', error)
  } finally {
    inspectionImagesLoading.value = false
  }
}

// 预览图片
const previewImageUrl = ref<string>('')
const previewVisible = ref<boolean>(false)
const handlePreviewImage = (url: string) => {
  previewImageUrl.value = url
  previewVisible.value = true
}

onMounted(() => {
  nextTick(() => {
    setImageHeight()
  })
})
</script>

<style lang="scss" scoped>
.card3 {
  :deep() {
    .el-card__body {
      padding-top: 10px;
      padding-right: 10px;
      padding-bottom: 0;
      padding-left: 15px;
    }
  }
  margin-bottom: 10px;
}
.grid-container {
  display: grid;
  grid-template-rows: repeat(2, 1fr); /* 两行 */
  grid-template-columns: repeat(2, 1fr); /* 两列 */
  gap: 10px; /* 单元格间隙 */
  justify-content: flex-end;

  .grid-item {
    padding: 10px 5px 5px 10px;
    overflow: hidden;
    text-align: left;
    background-color: #f2f5fa;
    border: 0;
    border-radius: 5px;

    .grid-title {
      padding: 0 0 5px 0;
      margin-bottom: 3px;
      overflow: hidden;
      color: #606266;
      text-overflow: ellipsis;
      white-space: nowrap; /* 防止文字换行 */
    }
    .grid-value {
      overflow: hidden;
      font-size: var(--el-font-size-base);
      font-weight: 550;
      color: #4e88f3;
      text-overflow: ellipsis;
      white-space: nowrap; /* 防止文字换行 */

      &-green {
        color: #24ada1;
      }
      &-red {
        color: #d14d4d;
      }
    }
  }
}
</style>
