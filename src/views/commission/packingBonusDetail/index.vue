<template>
  <div class="comprehensive-table-container auto-height-container packing-bonus-detail">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form class="packing-bonus-query" inline :model="form" @submit.prevent>
          <el-form-item label="人员">
            <el-select v-model="form.userId" :disabled="!isBoss" placeholder="请选择" style="width: 270px" @change="queryData">
              <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="发放月份">
            <el-date-picker
              v-model="form.month"
              :clearable="false"
              placeholder="请选择发放月份"
              style="width: 220px"
              type="month"
              value-format="YYYY-MM"
              @change="queryData"
            />
          </el-form-item>
          <el-form-item>
            <div class="bonus-summary">
              <span class="bonus-summary__label">装箱总金额：</span>
              <span class="bonus-summary__amount">{{ bonus }}元</span>
              <span class="bonus-summary__time">（更新时间：{{ updateTime || '-' }}）</span>
            </div>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="form" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="form.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              style="width: 220px"
              @input="queryData"
              @keyup.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      border
      class="noneHoverTable"
      :data="packingBonusList"
      :header-cell-style="{ textAlign: 'left' }"
      stripe
    >
      <el-table-column label="发货日期" min-width="130" prop="shipmentDate">
        <template #default="{ row }">
          {{ formatDateText(row.shipmentDate) }}
        </template>
      </el-table-column>
      <el-table-column label="人员" min-width="120" prop="userName" />
      <el-table-column label="箱规号" min-width="150" prop="encasementNo" />
      <el-table-column label="实际总箱数" min-width="130" prop="actualTotalBoxCount" />
      <el-table-column label="装箱总人数" min-width="130" prop="encasementUserCount" />
      <el-table-column label="个人折算箱数" min-width="140" prop="personalDiscountBoxCount" />
      <el-table-column label="个人奖金" min-width="130" prop="personalBonus" />
      <el-table-column label="SHIPMENT ID" min-width="180" prop="shipmentId">
        <template #default="{ row }">
          <span v-if="row.shipmentId" class="copyable-text" @click="handleClip(row.shipmentId)">
            {{ row.shipmentId }}
            <el-icon class="copyable-text__icon"><copy-document /></el-icon>
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>

    <vab-pagination
      :current-page="form.pageNo"
      :page-size="form.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { CopyDocument, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { queryPackingBonusDetailList } from '/@/api/devlocal/commission'
import { getPackagePackagerList } from '/@/api/devlocal/packagingShipping'
import { ROLE_BOSS_CODE } from '/@/const/role.ts'
import { useAclStore } from '/@/store/modules/acl.ts'
import { useUserStore } from '/@/store/modules/user.ts'
import type { IPackingBonusDetailList, IPackingBonusQuery } from '/@/type/commission/packingBonusDetail.ts'
import { handleClip } from '/@/utils/clipboard'

defineOptions({
  name: 'PackingBonusDetail',
})

const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const bonus = ref<number>(0)
const updateTime = ref<string>('')
const userList = ref<{ id: number; label: string }[]>([])
const packingBonusList = ref<IPackingBonusDetailList[]>([])
const currentRoleCodeList = useAclStore().getRole
const userStore = useUserStore()
const isBoss = currentRoleCodeList.includes(ROLE_BOSS_CODE)
const currentLoginUserId = Number(userStore.getUserId)

const form = reactive<IPackingBonusQuery>({
  keyWord: '',
  userId: isBoss ? -1 : currentLoginUserId,
  month: dayjs().format('YYYY-MM'),
  pageNo: 1,
  pageSize: 50,
})

const formatDateText = (date?: string) => {
  return date ? date.split(' ')[0] : ''
}

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
  const { data } = await getPackagePackagerList()
  if (isBoss) {
    userList.value = [{ id: -1, label: '全部' }, ...(data ?? [])]
    return
  }

  const currentUser = data?.find((item) => item.id === currentLoginUserId)
  userList.value = [
    {
      id: currentLoginUserId,
      label: currentUser?.label || userStore.getUsername,
    },
  ]
  form.userId = currentLoginUserId
}

const fetchData = async () => {
  listLoading.value = true
  try {
    const { data } = await queryPackingBonusDetailList(form)
    total.value = data?.total ?? 0
    bonus.value = data?.bonus ?? 0
    updateTime.value = data?.updateTime ?? ''
    packingBonusList.value = data?.list ?? []
  } finally {
    listLoading.value = false
  }
}

onBeforeMount(async () => {
  await fetchUserList()
  await fetchData()
})
</script>

<style scoped lang="scss">
.packing-bonus-detail {
  .packing-bonus-query {
    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }

  .bonus-summary {
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    font-size: 14px;
    color: var(--el-text-color-primary);
    white-space: nowrap;
    margin-left: 15px;
  }

  .bonus-summary__label {
    font-weight: 600;
  }

  .bonus-summary__amount {
    color: var(--el-color-success);
  }

  .bonus-summary__time {
    margin-left: 4px;
    color: var(--el-text-color-primary);
  }

  .copyable-text {
    display: inline-flex;
    align-items: center;

    cursor: pointer;

    &:hover {
      color: var(--el-text-color-primary);
    }
  }

  .copyable-text__icon {
    margin-left: 4px;
  }
}
</style>
