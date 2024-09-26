<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <h2>供应商</h2>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel :span="24">
        <el-space>
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            :http-request="uploadExcelFile"
            :limit="1"
            :show-file-list="false"
          >
            <el-button type="primary">上传通用合同模板</el-button>
          </el-upload>
          <el-button type="primary" @click="handleDownLoad" :loading="downloadLoading">下载通用合同模板</el-button>
        </el-space>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table ref="tableRef" border stripe :data="list" @selection-change="setSelectRows" v-loading="listLoading" @cell-click="changeInput">
      <el-table-column align="center" label="供应商ID" width="75" prop="suppliserId">
        <template #default="{ row }">
          <span style="color: rgb(192, 192, 192)">{{ row.suppliserId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商名称" min-width="200" prop="suppliser" >
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
      <el-table-column align="center" label="税号" prop="taxNumber" min-width="100" >
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
      <el-table-column align="center" label="开户银行" min-width="230" prop="bank" >
        <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.bank" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.bank }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开户账号" min-width="160" prop="accountNumber" >
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
      <el-table-column align="center" label="旺旺ID" width="85" prop="wwId">
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
      <el-table-column align="center" label="特定模板" min-width="160" prop="templateUrl" >
        <template #default="{ row }">
          <el-upload 
            drag
            :limit="1"
            accept=".xlsx"
            :class="{hide: row.hide}"
            :file-list="row.fileList"
            :http-request="(file) => UploadRequestHandler(file, row)"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!-- <el-button type="primary">下载</el-button> -->
            <!-- <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过10M</div> -->
  	      </el-upload>
          <el-button v-if="row.fileList.length !== 0" type="primary"  text :underline="false" @click="handleDownLoadSpecialFile(row)">下载</el-button>
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
import { ArrowDown, Delete, Plus, Search } from '@element-plus/icons-vue'
import type { TableInstance, UploadFile } from 'element-plus'
import { doDelete, getList } from '/@/api/table'
import { useRoutesStore } from '/@/store/modules/routes'
import { useSettingsStore } from '/@/store/modules/settings'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleMatched, handleTabs } from '/@/utils/routes'
import { downloadProductSupplier, getProductSupplierList, updateProductSupplier, uploadProductSupplierFile, uploadProductSupplierSpecialFile } from '/@/api/devlocal/productInformation'
import { getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
import { UploadUserFile } from 'element-plus'
// import * as XLSX from 'xlsx'
import { BASE_API } from '/@/api/devlocal/api'
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
  const uploadForm = new FormData()
  uploadForm.append('file', params.file)
  uploadForm.append('suppliserId', row.suppliserId)
  const { data } = await uploadProductSupplierSpecialFile(uploadForm)
  if (data === true) {
    $baseMessage('特定合同模板上传成功', 'success', 'hey')
  }
}
const handleDownLoadSpecialFile = async (row: any) => {
  const { data } = await downloadProductSupplier({
    suppliserId: row.suppliserId
  })
  if (data === true) {
    $baseMessage('下载特定合同模板成功', 'success', 'hey')
  }
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
}

const setSelectRows = (value: string) => {
  selectRows.value = value
}



const handleDownLoad = async () => {
  // downloadLoading.value = true
  // const { response } = await downloadProductSupplier()
  // console.log(response);
      axios({
        url: `${BASE_API}/product/suppliser/download`,
        method: 'GET',
        // params: {
        //   suppliserId: 17, 
        // },
        responseType: 'blob', // 重要: 确保responseType为'blob'
      })
      .then((response) => {
        // console.log(response.data);
        // const url = window.URL.createObjectURL(new Blob([response.data]));
        // const link = document.createElement('a');
        // link.href = url;

        // // 从响应头中获取文件名（如果需要）
        // const contentDisposition = response.headers['content-disposition'];
        // console.log('contentDisposition', contentDisposition);
       

        // let fileName = 'downloadedFile';
        // if (contentDisposition) {
        //   const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        //   if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
        // }

        // link.setAttribute('download', fileName); // 设置下载文件名
        // document.body.appendChild(link);
        // link.click();
        // link.remove();
        // const blob = new Blob([response.data], {
        //     type: 'application/vnd.ms-excel'
        //   });
          
        //   let link = document.createElement('a');
        //   link.href = URL.createObjectURL(blob);
        //   link.setAttribute('download', '工作日志.xlsx');
        //   link.click();
        //   link.remove();
        let blob = new Blob([response.data], { type: 'application/ms-excel;charset=utf-8' });
        let downloadElement = document.createElement('a');
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = 'forbidden-words.xls'; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      })
      .catch((error) => {
        console.error('Download failed:', error);
      });

  // if(data === true) {
  //   downloadLoading.value = false
  //   $baseMessage('下载通用合同模板成功', 'success', 'hey')
  // }
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
.hide :deep(.el-upload-dragger) {
  display: none;
}
</style>