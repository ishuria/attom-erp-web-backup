<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="进行中" name="0">
        <vab-query-form>
          <vab-query-form-left-panel >
            <el-button type="primary">样品进度</el-button>
            <el-button type="primary">开模进度</el-button>
            <el-button type="primary">筛选</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.productKeyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                  @click="queryData" class="elsearch"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table 
          ref="tableRef" 
          v-loading="listLoading" 
          border stripe
          :data="progressList" 
          @cell-click="changeInput"
          :header-cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column label="优先级" prop="priority"  width="75">
            <template #default = "{ row }">
              <el-select size="small" v-model="row.priority" @blur="clickCancle($event, row)">
                <el-option 
                  v-for="item in priorityOptions" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="示例图片" prop="imageList" class="image-wall" width="450">
            <template #default = "{ row }">
              <VueDraggable
                v-model="row.imageList"
                :animation="150"
                ghostClass="ghost"
                target="ul"
                @end="onEnd"
              >
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
              </VueDraggable>
            </template>
          </el-table-column>
          <el-table-column label="产品" prop="product" width="160">
            <template #default = "{ row }">
              <div class="none">
                  <el-input type="textarea" autofocus v-model="row.product" :autosize="{ minRows: 3, maxRows: 9 }"
                    @blur="clickCancle($event, row)" />
                </div>
                <span v-html="formattedProgressLog(row.product)"></span>
            </template>
          </el-table-column>
          <el-table-column label="OEM" prop="oem" align="center" width="60">
            <template #default = "{ row }">
               <el-checkbox v-model="row.oem" :true-value="'1'" :false-value="'0'" size="large" @change="handleCheckbox(row.oem)"/>
            </template>
          </el-table-column>
          <el-table-column label="立项日期" prop="createTime" align="center" width="100">
            <template #default = "{ row }">
              <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="当前阶段" prop="currentPhaseStatus" align="center" width="80">
            <template #default = "{ row }">
              <div class="none">
                <el-input type="textarea" autofocus v-model="row.currentPhaseStatus" :autosize="{ minRows: 3, maxRows: 9 }"   @blur="clickCancle($event, row)"/>
              </div>
              <span>{{ row.currentPhaseStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开发日志" prop="progressLog" min-width="300">
            <template #default = "{ row }">
              <div class="none" >
                <el-input type="textarea" autofocus v-model="row.progressLog" :autosize="{ minRows: 3, maxRows: 9 }" />
              </div>
              <span> {{ removeHtmlTags(row.progressLog) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="参与人员" prop="sharerName" align="center" show-overflow-tooltip width="100">
            <template #default = "{ row }">
              <div style="color: rgb(192, 192, 192, 1)" v-html="row.sharerName.replace(/,/g, '<br/>')"></div>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" >
            <template #default = "{ row }">
              <div class="none">
                  <el-input type="textarea" autofocus v-model="row.remark" :autosize="{ minRows: 3, maxRows: 9 }" />
                </div>
                <span>{{ removeHtmlTags(row.remark) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="目标月销" prop="targetMonthlySales" align="center">
            <template #default = "{ row }">
              <div class="none">
                  <el-input type="text" v-model="row.targetMonthlySales" @blur="clickCancle($event, row)" />
                </div>
                <span>{{ row.targetMonthlySales }}</span>
            </template>
          </el-table-column>
          <el-table-column label="新款评估编号" prop="evaluationId" align="center">
            <template #default = "{ row }">
              <span style="color: rgb(192, 192, 192, 1)">{{ row.evaluationId }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :fixed="fixed" label="操作" width="180px">
            <template #default="{ row }">
              <el-dropdown>
                <el-button text type="primary"  @click="handleSampleCostting(row)">
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
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
        <default-table-edit ref="editRef" @fetch-data="fetchData" />
      </el-tab-pane>
      <el-tab-pane label="已归档" name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary">筛选</el-button>
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
          border stripe
          :data="progressList" 
          @cell-click="changeInput"
          :header-cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column label="优先级" prop="priority" align="center" width="75">
            <template #default = "{ row }">
              <el-select size="small" v-model="row.priority" @blur="clickCancle($event, row)" disabled>
                <el-option 
                  v-for="item in priorityOptions" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="示例图片" prop="imageList" class="image-wall" width="450">
            <template #default = "{ row }">
              <VueDraggable
                v-model="row.imageList"
                :animation="150"
                ghostClass="ghost"
                target="ul"
                @end="onEnd"
              >
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
              </VueDraggable>
            </template>
          </el-table-column>
          <el-table-column label="产品" prop="product" width="160">
            <template #default = "{ row }">
              <div class="none">
                  <el-input type="textarea" autofocus v-model="row.product" :autosize="{ minRows: 3, maxRows: 9 }"
                    @blur="clickCancle($event, row)" disabled/>
                </div>
                <span v-html="row.product" style="text-align: left"></span>
            </template>
          </el-table-column>
          <el-table-column label="OEM" prop="oem" align="center" width="60">
            <template #default = "{ row }">
               <el-checkbox v-model="row.oem" :true-value="'1'" :false-value="'0'" size="large" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="立项日期" prop="createTime" align="center" width="100">
            <template #default = "{ row }">
              <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="当前阶段" prop="currentPhaseStatus" align="center" width="80">
            <template #default = "{ row }">
              <div class="none">
                <el-input type="text" v-model="row.currentPhaseStatus" @blur="clickCancle($event, row)" disabled/>
              </div>
              <span>{{ row.currentPhaseStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开发日志" prop="progressLog" min-width="300">
            <template #default = "{ row }">
              <div class="none" >
                <el-input type="textarea" autofocus v-model="row.progressLog" :autosize="{ minRows: 3, maxRows: 9 } " disabled
                  @blur="clickCancle($event, row)" />
              </div>
              <span>{{ row.progressLog }}</span>
            </template>
          </el-table-column>
          <el-table-column label="参与人员" prop="sharerName" align="center">
            <template #default = "{ row }">
              <div style="color: rgb(192, 192, 192, 1)" v-html="row.sharerName.replace(/,/g, '<br/>')"></div>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" >
            <template #default = "{ row }">
              <div class="none">
                  <el-input type="text" v-model="row.remark" @blur="clickCancle($event, row)" />
                </div>
                <span>{{ row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="目标月销" prop="targetMonthlySales" align="center">
            <template #default = "{ row }">
              <div class="none">
                  <el-input type="text" v-model="row.targetMonthlySales" @blur="clickCancle($event, row)" />
                </div>
                <span>{{ row.targetMonthlySales }}</span>
            </template>
          </el-table-column>
          <el-table-column label="新款评估编号" prop="evaluationId" align="center">
            <template #default = "{ row }">
              <span style="color: rgb(192, 192, 192, 1)">{{ row.evaluationId }}</span>
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
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
        <default-table-edit ref="editRef" @fetch-data="fetchData" />
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if ="dialogVisible"/>

    <wangEditor
      :title="wangEditorTitle"
      :wangEditorVisible="wangEditorLogVisible"
      :content="progressLogCopy"
      width="70%"
      @clickChild="clickLog"
      @clickBoolean="clickLogBool"
      :classify="classify"
    >
    </wangEditor>
    <wangEditor
      :title="wangEditorTitle"
      :wangEditorVisible="wangEditorRemarkVisible"
      :content="remarkCopy"
      width="70%"
      @clickChild="clickRemark"
      @clickBoolean="clickRemarkBool"
      :classify="classify"
    >
    </wangEditor>
  </div>
</template>

<script lang="ts" setup>
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleMatched, handleTabs } from '/@/utils/routes'
import { ref } from 'vue'
import { Search, ArrowDown, Delete, Plus, ZoomIn  } from '@element-plus/icons-vue'
import {
  indexColumns,
} from './indexColumns'

import { IProgressQueryReq, IProgress, IImageQueryReq } from '/@/type/progress/progressType'
import {
  deleteImage,
  getList,
  updateProgressImgSort,
  updateProgressManage,
  uploadFile,
} from '/@/api/devlocal/progress'
import type { UploadFile, TabsPaneContext, TableInstance } from 'element-plus'

import { type SortableEvent, VueDraggable, DraggableEvent } from 'vue-draggable-plus'
import debounce from 'lodash/debounce'
import { getRootElement, getSpecificChildren, getDataAttribute } from '/@/utils/nodeUtils'
import wangEditor from './wangEditor.vue'
import { getLocalStorage, setLocalStorage } from '~/src/utils/localStorage'

defineOptions({
  name: 'ProgressTable',
})

const router = useRouter()

const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta, addVisitedRoute } = tabsStore
const editRef = ref<any>(null)

const activeName = ref("0")
const fixed = ref<string>('right')
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

// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 点击日志弹出富文本框是否显示
const wangEditorLogVisible = ref<boolean>(false)
// 点击备注弹出富文本框是否显示
const wangEditorRemarkVisible = ref<boolean>(false)
const progressLogCopy = ref<string>('')
const remarkCopy = ref<string>('')
const classify = ref<string>('')
const tableClickIdx = ref<any>(0)

const handleTabClick = (tab: TabsPaneContext, event: Event) => {
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
const dlist = ref<any>([])
// 移动之后触发修改排序接口
const onEnd = debounce(async (e: SortableEvent ) => {
    try {
        dlist.value = progressList.value[tableClickRowIndex.value].imageList
        // console.log(dlist.value)
        const idList = dlist.value.map((item: any) =>{
            return item.name
        })
        await updateProgressImgSort(idList)
    }catch(e){
        console.error(e as Error)
    }
}, 500)
/**
 * 获取初始新品进度数据
 */
const fetchData = async () => {
  listLoading.value = true
  // console.log(queryForm)
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

/**
 * 当点击时切换输入框，修改输入
 */
const changeInput = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 

  if (!cell.children[0].children[0]
      || !cell.children[0].children[1]
      || !cell.children[0].children[0].classList
      || !cell.children[0].children[1].classList) {
    return
  }
  // console.log(cell.children[0].children[0])
  // console.log(cell.children[0].children[1])
  // console.log(cell.children[0].children[2])
  // 获取行的下标
  tableClickIdx.value = progressList.value.indexOf(row)
  if (column.property == 'progressLog') {
    progressLogCopy.value = progressList.value[tableClickIdx.value].progressLog
    wangEditorTitle.value = '编辑开发日志'
    classify.value = 'progressLog'
    wangEditorLogVisible.value = !wangEditorLogVisible.value
  } else if (column.property == 'remark'){
    remarkCopy.value = progressList.value[tableClickIdx.value].remark
    wangEditorTitle.value = '编辑备注'
    classify.value = 'remark'
    wangEditorRemarkVisible.value = !wangEditorRemarkVisible.value
  } else {
    cell.children[0].children[0].classList.remove('none')
    cell.children[0].children[1].classList.add('none')
  }

  // 自动聚焦
  const inputElement = getSpecificChildren(cell, "input")[0];
  if (inputElement) {
      inputElement.focus()
  } else {
    const textareaElement = getSpecificChildren(cell, "textarea")[0];
    if (textareaElement){
      textareaElement.focus()
    }
  }
}
const handleCheckbox = async (value: any) => {
  // console.log(value);
  progressList.value[tableClickIdx.value].oem = value
  await updateProgressManage(progressList.value[tableClickIdx.value])
}
/**
 * 输入失焦事件
 */
const clickCancle = async (event: any, value: any) =>{

  const t1 = getRootElement(event["srcElement"],".cell").children[0]

  if (t1){
    if (t1.classList[0] !== "el-select") {
      t1.classList.add("none")
    }
  }

  const t2 = getRootElement(event["srcElement"],".cell").children[1]
  if (t2){
    t2.classList.remove("none")
  }
  await updateProgressManage({...value})
}

/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickLog = async (val: any) => {
  // console.log('新的val', val);
  
  progressList.value[tableClickIdx.value].progressLog = val
  progressLogCopy.value = val
  // console.log('点击log执行了');
  await updateProgressManage(progressList.value[tableClickIdx.value]) //发送更新数据请求
}
const clickRemark = async (val: any) => {
  progressList.value[tableClickIdx.value].remark = val
  remarkCopy.value = val
  // console.log('点击remark执行了');
  await updateProgressManage(progressList.value[tableClickIdx.value]) //发送更新数据请求
}
// 去掉 HTML 标签并显示纯文本的方法
const removeHtmlTags = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};
/**
 * 当点击取消，确认时，子组件传递给父组件 false
 */
const clickLogBool = ( val: any) => {
  wangEditorLogVisible.value = val
  // console.log('点击logbool执行了');
}
const clickRemarkBool = ( val: any) => {
  wangEditorRemarkVisible.value = val
  // console.log('点击remarkbool执行了');
}
/**
 * 获取新品进度列表数据
 */
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const formattedProgressLog = (str: string) => {
  return str
    .replace(/([\u4e00-\u9fa5]) ([a-zA-Z])/g, '$1<br>$2')
    .replace(/([a-zA-Z]) ([\u4e00-\u9fa5])/g, '$1<br>$2');
};
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


// 拿样与核算
const handleSampleCostting = (row:IProgress) =>{
  
  router.push({
    path: '/newProductDevelopment/productProgressComponent',
    query: {
      title: "零件清单",
      progressId: row.progressId,
      product: row.product,
      timestamp: Date.now(),
    },
  })
}

onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
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
        }
      }
    }
  }
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 75px;
  height: 75px;
  margin: 0 8px 0 0;
}
:deep(.el-upload--picture-card) {
  width: 75px;
  height: 75px;
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}
// 下拉框宽度
:deep(.el-select--small .el-select__wrapper) {
  width: 50px;
}
// 控制添加图片图标显示与隐藏
.hide :deep(.el-upload--picture-card) {
  display: none
}
// 控制编辑框显示与隐藏
.none {
  display: none;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

</style>
