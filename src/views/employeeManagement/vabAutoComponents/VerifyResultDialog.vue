<template>
  <vab-dialog v-model="visible" title="验证结果" width="70%">
    <div v-if="verifyResult" style="margin-bottom: 12px">
      <el-alert
        :closable="false"
        show-icon
        :title="verifyResult.passed ? '全部通过，数据一致' : `发现 ${verifyResult.brokenList.length} 条异常记录`"
        :type="verifyResult.passed ? 'success' : 'error'"
      />
    </div>
    <el-table v-if="verifyResult && !verifyResult.passed" border :data="verifyResult.brokenList" max-height="500">
      <el-table-column label="姓名" min-width="100" prop="userName" />
      <el-table-column label="月份" min-width="100" prop="month" />
      <el-table-column label="类型" min-width="100">
        <template #default="{ row }">{{ row.type === 0 ? '考核数' : '完成数' }}</template>
      </el-table-column>
      <el-table-column label="OEM" min-width="100">
        <template #default="{ row }">{{ row.oem === 1 ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column label="调整前" min-width="100" prop="beforeQuantity" />
      <el-table-column label="调整量" min-width="100" prop="adjustQuantity" />
      <el-table-column label="调整后" min-width="100" prop="afterQuantity" />
      <el-table-column label="上条调整后" min-width="100" prop="prevAfter" />
      <el-table-column label="单条验算" min-width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="row.selfCheckPassed ? 'success' : 'danger'">
            {{ row.selfCheckPassed ? '通过' : '异常' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="链式验算" min-width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="row.chainCheckPassed ? 'success' : 'danger'">
            {{ row.chainCheckPassed ? '通过' : '异常' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { ICheckoutVerifyResp } from '/@/type/employeeManagement/performanceStatistics'

defineOptions({
  name: 'VerifyResultDialog',
})

const visible = defineModel<boolean>({ default: false })
const props = defineProps<{
  verifyResult: ICheckoutVerifyResp | null
}>()
</script>
