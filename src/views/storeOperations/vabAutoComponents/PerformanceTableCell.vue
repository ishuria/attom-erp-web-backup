<template>
  <!-- 图片 -->
  <span v-if="item.label === '图片'">
    <el-image
      fit="fill"
      loading="lazy"
      :src="row.skuImgUrl || row.asinImgUrl"
      style="display: block; width: 75px; height: 75px; min-width: 75px; min-height: 75px"
      @click="$emit('imagePreview', row.skuImgUrl || row.asinImgUrl)"
    >
      <template #error>
        <div style="width: 75px; height: 75px; display: flex; align-items: center; justify-content: center; background-color: #f5f5f5">
          <el-icon />
        </div>
      </template>
    </el-image>
  </span>

  <!-- SKU 展示（仅SKU类型）-->
  <span v-else-if="item.label === 'SKU' && type === 'sku'" class="sku-container">
    <div>
      <span class="copySku" @click="handleClipboard($event, row.sku)">
        <el-link class="sku-text" :href="row.amazonUrl" target="_blank">{{ row.sku }}</el-link>
        <el-tooltip effect="dark" placement="top">
          <template #content>
            <div class="custom-tooltip">复制SKU</div>
          </template>
          <vab-icon icon="file-copy-2-fill" />
        </el-tooltip>
      </span>
      <el-tooltip effect="dark" placement="top">
        <template #content>
          <div class="custom-tooltip">复制ASIN</div>
        </template>
        <vab-icon icon="file-copy-line" @click="handleClip(row.asin)" />
      </el-tooltip>
    </div>

    <div class="rate-wrapper" style="cursor: pointer" @click="goToReview(row.asin)">
      <span class="rate-value">{{ row.rating !== 0 && row.rating != null ? row.rating.toFixed(1) : 0 }}</span>
      <span>
        <el-rate v-model="row.displayRating" class="custom-rate" disabled :void-icon="Star" />
      </span>
      <span class="rate-count">{{ row.commentsNumbers }}</span>
      <span :class="{ 'japan-flag': row.flag === 'JP' }" style="margin-top: -2px">
        <country-flag :country="row.flag" />
      </span>

      <el-tag class="order-tag" effect="dark" @click.stop="$emit('showReleaseOrder', row)">订</el-tag>
      <el-tag class="order-tag" effect="dark" type="info" @click.stop="$emit('showRemark', row)">备</el-tag>
      <el-tag class="order-tag" effect="dark" type="success" @click.stop="$emit('showOperationLog', row)">志</el-tag>
    </div>
    <!-- 状态图标 -->
    <div class="icon-div">
      <el-tooltip v-if="row.newArrivalDay <= 360" effect="dark" placement="top">
        <template #content>
          <div class="custom-tooltip">上新时间<=360天</div>
        </template>
        <el-tag size="small" type="success">新</el-tag>
      </el-tooltip>
      <el-tooltip v-if="row.outletDeal === 1" effect="dark" placement="top">
        <template #content>
          <div class="custom-tooltip">可以做outlet deal</div>
        </template>
        <img src="../../../icon/outlet.png" style="width: 22px; height: 22px; margin-top: -2px" />
      </el-tooltip>
      <el-tooltip v-if="isOutOfStock(row)" effect="dark" placement="top">
        <template #content>
          <div class="custom-tooltip">断货警告</div>
        </template>
        <vab-icon :class="handleOutOfStock(row)" icon="shopping-cart-2-fill" />
      </el-tooltip>
      <el-tooltip v-if="isLowDelivery(row)" effect="dark" placement="top">
        <template #content>
          <div class="custom-tooltip">有低量配送费</div>
        </template>
        <vab-icon class="icon-red" icon="home-6-line" />
      </el-tooltip>
      <el-tooltip v-if="isWareHousing(row)" effect="dark" placement="top">
        <template #content>
          <div class="custom-tooltip">低量仓储费预警</div>
        </template>
        <vab-icon class="icon-yellow" icon="home-6-line" />
      </el-tooltip>
      <el-tooltip v-if="isStorageAge(row)" effect="dark" placement="top">
        <template #content>
          <div class="custom-tooltip">库龄警告</div>
        </template>
        <vab-icon :class="handleStorageAge(row)" icon="alarm-warning-fill" />
      </el-tooltip>
      <el-tooltip v-if="isVoc(row)" effect="dark" placement="top">
        <template #content>
          <div class="custom-tooltip">VOC满意度: {{ row.vocSatisfaction }}</div>
        </template>
        <vab-icon :class="handleVocSatisfaction(row.vocSatisfaction)" icon="emotion-unhappy-fill" />
      </el-tooltip>
      <el-tooltip v-if="isAvailableSaleDayTotal(row)" effect="dark" placement="top">
        <template #content>
          <div class="custom-tooltip">低动销预警</div>
        </template>
        <vab-icon :class="handleAvailableSaleDayTotal(row)" icon="line-chart-fill" />
      </el-tooltip>
      <el-tooltip v-if="isReturnGoods(row)" effect="dark" placement="top">
        <template #content>
          <div class="custom-tooltip">高退货率</div>
        </template>
        <vab-icon :class="handleReturnGoods(row)" icon="reply-fill" />
      </el-tooltip>
      <el-tooltip v-if="isFBA(row)" effect="dark" placement="top">
        <template #content>
          <div class="custom-tooltip">FBA费异常</div>
        </template>
        <img alt="FBA" src="../../../icon/FBA费异常.svg" style="width: 20px; height: 20px; margin-top: -1px" />
      </el-tooltip>
      <el-tooltip v-if="isHealthy(row)" effect="dark" placement="top">
        <template #content>
          <div class="custom-tooltip">产品健康</div>
        </template>
        <vab-icon class="icon-green" icon="checkbox-circle-fill" />
      </el-tooltip>
    </div>
  </span>

  <!-- ASIN 展示（仅ASIN类型）-->
  <span v-else-if="item.label === 'ASIN' && type === 'asin'">
    <el-link :href="row.amazonUrl" style="margin-right: 3px" target="_blank">{{ row.asin }}</el-link>
    <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.asin)">
      <vab-icon icon="file-copy-2-fill" />
    </span>
    <div class="rate-wrapper" style="cursor: pointer" @click="goToReview(row.asin)">
      <span class="rate-value">{{ row.rating !== 0 && row.rating != null ? row.rating.toFixed(1) : 0 }}</span>
      <span><el-rate v-model="row.displayRating" class="custom-rate" disabled :void-icon="Star" /></span>
      <span class="rate-count">{{ row.commentsNumbers }}</span>
      <span :class="{ 'japan-flag': row.flag === 'JP' }" style="margin-top: -2px">
        <country-flag :country="row.flag" />
      </span>
    </div>
  </span>

  <!-- SKU 展示（ASIN和Parent ASIN类型）-->
  <span v-else-if="item.label === 'SKU' && (type === 'asin' || type === 'pAsin')">
    <el-tooltip content=" " :disabled="!row.overflow_sku" effect="dark" placement="top">
      <template #content>
        <div class="custom-tooltip">{{ row._skuFull }}</div>
      </template>
      <span v-html="row._sku"></span>
    </el-tooltip>
  </span>

  <!-- 父体ASIN 展示 -->
  <span v-else-if="item.label === '父体ASIN'">
    <el-link v-if="type === 'pAsin'" type="primary">{{ row.parentAsin }}</el-link>
    <el-link v-else type="primary">{{ row.parentAsin }}</el-link>
    <div v-if="type === 'pAsin'" class="rate-wrapper" style="cursor: pointer" @click="goToReview(row.asin)">
      <span class="rate-value">{{ row.rating !== 0 && row.rating != null ? row.rating.toFixed(1) : 0 }}</span>
      <span><el-rate v-model="row.displayRating" class="custom-rate" disabled :void-icon="Star" /></span>
      <span class="rate-count">{{ row.commentsNumbers }}</span>
      <span :class="{ 'japan-flag': row.flag === 'JP' }" style="margin-top: -2px">
        <country-flag :country="row.flag" />
      </span>
    </div>
  </span>

  <!-- 销量趋势 -->
  <span v-else-if="item.label === '销量趋势(点击看明细)'">
    <div class="custom-bar">
      <vab-echarts-chart-bar :x-axis-data="xAxis" :y-axis-data="row.saleVolumeList" />
    </div>
  </span>

  <!-- 运营分类 -->
  <span v-else-if="item.label === '运营分类'">
    <el-select v-model="row.operationTypeId" style="min-width: 100%" @change="$emit('updateOpeType', row)">
      <el-option v-for="a in row.operationTypeList" :key="a.id" :label="a.label" :value="a.id" />
    </el-select>
  </span>

  <!-- 停产 -->
  <span v-else-if="item.label === '停产'">
    <el-checkbox
      v-if="row.operationUserName === userName || row.developName?.includes(userName) || isBoss"
      v-model="row.stopProductStatus"
      :false-value="0"
      :true-value="1"
      @change="$emit('updateStopStatus', row)"
    />
    <vab-icon v-else-if="row.stopProductStatus === 1" icon="checkbox-circle-fill" style="color: var(--el-color-danger); font-size: 23px" />
    <vab-icon
      v-else-if="row.stopProductStatus === 0 || row.stopProductStatus === null"
      icon="close-circle-fill"
      style="color: var(--el-color-success); font-size: 23px"
    />
  </span>

  <!-- 自量FBA -->
  <span v-else-if="item.label === '自量FBA'">
    {{ row.currencyIcon + (row.selfAssessmentFba ?? '') }}
    <br />
    {{ row.currencyIcon + (row.amazonFba ?? '') }}
  </span>

  <!-- 通用货币字段 -->
  <span v-else-if="label1Set.has(item.label)">
    {{ row[label1Map.get(item.label) as string] ? row.currencyIcon + row[label1Map.get(item.label) as string] : '' }}
  </span>

  <!-- 通用百分比字段（2位小数） -->
  <span v-else-if="label2Set.has(item.label)">
    {{ formatPercentage(row[label2Map.get(item.label) as string], 2) }}
  </span>

  <!-- 通用天数字段 -->
  <span v-else-if="label3Set.has(item.label)">
    {{ row[label3Map.get(item.label)!] != null ? row[label3Map.get(item.label)!] + '天' : '' }}
  </span>

  <!-- 断货 -->
  <span v-else-if="item.label === '断货'">
    <el-text v-if="row.outOfStock >= 5" type="danger">{{ row.outOfStock }}天</el-text>
    <el-text v-else-if="row.outOfStock > 0 && row.outOfStock < 5" type="warning">{{ row.outOfStock }}天</el-text>
    <el-text v-else type="success">{{ row.outOfStock }}天</el-text>
  </span>

  <!-- 半年有货率 -->
  <span v-else-if="item.label === '半年有货率'">
    <el-text v-if="row.availableRate != null && row.availableRate >= 0.95" type="success">
      {{ formatPercentage(row.availableRate, 0) }}
    </el-text>
    <el-text v-else-if="row.availableRate != null && row.availableRate >= 0.9" type="warning">
      {{ formatPercentage(row.availableRate, 0) }}
    </el-text>
    <el-text v-else-if="row.availableRate != null && row.availableRate < 0.9" type="danger">
      {{ formatPercentage(row.availableRate, 0) }}
    </el-text>
    <span v-else>{{ formatPercentage(row.availableRate, 0) }}</span>
  </span>

  <!-- 通用百分比字段（0位小数） -->
  <span v-else-if="label4Set.has(item.label)">
    {{ formatPercentage(row[label4Map.get(item.label) as string], 0) }}
  </span>

  <!-- VOC满意度 -->
  <span v-else-if="item.label === 'VOC满意度'">
    {{ row.vocNcxCount }} / {{ row.vocTotalOrderCount }}
    <el-tag v-if="row.vocSatisfaction === '极差'" class="customTag customTag-veryPoor">
      极差 {{ formatPercentage(row.vocDefect, 2) }}
    </el-tag>
    <el-tag v-if="row.vocSatisfaction === '一般'" class="customTag customTag-fair">一般 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
    <el-tag v-if="row.vocSatisfaction === '不合格'" class="customTag customTag-poor">
      不合格 {{ formatPercentage(row.vocDefect, 2) }}
    </el-tag>
    <el-tag v-if="row.vocSatisfaction === '良好'" class="customTag customTag-good">良好 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
    <el-tag v-if="row.vocSatisfaction === '极好'" class="customTag customTag-excellent">
      极好 {{ formatPercentage(row.vocDefect, 2) }}
    </el-tag>
  </span>

  <!-- 状态 -->
  <span v-else-if="item.label === '状态'">
    <el-tag v-if="row.status === 0" type="danger">停售</el-tag>
    <el-tag v-if="row.status === 1" type="success">正常</el-tag>
    <el-tag v-if="row.status === -1" type="info">领星未同步</el-tag>
    <el-tag v-if="row.status === 2" type="warning">链接不完整</el-tag>
  </span>

  <!-- 广告 -->
  <span v-else-if="item.label === '广告'">
    <el-tooltip effect="light" placement="top">
      <template #content>
        <div class="custom-tooltip">
          <div style="margin-bottom: 5px">
            SP
            <el-tag v-if="row.advertisementStatusSp === 1" type="success">开</el-tag>
            <el-tag v-else type="danger">关</el-tag>
          </div>
          <div style="margin-bottom: 5px">
            SD
            <el-tag v-if="row.advertisementStatusSd === 1" type="success">开</el-tag>
            <el-tag v-else type="danger">关</el-tag>
          </div>
          <div>
            SB
            <el-tag v-if="row.advertisementStatusSb === 1" type="success">开</el-tag>
            <el-tag v-else type="danger">关</el-tag>
          </div>
        </div>
      </template>
      <span style="display: inline-block">
        <el-tag v-if="row.advertisementStatus === 0" type="danger">关</el-tag>
        <el-tag v-if="row.advertisementStatus === 1" type="success">开</el-tag>
      </span>
    </el-tooltip>
  </span>

  <!-- 运营备注 -->
  <span v-else-if="item.label === '运营备注'">
    <el-tooltip content=" " effect="dark" placement="top">
      <template #content>
        <div class="custom-tooltip">{{ removeHtmlTags(row.operationRemark) }}</div>
      </template>
      <el-text style="vertical-align: middle" truncated>{{ removeHtmlTags(row.operationRemark) }}</el-text>
    </el-tooltip>
  </span>

  <!-- 饼图 -->
  <span v-else-if="item.label === '饼图'">
    <div style="width: 100%; height: 60px">
      <vab-echarts-chart-pie :data="row.pieList || row?.pieList || []" />
    </div>
  </span>

  <!-- 季节趋势 -->
  <span v-else-if="item.label === '季节趋势'">
    <div style="width: 100%; height: 50px">
      <vab-table-chart-line :x-axis-data="seasonalXData" :y-axis-data="row._actualList || []" />
    </div>
  </span>

  <!-- 当前售价 -->
  <span v-else-if="item.label === '当前售价'">
    <el-link type="primary" @click="$emit('routerPush', row)">{{ row.currencyIcon + row.sellingPrice }}</el-link>
  </span>

  <!-- 小类排名 -->
  <span v-else-if="item.label === '小类排名'">
    <div
      v-if="
        row.nowSubcategoryRanking !== null &&
        row.beforeSubcategoryRanking !== null &&
        row.nowSubcategoryRanking - row.beforeSubcategoryRanking !== 0
      "
    >
      <div>{{ row.nowSubcategoryRanking }}</div>
      <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking < 0" class="arrow-up" icon="arrow-up-fill" />
      <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking > 0" class="arrow-down" icon="arrow-down-fill" />
      <span style="color: #999">{{ Math.abs(row.nowSubcategoryRanking - row.beforeSubcategoryRanking) }}</span>
    </div>
    <div
      v-if="
        row.nowSubcategoryRanking !== null &&
        row.beforeSubcategoryRanking !== null &&
        row.nowSubcategoryRanking - row.beforeSubcategoryRanking === 0
      "
    >
      <el-space>
        {{ row.nowSubcategoryRanking }}
        <span style="font-weight: 600">-</span>
      </el-space>
    </div>
  </span>

  <!-- 大类排名 -->
  <span v-else-if="item.label === '大类排名'">
    <div
      v-if="
        row.nowMajorCategoryRanking !== null &&
        row.beforeMajorCategoryRanking !== null &&
        row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking !== 0
      "
    >
      <div>{{ row.nowMajorCategoryRanking }}</div>
      <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking < 0" class="arrow-up" icon="arrow-up-fill" />
      <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking > 0" class="arrow-down" icon="arrow-down-fill" />
      <span style="color: #999">{{ Math.abs(row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking) }}</span>
    </div>
    <div
      v-if="
        row.nowMajorCategoryRanking !== null &&
        row.beforeMajorCategoryRanking !== null &&
        row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking === 0
      "
    >
      <el-space>
        {{ row.nowMajorCategoryRanking }}
        <span style="font-weight: 600">-</span>
      </el-space>
    </div>
  </span>

  <!-- 剩余库存 -->
  <span v-else-if="item.label === '剩余库存'">
    {{ row.fbaCount }}
    <span style="color: var(--el-color-warning)">
      {{ row.acceptingCount === 0 || row.acceptingCount === null ? '' : `(${row.acceptingCount})` }}
    </span>
    / {{ row.availableInventory }}
  </span>

  <!-- 库龄 -->
  <span v-else-if="item.label === '库龄' && row.storageAge">
    <span v-html="row.storageAge"></span>
  </span>

  <!-- 订货# -->
  <span v-else-if="item.label === '订货#'">
    {{ row.orderCount }}
    <br />
    <span style="font-weight: bold">{{ row.orderTotalNumber }}</span>
  </span>

  <!-- 开发人员 -->
  <span v-else-if="item.label === '开发人员'">
    <el-tooltip content=" " :disabled="!row.overflow_developName" effect="dark" placement="top">
      <template #content>
        <div class="custom-tooltip">{{ row._developNameFull }}</div>
      </template>
      <span v-html="row._developName"></span>
    </el-tooltip>
  </span>

  <!-- 2周广告点击 -->
  <span v-else-if="item.label === '2周广告点击'" style="display: flex; justify-content: center">
    <div style="width: fit-content; text-align: left">
      <div>{{ formatPercentage(row.tWksClickRate, 2) }}</div>
      <div>({{ row.tWksClicks }})</div>
    </div>
  </span>

  <!-- 最近入库 -->
  <span v-else-if="item.label === '最近入库'">
    <div style="white-space: pre-wrap">{{ row.recentlyInboundStorage }}</div>
  </span>

  <!-- 美工长期 -->
  <span v-else-if="item.label === '美工长期'">
    <el-checkbox v-model="row.artLongTermFlag" disabled />
  </span>

  <!-- PASIN毛利率 -->
  <span v-else-if="item.label === 'PASIN毛利率'">{{ row.pAsinMonthNetProfitMargin }}%</span>
  <!-- PASIN毛利润 -->
  <span v-else-if="item.label === 'PASIN毛利润'">{{ row.currencyIcon }}{{ row.pAsinMonthNetProfit }}</span>
  <!-- 预估下月仓储费 -->
  <span v-else-if="item.label === '预估下月仓储费'">{{ row.currencyIcon }}{{ row.estimateNextMonthStorageFee }}</span>

  <!-- 默认显示：如果以上条件都不匹配，直接显示原始值 -->
  <span v-else>{{ row[item.prop] }}</span>
