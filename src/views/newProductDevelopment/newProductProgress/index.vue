<template>
  <div class="custom-table-container auto-height-container" style="--el-padding: 0px" :class="{ 'vab-table-fullscreen': isFullscreen }">
    <el-tabs
      v-model="activeName"
      type="border-card"
      class="demo-tabs"
      @tab-click="handleTabClick"
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
                  :file-list="row.imageList" 
                  :limit="5" 
                  :class="{ hide: hideUpload || row.hide }"
                  :on-change="changeImage"
                  :on-exceed="handleExceed"
                  :http-request="uploadImage"
                >
                  <div 
                    style="width: 75px; height: 75px; display: flex; align-items: center; justify-content: center;"
                    @click="handleIconClick(row)"
                  >
                    <el-icon ><Plus /></el-icon>
                  </div>

                  <template #file="{ file }">
                    <div>
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                      <span class="el-upload-list__item-actions">
                        <span
                          class="el-upload-list__item-preview"
                          @click="handlePictureCardPreview(file, row)"
                        >
                          <el-icon><zoom-in /></el-icon>
                        </span>
                        <span
                          v-if="!disabled"
                          class="el-upload-list__item-delete"
                          @click="handleRemove(file, row)"
                        >
                          <el-icon><Delete /></el-icon>
                        </span>
                      </span>
                    </div>
                  </template>
                </el-upload>
              </div>
              <div v-if="item.label === '产品'">
                <div v-html="row.product" style="text-align: left"></div>
              </div>
              <div v-if="item.label === 'OEM'" >
                <!--当 row.oem 的值为 1 时，复选框就会自动选中-->
                <el-checkbox v-model="row.oem" :true-value="'1'" :false-value="'0'" size="large" />
              </div>
              <div v-if="item.label === '立项日期'">
                {{ row.createTime.split(' ')[0] }}
              </div>
              <div v-if="item.label === '参与人员'">
                <div v-html="row.sharerName.replace(/,/g, '<br/>')"></div>
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
                      <el-link type="primary" :underline="false">开模申请</el-link>
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
                <el-select size="small" v-model="row.priority" disabled>
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
                <el-upload action="#" list-type="picture-card" :auto-upload="false" 
                  :file-list="row.imageList" disabled>
                  <el-icon><Plus /></el-icon>

                  <template #file="{ file }">
                    <div>
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                      <span class="el-upload-list__item-actions">
                        <span
                          class="el-upload-list__item-preview"
                          @click="handlePictureCardPreview(file, row)"
                        >
                          <el-icon><zoom-in /></el-icon>
                        </span>
                        <span
                          v-if="!disabled"
                          class="el-upload-list__item-delete"
                          @click="handleRemove(file, row)"
                        >
                          <el-icon><Delete /></el-icon>
                        </span>
                      </span>
                    </div>
                  </template>
                </el-upload>
              </div>
              <div v-if="item.label === '产品'">
                <div v-html="row.product" style="text-align: left"></div>
              </div>
              <div v-if="item.label === 'OEM'" >
                <!--当 row.oem 的值为 1 时，复选框就会自动选中-->
                <el-checkbox v-model="row.oem" :true-value="'1'" :false-value="'0'" size="large" disabled />
              </div>
              <div v-if="item.label === '立项日期'">
                {{ row.createTime.split(' ')[0] }}
              </div>
              <div v-if="item.label === '参与人员'">
                <div v-html="row.sharerName.replace(/,/g, '<br/>')"></div>
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
import { Search, ArrowDown, Delete, Plus, ZoomIn  } from '@element-plus/icons-vue'
import { type TableInstance } from 'element-plus'
import {
  indexColumns,
} from './indexColumns'

import { IProgressQueryReq, IProgress, IImageQueryReq } from '/@/type/progress/progressType'
import {
  deleteImage,
  getList,
  uploadFile,
} from '/@/api/devlocal/progress'
import type { UploadFile, TabsPaneContext, UploadProps, UploadUserFile } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus';

const activeName = ref("0")
const fixed = ref<string>('right')
const isFullscreen = ref<boolean>(false)
const tableRef = ref<TableInstance>()
// 表格加载loading状态
const listLoading = ref<boolean>(true)
// 新品进度列表
let progressList = reactive<IProgress[]>([])
let tableClickProgressId = ref<number>(0)
let tableClickRowIndex = ref<number>(0)
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

// 图片
const dialogImageUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
const disabled = ref(false)

