<template>
    <div class="comprehensive-table-container auto-height-container">
       <vab-query-form>
            <h3>
                新品审核与记录
            </h3>
            <vab-query-form-right-panel :span="24">
                <el-form inline :model="queryForm" @submit.prevent>
                    <el-form-item>
                        <el-input v-model="queryForm.productKeyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
                    </el-form-item>
                    <el-form-item>
                        <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                        @click="queryData"></el-button>
                    </el-form-item>
                </el-form>
            </vab-query-form-right-panel>
        </vab-query-form>
  
        <el-table 
            ref="tableRef" 
            :header-cell-style="{ 'text-align': 'center' }"
            border stripe
            :data="dataList" 
            @cell-click="reviewTableInputChage"
        >
            <el-table-column label="提交日期" prop="submitTime" align="center" width="100">
                <template #default = "{ row }">
                  <span style="color: rgb(192, 192, 192, 1)">{{ row.submitTime.split(' ')[0] }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="SKU图片" width="100">
                <template #default="{ row }">
                    <el-image style="width: 75px; height: 75px" :src="row.SkUimg" fit="fill" />
                </template>
            </el-table-column>
            <el-table-column label="SKU" width="300" prop="SKU" >
                <template #default="{ row }">
                    {{ formattedProgressLog(row.SKU)  }}
                </template>
            </el-table-column>   
            <el-table-column label="产品" width="200" prop="product" >
                <template #default="{ row }">
                    {{ formattedProgressLog(row.product)  }}
                </template>
            </el-table-column>  
            <el-table-column label="首单PO"  min-width="90" prop="firstPO" align="center">
                <template #default="{ row }">
                    {{ row.firstPO  }}
                </template>
            </el-table-column>
            <el-table-column label="首单实际成本"  width="130" prop="firstRealCost" align="center">
                <template #default="{ row }">
                    {{ row.firstRealCost  }}
                </template>
            </el-table-column>
            <el-table-column label="审批成本"  min-width="100" prop="cost" align="center">
                <template #default="{ row }">
                    {{ row.cost  }}
                </template>
            </el-table-column>    
            <el-table-column label="相差"  min-width="70" prop="miner" align="center">
                <template #default="{ row }">
                    {{ row.miner  }}
                </template>
            </el-table-column>
            <el-table-column label="产品经理" align="center" min-width="100" prop="productManger" >
            <template #default="{ row }">
                <div style="color: rgb(192, 192, 192, 1)" v-html="row.productManger.replace(/,/g, '<br/>')"></div>
            </template>
        </el-table-column>        
        <el-table-column label="产品设计" align="center" min-width="100" prop="productDesign" >
            <template #default="{ row }">
                {{ row.productDesign  }}
            </template>
        </el-table-column>   
            <el-table-column label="立项日期" prop="createTime" align="center" width="100">
                <template #default = "{ row }">
                  <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
                </template>
            </el-table-column>    
            <el-table-column label="审批日期" prop="time" align="center" width="100">
                <template #default = "{ row }">
                  <span style="color: rgb(192, 192, 192, 1)">{{ row.time.split(' ')[0] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="耗时"  min-width="100" prop="haotime" align="center">
                <template #default="{ row }">
                    {{ row.haotime  }}
                </template>
            </el-table-column>    
        <el-table-column label="OEM" prop="oem" align="center" width="70">
            <template #default = "{ row }">
               <el-checkbox v-model="row.oem" :true-value="'1'" :false-value="'0'" size="large" class="custom-checkbox"/>
            </template>
          </el-table-column>
        <el-table-column align="center" label="审批状态" min-width="140" prop="status">
            <template #default="{ row }">
                <span :class="generateStatus(row.status).color">
                    {{ generateStatus(row.status).text }}
                </span>
            </template>
        </el-table-column>
        <el-table-column label="审批人" align="center" min-width="100" prop="person" >
            <template #default="{ row }">
                {{ row.person  }}
            </template>
        </el-table-column>    

        <el-table-column align="center" fixed="right" label="操作" :width="!foldOperation ? 215 : 120">
          <template #default="{ row }">
            <el-dropdown>
                <el-button text type="primary" @click="handleOrderProcess(row)">
                  {{ row.status === 0 ? '编辑' : '查看' }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" @click="handleOrderReview">审批和PO发布</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false">分数明细</el-link>
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
      <!-- <default-table-edit ref="editRef" @fetch-data="fetchData" /> -->
      <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if="imagePreviewVisible"/>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ArrowDown, Delete, Plus, Search } from '@element-plus/icons-vue'
  import type { TableInstance } from 'element-plus'
  import { doDelete, getList } from '/@/api/table'
  import { useRoutesStore } from '/@/store/modules/routes'
  import { useSettingsStore } from '/@/store/modules/settings'
  import { useTabsStore } from '/@/store/modules/tabs'
  import { handleMatched, handleTabs } from '/@/utils/routes'
import { getDataAttribute, getSpecificChildren } from '~/src/utils/nodeUtils'
  
  defineOptions({
    name: 'DefaultTable',
  })
  
  const router = useRouter()
  const routesStore = useRoutesStore()
  const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
  const tabsStore = useTabsStore()
  const { changeTabsMeta, addVisitedRoute } = tabsStore
  const editRef = ref<any>(null)
  const tableRef = ref<TableInstance>()
  const list = ref<any>([])
  const listLoading = ref<boolean>(true)
  const total = ref<number>(0)
  const selectRows = ref<any>([])
  const queryForm = reactive<any>({
    pageNo: 1,
    pageSize: 20,
  })
  const foldOperation = ref<boolean>(false)
  const settingsStore = useSettingsStore()

const dataList = [
  {
    submitTime: '2024-8-16',
    SKUimg: 'image1',
    SKU: 'NiHome-0380-12StanleyGlassStrawCLR NiHome-0380-6Str6BentStnlyGlassStrawCLR',
    product: '主品名+规格+变体名1 主品名+规格+变体名2',
    firstPO: 'PO20425 PO2222',
    firstRealCost: '15 14.5',
    cost: '15.5 14',
    miner: '-3%',
    productManger: '王文育  王宏',
    productDesign: 'lily',
    createTime: '2024-7-16',
    time: '',
    haotime: '10天',
    oem: 'true',
    status: 0,
    person: 'Lily'
  },
  {
    submitTime: '2024-8-16',
    SKUimg: 'image1',
    SKU: 'NiHome-0380-12StanleyGlassStrawCLR NiHome-0380-6Str6BentStnlyGlassStrawCLR',
    product: '主品名+规格+变体名1 主品名+规格+变体名2',
    firstPO: 'PO20425 PO2222',
    firstRealCost: '15 14.5',
    cost: '15.5 14',
    miner: '-3%',
    productManger: '王文育 王宏',
    productDesign: 'lily',
    createTime: '2024-7-16',
    time: '',
    haotime: '10天',
    oem: 'true',
    status: 0,
    person: 'Lily'
  },
  {
    submitTime: '2024-8-16',
    SKUimg: 'image1',
    SKU: 'NiHome-0380-12StanleyGlassStrawCLR NiHome-0380-6Str6BentStnlyGlassStrawCLR',
    product: '主品名+规格+变体名1 主品名+规格+变体名2',
    firstPO: 'PO20425 PO2222',
    firstRealCost: '15 14.5',
    cost: '15.5 14',
    miner: '-3%',
    productManger: '王文育 王宏',
    productDesign: 'lily',
    createTime: '2024-7-16',
    time: '',
    haotime: '10天',
    oem: 'true',
    status: 1,
    person: 'Lily'
  }
]
const formattedProgressLog = (str: string) => {
  return str
    .replace(/([\u4e00-\u9fa5]) ([a-zA-Z])/g, '$1<br>$2')
    .replace(/([a-zA-Z]) ([\u4e00-\u9fa5])/g, '$1<br>$2');
};
// table单击修改
const reviewTableInputChage = async(row: any, column: any, cell: HTMLTableCellElement, event: Event) =>{
    // 处理图片放大预览
    
    
    let el = getSpecificChildren(cell, "img")[0];
    console.log(el);
    if (getDataAttribute(el,'img') && getSpecificChildren(cell,"img")[0]){
      updateUploadPriviewVisible()
      setPreviewList(row.SKUimg)
    }
}
// 审批状态对应的文本和颜色
const generateStatus = (value: number) => {
  switch (value) {
    case 0:
      return { text: "编辑中", color: "status-editing" };
    case 1:
      return { text: "待审核", color: "status-editing" };
    case 2:
      return { text: "主管审批未通过", color: "status-failed" };
    case 3:
      return { text: "主管审批通过", color: "status-success" };
    case 4:
      return { text: "SKU创建", color: "status-editing" };
    case 5:
      return { text: "运营分货", color: "status-editing" };
    case 6:
      return { text: "待发布PO", color: "status-editing" };
    case 7:
      return { text: "已完成", color: "status-finished" };
    default:
      return { text: "未知", color: "status-editing" };
  }
}

  // const fetchData = async () => {
  //   listLoading.value = true
  //   const { data } = await getList(queryForm)
  //   list.value = data.list
  //   total.value = data.total
  //   listLoading.value = false
  // }
const handleOrderReview = () => {
  router.push({
    path: '/newProductDevelopment/orderingReview',
    query: {
      title: "新品订货审批",
      timestamp: Date.now(),
    },
  })
}
const handleOrderProcess = (row: any) => {
  router.push({
    path: '/newProductDevelopment/orderingProcess',
    query: {
      progressId: row.progressId,
      timestamp: Date.now(),
    },
  })
}
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
  
  const setSelectRows = (value: string) => {
    selectRows.value = value
  }
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 预览图片列表
const imagePriviewList = ref<string[]>([])
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
// 控制图片是否预览
const updateUploadPriviewVisible = () =>{
    imagePreviewVisible.value = true
}
// 修改图片预览列表
const setPreviewList = (imageUrl:string) =>{
    imagePriviewList.value = []
    imagePriviewList.value.push(imageUrl)
}

onActivated(() => {
  tableRef.value?.doLayout()
})
  
  // onBeforeMount(() => {
  //   fetchData()
  // })
</script>
  
<style lang="scss" scoped>
.status-editing {
    color: orange;
}
.status-failed {
    color: red;
}
.status-success {
    color: black;
}
.status-finished {
    color: green;
}
.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.5px;
}
</style>