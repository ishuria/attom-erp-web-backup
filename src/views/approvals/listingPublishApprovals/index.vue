<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyword"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keyup.enter="queryData"
            />
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
      class="noneHoveTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
    >
      <el-table-column label="图片" prop="skuImgUrl" width="75">
        <template #default="{ row }">
          <el-image
            :lazy="true"
            :src="row.skuImgUrl"
            style="display: block; width: 75px; height: 75px"
            @click="imagePreviewShow(row.skuImgUrl)"
          >
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="sku" :width="Math.max(flexColumnWidth(list, 'SKU', 'sku'), flexColumnWidth(list, 'SKU', 'desc'))">
        <template #default="{ row }">
          {{ row.sku }}
          <br />
          {{ row.desc }}
        </template>
      </el-table-column>
      <el-table-column label="ASIN" min-width="160" prop="asin">
        <template #default="{ row }">
          <el-link :href="row.amazonUrl" target="_blank" type="primary">{{ row.asin }}</el-link>
        </template>
      </el-table-column>
      <!-- <el-table-column label="站点" min-width="150" prop="sites">
            <template #default="{ row }">
              <el-tooltip content=" " :disabled="!row.overflow_sites" effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._sitesFull }}</div>
                </template>
                <span v-html="row._sites"></span>
              </el-tooltip>
            </template>
          </el-table-column> -->
      <el-table-column label="任务类型" min-width="110" prop="taskType">
        <template #default="{ row }">
          <el-tag :type="getTaskTypeColor(row.taskType)">{{ row.taskType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="产品定位" min-width="100" prop="positioning" />
      <el-table-column label="Vine数量" min-width="100" prop="vineCount" />
      <el-table-column label="要求完成日期" min-width="125" prop="finishDate">
        <template #default="{ row }">
          {{ row.finishDate ? formatDate(new Date(row.finishDate)) : '' }}
        </template>
      </el-table-column>

      <el-table-column label="需求文件地址" min-width="160" prop="requiredAddress">
        <template #default="{ row }">
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.requiredAddress }}</div>
            </template>
            <div class="multi-line-ellipsis-1">{{ row.requiredAddress }}</div>
          </el-tooltip>
        </template>
      </el-table-column>

      <template v-for="col in columnConfigs" :key="col.prop">
        <el-table-column
          v-if="!col.isSpecial"
          :label="col.label"
          :prop="col.prop"
          :width="calculateBrColumnWidth(list, (row: any) => row[col.dataKey as string], col.baseWidth, 30)"
        >
          <template #default="{ row }">
            <span v-for="(username, index) in splitUsernames(row[col.prop])" :key="index" class="username-item">
              {{ username }}
            </span>
          </template>
        </el-table-column>
        <el-table-column v-else :label="col.label" :prop="col.prop" :width="flexColumnWidth(list, '发布人', 'publisherPersonName')" />
      </template>

      <el-table-column label="备注" min-width="130" prop="remark">
        <template #default="{ row }">
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.remark }}</div>
            </template>
            <div class="multi-line-ellipsis">{{ row.remark }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="110">
        <template #default="{ row }">
          <el-button>通过</el-button>
          <el-button>不通过</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'
import { formatDate } from '/@/utils/dateUtils'
import { calculateBrColumnWidth, flexColumnWidth } from '/@/utils/tableColum'
import { columnConfigs, getTaskTypeColor, splitUsernames } from '/@/views/newProductTask/constantOption'

defineOptions({
  name: 'ListingPublishApprovals',
})

const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const list = ref<any[]>([])
const listLoading = ref<boolean>(false)
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
})
const total = ref<number>(0)
const fetchData = () => {}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['SKU', '站点', '需求文件地址', '备注'].includes(label)) {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.columnIndex === 1) {
    return 'clear-padding'
  }
  return ''
}
const imagePreviewShow = (url: string) => {
  // 需要对url做处理 https://m.media-amazon.com/images/I/71uZi8MxJiL._SL75_.jpg 需要去掉url的_SL75_
  const processedUrl = url.replace('_SL75_', '')

  // 预加载图片
  const img = new Image()
  img.onload = () => {
    imagePreviewVisible.value = true
    imagePreviewList.value = [processedUrl]
  }
  img.onerror = () => {
    // 如果大图加载失败，回退到原图
    imagePreviewVisible.value = true
    imagePreviewList.value = [url]
  }
  img.src = processedUrl
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
</script>
