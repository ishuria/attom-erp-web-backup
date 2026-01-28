<template>
  <vab-card v-loading="loading" :body-style="{ height: '422px' }" class="bonus-card" skeleton>
    <template #header>
      <vab-icon icon="align-top" />
      任务统计
      <div class="right-select">
        <el-date-picker
          :key="monthRangeKey"
          v-model="monthRange"
          :clearable="false"
          type="monthrange"
          value-format="YYYY-MM"
          @change="fetchData"
        />
      </div>
    </template>
    <el-table border :cell-style="{ textAlign: 'center' }" :data="list" :header-cell-style="{ textAlign: 'center' }" max-height="360">
      <el-table-column label="月份" prop="month" sortable width="100" />
      <el-table-column label="姓名" prop="userName" width="100" />
      <el-table-column label="新品任务数(按时完成率)" min-width="110" prop="newProductTaskCount" sortable>
        <template #header>
          新品任务数
          <br />
          (按时完成率)
        </template>
        <template #default="{ row }">
          <span>
            {{ row.newProductTaskCount }}
            <br />
            ({{ row.newProductOnTimeRate }}%)
          </span>
        </template>
      </el-table-column>
      <el-table-column label="老品任务数(按时完成率)" min-width="110" prop="oldProductTaskCount" sortable>
        <template #header>
          老品任务数
          <br />
          (按时完成率)
        </template>
        <template #default="{ row }">
          <span>
            {{ row.oldProductTaskCount }}
            <br />
            ({{ row.oldProductOnTimeRate }}%)
          </span>
        </template>
      </el-table-column>
      <el-table-column label="临时任务数(按时完成率)" min-width="110" prop="tempTaskCount" sortable>
        <template #header>
          临时任务数
          <br />
          (按时完成率)
        </template>
        <template #default="{ row }">
          <span>
            {{ row.tempTaskCount }}
            <br />
            ({{ row.tempTaskOnTimeRate }}%)
          </span>
        </template>
      </el-table-column>
      <el-table-column label="设计任务数(按时完成率)" min-width="110" prop="designTaskCount" sortable>
        <template #header>
          设计任务数
          <br />
          (按时完成率)
        </template>
        <template #default="{ row }">
          <span>
            {{ row.designTaskCount }}
            <br />
            ({{ row.designTaskOnTimeRate }}%)
          </span>
        </template>
      </el-table-column>

      <el-table-column label="任务总数(按时完成率)" min-width="110" prop="totalTaskCount" sortable>
        <template #header>
          任务总数
          <br />
          (按时完成率)
        </template>
        <template #default="{ row }">
          <span>
            {{ row.totalTaskCount }}
            <br />
            ({{ row.totalOnTimeRate }}%)
          </span>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 300px" />
      </template>
    </el-table>
  </vab-card>
</template>

<script setup lang="ts">
import { getArtDesignTaskStatistics } from '/@/api/devlocal/performanceStatistics'
import { IGetUserAttendanceList } from '/@/type/employeeManagement/performanceStatistics'
import { getCurrentMonth } from '/@/utils/dateUtils'

const list = ref<IGetUserAttendanceList[]>([])

const loading = ref<boolean>(false)
const monthRange = ref<[string, string]>([getCurrentMonth(), getCurrentMonth()])
const monthRangeKey = ref<number>(0)
const fetchData = async () => {
  //
  monthRangeKey.value++
  loading.value = true
  const { data } = await getArtDesignTaskStatistics({
    startMonth: monthRange.value[0],
    endMonth: monthRange.value[1],
    userId: -1,
  })
  list.value = data
  loading.value = false
}
onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.bonus-card {
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
}
</style>
