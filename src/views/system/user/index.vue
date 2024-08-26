<template>
  <div class="user-management-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button :icon="Plus" type="primary" @click="handleAdd" v-permissions="{ permission: ['system:user:add'] }">添加</el-button>
        <el-button :icon="Delete" type="danger" @click="handleDelete" v-permissions="{ permission: ['system:user:more:delete'] }">
          批量删除
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.userName" @keyup.enter.native="queryData" clearable placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData">查询</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table ref="tableRef" v-loading="listLoading" border :data="list" @selection-change="setSelectRows">
      <el-table-column type="selection" width="38" />
      <el-table-column align="center" label="用户id" min-width="120" prop="userId" show-overflow-tooltip />
      <el-table-column align="center" label="用户名" min-width="120" prop="userName" />

      <el-table-column align="center" label="今年病假" min-width="120" prop="currentYearSickLeave" />
      <el-table-column align="center" label="明年病假" min-width="120" prop="nextYearSickLeave" />
      <el-table-column align="center" label="今年年假" min-width="120" prop="currentYearAnnualLeave" />
      <el-table-column align="center" label="明年年假" min-width="120" prop="nextYearAnnualLeave" />
      <el-table-column align="center" label="所属分公司" min-width="120" prop="affiliatedBranchCompany" />

      <el-table-column align="center" label="邮箱" min-width="220" prop="email" show-overflow-tooltip />

      <el-table-column align="center" label="角色" min-width="155">
        <template #default="{ row }">
          <el-space wrap>
            <el-tag v-if="row.roleName">
              {{ row.roleName }}
            </el-tag>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="120" prop="status" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag v-if="row.status == 0" type="success">正常</el-tag>
          <el-tag v-if="row.status == 1" type="warning">禁用</el-tag>
          <el-tag v-if="row.status == 2" type="danger">离职</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="160" prop="createTime" show-overflow-tooltip />
      <el-table-column align="center" label="操作" width="250" v-permissions="{ permission: ['system:user:edit', 'system:user:delete'] }">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['system:user:edit'] }" text type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button v-permissions="{ permission: ['system:user:delete'] }" text type="danger" @click="handleDelete(row)">删除</el-button>
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
    <user-edit ref="editRef" @fetch-data="fetchData" />
  </div>
</template>

<script lang="ts" setup>
import { Delete, Plus, Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { doDelete, doMostDelete, getList } from '/@/api/devlocal/user'
import {IUserQuery,IUserQueryReq} from '/@/type/user/userType'

defineOptions({
  name: 'User',
})

const tableRef = ref<TableInstance>()
const editRef = ref<any>(null)
const list = ref<IUserQuery[]>([])
const listLoading = ref<boolean>(true)

const total = ref<number>(0)
const selectRows = ref<any>([])
const queryForm = reactive<IUserQueryReq>({
  pageNo: 1,
  pageSize: 20,
  userName: '',
})

const setSelectRows = (value: string) => {
  selectRows.value = value
}

const handleAdd = () => {
  editRef.value.showEdit()
}

const handleEdit = (row: any ) => {
  editRef.value.showEdit(row)
}

const handleDelete = (row: any = {}) => {
  if (row.userId) {
    $baseConfirm('您确定要删除当前项吗', null, async () => {
      const { msg }: any = await doDelete({ ids: row.userId })
      $baseMessage(msg, 'success', 'hey')
      await fetchData()
    })
  } else {
    if (selectRows.value.length > 0) {
      const ids = selectRows.value.map((item: { userId: any }) => item.userId).join(',')
      $baseConfirm('您确定要删除选中项吗', null, async () => {
        const { msg }: any = await doMostDelete({ ids })
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
  const { data } = await getList(queryForm)
  list.value = data.list
  total.value = data.total
  listLoading.value = false
}

onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  fetchData()
})
</script>
