<template>
  <h2>采购计划</h2>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick" :lazy="true">
      <el-tab-pane label="待发布" name="0">
        <vab-query-form>
          <vab-query-form-left-panel >
            
            <el-button type="primary" @click="handlePlannedPoCreate">创建</el-button>
            <el-button type="success" @click="handleAllPublishPo">批量发布</el-button>
            <el-button type="warning" @click="handleAllMOQ">批量未达MOQ</el-button>
            <el-button type="danger" @click="handleAllDelete">批量删除</el-button>
          </vab-query-form-left-panel>
        </vab-query-form>

          <el-table 
              ref="tableRef" 
              stripe border 
              :data="fakeData"
              :header-cell-style="{ 'text-align': 'center' }"
              @cell-click="changeInput"
              class="noneHoveTable"
              :cell-style="cellStyle"
              @selection-change="setSelectRows"
          >
              <el-table-column type="selection" class="custom-checkbox">
              </el-table-column>
              <el-table-column label="创建日期" prop="createTime" min-width="115"></el-table-column>
              <el-table-column label="请购人" prop="person"></el-table-column>
              <el-table-column label="站点" prop="site" min-width="125"></el-table-column>
              <el-table-column label="SKU图片" class="image-wall" min-width="100">
                  <template #default="{ row, $index }">
                      <el-image :src="row.url" data-img="img">
                        <template #error>
                          <el-icon></el-icon>
                        </template>
                      </el-image>
                  </template>
              </el-table-column>
              <el-table-column label="SKU" prop="sku" width="150"></el-table-column>   
              <el-table-column label="数量" width="60" prop="quantity" >
                
              </el-table-column>
              <el-table-column label="零件名" prop="componentName" width="250">
              
              </el-table-column>
              <el-table-column label="零件数量" width="100" prop="componentQuantity" >
                  
              </el-table-column>
              <el-table-column label="单位" width="60" prop="componentUnit" >
                
              </el-table-column>
          
              <el-table-column label="含税价" prop="taxIncludedPrice" min-width="80">
                  
              </el-table-column>    
              <el-table-column label="货币" width="105px" prop="currency">
                  
              </el-table-column>
            
              <el-table-column  label="供应商" min-width="250" prop="suppliser">
              </el-table-column>

              <el-table-column  label="采购方" min-width="100" prop="purchaseId">
              </el-table-column>
              <el-table-column label="不报关" prop="declareCustomsStatus" min-width="75">
                  <template #default = "{ row }">
                      <el-checkbox v-model="row.declareCustomsStatus" :true-value="1" :false-value="0" class="custom-checkbox" />
                  </template>
              </el-table-column>

              <el-table-column label="零件采购注意事项" prop="purchaseMatters" min-width="250">
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.purchaseMatters"  />
                      </div>
                      <span class="overflow-text">{{ removeHtmlTags(row.purchaseMatters) }}</span>
                  </template>
              </el-table-column>

              <el-table-column fixed="right" label="操作" width="150" >
                <template #default="{ row, $index }">
                  <el-dropdown>
                    <el-button text type="primary" @click="handlePlannedPoDetail(row)">
                      详情
                      <el-icon class="el-icon--right">
                        <arrow-down />
                      </el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>
                          <el-link type="primary" :underline="false" @click="handlePlannedPoDetail(row)">详情</el-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <el-link type="primary" :underline="false" @click="handlePublishPo(row)">发布PO</el-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <el-link type="danger" :underline="false" @click="handleDelPlannedPo(row)">删除</el-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <el-link type="primary" :underline="false" @click="activeName = '1'">未达起订量</el-link>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </template>
              </el-table-column>
              <template #empty>
                  <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
              </template>
          </el-table>
        <!-- <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        /> -->
        <!-- <default-table-edit ref="editRef" @fetch-data="fetchData" /> -->
      </el-tab-pane>
      <el-tab-pane label="未达起订量" name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
              <el-button type="danger" >批量删除</el-button>
          </vab-query-form-left-panel>
        </vab-query-form>
        <el-table 
              ref="tableRef" 
              stripe border 
              :data="fakeData"
              :header-cell-style="{ 'text-align': 'center' }"
              @cell-click="changeInput"
              class="noneHoveTable"
              :cell-style="cellStyle"
              @selection-change="setSelectRows"
          >
              <el-table-column type="selection" class="custom-checkbox">
              </el-table-column>
              <el-table-column label="创建日期" prop="createTime" min-width="115"></el-table-column>
              <el-table-column label="请购人" prop="person"></el-table-column>
              <el-table-column label="站点" prop="site" min-width="125"></el-table-column>
              <el-table-column label="SKU图片" class="image-wall" min-width="100">
                  <template #default="{ row, $index }">
                      <el-image :src="row.url" data-img="img">
                        <template #error>
                          <el-icon></el-icon>
                        </template>
                      </el-image>
                  </template>
              </el-table-column>
              <el-table-column label="SKU" prop="sku" width="150"></el-table-column>   
              <el-table-column label="数量" width="60" prop="quantity" >
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.quantity" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>{{ row.quantity }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="零件名" prop="componentName" width="250">
          
              </el-table-column>
              <el-table-column label="零件数量" width="100" prop="componentQuantity" >
                
              </el-table-column>
              <el-table-column label="单位" width="60" prop="componentUnit" >
                
              </el-table-column>
          
              <el-table-column label="含税价" prop="taxIncludedPrice" min-width="80">
                  
              </el-table-column>    
              <el-table-column label="货币" width="105px" prop="currency">
                
              </el-table-column>
            
              <el-table-column  label="供应商" min-width="250" prop="suppliser">
              </el-table-column>

              <el-table-column  label="采购方" min-width="100" prop="purchaseId">
              </el-table-column>
              <el-table-column label="不报关" prop="declareCustomsStatus" min-width="75">
                  <template #default = "{ row }">
                      <el-checkbox v-model="row.declareCustomsStatus" :true-value="1" :false-value="0" class="custom-checkbox" />
                  </template>
              </el-table-column>

              <el-table-column label="零件采购注意事项" prop="purchaseMatters" min-width="250">
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.purchaseMatters"  />
                      </div>
                      <span class="overflow-text">{{ removeHtmlTags(row.purchaseMatters) }}</span>
                  </template>
              </el-table-column>

              <el-table-column fixed="right" label="操作" width="150" >
                <template #default="{ row, $index }">
                  <el-dropdown>
                    <el-button text type="primary" @click="handlePlannedPoDetail(row)">
                      详情
                      <el-icon class="el-icon--right">
                        <arrow-down />
                      </el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>
                          <el-link type="primary" :underline="false" @click="handlePlannedPoDetail(row)">详情</el-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <el-link type="primary" :underline="false" @click="handlePublishPo(row)">发布PO</el-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <el-link type="danger" :underline="false" >删除</el-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <el-link type="primary" :underline="false" @click="activeName = '0'">达到起订量</el-link>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </template>
              </el-table-column>
              <template #empty>
                  <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
              </template>
          </el-table>
  
        <!-- <default-table-edit ref="editRef" @fetch-data="fetchData" /> -->
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer @close="" :url-list="imagePriviewList" v-if ="dialogVisible"/>
    <!-- <wangEditor
        :title="wangEditorTitle"
        :wangEditorVisible="wangEditorLogVisible"
        :content="progressLogCopy"
        @clickChild="clickLog"
        @clickBoolean="clickLogBool"
        :classify="classify"
      >
      </wangEditor> -->
  </div>
