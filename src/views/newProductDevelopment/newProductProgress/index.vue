<template>
  <div class="custom-table-container auto-height-container" :class="{ 'vab-table-fullscreen': isFullscreen }">
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
          <el-table-column v-for="(item, idx) in indexColumns" :key="idx" align="center" :label="item.label"
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
                  list-type="picture-card" 
                  :file-list="row.imageList" 
                  :limit="5" 
                  :class="{ hide: row.hide }"
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
                      {{ file.name }}
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

                  <template #file="{ file}">
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
import { type TableInstance, ElMessage } from 'element-plus'
import {
  indexColumns,
} from './indexColumns'

import { IProgressQueryReq, IProgress, IImageQueryReq } from '/@/type/progress/progressType'
import {
  deleteImage,
  getList,
  uploadFile,
} from '/@/api/devlocal/progress'
import type { UploadFile, TabsPaneContext, UploadProps, UploadUserFile, UploadFiles } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus';

const activeName = ref("0")
const fixed = ref<string>('right')
const isFullscreen = ref<boolean>(false)
const tableRef = ref<TableInstance>()
// 表格加载loading状态
const listLoading = ref<boolean>(true)
// 新品进度列表
let progressList = ref<IProgress[]>([])
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

const imagePriviewList = ref<string[]>([])

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
  try {
    const imageListCopy = [...row.imageList];

    // 找到要删除的元素的下标
    const i = imageListCopy.findIndex((item: any) => item.url === file.url);

    if (i === -1) {
      $baseMessage("错误，请联系开发人员!","error","hey")
      return
    }

    // 从复制的数组中移除该元素
    imageListCopy.splice(i, 1);
    // 将更新后的数组替换原来的 imageList
    row.imageList = imageListCopy;
    if (row.imageList.length <= 5) {
       row.hide = false
    }
    const delImgForm = new FormData()
    delImgForm.append('type', '2')
    delImgForm.append('imageId', file.name)
    
    const { data } = await deleteImage(delImgForm)
    if (data == true) {
      $baseMessage("此条产品图片信息删除成功!","success","hey")
    }
  } catch (error) {
    console.error(error)
  }
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
  tableClickRowIndex.value = progressList.value.findIndex(item => item.progressId == row.progressId) as any
  // console.log('点击行的下标', tableClickRowIndex.value);
}


/**
 * 上传图片
 */
const imageForm = ref(new FormData()) as any;
async function uploadImage (params: any) {
  try {
    let imgListlength = progressList.value[tableClickRowIndex.value].imageList.length + 1
    if (imgListlength === 5) {
      // isUpdate.value = !isUpdate.value
      progressList.value[tableClickRowIndex.value].hide = true
    }
    let sort = progressList.value[tableClickRowIndex.value].imageList.length - 1
    imageForm.value = new FormData(); // 每次上传前重置 FormData
    imageForm.value.append('file', params.file);
    imageForm.value.append('type', '2');
    imageForm.value.append('progressId', tableClickProgressId);
    imageForm.value.append('sort', sort);

    const { data } = await uploadFile(imageForm.value)
    const { fileId, url } = data
    const imageListCopy = [...progressList.value[tableClickRowIndex.value].imageList];
    imageListCopy.push({
        url: url,
        name: fileId,
    });
    let newArray = [...progressList.value]
    newArray[tableClickRowIndex.value].imageList  = imageListCopy;
    progressList.value = JSON.parse(JSON.stringify(newArray))
    if (imgListlength === 5) {
      progressList.value[tableClickRowIndex.value].hide = true
    }
    
  } catch (error) {
    console.error(error)
  }
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
    } else {
      item.hide = false
    }
  })
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
  display: flex;
  flex-direction: column;
  height: 100%; /* 让父容器占满整个可用高度 */
  .custom-table-right-tools {
    display: flex;
    align-items: center;
  }
  .el-tabs {
    flex: 1
  }
}
:deep(.el-table__header){
  height: 62.8px
}
// :deep(.el-table__row) {
//   height: 56.8px
// }
:deep(.el-tabs__item) {
  font-size: 18px;
  width: 130px;
}

.image-wall {
  display: flex;
  align-items: center; /* 垂直居中 */
  gap: 10px; /* 使用 gap 属性来控制图片之间的间距 */
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
  width: 48px;
}

/*去除upload组件过渡效果*/
:deep(.el-upload-list__item) {
  transition: none !important;
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