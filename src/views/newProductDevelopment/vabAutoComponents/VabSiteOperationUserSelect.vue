<template>
  <div style="margin-top: 20px; margin-bottom: 20px">
    <el-table border :data="distributionList" :header-cell-style="{ textAlign: 'center' }" stripe>
      <el-table-column label="站点" min-width="150" prop="siteName" />
      <el-table-column label="运营人员" min-width="200" prop="operationUserId">
        <template #default="{ row }">
          <el-select
            v-model="row.operationUserId"
            clearable
            :disabled="props.disabled"
            placeholder="请选择运营人员"
            @change="handleUpdateOperationUserId(row)"
          >
            <el-option v-for="item in props.operationUserList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { updateOperationDistribution } from '/@/api/devlocal/orderProcess'
import { IOperationDistributionList } from '/@/type/orderProcess/orderProcessType'

defineOptions({
  name: 'VabSiteOperationUserSelect',
})

interface IProps {
  operationUserList: { id: number; label: string }[]
  distributionList: IOperationDistributionList[]
  disabled: boolean
}
const props = withDefaults(defineProps<IProps>(), {})

// 更新运营人员
const handleUpdateOperationUserId = async (row: any) => {
  const { data } = await updateOperationDistribution({
    id: row.id,
    operationUserId: row.operationUserId,
  })
  if (data) {
    $baseMessage('更新运营人员成功', 'success')
  }
}
</script>
