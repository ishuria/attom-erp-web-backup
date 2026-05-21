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
            <el-input v-model.trim="form.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table border class="noneHoverTable" :data="sampleReturnBonusList" :header-cell-style="{ textAlign: 'center' }" stripe>
      <el-table-column label="退款日期" min-width="120" prop="refundDate" />
      <el-table-column label="人员" min-width="120" prop="userName" />
      <el-table-column label="产品品名" min-width="120" prop="productName" />
      <el-table-column label="零件名" min-width="120" prop="componentName" />
      <el-table-column label="可退金额" min-width="120" prop="samplePrice" />
      <el-table-column label="实际退款" min-width="120" prop="refundAmount" />
      <el-table-column label="提成比例" min-width="120">
        <template #default="{ row }">
          {{ row.proportion ? row.proportion + '%' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="奖金" min-width="120" prop="price" />
      <el-table-column
        v-if="hasPermission({ permission: [CommissionPermission.COMMISSION_SAMPLE_BONUS_UPDATE] })"
        fixed="right"
        label="操作"
        width="100"
      >
        <template #default="{ row }">
          <el-link type="primary" underline="never" @click="showRefundUpdate(row)">修改</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="form.pageNo"
      :page-size="form.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <vab-dialog v-model="refundUpdateVisible" title="修改实际退款" width="20%">
      <el-form
        ref="refundUpdateFormRef"
        label-position="right"
        label-width="auto"
        :model="refundUpdateForm"
        :rules="refundUpdateFormRules"
        style="margin: 0"
      >
        <el-form-item label="实际退款" prop="refundAmount">
          <el-input v-model="refundUpdateForm.refundAmount" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="refundUpdateVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmRefundUpdate">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  getSampleReturnBonusDetailMonth,
  getSampleReturnBonusDetailUserList,
  querySampleReturnBonusDetailList,
  updateSampleBonusRefundAmount,
} from '/@/api/devlocal/commission.ts'
import { ROLE_PURCHASER_CODE, ROLE_PURCHASINGASSISTANT_CODE } from '/@/const/role.ts'
import CommissionPermission from '/@/permissions/commission.ts'
import { useAclStore } from '/@/store/modules/acl.ts'
import { useUserStore } from '/@/store/modules/user.ts'
import type { ISampleReturnBonusDetailList, ISampleReturnBonusQuery } from '/@/type/commission/sampleReturnBonusDetail.ts'
import { hasPermission } from '/@/utils/permission.ts'
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({
  name: 'SampleReturnBonusDetail',
})

const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const bonus = ref<number>(0)
const userList = ref<{ id: number; label: string }[]>([])
const currentRoleCode = useAclStore().getRole[0]
const sampleReturnBonusList = ref<ISampleReturnBonusDetailList[]>([])
const currentLoginUserName = useUserStore().username

const form = reactive<ISampleReturnBonusQuery>({
  keyWord: '',
  userId: -1,
  month: '',
  pageNo: 1,
  pageSize: 20,
})

const disabledSelect = computed(() => {
  return currentRoleCode === ROLE_PURCHASER_CODE || currentRoleCode === ROLE_PURCHASINGASSISTANT_CODE
})

const handleCurrentChange = (value: number) => {
  form.pageNo = value
  fetchData()
}

const handleSizeChange = (value: number) => {
  form.pageNo = 1
  form.pageSize = value
  fetchData()
}

const queryData = () => {
  form.pageNo = 1
  fetchData()
}

const fetchUserList = async () => {
  const { data } = await getSampleReturnBonusDetailUserList()
  userList.value = data
  userList.value.unshift({ id: -1, label: '全部' })
  if (disabledSelect.value) {
    form.userId = userList.value.find((item) => item.label === currentLoginUserName)?.id || -1
  }
}

const monthList = ref<string[]>([])
const fetchMonthList = async () => {
  const { data } = await getSampleReturnBonusDetailMonth()
  monthList.value = data
  form.month = monthList.value[0] || ''
}

const refundUpdateVisible = ref<boolean>(false)
const refundUpdateFormRef = ref<FormInstance>()
const refundUpdateForm = reactive<{ id: number; refundAmount: number | string }>({
  id: -1,
  refundAmount: '',
})
const refundUpdateFormRules = reactive<FormRules>({
  refundAmount: [{ required: true, message: '请输入实际退款', trigger: 'blur' }],
})

const showRefundUpdate = (row: ISampleReturnBonusDetailList) => {
  refundUpdateVisible.value = true
  refundUpdateForm.id = row.id
  refundUpdateForm.refundAmount = row.refundAmount
}

const handleConfirmRefundUpdate = async () => {
  refundUpdateFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await updateSampleBonusRefundAmount({
        id: refundUpdateForm.id,
        refundAmount: Number(refundUpdateForm.refundAmount),
      })
      if (data) {
        $baseMessage('修改实际退款成功！', 'success')
        refundUpdateVisible.value = false
        fetchData()
      }
    }
  })
}

const fetchData = async () => {
  listLoading.value = true
  const { data } = await querySampleReturnBonusDetailList(form)
  if (data) {
    total.value = data.total
    sampleReturnBonusList.value = data.list
    sampleReturnBonusList.value.forEach((item) => {
      if (item.proportion) {
        item.proportion = parseFloat((item.proportion * 100).toFixed(2))
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

<style scoped lang="scss"></style>