</template>

<script lang="ts" setup>
import { Star } from '@element-plus/icons-vue'
import CountryFlag from 'vue-country-flag-next'
import handleClipboard, { handleClip } from '/@/utils/clipboard'
import { formatPercentage } from '/@/utils/rate'
import { removeHtmlTags } from '/@/utils/tableColum'

defineOptions({
  name: 'PerformanceTableCell',
})

interface Props {
  item: any
  row: any
  type?: 'sku' | 'asin' | 'pAsin'
  xAxis?: number[]
  seasonalXData?: string[]
  userName?: string
  isBoss?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'sku',
  xAxis: () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  seasonalXData: () => [],
  userName: '',
  isBoss: false,
})

defineEmits<{
  imagePreview: [url: string]
  showReleaseOrder: [row: any]
  showRemark: [row: any]
  showOperationLog: [row: any]
  updateOpeType: [row: any]
  updateStopStatus: [row: any]
  routerPush: [row: any]
}>()

// 使用 Set 优化查找性能
const label1Set = new Set([
  '今销',
  'FBA仓储费',
  'FBA差异',
  '月净利润',
  '结算月额',
  '订单月额',
  '月广告销售',
  '月广告支出',
  '预计下月仓储费',
  '盈亏售价',
  '30毛利售价',
  'B2B销售额',
  '当前实际售价',
])
const label2Set = new Set([
  '试算毛利',
  '2周广告转化',
  '2周总转化',
  '月净利',
  '月ACOS',
  '月TACOS',
  '1年ACOS',
  '1年TACOS',
  '月退货%',
  '月退款%',
])
const label3Set = new Set(['上新', '可售', '可售总'])
const label4Set = new Set(['今广', '半年有货率', '月广%'])

