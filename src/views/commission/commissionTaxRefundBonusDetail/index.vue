
<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item label="人员">
            <el-select v-model="form.userId" :disabled="disabledSelect" placeholder="请选择人员" @change="queryData">
              <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="发放月份">
            <el-select v-model="form.month" placeholder="请选择发放月份" @change="queryData">
              <el-option v-for="item in monthList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-text style="margin-left: 10px">提成总金额：</el-text>
            <el-text type="success">{{ bonus }}元</el-text>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="form" @submit.prevent>
          <el-form-item>
            <el-input
              v-model="form.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keyup.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      class="noneHoverTable"
      :data="taxRefundBonusList"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
    >

      <el-table-column label="匹配日期" min-width="120" prop="matchDate">
        <template #default="{ row }">
          {{ row.matchDate ? formatDate(new Date(row.matchDate)) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="Po" min-width="120" prop="po"/>
      <el-table-column label="Sku" min-width="120" prop="sku"/>
      <el-table-column label="零件名" min-width="120" prop="componentName"/>
      <el-table-column label="供应商" min-width="120" prop="supplier"/>
      <el-table-column label="状态" min-width="120">
        <template #default="{ row }">
          <el-tag v-if="row.status ==0" type="primary">已匹配发票</el-tag>
          <el-tag v-if="row.status ==1" type="danger">撤销发票匹配</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发票号码" min-width="120" prop="invoiceNumber"/>
      <el-table-column label="含税金额" min-width="120" prop="taxIncludingPrice"/>
      <el-table-column label="未税金额" min-width="120" prop="preTaxPrice"/>
      <el-table-column label="开票税点" min-width="120" prop="invoiceTaxRate"/>
      <el-table-column label="出口退税率" min-width="120">
        <template #default="{ row }">
          <span>{{row.exportRebateRate}}%</span>
        </template>
      </el-table-column>
      <el-table-column label="退税额" min-width="120" prop="taxRebate"/>
      <el-table-column label="奖金" min-width="120" prop="bonus"/>
      <el-table-column label="发票匹配人" min-width="120" prop="createUserName"/>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="form.pageNo"
      :page-size="form.pageSize"
      :total="total"
      @current-change="handleCostCurrentChange"
      @size-change="handleCostSizeChange"
    />

  </div>
</template>

<script setup lang="ts">

import {
  getTaxRefundBonusDetailMonth,
  getTaxRefundBonusDetailUserList, queryTaxRefundBonusDetailMonthList,
} from '/@/api/devlocal/commission.ts'
import { ROLE_PURCHASER_CODE, ROLE_PURCHASINGASSISTANT_CODE } from '/@/const/role.ts'
import { useAclStore } from '/@/store/modules/acl.ts'
import { useUserStore } from '/@/store/modules/user.ts'
import type { IGetReductionCostDetailListReq } from '/@/type/commission/commissionType.ts'
import { formatDate } from '/@/utils/dateUtils.ts'
import { Search } from '@element-plus/icons-vue'
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const bonus = ref<number>(0)
const userList = ref<{ id: number; label: string }[]>([])
const currentRoleCode = useAclStore().getRole[0]
const taxRefundBonusList = ref<any[]>([])
const currentLoginUserName = useUserStore().username

const form = reactive<IGetReductionCostDetailListReq>({
  keyWord: '',
  userId: -1,
  month: '',
  pageNo: 1,
  pageSize: 20,
})

const disabledSelect = computed(() => {
  return (
    currentRoleCode === ROLE_PURCHASER_CODE ||
    currentRoleCode === ROLE_PURCHASINGASSISTANT_CODE
  )
})

const handleCostCurrentChange = (value: number) => {
  form.pageNo = value
  fetchData()
}

const handleCostSizeChange = (value: number) => {
  form.pageNo = 1
  form.pageSize = value
  fetchData()
}

const queryData = () => {
  form.pageNo = 1
  fetchData()
}

const fetchUserList = async () => {
  const { data } = await getTaxRefundBonusDetailUserList()
  userList.value = data
  userList.value.unshift({ id: -1, label: '全部' })
  if (disabledSelect.value) {
    form.userId = userList.value.find((item) => item.label === currentLoginUserName)?.id || -1
  }
}


const monthList = ref<string[]>([])
const fetchMonthList = async () => {
  const { data } = await getTaxRefundBonusDetailMonth()
  monthList.value = data

  form.month = monthList.value[0] || ''
}

const fetchData = async () => {
  listLoading.value = true
  const {data} = await queryTaxRefundBonusDetailMonthList(form)
  if (data) {
    total.value = data.total
    taxRefundBonusList.value = data.list
    taxRefundBonusList.value.forEach((item) => {
      if (item.exportRebateRate) {
        item.exportRebateRate = parseFloat((item.exportRebateRate * 100).toFixed(2))
      }
    })
  }
  bonus.value = data.bonus || 0

  listLoading.value = false
}

onBeforeMount(async () => {
  await fetchMonthList()
  await fetchUserList()
  await fetchData()
})

</script>


<style scoped lang="scss">

</style>
