<template>
    <div class="comprehensive-table-container auto-height-container">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-button type="primary" @click="handleAdd">新增仓库</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
  
      <el-table ref="tableRef" v-loading="listLoading" border :cell-style="cellStyle" :data="list" stripe @cell-click="changeInput">
        <el-table-column align="center" label="仓库ID" prop="id" width="80" >
            <template #default="{ row }">
                <span style="color: rgb(192, 192, 192)">{{ row.id }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="仓库名称" min-width="200" prop="name" >
            <template #default="{ row }">
                <div class="none">
                    <el-input v-model="row.name" type="text" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.name }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="仓库性质" prop="characteristic" width="120">
            <template #default="{ row }">
                <el-select v-model="row.characteristic" style="min-width: 100%;" @change="handleCharacteristicChange(row)">
                    <el-option v-for="item in warehouseOption" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
            </template>
        </el-table-column>
        <el-table-column align="center" label="仓库状态" min-width="100" prop="status">
          <template #default="{ row }">
            <div class="none">
                <el-input v-model="row.status" type="text" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
            </div>
            <span>
              <el-tag :type="row.status === '正常' ? 'success' : 'danger'">
                {{ row.status === '正常' ? '正常' : '停用' }}
              </el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="仓库地址" min-width="230" prop="address" >
            <template #default="{ row }">
                <div class="none">
                    <el-input v-model="row.address" type="text" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.address }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="联系人" min-width="100" prop="associates" >
                        <template #default="{ row }">
                <div class="none">
                    <el-input v-model="row.associates" type="text" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.associates }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="电话" min-width="150" prop="phone" >
                        <template #default="{ row }">
                <div class="none">
                    <el-input v-model="row.phone" type="text" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.phone }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="添加人员" min-width="120" prop="createUserName" >
                        <template #default="{ row }">
                <div class="none">
                    <el-input v-model="row.createUserName" type="text" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.createUserName }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="添加日期" min-width="130" prop="createTime" >
                        <template #default="{ row }">
                <div class="none">
                    <el-input v-model="row.createTime" type="text" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.createTime }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="备注" min-width="160" prop="remarks" >
            <template #default="{ row }">
                <div class="none">
                    <el-input v-model="row.remarks" type="text" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.remarks }}</span>
            </template>
        </el-table-column>
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
      <!-- 收货仓库 -->
      <vab-add-repository v-model="repositoryAddVisible" @submit="handleWarehouseSubmit" />
      <!-- <vab-dialog 
        v-model="repositoryAddVisible" 
        :before-close="handlerCloseDialog" 
        class="moldDialog"
        title="收货仓库"
        width="600"
      >
        <el-divider style="margin-top: 0;"/>
        <el-form ref="formRef" class="demo-form" label-position="right" label-width="auto" :model="form" :rules="rules" style=" width: 70%;margin: 0 auto;">
          <el-form-item label="仓库名称" prop="name">
            <el-input v-model="form.name" clearable />
          </el-form-item>
          <el-form-item label="仓库性质" prop="characteristic">
            <el-select v-model="form.characteristic" placeholder="请选择仓库性质" style="min-width: 100%;" >
                <el-option v-for="item in warehouseOption" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择仓库状态" style="min-width: 100%;">
              <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
          </el-form-item>
          <el-form-item label="仓库地址" prop="address">
            <el-input v-model="form.address" clearable />
          </el-form-item>
          <el-form-item label="联系人" prop="associates">
            <el-input v-model="form.associates" clearable />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="form.phone" clearable />
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="form.remarks" clearable type="textarea" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span>
            <el-button @click="handleCancle">退出</el-button>
            <el-button type="primary" @click="handleSubmit">确认</el-button>
          </span>
        </template>
      </vab-dialog> -->
    </div>
  </template>
  
<script lang="ts" setup>
import type { FormInstance, TableInstance } from 'element-plus'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { addPurchaseRepository, delPurchaseRepository, getPurchaseRepository, updatePurchaseRepository } from '/@/api/devlocal/purchase';
import type { IgetPurchaseRepository } from '/@/type/purchase/ourInformationType';
import { isEqual } from 'lodash'
  
defineOptions({
    name: 'WarehouseToReceive',
})
  
const tableRef = ref<TableInstance>()
const list = ref<IgetPurchaseRepository[]>([])
const listLoading = ref<boolean>(true)
const repositoryAddVisible = ref<boolean>(false)
const formRef = ref<FormInstance>()
const form = reactive<any>({})
const rules = reactive<any>({
  name: [
    { required: true, message: '请输入仓库名称', trigger: 'blur' },
  ],
  address: [
    { required: true, message: '请输入仓库地址', trigger: 'blur' },
  ],
  characteristic: [
    { required: true, message: '请选择仓库性质', trigger: 'change' },
  ],
  status: [
    { required: true, message: '请选择仓库状态', trigger: 'change' },
  ],
  associates: [
    { required: true, message: '请输入联系人', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
  ],
})
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
const handlerCloseDialog = () => {
  repositoryAddVisible.value = false
}
const handleCancle = () => {
  repositoryAddVisible.value = false
}
const handleAdd = async () => {
  repositoryAddVisible.value = true
  formRef.value?.resetFields()
}
// const handleSubmit = async () => {
//   formRef.value?.validate((valid: any) => {
//     if (valid) {
//       const addRepository = async () => {
  
//         const { data } = await addPurchaseRepository({...form})
//         if (data) {
//           $baseMessage('新增成功', 'success', 'hey')
//           list.value.push(form)
//           fetchData()
//         } else {
//           $baseMessage('新增失败', 'error', 'hey')
//         }
//       }
//       addRepository()
//       repositoryAddVisible.value = false
//     }
//     else $baseMessage('表单提交失败', 'error', 'hey')
//   })
// }
// 修改提交处理方法
const handleWarehouseSubmit = async (formData: any) => {
  const { data } = await addPurchaseRepository(formData)
  if (data) {
    $baseMessage('新增成功', 'success', 'hey')
    fetchData()
  } else {
    $baseMessage('新增失败', 'error', 'hey')
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
  let _status = null
  if (event.type === 'blur') {
      // 执行失去焦点处理逻辑
      if (value.status === '正常') _status = 0
      else if (value.status === '停用') _status = 1
      await updatePurchaseRepository({...value, status: _status})
  }
}
const handleCharacteristicChange = async (row: any) => {
  let _status = null
  if (row.status === '正常') _status = 0
  else if (row.status === '停用') _status = 1
  await updatePurchaseRepository({...row, status: _status })
}
const handleDelete = (row: any) => {
  $baseConfirm('您确定要删除当前项吗', null, async () => {
    const { data } = await delPurchaseRepository({ repositoryId: row.id })
    if (data) {
      $baseMessage('删除成功', 'success', 'hey')
      fetchData()
    }
  })
}
const fetchData = async () => {
    listLoading.value = true
    const { data } = await getPurchaseRepository()
    list.value = data
    list.value.forEach((item: any) => {
      item.createTime = item.createTime.split(' ')[0]
      if(item.status === 0) item.status = '正常'
      else if (item.status === 1) item.status = '停用'
    })
    
    listLoading.value = false
}

const warehouseOption = [
    { label: '自有', value: 0 },
    { label: '供应商', value: 1 },
]
const statusOption = [
  { label: '正常', value: 0 },
  { label: '停用', value: 1 },
]


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
:deep(.moldDialog .el-dialog__body) { 
  padding-top: 0;
}
</style>