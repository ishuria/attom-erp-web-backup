<template>
  <div class="goods-management-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form inline label-width="49px" :model="queryForm" @submit.prevent>
          <el-form-item label="标题">
            <el-input v-model="queryForm.title" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="queryForm.title" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item>
            <el-button native-type="submit" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel :span="24">
        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-button type="danger" @click="handleDelete($event)">删除</el-button>
        <el-button type="primary" @click="handleMessage">
          $baseMessage
        </el-button>
        <el-button type="primary" @click="handleAlert">$baseAlert</el-button>
        <el-button type="primary" @click="handleConfirm">
          $baseConfirm
        </el-button>
        <el-button type="primary" @click="handleNotify">$baseNotify</el-button>
        <el-badge class="item" value="New">
          <el-button
            style="margin: 0 0 10px 0 !important"
            type="primary"
            @click="handleDetail"
          >
            详情页支持tab多开并高亮左侧菜单
          </el-button>
        </el-badge>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table
      ref="tableSortRef"
      v-loading="listLoading"
      border
      :data="list"
      @selection-change="setSelectRows"
    >
      <el-table-column
        align="center"
        show-overflow-tooltip
        type="selection"
        width="55"
      />
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
      <el-table-column
        align="center"
        label="标题"
        prop="title"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="作者"
        prop="author"
        show-overflow-tooltip
      />
      <el-table-column align="center" label="评级">
        <template #default="{ row }">
          <el-rate v-model="row.rate" disabled />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="点击量"
        prop="pageViews"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        align="center"
        label="开关"
        prop="switch"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.switch === 0 ? '点击开启' : '点击关闭'"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.switch" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tooltip
            class="item"
            :content="row.status"
            effect="dark"
            placement="top-start"
          >
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
        show-overflow-tooltip
        width="200"
      />
      <el-table-column
        align="center"
        fixed="right"
        label="操作"
        show-overflow-tooltip
        width="200"
      >
        <template #default="{ row }">
          <el-button text type="primary" @click="handleDetail(row)">
            详情
          </el-button>
          <el-button text type="primary" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button text type="primary" @click="handleDelete(row)">
            删除
          </el-button>
          <el-badge class="item" value="New">
            <el-button
              style="margin: 0 0 10px 0 !important"
              type="primary"
              @click="handleDetail"
            >
              详情页支持tab多开并高亮左侧菜单
            </el-button>
          </el-badge>
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
    <edit ref="editRef" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { doDelete, getList } from '/@/api/goodsManagement'

  export default defineComponent({
    name: 'GoodsManagement',
    components: {
      Edit: defineAsyncComponent(() =>
        import('./components/GoodsManagementEdit.vue')
      ),
    },
    setup() {
      const router = useRouter()
      const $baseConfirm = inject('$baseConfirm')
      const $baseMessage = inject('$baseMessage')
      const $baseAlert = inject('$baseAlert')
      const $baseNotify = inject('$baseNotify')

      const state = reactive({
        editRef: null,
        tableSortRef: null,
        fold: false,
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
        },
      })

      onActivated(() => {
        state['tableSortRef'].doLayout()
        fetchData()
      })

      const fetchData = async () => {
        state.listLoading = true
        const {
          data: { list, total },
        } = await getList(state.queryForm)
        state.list = list
        state.total = total
        state.listLoading = false
      }
      const handleSizeChange = (val) => {
        state.queryForm.pageSize = val
        fetchData()
      }
      const handleCurrentChange = (val) => {
        state.queryForm.pageNo = val
        fetchData()
      }
      const queryData = () => {
        state.queryForm.pageNo = 1
        fetchData()
      }
      const statusFilter = (status) => {
        const statusMap = {
          published: 'success',
          draft: '',
          deleted: 'danger',
        }
        return statusMap[status]
      }
      const setSelectRows = (val) => {
        state.selectRows = val
      }
      const handleAdd = () => {
        state['editRef'].showEdit()
      }
      const handleEdit = (row) => {
        state['editRef'].showEdit(row)
      }
      const handleDelete = (row) => {
        if (row.id) {
          $baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            $baseMessage(msg, 'success', 'vab-hey-message-success')
            await fetchData()
          })
        } else {
          if (state.selectRows.length > 0) {
            const ids = state.selectRows.map((item) => item.id).join()
            $baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids: ids })
              $baseMessage(msg, 'success', 'vab-hey-message-success')
              await fetchData()
            })
          } else {
            $baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
          }
        }
      }
      const handleDetail = (row) => {
        if (row.id)
          router.push({
            path: '/goods/detail',
            query: {
              ...row,
              timestamp: new Date().getTime(), //允许同一个详情页同时打开多次，否则会触发路由被缓存下次无法刷新的bug
            },
          })
        else {
          if (state.selectRows.length === 1) {
            router.push({
              path: '/goods/detail',
              query: {
                ...state.selectRows[0],
                timestamp: new Date().getTime(), //允许同一个详情页同时打开多次，否则会触发路由被缓存下次无法刷新的bug
              },
            })
          } else {
            $baseMessage(
              '请选择一行进行详情页跳转',
              'error',
              'vab-hey-message-error'
            )
          }
        }
      }
      const handleMessage = () => {
        $baseMessage('test1', 'success', false, 'vab-hey-message-success')
      }
      const handleAlert = () => {
        $baseAlert('11')
      }
      const handleConfirm = () => {
        $baseConfirm(
          '你确定要执行该操作?',
          null,
          () => {
            /* 可以写回调; */
          },
          () => {
            /* 可以写回调; */
          }
        )
      }
      const handleNotify = () => {
        $baseNotify('测试消息提示', 'test', 'success', 'bottom-right')
      }

      onMounted(() => {
        fetchData()
      })

      return {
        ...toRefs(state),
        handleSizeChange,
        handleCurrentChange,
        queryData,
        statusFilter,
        setSelectRows,
        handleAdd,
        handleEdit,
        handleDelete,
        handleDetail,
        handleMessage,
        handleAlert,
        handleConfirm,
        handleNotify,
        fetchData,
      }
    },
  })
</script>
