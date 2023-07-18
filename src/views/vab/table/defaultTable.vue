<script lang="ts" setup>
  import { useTabsStore } from '/@/store/modules/tabs'
  import { useRoutesStore } from '/@/store/modules/routes'
  import { doDelete, getList } from '/@/api/table'
  import { handleMatched, handleTabs } from '/@/utils/routes'
  import { Delete, Plus, Search } from '@element-plus/icons-vue'

  defineOptions({
    name: 'DefaultTable',
  })

  const router = useRouter()
  const $baseConfirm = inject<any>('$baseConfirm')
  const $baseMessage = inject<any>('$baseMessage')
  const routesStore = useRoutesStore()
  const { getRoutes: routes } = storeToRefs(routesStore)
  const tabsStore = useTabsStore()
  const { changeTabsMeta, addVisitedRoute } = tabsStore
  const editRef = ref<any>(null)
  const tableSortRef = ref<any>(null)
  const fold = ref<boolean>(true)
  const list = ref<any>([])
  const listLoading = ref<boolean>(true)
  const layout = ref<string>('total, sizes, prev, pager, next, jumper')
  const total = ref<any>(0)
  const selectRows = ref<any>([])
  const queryForm = reactive<any>({
    pageNo: 1,
    pageSize: 20,
  })

  onActivated(() => {
    tableSortRef.value.doLayout()
    fetchData()
  })

  const fetchData = async () => {
    listLoading.value = true
    const { data } = await getList(queryForm)
    list.value = data.list
    total.value = data.total
    listLoading.value = false
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

  const statusFilter = (status: string | number) => {
    const statusMap: any = {
      published: 'success',
      draft: '',
      deleted: 'danger',
    }
    return statusMap[status]
  }

  const handleFold = () => {
    fold.value = !fold.value
  }

  const setSelectRows = (value: string) => {
    selectRows.value = value
  }

  const handleAdd = () => {
    editRef.value.showEdit()
  }

  const handleEdit = (row = {}) => {
    editRef.value.showEdit(row)
  }

  const handleDelete = (row: any) => {
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
          const { msg }: any = await doDelete({ ids: ids })
          $baseMessage(msg, 'success', 'hey')
          await fetchData()
        })
      } else {
        $baseMessage('您未选中任何行', 'warning', 'hey')
      }
    }
  }

  const handleDetailStayTable = async () => {
    if (selectRows.value.length === 1)
      for (let i = 0; i < selectRows.value.length; i++) {
        const matched = handleMatched(
          routes.value,
          '/vab/table/defaultTableDetail'
        )
        const tab = handleTabs({
          ...matched[matched.length - 1],
          query: selectRows.value[i],
        })
        if (tab) {
          await addVisitedRoute(tab)
          await changeTabsMeta({
            title: '详情页',
            meta: {
              title: `${tab.query.title} 详情页`,
            },
          })
        }
      }
    else $baseMessage('请选择一行进行详情页跳转', 'warning', 'hey')
  }

  const handleDetail = (row: any) => {
    if (row.id)
      router.push({
        path: '/vab/table/defaultTableDetail',
        query: {
          ...row,
          timestamp: new Date().getTime(), //允许同一个详情页同时打开多次，否则会触发路由被缓存下次无法刷新的bug
        },
      })
    else {
      if (selectRows.value.length === 1)
        router.push({
          path: '/vab/table/defaultTableDetail',
          query: {
            ...selectRows.value[0],
            timestamp: new Date().getTime(), //允许同一个详情页同时打开多次，否则会触发路由被缓存下次无法刷新的bug
          },
        })
      else $baseMessage('请选择一行进行详情页跳转', 'warning', 'hey')
    }
  }

  onMounted(() => {
    fetchData()
  })
</script>

<template>
  <div class="comprehensive-table-container table-auto-height">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form inline label-width="49px" :model="queryForm" @submit.prevent>
          <el-form-item label="标题">
            <el-input
              v-model="queryForm.title"
              clearable
              placeholder="请输入标题"
            />
          </el-form-item>
          <el-form-item v-show="!fold" label="标题">
            <el-input
              v-model="queryForm.title"
              clearable
              placeholder="请输入标题"
            />
          </el-form-item>
          <el-form-item v-show="!fold" label="标题">
            <el-input
              v-model="queryForm.title"
              clearable
              placeholder="请输入标题"
            />
          </el-form-item>
          <el-form-item v-show="!fold" label="标题">
            <el-input
              v-model="queryForm.title"
              clearable
              placeholder="请输入标题"
            />
          </el-form-item>
          <el-form-item v-show="!fold" label="标题">
            <el-input
              v-model="queryForm.title"
              clearable
              placeholder="请输入标题"
            />
          </el-form-item>
          <el-form-item v-show="!fold" label="标题">
            <el-input
              v-model="queryForm.title"
              clearable
              placeholder="请输入标题"
            />
          </el-form-item>
          <el-form-item v-show="!fold" label="标题">
            <el-input
              v-model="queryForm.title"
              clearable
              placeholder="请输入标题"
            />
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
            <el-button
              class="hidden-xs-only"
              text
              type="primary"
              @click="handleFold"
            >
              <span v-if="fold">展开</span>
              <span v-else>合并</span>
              <vab-icon
                class="vab-dropdown"
                :class="{ 'vab-dropdown-active': fold }"
                icon="arrow-up-s-line"
              />
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel :span="24">
        <el-button :icon="Plus" type="primary" @click="handleAdd">
          添加
        </el-button>
        <el-button :icon="Delete" type="danger" @click="handleDelete">
          删除
        </el-button>
        <el-button type="primary" @click="handleDetail">详情</el-button>
        <el-button
          class="hidden-xs-only"
          type="primary"
          @click="handleDetailStayTable"
        >
          后台打开详情
        </el-button>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table
      ref="tableSortRef"
      v-loading="listLoading"
      border
      :data="list"
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
        label="标题"
        prop="title"
        show-overflow-tooltip
      />
      <el-table-column align="center" label="作者" prop="author" />
      <el-table-column align="center" label="评级">
        <template #default="{ row }">
          <el-rate v-model="row.rate" disabled />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="点击量"
        prop="pageViews"
        sortable
      />
      <el-table-column align="center" label="开关" prop="switch">
        <template #default="{ row }">
          <el-tooltip
            :content="row.switch === 0 ? '点击开启' : '点击关闭'"
            effect="light"
          >
            <el-switch v-model="row.switch" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template #default="{ row }">
          <el-tooltip :content="row.status" effect="light">
            <el-tag :type="statusFilter(row.status)">
              {{ row.status }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="时间"
        prop="datetime"
        width="200"
      />
      <el-table-column align="center" label="操作" width="237">
        <template #default="{ row }">
          <el-button text type="primary" @click="handleDetail(row)">
            详情
          </el-button>
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
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <default-table-edit ref="editRef" @fetch-data="fetchData" />
  </div>
</template>