const label1Map = new Map([
  ['今销', 'currentSalesPrice'],
  ['FBA仓储费', 'fbaStorageFee'],
  ['FBA差异', 'differenceFba'],
  ['月净利润', 'monthNetProfit'],
  ['结算月额', 'monthSalesPrice'],
  ['订单月额', 'monthOrderSales'],
  ['月广告销售', 'monthAdvSales'],
  ['月广告支出', 'monthAdvExpenditure'],
  ['预计下月仓储费', 'estimateNextMonthStorageFee'],
  ['盈亏售价', 'profitLossSellingPrice'],
  ['30毛利售价', 'grossSellingPrice'],
  ['B2B销售额', 'currentB2bSalesPrice'],
  ['当前实际售价', 'landedPrice'],
])
const label2Map = new Map([
  ['试算毛利', 'grossProfit'],
  ['2周广告转化', 'tWksAdvRate'],
  ['2周总转化', 'tWksTotalConv'],
  ['月净利', 'monthNetProfitMargin'],
  ['月ACOS', 'monthAcos'],
  ['月TACOS', 'monthTacos'],
  ['1年ACOS', 'yearAcos'],
  ['1年TACOS', 'yearTacos'],
  ['月退货%', 'monthReturnGoods'],
  ['月退款%', 'monthRefund'],
])
const label3Map = new Map([
  ['上新', 'newArrivalDay'],
  ['可售', 'esAvailableSaleDay'],
  ['可售总', 'esAvailableSaleDayTotal'],
])
const label4Map = new Map([
  ['今广', 'currentAdvertisement'],
  ['半年有货率', 'availableRate'],
  ['月广%', 'monthAdv'],
])

