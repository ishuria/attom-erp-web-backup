<template>
  <div class="department-management-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button :icon="Plus" type="primary" @click="handleShowAddDialog">添加</el-button>
        <!-- <el-button :icon="Delete" type="danger" @click="handleDelete">批量删除</el-button> -->
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.label" clearable placeholder="请输入名称" />
          </el-form-item>
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
      row-key="id"
      :tree-props="{ children: 'children' }"
      @selection-change="setSelectRows"
    >
      <el-table-column type="selection" width="38" />
      <el-table-column align="center" label="姓名" prop="userName">
        <template #default="{ row }">
          <span class="text-left" :class="{ 'has-children': row.children && row.children.length > 0 }">
            {{ row.userName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上级" prop="supervisorName" />

      <el-table-column align="center" label="排序" prop="order" />
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
    <department-management-edit ref="editRef" @fetch-data="fetchData" />
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
import { addPersonLevelUser, getAddUserList, getSupervisorList } from '~/src/api/devlocal/user'
import { IGetAddUserListResp } from '~/src/type/user/userType'
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
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getSupervisorList()
  list.value = data
  listLoading.value = false
}
const fetchAddUserList = async () => {
  const { data } = await getAddUserList()
  addUserList.value = data
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
</style>
