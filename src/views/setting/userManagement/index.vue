<template>
  <div class="user-management-container table-auto-height">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button :icon="Plus" type="primary" @click="handleAdd">添加</el-button>
        <el-button :icon="Delete" type="danger" @click="handleDelete">批量删除</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.username" clearable placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" border :data="list" @selection-change="setSelectRows">
      <el-table-column type="selection" width="38" />
      <el-table-column align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="id" prop="id" />
      <el-table-column align="center" label="用户名" prop="username" />
      <el-table-column align="center" label="邮箱" prop="email" />

      <el-table-column align="center" label="角色">
        <template #default="{ row }">
          <el-tag v-for="(item, index) in row.roles" :key="index">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="修改时间" prop="datatime" />
      <el-table-column align="center" label="操作" width="162">
        <template #default="{ row }">
          <el-button text type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button text type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <user-management-edit ref="editRef" @fetch-data="fetchData" />
  </div>
</template>

<script lang="ts" setup>
  import { doDelete, getList } from '/@/api/userManagement'
  import { Delete, Plus, Search } from '@element-plus/icons-vue'

  defineOptions({
    name: 'UserManagement',
  })

  const $baseConfirm: any = inject('$baseConfirm')
  const $baseMessage = inject<any>('$baseMessage')

  const editRef = ref<any>(null)
  const list = ref<any>([])
  const listLoading = ref<boolean>(true)
  const layout = ref<string>('total, sizes, prev, pager, next, jumper')
  const total = ref<any>(0)
  const selectRows = ref<any>([])
  const queryForm = reactive<any>({
    pageNo: 1,
    pageSize: 20,
    username: '',
  })

  const setSelectRows = (value: string) => {
    selectRows.value = value
  }

  const handleAdd = () => {
    editRef.value.showEdit()
  }

  const handleEdit = (row: any = {}) => {
    editRef.value.showEdit(row)
  }

  const handleDelete = (row: any = {}) => {
    if (row.id) {
      $baseConfirm('您确定要删除当前项吗', null, async () => {
        const { msg }: any = await doDelete({ ids: row.id })
        $baseMessage(msg, 'success', 'hey')
        await fetchData()
      })
    } else {
      if (selectRows.value.length > 0) {
        const ids = selectRows.value.map((item: { id: any }) => item.id).join()
        $baseConfirm('您确定要删除选中项吗', null, async () => {
          const { msg }: any = await doDelete({ ids })
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

  onMounted(() => {
    fetchData()
  })
</script>
