<template>
  <div class="user-management-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button :icon="Plus" type="primary" @click="handleEdit(null)">
          添加
        </el-button>
        <el-button :icon="Delete" type="danger" @click="handleDelete">
          批量删除
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :model="queryForm" inline @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.username"
              clearable
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      @selection-change="setSelectRows"
    >
      <el-table-column type="selection" width="38" />
      <el-table-column align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="id"
        prop="id"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="用户名"
        prop="username"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="邮箱"
        prop="email"
        show-overflow-tooltip
      />

      <el-table-column align="center" label="角色" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag v-for="(item, index) in row.roles" :key="index">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="修改时间"
        prop="datatime"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="200"
      >
        <template #default="{ row }">
          <el-button text type="primary" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button text type="primary" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <el-pagination
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      background
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

  const editRef: any = ref(null)
  const list = ref([])
  const listLoading = ref(true)
  const layout = ref('total, sizes, prev, pager, next, jumper')
  const total = ref(0)
  const selectRows: any = ref('')
  const queryForm = reactive({
    pageNo: 1,
    pageSize: 10,
    username: '',
  })

  const setSelectRows = (val: string) => {
    selectRows.value = val
  }
  const handleEdit = (row: any = {}) => {
    if (row.id) {
      editRef.value.showEdit(row)
    } else {
      editRef.value.showEdit()
    }
  }
  const handleDelete = (row: any = {}) => {
    if (row.id) {
      $baseConfirm('你确定要删除当前项吗', null, async () => {
        const { msg }: any = await doDelete({ ids: row.id })
        $baseMessage(msg, 'success', 'hey')
        await fetchData()
      })
    } else {
      if (selectRows.value.length > 0) {
        const ids = selectRows.value.map((item: { id: any }) => item.id).join()
        $baseConfirm('你确定要删除选中项吗', null, async () => {
          const { msg }: any = await doDelete({ ids })
          $baseMessage(msg, 'success', 'hey')
          await fetchData()
        })
      } else {
        $baseMessage('未选中任何行', 'error', 'hey')
      }
    }
  }
  const handleSizeChange = (val: any) => {
    queryForm.pageSize = val
    fetchData()
  }
  const handleCurrentChange = (val: any) => {
    queryForm.pageNo = val
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
