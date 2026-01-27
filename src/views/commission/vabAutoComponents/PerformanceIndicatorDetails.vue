<template>
  <vab-dialog v-model="visible" title="考核指标详情" width="40%">
    <el-table border :data="indicatorList" stripe>
      <el-table-column label="指标名" min-width="150" prop="indicator" />
      <el-table-column label="实际指标" min-width="150">
        <template #default="{ row }">
          {{ row.actualValue !== undefined ? row.actualValue + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="考核指标" min-width="150">
        <template #default="{ row }">
          {{ row.targetValue !== undefined ? row.targetValue + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="不达标扣减指标" min-width="150" prop="stepValue">
        <template #default="{ row }">
          {{ row.stepValue !== undefined ? row.stepValue + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="不达标扣减比例" min-width="150" prop="deductionRatio">
        <template #default="{ row }">
          {{ row.deductionRatio !== undefined ? row.deductionRatio + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="调整比例" min-width="120" prop="adjustProportion">
        <template #default="{ row }">
          {{ row.adjustProportion !== undefined ? row.adjustProportion + '%' : '-' }}
        </template>
      </el-table-column>
    </el-table>
  </vab-dialog>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'PerformanceIndicatorDetails',
})

const visible = defineModel<boolean>({
  default: false,
})

const indicatorList = defineModel<any[]>('indicatorList', {
  default: () => [],
})
</script>
