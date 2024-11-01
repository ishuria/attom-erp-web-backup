<template>
  <div class="comprehensive-table-container auto-height-container">
      <vab-query-form>
        <vab-query-form-top-panel>
          <h2>SKU信息</h2>
        </vab-query-form-top-panel>
          <vab-query-form-left-panel>
              <el-button type="primary" @click="handleHideStopProduction">{{ queryForm.haltStatus === 0 ? '隐藏停产' : '展示停产' }}</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" native-type="submit" type="primary"
                  @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
          <el-table 
              ref="tableRef" 
              stripe border 
              :data="list" 
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
              @cell-click="changeInput"
              v-loading="listLoading"
              class="noneHoveTable"
          >
              <el-table-column label="图片" class="image-wall" min-width="100">
                <template #default="{ row }">
                    <el-image style="width: 75px; height: 75px" v-if="row.skuImgUrl":src="row.skuImgUrl" fit="fill" data-img="img" />
                </template>
              </el-table-column>
              <el-table-column label="SKU" prop="sku" :min-width="tableColumnWidth">
                <template #default="{ row }">
                  <span v-html="row.sku" ></span>
                </template>
              </el-table-column>   
              <el-table-column label="FNSKUUPC" prop="fnSkuUpc" :width="FNSKUColumnWidth" >
                <template #header>
                  FNSKU<br>UPC
                </template>
                <template #default="{ row }">
                  <span v-html="row.fnSkuUpc"></span>
                </template>
              </el-table-column>
              <el-table-column label="产品经理" prop="productManager" min-width="90"></el-table-column>
              <el-table-column label="停产" prop="productionHaltStatus">
                <template #default="{ row }">
                  <el-switch v-model="row.productionHaltStatus" @change="handleUpdateStatus(row)" :active-value="1"
                  :inactive-value="0" style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66"/>
                </template>
              </el-table-column>
              <el-table-column label="优先打包" prop="priorityPacking" min-width="90">
                <template #default="{ row }">
                  <el-switch v-model="row.priorityPacking" @change="handleUpdateStatus(row)" :active-value="1"
                  :inactive-value="0" style="--el-switch-on-color: #13ce66;"/>
                </template>
              </el-table-column>
              <el-table-column label="打包拍照" prop="packagePhotograph" min-width="90">
                <template #default="{ row }">
                  <el-switch v-model="row.packagePhotograph" @change="handleUpdateStatus(row)" :active-value="1"
                  :inactive-value="0" style="--el-switch-on-color: #13ce66;"/>
                </template>
              </el-table-column>
              <el-table-column label="总实际成本" prop="procurementCost" min-width="80" >
                  <template #header>
                      总实际<br>成本
                  </template>
              </el-table-column>
              <el-table-column label="" prop="dilapidationCost" min-width="100" >
                  <template #header>
                      损耗成本<br>(近10次)
                  </template>
              </el-table-column>
              <el-table-column label="" prop="packingCost" min-width="100" >
                  <template #header>
                      打包成本<br>(近10次)
                  </template>
              </el-table-column>
              <el-table-column label="" prop="freightFeeCost" min-width="100" >
                  <template #header>
                      运费<br>(近10次)
                  </template>
              </el-table-column>
              <el-table-column label="货币" width="110px" prop="currency">
              </el-table-column>
              <el-table-column label="" prop="avgTime" min-width="100" >
                  <template #header>
                    平均交期<br>(近10次)
                  </template>
              </el-table-column>
              <el-table-column label="" prop="avgFluctuation" min-width="100" >
                  <template #header>
                    交期平均<br>波动
                  </template>
              </el-table-column>
              <el-table-column prop="length" label="长(cm)" min-width="90">
              </el-table-column>

              <el-table-column prop="width" label="宽(cm)" min-width="90">
              </el-table-column>

              <el-table-column prop="height" label="高(cm)" min-width="90">
              </el-table-column>

              <el-table-column prop="weight" label="重量(g)">
              </el-table-column>
              <el-table-column prop="weightCoefficient" label="重量系数" min-width="100">
              </el-table-column>
              <el-table-column prop="volumeCoefficient" label="体积系数" min-width="100">
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="150">
                  <template #default="{ row }">
                    <el-dropdown>
                      <el-button text type="primary" @click="handleSkuDetail(row)" >
                        SKU详情
                        <el-icon class="el-icon--right">
                          <arrow-down />
                        </el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item>
                            <el-link type="primary" :underline="false" @click="handleSkuDetail(row)" >SKU详情</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link type="primary" :underline="false">打包工时</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link type="primary" :underline="false">交期查看</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link type="primary" :underline="false">证书</el-link>
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
      <el-image-viewer @close="imagePreviewClose" :url-list="imagePreviewList" v-if="imagePreviewVisible" hide-on-click-modal/>
      <vab-pagination
        :current-page="queryForm.pageNo"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
  </div>

