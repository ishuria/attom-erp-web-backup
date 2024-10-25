<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick" :lazy="true">
      <el-tab-pane label="待签收" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="handleAllSigned">批量签收</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table 
          ref="tableRef" 
          stripe border 
          :data="list"
          :header-cell-style="{ 'text-align': 'center' }"
          class="noneHoveTable"
          :cell-style="cellStyle"
          @cell-click="changeInput"
          @selection-change="setSelectRows"
          :cell-class-name="getCellClass"
        >
          <el-table-column fixed="left" label="仓库操作" width="110" >
            <template #default="{ row, $index }">
              <el-dropdown>
                <el-button text type="primary" >
                  签收
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" >签收</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" @click="modifyPendingVisible = true">修改</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" >打印</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column type="selection" fixed="left"></el-table-column>
          <el-table-column label="外发" prop="outsourced" min-width="60">
              <template #default = "{ row }">
                  <el-checkbox v-model="row.outsourced" :true-value="1" :false-value="0" class="custom-checkbox" disabled />
              </template>
          </el-table-column>
          <el-table-column label="PO" min-width="100" prop="po"></el-table-column>
          <el-table-column label="零件图片" class="image-wall" width="82">
            <template #header>
              零件<br>图片
            </template>
            <template #default="{ row, $index }">
              <el-image :src="row.componentUrl" data-img="img" fit="contain" style="width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" min-width="250"></el-table-column>
          <el-table-column label="签收数量" min-width="100" prop="signCount" ></el-table-column>
          <el-table-column label="零件数量" min-width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="单位" min-width="60" prop="unit" ></el-table-column>
          <el-table-column label="收货仓库" min-width="120" prop="repositoryName" ></el-table-column>
          <el-table-column label="PO日期" prop="poDate" min-width="115">
            <template #default="{ row }">
              {{ row.poDate ? row.poDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column label="付款日期" prop="payDate" min-width="115">
            <template #default="{ row }">
              {{ row.payDate ? row.payDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column label="SKU图片" class="image-wall" width="82">
            <template #header>
              SKU<br>图片
            </template>
            <template #default="{ row, $index }">
              <el-image :src="row.skuImageUrl" data-img="img" fit="contain" style="width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" min-width="160"></el-table-column>    
          <el-table-column label="剩余可售" prop="sellableDay" min-width="100"></el-table-column>
          <el-table-column  label="供应商" min-width="250" prop="suppliserName"></el-table-column>
          <el-table-column label="站点" prop="site" min-width="100">
            <template #default="{ row }">
              {{ siteMap[row.site as siteValue] }}
            </template>
          </el-table-column>
          <el-table-column label="生产完成日期" prop="produceCompletionDate" min-width="170">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.produceCompletionDate"
                type="date"
                placeholder="请选择日期"
                size="large"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column label="跟单日志" prop="log" min-width="250">
              <template #default="{ row }">
                  <span class="overflow-text">{{ removeHtmlTags(row.log) }}</span>
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
      </el-tab-pane>
      <el-tab-pane label="已签收" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="handleShowReceiptExport">入库单导出</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table 
          ref="tableRef" 
          stripe border 
          :data="list"
          :header-cell-style="{ 'text-align': 'center' }"
          class="noneHoveTable"
          :cell-style="cellStyle2"
          @cell-click="changeInput"
          :cell-class-name="getCellClass2"
        >
          <el-table-column label="签收日期" prop="signDate" min-width="115">
            <template #default="{ row }">
              {{ row.signDate ? row.signDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column label="外发" prop="outsourced" min-width="60">
              <template #default = "{ row }">
                  <el-checkbox v-model="row.outsourced" :true-value="1" :false-value="0" class="custom-checkbox" disabled />
              </template>
          </el-table-column>
          <el-table-column label="PO" min-width="100" prop="po"></el-table-column>
          <el-table-column label="零件图片" min-width="82">
            <template #header>
              零件<br>图片
            </template>
            <template #default="{ row, $index }">
                <el-image :src="row.componentUrl" fit="contain" data-img="img" style="width: 100%; height: 100%">
                  <template #error>
                    <el-icon></el-icon>
                  </template>
                </el-image>
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" min-width="250"></el-table-column>
          <el-table-column label="零件数量" min-width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="单位" min-width="60" prop="unit" ></el-table-column>
          <el-table-column label="收货仓库" min-width="120" prop="repositoryName" ></el-table-column>
          <el-table-column label="签收物流单号" width="130" prop="" ></el-table-column>
          <el-table-column label="PO日期" prop="poDate" min-width="115">
            <template #default="{ row }">
              {{ row.poDate ? row.poDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column label="付款日期" prop="payDate" min-width="115">
            <template #default="{ row }">
              {{ row.payDate ? row.payDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column label="SKU图片" class="image-wall" width="82">
            <template #header>
              SKU<br>图片
            </template>
            <template #default="{ row, $index }">
              <el-image :src="row.skuImageUrl" fit="contain" data-img="img" style="width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" min-width="160"></el-table-column>
          <el-table-column  label="供应商" min-width="250" prop="suppliserName"></el-table-column>
          <el-table-column label="站点" prop="site" min-width="100">
            <template #default="{ row }">
              {{ siteMap[row.site as siteValue] }}
            </template>
          </el-table-column>  
          <el-table-column label="生产完成日期" prop="produceCompletionDate" min-width="170">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.produceCompletionDate"
                type="date"
                placeholder="请选择日期"
                size="large"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column label="跟单日志" prop="log" min-width="250">
              <template #default="{ row }">
                <span class="overflow-text">{{ removeHtmlTags(row.log) }}</span>
              </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" >
            <template #default="{ row, $index }">
              <el-dropdown>
                <el-button text type="primary" >
                  打印面单
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" >打印面单</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" @click="modifyVisible = true">修改</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="danger" :underline="false" >取消签收</el-link>
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
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer @close="imagePreviewClose" :url-list="imagePreviewList" v-if ="imagePreviewVisible" hide-on-click-modal />
    <wangEditor
      :title="wangEditorTitle"
      :wangEditorVisible="wangEditorLogVisible"
      :content="progressLogCopy"
      @clickChild="clickLog"
      @clickBoolean="clickLogBool"
      :classify="classify"
    >
    </wangEditor>
    <!-- 待签收修改 -->
    <vab-dialog
      title="修改"
      width="40%"
      v-model="modifyPendingVisible"
      @close="closeModifyPendingDialog"
    >
      <el-table
        border
        :data="fakeModify"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="cellStyle3"
        @cell-click="changeModifyInput"
      >
        <el-table-column label="签收日期" prop="signedDate"></el-table-column>
        <el-table-column label="签收数量" prop="quantity">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.quantity" clearable @blur="clickModifyCancel($event, row)" />
            </div>
            <span>{{ row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单号" prop="number">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.number" clearable @blur="clickModifyCancel($event, row)" />
            </div>
            <span>{{ row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button text type="danger">删除并取消签收</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="closeModifyPendingDialog">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 已签收修改 -->
    <vab-dialog
      title="修改"
      width="40%"
      v-model="modifyVisible"
      @close="closeModifyDialog"
    >
      <el-table
        border
        :data="fakeModify"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="cellStyle4"
        @cell-click="changeModifyInput"
      >
        <el-table-column label="签收日期" prop="signedDate"></el-table-column>
        <el-table-column label="签收数量" prop="quantity"></el-table-column>
        <el-table-column label="单号" prop="number">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.number" clearable @blur="clickModifyCancel($event, row)" />
            </div>
            <span>{{ row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button text type="danger">删除并取消签收</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="closeModifyDialog">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 入库单导出 -->
    <vab-dialog
      title="入库单导出"
      width="25%"
      v-model="receiptExportVisible"
      @close="closeReceiptExport"
    >
      <el-form ref="receiptExportFormRef" :model="receiptExportForm">
        <el-form-item label="日期" label-width="70px" prop="date">
          <el-date-picker 
            v-model="receiptExportForm.date" 
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
        <el-button @click="closeReceiptExport">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>
  
<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import type { FormInstance, TableInstance, TabsPaneContext } from 'element-plus'
import { ref } from 'vue'
import { getPoPurchaseMatters, updatePoPurchaseMatters } from '/@/api/devlocal/purchasePo'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { IGetPlanPoList, IGetPlanPoListQuery } from '/@/type/purchase/po'
import { getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
import wangEditor from '/@/views/newProductDevelopment/newProductProgress/wangEditor.vue'
import { getSignList } from '/@/api/devlocal/packagingShipping'
import { IGetSignList } from '/@/type/packagingShipping/packagingType'
import { siteMap, siteValue } from '../constantOption'

defineOptions({
  name: 'pendingReceiptTable',
})

const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta, addVisitedRoute } = tabsStore
const editRef = ref<any>(null)

const selectRows = ref<any>([])
const setSelectRows = (value: string) => {
  selectRows.value = value
}
const list = ref<IGetSignList[]>([])
const activeName = ref<number>(0)
const tableRef = ref<TableInstance>()
const listLoading = ref<boolean>(true)
// 修改弹窗是否可见
const modifyVisible = ref<boolean>(false)
// 待签收弹窗是否可见
const modifyPendingVisible = ref<boolean>(false)
// 关闭修改弹窗
const closeModifyDialog = () => {
  modifyVisible.value = false
}
// 关闭修改弹窗
const closeModifyPendingDialog = () => {
  modifyPendingVisible.value = false
}

const fakeModify = [
  {
    signedDate: '2024-10-02',
    quantity: 50,
    number: 'SF1111111'
  },
  {
    signedDate: '2024-10-04',
    quantity: 50,
    number: 'SF1111112'
  },
  {
    signedDate: '2024-10-02',
    quantity: 50,
    number: 'SF1111111'
  },
]
// 入库单导出表单
const receiptExportForm = reactive<any>({
  date: ''
})

const receiptExportFormRef = ref<FormInstance>()
// 入库单导出是否可见
const receiptExportVisible = ref<boolean>(false)
// 打开入库单导出弹窗
const handleShowReceiptExport = () => {
  receiptExportVisible.value = true
}
const closeReceiptExport = () => {
  receiptExportFormRef.value?.resetFields()
  receiptExportVisible.value = false
}
// 批量签收
const handleAllSigned = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning')
  }
}
const fakeData = [
  {
    po: 'PO19627',
    createTime: '2024-10-14',
    sku: 'HOM-0020-WHT碗架-木把手白色',
    siteName: '亚马逊美国US',
    skuImageUrl: 'https://picsum.photos/200'
  },
  {
    po: 'PO19627',
    createTime: '2024-10-14',
    sku: 'HOM-0020-WHT碗架-木把手白色',
    siteName: '亚马逊美国US',
    skuImageUrl: 'https://picsum.photos/200'
  },
  {
    po: 'PO19627',
    createTime: '2024-10-14',
    sku: 'HOM-0020-WHT碗架-木把手白色',
    siteName: '亚马逊美国US',
    skuImageUrl: 'https://picsum.photos/200'
  },
]
// 采购计划列表
let plannedPoList = ref<IGetPlanPoList[]>([])
// 总记录数
const total = ref<number>(0)
const queryForm = reactive<IGetPlanPoListQuery>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
  status: 0, //0待签收 1签收
})
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}







  
// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 点击日志弹出富文本框是否显示
const wangEditorLogVisible = ref<boolean>(false)
const progressLogCopy = ref<string | undefined>('')
const classify = ref<string>('')


// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
  
const handleTabClick = (tab: TabsPaneContext, event: Event) => {
  plannedPoList.value = []
  if (tab.props.name !== undefined) {
    // activeName.value = tab.props.name;
    queryForm.status = Number(tab.props.name);  
  }
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

  
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  if (data.columnIndex !== 5 && data.columnIndex !== 9 && data.columnIndex !== 13 && data.columnIndex !== 15) {
    return {
      textAlign:'center'
    } 
  }
}
const cellStyle2 = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  if (data.columnIndex !== 4 && data.columnIndex !== 7 && data.columnIndex !== 12 && data.columnIndex !== 13) {
    return {
      textAlign:'center'
    } 
  }
}
const cellStyle3 = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): any => {
  if (data.columnIndex === 0) {
    return {
      textAlign: 'center',
      color: '#bbb',
      cursor: 'not-allowed'
    }
  }
  return {
    textAlign: 'center'
  }
}
const cellStyle4 = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): any => {
  if (data.columnIndex === 0 || data.columnIndex === 1) {
    return {
      textAlign: 'center',
      color: '#bbb',
      cursor: 'not-allowed'
    }
  }
  return {
    textAlign: 'center'
  }
}
/**
 * 当点击时切换输入框，修改输入
 */
const clickRow = ref<any>() // 当点击零件采购注意事项时候的行
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 

  // 处理图片放大预览
  let el = getSpecificChildren(cell, "img")[0];
  if (getDataAttribute(el, 'img') && getSpecificChildren(cell, "img")[0]) {
    imagePreviewVisible.value = true
    imagePreviewList.value = []
    imagePreviewList.value.push(el.src!)
  }

  if (!cell.children[0].children[0]
      || !cell.children[0].children[1]
      || !cell.children[0].children[0].classList
      || !cell.children[0].children[1].classList) {
    return
  }

  if (column.property == 'purchaseMatters') {
    clickRow.value = row
    const { data } = await getPoPurchaseMatters({ id: row.componentId })
    progressLogCopy.value = data
    row.purchaseMatters = data
    wangEditorTitle.value = '编辑零件采购注意事项'
    classify.value = 'purchaseMatters'
    wangEditorLogVisible.value = !wangEditorLogVisible.value
  } else {
    cell.children[0].children[0].classList.remove('none')
    cell.children[0].children[1].classList.add('none')
  }

  // 自动聚焦
  const inputElement = getSpecificChildren(cell, "input")[0];
  if (inputElement) {
    inputElement.focus()
    inputElement.select()
  } else {
    const textareaElement = getSpecificChildren(cell, "textarea")[0];
    if (textareaElement){
      textareaElement.focus()
      textareaElement.select()
    }
  }
}
/**
 * 当点击修改时切换输入框，修改输入
 */
const changeModifyInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  if (!cell.children[0].children[0]
      || !cell.children[0].children[1]
      || !cell.children[0].children[0].classList
      || !cell.children[0].children[1].classList) {
    return
  }
  cell.children[0].children[0].classList.remove('none')
  cell.children[0].children[1].classList.add('none')
  // 自动聚焦
  const inputElement = getSpecificChildren(cell, "input")[0];
  if (inputElement) {
    inputElement.focus()
    inputElement.select()
  }
}
const clickModifyCancel = async (event: any, value: any) =>{
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
 * 输入失焦事件
 */
const clickCancel = async (event: any, value: any) =>{

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
  const { data } = await updatePoPurchaseMatters({ id: clickRow.value.componentId, purchaseMatters: val})
  if (data === true) {
    progressLogCopy.value = val
    clickRow.value.purchaseMatters = val
  }
  
}
/**
 * 当点击取消，确认时，子组件传递给父组件 false
 */
const clickLogBool = ( val: any) => {
  wangEditorLogVisible.value = val
}
// 去掉 HTML 标签并显示纯文本的方法
const removeHtmlTags = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getSignList(queryForm)
  if (data) {
    list.value = data.list!
    total.value = data.total!
  }
  listLoading.value = false
}
const getCellClass = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 4 || data.columnIndex === 12) {
    return 'clear-padding'
  }
  return ''
}
const getCellClass2 = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 3 || data.columnIndex === 11) {
    return 'clear-padding'
  }
  return ''
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
          .el-table__body {
            .cell {
              max-height: 81.2px;
            }
          }
          .clear-padding {
            padding-top: 0px;
            padding-bottom: 0px;
          }
          .clear-padding .cell {
            padding-left: 0px;
            padding-right: 0px;
          }
        }
      }
      .el-checkbox {
        transform: scale(1.2); // 放大 20%
        transform-origin: center; // 确保放大从中心开始
      }
     
    }
  }
}
// 控制编辑框显示与隐藏
.none {
  display: none;
}
// /* 取消没有条纹的行的悬停背景色 */
// :deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
//   background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
// }

// /* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
// :deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
//   background-color: #fafafa !important; /* 保持原有条纹颜色 */
// }
</style>
  
