<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick" :lazy="true">
      <el-tab-pane label="有库存" :name="0">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
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
          :data="list"
          :header-cell-style="{ 'text-align': 'center' }"
          @cell-click="changeInput"
          class="noneHoveTable"
          :cell-style="cellStyle"
          :cell-class-name="getCellClass"
          :span-method="objectSpanMethod"
        >
          <el-table-column label="图片" class="image-wall" width="73">
            <template #default="{ row, $index }">
              <el-image :src="row.componentUrl" fit="contain" style="display: block; width: 100%; height: 100%" data-img="img">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>  
            </template>
          </el-table-column>
          <el-table-column label="零件ID" prop="existingPartsId" width="100"></el-table-column>   
          <el-table-column label="PO" width="100" prop="po" ></el-table-column>
          <el-table-column label="零件名" prop="componentName" width="250"></el-table-column>
          <!-- <el-table-column label="可用SKU" width="250" prop="componentQuantity"></el-table-column> -->
          <el-table-column label="多订总数" width="100" prop="moreCount"></el-table-column>
          <el-table-column label="剩余库存" width="100" prop="residueStock"></el-table-column>
          <el-table-column label="已用库存" prop="useCount" min-width="100"></el-table-column>    
          <el-table-column label="使用的PO" width="105" prop="usePo" ></el-table-column>
          <el-table-column label="单位" width="70" prop="unit" ></el-table-column>
          <el-table-column label="仓库" min-width="250" prop="repositoryName"></el-table-column>
          <el-table-column label="供应商" min-width="250" prop="suppliserName"></el-table-column>
          <el-table-column label="采购方" min-width="100" prop="companyAbbreviation"></el-table-column>
          <el-table-column label="不报关" prop="customsDeclarationStatus" min-width="75">
            <template #default = "{ row }">
              <el-checkbox v-model="row.customsDeclarationStatus" :true-value="1" :false-value="0" class="custom-checkbox" disabled/>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
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
      <el-tab-pane label="已用完" :name="1">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
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
          :data="list"
          :header-cell-style="{ 'text-align': 'center' }"
          @cell-click="changeInput"
          class="noneHoveTable"
          :cell-style="cellStyle"
          :cell-class-name="getCellClass"
          :span-method="objectSpanMethod"
        >  
          <el-table-column label="图片" class="image-wall" width="73">
            <template #default="{ row, $index }">
              <el-image :src="row.componentUrl" fit="contain" style="display: block; width: 100%; height: 100%" data-img="img">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>  
            </template>
          </el-table-column>
          <el-table-column label="零件ID" prop="existingPartsId" width="100"></el-table-column>   
          <el-table-column label="PO" width="100" prop="po" ></el-table-column>
          <el-table-column label="零件名" prop="componentName" width="250"></el-table-column>
          <el-table-column label="多订总数" width="100" prop="moreCount"></el-table-column>
          <el-table-column label="剩余库存" width="100" prop="residueStock"></el-table-column>
          <el-table-column label="已用库存" prop="useCount" min-width="100"></el-table-column>    
          <el-table-column label="使用的PO" width="105" prop="usePo" ></el-table-column>
          <el-table-column label="单位" width="70" prop="unit" ></el-table-column>
          <el-table-column label="仓库" min-width="250" prop="repositoryName"></el-table-column>
          <el-table-column label="供应商" min-width="250" prop="suppliserName"></el-table-column>
          <el-table-column label="采购方" min-width="100" prop="companyAbbreviation"></el-table-column>
          <el-table-column label="不报关" prop="customsDeclarationStatus" min-width="75">
            <template #default = "{ row }">
              <el-checkbox v-model="row.customsDeclarationStatus" :true-value="1" :false-value="0" class="custom-checkbox" disabled/>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
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
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { TableInstance, TabsPaneContext } from 'element-plus'
import { ref } from 'vue'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { getDataAttribute, getSpecificChildren } from '/@/utils/nodeUtils'
import { getOrderMoreComponent } from '~/src/api/devlocal/purchasePo'

defineOptions({
  name: 'surplusComponentsTable',
})

const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta, addVisitedRoute } = tabsStore
const editRef = ref<any>(null)
const activeName = ref<number>(0)
const tableRef = ref<TableInstance>()

// 表格加载loading状态
const listLoading = ref<boolean>(false) //
const list = ref<any>([])
// 总记录数
const total = ref<number>(0)
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
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


// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}



const handleTabClick = (tab: TabsPaneContext, event: Event) => {
  // list.value = []
  // if (tab.props.name !== undefined) {
  //   queryForm.status = Number(tab.props.name);  
  // }
  // fetchData()
}




const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  if (data.columnIndex !== 3 && data.columnIndex !== 9 && data.columnIndex !== 10){        
    return {
      textAlign:'center'
    }
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
    imagePreviewList.value = []
    imagePreviewList.value.push(el.src!)
  }
}

const getCellClass = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}

// 零件清单列表col合并方法
const objectSpanMethod = ({
    row,
    column,
    rowIndex,
    columnIndex,
}: any) => {
  // 设置需要合并的列
  if (columnIndex !== 6 && columnIndex !== 7) {
    // 获取当前row的零件id
    const componentId = row.componentId;
    // 默认不跨行
    let rowspan = 1;
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      // 如果零件id一样需要合并
      if (list.value[i].componentId === componentId) {
        rowspan++;
      } else {
        break;
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || list.value[rowIndex - 1].componentId !== componentId) {
      return { rowspan, colspan: 1 };
    } else {
      return { rowspan: 0, colspan: 0 };
    }
  }
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getOrderMoreComponent(queryForm)
  if (data) {
    list.value = data.list
    total.value = data.total
  }
  listLoading.value = false
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
          .clear-padding {
            padding-top: 0;
            padding-bottom: 0;
            .cell {
              padding-left: 0;
              padding-right: 0;
            }
          }
          // .el-table__body {
          //   .cell {
          //     min-height: 56.2px;
          //     line-height: 56.2px;
          //   }
          // }
        }
        .custom-checkbox {
          transform: scale(1.2); // 放大 20%
          transform-origin: center; // 确保放大从中心开始
        }
      }
    }
  }
}
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}
/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
</style>

