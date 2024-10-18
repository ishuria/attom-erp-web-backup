<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick" :lazy="true">
      <el-tab-pane label="已到货" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-space>
              <el-button type="primary">当前任务加人</el-button>
              <el-button type="primary">下班人员</el-button>
              <el-button type="primary">开始任务</el-button>
              <el-button type="primary">结束任务</el-button>
              <el-button type="primary">工作量预估</el-button>
              
              <span>站点</span>
              <el-select placeholder="请选择站点" @change="">
                  <!-- <el-option v-for="dict in replenishmentSiteColumns" :key="dict.value"
                      :value="dict.value" :label="dict.label"></el-option> -->
              </el-select>
            </el-space>
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
          :data="fakeData"
          :header-cell-style="{ 'text-align': 'center' }"
          class="noneHoveTable"
          :cell-style="cellStyle"
          @cell-click="changeInput"
          @selection-change="setSelectRows"
        >
          <el-table-column type="selection" fixed="left"></el-table-column>
          <el-table-column label="发货日期" prop="createTime" min-width="115">
            <template #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="PO" min-width="100" prop="po"></el-table-column>
          <el-table-column label="订单总数" prop="createTime" min-width="115"></el-table-column>
          <el-table-column label="站点" prop="siteName" min-width="140"></el-table-column>
          <el-table-column label="产品图片" class="image-wall" min-width="100">
              <template #default="{ row, $index }">
                  <el-image :src="row.skuImageUrl" data-img="img">
                    <template #error>
                      <el-icon></el-icon>
                    </template>
                  </el-image>
              </template>
          </el-table-column>
          <el-table-column label="SKU" prop="taxIncludedPrice" min-width="180"></el-table-column>   
          <el-table-column prop="isPriorityPacking" label="优先打包" min-width="100">
          </el-table-column>
          <el-table-column label="任务数" width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="推荐数量" width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="已装箱数" width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="清点质检" prop="qualityInspection"> 
            <template #default="{ row }">
              <el-switch v-model="row.qualityInspection" :active-value="1" :inactive-value="0" @change="" style="--el-switch-on-color: #13ce66;">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="实际完成数量" width="130" prop="unit" ></el-table-column>
          <el-table-column label="打包注意事项" prop="purchaseMatters" min-width="250">
              <template #default="{ row }">
                  <div class="none">
                      <el-input type="text" v-model="row.purchaseMatters"  />
                  </div>
                  <span class="overflow-text">{{ removeHtmlTags(row.purchaseMatters) }}</span>
              </template>
          </el-table-column>    
          <el-table-column  label="产品经理" min-width="100" prop="suppliser"></el-table-column>
          <el-table-column fixed="right" label="操作" width="150" >
            <template #default="{ row, $index }">
              <el-dropdown>
                <el-button text type="primary" @click="handleShowPartsList">
                  零件清单
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" @click="handleShowPartsList">零件清单</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" @click="handleShowQualityInspectionReport">质检报告</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" >生成条形码</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" >条形码文件夹</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" >尺寸录入</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" >拆分</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" >拆分数修改</el-link>
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
      <el-tab-pane label="零头" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary">入库单导出</el-button>
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
          :data="fakeData"
          :header-cell-style="{ 'text-align': 'center' }"
          class="noneHoveTable"
          :cell-style="cellStyle2"
          @cell-click="changeInput"
        >
          <el-table-column label="签收日期" prop="createTime" min-width="115">
            <template #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="PO" min-width="100" prop="po"></el-table-column>
          <el-table-column label="PO日期" prop="createTime" min-width="115">
            <template #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="付款日期" prop="createTime" min-width="115">
            <template #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="SKU图片" class="image-wall" min-width="100">
              <template #default="{ row, $index }">
                  <el-image :src="row.skuImageUrl" data-img="img">
                    <template #error>
                      <el-icon></el-icon>
                    </template>
                  </el-image>
              </template>
          </el-table-column>
          <el-table-column label="SKU" prop="taxIncludedPrice" min-width="150"></el-table-column>
          <el-table-column label="站点" prop="siteName" min-width="140"></el-table-column>  
          <el-table-column label="零件图片" class="image-wall" min-width="100">
              <template #default="{ row, $index }">
                  <el-image :src="row.skuImageUrl" data-img="img">
                    <template #error>
                      <el-icon></el-icon>
                    </template>
                  </el-image>
              </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" width="250"></el-table-column>
          <el-table-column label="签收数量" prop="userName" min-width="100"></el-table-column>
          <el-table-column label="零件数量" width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="单位" width="60" prop="unit" ></el-table-column>
          <el-table-column label="收货仓库" width="120" prop="unit" ></el-table-column>
          <el-table-column  label="供应商" min-width="250" prop="suppliser"></el-table-column>
          <el-table-column label="生产完成日期" prop="createTime" min-width="140">
            <template #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="跟单内容" prop="purchaseMatters" min-width="150">
              <template #default="{ row }">
                  <div class="none">
                      <el-input type="text" v-model="row.purchaseMatters"  />
                  </div>
                  <span class="overflow-text">{{ removeHtmlTags(row.purchaseMatters) }}</span>
              </template>
          </el-table-column>
          <el-table-column label="跟单日期" prop="createTime" min-width="115">
            <template #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="日志" prop="purchaseMatters" min-width="250">
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
                      <el-link type="primary" :underline="false" >修改</el-link>
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
      <el-tab-pane label="售后" :name="2"></el-tab-pane>
      <el-tab-pane label="未到货" :name="3"></el-tab-pane>
    </el-tabs>
    <el-image-viewer @close="imagePreviewClose" :url-list="imagePreviewList" v-if ="imagePreviewVisible"/>
    <wangEditor
      :title="wangEditorTitle"
      :wangEditorVisible="wangEditorLogVisible"
      :content="progressLogCopy"
      @clickChild="clickLog"
      @clickBoolean="clickLogBool"
      :classify="classify"
    >
    </wangEditor>
    <!-- 零件清单 -->
    <vab-dialog
      title="每套SKU包含的零配件清单"
      v-model="dialogPartsListTableVisible"
      width="650px"
    >
      <el-table
        border stripe
        :data="fakePartsList"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="partsListCellStyle"
        max-height="500px"
      >
        <el-table-column label="零件ID" prop="id"></el-table-column>
        <el-table-column label="图片" prop="img">
          <template #default="{ row }">
            <el-image :src="row.url">
              <template #error>
                <el-icon></el-icon>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="零件名" prop="componentName"></el-table-column>
        <el-table-column label="数量" prop="quantity"></el-table-column>
        <el-table-column label="单位" prop="unit"></el-table-column>
        <el-table-column label="收货仓库" prop="repository" min-width="100"></el-table-column>
        <el-table-column label="签收日期" prop="signTime" min-width="120"></el-table-column>
      </el-table>
      <template #footer>
        <el-button type="danger" @click="closePartsList">取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 质检报告 -->
    <vab-dialog
      title="质检报告"
      v-model="qualityInspectionReportVisible"
      width="650px"
    >
      <el-form label-position="left" label-width="auto">
        <el-form-item label="SKU" prop="sku" >
          <el-input disabled />
        </el-form-item>
        <el-form-item label="产品名称" prop="productName" >
          <el-input disabled />
        </el-form-item>
        <el-form-item label="包装尺寸(cm)" prop="productName" inline>
          <el-input/> × <el-input/> × <el-input/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="danger" @click="closePartsList">取消</el-button>
        <el-button type="primary">保存</el-button>
      </template>
    </vab-dialog>
  </div>
