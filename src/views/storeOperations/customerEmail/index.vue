<template>
  <div class="custom-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary">新增</el-button>
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
      class="noneHoverTable"
      :data="list" 
      :header-cell-style="{ textAlign: 'center' }"
      stripe
      @cell-click="changeInput"
    >
      <el-table-column align="center" label="Date" prop="createTime" width="115" >
        <template #default="{ row }">
          {{ row.createTime !== null ? formatDate(new Date(row.createTime)) : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="客服来源" prop="customerServiceSourceId">
        <template #default="{ row }">
          <el-select v-model="row.customerServiceSourceId">
            <el-option 
              v-for="item in sourceList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="站点" prop="siteId" >
        <template #default="{ row }">
          <el-select v-model="row.siteId">
            <el-option 
              v-for="item in siteList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否已回复" prop="isReplied" width="110">
        <template #default="{ row }">
          <el-checkbox v-model="row.isReplied" :false-value="0" :true-value="1" />
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
      <el-table-column label="Customer Name" prop="customerId" >
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.customerId" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.customerId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Issue" prop="issue" />
      <el-table-column label="解决方案" prop="solution" />
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
    <vab-remark-dialog 
      :remark="remark"
      :remark-visible="remarkVisible"
      :title="title"
      @update:remark="handleUpdateRemark"
      @update:remark-visible="handleCloseRemark"
    />
    <vab-dialog
      v-model="addVisible"
      title="新增"
      width="20%"
      
    >
      <el-form>
        <el-form-item label="SKU" prop="sku">
          <el-input clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary">新增</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { isEqual } from 'lodash'
import { deleteEmailAfterSales, getCustomerServiceSourceList, getEmailAfterSalesList } from '/@/api/devlocal/emailAfterSales'
import type { IGetEmailAfterSalesList } from '/@/type/storeOperation/emailAfterSales'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { formatDate } from '/@/utils/dateUtils'
import { getDistributionSiteList } from '/@/api/devlocal/productDistribution'

const addVisible = ref<boolean>(false)
const remarkVisible = ref<boolean>(false)
const remark = ref<string>('')
const title = ref<string>('')
const siteList = ref<{ id: number, label: string }[]>([])
const sourceList = ref<{ id: number, label: string }[]>([])
const list = ref<IGetEmailAfterSalesList[]>([])
const listLoading = ref<boolean>(false)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
let copyRow: any

const handleCloseRemark = (value: boolean) => {
  remarkVisible.value = value
}
const handleUpdateRemark = (value: string) => {
  //
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
    
      break;
    }
    case '解决方案': {
      remarkVisible.value = true
      title.value = '修改解决方案'
      remark.value = row.solution
    
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
</style>
