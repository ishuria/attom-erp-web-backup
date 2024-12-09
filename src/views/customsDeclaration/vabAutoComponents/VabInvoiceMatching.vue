<template>
  <vab-dialog
    title="发票匹配"
    v-model="dflag"
    @close="closeInvoiceMatching"
    width="90%"
    top="10vh"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="showUploadInvoice">发票导入</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter.native="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" :loading="listLoading" native-type="submit" @click="queryData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="cellStyle"
      :data="fakeData"
      @cell-click="cellClick"
      class="noneHoveTable"
      :cell-class-name="clearPadding"
    >
      <el-table-column label="操作" fixed="left">
        <template #default="{ row }">
          <el-link :underline="false" type="danger" >删除</el-link>
        </template>
      </el-table-column>
      <el-table-column label="购方名称" prop="" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票代码" prop="" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票号码" prop="" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" prop="" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票品名" prop="" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格型号" prop="" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票数量" prop="" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input type="number" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票单位" prop="" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票含税金额" prop="" min-width="110">
        <template #default="{ row }">
          <div class="none">
            <el-input type="number" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票未税金额" prop="" min-width="110">
        <template #default="{ row }">
          <div class="none">
            <el-input type="number" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票图片" prop="" width="75">
        <template #header>
          发票<br />图片
        </template>
        <template #default="{ row }">
          <el-image style="width: 75px; height: 75px; display: block" @click="showImagePreview(row.url)">
            <template #error>
              <el-icon></el-icon>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="匹配合同号" prop="" min-width="110">
        <template #default="{ row }">
          <div class="none">
            <el-input @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="匹配PO" prop="po" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报关数量" prop="" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input type="number" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报关单位" prop="" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
          </div>
          <span>{{  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130" fixed="right">
        <template #default="{ row }">
          <el-link :underline="false" type="primary" @click="showMatch(row)">匹配</el-link>
          <el-link :underline="false" type="primary" >清空</el-link>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div style="text-align: center;">
        <el-button @click="closeInvoiceMatching">取消</el-button>
        <el-button type="primary">确认</el-button>
      </div>
    </template>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageNo"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </vab-dialog>
  <!-- 上传发票 -->
  <vab-dialog
    title="上传发票"
    width="20%"
    v-model="uploadInvoiceVisible"
  >
    <el-upload action="#" 
      drag multiple class="upload-width" :show-file-list="true" :auto-upload="false">
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          将文件拖拽至此处或
          <em>点击上传</em>
        </div>
      </el-upload>
    <template #footer>
      <div style="text-align: center;">
        <el-button type="success">完成</el-button>
      </div>
    </template>
  </vab-dialog>
  <!-- 匹配 -->
  <vab-dialog
    title="匹配"
    v-model="matchVisible"
    width="80%"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-text style="margin: 0 10px calc(var(--el-margin) / 2) 0;">
          供应商：，开票品名：，单位：，数量：，发票含税金额
        </el-text>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="matchQueryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="matchQueryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryMatchData" @keyup.enter.native="queryMatchData" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" :loading="matchListLoading" native-type="submit" @click="queryMatchData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="matchCellStyle"
      :data="fakeData"
      class="noneHoveTable"
    >
      <el-table-column label="合同编号" prop="" min-width="100"></el-table-column>
      <el-table-column label="未匹配发票数" prop="" min-width="120"></el-table-column>
      <el-table-column label="CIF售价" prop="" min-width="100"></el-table-column>
      <el-table-column label="运费" prop="" min-width="90"></el-table-column>
      <el-table-column label="FOB售价" prop="" min-width="100"></el-table-column>
      <el-table-column label="利润率" prop="" min-width="100"></el-table-column>
      <el-table-column label="汇率" prop="" min-width="90"></el-table-column>
      <el-table-column label="人民币售价" prop="" min-width="110"></el-table-column>
      <el-table-column label="报关数量" prop="" min-width="100"></el-table-column>
      <el-table-column label="报关单位" prop="" min-width="100"></el-table-column>
      <el-table-column label="PO" prop="po" min-width="100"></el-table-column>
      <el-table-column label="含税成本价￥" prop="" min-width="130"></el-table-column>
      <el-table-column label="SKU" prop="" min-width="100"></el-table-column>
      <el-table-column label="零件名" prop="" min-width="100"></el-table-column>
      <el-table-column label="shipment ID" prop="" min-width="120"></el-table-column>
      <el-table-column label="匹配" prop="status" min-width="80">
        <template #default="{ row }">
          <el-radio class="custom-radio" v-model="matchStatus" :label="row.id" size="large">{{ '' }}</el-radio>
        </template>
      </el-table-column>
    </el-table>
    <vab-pagination 
      :current-page="matchQueryForm.pageNo"
      :page-size="matchQueryForm.pageNo"
      :total="matchTotal"
      @current-change="handleMatchCurrentChange"
      @size-change="handleMatchSizeChange"
    />
    <template #footer>
      <div style="text-align: center;">
        <el-button>取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </vab-dialog>
  <el-image-viewer v-if="imagePreviewVisible" :url-list="imagePreviewList" @close="closeImagePreview" hide-on-click-modal />
</template>

<script lang="ts" setup>
defineOptions({
  name: 'VabInvoiceMatching'
})
import { Search, UploadFilled } from '@element-plus/icons-vue'
import { isEqual } from 'lodash'
import { CSSProperties } from 'vue'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

const dflag = ref<boolean>(false)
const props = defineProps<{
  invoiceMatchingVisible: boolean
}>()
watchEffect(() => {
  dflag.value = props.invoiceMatchingVisible
})
const emit = defineEmits<{
  updateInvoiceMatchingVisible: [value: boolean]
}>()
const closeInvoiceMatching = () => {
  emit('updateInvoiceMatchingVisible', false)
}

const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const closeImagePreview = () => {
  imagePreviewVisible.value = false
}
const showImagePreview = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
// 匹配可见
const matchVisible = ref<boolean>(false)
const matchStatus = ref<number>(0)
const total = ref<number>(0)

const fakeData = [
  {
    po: 'PO1234',
    status: 1,
    id: 1
  },
  {
    po: 'PO1234',
    status: 0,
    id: 2
  },
  {
    po: 'PO1234',
    status: 1,
    id: 3
  },
  {
    po: 'PO1234',
    status: 0,
    id: 4
  },
  {
    po: 'PO1234',
    status: 1,
    id: 5
  },
  {
    po: 'PO1234',
    status: 0,
    id: 6
  },
]
// 上传发票可见
const uploadInvoiceVisible = ref<boolean>(false)
// const invoiceList = ref<UploadUserFile[]>([])
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const listLoading = ref<boolean>(false)
const matchQueryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const matchTotal = ref<number>(0)
const matchListLoading = ref<boolean>(false)
const queryMatchData = () => {
  matchQueryForm.pageNo = 1
  // fetchMatchData()
}
const handleMatchCurrentChange = (value: number) => {
  matchQueryForm.pageNo = value
  // fetchMatchData()
}
const handleMatchSizeChange = (value: number) => {
  matchQueryForm.pageSize = value
  matchQueryForm.pageNo = 1
  // fetchMatchData()
}

const handleConfirm = () => {
  console.log(matchStatus.value)
}
// 展示匹配
const showMatch = (row: any) => {
  matchVisible.value = true
}
// 展示上传发票
const showUploadInvoice = () => {
  uploadInvoiceVisible.value = true
}
// 清空全部PO
const clearAllPO = async () => {
  $baseConfirm('确定要清空全部PO吗？', null, async () => {
    console.log(1);
    
  })
}
const handleDelAll = async () => {
  $baseConfirm('确定要全部删除吗？', null, async () => {
console.log(2);

  })
}
let copyRow: any
const cellClick = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
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
const clickCancel = (event: Event, value: any) => {
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
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  // fetchData()
}
const cellStyle = (data: {row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  if (data.columnIndex === 1 || data.columnIndex === 2 || data.columnIndex === 3 || data.columnIndex === 4 || data.columnIndex === 5) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
const matchCellStyle = (data: {row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  if (data.columnIndex === 0 || data.columnIndex === 12 || data.columnIndex === 13 || data.columnIndex === 14) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
const clearPadding = (data: {row: any, column: any, rowIndex: number, columnIndex: number}): string => {
  if (data.columnIndex === 10) {
    return 'clear-padding'
  }
  return ''
}
</script>

<style lang="scss" scoped>
.none {
  display: none;
}
.noneHoveTable {
  :deep() {
    .clear-padding {
      padding-top: 0;
      padding-bottom: 0;

      .cell {
        padding-left: 0;
        padding-right: 0;
      }
    }
    .el-checkbox {
      transform: scale(1.3);
      transform-origin: center;
    }
    .custom-radio {
      transform: scale(1.3);
      transform-origin: center;
      margin-right: -10px;
    }
  }
}
</style>