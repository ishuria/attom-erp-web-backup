<template>
  <div class="custom-table-container auto-height-container" style="--el-padding: 0px" :class="{ 'vab-table-fullscreen': isFullscreen }">
    <el-tabs
      v-model="activeName"
      type="border-card"
      class="demo-tabs"
    >
      <el-tab-pane label="进行中" name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" 
              v-permissions="{ permission: ['newProduct:evaluation:add'] }">样品进度</el-button>
            <el-button type="primary" 
              v-permissions="{ permission: ['newProduct:evaluation:keyword:trend'] }">开模进度</el-button>
            <el-button type="primary" 
              v-permissions="{ permission: ['newProduct:evaluation:default:params'] }">筛选</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <div class="custom-table-right-tools">
              <el-form inline :model="queryForm" @submit.prevent>
                <el-form-item>
                  <el-input v-model="queryForm.productKeyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
                </el-form-item>
                <el-form-item>
                  <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                    @click="queryData"></el-button>
                </el-form-item>
              </el-form>
            </div>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table 
          ref="tableRef" 
          v-loading="listLoading" 
          :border="true" 
          :data="progressList" 
          :stripe="true"
          @cell-click="tableCellCliek"
        >
          <el-table-column v-for="(item, index) in indexColumns" :key="index" align="center" :label="item.label"
            :prop="item.prop" :min-width="item.minWidth || 100" width="auto">
            <template #default="{ row }">
              <div v-if="item.label === '优先级'">
                <el-select size="small" v-model="row.priority">
                  <el-option 
                    v-for="item in priorityOptions" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div v-if="item.label === '示例图片'" class="image-wall">
                <el-upload
                  action="#"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  v-model:file-list="row.imageList"
                >
                  <el-icon><Plus /></el-icon>
                </el-upload>
                <!-- <el-dialog v-model="dialogVisible"> -->
                  <!-- <img w-full :src="dialogImageUrl" alt="Preview Image" class="previewImage"/> -->
                 
                <!-- </el-dialog> -->
              </div>
              <div v-if="item.label === 'OEM'" >
                <!--当 row.oem 的值为 1 时，复选框就会自动选中-->
                <el-checkbox v-model="row.oem" :true-label="'1'" :false-label="'0'" size="large" />
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" :fixed="fixed" label="操作" width="180px">
            <template #default="{ row }">
              <el-dropdown>
                <el-button text type="primary">
                  拿样与核算
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false">开票申请</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false">订大货申请</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" >复制</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false">共享</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false">查看新款评估</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>

          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
          </template>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已归档" name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" 
              v-permissions="{ permission: ['newProduct:evaluation:default:params'] }">筛选</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <div class="custom-table-right-tools">
              <el-form inline :model="queryForm" @submit.prevent>
                <el-form-item>
                  <el-input v-model="queryForm.productKeyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
                </el-form-item>
                <el-form-item>
                  <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                    @click="queryData">
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table 
          ref="tableRef" 
          v-loading="listLoading" 
          :border="true" 
          :data="progressList" 
          :stripe="true"
        >
          <el-table-column v-for="(item, index) in indexColumns" :key="index" align="center" :label="item.label"
            :prop="item.prop" :min-width="item.minWidth || 100" width="auto">
            <template #default="{ row }">
              <div v-if="item.label === '优先级'">
                <el-select size="small" v-model="row.priority" :disabled="true">
                  <el-option 
                    v-for="item in priorityOptions" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div v-if="item.label === '示例图片'" class="image-wall">
                <el-upload
                  action="#"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  v-model:file-list="row.imageList"
                  :disabled="true"
                >
                  <el-icon><Plus /></el-icon>
                </el-upload>
                <el-dialog v-model="dialogVisible" >
                  <img w-full :src="dialogImageUrl" alt="Preview Image"/>
                </el-dialog>
              </div>
              <div v-if="item.label === 'OEM'" >
                <!--当 row.oem 的值为 1 时，复选框就会自动选中-->
                <el-checkbox v-model="row.oem" :true-label="'1'" :false-label="'0'" size="large" :disabled="true"/>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" :fixed="fixed" label="操作" width="180px">
            <template #default="{ row }">
              <el-button text type="primary">
                复制
              </el-button>
            </template>
          </el-table-column>

          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
          </template>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if ="dialogVisible"/>

    <vab-pagination :current-page="queryForm.pageNo" :page-size="queryForm.pageSize" :total="total"
    @current-change="handleCurrentChange" @size-change="handleSizeChange" />
  </div>
