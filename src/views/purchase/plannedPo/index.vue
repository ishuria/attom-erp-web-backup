<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick" :lazy="true">
      <el-tab-pane label="待发布" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel >
            <el-button type="primary" @click="handlePlannedPoCreate">创建</el-button>
            <el-button type="success" @click="handleAllPublishPo">批量发布</el-button>
            <el-button type="warning" @click="handleAllMOQ">批量未达MOQ</el-button>
            <el-button type="danger" @click="handleAllDelete">批量删除</el-button>
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
          border 
          :data="plannedPoList"
          :header-cell-style="{ 'text-align': 'center' }"
          class="noneHoveTable"
          :cell-style="cellStyle"
          :span-method="objectSpanMethod"
          @cell-click="changeInput"
          @selection-change="setSelectRows"
          :cell-class-name="getCellClass"
        >
          <el-table-column type="selection" class="custom-checkbox" fixed="left"></el-table-column>
          <el-table-column fixed="left" label="PO操作" width="150" >
            <template #default="{ row, $index }">
              <el-dropdown>
                <el-button text type="primary" @click="handlePublishPo(row)">
                  发布PO
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" @click="handlePublishPo(row)">发布PO</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" @click="handleUpdateStatus(row)">未达起订量</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="danger" :underline="false" @click="handleDelPlannedPo(row)">删除</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column label="创建日期" prop="createTime" min-width="115">
            <template #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="请购人" prop="userName"></el-table-column>
          <el-table-column label="站点" prop="siteName" min-width="125"></el-table-column>
          <el-table-column label="SKU图片" width="82">
            <template #header>
              SKU<br>图片
            </template>
            <template #default="{ row, $index }">
              <el-image :src="row.skuImageUrl" data-img="img" style="width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" width="150"></el-table-column>   
          <el-table-column label="数量" width="60" prop="purchaseSkuNumber" ></el-table-column>
          <el-table-column label="零件名" prop="componentName" width="250"></el-table-column>
          <el-table-column label="零件数量" width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="单位" width="60" prop="unit" ></el-table-column>
          <el-table-column label="含税价" prop="taxIncludedPrice" min-width="80"></el-table-column>    
          <el-table-column label="货币" width="105px" prop="currency">
            <template #default="{ row }">
              {{ currencyMap[row.currency as CurrencyCode] }}
            </template>
          </el-table-column>
          <el-table-column  label="供应商" min-width="250" prop="suppliser"></el-table-column>
          <el-table-column  label="采购方" min-width="100" prop="purchase"></el-table-column>
          <el-table-column label="不报关" prop="customsDeclarationStatus" min-width="75">
              <template #default = "{ row }">
                  <el-checkbox v-model="row.declareCustomsStatus" :true-value="1" :false-value="0" class="custom-checkbox" disabled/>
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
              <el-space>
                <el-button link type="primary" @click="handlePlannedPoDetail(row)">详情</el-button>
                <el-button link type="danger" @click="handleDelSkuPlannedPo(row)">删除</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="未达起订量" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="danger" @click="handleAllDelete">批量删除</el-button>
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
          ref="tableRef2"
          border 
          :data="plannedPoList"
          :header-cell-style="{ 'text-align': 'center' }"
          class="noneHoveTable"
          :cell-style="cellStyle"
          :span-method="objectSpanMethod"
          @cell-click="changeInput"
          @selection-change="setSelectRows"
          :cell-class-name="getCellClass"
        >
          <el-table-column type="selection" class="custom-checkbox" fixed="left"></el-table-column>
          <el-table-column fixed="left" label="PO操作" width="150" >
            <template #default="{ row, $index }">
              <el-dropdown>
                <el-button text type="primary" @click="handlePublishPo(row)">
                  发布PO
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" @click="handlePublishPo(row)">发布PO</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" @click="handleUpdateStatus(row)">达到起订量</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="danger" :underline="false" @click="handleDelPlannedPo(row)">删除</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column label="创建日期" prop="createTime" min-width="115">
            <template #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="请购人" prop="userName"></el-table-column>
          <el-table-column label="站点" prop="siteName" min-width="125"></el-table-column>
          <el-table-column label="SKU图片" width="82">
            <template #header>
              SKU<br>图片
            </template>
            <template #default="{ row, $index }">
              <el-image :src="row.skuImageUrl" data-img="img" style="width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" width="150"></el-table-column>   
          <el-table-column label="数量" width="60" prop="purchaseSkuNumber" ></el-table-column>
          <el-table-column label="零件名" prop="componentName" width="250"></el-table-column>
          <el-table-column label="零件数量" width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="单位" width="60" prop="unit" ></el-table-column>
          <el-table-column label="含税价" prop="taxIncludedPrice" min-width="80"></el-table-column>    
          <el-table-column label="货币" width="105px" prop="currency">
            <template #default="{ row }">
              {{ currencyMap[row.currency as CurrencyCode] }}
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="250" prop="suppliser"></el-table-column>
          <el-table-column label="采购方" min-width="100" prop="purchase"></el-table-column>
          <el-table-column label="不报关" prop="customsDeclarationStatus" min-width="75">
              <template #default = "{ row }">
                  <el-checkbox v-model="row.declareCustomsStatus" :true-value="1" :false-value="0" class="custom-checkbox" disabled/>
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
              <el-space>
                <el-button link type="primary" @click="handlePlannedPoDetail(row)">详情</el-button>
                <el-button link type="danger" @click="handleDelSkuPlannedPo(row)">删除</el-button>
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
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer @close="imagePreviewClose" :url-list="imagePreviewList" v-if ="imagePreviewVisible" hide-on-click-modal/>
    <wangEditor
      :title="wangEditorTitle"
      :wangEditorVisible="wangEditorLogVisible"
      :content="progressLogCopy"
      @clickChild="clickLog"
      @clickBoolean="clickLogBool"
      :classify="classify"
    >
    </wangEditor>
  </div>
