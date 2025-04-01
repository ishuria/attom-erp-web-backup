<template>
  <div class="custom-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleOpenAdd">新增</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel >
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keyup.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"/>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table 
      v-loading="listLoading"
      border 
      :cell-style="cellStyle"
      class="noneHoverTable"
      :data="list" 
      :header-cell-style="{ textAlign: 'center' }"
      stripe
      @cell-click="changeInput"
    >
      <el-table-column label="Date" prop="createTime" width="115" >
        <template #default="{ row }">
          {{ row.createTime !== null ? formatDate(new Date(row.createTime)) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="客服来源" prop="customerServiceSourceId" width="130">
        <template #default="{ row }">
          <el-select v-model="row.customerServiceSourceId" placeholder="请选择客服来源" style="min-width: 100%;" @change="handleUpdateCustomerServiceSource(row)">
            <el-option 
              v-for="item in sourceList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="站点" prop="siteId" width="190">
        <template #default="{ row }">
          <el-select v-model="row.siteId" placeholder="请选择站点" @change="handleUpdateSite(row)">
            <el-option 
              v-for="item in siteList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="是否已回复" prop="isReplied" width="110">
        <template #default="{ row }">
          <el-checkbox v-model="row.isReplied" :false-value="0" :true-value="1" @change="handleUpdateIsReplied(row)" />
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="sku" />
      <el-table-column label="Order ID" prop="orderId" >
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.orderId" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.orderId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Customer Name" prop="customerName" >
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.customerName" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.customerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Issue" prop="issue" >
        <template #default="{ row }">
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.issue }}</div>
            </template>
            <el-text style="vertical-align: middle;" truncated>{{ row.issue }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="解决方案" prop="solution">
        <template #default="{ row }">
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.solution }}</div>
            </template>
            <el-text style="vertical-align: middle;" truncated>{{ row.solution }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="Tracking #/New Order ID" prop="trackNewOrder" >
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.trackNewOrder" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.trackNewOrder }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Follow Up" prop="followUp" >
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.followUp" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.followUp }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="100">
        <template #default="{ row, $index }">
          <el-link type="danger" :underline="false" @click="handleDelete(row.id, $index)">删除</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
    <vab-pagination 
      :page-no="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- 修改issue和解决方案 -->
    <vab-remark-dialog 
      :remark="remark"
      :remark-visible="remarkVisible"
      :title="title"
      @update:remark="handleUpdateRemark"
      @update:remark-visible="handleCloseRemark"
    />
    <!-- 新增 -->
    <vab-dialog
      v-model="addVisible"
      title="新增"
      width="20%"
    >
      <el-form ref="addFormRef" label-position="top" :model="addForm" :rules="addFormRules">
        <el-form-item label="SKU" prop="sku">
          <el-input v-model="addForm.sku" clearable />
        </el-form-item>
        <el-form-item label="客服来源" prop="customerServiceSourceId">
          <el-select v-model="addForm.customerServiceSourceId" placeholder="请选择客服来源">
            <el-option 
              v-for="item in sourceList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="站点" prop="siteId">
          <el-select v-model="addForm.siteId" placeholder="请选择站点">
            <el-option 
              v-for="item in siteList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Order ID" prop="orderId">
          <el-input v-model="addForm.orderId" clearable />
        </el-form-item>
        <el-form-item label="Customer Name" prop="customerName">
          <el-input v-model="addForm.customerName" clearable /> 
        </el-form-item>
        <el-form-item label="Issue" prop="issue">
          <el-input v-model="addForm.issue" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { isEqual } from 'lodash'
import type { CSSProperties } from 'vue'
import { addEmailAfterSales, deleteEmailAfterSales, getCustomerServiceSourceList, getEmailAfterSalesList, updateEmailAfterSales } from '/@/api/devlocal/emailAfterSales'
import { getDistributionSiteList } from '/@/api/devlocal/productDistribution'
import type { IGetEmailAfterSalesList, IGetEmailAfterSalesListReq } from '/@/type/storeOperation/emailAfterSales'
import { formatDate } from '/@/utils/dateUtils'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

const addFormRef = ref<FormInstance>()
const addForm = reactive<any>({})
const addFormRules = reactive<FormRules>({
  sku: [{ required: true, message: "请输入SKU", trigger: 'blur' }],
  customerServiceSourceId: [{ required: true, message: "请选择客服来源", trigger: 'change' }],
  siteId: [{ required: true, message: "请选择站点", trigger: 'change' }],
  orderId: [{ required: true, message: "请输入Order ID", trigger: 'blur' }],
  customerName: [{ required: true, message: "请输入Customer Name", trigger: 'blur' }],
  issue: [{ required: true, message: "请输入Issue", trigger: 'blur' }],
})
const addVisible = ref<boolean>(false)
const remarkVisible = ref<boolean>(false)
const remark = ref<string>('')
const title = ref<string>('')
const siteList = ref<{ id: number, label: string }[]>([])
const sourceList = ref<{ id: number, label: string }[]>([])
const list = ref<IGetEmailAfterSalesList[]>([])
const listLoading = ref<boolean>(false)
const queryForm = reactive<IGetEmailAfterSalesListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
let copyRow: IGetEmailAfterSalesList

const cellStyle = (data: { row: IGetEmailAfterSalesList, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const index = data.columnIndex
  if (index === 5 || index === 6 || index === 7 || index === 8 || index === 9 || index === 10) {
    return {
      cursor: 'pointer',
    }
  } else if (index === 4) {
    return {
      textAlign: 'left'
    }
  } else {
    return {
      textAlign: 'center'
    }
  }
}
const handleUpdateSite = async (row: IGetEmailAfterSalesList) => {
  await updateEmailAfterSales({
    id: row.id,
    siteId: row.siteId
  })
}
const handleUpdateCustomerServiceSource = async (row: IGetEmailAfterSalesList) => {
  await updateEmailAfterSales({
    id: row.id,
    customerServiceSourceId: row.customerServiceSourceId
  })
}
const handleUpdateIsReplied = async (row: IGetEmailAfterSalesList) => {
  await updateEmailAfterSales({
    id: row.id,
    isReplied: row.isReplied
  })
}
const handleAdd = async () => {
  addFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addEmailAfterSales(addForm)
      if (data) {
        $baseMessage("新增邮件售后记录成功!", "success")
        addVisible.value = false
        queryData()
      }
    }
  })
}
const handleOpenAdd = () => {
  addVisible.value = true
  addFormRef.value?.resetFields()
}
const handleCloseRemark = (value: boolean) => {
  remarkVisible.value = value
}
const handleUpdateRemark = async (value: string) => {
  if (title.value === "修改Issue") {
    const { data } = await updateEmailAfterSales({
      id: copyRow.id,
      issue: value
    })
    if (data) {
      $baseMessage(`${title.value}成功!`, 'success')
      copyRow.issue = value
      remarkVisible.value = false
    }
  } else {
    const { data } = await updateEmailAfterSales({
      id: copyRow.id,
      solution: value
    })
    if (data) {
      $baseMessage(`${title.value}成功!`, 'success')
      copyRow.solution = value
      remarkVisible.value = false
    }
  }
  
}
const handleDelete = async (id: number, index: number) => {
  $baseConfirm("确定要删除本条邮件售后信息吗?", null, async () => {
    const { data } = await deleteEmailAfterSales({ id })
    if (data) {
      $baseMessage("删除邮件售后信息成功!", 'success')
      list.value.splice(index, 1)
    }
  })
}
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {

  switch (column.label) {
    case 'Issue': {
      remarkVisible.value = true
      title.value = '修改Issue'
      remark.value = row.issue
      copyRow = row
      break;
    }
    case '解决方案': {
      remarkVisible.value = true
      title.value = '修改解决方案'
      remark.value = row.solution
      copyRow = row
      break;
    }
    default: {
      const firstChild = cell?.children[0]?.children[0]
      const secondChild = cell?.children[0]?.children[1]

      if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
        return
      }

      copyRow = JSON.parse(JSON.stringify(row))

      if (firstChild.classList.contains('none')) {
        firstChild.classList.remove('none')
        secondChild.classList.add('none')
        focusAndSelectInput(cell)
      }
    }
  }
}
// table blur事件
const clickCancel = async (event: any, value: any) => {
  const rootElement = getRootElement(event.srcElement, ".cell")

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add("none")
    if (t2) t2.classList.remove("none")
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    try {
      await updateEmailAfterSales({
        id: value.id,
        orderId: value.orderId,
        customerName: value.customerName,
        trackNewOrder: value.trackNewOrder,
        followUp: value.followUp
      })
    } catch {
      Object.assign(value, copyRow)
    }
  }
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getEmailAfterSalesList(queryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const fetchCustomerServiceSourceList = async () => {
  const { data } = await getCustomerServiceSourceList()
  sourceList.value = data
}
const fetchSiteList = async () => {
  const { data } = await getDistributionSiteList()
  siteList.value = data
}
onBeforeMount(() => {
  fetchCustomerServiceSourceList()
  fetchSiteList()
  fetchData()
})
</script>

<style lang="scss" scoped>
.noneHoverTable {
  .none {
    display: none;
  }
  .el-checkbox {
    transform: scale(1.3);
  }
  
}
.custom-tooltip {
  max-width: 400px; 
  font-size: var(--el-font-size-base);
  white-space: pre-wrap; 
}
</style>
