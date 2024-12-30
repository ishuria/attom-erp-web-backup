<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleShowCategorySetUp">货物类别设定</el-button>
        <el-button type="primary" @click="handleModifyAll">批量修改</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @keyup.enter="queryData" @input="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" :loading="listLoading" @click="queryData"></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table 
      :data="fakeData" 
      class="noneHoverTable" 
      border stripe 
      :header-cell-style="{ textAlign: 'center' }" :cell-class-name="clearPadding"
      @selection-change="setSelectedRows"
    >
      <el-table-column type="selection" fixed="left" align="center"></el-table-column>
      <el-table-column label="图片" prop="" width="75" fixed="left">
        <template #default="{ row }">
          <el-image :src="row.componentImage" style="width: 100%; height: 100%; display: block;" @click="imagePreviewShow(row.componentImage)">
            <template #error><el-icon></el-icon></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="sku" min-width="">
        <template #default="{ row }">
          <span v-html="row.sku"></span>
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="" min-width=""></el-table-column>
      <el-table-column label="货物类别" prop="" min-width=""></el-table-column>
      <el-table-column label="亚马逊美国" prop="" min-width=""></el-table-column>
      <el-table-column label="亚马逊加拿大" prop="" min-width=""></el-table-column>
      <el-table-column label="亚马逊德国" prop="" min-width=""></el-table-column>
      <el-table-column label="亚马逊英国" prop="" min-width=""></el-table-column>
      <el-table-column label="亚马逊日本" prop="" min-width=""></el-table-column>
      <el-table-column label="沃尔玛美国" prop="" min-width=""></el-table-column>
      <el-table-column label="操作" width="70" fixed="right" align="center">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="handleModify(row)">修改</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty"></el-empty>
      </template>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <el-image-viewer v-if="imagePreviewVisible" :url-list="imagePreviewList" @close="imagePreviewClose" hide-on-click-modal />
    <!-- 修改 -->
    <vab-dialog
      title="修改运输渠道"
      v-model="modifyVisible"
      width="20%"
    >
      <el-form label-position="top">
        <el-form-item label="货物" >
          <el-select></el-select>
        </el-form-item>
        <el-form-item label="亚马逊美国" >
          <el-input disabled />
        </el-form-item>
        <el-form-item label="亚马逊加拿大" >
          <el-input disabled />
        </el-form-item>
        <el-form-item label="亚马逊德国" >
          <el-input disabled />
        </el-form-item>
        <el-form-item label="亚马逊英国" >
          <el-input disabled />
        </el-form-item>
        <el-form-item label="亚马逊日本" >
          <el-input disabled />
        </el-form-item>
        <el-form-item label="沃尔玛美国" >
          <el-input disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 货物类别 -->
    <vab-dialog
      title="货物类别设定"
      v-model="categorySetUpVisible"
    >
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary">新增</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
      <el-table border stripe>
        <el-table-column label="货物"></el-table-column>
        <el-table-column label="亚马逊美国"></el-table-column>
        <el-table-column label="亚马逊加拿大"></el-table-column>
        <el-table-column label="亚马逊德国"></el-table-column>
        <el-table-column label="亚马逊英国"></el-table-column>
        <el-table-column label="亚马逊日本"></el-table-column>
        <el-table-column label="沃尔玛美国"></el-table-column>
      </el-table>
      <template #footer></template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'

defineOptions({
  name: 'Channel'
})
const categorySetUpVisible = ref<boolean>(false)
const selectedRows = ref<any[]>([])
const modifyVisible = ref<boolean>(false)
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
const fakeData = [
  {
    sku: 'HOME-0020-WHT<br />碗架-木把手白色',
    componentImage: 'https://picsum.photos/200/200',
  }
]
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)

const handleShowCategorySetUp = () => {
  categorySetUpVisible.value = true
}
const setSelectedRows = (value: any) => {
  selectedRows.value = value
}
const handleModify = (row: any) => {
  modifyVisible.value = true
}
const handleModifyAll = () => {
  if (selectedRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'error')
    return
  }
  modifyVisible.value = true
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  // fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.columnIndex === 1) {
    return 'clear-padding'
  }
  return ''
}
</script>

<style lang="scss" scoped>
.noneHoverTable {
  :deep() {
    .el-checkbox {
      transform: scale(1.3);
      transform-origin: center;
    }
    .clear-padding {
      padding-top: 0;
      padding-bottom: 0;
      .cell {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
}
</style>