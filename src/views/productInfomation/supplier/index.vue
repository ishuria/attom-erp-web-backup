<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <h2>供应商</h2>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel>
        <el-button type="primary">
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            :http-request="uploadExcelFile"
            :limit="1"
            :show-file-list="false"
          >
            <el-link type="primary" style="color: #fff" :underline="false">上传通用合同模板</el-link>
          </el-upload>
        </el-button>
          <el-button type="primary" @click="handleDownLoad" :loading="downloadLoading">下载通用合同模板</el-button>

      </vab-query-form-left-panel>
      <vab-query-form-right-panel >
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
              @click="queryData"></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table ref="tableRef" border stripe :data="list" @selection-change="setSelectRows" @cell-click="changeInput" :cell-style="cellStyle" >
      <el-table-column align="center" label="供应商ID" width="75" prop="suppliserId">
      </el-table-column>
      <el-table-column align="center" label="供应商名称" min-width="300" prop="suppliser" >
        <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.suppliser" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.suppliser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优先打包" prop="packing" align="center" min-width="90">
        <template #default = "{ row }">
            <el-checkbox v-model="row.packing" :true-value="1" :false-value="0" class="custom-checkbox" @change="handlePackingChange(row)"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="税号" prop="taxNumber" min-width="200" >
        <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.taxNumber" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.taxNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地址" min-width="230" prop="address" >
        <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.address" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="开票电话" min-width="150" prop="telephone" >
        <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.telephone" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.telephone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开户银行" min-width="250" prop="bank" >
        <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.bank" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.bank }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开户账号" min-width="230" prop="accountNumber" >
        <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.accountNumber" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.accountNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联行号" min-width="160" prop="bankRoutingNumber" >
        <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.bankRoutingNumber" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.bankRoutingNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" min-width="100" prop="contactPerson" >
        <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.contactPerson" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.contactPerson }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人电话" min-width="150" prop="contactNumber" >
        <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.contactNumber" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.contactNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实际税点专票" prop="actualZTaxRate" min-width="90">
        <template #header>
          实际税点<br>专票
        </template>
        <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.actualZTaxRate" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.actualZTaxRate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开票税点专票" prop="invoicingZTaxRate" min-width="90">
          <template #header>
              开票税点<br>专票
          </template>
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.invoicingZTaxRate" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.invoicingZTaxRate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实际税点普票" prop="actualPTaxRate" min-width="90">
        <template #header>
            实际税点<br>普票
        </template>
        <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.actualPTaxRate" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.actualPTaxRate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开票税点普票" prop="invoicingPTaxRate" min-width="90">
          <template #header>
              开票税点<br>普票
          </template>
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.invoicingPTaxRate" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.invoicingPTaxRate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="旺旺ID" width="125" prop="wwId">
        <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.wwId" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.wwId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用特定合同模板" prop="templateStatus" align="center" min-width="90">
        <template #default = "{ row }">
            <el-checkbox v-model="row.templateStatus" :true-value="1" :false-value="0" class="custom-checkbox"  @change="handlePackingChange(row)"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="特定模板" min-width="100" prop="templateUrl" >
        <template #default="{ row }">
          <el-upload action="#" list-type="picture-card" :class="{ hide: row.hide }" :file-list="row.fileList" :http-request="(file) => UploadRequestHandler(file, row)" class="custom-upload">
            <el-icon><Plus /></el-icon>

            <template #file="{ file }">
              <div class="file-item">
                <el-icon class="file-icon"><Document /></el-icon>
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handleDownLoadSpecialFile(row)"
                  >
                    <el-icon><Download /></el-icon>
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleDelFile(row)"
                  >
                    <el-icon><Delete /></el-icon>
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
import type { TableInstance } from 'element-plus'
import { UploadUserFile } from 'element-plus'
import { downloadFile } from '/@/api/devlocal/download'
import { getProductSupplierList, updateProductSupplier, uploadProductSupplierFile, uploadProductSupplierSpecialFile } from '/@/api/devlocal/productInformation'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
// import * as XLSX from 'xlsx'
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
const fold = ref<boolean>(true)
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
const handleDelFile = (row: any) => {
  row.hide = false
  row.fileList = []
}
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  
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
      await updateProductSupplier(value)
      fetchData()
  }
}
const handlePackingChange = async (row: any) => {
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