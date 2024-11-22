<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <h2>已有零件库</h2>
      </vab-query-form-top-panel>
      <vab-query-form-right-panel :span="24">
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
      stripe border 
      :data="list" 
      :header-cell-style="{ 'text-align': 'center' }"
      class="noneHoveTable"
      @cell-click="cellClick"
    >
      <el-table-column label="图片" width="94">
        <template #default="{ row, $index }">
          <el-image :src="row.imageUrl" fit="fill" style="width: 100%; height: 100%" @click="handleImagePreview(row.imageUrl)" >
            <template #error>
              <el-icon></el-icon>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="零件ID" class="component-center" min-width="70" prop="id" width="100"></el-table-column>   
      <el-table-column label="零件名" prop="componentName" min-width="200"></el-table-column>
      <el-table-column label="使用的SKU" prop="sku" min-width="200">
        <template #default="{ row }">
          <span v-html="row.sku"></span>
        </template>
      </el-table-column>
      <el-table-column label="默认供应商" min-width="200" prop="suppliser"></el-table-column>
      <el-table-column label="云舟采购价格系数" prop="ratio" min-width="80">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.ratio" clearable @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{ row.ratio }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <el-space>
            <el-link :underline="false" type="primary" @click="handleSupplier(row)">供应商</el-link>
            <el-link :underline="false" type="primary" @click="handleAddOtherSku(row)">添加到SKU</el-link>
          </el-space>
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

    <!-- 添加到其它SKU -->
    <el-dialog 
      v-model="addOtherSkuVisible" 
      :close-on-click-modal="false" 
      title="零件复制到其他SKU" 
      width="800"
      class="moldDialog"
      :before-close="handlerOtherSkuCloseDialog"
    >
      <el-divider style="margin-top: 0;"/>
      <div class="transfer-container">
        <el-transfer 
          v-model="transferValue" 
          :data="transferData" 
          filterable 
          :titles="['源列', '目的列']"
        />
      </div>
      <template #footer>
        <span>
          <el-button @click="addOtherSkuVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitOtherSku">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-image-viewer @close="imagePreviewClose" :url-list="imagePreviewList" v-if="imagePreviewVisible" hide-on-click-modal/>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'consumable',
})
import { Search } from '@element-plus/icons-vue'
import { isEqual } from 'lodash'
import { addConsumablesOtherSku, getProductAllReadyCOmponentList, getProductSkuList, updateProductAlreadyComponent } from '/@/api/devlocal/productInformation'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

const addOtherSkuVisible = ref<boolean>(false)
const handlerOtherSkuCloseDialog = () => {
    addOtherSkuVisible.value = false
}
const consumableTypeForm = reactive({
    consumableType: ''
})

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  if  (data.columnIndex === 0 || data.columnIndex === 1 || data.columnIndex === 5){        
    return {    
      textAlign: 'center',
    } 
  }
}

let copyRow: any
const cellClick = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
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
// table blur事件
const clickCancel = async (event: any, value: any) => {
  // 获取根元素，避免重复调用 getRootElement
  const rootElement = getRootElement(event.srcElement, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    // 更新 t1 和 t2 的 class
    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }

  // 只有在数据变化时才处理更新
  if (isEqual(value, copyRow)) {
    return; // 数据没有变化，不执行更新
  }

  if (event.type === 'blur') {
    // 执行失去焦点时的处理逻辑
    await updateProductAlreadyComponent({
      id: value.id,
      ratio: value.ratio
    })
  }
};

interface Option2 {
  key: number
  label: string
  initial: number
}
let states = ref<string[]>([])
let initials = ref<number[]>([])
const transferData = ref<Option2[]>([]) // 初始化为空数组
const transferValue = ref([])
// 生成数据
const generateData2 = () => {
  const data: Option2[] = []
  states.value.forEach((sku, index) => {
    data.push({
      label: sku,
      key: initials.value[index],
      initial: initials.value[index],
    })
  })
  return data
}
let _componentId = ref<number>()
// 添加其他 SKU 的逻辑
const handleAddOtherSku = async (row: any) => {
  // console.log(row);
  
  states.value = []
  initials.value = []
  transferData.value = []
  transferValue.value = []
  const { data } = await getProductSkuList({existingPartsListId: row.id})
  data.forEach((item: any) => {
    states.value.push(item.sku)
    initials.value.push(item.skuId)
  })
  transferData.value = generateData2()
  _componentId.value = row.id
  
  addOtherSkuVisible.value = true
}
const handleSubmitOtherSku = async () => {
  addOtherSkuVisible.value = false
  $baseConfirm('添加后不可逆，无法批量删除，是否继续？', '系统提示', async () => {
    const { data } = await addConsumablesOtherSku({
      skuIds: `${transferValue.value}`,
      componentId: _componentId.value!
    })
    if(data === true) {
      $baseMessage('添加到其他SKU成功', 'success', 'hey')
    }
  });
}

const router = useRouter()
const listLoading = ref<boolean>(true)
const list = ref<any>([])
const queryForm = reactive<any>({
  keyWord: '',
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
const handleSupplier = (row: any) => {
  router.push({
    path: '/productInfomation/skuSupplier',
    query: {
      title: "SKU供应商",
      componentId: row.id,
      componentName: row.componentName,
      from: "allReadyComponents",
      timestamp: Date.now(),
    },
  })
}


// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
const handleImagePreview = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url!)
}

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getProductAllReadyCOmponentList(queryForm)
  listLoading.value = false
  list.value = data.list
  total.value = data.total
  list.value.forEach((item: any) => {
    item.sku = item.sku.replace(/,/g, '<br>');
  })
}

onBeforeMount(()=>{
  fetchData()
})
</script>

<style lang="scss" scoped>

// 设置行高
:deep(.el-table .el-table__body .cell) {
  min-height: 75.6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
:deep(.moldDialog .el-dialog__body) { 
  padding-top: 0;
}
.transfer-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中，如果需要 */
}
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}
/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
.none {
  display: none;
}
</style>