</template>
  
<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import type { TableInstance, TabsPaneContext } from 'element-plus'
import { ref } from 'vue'
import { deleteAllPlanPo, deletePlanPo, deletePoSku, getPlanPoList, getPoPurchaseMatters, releaseBatchPlanPo, releasePlanPo, updatePlanPoStatus, updatePoPurchaseMatters } from '/@/api/devlocal/purchasePo'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { IGetPlanPoList, IGetPlanPoListQuery } from '/@/type/purchase/po'
import { getDataAttribute, getSpecificChildren } from '/@/utils/nodeUtils'
import wangEditor from '/@/views/newProductDevelopment/newProductProgress/wangEditor.vue'
import { CurrencyCode, currencyMap } from '/@/views/purchase/constantOption'

defineOptions({
  name: 'PlannedPoTable',
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
const tableRef2 = ref<TableInstance>()
const listLoading = ref<boolean>(true)
// 采购计划列表
let plannedPoList = ref<IGetPlanPoList[]>([])
// 总记录数
const total = ref<number>(0)
const queryForm = reactive<IGetPlanPoListQuery>({
  pageNo: 1,
  pageSize: 50,
  keyWord: '',
  status: 0, //po状态 0待发布 1未达起订量
})
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const getCellClass = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 5) {
    return 'clear-padding'
  }
  return ''
}
//采购计划col合并方法
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  let rowspan = 1; // 默认不跨行

  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
    const id = row.id;

    // 遍历后面的行，检查相同的 PO ID
    for (let i = rowIndex + 1; i < plannedPoList.value.length; i++) {
      if (plannedPoList.value[i].id === id) {
        rowspan++;
      } else {
        break;
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || plannedPoList.value[rowIndex - 1].id !== id
      ? { rowspan, colspan: 1 }
      : { rowspan: 0, colspan: 0 };
  }

  // 合并 SKU 行
  if (columnIndex === 5 || columnIndex === 6 || columnIndex === 7 || columnIndex === 17) {
    const poSkuId = row.poSkuId;

    // 遍历后面的行，检查相同的 SKU ID
    for (let i = rowIndex + 1; i < plannedPoList.value.length; i++) {
      if (plannedPoList.value[i].poSkuId === poSkuId && plannedPoList.value[i].id === row.id) {
        rowspan++;
      } else {
        break;
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || plannedPoList.value[rowIndex - 1].poSkuId !== poSkuId || plannedPoList.value[rowIndex - 1].id !== row.id
      ? { rowspan, colspan: 1 }
      : { rowspan: 0, colspan: 0 };
  }

  // 对于其他列，默认返回不合并
  return { rowspan: 1, colspan: 1 };
}

// let previous: any = null; 
// let currentGroupIndex = 0; // 当前组索引

// const stripedRowClass = (_row: any) => {
//   const { row } = _row;
//   const currentId = row.id;
//   // 检查当前行是否与上一行不同
//   if (currentId !== previous) {
//     previous = currentId; 
//     currentGroupIndex++; 
//   }
//   // 根据当前组索引设置条纹样式
//   return currentGroupIndex % 2 === 0 ? 'el-table__row--striped' : '';
// };
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
        fetchData()
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
        const { data } = await deleteAllPlanPo({ids: ids})
        if (data === true) {
          $baseMessage('批量删除PO成功', 'success', 'hey');
          fetchData()
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
        fetchData()
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
        fetchData()
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
        fetchData()
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
        fetchData()
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
  const scrollBarRef: any = tableRef.value!.$refs.scrollBarRef;
  const scrollBarRef2: any = tableRef2.value!.$refs.scrollBarRef;
  const wrapRef = scrollBarRef.wrapRef
  const wrapRef2 = scrollBarRef2.wrapRef
  const plannedPoStatus = {
    scrollTop: wrapRef.scrollTop,
    scrollTop2: wrapRef2.scrollTop,
    pageNo: queryForm.pageNo,
    pageSize: queryForm.pageSize,
    keyWord: queryForm.keyWord,
    activeName: activeName.value
  }

  sessionStorage.setItem('plannedPoStatus', JSON.stringify(plannedPoStatus))
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
  activeName.value = queryForm.status
  fetchData()
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  if (data.columnIndex !== 6 && data.columnIndex !== 8 && data.columnIndex !== 13 && data.columnIndex !== 16) {
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
  try {
    listLoading.value = true
    const { data } = await getPlanPoList(queryForm)
    if (data) {
      listLoading.value = false
      total.value = data.total
      plannedPoList.value = data.list
    }
  } catch (error) {
    console.error(error)
  }
}  
onActivated(() => { 
  tableRef.value?.doLayout()
})
onBeforeMount(() => {
  const savedStatus = JSON.parse(sessionStorage.getItem('plannedPoStatus') || '{}')
  const pageNo = savedStatus.pageNo
  const pageSize = savedStatus.pageSize
  const keyWord = savedStatus.keyWord
  
  if (pageNo && pageSize) {
    Object.assign(queryForm, {
      pageNo: pageNo,
      pageSize: pageSize,
      keyWord: keyWord
    });
  }
  const _activeName = savedStatus.activeName
  if (_activeName) {
    activeName.value = _activeName
    queryForm.status = _activeName
  }
  fetchData()
})
const setScrollPosition = (scrollBarPosition: number, tableRef: any) => {
  if (scrollBarPosition) {
    const scrollBarRef: any = tableRef.value!.$refs.scrollBarRef;
    const wrapRef = scrollBarRef.wrapRef
    setTimeout(() => {
      wrapRef.scrollTop = scrollBarPosition;
    }, 50)
  }
}
onMounted(() => {
  nextTick(() => {
    const savedStatus = JSON.parse(sessionStorage.getItem('plannedPoStatus') || '{}')
    const scrollBarPosition = savedStatus.scrollTop
    const scrollBarPosition2 = savedStatus.scrollTop2
    if (scrollBarPosition) {
      setScrollPosition(scrollBarPosition, tableRef)
    }
    if (scrollBarPosition2) {
      setScrollPosition(scrollBarPosition2, tableRef2)
    }
  });
});

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

:deep(.shareSelectDialog .el-dialog__body) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.el-table :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.el-table :deep(.clear-padding .cell) {
  padding-left: 0;
  padding-right: 0;
}
</style>
  