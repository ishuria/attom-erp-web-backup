<template>
  <div
    class="menu-management-container no-background-container table-auto-height"
  >
    <el-row :gutter="20">
      <el-col :lg="4" :md="8" :sm="24" :xl="4" :xs="24">
        <vab-card>
          <el-tree
            :data="treeList"
            :default-expanded-keys="['root']"
            node-key="id"
            :props="defaultProps"
            @node-click="handleNodeClick"
          />
        </vab-card>
      </el-col>
      <el-col :lg="20" :md="16" :sm="24" :xl="20" :xs="24">
        <vab-card>
          <vab-query-form>
            <vab-query-form-top-panel :span="12">
              <el-button :icon="Plus" type="primary" @click="handleAdd">
                添加
              </el-button>
            </vab-query-form-top-panel>
          </vab-query-form>
          <el-table
            v-loading="listLoading"
            border
            :data="list"
            row-key="path"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column align="center" label="标题" prop="meta.title" />
            <el-table-column align="center" label="name" prop="name" />
            <el-table-column align="center" label="路径" prop="path" />
            <!-- <el-table-column align="center" label="是否隐藏">
              <template #default="{ row }">
                {{ row.meta.hidden ? '是' : '否' }}
              </template>
            </el-table-column> -->
            <!-- <el-table-column
                align="center"
                label="是否隐藏当前节点"
                width="100"
              >
                <template #default="{ row }">
                  {{ row.meta.levelHidden ? '是' : '否' }}
                </template>
              </el-table-column> -->
            <el-table-column
              align="center"
              label="vue文件路径"
              prop="component"
            />
            <!-- <el-table-column align="center" label="重定向">
              <template #default="{ row }">
                {{ row.redirect || '无' }}
              </template>
            </el-table-column> -->
            <el-table-column align="center" label="图标">
              <template #default="{ row }">
                <vab-icon v-if="row.meta.icon" :icon="row.meta.icon" />
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="是否固定">
              <template #default="{ row }">
                {{ row.meta.noClosable ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否无缓存">
              <template #default="{ row }">
                {{ row.meta.noKeepAlive ? '是' : '否' }}
              </template>
            </el-table-column> -->
            <!-- <el-table-column align="center" label="badge">
              <template #default="{ row }">
                <el-tag v-if="row.meta.badge" effect="dark" type="danger">
                  {{ row.meta.badge }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="dot">
              <template #default="{ row }">
                {{ row.meta.dot ? '是' : '否' }}
              </template>
            </el-table-column> -->
            <el-table-column align="center" label="操作" width="162">
              <template #default="{ row }">
                <el-button text type="primary" @click="handleEdit(row)">
                  编辑
                </el-button>
                <el-button text type="danger" @click="handleDelete(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" />
            </template>
          </el-table>
        </vab-card>
      </el-col>
    </el-row>
    <menu-management-edit ref="editRef" @fetch-data="fetchData" />
  </div>
</template>

<script lang="ts" setup>
  import { getList } from '/@/api/router'
  import { doDelete, getTree } from '/@/api/menuManagement'
  import { Plus } from '@element-plus/icons-vue'

  defineOptions({
    name: 'MenuManagement',
  })

  const $baseConfirm: any = inject('$baseConfirm')
  const $baseMessage = inject<any>('$baseMessage')
  const editRef = ref<any>(null)
  const treeList = ref<any>([])
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
      $baseConfirm('你确定要删除当前项吗', null, async () => {
        const { msg }: any = await doDelete({ paths: row.path })
        $baseMessage(msg, 'success', 'hey')
        await fetchData()
      })
    }
  }

  const fetchData = async (role: any = {}) => {
    listLoading.value = true
    const { data } = await getList({ role })
    list.value = data.list
    listLoading.value = false
  }

  const handleNodeClick = ({ role }: any) => {
    fetchData(role)
  }

  onMounted(() => {
    getTree().then(({ data }) => {
      treeList.value = data.list
    })
    fetchData()
  })
</script>
