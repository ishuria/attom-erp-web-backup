<template>
  <vab-dialog v-model="visible" title="发货计划渠道管理" width="60%">
    <div class="shipping-plan-channel-container">
      <!-- 新增按钮 -->
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd">
          <vab-icon icon="add-line" />
          新增
        </el-button>
      </div>

      <!-- 数据表格 -->
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column align="center" label="序号" type="index" width="60" />
        <el-table-column align="center" label="发货计划日期" min-width="150">
          <template #default="{ row }">
            <el-date-picker
              v-if="row.isEditing"
              v-model="row.planDate"
              clearable
              placeholder="请选择日期"
              style="width: 100%"
              type="date"
              value-format="YYYY-MM-DD"
            />
            <span v-else>{{ row.planDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="渠道" min-width="150">
          <template #default="{ row }">
          <el-select v-model="row.channelId" >
            <el-option v-for="item in forwarderOption" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </template>
        </el-table-column>
        <el-table-column align="center" label="备注" min-width="200">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model="row.remark" placeholder="请输入备注" type="textarea" />
            <span v-else>{{ row.remark || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template #default="{ row, $index }">
            <template v-if="row.isEditing">
              <el-button link type="primary" @click="handleSave(row, $index)">保存</el-button>
              <el-button link type="info" @click="handleCancelEdit(row, $index)">取消</el-button>
            </template>
            <template v-else>
              <el-button link type="primary" @click="handleEdit(row, $index)">编辑</el-button>
              <el-button link type="danger" @click="handleDelete($index)">删除</el-button>
            </template>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, watch } from 'vue'
import { getChannelList } from '~/src/api/devlocal/encasement'

defineOptions({
  name: 'VabShippingPlanChannelDialog',
})

interface ShippingPlanChannel {
  id?: number
  planDate: string
  channel: string
  remark: string
  isEditing?: boolean
}

interface Props {
  data?: ShippingPlanChannel[]
}

interface Emits {
  (e: 'save', data: ShippingPlanChannel[]): void
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
})

const emit = defineEmits<Emits>()

// 使用 defineModel 替代 modelValue props + emit
const visible = defineModel<boolean>({ default: false })

const tableData = ref<ShippingPlanChannel[]>([])
const originalData = ref<Map<number, ShippingPlanChannel>>(new Map())

// 监听弹窗打开，复制数据
watch(visible, (newValue) => {
  if (newValue) {
    // 弹窗打开时，复制数据
    tableData.value = JSON.parse(JSON.stringify(props.data || []))
  } else {
    // 关闭时清空编辑状态
    originalData.value.clear()
  }
})
// 货代渠道选项
const forwarderOption = ref<any>([])
// 获取货代渠道
const fetchChannelOption = async () => {
  const { data } = await getChannelList()
  forwarderOption.value = data
}
// 新增
const handleAdd = () => {
  const newRow: ShippingPlanChannel = {
    planDate: '',
    channel: '',
    remark: '',
    isEditing: true,
  }
  tableData.value.unshift(newRow)
  // 保存原始数据
  originalData.value.set(0, { ...newRow })
}

// 编辑
const handleEdit = (row: ShippingPlanChannel, index: number) => {
  // 保存原始数据
  originalData.value.set(index, { ...row })
  row.isEditing = true
}

// 保存
const handleSave = (row: ShippingPlanChannel, index: number) => {
  // 验证必填字段
  if (!row.planDate) {
    ElMessage.warning('请选择发货计划日期')
    return
  }
  if (!row.channel) {
    ElMessage.warning('请输入渠道')
    return
  }

  row.isEditing = false
  originalData.value.delete(index)
  ElMessage.success('保存成功')
  
  // 触发保存事件
  emit('save', tableData.value)
}

// 取消编辑
const handleCancelEdit = (row: ShippingPlanChannel, index: number) => {
  const original = originalData.value.get(index)
  if (original) {
    // 如果是新增的行且取消编辑，则删除该行
    if (!original.id && index === 0) {
      tableData.value.splice(index, 1)
    } else {
      // 恢复原始数据
      Object.assign(row, original)
      row.isEditing = false
    }
    originalData.value.delete(index)
  }
}

// 删除
const handleDelete = async (index: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    tableData.value.splice(index, 1)
    ElMessage.success('删除成功')
    
    // 触发保存事件
    emit('save', tableData.value)
  } catch {
    // 用户取消删除
  }
}

// 关闭弹窗
const handleClose = () => {
  // 检查是否有未保存的编辑
  const hasEditing = tableData.value.some((item) => item.isEditing)
  if (hasEditing) {
    ElMessageBox.confirm('有未保存的修改，确定要关闭吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        visible.value = false
      })
      .catch(() => {
        // 用户取消关闭
      })
  } else {
    visible.value = false
  }
}
</script>

<style lang="scss" scoped>
.shipping-plan-channel-container {
  .toolbar {
    margin-bottom: 16px;
  }

  :deep(.el-table) {
    .el-input,
    .el-date-picker {
      width: 100%;
    }

    .el-textarea {
      .el-textarea__inner {
        min-height: 60px;
      }
    }
  }
}
</style>
