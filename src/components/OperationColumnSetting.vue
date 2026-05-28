<template>
  <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
    <template #reference>
      <el-button>
        <vab-icon icon="settings-line" />
      </el-button>
    </template>
    <vab-draggable
      v-model="columns"
      :animation="600"
      filter=".non-draggable"
      handle=".handle"
      :on-end="handleEnd"
      :on-move="handleMove"
    >
      <div
        v-for="item in columns"
        :key="item.label"
        :class="{ 'non-draggable': item.disableCheck }"
        style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
      >
        <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
        <span style="flex: 1">{{ item.label }}</span>
        <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
          <vab-icon icon="eye-line" />
        </span>
        <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer" @click="handleChecked(item)">
          <vab-icon v-show="!item.checked" icon="eye-off-line" />
          <vab-icon v-show="item.checked" icon="eye-line" />
        </span>
      </div>
    </vab-draggable>
  </el-popover>
</template>

<script lang="ts" setup>
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { hideOrShowOperationColumn, updateSortOperationColumn } from '/@/api/devlocal/productPerformance'
import type { IGetOperationColumnList } from '/@/type/storeOperation/productPerformanceType'

const columns = defineModel<IGetOperationColumnList[]>('columns', { required: true })

defineOptions({
  name: 'OperationColumnSetting',
})

const handleMove = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns.value[targetIndex]?.disableCheck) {
    return false
  }

  return true
}

const handleEnd = async () => {
  const req = columns.value
    .filter((item) => item.columnId)
    .map((item, index) => {
      return {
        userId: item.userId,
        columnId: item.columnId,
        sort: index,
      }
    })
  await updateSortOperationColumn(req)
}

const handleChecked = async (item: IGetOperationColumnList) => {
  item.checked = !item.checked
  if (!item.columnId) return
  const status = item.checked ? 1 : 0
  await hideOrShowOperationColumn({
    userId: item.userId,
    columnId: item.columnId,
    status,
  })
}
</script>

<style lang="scss" scoped>
.handle {
  cursor: grab;
}

.disabled-handle {
  cursor: not-allowed;
}

.icon-dis {
  padding: 6px;
}

.icon-hover {
  padding: 6px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.icon-hover:hover {
  color: var(--el-color-primary);
  background-color: #f2f2f2;
}
</style>
