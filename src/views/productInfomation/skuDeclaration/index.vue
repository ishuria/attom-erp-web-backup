<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <h2>SKU报关信息</h2>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleStatus1Change">{{ queryForm.status1 === 0 ? '展示停产' : '隐藏停产' }}</el-button>
        <el-button type="primary" @click="showPriceCoefficientSetting" >价格系数设定</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table ref="tableRef" class="noneHoveTable" border stripe :data="list" @cell-click="changeInput" :header-cell-style="headerCellStyle" v-loading="listLoading" :cell-style="cellStyle">
      <el-table-column align="center" label="图片" width="105" prop="componentImgUrl" fixed="left">
        <template #default="{ row }">
          <el-image style="width: 75px; height: 75px" :src="row.componentImgUrl" fit="fill" data-img="img" >
            <template #error>
              <div class="image-slot">
                <el-icon></el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU品名" prop="componentName" min-width="200" fixed="left"></el-table-column>
      <el-table-column align="center" label="UPC" min-width="70" prop="upc" >
        <template #default="{ row }">
          <div v-html="row.upc"></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="北美FNSKU" :width="calculateBrColumnWidth(list, (row: any)=>row.northAmericaFnSku, 90)" prop="northAmericaFnSku" >
        <template #default="{ row }">
          <div v-html="row.northAmericaFnSku"></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="欧洲FNSKU" :width="calculateBrColumnWidth(list, (row: any)=>row.europeFnSku, 90)" prop="europeFnSku" >
        <template #default="{ row }">
          <div v-html="row.europeFnSku"></div>
        </template>
      </el-table-column>
      <el-table-column label="品牌" prop="customsDeclarationStatus" align="center" min-width="80">
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.htsUs" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.htsUs }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="HTS美国" min-width="100" prop="htsUs" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.htsUs" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.htsUs }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="HTS欧洲" min-width="100" prop="htsEurope" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.htsEurope" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.htsEurope }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="制造商英文名称" min-width="140" prop="manufacturerEn" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.manufacturerEn" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.manufacturerEn }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="制造商英文地址" min-width="140" prop="manufacturerAddressEn" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.manufacturerAddressEn" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.manufacturerAddressEn }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="英文清关品名" min-width="180" prop="packgeClearanceNameEn" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.packgeClearanceNameEn" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.packgeClearanceNameEn }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="中文清关品名" min-width="180" prop="packgeClearanceNameZh" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.packgeClearanceNameZh" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.packgeClearanceNameZh }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="材质比例(英文)" min-width="140" prop="materialEn" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.materialEn" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.materialEn }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="材质比例(中文)" min-width="140" prop="materialZh" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.materialZh" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.materialZh }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用途(中文)" min-width="100" prop="usageZh" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.usageZh" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.usageZh }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用途(英文)" min-width="100" prop="usageEn" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.usageEn" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.usageEn }}</span>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <el-image-viewer @close="imagePreviewClose" :url-list="imagePreviewList" v-if="imagePreviewVisible" hide-on-click-modal/>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- <default-table-edit ref="editRef" @fetch-data="fetchData" /> -->
    <vab-dialog
      title="价格系数设定"
      v-model="priceCoefficientSettingVisible"
      width="47em"
      @close="closePriceCoefficientSetting"
    >
    <el-form :model="priceCoefficientSettingForm" >
      <el-form-item>
        <el-text>
          云舟采购单价 = PO含税单价￥ × Random（
          <el-input style="width: 10em;" placeholder="随机最小价格系数" clearable></el-input> &nbsp;
          <el-input style="width: 10em;" placeholder="随机最大价格系数" clearable></el-input>
          ）
        </el-text>
      </el-form-item>
      <el-form-item>
        <el-text>
          云舟销售单价 = PO未税单价￥ / 当前汇率 ×
          <el-input style="width: 6em;" placeholder="价格系数" clearable></el-input>
          + 预估运费 ×
          <el-input style="width: 6em;" placeholder="价格系数" clearable></el-input>
        </el-text>
      </el-form-item>
      <el-form-item>
        <el-text>
          SKU清关单价 = PO未税单价￥ / 当前汇率 ×
          <el-input style="width: 6em;" placeholder="价格系数" clearable></el-input>
        </el-text>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="text-align: center;">
        <el-button type="danger" @click="closePriceCoefficientSetting">取消</el-button>
        <el-button type="success">确定</el-button>
      </div>
    </template>
    </vab-dialog>
  </div>
