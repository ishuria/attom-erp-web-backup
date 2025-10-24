<template>
  <div class="department-management-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button :icon="Plus" type="primary" @click="handleShowAddDialog">添加</el-button>
        <!-- <el-button :icon="Delete" type="danger" @click="handleDelete">批量删除</el-button> -->
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form inline :model="queryForm" @submit.prevent>
          <!-- <el-form-item>
            <el-input v-model.trim="queryForm.label" clearable placeholder="请输入名称" />
          </el-form-item> -->
          <!-- <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button :icon="Refresh" @click="resetQueryForm">重置</el-button>
          </el-form-item> -->
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      ref="tableRef"
      v-loading="listLoading"
      border
      :data="list"
      default-expand-all
      :row-class-name="getRowClassName"
      row-key="id"
      :tree-props="{ children: 'children' }"
    >
      <!-- <el-table-column type="selection" width="38" /> -->
      <el-table-column align="center" label="姓名" prop="userName">
        <template #default="{ row }">
          <div class="text-left" :class="{ 'has-children': row.children && row.children.length > 0 }">
            {{ row.userName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上级" prop="supervisorName" />
      <!-- <el-table-column align="center" label="排序" prop="order" /> -->
      <el-table-column align="center" label="创建时间" min-width="160" prop="createTime" show-overflow-tooltip />
      <!-- <el-table-column align="center" label="操作" width="150">
          <template #default="{ row }">
            <el-button text type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button :disabled="!row.parentValue" text type="primary" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column> -->
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>

    <!-- <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    /> -->
    <!-- <department-management-edit ref="editRef" @fetch-data="fetchData" /> -->
    <!-- 添加 -->
    <vab-dialog v-model="addDialogVisible" title="添加人员" width="15%">
      <el-form :model="addForm" style="margin-left: 0; margin-right: 0">
        <el-form-item label="姓名" prop="userId">
          <el-select v-model.trim="addForm.userId" filterable placeholder="请选择添加人员">
            <el-option v-for="item in addUserList" :key="item.userId" :label="item.userName" :value="item.userId" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">添加</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { addPersonLevelUser, getAddUserList, getSupervisorList, updatePersonLevel } from '/@/api/devlocal/user'
import { IGetAddUserListResp } from '/@/type/user/userType'
// @ts-ignore
import Sortable from 'sortablejs'
defineOptions({
  name: 'Department',
})

const tableRef = ref<TableInstance>()
const editRef = ref<any>(null)
const list = ref<any>([])
const listLoading = ref<boolean>(false)
const addDialogVisible = ref<boolean>(false)
const addForm = reactive<any>({
  userId: '',
  supervisorId: '',
})
const addUserList = ref<IGetAddUserListResp[]>([])
const total = ref<number>(0)
const selectRows = ref<any>([])
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  label: '',
})
const fakeData = [
  {
    id: 1,
    label: '主管1',
    parentValue: null,
    order: 1,
    createTime: '2025-05-28 18:04:00',
    children: [
      {
        id: 2,
        label: 'Bob',
        parentValue: '主管1',
        order: 1,
        createTime: '2025-05-28 18:05:00',
        children: [
          {
            id: 3,
            label: 'Charlie',
            parentValue: 2,
            order: 1,
            createTime: '2025-05-28 18:06:00',
            children: [],
          },
        ],
      },
    ],
  },
]
const handleShowAddDialog = async () => {
  await fetchAddUserList()
  addDialogVisible.value = true
}
const handleAdd = async () => {
  const { data } = await addPersonLevelUser({ userId: addForm.userId })
  if (data) {
    $baseMessage('添加成功', 'success', 'hey')
    fetchData()
    addDialogVisible.value = false
  } else {
    $baseMessage('添加失败', 'error', 'hey')
  }
}
const setSelectRows = (value: string) => {
  selectRows.value = value
}

// 给表格行添加拖拽类名
const getRowClassName = ({ row }: { row: any }) => {
  return 'draggable-table-row'
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getSupervisorList()
  list.value = data
  listLoading.value = false

  // 数据加载完成后初始化拖拽功能
  initSortable()
}
const fetchAddUserList = async () => {
  const { data } = await getAddUserList()
  addUserList.value = data
}

// 拖拽相关逻辑
let sortableInstance: Sortable | null = null
const activeRows = ref<any[]>([])

