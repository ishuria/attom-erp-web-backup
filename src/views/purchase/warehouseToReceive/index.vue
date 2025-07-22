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
            <el-input v-model="row.name" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
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
            <el-input v-model="row.status" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
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
            <el-input v-model="row.address" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" min-width="100" prop="associates" >
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.associates" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.associates }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话" min-width="150" prop="phone" >
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.phone" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加人员" min-width="120" prop="createUserName" >
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.createUserName" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.createUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加日期" min-width="130" prop="createTime" >
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.createTime" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" min-width="160" prop="remarks" >
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.remarks" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
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
    <!-- 收货仓库 -->
    <vab-add-repository v-model="repositoryAddVisible" @submit="handleWarehouseSubmit" />
  </div>
</template>
  
<script lang="ts" setup>
import type { FormInstance, TableInstance } from 'element-plus'
import { isEqual } from 'lodash-es'
import { warehouseOption } from '../constantOption.ts'
import { addPurchaseRepository, delPurchaseRepository, getPurchaseRepository, updatePurchaseRepository } from '/@/api/devlocal/purchase'
import type { IgetPurchaseRepository } from '/@/type/purchase/ourInformationType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

defineOptions({
    name: 'WarehouseToReceive',
})
  
const tableRef = ref<TableInstance>()
const list = ref<IgetPurchaseRepository[]>([])
const listLoading = ref<boolean>(true)
const repositoryAddVisible = ref<boolean>(false)
const formRef = ref<FormInstance>()

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): any => {
  const index = data.columnIndex
  switch (index) {
    case 0: {        
      return {
        color: '#999',
        cursor: 'not-allowed',
        textAlign:'center'
      } 
    }
    case 4: {
      return {
        textAlign: 'left',
        cursor: 'pointer'
      }
    }
    case 1: 
    case 5: 
    case 6: 
    case 7: 
    case 8: 
    case 9: {
      return {
        textAlign: 'center',
        cursor: 'pointer'
      }
    }
    default: {
      return {
        textAlign:'center'
      }
    }
  }
}

const handleAdd = async () => {
  repositoryAddVisible.value = true
  formRef.value?.resetFields()
}
// 收货仓库提交新增
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
    try {
      // 执行失去焦点处理逻辑
      if (value.status === '正常') _status = 0
      else if (value.status === '停用') _status = 1
      await updatePurchaseRepository({...value, status: _status})
    } catch {
      Object.assign(value, copyRow)
    }
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