// 判断函数
const isOutOfStock = (row: any) => {
  if (row.fbaCount === 0 || row.outOfStock > 0) {
    return true
  }
  return false
}
const isLowDelivery = (row: any) => {
  if (row.lowVolumeDelivery === 1) {
    return true
  }
  return false
}
const isWareHousing = (row: any) => {
  if (row.warehousing >= 28 && row.warehousing <= 35) {
    return true
  }
  return false
}
const isStorageAge = (row: any) => {
  if (!row.inventoryAgeLevel1Days && !row.inventoryAgeLevel2Days && !row.inventoryAgeLevel3Days) {
    return false
  }
  if (!row.inventoryAgeLevel1Days || !row.inventoryAgeLevel2Days || !row.inventoryAgeLevel3Days) {
    return true
  }
  return false
}
const isVoc = (row: any) => {
  if (row.vocSatisfaction === '一般' || row.vocSatisfaction === '不合格' || row.vocSatisfaction === '极差') {
    return true
  }
  return false
}
const isAvailableSaleDayTotal = (row: any) => {
  if (row.esAvailableSaleDayTotal > 180) {
    return true
  }
  return false
}
const isReturnGoods = (row: any) => {
  if (row.monthReturnGoods >= 0.05) {
    return true
  }
  return false
}
const isFBA = (row: any) => {
  if (row.differenceFba < 0) {
    return true
  }
  return false
}
const isHealthy = (row: any) => {
  if (
    !isOutOfStock(row) &&
    !isLowDelivery(row) &&
    !isWareHousing(row) &&
    !isStorageAge(row) &&
    !isVoc(row) &&
    !isAvailableSaleDayTotal(row) &&
    !isReturnGoods(row) &&
    !isFBA(row)
  ) {
    return true
  }
  return false
}
const handleOutOfStock = (row: any) => {
  let className = ''
  if (row.outOfStock > 0) {
    className = 'icon-yellow'
  }
  if (row.fbaCount === 0) {
    className = 'icon-red'
  }
  return className
}
const handleStorageAge = (row: any) => {
  let className = ''
  if (!row.inventoryAgeLevel1Days) {
    className = 'icon-yellow'
  }
  if (!row.inventoryAgeLevel2Days) {
    className = 'icon-orange'
  }
  if (!row.inventoryAgeLevel3Days) {
    className = 'icon-red'
  }
  return className
}
const handleVocSatisfaction = (voc: string) => {
  if (voc === '一般') {
    return 'icon-yellow'
  } else if (voc === '不合格') {
    return 'icon-orange'
  } else if (voc === '极差') {
    return 'icon-red'
  }
}
const handleAvailableSaleDayTotal = (row: any) => {
  let className = ''
  if (row.esAvailableSaleDayTotal > 180) {
    className = 'icon-yellow'
  }
  if (row.esAvailableSaleDayTotal > 270) {
    className = 'icon-orange'
  }
  if (row.esAvailableSaleDayTotal > 365) {
    className = 'icon-red'
  }
  return className
}
const handleReturnGoods = (row: any) => {
  let className = ''
  if (row.monthReturnGoods >= 0.05) {
    className = 'icon-yellow'
  }
  if (row.monthReturnGoods >= 0.08) {
    className = 'icon-red'
  }
  return className
}

