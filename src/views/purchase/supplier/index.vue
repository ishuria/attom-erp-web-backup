<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary">
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            :http-request="uploadExcelFile"
            :limit="1"
            :show-file-list="false"
          >
            <el-link style="color: #fff" type="primary" :underline="false">上传通用合同模板</el-link>
          </el-upload>
        </el-button>
          <el-button :loading="downloadLoading" type="primary" @click="handleDownLoad">下载通用合同模板</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel >
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"/>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table ref="tableRef" border :cell-style="cellStyle" :data="list" :header-cell-style="{ textAlign: 'center' }" stripe @cell-click="changeInput" @selection-change="setSelectRows" >
      <el-table-column align="center" fixed="left" label="供应商ID" prop="suppliserId" width="75"/>
      <el-table-column fixed="left" label="供应商名称" prop="suppliser" :width="flexColumnWidth(list, '供应商名称', 'suppliser')" >
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.suppliser" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.suppliser }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优先打包" prop="packing" width="100">
        <template #default = "{ row }">
            <el-checkbox v-model="row.packing" class="custom-checkbox" :false-value="0" :true-value="1" @change="handlePackingChange(row)"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="税号" min-width="200" prop="taxNumber" >
        <template #default="{ row }">
            <div class="none">
                <el-input v-model.trim="row.taxNumber" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.taxNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="address" :width="flexColumnWidth(list, '地址', 'address')" >
        <template #default="{ row }">
            <div class="none">
                <el-input v-model="row.address" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="开票电话" min-width="150" prop="telephone" >
        <template #default="{ row }">
            <div class="none">
                <el-input v-model.trim="row.telephone" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.telephone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户银行" prop="bank" :width="flexColumnWidth(list, '开户银行', 'bank')" >
        <template #default="{ row }">
            <div class="none">
                <el-input v-model="row.bank" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.bank }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开户账号" min-width="230" prop="accountNumber" >
        <template #default="{ row }">
            <div class="none">
                <el-input v-model.trim="row.accountNumber" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.accountNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联行号" min-width="160" prop="bankRoutingNumber" >
        <template #default="{ row }">
            <div class="none">
                <el-input v-model.trim="row.bankRoutingNumber" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.bankRoutingNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" prop="contactPerson" width="100" >
        <template #default="{ row }">
            <div class="none">
                <el-input v-model="row.contactPerson" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.contactPerson }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人电话" min-width="150" prop="contactNumber" >
        <template #default="{ row }">
            <div class="none">
                <el-input v-model.trim="row.contactNumber" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.contactNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实际税点专票" prop="actualZTaxRate" width="100">
        <template #header>
          实际税点<br>专票
        </template>
        <template #default="{ row }">
            <div class="none">
                <el-input v-model.trim="row.actualZTaxRate" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.actualZTaxRate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开票税点专票" prop="invoicingZTaxRate" width="100">
          <template #header>
              开票税点<br>专票
          </template>
          <template #default="{ row }">
            <div class="none">
                <el-input v-model.trim="row.invoicingZTaxRate" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.invoicingZTaxRate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实际税点普票" prop="actualPTaxRate" width="100">
        <template #header>
            实际税点<br>普票
        </template>
        <template #default="{ row }">
            <div class="none">
                <el-input v-model.trim="row.actualPTaxRate" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.actualPTaxRate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开票税点普票" prop="invoicingPTaxRate" width="100">
          <template #header>
              开票税点<br>普票
          </template>
          <template #default="{ row }">
            <div class="none">
                <el-input v-model.trim="row.invoicingPTaxRate" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.invoicingPTaxRate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="旺旺ID" prop="wwId" width="125">
        <template #default="{ row }">
            <div class="none">
                <el-input v-model="row.wwId" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.wwId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用特定合同模板" prop="templateStatus" width="100">
        <template #default = "{ row }">
            <el-checkbox v-model="row.templateStatus" class="custom-checkbox" :false-value="0" :true-value="1"  @change="handleTemplateStatus(row)"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="特定模板" min-width="100" prop="templateUrl" >
        <template #default="{ row }">
          <el-upload action="#" class="custom-upload" :class="{ hide: row.hide }" :file-list="row.fileList" :http-request="(file) => UploadRequestHandler(file, row)" list-type="picture-card">
            <el-icon><plus /></el-icon>

            <template #file="">
              <div class="file-item">
                <el-icon class="file-icon"><document /></el-icon>
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handleDownLoadSpecialFile(row)"
                  >
                    <el-icon><download /></el-icon>
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleDelFile(row)"
                  >
                    <el-icon><delete /></el-icon>
                  </span>
              </span>
              </div>
            </template>
          </el-upload>
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
  </div>
