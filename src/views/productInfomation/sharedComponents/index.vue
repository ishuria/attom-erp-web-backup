<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <h2>零件报关信息</h2>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel :span="24">
        <el-button type="primary">隐藏停产</el-button>
        <el-button type="primary">隐藏不报关</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table ref="tableRef" border stripe :data="sampleData" @cell-click="changeInput" :header-cell-style="{ textAlign: 'center'}">
      <el-table-column align="center" label="图片" width="100" prop="imageUrl" fixed="left">
          <template #default="{ row }">
              <el-image style="width: 75px; height: 75px" :src="row.imageUrl" fit="fill" data-img="img" />
          </template>
      </el-table-column>
      <el-table-column label="零件名" prop="componentName" width="200" fixed="left">
        <template #default="{ row }">
          <span style="color: rgb(192, 192, 192)">{{ row.componentName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="属于SKU" width="100" prop="sku" >
        <template #default="{ row }">
          <span style="color: rgb(192, 192, 192)">{{ row.sku }}</span>
        </template>
      </el-table-column>
      <el-table-column label="不报关" prop="purchaseToOrder" align="center" min-width="90">
        <template #default = "{ row }">
            <el-checkbox v-model="row.purchaseToOrder" :true-value="'1'" :false-value="'0'" class="custom-checkbox"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商" min-width="200" prop="title" >
        <template #default="{ row }">
          <span style="color: rgb(192, 192, 192)">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="UPC" min-width="140" prop="fullName" >
        <template #default="{ row }">
          <span style="color: rgb(192, 192, 192)">{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="北美FNSKU" min-width="140" prop="fullName" >
        <template #default="{ row }">
          <span style="color: rgb(192, 192, 192)">{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="欧洲FNSKU" min-width="140" prop="fullName" >
        <template #default="{ row }">
          <span style="color: rgb(192, 192, 192)">{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="货源地" min-width="120" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="中国报关品名" min-width="140" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="每套有多少个开票单位" min-width="120" prop="fullName" >
        <template #header>
          每套有多少<br>个开票单位
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开票单位" min-width="90" prop="fullName" >
        <template #header>
          开票<br>单位
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开票型号" min-width="100" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="" min-width="90" prop="fullName" >
        <template #header>
          法定第<br>1单位
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="" min-width="120" prop="fullName" >
        <template #header>
          每套多少法<br>定第1单位
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="" min-width="100" prop="actualWeight" >
        <template #header>
          报关覆盖<br>实际净重
        </template>
        <template #default="{ row }">
          <el-checkbox v-model="row.actualWeight" :true-value="'1'" :false-value="'0'" class="custom-checkbox"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="品牌" min-width="90" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="" min-width="90" prop="fullName" >
        <template #header>
          出口退<br>税税率
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="HS" min-width="100" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="HTS美国" min-width="100" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="HTS欧洲" min-width="100" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申报要素" min-width="200" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申报要素缩写" min-width="200" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="制造商英文名称" min-width="140" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="制造商英文地址" min-width="140" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="装箱单英文清关品名" min-width="180" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="装箱单中文清关品名" min-width="180" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="云舟采购合同品名" min-width="180" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="材质(英文)" min-width="100" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="材质(中文)" min-width="100" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用途(中文)" min-width="100" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用途(英文)" min-width="100" prop="fullName" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="云舟采购价(RMB)" min-width="120" prop="fullName" >
        <template #header>
          云舟采购价<br>(RMB)
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="UPC" min-width="120" prop="fullName" >
        <template #header>
          云舟售价<br>(USD)
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="UPC" min-width="120" prop="fullName" >
        <template #header>
          清关价格<br>(美元)
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="UPC" min-width="120" prop="fullName" >
        <template #header>
          零件重量<br>(g)
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentUnit }}</span>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if="imagePreviewVisible"/>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- <default-table-edit ref="editRef" @fetch-data="fetchData" /> -->
  </div>
</template>

<script lang="ts" setup>
import type { TableInstance } from 'element-plus'
import { doDelete } from '/@/api/table'
import { useRoutesStore } from '/@/store/modules/routes'
import { useSettingsStore } from '/@/store/modules/settings'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleMatched, handleTabs } from '/@/utils/routes'
import { getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'

defineOptions({
  name: 'sharedComponents',
})

const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const editRef = ref<any>(null)
const tableRef = ref<TableInstance>()
const list = ref<any>([])
const listLoading = ref<boolean>(true)
const total = ref<number>(0)
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
})
// 预览图片列表
const imagePriviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
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
// table单击修改
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
    
    let el = getSpecificChildren(cell, "img")[0];
    if (getDataAttribute(el,'img') && el){
      imagePreviewVisible.value = true
      imagePriviewList.value = []
      imagePriviewList.value.push(row.imageUrl)
    }
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
    } else {
        const textareaElement = getSpecificChildren(cell, "textarea")[0];
        if (textareaElement){
            textareaElement.focus()
            textareaElement.select()
        }
    }
}
// 零件table blur事件
const clickCancle = async (event:any,value:any) =>{
  const t1 = getRootElement(event["srcElement"],".cell").children[0]
  if (t1){
    t1.classList.add("none")
  }

  const t2 = getRootElement(event["srcElement"],".cell").children[1]
  if (t2){
    t2.classList.remove("none")
  }
  
  if (event.type === 'blur') {
      // 执行失去焦点处理逻辑
      // await reviewStepNo3ComponentUpdate(value)
      // fetchDataComponent()
  }
}
const sampleData = [
  {
    imageUrl: 'https://example.com/image1.jpg',
    componentName: '组件一',
    id: 'SKU001',
    purchaseToOrder: '1',
    title: '供应商A',
    fullName: '货源地A',
    componentUnit: '单位A',
    customInvoiceUnit1: '开票单位1',
    customInvoiceUnit2: '开票单位2',
    legalUnit1: '法定单位1',
    legalUnitCount: '2',
    actualNetWeight: '500g',
    brand: '品牌A',
    exportTaxRate: '5%',
    hsCode: 'HS001',
    htsUS: 'HTS001',
    htsEU: 'HTS001',
    declarationElement: '申报要素A',
    declarationAbbreviation: '缩写A',
    manufacturerName: '制造商A',
    manufacturerAddress: '地址A',
    packingListEnglishName: '清关品名A',
    packingListChineseName: '清关品名A(中文)',
    contractName: '合同品名A',
    materialEnglish: '材质A',
    materialChinese: '材质A(中文)',
    usageChinese: '用途A(中文)',
    usageEnglish: 'Usage A',
    upc: 'UPC001',
    fnskuNA: 'FNSKU-NA001',
    fnskuEU: 'FNSKU-EU001',
    purchasePriceRMB: '100',
    salePriceUSD: '15',
    clearancePriceUSD: '12',
    weight: '500',
  },
  {
    imageUrl: 'https://example.com/image2.jpg',
    componentName: '组件二',
    id: 'SKU002',
    purchaseToOrder: '0',
    title: '供应商B',
    fullName: '货源地B',
    componentUnit: '单位B',
    customInvoiceUnit1: '开票单位1',
    customInvoiceUnit2: '开票单位2',
    legalUnit1: '法定单位1',
    legalUnitCount: '3',
    actualNetWeight: '300g',
    brand: '品牌B',
    exportTaxRate: '6%',
    hsCode: 'HS002',
    htsUS: 'HTS002',
    htsEU: 'HTS002',
    declarationElement: '申报要素B',
    declarationAbbreviation: '缩写B',
    manufacturerName: '制造商B',
    manufacturerAddress: '地址B',
    packingListEnglishName: '清关品名B',
    packingListChineseName: '清关品名B(中文)',
    contractName: '合同品名B',
    materialEnglish: '材质B',
    materialChinese: '材质B(中文)',
    usageChinese: '用途B(中文)',
    usageEnglish: 'Usage B',
    upc: 'UPC002',
    fnskuNA: 'FNSKU-NA002',
    fnskuEU: 'FNSKU-EU002',
    purchasePriceRMB: '150',
    salePriceUSD: '22',
    clearancePriceUSD: '18',
    weight: '300',
  },
  {
    imageUrl: 'https://example.com/image3.jpg',
    componentName: '组件三',
    id: 'SKU003',
    purchaseToOrder: '1',
    title: '供应商C',
    fullName: '货源地C',
    componentUnit: '单位C',
    customInvoiceUnit1: '开票单位1',
    customInvoiceUnit2: '开票单位2',
    legalUnit1: '法定单位1',
    legalUnitCount: '4',
    actualNetWeight: '400g',
    brand: '品牌C',
    exportTaxRate: '7%',
    hsCode: 'HS003',
    htsUS: 'HTS003',
    htsEU: 'HTS003',
    declarationElement: '申报要素C',
    declarationAbbreviation: '缩写C',
    manufacturerName: '制造商C',
    manufacturerAddress: '地址C',
    packingListEnglishName: '清关品名C',
    packingListChineseName: '清关品名C(中文)',
    contractName: '合同品名C',
    materialEnglish: '材质C',
    materialChinese: '材质C(中文)',
    usageChinese: '用途C(中文)',
    usageEnglish: 'Usage C',
    upc: 'UPC003',
    fnskuNA: 'FNSKU-NA003',
    fnskuEU: 'FNSKU-EU003',
    purchasePriceRMB: '200',
    salePriceUSD: '30',
    clearancePriceUSD: '25',
    weight: '400',
  },
];






