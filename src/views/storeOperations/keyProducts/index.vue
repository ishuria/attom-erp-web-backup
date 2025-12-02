<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button
          v-permissions="{ permission: [StoreOperationPermission.KEY_PRODUCTS_DEFAULT_PARAMS] }"
          type="primary"
          @click="showDefaultParams"
        >
          默认参数
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      v-loading="listLoading"
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoverTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
    >
      <el-table-column label="上新日期" prop="saleDate" width="120" />
      <el-table-column label="图片" prop="skuImgUrl" width="75">
        <template #default="{ row }">
          <el-image :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row.skuImgUrl)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="SKU"
        prop="sku"
        :width="Math.max(flexColumnWidth(list, 'SKU', 'sku'), flexColumnWidth(list, 'SKU', 'productDesc'))"
      >
        <template #default="{ row }">
          {{ row.sku }}
          <br />
          {{ row.productDesc }}
        </template>
      </el-table-column>
      <el-table-column label="订货主站点" prop="siteName" width="130" />
      <el-table-column label="产品经理" prop="productManager" width="100" />
      <el-table-column label="运营" prop="operationUserName" width="100" />
      <el-table-column label="Vine数量" prop="vineCount" width="100" />
      <el-table-column label="产品定位" prop="productPosition" width="120">
        <template #default="{ row }">
          <el-tag :type="row.productPosition === '精铺' ? 'primary' : 'warning'">
            {{ row.productPosition === '精品' ? '精品' : '精铺' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="1月末Rating" prop="janEndRating">
        <template #default="{ row }">
          <span :style="{ color: getRatingColor(row.janEndRating) }">{{ row.janEndRating }}</span>
        </template>
      </el-table-column>
      <el-table-column label="2月末Rating" prop="febEndRating">
        <template #default="{ row }">
          <span :style="{ color: getRatingColor(row.febEndRating) }">{{ row.febEndRating }}</span>
        </template>
      </el-table-column>
      <el-table-column label="3月末Rating" prop="marEndRating">
        <template #default="{ row }">
          <span :style="{ color: getRatingColor(row.marEndRating) }">{{ row.marEndRating }}</span>
        </template>
      </el-table-column>
      <el-table-column label="4月末Rating" prop="aprEndRating">
        <template #default="{ row }">
          <span :style="{ color: getRatingColor(row.aprEndRating) }">{{ row.aprEndRating }}</span>
        </template>
      </el-table-column>
      <el-table-column label="5月末Rating" prop="mayEndRating">
        <template #default="{ row }">
          <span :style="{ color: getRatingColor(row.mayEndRating) }">{{ row.mayEndRating }}</span>
        </template>
      </el-table-column>
      <el-table-column label="6月末Rating" prop="junEndRating">
        <template #default="{ row }">
          <span :style="{ color: getRatingColor(row.junEndRating) }">{{ row.junEndRating }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="ratingStatus">
        <template #default="{ row }">
          <el-tag v-if="row.status === 1" type="warning">暂停</el-tag>
          <el-tag v-else-if="row.ratingStatus === 0" type="info">未上线</el-tag>
          <el-tag v-else-if="row.ratingStatus === 1" type="primary">评估中</el-tag>
          <el-tag v-else-if="row.ratingStatus === 2" type="danger">评论未达标-扣分</el-tag>
          <el-tag v-else-if="row.ratingStatus === 3" type="success">评论达标</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="130">
        <template #default="{ row }">
          <el-space :size="16">
            <el-link
              v-permissions="{ permission: [StoreOperationPermission.KEY_PRODUCTS_ENABLE] }"
              :disabled="row.status === 0"
              type="primary"
              underline="never"
              @click="handleUpdateKeyProductsStatusOpen(row.id, 0)"
            >
              开启
            </el-link>
            <el-link
              v-permissions="{ permission: [StoreOperationPermission.KEY_PRODUCTS_PAUSE] }"
              :disabled="row.status === 1"
              type="danger"
              underline="never"
              @click="handleUpdateKeyProductsStatusPause(row.id, 1)"
            >
              暂停
            </el-link>
          </el-space>
        </template>
      </el-table-column>
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

    <!-- 默认参数 -->
    <vab-dialog v-model="defaultParamsVisible" title="默认参数" width="20%">
      <el-form :model="defaultParamsForm" style="margin-right: 0; margin-left: 0">
        <el-form-item label="OEM产品（评分不达标时考核加回数）：">
          <el-input v-model.number="defaultParamsForm.oemCount" placeholder="请输入数字" type="number" />
        </el-form-item>
        <el-form-item label="非OEM产品（评分不达标时考核加回数）：">
          <el-input v-model.number="defaultParamsForm.nonOemCount" placeholder="请输入数字" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleDefaultParams">确定</el-button>
      </template>
    </vab-dialog>

    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'
import {
  getKeyProductsDefaultParams,
  getKeyProductsList,
  updateKeyProductsDefaultParams,
  updateKeyProductsStatusOpen,
  updateKeyProductsStatusPause,
} from '/@/api/devlocal/productPerformance'
import StoreOperationPermission from '/@/permissions/storeOperation'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'KeyProducts',
})

const defaultParamsVisible = ref<boolean>(false)
const defaultParamsForm = reactive<{
  oemCount: number | string
  nonOemCount: number | string
}>({
  oemCount: '',
  nonOemCount: '',
})
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})

