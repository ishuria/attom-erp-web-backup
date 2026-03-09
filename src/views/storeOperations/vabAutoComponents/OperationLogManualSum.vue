<template>
  <vab-dialog v-model="visible" title="日志汇总" top="8vh" width="60%">
    <vab-query-form>
      <vab-query-form-left-panel :span="18">
        <el-form inline :model="queryForm">
          <el-form-item label="运营">
            <el-select v-model="queryForm.userId" clearable placeholder="请选择运营人员" style="width: 200px" @change="queryData">
              <el-option v-for="item in operationUserList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="!hideSiteFilter" label="站点">
            <el-select v-model="queryForm.siteId" clearable placeholder="请选择站点" style="width: 200px" @change="queryData">
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期范围">
            <el-date-picker
              :key="dateRangeKey"
              v-model="dateRange"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              start-placeholder="开始日期"
              type="daterange"
              value-format="YYYY-MM-DD"
              @change="dateRangeChange"
            />
          </el-form-item>
          <el-form-item v-if="!hideSiteFilter">
            <el-select v-model="queryForm.type" collapse-tags collapse-tags-tooltip multiple style="min-width: 160px" @change="queryData">
              <el-option v-for="item in filterOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="6">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keyup.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="loading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      v-loading="loading"
      border
      :cell-class-name="clearPadding"
      :data="logList"
      :header-cell-style="{ textAlign: 'center' }"
      max-height="70vh"
      stripe
    >
      <el-table-column align="center" label="图片" width="100">
        <template #default="{ row }">
          <el-image
            v-if="row.skuImgUrl"
            fit="fill"
            :src="row.skuImgUrl"
            style="width: 75px; height: 75px"
            @click="imagePreviewShow(row.skuImgUrl)"
          >
            <template #error><el-icon /></template>
          </el-image>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="SKU" min-width="200">
        <template #default="{ row }">
          <div v-if="row.sku">
            <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)">
              {{ row.sku }}
              <vab-icon icon="file-copy-2-fill" />
            </span>
            <br />
            <div class="product-desc-container">
              <span class="product-desc">{{ row.productDesc || '-' }}</span>
              <span v-if="row.flag" class="flag-container" :class="{ 'japan-flag': row.flag === 'JP' }">
                <country-flag :country="row.flag" />
              </span>
            </div>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="日期" min-width="120" prop="date" />
      <el-table-column align="center" label="类型" min-width="100" prop="type">
        <template #default="{ row }">
          <el-tag v-if="row.type === 0" type="primary">手动输入</el-tag>
          <el-tag v-else type="success">系统抓取</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="内容" min-width="300" prop="content">
        <template #default="{ row }">
          <!-- 系统抓取(type=1)时的解析展示 -->
          <div v-if="row.type === 1 && row.content" class="parsed-content" v-html="parseSystemContent(row.content)"></div>
          <div v-else>
            <el-link class="content-link" type="primary">
              <span class="content-text">{{ row.content }}</span>
            </el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="运营" min-width="100" prop="operationUserName" />
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>

    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />

    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="[imagePreviewUrl]" @close="imagePreviewClose" />
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import CountryFlag from 'vue-country-flag-next'
import { getFrontPageProductManagerSelectOption } from '/@/api/devlocal/frontPage'
import { getOperationLogManualList } from '/@/api/devlocal/productAnalysis'
import { getDistributionSiteList } from '/@/api/devlocal/productDistribution'
import type { IGetOperationLogManual } from '/@/type/storeOperation/productAnalysisType'
import handleClipboard from '/@/utils/clipboard'

defineOptions({
  name: 'OperationLogManualSum',
})

const props = defineProps<{
  /** 是否隐藏站点筛选（默认 false） */
  hideSiteFilter?: boolean
  /** 获取日志列表的 API 函数（默认使用亚马逊的） */
  fetchLogApi?: (params: any) => Promise<{ data: { list: any[]; total: number } }>
}>()

const visible = defineModel<boolean>('visible', {
  required: true,
})

const loading = ref<boolean>(false)
const logList = ref<IGetOperationLogManual[]>([])
const total = ref<number>(0)
const operationUserList = ref<{ id: number; label: string }[]>([])
const siteList = ref<{ id: number; label: string }[]>([])
const dateRange = ref<[string, string] | null>(null)
const dateRangeKey = ref<number>(0)
const queryForm = reactive({
  userId: -1,
  siteId: -1,
  startDate: '',
  endDate: '',
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
  type: [0],
})
const filterOptions = [
  { label: '手动输入', value: 0 },
  { label: '系统抓取', value: 1 },
]