const goToReview = (asin: string) => {
  window.open(`https://www.amazon.com/product-reviews/${asin}`, '_blank')
}
</script>

<style lang="scss" scoped>
.copySku {
  display: inline-block;
  padding: 0;
  cursor: pointer;
  -webkit-user-select: text;
  user-select: text;
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
.sku-container {
  .icon-div {
    display: flex;
    align-items: center;
    margin-top: -6px;

    .el-tooltip {
      margin-right: 6px;
    }
  }
}

.order-tag {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  width: 24px !important;
  height: 20px !important;
  padding: 0 !important;
  margin: -2px 0 0 0;
  border-radius: 4px !important;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;

  :deep(.el-tag__content) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  &:hover {
    cursor: pointer;
  }
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
.custom-bar {
  width: 100%;
  height: 50px;
}
.arrow-up {
  margin-left: 3px;
  font-weight: 600;
  color: #ff3f48;
  transform: scale(0.9, 1.4);
}
.arrow-down {
  margin-left: 3px;
  font-weight: 600;
  color: #67c23a;
  transform: scale(0.9, 1.4);
}
.japan-flag {
  :deep(.flag) {
    border: 1px solid #ddd;
  }
}
.icon-green {
  font-size: 20px;
  color: #67c23a;
}
.icon-yellow {
  font-size: 20px;
  color: #ffc400;
}
.icon-orange {
  font-size: 20px;
  color: #ff9900;
}
.icon-red {
  font-size: 20px;
  color: #e32e00;
}
// .el-popper.is-customized {
//   padding: 6px 12px;
//   background-color: rgba(255, 255, 255, 0.85); // 半透明白色背景
//   backdrop-filter: blur(5px); // 磨砂玻璃效果
//   border: 1px solid rgba(0, 0, 0, 0.1); // 柔和边框
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); // 柔和阴影
// }

// .el-popper.is-customized .el-popper__arrow::before {
//   background-color: rgba(255, 255, 255, 0.85); // 箭头颜色与背景色一致
//   right: 0;
// }
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
      }
    }
  }
  .rate-count {
    margin-left: -11px;
    color: #36788c;
  }
}
</style>