const listLoading = ref<boolean>(false)
const list = ref<any>([])
const total = ref<number>(0)

// 显示默认参数对话框并加载数据
const showDefaultParams = async () => {
  defaultParamsVisible.value = true
  await loadDefaultParams()
}

// 加载默认参数
const loadDefaultParams = async () => {
  try {
    const { data } = await getKeyProductsDefaultParams()
    if (data) {
      defaultParamsForm.oemCount = data.oemCount ?? ''
      defaultParamsForm.nonOemCount = data.nonOemCount ?? ''
    }
  } catch (error) {
    console.error('加载默认参数失败:', error)
  }
}

// 保存默认参数
const handleDefaultParams = async () => {
  // 验证输入
  const oemCount = defaultParamsForm.oemCount === '' || defaultParamsForm.oemCount == null ? null : Number(defaultParamsForm.oemCount)
  const nonOemCount =
    defaultParamsForm.nonOemCount === '' || defaultParamsForm.nonOemCount == null ? null : Number(defaultParamsForm.nonOemCount)

  if (oemCount == null || nonOemCount == null) {
    $baseMessage('请填写完整的默认参数', 'warning')
    return
  }

  if (isNaN(oemCount) || isNaN(nonOemCount)) {
    $baseMessage('请输入有效的数字', 'warning')
    return
  }

  try {
    const { data } = await updateKeyProductsDefaultParams({
      oemCount,
      nonOemCount,
    })
    if (data) {
      $baseMessage('默认参数保存成功！', 'success')
      defaultParamsVisible.value = false
    } else {
      $baseMessage('默认参数保存失败！', 'error')
    }
  } catch (error) {
    $baseMessage('默认参数保存失败！', 'error')
  }
}
const handleUpdateKeyProductsStatusOpen = async (id: number, status: number) => {
  const { data } = await updateKeyProductsStatusOpen({ id, status })
  if (data) {
    $baseMessage('开启成功！', 'success')
    fetchData()
  } else {
    $baseMessage('开启失败！', 'error')
  }
}
const handleUpdateKeyProductsStatusPause = async (id: number, status: number) => {
  const { data } = await updateKeyProductsStatusPause({ id, status })
  if (data) {
    $baseMessage('暂停成功！', 'success')
    fetchData()
  } else {
    $baseMessage('暂停失败！', 'error')
  }
}
const getRatingColor = (rating: number | null | undefined): string => {
  if (rating == null) return '#333'
  return rating >= 4.3 ? 'var(--el-color-success)' : 'var(--el-color-danger)'
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === 'SKU') {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getKeyProductsList(queryForm)
  list.value = data.list
  total.value = data.total
  listLoading.value = false
}
onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.noneHoverTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoverTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
</style>
