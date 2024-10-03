<template>
    <div class="comprehensive-table-container auto-height-container">
      <vab-query-form>
        <vab-query-form-top-panel>
          <h2>零件报关信息</h2>
        </vab-query-form-top-panel>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="handleStatus1Change">{{ queryForm.status1 === 0 ? '展示停产' : '隐藏停产' }}</el-button>
          <el-button type="primary" @click="handleStatus2Change">{{ queryForm.status2 === 0 ? '展示不报关' : '隐藏不报关' }}</el-button>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel>
              <el-form inline :model="queryForm" @submit.prevent>
                <el-form-item>
                  <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
                </el-form-item>
                <el-form-item>
                  <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                    @click="queryData"></el-button>
                </el-form-item>
              </el-form>
            </vab-query-form-right-panel>
      </vab-query-form>
  
      <el-table ref="tableRef" class="noneHoveTable" border stripe :data="list" @cell-click="changeInput" :header-cell-style="{ textAlign: 'center'}" v-loading="listLoading" :cell-style="cellStyle">
        <el-table-column align="center" label="图片" width="100" prop="componentImgUrl" fixed="left">
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
        <el-table-column label="零件名" prop="componentName" width="200" fixed="left">
          <template #default="{ row }">
            <span style="color: rgb(192, 192, 192)">{{ row.componentName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="属于SKU" width="100" prop="sku" fixed="left">
          <template #default="{ row }">
            <span style="color: rgb(192, 192, 192)">{{ row.sku }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="供应商" min-width="200" prop="suppliser" >
          <template #default="{ row }">
            <span style="color: rgb(192, 192, 192)">{{ row.suppliser }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="UPC" min-width="140" prop="upc" >
          <template #default="{ row }">
            <span style="color: rgb(192, 192, 192)">{{ row.upc }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="北美FNSKU" min-width="140" prop="northAmericaFnSku" >
          <template #default="{ row }">
            <span style="color: rgb(192, 192, 192)">{{ row.northAmericaFnSku }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="欧洲FNSKU" min-width="140" prop="europeFnSku" >
          <template #default="{ row }">
            <span style="color: rgb(192, 192, 192)">{{ row.europeFnSku }}</span>
          </template>
        </el-table-column>
        <el-table-column label="不报关" prop="customsDeclarationStatus" align="center" min-width="90">
          <template #default = "{ row }">
              <el-checkbox v-model="row.customsDeclarationStatus" :true-value="1" :false-value="0" class="custom-checkbox" @change="handleCustomsChange(row)"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="货源地" min-width="120" prop="placeOrigin" >
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.placeOrigin" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.placeOrigin }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="中国报关品名" min-width="140" prop="customsDeclarationNameZh" >
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.customsDeclarationNameZh" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.customsDeclarationNameZh }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="每套有多少个开票单位" min-width="120" prop="count" >
          <template #header>
            每套有多少<br>个开票单位
          </template>
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.count" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开票单位" min-width="90" prop="unit" >
          <template #header>
            开票<br>单位
          </template>
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.unit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开票型号" min-width="100" prop="type" >
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.type" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="" min-width="90" prop="statutoryUnit" >
          <template #header>
            法定第<br>1单位
          </template>
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.statutoryUnit" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.statutoryUnit }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="" min-width="120" prop="statutoryCount" >
          <template #header>
            每套多少法<br>定第1单位
          </template>
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.statutoryCount" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.statutoryCount }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="" min-width="100" prop="coveredWeightStatus" >
          <template #header>
            报关覆盖<br>实际净重
          </template>
          <template #default="{ row }">
            <el-checkbox v-model="row.coveredWeightStatus" :true-value="1" :false-value="0" class="custom-checkbox" @change="handleWeightStatusChange(row)"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="品牌" min-width="90" prop="brank" >
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.brank" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.brank }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="" min-width="90" prop="taxRate" >
          <template #header>
            出口退<br>税税率
          </template>
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.taxRate" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.taxRate }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="HS" min-width="100" prop="hs" >
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.hs" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.hs }}</span>
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
        <el-table-column align="center" label="申报要素" min-width="200" prop="declarationElements" >
          <template #default="{ row }">
            <div class="none">
                <el-input type="textarea" v-model="row.declarationElements" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.declarationElements }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="申报要素缩写" min-width="200" prop="declarationElementsAbbreviation" >
          <template #default="{ row }">
            <div class="none">
                <el-input type="textarea" v-model="row.declarationElementsAbbreviation" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.declarationElementsAbbreviation }}</span>
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
        <el-table-column align="center" label="装箱单英文清关品名" min-width="180" prop="packgeClearanceNameEn" >
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.packgeClearanceNameEn" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.packgeClearanceNameEn }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="装箱单中文清关品名" min-width="180" prop="packgeClearanceNameZh" >
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.packgeClearanceNameZh" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.packgeClearanceNameZh }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="云舟采购合同品名" min-width="180" prop="contractName" >
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.contractName" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.contractName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="材质(英文)" min-width="100" prop="materialEn" >
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.materialEn" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.materialEn }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="材质(中文)" min-width="100" prop="materialZh" >
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
        
        <el-table-column align="center" label="云舟采购价(RMB)" min-width="120" prop="purchasePrice" >
          <template #header>
            云舟采购价<br>(RMB)
          </template>
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.purchasePrice" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.purchasePrice }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="UPC" min-width="120" prop="salePrice" >
          <template #header>
            云舟售价<br>(USD)
          </template>
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.salePrice" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.salePrice }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="UPC" min-width="120" prop="clearancePrice" >
          <template #header>
            清关价格<br>(美元)
          </template>
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.clearancePrice" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.clearancePrice }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="UPC" min-width="120" prop="componentWeight" >
          <template #header>
            零件重量<br>(g)
          </template>
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.componentWeight" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.componentWeight }}</span>
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
  import { useRoutesStore } from '/@/store/modules/routes'
  import { getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
  import { getProductCustomsList, updateProductCustoms } from '/@/api/devlocal/productInformation'
  import { Search, ArrowDown, Delete, Plus, ZoomIn  } from '@element-plus/icons-vue'
  import { Picture as IconPicture } from '@element-plus/icons-vue'

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
  // 预览图片列表
  const imagePriviewList = ref<string[]>([])
  // 控制预览图片的隐藏显示
  const imagePreviewVisible = ref<boolean>(false)
  // 图片预览关闭事件
  const imagePreviewClose = () =>{
    imagePreviewVisible.value = false;
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
  const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
     
     if  (data.columnIndex === 1 || data.columnIndex === 2 || data.columnIndex === 3 || data.columnIndex === 4 || data.columnIndex === 5 || data.columnIndex === 6){        
     
         return {
              color: '#bbb',
              cursor: 'not-allowed',
              textAlign:'center'
          } 
     }else {
         return {
             textAlign:'center'
         }
     }
  }
  // table单击修改
  const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
      
      let el = getSpecificChildren(cell, "img")[0];
      if (getDataAttribute(el,'img') && el){
        imagePreviewVisible.value = true
        imagePriviewList.value = []
        imagePriviewList.value.push(el.src)
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
        await updateProductCustoms(value)
        fetchData()
    }
  }
const handleCustomsChange = async (row: any) => {
  await updateProductCustoms(row)
}
  const handleWeightStatusChange = async (row: any) => { //修改报关和报关实际净重
    await updateProductCustoms(row)
    fetchData()
  }
  
  const fetchData = async () => {
      listLoading.value = true
      const { data } = await getProductCustomsList(queryForm)
      list.value = data.list
      total.value = data.total
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
  /* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
  </style>
  