</template>

<script lang="ts" setup>
import { Delete, Document, Download, Plus, Search } from '@element-plus/icons-vue'
import type { TableInstance, UploadUserFile } from 'element-plus'
import { isEqual } from 'lodash'
import { downloadFile } from '/@/api/devlocal/download'
import { getProductSupplierList, updateProductSupplier, uploadProductSupplierFile, uploadProductSupplierSpecialFile } from '/@/api/devlocal/productInformation'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { flexColumnWidth } from '/@/utils/tableColum'
// import * as XLSX from 'xlsx'
defineOptions({
  name: 'DefaultTable',
})

const tableRef = ref<TableInstance>()

const list = ref<any>([])
const listLoading = ref<boolean>(true)
const total = ref<number>(0)
const selectRows = ref<any>([])
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const downloadLoading = ref<boolean>(false)
const fileList = ref<UploadUserFile[]>([])
const uploadExcelFile = async (params: any) => {
  const uploadForm = new FormData()
  uploadForm.append('file', params.file)
  const { data } = await uploadProductSupplierFile(uploadForm)
  if (data === true) {
    $baseMessage('上传通用合同模板成功', 'success', 'hey')
  }
}
const UploadRequestHandler = async (params: any, row: any) => {
  row.hide = true
  const uploadForm = new FormData()
  uploadForm.append('file', params.file)
  uploadForm.append('suppliserId', row.suppliserId)
  const { data } = await uploadProductSupplierSpecialFile(uploadForm)
  if (data === true) {
    $baseMessage('特定合同模板上传成功', 'success', 'hey')
    row.fileList = [{ url: data }]
  }
}
const handleDownLoadSpecialFile = async (row: any) => {
  await downloadFile("/product/suppliser/download",{
    suppliserId: row.suppliserId, 
  }).then((res) => {
    console.log(res);
  }).catch((error) => {
    console.error(error);
  })
}
const handleDelFile = async (row: any) => {
  row.hide = false
  row.fileList = []
  row.templateStatus = 0
  await updateProductSupplier(row)
}
let copyRow: any
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => { 
  
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
  
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    try {
      await updateProductSupplier(value)
      await fetchData()
    } catch {
      // 更新失败时，恢复为原始值
      Object.assign(value, copyRow)
    }
  }
}
const handlePackingChange = async (row: any) => {
  await updateProductSupplier(row)
  fetchData()
}
const handleTemplateStatus = async (row: any) => {
  if (row.templateStatus === 1 && row.fileList.length === 0) {
      $baseMessage('未上传特定模板，无法勾选。', 'error')
      row.templateStatus = 0
      return
    }
  await updateProductSupplier(row)
  fetchData()
}

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getProductSupplierList(queryForm)
  list.value = data.list
  total.value = data.total
  list.value.forEach((item: any) => {
    if(!item.templateUrl) {
      item.hide = false
      item.fileList = []
    } else if (item.templateUrl) {
      item.hide = true
      item.fileList = [{ url: item.templateUrl }]
    }
  })
  listLoading.value = false
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

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
  // if(!queryForm.keyWord) {
  //       fetchData()
  //   } else {
  //       listLoading.value = true
  //       const queryList = ref<any>()
  //       queryList.value = list.value.filter((item: any) => item.suppliser.includes(queryForm.keyWord, 0))
  //       list.value = queryList.value
  //       total.value = list.value.length
  //       listLoading.value = false
  //   }
}

const setSelectRows = (value: string) => {
  selectRows.value = value
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
   
   if  (data.columnIndex === 0){        
   
       return {
            color: '#bbb',
            cursor: 'not-allowed',
            textAlign:'center'
        } 
   }
}

const handleDownLoad = async () => {
  await downloadFile("/product/suppliser/download",{})
}


onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
.none {
  display: none;
}
// 控制添加图片图标显示与隐藏
.hide :deep(.el-upload--picture-card) {
  display: none
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell) {
  background-color: #fff !important;
}
/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
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


.file-item {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: center;    /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  width: 100%;            /* 确保容器宽度 */
}
.file-icon {
  font-size: 50px; /* 调整大小 */
}
</style>