</template>

<script lang="ts" setup>
defineOptions({
  name: 'consumable',
})
import { ArrowDown, Search } from '@element-plus/icons-vue'
import { getProductList, updateProductStatus } from '/@/api/devlocal/productInformation'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { IgetProductList } from '/@/type/productInformation/skuInformationType'
import { getDataAttribute, getSpecificChildren } from '/@/utils/nodeUtils'
import { handleMatched, handleTabs } from '/@/utils/routes'
import { calculateBrColumnWidth } from '/@/utils/tableColum'


const listLoading = ref<boolean>(true)
// 零件列表
const list = ref<any>([])
const route: any = useRoute()
const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta, addVisitedRoute } = tabsStore
const handleSkuDetail = async (row: any) => {
  const query = { title: `${row.sku.split('<br/>')[0]}`, skuId: row.skuId }
  const matched = handleMatched(allRoutes.value, '/productInfomation/skuDetailView')
  const tab = handleTabs({
    ...matched.at(-1),
    query: query
  })
  if (tab) {
    await router.push({
      path: '/productInfomation/skuDetailView',
      query: query
    })
    await changeTabsMeta({
      title: 'SKU详情',
      meta: {
        title: `${tab.query.title}`,
      },
    })
  }
}
const handleHideStopProduction = () => {
  if (queryForm.haltStatus === 0) {
    queryForm.haltStatus = 1
  } else {
    queryForm.haltStatus = 0
  }
  fetchData()
}

const handleUpdateStatus = async (row: IgetProductList) => {  
  await updateProductStatus({
    skuId: row.skuId,
    haltStatus: row.productionHaltStatus,
    photographStatus: row.packagePhotograph,
    priorityStatus: row.priorityPacking
  })
}
const queryForm = reactive<any>({
  keyWord: '',
  haltStatus: 1, // 0展示停产 1隐藏停产
  pageNo: 1,
  pageSize: 20,
})
const total = ref<number>(0)
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
  // queryForm.keyWord = queryForm.keyWord.replace(/\r|\n|\r/g, '') // 移除换行符
  console.log(queryForm.keyWord);
  
  queryForm.pageNo = 1
  fetchData()
  // if(!queryForm.keyWord) {
  //       fetchData()
  //   } else {
  //       listLoading.value = true
  //       const queryList = ref<any>()
  //       queryList.value = list.value.filter((item: any) => item.sku.includes(queryForm.keyWord, 0))
  //       list.value = queryList.value
  //       total.value = list.value.length
  //       listLoading.value = false
  //   }
}
const tableColumnWidth = ref<number>(90)
const FNSKUColumnWidth = ref<number>(90)

// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
/**
* 当点击时切换输入框，修改输入
*/
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  let el = getSpecificChildren(cell, "img")[0];
  if (getDataAttribute(el,'img') && el){
    imagePreviewVisible.value = true
    imagePreviewList.value = []
    imagePreviewList.value.push(el.src)
  }
}

// 获取拿样零件添加数据
const fetchData = async () =>{
  listLoading.value = true
  const { data } = await getProductList(queryForm)
  list.value = data.list
  total.value = data.total
  list.value.forEach((item: any) => {
    item.fnSkuUpc = item.fnSkuUpc.replace(/,/g, '<br>')
  })
  listLoading.value = false
  // calculateColumnWidth()
  tableColumnWidth.value = calculateBrColumnWidth(list.value, (row: any) => row.sku, 70);
  FNSKUColumnWidth.value = calculateBrColumnWidth(list.value, (row: any) => row.fnSkuUpc, 70);
}
onMounted(async ()=>{
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
// 控制添加图片图标显示与隐藏
.hide :deep(.el-upload--picture-card) {
  display: none
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
.overflow-text {
  max-height: 81.2px; /* 设置文本的最大高度 */
  overflow-y: auto; /* 溢出时显示垂直滚动条 */
  display: block;
}
</style>

