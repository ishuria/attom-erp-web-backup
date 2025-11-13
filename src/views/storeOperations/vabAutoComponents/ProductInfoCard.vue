<template>
  <vab-card>
    <el-container style="display: flex; gap: 10px; align-items: flex-start">
      <!-- 左侧图片 -->
      <el-aside :style="{ maxWidth: imageMaxWidth + 'px', padding: '0' }">
        <el-image :src="imageUrl" style="display: block; border-radius: 10px" @load="handleImageLoad">
          <template #error><el-icon /></template>
        </el-image>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main style="flex: 1; padding: 0; font-weight: 600">
        <!-- 标题和描述 -->
        <div style="margin-bottom: 15px">
          <el-link class="custom-link" data-label="asin" style="font-weight: 600" type="primary">
            {{ asin }}
          </el-link>
          <div style="margin-top: 6px">{{ sku }}</div>
          <div style="margin-top: 6px">{{ title }}</div>
          <!-- 评分部分 -->
          <div class="rate-wrapper">
            <span class="rate-value">{{ rating }}</span>
            <span><el-rate v-model="displayRating" class="custom-rate" disabled :void-icon="Star" /></span>
            <span class="rate-count">{{ reviewCount }}</span>
          </div>
        </div>
        <!-- 买家之声和缺陷率 -->
        <div style="font-weight: 600">
          <el-link class="custom-link" style="margin-right: 10px; font-weight: 600" type="primary">买家之声</el-link>
          <el-tag :class="['customTag', `customTag-${voiceOfCustomer}`]">{{ voiceOfCustomerText }}</el-tag>
          <div data-label="缺陷率" style="margin-top: 6px">
            缺陷率：
            <span style="color: #bad411">{{ defectRate }}%</span>
            | 缺陷订单：
            <span style="color: #bad411">{{ defectOrders }}</span>
            /{{ totalOrders }}
          </div>
        </div>
      </el-main>
    </el-container>
  </vab-card>
</template>

<script lang="ts" setup>
import { Star } from '@element-plus/icons-vue'
import { computed, nextTick, ref, watch } from 'vue'

defineOptions({
  name: 'ProductInfoCard',
})

interface Props {
  // 产品信息
  asin?: string
  sku?: string
  title?: string
  imageUrl?: string
  // 评分相关
  rating?: number
  reviewCount?: number
  // 买家之声
  voiceOfCustomer?: 'excellent' | 'good' | 'fair' | 'poor' | 'veryPoor'
  // 缺陷率相关
  defectRate?: number
  defectOrders?: number
  totalOrders?: number
}

const props = withDefaults(defineProps<Props>(), {
  asin: '',
  sku: '',
  title: '',
  imageUrl: '',
  rating: 0,
  reviewCount: 0,
  voiceOfCustomer: 'good',
  defectRate: 0,
  defectOrders: 0,
  totalOrders: 0,
})

// 图片最大宽度（动态计算）
const imageMaxWidth = ref<number>(0)

// 显示评分（用于 el-rate 组件）
const displayRating = computed(() => {
  return props.rating || 0
})

// 买家之声文本映射
const voiceOfCustomerText = computed(() => {
  const map: Record<string, string> = {
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
    veryPoor: 'Very Poor',
  }
  return map[props.voiceOfCustomer] || 'Good'
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

// 监听 props 变化，重新计算图片高度
watch(
  () => [props.asin, props.sku, props.title, props.defectRate],
  () => {
    nextTick(() => {
      handleImageLoad()
    })
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
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
</style>
