<template>
  <div class="menu-management-container no-background-container auto-height-container">
    <vab-card class="auto-height-card">
      <vab-query-form>
        <vab-query-form-top-panel :span="12">
          <el-button :icon="Plus" type="primary" @click="handleAdd">添加</el-button>
        </vab-query-form-top-panel>
      </vab-query-form>
      <el-table
        ref="tableRef"
        v-loading="listLoading"
        border
        :data="list"
        row-key="path"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column align="center" label="标题" min-width="140" prop="meta.title" show-overflow-tooltip />
        <el-table-column align="center" label="name" min-width="120" prop="name" show-overflow-tooltip />
        <el-table-column align="center" label="路径" min-width="140" prop="path" show-overflow-tooltip />

        <el-table-column align="center" label="vue文件路径" min-width="120" prop="component" show-overflow-tooltip />

        <el-table-column align="center" label="图标">
          <template #default="{ row }">
            <vab-icon v-if="row.meta.icon" :icon="row.meta.icon" />
          </template>
        </el-table-column>

        <el-table-column align="center" label="排序" min-width="120" prop="sort" show-overflow-tooltip />

        <el-table-column align="center" label="状态" width="120" prop="status" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag v-if="row.status == 0" type="success">正常</el-tag>
            <el-tag v-if="row.status == 1" type="warning">禁用</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="类型" width="120" prop="type" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag v-if="row.type == 0">菜单</el-tag>
            <el-tag v-if="row.type == 1" type="info">按钮</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="创建时间" min-width="120" prop="createTime" show-overflow-tooltip />

        <el-table-column align="center" label="操作" width="150">
          <template #default="{ row }">
            <el-button text type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button text type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
    </vab-card>
    <menu-edit ref="editRef" @fetch-data="fetchData" />
  </div>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { getMenuList } from '/@/api/devlocal/router'

defineOptions({
  name: 'MenuEdit',
})

const tableRef = ref<TableInstance>()
const editRef = ref<any>(null)

const defaultProps = reactive<any>({
  children: 'children',
  label: 'label',
})
const list = ref<any>([])
const listLoading = ref<boolean>(true)

const handleAdd = () => {
  editRef.value.showEdit()
}

const handleEdit = (row: any = {}) => {
  editRef.value.showEdit(row)
}

const handleDelete = (row: any = {}) => {
  if (row.path) {
    $baseConfirm('您确定要删除当前项吗', null, async () => {
      const { msg }: any = await doDelete({ paths: row.path })
      $baseMessage(msg, 'success', 'hey')
      await fetchData()
    })
  }
}

const fetchData = async (role: any = {}) => {
  listLoading.value = true
  const { data } = await getMenuList()
  list.value = data
  listLoading.value = false
}

const handleNodeClick = ({ role }: any) => {
  // fetchData(role)
}

onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  fetchData()
})
</script>