</template>
  
<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import type { TableInstance, TabsPaneContext } from 'element-plus'
import { ref } from 'vue'
import { deleteAllPlanPo, deletePlanPo, deletePoSku, getPoPurchaseMatters, releaseBatchPlanPo, releasePlanPo, updatePlanPoStatus, updatePoPurchaseMatters } from '/@/api/devlocal/purchasePo'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { IGetPlanPoList, IGetPlanPoListQuery } from '/@/type/purchase/po'
import { getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
import wangEditor from '/@/views/newProductDevelopment/newProductProgress/wangEditor.vue'

defineOptions({
  name: 'packingTaskTable',
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
const activeName = ref<number>(0)
const tableRef = ref<TableInstance>()
const listLoading = ref<boolean>(true)
const fakeData = [
  {
    po: 'PO19627',
    createTime: '2024-10-14',
    sku: 'HOM-0020-WHT碗架-木把手白色',
    siteName: '亚马逊美国US'
  }
]
const fakePartsList = [
  {
    componentName: '1'
  },
  {
    componentName: '1'
  },
  {
    componentName: '1'
  },
  {
    componentName: '1'
  },
  {
    componentName: '1'
  },
  {
    componentName: '1'
  },
  {
    componentName: '1'
  },
  {
    componentName: '1'
  },
  {
    componentName: '1'
  },
  {
    componentName: '1'
  },
  {
    componentName: '1'
  },
  {
    componentName: '1'
  },
  {
    componentName: '1'
  },
  {
    componentName: '1'
  },
  {
    componentName: '1'
  },
  {
    componentName: '1'
  },
]
// 零件清单表格是否可见
const dialogPartsListTableVisible = ref<boolean>(false)
// 质检报告是否可见
const qualityInspectionReportVisible = ref<boolean>(false)
// 展示零件清单
const handleShowPartsList = () => {
  dialogPartsListTableVisible.value = true
}
// 关闭零件清单
const closePartsList = () => {
  dialogPartsListTableVisible.value = false
}
// 零件清单cellStyle
const partsListCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): any => {
  if (data.columnIndex !== 2) {
    return {
      textAlign: 'center'
    }
  }
}
// 展示质检报告
const handleShowQualityInspectionReport = () => {
  qualityInspectionReportVisible.value = true
}



// 采购计划列表
let plannedPoList = ref<IGetPlanPoList[]>([])
// 总记录数
const total = ref<number>(0)
const queryForm = reactive<IGetPlanPoListQuery>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
  status: 0, //po状态 0待发布 1未达起订量
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



//
// 处理未达起订量
const handleUpdateStatus = async (row: any) => {
  try {
    $baseConfirm('确定该条PO未达起订量吗', null, async () => {
      const { data } = await updatePlanPoStatus({
        id: row.id
      })
      if (data === true) {
        $baseMessage('该条PO未达起订量成功', 'success', 'hey')
        // fetchData()
      }
    })
  } catch (error) {
    console.error(error)
  }
}
const handleAllMOQ = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning', 'hey')
  } else {

      $baseMessage('批量处理成功', 'success', 'hey')
 
  }
}
// 批量删除
const handleAllDelete = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning', 'hey');
  } else {
    $baseConfirm('确定要批量删除所选PO吗', null, async () => {
      const ids = selectRows.value.map((item: any) => item.id).join(','); // 组合 ID
      try {
        const { data } = await deleteAllPlanPo(ids)
        if (data === true) {
          $baseMessage('批量删除PO成功', 'success', 'hey');
          // fetchData()
        }
      } catch (error) {
        console.error(error)
      }
    });
  }
}
// 删除SKU
const handleDelSkuPlannedPo = (row: any) => {
  try {
    $baseConfirm('确定要删除当前SKU吗', '系统提示', async () => {
      const { data } = await deletePoSku({
        poSkuId: row.poSkuId
      })
      if (data === true) {
        $baseMessage('删除SKU成功', 'success', 'hey')
      }
    })
  } catch (error) {
    console.error(error)
  }
}
// 删除planPO
const handleDelPlannedPo = (row: any) => {
  try {
    $baseConfirm('确定要删除当前PO吗', '系统提示', async () => {
      const { data } = await deletePlanPo({
        poId: row.id
      })
      if (data === true) {
        $baseMessage('删除PO成功', 'success', 'hey')
      }
    })
  } catch (error) {
    console.error(error)
  }
}
// 批量发布PO成功
const handleAllPublishPo = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning', 'hey')
  } else {
    const ids = selectRows.value.map((item: any) => item.id).join(','); // 组合 ID
    try {
      const { data } = await releaseBatchPlanPo({
        poIds: ids
      })
      if (data === true) {
        $baseMessage('批量发布到PO成功', 'success', 'hey')
        // fetchData()
      }
    } catch (error) {
      console.error(error)
    }
  }
}
// 发布po
const handlePublishPo = async (row: any) => {
  try {
    $baseConfirm('确定要发布到PO吗', null, async () => {
      const { data } = await releasePlanPo({
        id: row.id
      })
      if (data === true) {
        $baseMessage('发布到PO成功', 'success', 'hey')
        // fetchData()
      }
    })
  } catch (error) {
    console.error(error)
  }
}
const handlePlannedPoDetail = (row: any) => {
  router.push({
    path: '/purchase/poDetail',
    query: {
      title: "采购计划订单详情",
      from: 'plannedPoDetail',
      poSkuId: row.poSkuId,
      poId: row.id,
      timestamp: Date.now(),
    },
  })
}
const handlePlannedPoCreate = () => {
  router.push({
    path: '/purchase/poDetail',
    query: {
      title: "采购计划创建",
      from: 'plannedPoCreate',
      timestamp: Date.now(),
    },
  })
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
  if (data.columnIndex !== 8 && data.columnIndex !== 11 && data.columnIndex !== 13 && data.columnIndex !== 14) {
    return {
      textAlign:'center'
    } 
  }
}
const cellStyle2 = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  if (data.columnIndex !== 5 && data.columnIndex !== 8 && data.columnIndex !== 12 && data.columnIndex !== 13) {
    return {
      textAlign:'center'
    } 
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
// const fetchData = async () => {
//   try {
//     listLoading.value = true
//     const { data } = await getPlanPoList(queryForm)
//     if (data) {
//       listLoading.value = false
//       total.value = data.total
//       plannedPoList.value = data.list
//     }
//   } catch (error) {
//     console.error(error)
//   }
// }  
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

// 开模申请
:deep(.moldDialog .el-dialog__body) { 
  padding-top: 0;
}

</style>
  

