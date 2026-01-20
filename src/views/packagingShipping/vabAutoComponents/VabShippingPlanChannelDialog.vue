<template>
  <vab-dialog v-model="visible" title="发货计划渠道配置" width="60%">
    <div class="shipping-plan-channel-container">
      <!-- 新增按钮 -->
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd">
          <vab-icon icon="add-line" />
          新增
        </el-button>
      </div>

      <!-- 数据表格 -->
      <el-table v-loading="loading" border :data="tableData" style="width: 100%">
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
            <span v-else>{{ row.planDate.split(' ')[0] || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="渠道" min-width="150">
          <template #default="{ row }">
            <el-select v-model="row.channelId" clearable filterable placeholder="请选择货代渠道">
              <el-option v-for="item in channelList" :key="item.id" :label="item.label" :value="item.id" />
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
import {
  addShipmentPlanChannelConfig,
  deleteShipmentPlanChannelConfig,
  getChannelList,
  queryShipmentPlanChannelConfigList,
  updateShipmentPlanChannelConfig,
} from '/@/api/devlocal/encasement'

defineOptions({
  name: 'VabShippingPlanChannelDialog',
})

interface ShippingPlanChannel {
  id?: number
  planDate: string
  channelId: number
  remark?: string
  isEditing?: boolean
}




// 使用 defineModel 替代 modelValue props + emit
const visible = defineModel<boolean>({ default: false })

const tableData = ref<ShippingPlanChannel[]>([])
const originalData = ref<Map<number, ShippingPlanChannel>>(new Map())
const loading = ref(false)

// 监听弹窗打开，加载数据
watch(visible, (newValue) => {
  if (newValue) {
    // 弹窗打开时，加载数据
    fetchData()
    fetchChannelOption()
  } else {
    // 关闭时清空编辑状态
    originalData.value.clear()
  }
})

// 货代渠道选项
const channelList = ref<any>([])

// 获取货代渠道列表
const fetchChannelOption = async () => {
  try {
    const { data } = await getChannelList()
    channelList.value = data
  } catch (error) {
    console.error('获取货代渠道列表失败:', error)
  }
}

// 加载数据
const fetchData = async () => {
  loading.value = true
  try {
    const { data } = await queryShipmentPlanChannelConfigList()
    // 转换后端数据格式为前端格式
    tableData.value = data.map((item: any) => ({
      id: item.id,
      planDate: item.shipmentPlanDate,
      channelId: item.channelId,
      remark: item.remark || '',
      isEditing: false,
    }))
  } catch (error) {
    console.error('加载发货计划渠道配置失败:', error)
    $baseMessage('加载数据失败', 'error')
  } finally {
    loading.value = false
  }
}
// 新增
const handleAdd = () => {
  const newRow: ShippingPlanChannel = {
    planDate: '',
    channelId: 0,
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
const handleSave = async (row: ShippingPlanChannel, index: number) => {
  // 验证必填字段
  if (!row.planDate) {
    $baseMessage('请选择发货计划日期', 'warning')
    return
  }
  if (!row.channelId) {
    $baseMessage('请选择货代渠道', 'warning')
    return
  }

  try {
    if (row.id) {
      // 更新
      await updateShipmentPlanChannelConfig({
        id: row.id,
        shipmentPlanDate: row.planDate,
        channelId: row.channelId,
        remark: row.remark,
      })
      $baseMessage('修改成功', 'success')
    } else {
      // 新增
      await addShipmentPlanChannelConfig({
        shipmentPlanDate: row.planDate,
        channelId: row.channelId,
        remark: row.remark,
      })
      $baseMessage('新增成功', 'success')
    }
    
    row.isEditing = false
    originalData.value.delete(index)
    
    // 刷新数据
    await fetchData()
    
  } catch (error) {
    console.error('保存失败:', error)
    $baseMessage('保存失败', 'error')
  }
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
  const row = tableData.value[index]
  
  // 如果是新增未保存的行，直接删除
  if (!row.id) {
    tableData.value.splice(index, 1)
    return
  }
  
    $baseConfirm('确定要删除这条记录吗？', null, async () => {
      await deleteShipmentPlanChannelConfig(row.id!)
      $baseMessage('删除成功', 'success')
      await fetchData()
   
    })
} 

// 关闭弹窗
const handleClose = () => {
  // 检查是否有未保存的编辑
  const hasEditing = tableData.value.some((item) => item.isEditing)
  if (hasEditing) {
    // 第3个参数是确认回调，第4个参数是取消回调
    $baseConfirm(
      '有未保存的修改，确定要关闭吗？',
      '提示',
      () => {
        // 确认：关闭弹窗
        visible.value = false
      },
      () => {
        // 取消：什么都不做（只关闭确认对话框）
      }
    )
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