</template>
  
<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { IProgress, IProgressQueryReq } from '/@/type/progress/progressType'

  import type { TableInstance, TabsPaneContext } from 'element-plus'

  import { getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
//   import wangEditor from './wangEditor.vue'
const selectRows = ref<any>([])
const setSelectRows = (value: string) => {
  selectRows.value = value
}
  
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
  const evaluationTableRef = ref<TableInstance>()
  // 表格加载loading状态
  const listLoading = ref<boolean>(true)
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
const handleAllMOQ = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning', 'hey')
  } else {

      $baseMessage('批量处理成功', 'success', 'hey')
 
  }
}
const handleAllDelete = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning', 'hey')
  } else {
    $baseConfirm('确定要批量删除所选信息吗', null, async () => {
      $baseMessage('批量删除成功', 'success', 'hey')
    })
  }
}
const handleDelPlannedPo = (row: any) => {
    $baseConfirm('确定要删除本条信息吗',"系统提示", async ()=>{


        $baseMessage("删除成功！","success","hey")

    }
)
}
const handleAllPublishPo = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning', 'hey')
  } else {
   
      $baseMessage('批量发布到PO成功', 'success', 'hey')
    
  }
}
const handlePublishPo = async (row: any) => {
  $baseConfirm('确定要发布到PO吗', null, async () => {
    $baseMessage('发布到PO成功', 'success', 'hey')
  })
}
const handlePlannedPoDetail = (row: any) => {
  router.push({
        path: '/purchase/plannedPoDetail',
        query: {
            title: "采购计划订单详情",
            timestamp: Date.now(),
        },
    })
}
const handlePlannedPoCreate = () => {
  router.push({
        path: '/purchase/plannedPoCreate',
        query: {
            title: "采购计划创建",
            timestamp: Date.now(),
        },
    })
}
const fakeData = [
    { 
        createTime: '2024-10-08',
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

// 预览图片列表
const imagePriviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
  
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
      imagePriviewList.value = []
      imagePriviewList.value.push(imageUrl)
      // console.log(imagePriviewList.value)
  }
  
  const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
   
        
   
       return {
    
            textAlign:'center'
        } 
   
}
  
  
  
  

  
/**
 * 当点击时切换输入框，修改输入
 */
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 

    // 处理图片放大预览
    let el = getSpecificChildren(cell, "img")[0];
    if (getDataAttribute(el, 'img') && getSpecificChildren(cell, "img")[0]) {
      imagePreviewVisible.value = true
      imagePriviewList.value = []
      imagePriviewList.value.push(el.src!)
    }
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
  