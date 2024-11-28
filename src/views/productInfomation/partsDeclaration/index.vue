<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <h2>零件报关信息</h2>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleStatus1Change">{{ queryForm.status1 === 0 ? '展示停产' : '隐藏停产' }}</el-button>
        <el-button type="primary" @click="handleStatus2Change">{{ queryForm.status2 === 0 ? '展示不报关' : '隐藏不报关' }}</el-button>
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

    <el-table 
      ref="tableRef" 
      class="noneHoveTable" 
      border 
      :data="list" 
      @cell-click="changeInput" 
      v-loading="listLoading" 
      :cell-style="cellStyle" 
      :header-cell-style="{ textAlign: 'center' }" 
      :span-method="objectSpanMethod"
      :row-class-name="stripedRowClass"
      :cell-class-name="cellClassName"
    >
      <el-table-column label="图片" width="75" prop="componentImgUrl" fixed="left">
        <template #default="{ row }">
          <el-image style="width: 75px; height: 75px; display: block;" :src="row.componentImgUrl" fit="fill" @click="showImagePreview(row.componentImgUrl)">
            <template #error>
              <div class="image-slot">
                <el-icon></el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(list, '零件名', 'componentName')" fixed="left"></el-table-column>
      <el-table-column label="属于SKU" :width="calculateBrColumnWidth(list, (row: any)=>row.sku, 80, 27)" prop="sku" fixed="left" >
        <template #default="{ row }">
          <div v-html="row.sku"></div>
        </template>
      </el-table-column>
      <el-table-column label="供应商" :width="flexColumnWidth(list, '供应商', 'suppliser')" prop="suppliser" ></el-table-column>
      <el-table-column label="UPC" :width="calculateBrColumnWidth(list, (row: any)=>row.upc, 40)" prop="upc" >
        <template #default="{ row }">
          <div v-html="row.upc"></div>
        </template>
      </el-table-column>
      <el-table-column label="北美FNSKU" :width="calculateBrColumnWidth(list, (row: any)=>row.northAmericaFnSku, 90)" prop="northAmericaFnSku" >
        <template #default="{ row }">
          <div v-html="row.northAmericaFnSku"></div>
        </template>
      </el-table-column>
      <el-table-column label="欧洲FNSKU" :width="calculateBrColumnWidth(list, (row: any)=>row.europeFnSku, 90)" prop="europeFnSku" >
        <template #default="{ row }">
          <div v-html="row.europeFnSku"></div>
        </template>
      </el-table-column>
      <el-table-column label="不报关" prop="customsDeclarationStatus" min-width="80">
        <template #default = "{ row }">
            <el-checkbox v-model="row.customsDeclarationStatus" :true-value="1" :false-value="0" class="custom-checkbox" @change="handleCustomsChange(row)"/>
        </template>
      </el-table-column>
      <el-table-column label="货源地" min-width="120" prop="placeOrigin" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.placeOrigin" @keypress.enter="clickCancel2($event, row)" @blur="clickCancel2($event, row)" />
          </div>
          <span>{{ row.placeOrigin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中国报关品名" min-width="140" prop="customsDeclarationNameZh" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.customsDeclarationNameZh" @keypress.enter="clickCancel2($event, row)" @blur="clickCancel2($event, row)" />
          </div>
          <span>{{ row.customsDeclarationNameZh }}</span>
        </template>
      </el-table-column>
      <el-table-column label="每零件单位有多少个开票单位" min-width="140" prop="count" >
        <template #header>
          每零件单位有<br>多少个开票单位
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.count" @keypress.enter="clickCancel2($event, row)" @blur="clickCancel2($event, row)" />
          </div>
          <span>{{ row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票单位" min-width="90" prop="unit" >
        <template #header>
          开票<br>单位
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.unit" @keypress.enter="clickCancel2($event, row)" @blur="clickCancel2($event, row)" />
          </div>
          <span>{{ row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报关重量使用开票重量" prop="status" min-width="140">
        <template #header>
          报关重量使用<br />开票重量
        </template>
        <template #default="{ row }">
          <el-select style="min-width: 100%" @change="handleUpdateStatus(row)">
            <el-option 
              v-for="item in option"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            />

          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="开票型号" min-width="100" prop="type" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.type" @keypress.enter="clickCancel2($event, row)" @blur="clickCancel2($event, row)" />
          </div>
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="90" prop="statutoryUnit" >
        <template #header>
          法定第<br>1单位
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.statutoryUnit" @keypress.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.statutoryUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="每零件单位有多少个法定第1单位" min-width="160" prop="statutoryCount" >
        <template #header>
          每零件单位有多少<br>个法定第1单位
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.statutoryCount" @keypress.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.statutoryCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="100" prop="coveredWeightStatus" >
        <template #header>
          报关覆盖<br>实际净重
        </template>
        <template #default="{ row }">
          <el-checkbox v-model="row.coveredWeightStatus" :true-value="1" :false-value="0" class="custom-checkbox" @change="handleWeightStatusChange(row)"/>
        </template>
      </el-table-column>
      <el-table-column label="品牌" min-width="90" prop="brank" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.brank" @keypress.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.brank }}</span>
        </template>
      </el-table-column>
      <el-table-column label="HS" min-width="100" prop="hs" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.hs" @keypress.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.hs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="90" prop="taxRate" >
        <template #header>
          出口退<br>税税率
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.taxRate" @keypress.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.taxRate }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="HTS美国" min-width="100" prop="htsUs" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.htsUs" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.htsUs }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="HTS欧洲" min-width="100" prop="htsEurope" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.htsEurope" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.htsEurope }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="申报要素" min-width="200" prop="declarationElements" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="textarea" data-declaretion="specialElements" v-model="row.declarationElements" @keypress.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.declarationElements }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申报要素缩写" min-width="200" prop="declarationElementsAbbreviation" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="textarea" v-model="row.declarationElementsAbbreviation" @keypress.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.declarationElementsAbbreviation }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="制造商英文名称" min-width="140" prop="manufacturerEn" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.manufacturerEn" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.manufacturerEn }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="制造商英文地址" min-width="140" prop="manufacturerAddressEn" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.manufacturerAddressEn" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.manufacturerAddressEn }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="装箱单英文清关品名" min-width="180" prop="packgeClearanceNameEn" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.packgeClearanceNameEn" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.packgeClearanceNameEn }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="装箱单中文清关品名" min-width="180" prop="packgeClearanceNameZh" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.packgeClearanceNameZh" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.packgeClearanceNameZh }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="云舟采购合同品名" min-width="180" prop="contractName" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.contractName" @keypress.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.contractName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="材质(英文)" min-width="100" prop="materialEn" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.materialEn" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.materialEn }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="材质(中文)" min-width="100" prop="materialZh" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.materialZh" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.materialZh }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="用途(中文)" min-width="100" prop="usageZh" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.usageZh" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.usageZh }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="用途(英文)" min-width="100" prop="usageEn" >
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.usageEn" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.usageEn }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="云舟采购价(RMB)" min-width="120" prop="purchasePrice" >
        <template #header>
          云舟采购价<br>(RMB)
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.purchasePrice" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.purchasePrice }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="UPC" min-width="120" prop="salePrice" >
        <template #header>
          云舟售价<br>(USD)
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.salePrice" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.salePrice }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="UPC" min-width="120" prop="clearancePrice" >
        <template #header>
          清关价格<br>(美元)
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.clearancePrice" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.clearancePrice }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="UPC" min-width="120" prop="componentWeight" >
        <template #header>
          零件重量<br>(g)
        </template>
        <template #default="{ row }">
          <div class="none">
              <el-input type="text" v-model="row.componentWeight" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
          </div>
          <span>{{ row.componentWeight }}</span>
        </template>
      </el-table-column> -->
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
            <el-input v-model="priceCoefficientSettingForm.minProcurementCoefficient" style="width: 10em;" placeholder="随机最小价格系数" clearable></el-input> &nbsp;
            <el-input v-model="priceCoefficientSettingForm.maxProcurementCoefficient" style="width: 10em;" placeholder="随机最大价格系数" clearable></el-input>
            ）
          </el-text>
        </el-form-item>
        <el-form-item>
          <el-text>
            云舟销售单价 = PO未税单价￥ / 当前汇率 ×
            <el-input v-model="priceCoefficientSettingForm.salesCoefficient1" style="width: 6em;" placeholder="价格系数" clearable></el-input>
            + 预估运费 ×
            <el-input v-model="priceCoefficientSettingForm.salesCoefficient2" style="width: 6em;" placeholder="价格系数" clearable></el-input>
          </el-text>
        </el-form-item>
        <el-form-item>
          <el-text>
            SKU清关单价 = PO未税单价￥ / 当前汇率 ×
            <el-input v-model="priceCoefficientSettingForm.customClearanceCoefficient" style="width: 6em;" placeholder="价格系数" clearable></el-input>
          </el-text>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center;">
          <el-button type="danger" @click="closePriceCoefficientSetting">取消</el-button>
          <el-button type="success" @click="confirmPriceCoefficientSetting">确定</el-button>
        </div>
      </template>
    </vab-dialog>
  </div>
