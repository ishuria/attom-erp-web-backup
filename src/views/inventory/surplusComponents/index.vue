<template>
  <h2>多订零件库存</h2>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick" :lazy="true">
      <el-tab-pane label="有库存" name="0">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.productKeyWord" @input="" @keyup.enter.native="" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                  @click=""></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

          <el-table 
              ref="tableRef" 
              stripe border 
              :data="fakeData"
              :header-cell-style="{ 'text-align': 'center' }"
              @cell-click="changeInput"
              class="noneHoveTable"
              :cell-style="cellStyle"
          >
            
              <el-table-column label="图片" class="image-wall" width="100">
                  <template #default="{ row, $index }">
              
                         
                      <el-image class="el-upload-list__item-thumbnail" :src="row.url">
                        <template #error>
                          <el-icon></el-icon>
                        </template>
                      </el-image>
                               
                  </template>
              </el-table-column>
              <el-table-column label="零件ID" prop="sku" width="100"></el-table-column>   
              <el-table-column label="PO" width="60" prop="quantity" >
   
              </el-table-column>
              <el-table-column label="零件名" prop="componentName" width="250">
         
              </el-table-column>
              <el-table-column label="可用SKU" width="250" prop="componentQuantity">
           
              </el-table-column>
              <el-table-column label="剩余库存" width="100" prop="componentUnit">
                
              </el-table-column>
          
              <el-table-column label="已用库存" prop="taxIncludedPrice" min-width="100">
                
              </el-table-column>    
              <el-table-column label="使用的PO" width="105px" prop="currency" >
 
              </el-table-column>
              <el-table-column label="单位" width="70" prop="currency" >
 
              </el-table-column>
              <el-table-column label="仓库" min-width="250" prop="suppliser">
              </el-table-column>
              <el-table-column label="供应商" min-width="250" prop="suppliser">
              </el-table-column>

              <el-table-column label="采购方" min-width="100" prop="purchaseId">
              </el-table-column>
              <el-table-column label="不报关" prop="declareCustomsStatus" min-width="75">
                  <template #default = "{ row }">
                      <el-checkbox v-model="row.declareCustomsStatus" :true-value="1" :false-value="0" class="custom-checkbox" />
                  </template>
              </el-table-column>
              <template #empty>
                  <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
              </template>
          </el-table>
      </el-tab-pane>
      <el-tab-pane label="已用完" name="1">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.productKeyWord" @keyup.enter.native="" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                  @click=""></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table 
              ref="tableRef" 
              stripe border 
              :data="fakeData"
              :header-cell-style="{ 'text-align': 'center' }"
              @cell-click="changeInput"
              class="noneHoveTable"
              :cell-style="cellStyle"
          >
            
          <el-table-column label="图片" class="image-wall" width="100">
                  <template #default="{ row, $index }">
              
                         
                      <el-image class="el-upload-list__item-thumbnail" :src="row.url">
                        <template #error>
                          <el-icon></el-icon>
                        </template>
                      </el-image>
                               
                  </template>
              </el-table-column>
              <el-table-column label="零件ID" prop="sku" width="100"></el-table-column>   
              <el-table-column label="PO" width="60" prop="quantity" >
   
              </el-table-column>
              <el-table-column label="零件名" prop="componentName" width="250">
         
              </el-table-column>
              <el-table-column label="可用SKU" width="250" prop="componentQuantity">
           
              </el-table-column>
              <el-table-column label="剩余库存" width="100" prop="componentUnit">
                
              </el-table-column>
          
              <el-table-column label="已用库存" prop="taxIncludedPrice" min-width="100">
                
              </el-table-column>    
              <el-table-column label="使用的PO" width="105px" prop="currency" >
 
              </el-table-column>
              <el-table-column label="单位" width="70" prop="currency" >
 
              </el-table-column>
              <el-table-column label="仓库" min-width="250" prop="suppliser">
              </el-table-column>
              <el-table-column label="供应商" min-width="250" prop="suppliser">
              </el-table-column>

              <el-table-column label="采购方" min-width="100" prop="purchaseId">
              </el-table-column>
              <el-table-column label="不报关" prop="declareCustomsStatus" min-width="75">
                  <template #default = "{ row }">
                      <el-checkbox v-model="row.declareCustomsStatus" :true-value="1" :false-value="0" class="custom-checkbox" />
                  </template>
              </el-table-column>
              <template #empty>
                  <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
              </template>
          </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer @close="" :url-list="imagePreviewList" v-if ="dialogVisible" hide-on-click-modal/>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { TableInstance, TabsPaneContext } from 'element-plus'
