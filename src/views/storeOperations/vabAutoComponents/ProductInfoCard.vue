<template>
  <vab-card>
    <el-container style="display: flex; gap: 10px; align-items: flex-start">
      <!-- 左侧图片 -->
      <el-aside :style="{ maxWidth: imageMaxWidth + 'px', padding: '0' }">
        <el-image :src="productInfo?.skuImgUrl || ''" style="display: block; border-radius: 10px" @load="handleImageLoad">
          <template #error><el-icon /></template>
        </el-image>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main style="flex: 1; padding: 0">
        <!-- 第一部分：产品基本信息 -->
        <div class="product-info-section">
          <el-link
            class="custom-link"
            data-label="asin"
            :href="productInfo?.amazonUrl"
            style="font-weight: 600"
            target="_blank"
            type="primary"
          >
            {{ productInfo?.asin || '' }}
          </el-link>
          <span class="copySku" style="margin-left: 5px" @click="handleClipboard($event, productInfo?.asin || '')">
            <vab-icon icon="file-copy-2-fill" />
          </span>
          <div style="margin-top: 6px">
            <span class="copySku" @click="handleClipboard($event, productInfo?.sku || '')">
              {{ productInfo?.sku || '' }}
              <vab-icon icon="file-copy-2-fill" />
            </span>
          </div>
          <div style="margin-top: 6px">{{ productInfo?.productDesc || '' }}</div>
          <!-- 第二部分：评分 -->
          <el-link class="product-info-section" @click="handleGoToReview">
            <!-- 评分部分 -->
            <div class="rate-wrapper">
              <span class="rate-value">{{ productInfo?.rating || 0 }}</span>
              <span><el-rate v-model="displayRating" class="custom-rate" disabled :void-icon="Star" /></span>
              <span class="rate-count">{{ productInfo?.commentsNumbers || 0 }}</span>
            </div>
          </el-link>
        </div>

        <!-- 第三部分：VOC满意度和缺陷率 -->
        <div class="product-info-section">
          <el-link class="custom-link" style="margin-right: 10px; font-weight: 600" type="primary">买家之声</el-link>
          <el-tag v-if="productInfo?.vocSatisfaction === '极差'" class="customTag customTag-veryPoor">极差</el-tag>
          <el-tag v-if="productInfo?.vocSatisfaction === '一般'" class="customTag customTag-fair">一般</el-tag>
          <el-tag v-if="productInfo?.vocSatisfaction === '不合格'" class="customTag customTag-poor">不合格</el-tag>
          <el-tag v-if="productInfo?.vocSatisfaction === '良好'" class="customTag customTag-good">良好</el-tag>
          <el-tag v-if="productInfo?.vocSatisfaction === '极好'" class="customTag customTag-excellent">极好</el-tag>
          <!-- VOC满意度 -->

          <div data-label="缺陷率" style="margin-top: 6px">
            缺陷率：
            <span :style="{ color: vocColor }">{{ productInfo?.vocDefect || 0 }}%</span>
            | 缺陷订单：
            <span :style="{ color: vocColor }">{{ productInfo?.vocNcxCount || 0 }}</span>
            /{{ productInfo?.vocTotalOrderCount || 0 }}
          </div>
        </div>
      </el-main>
    </el-container>
  </vab-card>
</template>

<script lang="ts" setup>
import { Star } from '@element-plus/icons-vue'
import { computed, nextTick, ref, watch } from 'vue'
import handleClipboard from '~/src/utils/clipboard'
import { getAmazonStars } from '~/src/utils/rate'
import type { IGetProductInfo } from '/@/type/storeOperation/productAnalysisType'

defineOptions({
  name: 'ProductInfoCard',
})

interface Props {
  // 直接传递产品信息对象
  productInfo?: IGetProductInfo | null
}

const props = withDefaults(defineProps<Props>(), {
  productInfo: null,
})

// 图片最大宽度（动态计算）
const imageMaxWidth = ref<number>(0)

// 显示评分（用于 el-rate 组件）
const displayRating = computed(() => {
  return getAmazonStars(props.productInfo?.rating || 0, props.productInfo?.commentsNumbers || 0)
})

// 买家之声文本映射
const voiceOfCustomer = computed(() => {
  const map: Record<string, 'excellent' | 'good' | 'fair' | 'poor' | 'veryPoor'> = {
    excellent: 'excellent',
    good: 'good',
    fair: 'fair',
    poor: 'poor',
    veryPoor: 'veryPoor',
  }
  return map[props.productInfo?.vocSatisfaction || 'good'] || 'good'
})

// 根据 vocSatisfaction 获取对应的颜色
const vocColor = computed(() => {
  const colorMap: Record<string, string> = {
    极差: '#e32e00',
    不合格: '#ff9900',
    一般: '#ffc400',
    良好: '#bad411',
    极好: '#49850f',
  }
  return colorMap[props.productInfo?.vocSatisfaction || '良好'] || '#bad411'
})

// 处理图片加载，动态计算图片高度
const handleImageLoad = () => {
  nextTick(() => {
    const dom1 = document.querySelector('.custom-link[data-label="asin"]')
    const dom2 = document.querySelector('div[data-label="缺陷率"]')

    if (dom1 && dom2) {
      const height1 = dom1.getBoundingClientRect()
      const height2 = dom2.getBoundingClientRect()
      imageMaxWidth.value = height2.bottom - height1.top
    }
  })
}
const handleGoToReview = () => {
  window.open(`https://www.amazon.com/product-reviews/${props.productInfo?.asin}`, '_blank')
}
// 监听 props 变化，重新计算图片高度
watch(
  () => props.productInfo,
  () => {
    nextTick(() => {
      handleImageLoad()
    })
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss" scoped>
.product-info-section {
  margin-bottom: 10px;
  cursor: pointer;
}

.customTag {
  width: 7em;
  padding: 0 30px;
  color: #fff;
  border: 0;
  border-radius: 17px;

  &-veryPoor {
    background-color: #e32e00;
  }
  &-good {
    background-color: #bad411;
  }
  &-fair {
    background-color: #ffc400;
  }
  &-poor {
    background-color: #ff9900;
  }
  &-excellent {
    background-color: #49850f;
  }
}

.rate-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;

  .rate-value {
    width: 25px; /* 固定宽度，保证分数区域宽度一致 */
    text-align: left; /* 文本左对齐 */
  }
  .custom-rate {
    --el-rate-icon-size: 20px; /* 调整星星的大小 */
    --el-rate-fill-color: #f09000; /* 填充星星的颜色 */
    --el-rate-text-color: #f09000; /* 文本颜色一致 */
    --el-rate-disabled-void-color: #fff; /* 未填充星星的颜色 */
    --el-rate-void-color: #fff; /* 空星颜色 */

    :deep(.el-rate__item) {
      margin-top: -2px;
      margin-right: 0;
      margin-left: -9px;
      .el-icon {
        stroke: #f09000; /* 星星边框颜色 */
        stroke-width: 60px; /* 星星边框的粗细 */
      }
    }
  }
  .rate-count {
    margin-left: -11px;
    color: #36788c;
  }
}

.custom-link.is-underline::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 0;
  content: '';
  border-bottom: 1px solid var(--el-color-primary);
}
.copySku {
  cursor: pointer;
  -webkit-user-select: text;
  user-select: text;
  transition: all 0.3s;
  &:hover {
    color: #000;
  }
}
</style>