</template>
  
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { isEqual } from 'lodash'
import { CSSProperties } from 'vue'
import { getCustomsClearanceRatio, getProductCustomsList, updateCustomsClearanceRatio, updateProductCustoms, updateProductCustomsClearanceStatus } from '/@/api/devlocal/productInformation'
import { useRoutesStore } from '/@/store/modules/routes'
import { focusAndSelectInput, getDataAttribute, getRootElement } from '/@/utils/nodeUtils'
import { calculateBrColumnWidth, flexColumnWidth } from '/@/utils/tableColum'

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
  keyWord: '',
  status1: 0, //隐藏停产0，展示停产1
  status2: 0, //隐藏不报关0，展示不报关1
  pageNo: 1,
  pageSize: 20,
})
const option = [
  {
    label: '否',
    value: 0
  },
  {
    label: '是',
    value: 1
  }
]
// 价格系数设定
const priceCoefficientSettingVisible = ref<boolean>(false)
const priceCoefficientSettingForm = reactive<any>({

})
// 打开价格系数设定
const showPriceCoefficientSetting = async () => {
  priceCoefficientSettingVisible.value = true
  const { data } = await getCustomsClearanceRatio()
  Object.assign(priceCoefficientSettingForm, data)
}
// 关闭价格系数设定
const closePriceCoefficientSetting = () => {
  priceCoefficientSettingVisible.value = false
}
// 确认价格系数
const confirmPriceCoefficientSetting = async () => {
  const { data } = await updateCustomsClearanceRatio({
    minProcurementCoefficient: priceCoefficientSettingForm.minProcurementCoefficient,
    maxProcurementCoefficient: priceCoefficientSettingForm.maxProcurementCoefficient,
    salesCoefficient1: priceCoefficientSettingForm.salesCoefficient1,
    salesCoefficient2: priceCoefficientSettingForm.salesCoefficient2,
    customClearanceCoefficient: priceCoefficientSettingForm.customClearanceCoefficient
  })
  if (data) {
    $baseMessage('价格系数修改成功', 'success')
    closePriceCoefficientSetting()
  }
}
// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
const showImagePreview = (url: string) => {
  imagePreviewList.value = []
  imagePreviewVisible.value = true
  imagePreviewList.value.push(url)
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleStatus1Change = async () => {
  queryForm.status1 === 0 ? queryForm.status1 = 1 : queryForm.status1 = 0
  fetchData()
}
const handleStatus2Change = async () => {
  queryForm.status2 === 0 ? queryForm.status2 = 1 : queryForm.status2 = 0
  fetchData()
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if  (data.columnIndex === 1 || data.columnIndex === 2 || data.columnIndex === 3 || data.columnIndex === 4 || data.columnIndex === 5 || data.columnIndex === 6){        
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
const cellClassName = (data: {row: any, column: any, rowIndex: number, columnIndex: number}) => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}
let copyRow: any
// table单击修改
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
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
// 零件供应商几列的blur事件
const clickCancel2 = async (event: Event, value: any) => {
  
  const rootElement = getRootElement(event.target, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }
  if (isEqual(copyRow, value)) {
    return
  }
}
// 后面几列table blur事件
const clickCancel = async (event:any,value:any) =>{
  
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
  // 处理申报要素简写
  var builder;
  if (getRootElement(event["srcElement"],".el-textarea")){
    let textAreaEl = getRootElement(event["srcElement"],".el-textarea").children[0]; 
    if (getDataAttribute(textAreaEl,"declaretion")){
        let element = value.declarationElements;
        if(element.indexOf("【") > 0){
            var s = element.split("【");
            for(var i = 1; i < s.length; i++){
                if( i == 1){
                    var text = s[i].split("】")[0];
                    if(text == '无'){
                        text = '0';
                    }else if(text == '境内品牌'){
                        text = '1';
                    }else if(text == '境外贴牌'){
                        text = '3';
                    }
                    builder = text;
                }else {
                    var text = s[i].split("】")[0];
                    if(text == '无' && builder.indexOf("|") < 0){
                        text = '0';
                    }else if(text == '境内品牌' && builder.indexOf("|") < 0){
                        text = '1';
                    }else if(text == '境外贴牌' && builder.indexOf("|") < 0){
                        text = '3';
                    }
                    builder = builder + "|" + text;
                }
            }
        }else if(element.indexOf("[") > 0){
            var s = element.split("[");
            for(var i = 1; i < s.length; i++){
                if( i == 1){
                    var text = s[i].split("]")[0];
                    if(text == '无'){
                        text = '0';
                    }else if(text == '境内品牌'){
                        text = '1';
                    }else if(text == '境外贴牌'){
                        text = '3';
                    }
                    builder = text;
                }else {
                    var text = s[i].split("]")[0];
                    if(text == '无' && builder.indexOf("|") < 0){
                        text = '0';
                    }else if(text == '境内品牌' && builder.indexOf("|") < 0){
                        text = '1';
                    }else if(text == '境外贴牌' && builder.indexOf("|") < 0){
                        text = '3';
                    }
                    builder = builder + "|" + text;
                }
            }
        }
      }
  }
  
  if (builder){
      value.declarationElementsAbbreviation = builder;
  }else {
    value.declarationElementsAbbreviation = "";
  }

  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    await updateProductCustoms(
      {
        pId: value.pId,
        statutoryUnit: value.statutoryUnit,
        statutoryCount: value.statutoryCount,
        brank: value.brank,
        hs: value.hs,
        taxRate: value.taxRate,
        declarationElements: value.declarationElements,
        declarationElementsAbbreviation: value.declarationElementsAbbreviation,
        contractName: value.contractName
      }
    )
    fetchData()
  }
}
// 修改报关重量使用开票重量
const handleUpdateStatus = async (row: any) => {
  const { data } = await updateProductCustomsClearanceStatus({
    id: row.id,
    status: row.status
  })
}
// 修改不报关
const handleCustomsChange = async (row: any) => {
  await updateProductCustoms(row)
}
// 修改报关实际净重
const handleWeightStatusChange = async (row: any) => { 
  await updateProductCustoms({
    pId: row.pId,
    statutoryUnit: row.statutoryUnit,
    statutoryCount: row.statutoryCount,
    brank: row.brank,
    hs: row.hs,
    taxRate: row.taxRate,
    declarationElements: row.declarationElements,
    declarationElementsAbbreviation: row.declarationElementsAbbreviation,
    contractName: row.contractName
  })
  fetchData()
}
// col合并方法
const objectSpanMethod = ({
    row,
    column,
    rowIndex,
    columnIndex,
}: any) => {
  // 设置需要合并的列
  if (columnIndex !== 0 && columnIndex !== 3 && columnIndex !== 7 && columnIndex !== 9 && columnIndex !== 10 && columnIndex !== 11
    && columnIndex !== 12 && columnIndex !== 13 && columnIndex !== 16) {
    // 获取当前row的零件id
    const pId = row.pId;
    // 默认不跨行
    let rowspan = 1;
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      // 如果零件id一样需要合并
      if (list.value[i].pId === pId) {
        rowspan++;
      } else {
        break;
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || list.value[rowIndex - 1].pId !== pId) {
      return { rowspan, colspan: 1 };
    } else {
      return { rowspan: 0, colspan: 0 };
    }
  }
}

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getProductCustomsList(queryForm)
  list.value = data.list
  total.value = data.total
  listLoading.value = false
  list.value.forEach((item: any) => {
    item.sku = item.sku.replace(/,/g, '<br />')
    item.northAmericaFnSku = item.northAmericaFnSku.replace(/,/g, '<br />')
    item.upc = item.upc.replace(/,/g, '<br />')
    item.europeFnSku = item.europeFnSku.replace(/,/g, '<br />')
  })
  list.value.sort((a: any, b: any) => {
    return b.pId - a.pId
  })
}
let previous: any = null
let currentGroupIndex = 0 // 当前组索引

const stripedRowClass = (_row: any) => {
  const { row } = _row
  const currentId = row.pId
  // 检查当前行是否与上一行不同
  if (currentId !== previous) {
    previous = currentId
    currentGroupIndex++
  }
  // 根据当前组索引设置条纹样式
  return currentGroupIndex % 2 === 0 ? 'el-table__row--striped' : ''
}
onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  fetchData()
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
.el-table :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.el-table :deep(.clear-padding .cell) {
  padding-left: 0;
  padding-right: 0;
}
</style>
  