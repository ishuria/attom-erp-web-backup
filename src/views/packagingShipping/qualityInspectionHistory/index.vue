<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="新品质检" :name="0">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
            <el-form inline @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keydown.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table 
          border 
          :cell-class-name="clearPadding" 
          :data="list" 
          :header-cell-style="{ textAlign: 'center' }"
          stripe
        >
          <el-table-column align="center" label="质检日期" prop="submitDate" />
          <el-table-column align="center" label="PO" prop="po" />
          <el-table-column label="SKU图片" prop="" width="75">
            <template #header>
              SKU<br />图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.skuImgUrl" @click="showImagePreview(row.skuImgUrl)">
                <template #error><el-icon /></template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku">
            <template #default="{ row }">
              <span class="copySku" @click="handleClipboard($event, row.sku)">
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
              <br />
              {{ row.productName }}-{{ row.productDesc }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="质检结论" prop="status" >
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '通过' : '不通过' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" prop="" >
            <template #default="{ row }">
              <el-button text type="primary" @click="handleViewNewReport(row)">查看报告</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="打包质检" :name="1">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
            <el-form inline @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keydown.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table 
          border 
          :cell-class-name="clearPadding" 
          :data="list" 
          :header-cell-style="{ textAlign: 'center' }"
          stripe
        >
          <el-table-column align="center" label="质检日期" prop="submitDate" />
          <el-table-column align="center" label="PO" prop="po" />
          <el-table-column label="SKU图片" prop="" width="75">
            <template #header>
              SKU<br />图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.skuImgUrl" @click="showImagePreview(row.skuImgUrl)">
                <template #error><el-icon /></template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku">
            <template #default="{ row }">
              <span class="copySku" @click="handleClipboard($event, row.sku)">
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
              <br />
              {{ row.productName }}-{{ row.productDesc }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="质检结论" prop="status" >
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '通过' : '不通过' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" prop="" >
            <template #default="{ row }">
              <el-button text type="primary" @click="handleViewPackingReport(row)">查看报告</el-button>
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
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="closeImagePreview" />
    <!-- 查看新品质检报告 -->
    <vab-view-new-inspection-report v-model="newReportVisible" :report-data="newReportData" />
    <!-- 查看老品质检报告 -->
    <vab-view-packing-inspection-report v-model="packingReportVisible" :report-data="packingReportData" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { TabsPaneContext } from 'element-plus'
import handleClipboard from '~/src/utils/clipboard'
import { getQualityInspectionList, getQualityInspectionNew, getQualityInspectionPackage } from '/@/api/devlocal/packagingShipping'
import type { IGetQualityInspectionList, IGetQualityInspectionListReq } from '/@/type/packagingShipping/packagingType'

defineOptions({
  name: 'QualityInspectionHistory'
})

const activeName = ref<number>(0)
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const handleTabClick = (tab: TabsPaneContext) => {
  const t = Number(tab.props.name)
  activeName.value = t
  queryForm.type = t === 0 ? 0 : 1
  queryData()
}
const closeImagePreview = () => {
  imagePreviewVisible.value = false
}
const showImagePreview = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = [url]
}

const listLoading = ref<boolean>(false)
const queryForm = reactive<IGetQualityInspectionListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  type: 0,
})
const total = ref<number>(0)
const list = ref<IGetQualityInspectionList[]>([])
const newReportVisible = ref<boolean>(false)
const newReportData = reactive<any>({})
const packingReportVisible = ref<boolean>(false)
const packingReportData = reactive<any>({})
const handleViewNewReport = async (row: any) => {
  const { data } = await getQualityInspectionNew({ reportId: row.id })
  newReportVisible.value = true
  Object.assign(newReportData, data)
}
const handleViewPackingReport = async (row: any) => {
  const { data } = await getQualityInspectionPackage({ reportId: row.id })
  packingReportVisible.value = true
  Object.assign(packingReportData, data)
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.column.label === 'SKU图片') {
    return 'clear-padding'
  } 
  return ''
}
const handleCurrentChange = (val: number) => {
  queryForm.pageNo = val
  fetchData()
}
const handleSizeChange = (val: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = val
  fetchData()
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getQualityInspectionList(queryForm)
  total.value = data.total
  list.value = data.list
  // list.value.forEach((item: any) => {
  //   item._sku = `${item.sku}<br/>${item.productName}-${item.productDesc}`
  // })
  listLoading.value = false
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
// .noneHoverTable :deep(.clear-padding) {
//   padding-top: 0;
//   padding-bottom: 0;
// }
// .noneHoverTable :deep(.clear-padding .cell) {
//   padding-right: 0;
//   padding-left: 0;
// }
.tabs-table-container {
  :deep() {
    .el-tabs {
      border-radius: var(--el-border-radius-base);

      &__header {
        border-top-left-radius: var(--el-border-radius-base);
        border-top-right-radius: var(--el-border-radius-base);
      }

      &__nav-wrap {
        border-radius: var(--el-border-radius-base);
      }

      .el-tab-pane {
        display: flex;
        flex-direction: column;
        height: calc(var(--el-container-height) - var(--el-padding) - 52px) !important;

        .vab-query-form {
          .left-panel {
            margin-bottom: 5px !important;
          }
          .el-form {
            .el-form-item:first-child {
              margin: 0 !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
            .el-form-item:last-child {
              margin: 0 !important;
            }
          }
        }

        .el-table {
          flex: 1;
          .clear-padding {
            padding-top: 0;
            padding-bottom: 0;
            .cell {
              padding-right: 0;
              padding-left: 0;
            }
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
      }
    }
  }
}
</style>