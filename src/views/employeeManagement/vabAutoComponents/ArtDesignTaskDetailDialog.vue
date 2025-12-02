<template>
  <vab-dialog v-model="visible" title="任务明细" width="40%">
    <el-table border :data="list" :header-cell-style="{ textAlign: 'center' }" max-height="700" stripe>
      <el-table-column align="left" label="SKU" :min-width="flexColumnWidth(list, 'SKU', 'sku')" prop="sku" />
      <el-table-column align="center" label="任务类型" min-width="100" prop="taskType" />
      <el-table-column align="center" label="产品定位" min-width="100" prop="positioning" />
      <el-table-column align="center" label="要求完成日期" min-width="120" prop="finishDate">
        <template #default="{ row }">
          {{ row.finishDate ? formatDate(new Date(row.finishDate)) : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="实际完成日期" min-width="120" prop="actualFinishDate">
        <template #default="{ row }">
          {{ row.actualFinishDate ? formatDate(new Date(row.actualFinishDate)) : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="提前完成天数" min-width="120" prop="advanceDays" />
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 500px" />
      </template>
    </el-table>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { formatDate } from '~/src/utils/dateUtils'
import { IGetArtDesignTaskList } from '/@/type/listingTask/imageTaskType'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'ArtDesignTaskDetailDialog',
})

const props = defineProps<{
  modelValue: boolean
  list: IGetArtDesignTaskList[]
}>()

const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const emit = defineEmits(['update:modelValue'])
</script>