// const fetchData = async () => {
//     listLoading.value = true
//     // const { data } = await getList(queryForm)
//     // list.value = data.list
//     // total.value = data.total
//     listLoading.value = false
// }

const customsModeOption = [
  { label: '买单', value: 0 },
  { label: '退税(按整批)', value: 1 },
  { label: '退税(可分批)', value: 2 },
]

const statusFilter = (status: string | number) => {
const statusMap: any = {
  正常: 'success',
  停用: 'danger',
}
return statusMap[status]
}





// const handleDelete = (row: any) => {
// if (row.id) {
//     $baseConfirm('您确定要删除当前项吗', null, async () => {
//     const { msg }: any = await doDelete({ ids: row.id })
//     $baseMessage(msg, 'success', 'hey')
//     await fetchData()
//     })
// } else {
//     if (selectRows.value.length > 0) {
//     const ids = selectRows.value.map((item: { id: any }) => item.id).join(',')
//     $baseConfirm('您确定要删除选中项吗', null, async () => {
//         const { msg }: any = await doDelete({ ids })
//         $baseMessage(msg, 'success', 'hey')
//         await fetchData()
//     })
//     } else {
//     $baseMessage('您未选中任何行', 'warning', 'hey')
//     }
// }
// }

// const handleDetailStayTable = async () => {
// if (selectRows.value.length > 0)
//     for (let i = 0; i < selectRows.value.length; i++) {
//     const matched = handleMatched(allRoutes.value, '/vab/table/defaultTableDetail')
//     const tab = handleTabs({
//         ...matched.at(-1),
//         query: selectRows.value[i],
//     })
//     if (tab) {
//         await addVisitedRoute(tab)
//         await changeTabsMeta({
//         title: '详情页',
//         meta: {
//             title: `${tab.query.title} 详情页`,
//         },
//         })
//     }
//     }
// else $baseMessage('请至少选择一行进行详情页跳转', 'warning', 'hey')
// }

onActivated(() => {
  tableRef.value?.doLayout()
})

// onBeforeMount(() => {
//     fetchData()
// })
</script>

<style lang="scss" scoped>
.none {
  display: none;
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}

.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
</style>
