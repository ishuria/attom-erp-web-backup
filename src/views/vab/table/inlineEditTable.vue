<template>
  <div class="inline-edit-table-container table-auto-height">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.title" placeholder="标题" />
          </el-form-item>
          <el-form-item>
            <el-button
              :icon="Search"
              :loading="listLoading"
              native-type="submit"
              type="primary"
              @click="queryData"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table v-loading="listLoading" border :data="list">
      <el-table-column type="selection" width="38" />
      <el-table-column
        align="center"
        label="序号"
        show-overflow-tooltip
        width="55"
      >
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题" show-overflow-tooltip>
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.title" style="width: 300px" />
          </template>
          <span v-else @click="row.edit = !row.edit">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="作者"
        prop="author"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.author" style="width: 300px" />
          </template>
          <span v-else @click="row.edit = !row.edit">{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="160"
      >
        <template #default="{ row }">
          <el-button
            v-if="!row.edit"
            text
            type="primary"
            @click="row.edit = !row.edit"
          >
            编辑
          </el-button>
          <el-button
            v-if="row.edit"
            style="margin-left: 10px"
            text
            type="primary"
            @click="confirmEdit(row)"
          >
            保存
          </el-button>
          <el-button
            v-if="row.edit"
            text
            type="primary"
            @click="cancelEdit(row)"
          >
            取消
          </el-button>
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
  </div>
</template>

<script lang="ts" setup>
  import { getList } from '/@/api/table'
  import { Search } from '@element-plus/icons-vue'

  defineOptions({
    name: 'InlineEditTable',
  })

  const list: Ref<any> = ref([])
  const listLoading: Ref<any> = ref(true)
  const layout: Ref<any> = ref('total, sizes, prev, pager, next, jumper')
  const total: Ref<any> = ref(0)
  const queryForm: any = reactive({
    pageNo: 1,
    pageSize: 20,
    title: '',
  })

  const fetchData = async () => {
    listLoading.value = true
    const { data } = await getList(queryForm)
    list.value = data.list.map((v: any) => {
      v.edit = false
      v.originalTitle = v.title
      return v
    })
    total.value = data.total
    listLoading.value = false
  }
  const handleSizeChange = (value: any) => {
    queryForm.pageSize = value
    fetchData()
  }
  const handleCurrentChange = (value: any) => {
    queryForm.pageNo = value
    fetchData()
  }
  const queryData = () => {
    queryForm.pageNo = 1
    fetchData()
  }
  const cancelEdit = (row: {
    title: any
    originalTitle: any
    edit: boolean
  }) => {
    row.title = row.originalTitle
    row.edit = false
  }
  const confirmEdit = (row: {
    edit: boolean
    originalTitle: any
    title: any
  }) => {
    row.edit = false
    row.originalTitle = row.title
  }
  onMounted(() => {
    fetchData()
  })
</script>
