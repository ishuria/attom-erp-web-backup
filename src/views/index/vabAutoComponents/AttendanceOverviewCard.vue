<template>
  <vab-card :body-style="{ height: '522px' }" class="attendance-overview-card" skeleton>
    <template #header>
      <vab-icon icon="align-top" />
      考勤概况
      <div class="right-select">
        <slot name="select"></slot>
      </div>
    </template>
    <el-table
      border
      :cell-style="{ textAlign: 'center' }"
      :data="list"
      :default-sort="{ prop: 'count', order: 'descending' }"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
      @sort-change="handleSortChange"
    >
      <el-table-column label="月份" min-width="100" prop="month" />
      <el-table-column label="姓名" min-width="100" prop="userName" />
      <el-table-column label="餐补次数" min-width="100" prop="count" sortable="custom" />
      <el-table-column label="缺卡" min-width="100" prop="sWorkCount" sortable="custom" />
      <el-table-column label="迟到次数" min-width="100" prop="lateCount" sortable="custom" />
      <el-table-column label="迟到时长" min-width="100" prop="lateDuration" sortable="custom" />
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
      </template>
    </el-table>
  </vab-card>
</template>

<script lang="ts" setup>
import { IGetFrontPageAttendanceOverview } from '~/src/type/index/frontPage'

defineOptions({
  name: 'AttendanceOverviewCard',
})
const props = defineProps<{
  list: IGetFrontPageAttendanceOverview[]
}>()
const emit = defineEmits<{
  (e: 'sort-change', data: { column: any; prop: string; order: any }): void
}>()
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  // console.log(prop, order)
  emit('sort-change', {
    column,
    prop,
    order,
  })
}
</script>

<style lang="scss" scoped>
.attendance-overview-card {
  position: relative;

  :deep(.el-card__header) {
    position: relative;

    display: flex;
    align-items: center;
  }

  .right-select {
    position: absolute;
    top: 50%;
    right: 10px;
    width: auto;
    height: 60px;
    line-height: 60px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    z-index: 10;
  }
  :deep(.el-table) {
    height: 100%;
  }
}
</style>