// 将树数据转化为平铺数据
const treeToTile = (treeData: any[], childKey = 'children') => {
  const arr: any[] = []
  const expanded = (data: any[]) => {
    if (data && data.length > 0) {
      data
        .filter((d) => d)
        .forEach((e) => {
          arr.push(e)
          expanded(e[childKey] || [])
        })
    }
  }
  expanded(treeData)
  return arr
}

const initSortable = () => {
  nextTick(() => {
    const tbody = tableRef.value?.$el.querySelector('.el-table__body-wrapper tbody')

    if (tbody && !sortableInstance) {
      sortableInstance = new Sortable(tbody, {
        // 移除 handle 限制，让整行都能拖拽
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        // onStart: (evt: any) => {
        //   console.log('拖拽开始:', evt)
        // },
        onMove: (evt: any) => {
          // console.log('拖拽移动中:', evt)
          activeRows.value = treeToTile(list.value) // 把树形的结构转为列表再进行拖拽
          return true // 允许移动
        },
        onEnd: async (evt: any) => {
          // console.log('拖拽结束:', evt)
          const oldRow = activeRows.value[evt.oldIndex] // 移动的那个元素
          const newRow = activeRows.value[evt.newIndex] // 新的元素

          // 不允许跨层级拖拽
          if (oldRow.parentValue !== newRow.parentValue) {
            // ElMessage.warning('不允许跨级拖拽')
            // 重新获取数据
            fetchData()
            return false
          }

          // 拖拽方向
          const direction = evt.oldIndex > evt.newIndex ? 'up' : 'down'
          // console.log('拖拽方向:', direction)
          // console.log('移动的元素:', oldRow)
          // console.log('目标位置:', newRow)

          try {
            const { data } = await updatePersonLevel({
              userId: oldRow.userId,
              targetUserId: newRow.userId,
            })
            if (data) {
              $baseMessage('更新层级关系成功', 'success', 'hey')
            } else {
              $baseMessage('更新层级关系失败', 'error', 'hey')
            }
            await fetchData()
          } catch (error) {
            console.error('移动失败:', error)
            // 重新获取数据恢复原状态
            await fetchData()
          }
        },
      })
      // console.log('Sortable实例创建完成:', sortableInstance)
    } else {
      // console.log('无法创建Sortable实例:', { tbody: !!tbody, sortableInstance: !!sortableInstance })
    }
  })
}

onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.text-left {
  text-align: left;
  display: inline-block;
  width: 100px;
  padding-left: 8px;
}

/* 有子级的人员姓名高亮样式 */
.has-children {
  font-weight: bold;
  color: #409eff;
  background-color: #f0f9ff;
  padding: 4px 8px;
  border-radius: 4px;
  border-left: 3px solid #409eff;
}

.draggable-row {
  display: flex;
  align-items: center;
  cursor: move;
  padding: 4px 0;
}

.drag-handle-icon {
  margin-right: 8px;
  color: #999;
  font-size: 14px;
  cursor: move;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.drag-handle-icon:hover {
  color: #409eff;
  cursor: move;
}

/* 拖拽时的视觉反馈 */
:deep(.el-table__row) {
  transition: all 0.3s ease;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

/* 拖拽中的样式 */
:deep(.sortable-ghost) {
  opacity: 0.5;
  background-color: #e6f7ff;
}

:deep(.sortable-chosen) {
  background-color: #f0f9ff;
}

:deep(.sortable-drag) {
  background-color: #f0f9ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 表格行拖拽样式 */
:deep(.draggable-table-row) {
  cursor: move;
  transition: all 0.3s ease;
}

:deep(.draggable-table-row:hover) {
  background-color: #f5f7fa;
}

:deep(.draggable-table-row.sortable-ghost) {
  opacity: 0.5;
  background-color: #e6f7ff;
}

:deep(.draggable-table-row.sortable-chosen) {
  background-color: #f0f9ff;
}

:deep(.draggable-table-row.sortable-drag) {
  background-color: #f0f9ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transform: rotate(1deg);
}

/* 原生拖拽样式 */
.dragging {
  opacity: 0.5;
  background-color: #e6f7ff;
  transform: rotate(2deg);
}

.draggable-row:hover {
  background-color: #f5f7fa;
  cursor: move;
}
</style>
