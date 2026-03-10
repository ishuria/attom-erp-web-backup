<template>
  <div>
    <vab-dialog v-model="visible" title="备注和日志" width="20%" @opened="handleDialogOpened">
      <div class="field-label">备注</div>
      <el-input ref="inputRef" v-model="remark" class="log-input" placeholder="请输入运营备注" :rows="5" type="textarea" />
      <div class="dialog-actions">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="success" @click="confirmUpdateRemark">保存</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
      <el-divider />
      <div class="field-label">日志</div>
      <!-- 输入区 -->
      <el-input ref="inputRef" v-model="operationLog" class="log-input" placeholder="请输入操作日志" :rows="5" type="textarea" />

      <!-- 按钮区 -->
      <div class="dialog-actions">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="success" @click="handleAdd">新增</el-button>
        <el-button type="primary" @click="confirmUpdateOperationLog">确定</el-button>
      </div>

      <!-- 历史标题 -->
      <div class="history-title">日志历史</div>

      <!-- 历史表格 -->
      <el-table border :data="list" max-height="600" stripe>
        <el-table-column label="日期" prop="date" width="160" />
        <el-table-column label="内容" prop="content" />
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
        </template>
      </el-table>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElInput } from 'element-plus'

defineOptions({
  name: 'OperationLogDialog',
})

const props = defineProps<{
  row: any
  // 获取历史日志，返回 { list }
  fetchHistoryLogApi: (row: any) => Promise<{ list: any[] }>
  // 新增/保存日志，返回是否成功
  addLogApi: (row: any, content: string) => Promise<boolean>
  // 更新备注
  updateRemarkApi: (row: any, remark: string) => Promise<boolean>
}>()
const visible = defineModel({ default: false })
const remark = ref<string>('')
const operationLog = ref<string>('')
const inputRef = ref<InstanceType<typeof ElInput> | null>(null)
const handleDialogOpened = () => {
  const textarea = inputRef.value?.$el.querySelector('textarea') as HTMLTextAreaElement
  if (textarea) {
    textarea.focus()
    textarea.setSelectionRange(0, 0) // 光标定位到开头
  }
}
const confirmUpdateOperationLog = async () => {
  const ok = await props.addLogApi(props.row, operationLog.value)
  if (ok) {
    $baseMessage('操作日志新增成功！', 'success')
    visible.value = false
  }
}
const handleAdd = async () => {
  const ok = await props.addLogApi(props.row, operationLog.value)
  if (ok) {
    $baseMessage('操作日志新增成功！', 'success')
    fetchHistoryLog()
  }
}
const confirmUpdateRemark = async () => {
  if (!props.updateRemarkApi) return
  const ok = await props.updateRemarkApi(props.row, remark.value)
  if (ok) {
    $baseMessage('运营备注修改成功！', 'success')
    props.row.operationRemark = remark.value
  }
}
const handleConfirm = async () => {
  if (!props.updateRemarkApi) return
  const ok = await props.updateRemarkApi(props.row, remark.value)
  if (ok) {
    $baseMessage('运营备注修改成功！', 'success')
    props.row.operationRemark = remark.value
    visible.value = false
  }
}
const list = ref<any[]>([])
const fetchHistoryLog = async () => {
  const { list: historyList } = await props.fetchHistoryLogApi(props.row)
  list.value = historyList ?? []
}
watch(
  () => visible.value,
  (val) => {
    if (val) {
      operationLog.value = ''
      remark.value = props.row.operationRemark || ''
      fetchHistoryLog()
    }
  }
)
</script>

<style lang="scss" scoped>
.field-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.log-input {
  margin-bottom: 12px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 4px;
}

.history-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}
</style>
