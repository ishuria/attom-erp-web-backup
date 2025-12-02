<template>
  <div>
    <vab-dialog v-model="visible" title="参数设定" width="16%">
      <el-form
        ref="parameterSettingsFormRef"
        :model="parameterSettingsForm"
        :rules="parameterSettingsRules"
        style="margin-left: 0; margin-right: 0; margin-bottom: 20px"
      >
        <el-form-item label="最大超额完成数" prop="count">
          <el-input v-model="parameterSettingsForm.count" clearable />
        </el-form-item>
      </el-form>
      <el-table border :data="list" @cell-click="cellClick">
        <el-table-column label="姓名" prop="userName" />
        <el-table-column class-name="editable-column" label="每月最少需要完成数" prop="minMonthlyAssessment">
          <template #default="{ row }">
            <div class="editable-cell" :class="{ 'show-border': editRow !== row }">
              <el-input
                v-if="editRow === row"
                ref="inputRef"
                v-model="row.minMonthlyAssessment"
                @blur="clickCancel(row)"
                @keydown.enter="clickCancel(row)"
              />
              <span v-else>{{ row.minMonthlyAssessment || '-' }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button type="primary" @click="updateParameterSettings">修改</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElInput, FormInstance } from 'element-plus'
import { isEqual } from 'lodash-es'
import {
  getMaximumOverfulfillment,
  getMinimumMonthlyAssessments,
  updateMaximumOverfulfillment,
  updateMinimumMonthlyAssessment,
} from '/@/api/devlocal/performanceStatistics'
import { IMinimumMonthlyAssessment } from '/@/type/employeeManagement/performanceStatistics'

defineOptions({
  name: 'ParameterSettingsDialog',
})

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      await fetchData()
      await fetchMinimumMonthlyAssessments()
    }
  }
)
const parameterSettingsForm = reactive<any>({
  count: undefined,
})
const parameterSettingsFormRef = ref<FormInstance>()
const parameterSettingsRules = reactive<any>({
  count: [{ required: true, message: '请输入最大超额完成数', trigger: 'blur' }],
})
const fetchData = async () => {
  const { data } = await getMaximumOverfulfillment()
  parameterSettingsForm.count = data
}
const list = ref<IMinimumMonthlyAssessment[]>([])
const fetchMinimumMonthlyAssessments = async () => {
  const { data } = await getMinimumMonthlyAssessments()
  list.value = data
}
const updateParameterSettings = async () => {
  parameterSettingsFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await updateMaximumOverfulfillment({
        number: parameterSettingsForm.count,
      })
      if (data) {
        $baseMessage('修改成功！', 'success')
      }
    }
  })
}

const copyRow = ref<IMinimumMonthlyAssessment | null>(null)
const editRow = ref<IMinimumMonthlyAssessment | null>(null)
const inputRef = ref()

// 单元格点击
const cellClick = (row: any, column: any) => {
  if (column.property === 'minMonthlyAssessment') {
    copyRow.value = JSON.parse(JSON.stringify(row))
    editRow.value = row

    nextTick(() => {
      // inputRef.value?.focus?.()
      const inputEl = inputRef.value?.input
      if (inputEl) {
        inputEl.focus()
        inputEl.select()
      }
    })
  }
}

// 输入框 blur 或 enter 时调用
const clickCancel = async (row: IMinimumMonthlyAssessment) => {
  editRow.value = null

  if (isEqual(row, copyRow.value)) return

  try {
    await updateMinimumMonthlyAssessment({
      id: row.id,
      number: row.minMonthlyAssessment,
    })
  } catch {
    Object.assign(row, copyRow.value)
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  :deep(.el-table__row) {
    height: 51px;
  }

  :deep(.editable-cell) {
    // 统一高度的边框盒子（仅在非编辑状态下出现）
    &.show-border {
      padding: 4px;
      border: 1px dotted transparent;

      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }
}
</style>