</template>
  
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { CSSProperties } from 'vue'
import { updateProductCustoms } from '/@/api/devlocal/productInformation'
import { useRoutesStore } from '/@/store/modules/routes'
import { focusAndSelectInput, getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
import { calculateBrColumnWidth } from '/@/utils/tableColum'
import { isEqual } from 'lodash'

defineOptions({
  name: 'skuDeclaration',
})
  
const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const editRef = ref<any>(null)
const tableRef = ref<TableInstance>()
const list = ref<any>([])
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive<any>({
  keyWord: '',
  status1: 1, //隐藏停产0，展示停产1
  pageNo: 1,
  pageSize: 20,
})
// 价格系数设定
const priceCoefficientSettingVisible = ref<boolean>(false)
const priceCoefficientSettingForm = reactive<any>({

})
// 打开价格系数设定
const showPriceCoefficientSetting = () => {
  priceCoefficientSettingVisible.value = true
}
// 关闭价格系数设定
const closePriceCoefficientSetting = () => {
  priceCoefficientSettingVisible.value = false
}
// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
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
const handleStatus1Change = async () => {
  queryForm.status1 === 0 ? queryForm.status1 = 1 : queryForm.status1 = 0
  // fetchData()
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 1 || data.columnIndex === 2 || data.columnIndex === 3 || data.columnIndex === 4) {
    return {
      color: '#bbb',
      cursor: 'not-allowed',
      textAlign:'left'
    }
  } else {
    return {
      textAlign:'center'
    }
  }
}
const headerCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 6 || data.columnIndex === 7 || data.columnIndex === 8 || data.columnIndex === 9 || data.columnIndex === 10
    || data.columnIndex === 11 || data.columnIndex === 12 || data.columnIndex === 13 || data.columnIndex === 14 || data.columnIndex === 15
  ) {
    return {
      color: 'var(--el-color-danger)'
    }
  }
  return {
    textAlign: 'center'
  }
}
let copyRow: any
// table单击修改
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  let el = getSpecificChildren(cell, "img")[0];
  if (getDataAttribute(el,'img') && el){
    imagePreviewVisible.value = true
    imagePreviewList.value = []
    imagePreviewList.value.push(el.src)
  }
  const firstChild = cell?.children[0]?.children[0];
  const secondChild = cell?.children[0]?.children[1];

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return;
  }

  copyRow = JSON.parse(JSON.stringify(row));

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none');
    secondChild.classList.add('none');

    focusAndSelectInput(cell);
  }
}
// 零件table blur事件
const clickCancle = async (event: any, value: any) => {
  
  const rootElement = getRootElement(event.srcElement, ".cell");
  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }
  if (isEqual(copyRow, value)) {
    return
  }

  if (event.type === 'blur') {
      // 执行失去焦点处理逻辑
      await updateProductCustoms(value)
      // fetchData()
  }
}

// const fetchData = async () => {
//   listLoading.value = true
//   const { data } = await getProductCustomsList(queryForm)
//   list.value = data.list
//   total.value = data.total
//   listLoading.value = false
//   list.value.forEach((item: any) => {
//     item.sku = item.sku.replace(/,/g, '<br />')
//     item.northAmericaFnSku = item.northAmericaFnSku.replace(/,/g, '<br />')
//     item.upc = item.upc.replace(/,/g, '<br />')
//     item.europeFnSku = item.europeFnSku.replace(/,/g, '<br />')
//   })
// }

onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  // fetchData()
})
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
  transform: scale(1.4); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
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
  