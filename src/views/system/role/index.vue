<template>
  <div class="role-management-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button v-permissions="{ permission: [RolePermission.ADD] }" :icon="Plus" type="primary" @click="handleEdit()">添加</el-button>
        <el-button v-permissions="{ permission: [RolePermission.MORE_DELETE] }" :icon="Delete" type="danger" @click="handleDelete()">批量删除</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.role" clearable placeholder="请输入角色" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData">查询</el-button>
            <el-button :icon="Refresh" @click="resetQueryForm">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table ref="tableRef" v-loading="listLoading" border :data="list" @selection-change="setSelectRows">
      <el-table-column type="selection" width="38" />
      <el-table-column align="center" label="角色id" prop="roleId" show-overflow-tooltip width="100" />
      <el-table-column align="center" label="角色代码" prop="roleCode" show-overflow-tooltip />
      <el-table-column align="center" label="角色名称" prop="roleName" show-overflow-tooltip />
      <el-table-column align="center" label="角色英文" prop="roleNameEn" show-overflow-tooltip />
      <el-table-column align="center" label="状态" prop="status" show-overflow-tooltip width="120">
        <template #default="{ row }">
          <el-tag v-if="row.status == 0" type="success">正常</el-tag>
          <el-tag v-if="row.status == 1" type="warning">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-permissions="RolePermission.operationColPermission()" align="center" label="操作" width="200">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: [RolePermission.EDIT] }" text type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button v-permissions="{ permission: [RolePermission.DELETE] }" text type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <role-edit ref="editRef" @fetch-data="fetchData" />
  </div>
</template>

<script lang="ts" setup>
import { Delete, Plus, Refresh, Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { doDelete, doDeleteList, getAllList } from '/@/api/devlocal/role'
import RolePermission from '/@/permissions/role'
import type { IRole, IRoleQuery } from '/@/type/role/roleType'

defineOptions({
  name: 'Role',
})

const tableRef = ref<TableInstance>()
const editRef = ref<any>(null)
const list = ref<IRole[]>([])
const listLoading = ref<boolean>(true)

const total = ref<number>(0)
const selectRows = ref<any>([])
const queryForm = reactive<IRoleQuery>({
  pageNo: 1,
  pageSize: 20,
  role: '',
})

const setSelectRows = (value: any) => {
  selectRows.value = value
}
const handleEdit = (row: any = {}) => {
  if (row.roleId) {
    editRef.value.showEdit(row)
  } else {
    editRef.value.showEdit()
  }
}
const handleDelete = (row: any = {}) => {
  if (row.roleId) {
    $baseConfirm('您确定要删除当前项吗', null, async () => {
      const { msg }: any = await doDelete({ ids: row.roleId })
      $baseMessage(msg, 'success', 'hey')
      await fetchData()
    })
  } else {
    if (selectRows.value.length > 0) {
      const ids = selectRows.value.map((item: any) => item.roleId).join(',')
      $baseConfirm('您确定要删除选中项吗', null, async () => {
        const { msg }: any = await doDeleteList({ ids })
        $baseMessage(msg, 'success', 'hey')
        await fetchData()
      })
    } else {
      $baseMessage('您未选中任何行', 'warning', 'hey')
    }
  }
}

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getAllList(queryForm)
  list.value = data.list
  total.value = data.total
  listLoading.value = false
}

const resetQueryForm = () => {
  ;(Object.keys(queryForm) as (keyof typeof queryForm)[]).forEach((key) => {
    if (key !== 'pageNo' && key !== 'pageSize') queryForm[key] = '' as never
  })
  queryForm.pageNo = 1
  queryData()
}

onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  fetchData()
})
</script>
