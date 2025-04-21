<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleHideStopProduction">{{ queryForm.haltStatus === 0 ? '隐藏停产' : '展示停产' }}</el-button>
        <el-button type="primary">批量新增质检项</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" native-type="submit" type="primary" @click="queryData"/>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table 
      ref="tableRef" 
      v-loading="listLoading" border 
      :cell-class-name="clearPadding" 
      :cell-style="cellStyle"
      class="noneHoveTable"
      :data="list"
      :header-cell-style="{ 'text-align': 'center' }"
      stripe
    >
      <el-table-column fixed="left" type="selection" width="53"/>
      <el-table-column class="image-wall" label="图片" width="75">
        <template #default="{ row }">
          <el-image fit="fill" :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px" @click="setPreviewImage(row.skuImgUrl)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="sku" :width="calculateBrColumnWidth(list, (row: any) => row.sku, 70, 50)" >
        <template #default="{ row }">
          <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row._sku[0])" >
            {{ row._sku[0] }}
            <vab-icon icon="file-copy-2-fill" />
          </span><br />
          {{ row._sku[1] }}
        </template>
      </el-table-column>   
      <el-table-column label="FNSKUUPC" prop="fnSkuUpc" :width="calculateBrColumnWidth(list, (row: any) => row.fnSkuUpc, 70)" >
        <template #header>
          FNSKU<br>UPC
        </template>
        <template #default="{ row }">
          <span v-html="row.fnSkuUpc"></span>
        </template>
      </el-table-column>
      <el-table-column label="产品经理" min-width="90" prop="productManager"/>
      <el-table-column label="停产" prop="productionHaltStatus">
        <template #default="{ row }">
          <el-switch v-model="row.productionHaltStatus" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #ff4949;" @change="handleUpdateStatus(row)"/>
        </template>
      </el-table-column>
      <el-table-column label="优先打包" min-width="90" prop="priorityPacking">
        <template #default="{ row }">
          <el-switch v-model="row.priorityPacking" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66;" @change="handleUpdateStatus(row)"/>
        </template>
      </el-table-column>
      <!-- <el-table-column label="打包拍照" min-width="90" prop="packagePhotograph">
        <template #default="{ row }">
          <el-switch v-model="row.packagePhotograph" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66;" @change="handleUpdateStatus(row)"/>
        </template>
      </el-table-column> -->
      <el-table-column label="总实际成本" min-width="80" prop="procurementCost" >
        <template #header>
          总实际<br>成本
        </template>
      </el-table-column>
      <el-table-column label="" min-width="100" prop="dilapidationCost" >
        <template #header>
          损耗成本<br>(近10次)
        </template>
      </el-table-column>
      <el-table-column label="" min-width="100" prop="packingCost" >
        <template #header>
          打包成本<br>(近10次)
        </template>
      </el-table-column>
      <el-table-column label="" min-width="100" prop="freightFeeCost" >
        <template #header>
          运费<br>(近10次)
        </template>
      </el-table-column>
      <el-table-column label="货币" prop="currency" width="110px"/>
      <el-table-column label="" min-width="100" prop="avgTime" >
        <template #header>
          平均交期<br>(近10次)
        </template>
      </el-table-column>
      <el-table-column label="" min-width="100" prop="avgFluctuation" >
        <template #header>
          交期平均<br>波动
        </template>
      </el-table-column>
      <el-table-column label="长(cm)" min-width="90" prop="length"/>
      <el-table-column label="宽(cm)" min-width="90" prop="width"/>
      <el-table-column label="高(cm)" min-width="90" prop="height"/>
      <el-table-column label="重量(g)" prop="weight"/>
      <el-table-column label="重量系数" min-width="100" prop="weightCoefficient" :width="flexColumnWidth(list, '重量系数', 'weightCoefficient')">
        <template #default="{ row }">
          {{ row.weightCoefficient != null ? row.weightCoefficient.toFixed(4) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="体积系数" min-width="100" prop="volumeCoefficient" :width="flexColumnWidth(list, '体积系数', 'volumeCoefficient')">
        <template #default="{ row }">
          {{ row.volumeCoefficient != null ? row.volumeCoefficient.toFixed(4) : '' }}
        </template>
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
                <el-dropdown-item @click="handleSkuDetail(row)">
                  <el-link type="primary" :underline="false" >SKU详情</el-link>
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
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose"/>
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
import { ArrowDown, Search } from '@element-plus/icons-vue'
import type { CSSProperties } from 'vue'
import { getProductList, updateProductStatus } from '/@/api/devlocal/productInformation'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import type { IgetProductList } from '/@/type/productInformation/skuInformationType'
import handleClipboard from '/@/utils/clipboard'
import { handleMatched, handleTabs } from '/@/utils/routes'
import { calculateBrColumnWidth, flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'SkuInfomation',
})

const listLoading = ref<boolean>(true)
// 零件列表
const list = ref<any>([])
const router = useRouter()
const route = useRoute()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta } = tabsStore
const handleSkuDetail = async (row: any) => {
  const query = { title: `${row.sku.split('<br/>')[0]}`, skuId: row.skuId }
  const matched = handleMatched(allRoutes.value, '/productInfomation/skuDetailView')
  const tab = handleTabs({
    ...matched.at(-1),
    query
  })
  if (tab) {
    await router.push({
      path: '/productInfomation/skuDetailView',
      query
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
  router.push({
    query: {
      ...route.query,
      pageNo: '1',
      pageSize: value
    }
  })
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
      ...route.query,
      pageNo: value,
      pageSize: queryForm.pageSize
    }
  })
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  router.push({
    query: {
      ...route.query,
      pageNo: '1',
      pageSize: queryForm.pageSize
    }
  })
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
const setPreviewImage = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.column.label !== 'SKU') {
    return {
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'left'
  }
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}

// 获取拿样零件添加数据
const fetchData = async () =>{
  listLoading.value = true
  const { data } = await getProductList(queryForm)
  list.value = data.list
  total.value = data.total
  list.value.forEach((item: any) => {
    item.fnSkuUpc = item.fnSkuUpc.replaceAll(',', '<br>')
    item._sku = item.sku.split('<br/>')
  })
  listLoading.value = false
}

// 在组件加载时执行
onBeforeMount(() => {
  const { pageNo, pageSize } = route.query
  queryForm.pageNo = Number(pageNo) || 1
  queryForm.pageSize = Number(pageSize) || 20
  fetchData();  // 执行数据获取
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
.noneHoveTable {
  :deep(.el-checkbox) {
    transform: scale(1.3);
  }
}
.noneHoveTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoveTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
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
  display: block;
  max-height: 81.2px; /* 设置文本的最大高度 */
  overflow-y: auto; /* 溢出时显示垂直滚动条 */
}
.copySku {
  cursor: pointer;
  -webkit-user-select: text;
  user-select: text;
  transition: all 0.3s;
  &:hover {
    color: #000;
  }
}
</style>

