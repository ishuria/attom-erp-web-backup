<template>
  <vab-card :body-style="{ height: '422px' }" class="low-volume-product-storage-fees-card" skeleton>
    <template #header>
      <vab-icon icon="align-top" />
      做Vine回评追踪
      <div class="right-select">
        <el-select v-model="userId" placeholder="人员" style="max-width: 5em" @change="fetchData">
          <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
      </div>
    </template>
    <el-table
      v-loading="loading"
      border
      :cell-class-name="clearPadding"
      :data="list"
      :default-sort="{ prop: 'estimateNextMonthStorageFee', order: 'descending' }"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
    >
      <el-table-column label="图片" prop="skuImgUrl" width="75">
        <template #default="{ row }">
          <el-image :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row.skuImgUrl)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" :min-width="flexColumnWidth(list, 'SKU', 'sku', 50)" prop="sku">
        <template #default="{ row }">
          <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)">
            <el-link class="sku-text" :href="row.amazonUrl" target="_blank">{{ row.sku }}</el-link>

            <vab-icon icon="file-copy-2-fill" />
          </span>
          <br />
          <!-- <div class="product-desc-container">
            <span class="product-desc">{{ row.productDesc }}</span>
            <span class="flag-container" :class="{ 'japan-flag': row.flag === 'JP' }">
              <country-flag :country="row.flag" />
            </span>
          </div> -->
          <div class="rate-wrapper">
            <span class="rate-value">{{ row.janEndRating }}</span>
            <span>
              <el-rate v-model="row.displayRating" class="custom-rate" disabled :void-icon="Star" />
            </span>
            <span class="rate-count">{{ row.janEndNum }}</span>
            <span :class="{ 'japan-flag': row.flag === 'JP' }" style="margin-top: -2px">
              <country-flag :country="row.flag" />
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上线日期" min-width="115" prop="saleDate" />
      <el-table-column align="center" label="上新天数" min-width="100" prop="newArrivalDay" />
      <el-table-column align="center" label="Vine数量" min-width="100" prop="vineCount" />
      <el-table-column align="center" label="产品经理" min-width="100" prop="productManager" />
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
      </template>
    </el-table>

    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="[imagePreviewUrl]" @close="imagePreviewClose" />
  </vab-card>
</template>

<script lang="ts" setup>
import { Star } from '@element-plus/icons-vue'
import CountryFlag from 'vue-country-flag-next'
import { getFrontPageVineReviewCard } from '/@/api/devlocal/frontPage'
import handleClipboard from '/@/utils/clipboard'
import { getAmazonStars } from '/@/utils/rate'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'VineReviewCard',
})

const props = defineProps<{
  userList: { id: number; label: string }[]
}>()
const userId = ref<number>(-1)
const imagePreviewVisible = ref(false)
const imagePreviewUrl = ref('')
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewUrl.value = url
}

const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}
const list = ref<any[]>([])
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  const { data } = await getFrontPageVineReviewCard({ userId: userId.value })
  list.value = data
  for (const item of list.value) {
    item.displayRating = getAmazonStars(item.janEndRating, item.janEndNum)
  }
  loading.value = false
}
onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.low-volume-product-storage-fees-card {
  position: relative;

  :deep(.el-card__header) {
    position: relative;

    display: flex;
    align-items: center;
  }

  .right-select {
    position: absolute;
    top: 50%;
    right: 10px;
    width: auto;
    height: 60px;
    line-height: 60px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    z-index: 10;
  }
  :deep(.el-table) {
    height: calc(100% - 52px);
  }
}
.low-volume-product-storage-fees-card :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.low-volume-product-storage-fees-card :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
// 产品描述和国旗容器样式
.product-desc-container {
  display: flex;
  align-items: center;
  gap: 4px;
}

.flag-container {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-top: -4px;
}

// 日本国旗样式增加边框
.japan-flag {
  :deep(.flag) {
    border: 1px solid #ddd;
  }
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
.sku-text {
  :deep(.el-link__inner) {
    display: inline-block;
    margin-right: 3px;
    vertical-align: middle;
  }
}
.rate-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;

  .rate-value {
    width: 25px; /* 固定宽度，保证分数区域宽度一致 */
    text-align: left; /* 文本右对齐 */
  }
  .custom-rate {
    --el-rate-icon-size: 20px; /* 调整星星的大小 */
    --el-rate-fill-color: #f09000; /* 填充星星的颜色 */
    --el-rate-text-color: #f09000; /* 文本颜色一致 */
    --el-rate-disabled-void-color: #fff; /* 未填充星星的颜色 */
    --el-rate-void-color: #fff; /* 空星颜色 */

    :deep() {
      .el-rate__item {
        margin-top: -2px;
        margin-right: 0;
        margin-left: -9px;
        .el-icon {
          stroke: #f09000; /* 星星边框颜色 */
          stroke-width: 60px; /* 星星边框的粗细 */
        }
        cursor: pointer;
      }
    }
  }
  .rate-count {
    margin-left: -11px;
    color: #36788c;
  }
}
</style>