</template>

<script lang="ts" setup>

defineOptions({
  name: 'Progress',
})

import { ref } from 'vue'
import { Search, ArrowDown, Plus } from '@element-plus/icons-vue'
import { rowContextKey, type TableInstance } from 'element-plus'
import {
  indexColumns,
} from './indexColumns'

import { IProgressQueryReq, IProgress } from '/@/type/progress/progressType'
import {
  getList,
} from '/@/api/devlocal/progress'
import type { UploadProps, UploadUserFile } from 'element-plus'

const activeName = ref("0")
const fixed = ref<string>('right')
const isFullscreen = ref<boolean>(false)
const tableRef = ref<TableInstance>()
// 表格加载loading状态
const listLoading = ref<boolean>(true)
// 新品进度列表
const progressList = ref<IProgress[]>([])
const tableClickIdx = ref<number>(0)
// 总记录数
const total = ref<number>(0)
const queryForm = reactive<IProgressQueryReq>({
  pageNo: 1,
  pageSize: 20,
  productKeyWord: '',
  status: 0, //查询状态：0表示进行中 1表示已归档
})
const priorityOptions = [
  { 
    value: "0",
    label: '高',
  },
  { 
    value: "1",
    label: '中',
  },
  { 
    value: "2",
    label: '低',
  },
]

const dialogImageUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
let list:any = []
const imagePriviewList = ref<string[]>([
])

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true

  console.log("list",list);
  console.log("idx",tableClickIdx.value);
  
  // const r = list[tableClickIdx]
  // console.log(r);
  
  // imagePriviewList.value.push(])
}


// 图片预览关闭事件
const imagePreviewClose = () =>{
  dialogVisible.value = false;
}
/**
 * 获取初始新品进度数据
 */
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getList(queryForm)
  progressList.value = data.list
  total.value = data.total
  listLoading.value = false

  progressList.value.forEach(item => {
    const tempArr:string[] = []
    item.imageList.forEach(image => {
      tempArr.push(image.imageUrl!)
      image.url = image.imageUrl;
      image.name = image.imageId;
      delete image.imageUrl;
      delete image.imageId;
    })
    list.push(tempArr)
  })
  // console.log(list.value);
}

const tableCellCliek = (row: any, column: any, cell: HTMLTableCellElement, event: Event)=>{
  
  tableClickIdx.value = progressList.value.indexOf(row)
  
  console.log(tableClickIdx.value);
}

/**
 * 获取新品进度列表数据
 */
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

/**
 * 分页大小的改变
 */
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

/**
 * 分页页数改变
 */
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  fetchData()
})

</script>

<style lang="scss" scoped>
.custom-table-container {
  .custom-table-right-tools {
    display: flex;
    align-items: center;
  }
}
:deep(.el-tabs__item) {
  font-size: 18px;
  width: 130px;
}

.image-wall {
  display: flex;
  align-items: center; /* 垂直居中 */
  gap: 10px; /* 使用 gap 属性来控制图片之间的间距 */
  max-width: 100%; /* 限制最大宽度，以防止超出表格单元格 */
  overflow-x: auto; /* 当图片超出宽度时，允许水平滚动 */
  :deep(.el-upload-list__item) {
    width: 100px;
    height: 100px;
  }
  :deep(.el-upload--picture-card) {
    width: 100px;
    height: 100px;
  }
}
.previewImage {
  width: 300px; /* 设置图片的宽度 */
  height: auto; /* 自动调整高度 */
  object-fit: contain; /* 保持图片比例 */
}

.example-showcase .el-dropdown+.el-dropdown {
  margin-left: 15px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.vab-chart {
  width: 100%;
  height: 100%;
  min-height: 40px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>