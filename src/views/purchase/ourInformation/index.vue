<template>
    <div class="comprehensive-table-container auto-height-container">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
  
      <el-table ref="tableRef" v-loading="listLoading" border :cell-style="cellStyle" :data="list" stripe @cell-click="changeInput">
        <el-table-column align="center" label="采购方ID" prop="purchaserId" width="100" />
        <el-table-column align="center" label="公司简称" min-width="200" prop="companyAbbreviation" >
          <template #default="{ row }">
            <div class="none">
                <el-input v-model="row.companyAbbreviation" type="text" @blur="clickCancle($event, row)" @keypress.enter="clickCancle($event, row)" />
            </div>
            <span>{{ row.companyAbbreviation }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="采购方全名" min-width="200" prop="purchaserFullName" >
          <template #default="{ row }">
            <div class="none">
                <el-input v-model="row.purchaserFullName" type="text" @blur="clickCancle($event, row)" @keypress.enter="clickCancle($event, row)" />
            </div>
            <span>{{ row.purchaserFullName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="报关模式" prop="customsDeclarationMode" width="180">
            <template #default="{ row }">
                <el-select v-model="row.customsDeclarationMode" style="min-width: 100%;" @change="handleModeChange(row)">
                    <el-option v-for="item in customsModeOption" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
            </template>
        </el-table-column>
        <el-table-column align="center" label="开户行" min-width="230" prop="accountOpeningBank" >
          <template #default="{ row }">
            <div class="none">
                <el-input v-model="row.accountOpeningBank" type="text" @blur="clickCancle($event, row)" @keypress.enter="clickCancle($event, row)" />
            </div>
            <span>{{ row.accountOpeningBank }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行账号" min-width="160" prop="bankAccountNumber" >
          <template #default="{ row }">
            <div class="none">
                <el-input v-model="row.bankAccountNumber" type="text" @blur="clickCancle($event, row)" @keypress.enter="clickCancle($event, row)" />
            </div>
            <span>{{ row.bankAccountNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="汇率"/>
        <el-table-column align="center" fixed="right" label="操作" width="160">
          <template #default="{ row }">
            <el-button text type="danger" :underline="false" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
      <!-- <default-table-edit ref="editRef" @fetch-data="fetchData" /> -->
      <!-- 我司信息 -->
      <vab-dialog 
        v-model="companyAddVisible" 
        :before-close="handlerCloseDialog" 
        class="moldDialog"
        title="我司信息"
        width="600"
      >
        <el-divider style="margin-top: 0;"/>
        <el-form ref="formRef" class="demo-form" label-position="right" label-width="auto" :model="form" :rules="rules" style="margin: 0 auto; width: 70%;">
          <el-form-item label="公司简称" prop="companyAbbreviation">
            <el-input v-model="form.companyAbbreviation" clearable />
          </el-form-item>
          <el-form-item label="采购方全名" prop="purchaserFullName">
            <el-input v-model="form.purchaserFullName" clearable />
          </el-form-item>
          <el-form-item label="报关模式" prop="customsDeclarationMode">
            <el-select v-model="form.customsDeclarationMode" placeholder="请选择报关模式" style="min-width: 100%;" >
              <el-option v-for="item in customsModeOption" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="开户行" prop="accountOpeningBank">
            <el-input v-model="form.accountOpeningBank" clearable />
          </el-form-item>
          <el-form-item label="银行账号" prop="bankAccountNumber">
            <el-input v-model="form.bankAccountNumber" clearable />
          </el-form-item>
        </el-form>
        <template #footer>
          <span>
            <el-button @click="handleCancle">退出</el-button>
            <el-button type="primary" @click="handleSubmit">确认</el-button>
          </span>
        </template>
      </vab-dialog>
    </div>
</template>
  
<script lang="ts" setup>
import type { FormInstance, TableInstance } from 'element-plus'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { addPurchaseCompany, delPurchaseCompany, getPurchaseCompanyList, updatePurchaseCompany } from '/@/api/devlocal/purchase';
import { isEqual } from 'lodash'
  
defineOptions({
    name: 'OurInformation',
})
  
const tableRef = ref<TableInstance>()
const list = ref<any>([])
const listLoading = ref<boolean>(true)
const companyAddVisible = ref<boolean>(false)
const form = reactive<any>({})
const formRef = ref<FormInstance>()
  const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
     
     if  (data.columnIndex === 0 ){        
     
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
const clickCancle = async (event:any,value:any) =>{
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
      await updatePurchaseCompany(value)
    } catch {
      Object.assign(value, copyRow)
    }
  }
}
const handleModeChange = async (row: any) => {
  await updatePurchaseCompany({...row})
}
const fetchData = async () => {
    listLoading.value = true
    const { data } = await getPurchaseCompanyList()
    list.value = data
    listLoading.value = false
}

const customsModeOption = [
    { label: '买单', value: '买单' },
    { label: '退税（按整批）', value: '退税（按整批）' },
    { label: '退税（可分批）', value: '退税（可分批）' },
]
const rules = reactive<any>({
  companyAbbreviation: [
    { required: true, message: '请输入公司简称', trigger: 'blur' },
  ],
  purchaserFullName: [
    { required: true, message: '请输入采购方全名', trigger: 'blur' },
  ],
  customsDeclarationMode: [
    { required: true, message: '请选择报关模式', trigger: 'change' },
  ],
  accountOpeningBank: [
    { required: true, message: '请输入开户行', trigger: 'blur' },
  ],
  bankAccountNumber: [
    { required: true, message: '请输入银行账号', trigger: 'blur' },
  ],
})
const handlerCloseDialog = () => {
  companyAddVisible.value = false
}
const handleCancle = () => {
  companyAddVisible.value = false
}
const handleAdd = async () => {
  companyAddVisible.value = true
  formRef.value?.resetFields()
}
const handleSubmit = async () => {
  formRef.value?.validate((valid: any) => {
    if (valid) {
      const addCompany = async () => {
  
        const { data } = await addPurchaseCompany({...form})
        if (data) {
          $baseMessage('新增成功', 'success', 'hey')
          list.value.push(form)
          fetchData()
        } else {
          $baseMessage('新增失败', 'error', 'hey')
        }
      }
      addCompany()
      companyAddVisible.value = false
    }
    else $baseMessage('表单提交失败', 'error', 'hey')
  })
}
const handleDelete = (row: any) => {

    $baseConfirm('您确定要删除当前项吗', null, async () => {
      const { data } = await delPurchaseCompany({ purchaserId: row.purchaserId })
      if (data) {
        $baseMessage('删除成功', 'success', 'hey')
        fetchData()
      }
    })

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
:deep(.moldDialog .el-dialog__body) { 
  padding-top: 0;
}
</style>