// 解析系统抓取的 content
const parseSystemContent = (content: string) => {
  if (!content) return ''

  // 格式: [实际价涨价]£10.99->£11.99\n产品SKU 或 [原价降价]137.96->127.08\nSKU
  // 支持多种换行符：\n, \r\n, \r
  const lines = content.split(/\r?\n/)
  if (lines.length === 0) return content

  const firstLine = lines[0]
  // 匹配 [标签]价格1->价格2 格式
  // 使用非贪婪匹配，支持任意货币符号（包括多字符如 C$, MX$, R$ 等）
  const match = firstLine.match(/(\[.*?\])?\s*(.+?)\s*(->|－>|→)\s*(.+?)\s*(?:$|\n)/)

  if (match) {
    const label = match[1] || '' // [实际价涨价]
    const beforePrice = match[2]?.trim() // £10.99, 137.96, MX$840.49, ₺1179.70
    const afterPrice = match[4]?.trim() // £11.99, 127.08, MX$823.17, ₺1176.89

    // 验证价格格式（必须包含数字）
    const pricePattern = /\d/
    if (!pricePattern.test(beforePrice) || !pricePattern.test(afterPrice)) {
      return content // 不是有效的价格格式
    }

    // 判断涨跌
    const priceChange = isPriceIncreased(beforePrice, afterPrice)
    if (priceChange === null) {
      return content // 无法判断，返回原内容
    }

    const isIncrease = priceChange
    const icon = isIncrease ? '<span class="price-arrow price-up">↑</span>' : '<span class="price-arrow price-down">↓</span>'

    let result = `${label || ''}${beforePrice}-> ${afterPrice}${icon}`

    // 添加产品SKU（第二行），前面加一个空格
    if (lines[1]) {
      result += `<br/><span class="product-sku">${lines[1]}</span>`
    }

    return result
  }

  return content
}

// 价格比较（支持多种货币符号和千分位逗号）
const isPriceIncreased = (before: string, after: string): boolean | null => {
  const extractNumber = (price: string) => {
    // 移除所有货币符号和千分位逗号，提取数字
    return parseFloat(price.replace(/C\$|MX\$|R\$|JP¥|ر\.س|د\.إ/g, '').replace(/[£$€¥₹₽₩₺złkr,]/g, ''))
  }

  const beforeNum = extractNumber(before)
  const afterNum = extractNumber(after)

  if (isNaN(beforeNum) || isNaN(afterNum)) return null

  return afterNum > beforeNum
}
// 图片预览
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewUrl = ref<string>('')

const imagePreviewShow = (url: string) => {
  imagePreviewUrl.value = url
  imagePreviewVisible.value = true
}

const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}

// 获取运营人员列表
const fetchOperationUserList = async () => {
  try {
    const { data } = await getFrontPageProductManagerSelectOption({ type: 3 })
    operationUserList.value = data
    operationUserList.value.unshift({ id: -1, label: '全部' })
  } catch (error) {
    console.error('获取运营人员列表失败:', error)
  }
}

// 获取站点列表
const fetchSiteList = async () => {
  try {
    const { data } = await getDistributionSiteList()
    siteList.value = data
    siteList.value.unshift({ id: -1, label: '全部' })
  } catch (error) {
    console.error('获取站点列表失败:', error)
  }
}

// 获取日志列表
const fetchData = async () => {
  loading.value = true
  try {
    if (dateRange.value && dateRange.value.length === 2) {
      queryForm.startDate = dateRange.value[0]
      queryForm.endDate = dateRange.value[1]
    }
    // 使用传入的 API 或默认的亚马逊 API
    const apiFunc = props.fetchLogApi || getOperationLogManualList
    const { data } = await apiFunc(queryForm)
    logList.value = data.list || []
    total.value = data.total || 0
  } catch (error) {
    console.error('获取日志列表失败:', error)
    logList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 日期范围变化
const dateRangeChange = () => {
  dateRangeKey.value++
  queryData()
}

// 查询
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

// 分页
const handleCurrentChange = (page: number) => {
  queryForm.pageNo = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  queryForm.pageSize = size
  queryForm.pageNo = 1
  fetchData()
}

const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}

// 监听弹窗显示
watch(visible, (newVal) => {
  if (newVal) {
    fetchOperationUserList()
    if (!props.hideSiteFilter) {
      fetchSiteList()
    }
    fetchData()
  }
})
</script>

<style scoped lang="scss">
.copySku {
  cursor: pointer;
  color: var(--el-color-primary);
}

.product-desc-container {
  display: flex;
  align-items: center;

  .product-desc {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .flag-container {
    margin-left: 4px;
    flex-shrink: 0;
  }

  .japan-flag {
    margin-top: -2px;
  }
}

.el-table :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}

.el-table :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
.content-link {
  display: block;
  width: 100%;

  .content-text {
    white-space: pre-wrap;
    word-break: break-word;
  }
}

.parsed-content {
  :deep(.price-arrow) {
    display: inline-block;
    margin: 0 4px;
    font-size: 16px;
    font-weight: bold;

    &.price-up {
      color: var(--el-color-danger);
    }

    &.price-down {
      color: var(--el-color-success);
    }
  }

  :deep(.product-sku) {
    color: #909399;
  }
}
</style>
