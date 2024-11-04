<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="filterVisible = true">筛选</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border stripe
      :header-cell-style="{ textAlign: 'center' }"
      :data="fakeData"
      class="noneHoveTable"
      :cell-style="cellStyle"
    >
      <el-table-column label="FBA SHIPMENT ID" prop="id" min-width="180"></el-table-column>
      <el-table-column label="站点" min-width="100"></el-table-column>
      <el-table-column label="状态" min-width="100"></el-table-column>
      <el-table-column label="运输渠道" min-width="100"></el-table-column>
      <el-table-column label="发货日期" min-width="100"></el-table-column>
      <el-table-column label="原始预计入库" min-width="130"></el-table-column>
      <el-table-column label="最新预计入库" min-width="130"></el-table-column>
      <el-table-column label="上架日期" min-width="100"></el-table-column>
      <el-table-column label="实际时效" min-width="100"></el-table-column>
      <el-table-column label="时效预估误差" min-width="130"></el-table-column>
      <el-table-column label="接收完成天数" min-width="130"></el-table-column>
      <el-table-column label="发货总数" min-width="100"></el-table-column>
      <el-table-column label="已接收数" min-width="100"></el-table-column>
      <el-table-column label="缺数" min-width="100"></el-table-column>
      <el-table-column label="箱数" min-width="100"></el-table-column>
      <el-table-column label="体积(m3)" min-width="100"></el-table-column>
      <el-table-column label="重量(kg)" min-width="100"></el-table-column>
      <el-table-column label="备注" min-width="100"></el-table-column>
      <el-table-column label="不计入渠道时效" min-width="140">
        <template #default="{ row }">
          <el-checkbox :true-value="1" :false-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="丢货标记" min-width="100">
        <template #default="{ row }">
          <el-checkbox :true-value="1" :false-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="340">
        <template #default="{ row }">
          <el-space>
            <el-link type="primary" :underline="false" @click="showDetails">明细</el-link>
            <el-link type="primary" :underline="false" >SKU运费均摊明细</el-link>
            <el-link type="primary" :underline="false" @click="showUpdateStorageTime">修改预计入库时间</el-link>
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
    <el-image-viewer v-if="imagePreviewVisible" :url-list="imagePreviewList" @close="imagePreviewClose" hide-on-click-modal />
    <!-- 明细 -->
    <vab-dialog
      title="明细"
      v-model="detailsVisible"
    >
      <el-table 
        border stripe 
        :header-cell-style="{ textAlign: 'center' }" 
        :cell-class-name="cellClassName"
        class="detailsTable"
        :data="fakeDetailsData"
      >
        <el-table-column label="图片" width="70">
          <template #default="{ row }">
            <el-image :src="row.url" fit="contain" style="width: 70px; height: 70px; display: block" @click="showImagePreview(row)">
              <template #error>
                <el-icon></el-icon>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="SKU" min-width="200"></el-table-column>
        <el-table-column label="PO" min-width="100" align="center"></el-table-column>
        <el-table-column label="发货数量" min-width="100" align="center"></el-table-column>
        <el-table-column label="已接收数量" min-width="110" align="center"></el-table-column>
        <el-table-column label="缺数" min-width="100" align="center"></el-table-column>
      </el-table>
    </vab-dialog>
    <!-- 修改预计入库时间 -->
    <vab-dialog
      title="修改预计入库时间"
      v-model="storageTimeVisible"
      width="20%"
      @close="closeUpdateStorageTime"
    >
      <el-form ref="storageTimeFormRef" :model="storageTimeForm" style="margin-left: 20px; margin-right: 20px">
        <el-form-item label="预计入库时间" prop="date">
          <el-date-picker 
            type="date" 
            placeholder="选择入库时间" 
            format="YYYY-MM-DD"
            v-model="storageTimeForm.date"
            value-format="YYYY-MM-DD"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeUpdateStorageTime">取消</el-button>
        <el-button type="primary" >确定</el-button>
      </template>
    </vab-dialog>
    <!-- 筛选 -->
    <vab-dialog
      title="筛选"
      v-model="filterVisible"
      width="22%"
    >
      <el-form label-position="right" label-width="auto" :model="filterForm" >
        <el-form-item label="缺数">
      
          <!-- 最小值输入框 -->
          <el-input-number
            v-model="filterForm.number1"
            :min="0"
         
            placeholder="最小值"
        
          />
          <span style="margin: 0 20px;">至</span>
          <!-- 最大值输入框 -->
          <el-input-number
            v-model="filterForm.number2"
            :min="0"
            placeholder="最大值"
            @change=""
          />
  
        </el-form-item>
        <el-form-item label="发货日期">
          <el-date-picker 
            v-model="filterForm.date1"
            end-placeholder="结束日期" 
            range-separator="至" 
            start-placeholder="开始日期" 
            type="daterange" 
            format="YYYY-MM-DD" 
            :editable="false" 
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="上架日期">
          <el-date-picker 
            v-model="filterForm.date2"
            end-placeholder="结束日期" 
            range-separator="至" 
            start-placeholder="开始日期" 
            type="daterange" 
            format="YYYY-MM-DD" 
            :editable="false" 
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { FormInstance } from 'element-plus'

const listLoading = ref<boolean>(true)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const fakeData = [
  {
    id: 1
  }
]
const fakeDetailsData = [
  {
    url: 'https://picsum.photos/200/200'
  }
]
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<any>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const showImagePreview = (row: any) => {
  imagePreviewList.value = []
  imagePreviewList.value.push(row.url)
  imagePreviewVisible.value = true
}
// 明细可见
const detailsVisible = ref<boolean>(false)
// 预计入库时间可见
const storageTimeVisible = ref<boolean>(false)
// 筛选可见
const filterVisible = ref<boolean>(false)
// 入库时间表单
const storageTimeForm = reactive<any>({
  date: ''
})
// 筛选表单
const filterForm = reactive<any>({

})

const storageTimeFormRef = ref<FormInstance>()
// 展示明细
const showDetails = () => {
  detailsVisible.value = true
}
// 展示修改预计入库时间
const showUpdateStorageTime = () => {
  storageTimeVisible.value = true
}
// 关闭修改入库时间对话框
const closeUpdateStorageTime = () => {
  storageTimeFormRef.value?.resetFields()
  storageTimeVisible.value = false
}
const queryData = () => {
  queryForm.pageNo = 1

}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
}


const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  return {
    textAlign: 'center' as 'center'
  }
}
const cellClassName = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}
</script>

<style lang="scss" scoped>
.noneHoveTable :deep(.el-checkbox) {
  transform: scale(1.2);
  transform-origin: center;
}
.detailsTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.detailsTable :deep(.clear-padding .cell) {
  padding-left: 0;
  padding-right: 0;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>