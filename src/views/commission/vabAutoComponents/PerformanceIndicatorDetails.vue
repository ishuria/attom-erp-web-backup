<template>
  <vab-dialog v-model="visible" title="考核指标详情" width="40%">
    <el-table :data="indicatorList" border stripe>
      <el-table-column label="指标名" min-width="150" prop="indicator" />
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