import { ref } from 'vue'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { IProgress, IProgressQueryReq } from '/@/type/progress/progressType'
import { getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'




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

const tableRef = ref<TableInstance>()
const evaluationTableRef = ref<TableInstance>()
// 表格加载loading状态
const listLoading = ref<boolean>(false) //
// 新品进度列表
let progressList = ref<IProgress[]>([])
let tableClickProgressId = ref<number>(0)
// 点击上传图标的行下标
let tableClickRowIndex = ref<number>(0)
// 总记录数
const total = ref<number>(0)
const queryForm = reactive<IProgressQueryReq>({
  pageNo: 1,
  pageSize: 20,
  productKeyWord: '',
  status: 0, //查询状态：0表示进行中 1表示已归档
})
// 采购计划col合并方法
// const objectSpanMethod = ({
//   row,
//   column,
//   rowIndex,
//   columnIndex,
// }: any) => {
//   // 设置需要合并的列
//   if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3
//     || columnIndex === 4 || columnIndex === 5 || columnIndex === 6
//   ) {
//     // 获取当前row的id
//     const reviewMainId = row.reviewMainId;
//     // 默认不跨行
//     let rowspan = 1;
//     // 遍历后端返回的数据
//     for (let i = rowIndex + 1; i < dataList.value.length!; i++) {
//       // 如果id一样需要合并
//       if (dataList.value[i].reviewMainId === reviewMainId) {
//         rowspan++;
//       } else {
//         break;
//       }
//     }

//     // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
//     if (rowIndex === 0 || dataList.value[rowIndex - 1].reviewMainId !== reviewMainId) {
//       return { rowspan, colspan: 1 };
//     } else {
//       return { rowspan: 0, colspan: 0 };
//     }
//   }
// }
const fakeData = [
  { 
      createTime: '',
      person: '王豪俊',
      sku: 'sku123',
      quantity: 1,
      componentName: '',
      componentQuantity: 2,
      unit: '',
      taxIncludedPrice: 33,
      currency: 0,
      suppliser: '',
      purchaseId: 9,
      declareCustomsStatus: 1,
      purchaseMatters: ''
  },
  { 
      createTime: '',
      person: '王豪俊',
      sku: 'sku123',
      quantity: 1,
      componentName: '',
      componentQuantity: 2,
      unit: '',
      taxIncludedPrice: 33,
      currency: 0,
      suppliser: '',
      purchaseId: 9,
      declareCustomsStatus: 1,
      purchaseMatters: ''
  },
  { 
      createTime: '',
      person: '王豪俊',
      sku: 'sku123',
      quantity: 1,
      componentName: '',
      componentQuantity: 2,
      unit: '',
      taxIncludedPrice: 33,
      currency: 0,
      suppliser: '',
      purchaseId: 9,
      declareCustomsStatus: 1,
      purchaseMatters: ''
  },
  { 
      createTime: '',
      person: '王豪俊',
      sku: 'sku123',
      quantity: 1,
      componentName: '',
      componentQuantity: 2,
      unit: '',
      taxIncludedPrice: 33,
      currency: 0,
      suppliser: '',
      purchaseId: 9,
      declareCustomsStatus: 1,
      purchaseMatters: ''
  },
  { 
      createTime: '',
      person: '王豪俊',
      sku: 'sku123',
      quantity: 1,
      componentName: '',
      componentQuantity: 2,
      unit: '',
      taxIncludedPrice: 33,
      currency: 0,
      suppliser: '',
      purchaseId: 9,
      declareCustomsStatus: 1,
      purchaseMatters: ''
  },
]

// 图片
const dialogImageUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)

const imagePreviewList = ref<string[]>([])

// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 点击日志弹出富文本框是否显示
const wangEditorLogVisible = ref<boolean>(false)
// 点击备注弹出富文本框是否显示
const wangEditorRemarkVisible = ref<boolean>(false)
const progressLogCopy = ref<string | undefined>('')
const remarkCopy = ref<string | undefined>('')
const classify = ref<string>('')
const tableClickIdx = ref<any>(0)


const handleTabClick = (tab: TabsPaneContext, event: Event) => {
  progressList.value=[]
  if (tab.props.name === '0')  queryForm.status = 0
  else queryForm.status = 1

  // fetchData()
}
//   // 处理已归档
//   const handleArchived = async (progressId: number) => {
//     const { data } = await updateProgressArchive({ progressId })
//     if (data === true) {
//       const index = progressList.value.findIndex((item: any) => item.progressId === progressId)
//       progressList.value.splice(index, 1)
//       $baseMessage("此条新品进度信息已归档成功!","success","hey")
//     }
  
//     // activeName.value = "1"
//   }



// 修改图片预览列表
const setPreviewList = (imageUrl:string) =>{
    dialogVisible.value = true
    imagePreviewList.value = []
    imagePreviewList.value.push(imageUrl)
    // console.log(imagePreviewList.value)
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
   
   if  (data.columnIndex !== 3 && data.columnIndex !== 4 && data.columnIndex !== 9 && data.columnIndex !== 10){        
   
       return {
            textAlign:'center'
        } 
   }
}






/**
 * 当点击时切换输入框，修改输入
 */
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 

  // 获取行的下标
  tableClickIdx.value = progressList.value.indexOf(row)
  if (!cell.children[0].children[0]
      || !cell.children[0].children[1]
      || !cell.children[0].children[0].classList
      || !cell.children[0].children[1].classList) {
    return
  }
  // console.log(cell.children[0].children[0])
  // console.log(cell.children[0].children[1])
  // console.log(cell.children[0].children[2])

  // if (column.property == 'progressLog') {
  // //   const { data } = await getProgressLog({ progressId: row.progressId })
  //   // progressLogCopy.value = progressList.value[tableClickIdx.value].progressLog
  //   progressLogCopy.value = data
  //   wangEditorTitle.value = '编辑开发日志'
  //   classify.value = 'progressLog'
  //   wangEditorLogVisible.value = !wangEditorLogVisible.value
  // } else if (column.property == 'remark'){
  //   remarkCopy.value = progressList.value[tableClickIdx.value].remark
  //   wangEditorTitle.value = '编辑备注'
  //   classify.value = 'remark'
  //   wangEditorRemarkVisible.value = !wangEditorRemarkVisible.value
  // } else {
  //   cell.children[0].children[0].classList.remove('none')
  //   cell.children[0].children[1].classList.add('none')
  // }

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
  // await updateProgressManage({...value})
}

/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickLog = async (val: any) => {
  // console.log('新的val', val);
  
  progressList.value[tableClickIdx.value].progressLog = val
  progressLogCopy.value = val
  // console.log('点击log执行了');
  // await updateProgressManage(progressList.value[tableClickIdx.value]) //发送更新数据请求
}
const clickRemark = async (val: any) => {
  progressList.value[tableClickIdx.value].remark = val
  remarkCopy.value = val
  // console.log('点击remark执行了');
  // await updateProgressManage(progressList.value[tableClickIdx.value]) //发送更新数据请求
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







onActivated(() => { 
  tableRef.value?.doLayout()
})
onBeforeMount(() => {
  // fetchData()
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
  transition: none;
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
:deep(.el-select--default .el-select__wrapper) {
  width: 50px;
  padding-left: 8px;
  padding-right: 6px;
  font-size: var(--el-font-size-base);
}

// 控制添加图片图标显示与隐藏
.hide :deep(.el-upload--picture-card) {
  display: none
}
// 控制编辑框显示与隐藏
.none {
  display: none;
}
.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
// 开模申请
:deep(.moldDialog .el-dialog__body) { 
  padding-top: 0;
}
   
// .shareSelectDialog {
//   .el-dialog__body {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//   }
// }
:deep(.shareSelectDialog .el-dialog__body) {
  display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>