// let list: any = []
const imagePriviewList = ref<string[]>([])
let hideUpload = ref<boolean>(false)

const changeImage = (file: any, fileList: any) => {
  hideUpload.value = fileList.length >= 5
}
const handleTabClick = (tab: TabsPaneContext, event: Event) => {
  console.log('tab', tab)
  if (tab.props.name === '0')  queryForm.status = 0
  else queryForm.status = 1
  fetchData()
}
/**
 * 图片删除功能
 */
const handleRemove = async (file: UploadFile, row: any) => {
  let i = row.imageList.findIndex((item: any) => item.uid === file.uid)
  // console.log(file)
  // console.log("Initial index:", i);
  // 如果没找到下标，说明是新上传的图片
  if (i === -1) {
    row.imageList.push({
      url: file.url,
      name: file.name,
      uid: file.uid,
    })
    i = row.imageList.length - 1 // 新上传的图片在数组的最后一项
  }
  row.imageList.splice(i, 1)
  console.log('row.imageList.length', row.imageList.length);
  if (row.imageList.length <= 5) {
    row.hide = false
    hideUpload.value = false
  }
  const delImgForm = new FormData()
  delImgForm.append('type', '2')
  delImgForm.append('imageId', file.name)
  const { data } = await deleteImage(delImgForm)
  
  // console.log(data)
}
/**
 * 定义超出限制时的行为
 */
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  // console.log(files, uploadFiles);
  if (uploadFiles.length >= 5) hideUpload.value = true
  else hideUpload.value = false
}
/**
 * 图片预览事件
 */
const handlePictureCardPreview = (file: UploadFile, row: any) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
  imagePriviewList.value = []
  const i = row.imageList.find((item: any) => item.uid === file.uid)
  imagePriviewList.value.push(file.url!)
  row.imageList.forEach((item: any) => {
    if (item.uid === i.uid) return
    imagePriviewList.value.push(item.url)
  })
}

// 图片预览关闭事件
const imagePreviewClose = () =>{
  dialogVisible.value = false;
}
/**
 * 点击添加图标事件
 */
const handleIconClick = (row: any) => {
  tableClickProgressId = row.progressId
  tableClickRowIndex.value = progressList.findIndex(item => item.progressId == row.progressId) as any
  // console.log('点击行的下标', tableClickRowIndex.value);
}
/**
 * 上传图片
 */
const imageForm = ref(new FormData()) as any;
async function uploadImage (params: any) {
  let imgListlength = progressList[tableClickRowIndex.value].imageList.length + 1
  if (imgListlength >= 5) {
    progressList[tableClickRowIndex.value].hide = false
    hideUpload.value = false
  }
  console.log('progressList', progressList);
   
  // console.log(params.file);
  let sort = progressList[tableClickRowIndex.value].imageList.length - 1
  // length 0 sort 5
  //        1      4  5-i
  imageForm.value = new FormData(); // 每次上传前重置 FormData
  imageForm.value.append('file', params.file);
  imageForm.value.append('type', '2');
  imageForm.value.append('progressId', tableClickProgressId);
  imageForm.value.append('sort', sort);
  // console.log(imageForm.value.get("type"))
  const { data } = await uploadFile(imageForm.value)
  // console.log(data)
  setTimeout(() => {
    fetchData()
  }, 500);
  
}
/**
 * 获取初始新品进度数据
 */
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getList(queryForm)
  progressList = data.list
  total.value = data.total
  listLoading.value = false

  progressList.forEach(item => {
    const tempArr: string[] = []
    item.imageList.forEach(image => {
      tempArr.push(image.imageUrl!)
      image.url = image.imageUrl;
      image.name = image.imageId;
      delete image.imageUrl;
      delete image.imageId;
    })
    
    if(tempArr.length === 5){
      item.hide = true
    }else {
      item.hide = false
      hideUpload.value = false
    }
    // list.push(tempArr)
  })
  // console.log(list.value);
}

// const tableCellClick = (row: any, column: any, cell: HTMLTableCellElement, event: Event)=>{
//   console.log(progressList);
//   tableClickIdx.value = progressList.indexOf(row)
  
//   console.log(tableClickIdx.value);
// }

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
    width: 75px;
    height: 75px;
  }
  :deep(.el-upload--picture-card) {
    width: 75px;
    height: 75px;
  }
}
.hide :deep(.el-upload--picture-card) {
  display: none
}
// 下拉框宽度
:deep(.el-select--small .el-select__wrapper) {
  width: 50px;
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