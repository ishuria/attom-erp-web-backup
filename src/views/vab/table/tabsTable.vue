<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="当前" name="first">
        <vab-query-form>
          <vab-query-form-top-panel>
            <el-form
              inline
              label-width="49px"
              :model="queryForm"
              @submit.prevent
            >
              <el-form-item label="分类">
                <el-check-tag :checked="queryForm.checked1" @change="onChange1">
                  分类一
                </el-check-tag>
                <el-check-tag :checked="queryForm.checked2" @change="onChange2">
                  分类二
                </el-check-tag>
                <el-check-tag :checked="queryForm.checked3" @change="onChange3">
                  分类三
                </el-check-tag>
                <el-check-tag :checked="queryForm.checked4" @change="onChange4">
                  分类四
                </el-check-tag>
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
            <el-button type="primary" @click="handleDetail">
              详情页支持tab多开并高亮左侧菜单
            </el-button>
            <el-button type="primary" @click="handleDetailStayTable">
              后台打开详情页
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
          <el-table-column align="center" label="标题" prop="title" />
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
                :enterable="false"
                placement="top"
              >
                <el-switch v-model="row.switch" />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
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
            width="200"
          />
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            width="250"
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
      </el-tab-pane>
      <el-tab-pane label="其他" name="second">
        <el-empty class="vab-data-empty" description="暂无数据" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'TabsTable',
  })
  import type { TabsPaneContext } from 'element-plus'
  import { useTabsStore } from '/@/store/modules/tabs'
  import { useRoutesStore } from '/@/store/modules/routes'
  import { doDelete, getList } from '/@/api/table'
  import { handleMatched, handleTabs } from '/@/utils/routes'
  import { Delete, Plus } from '@element-plus/icons-vue'

  const activeName = ref<string>('first')
  const router = useRouter()
  const $baseConfirm = inject<any>('$baseConfirm')
  const $baseMessage = inject<any>('$baseMessage')
  const routesStore = useRoutesStore()
  const { getRoutes: routes } = storeToRefs(routesStore)
  const tabsStore = useTabsStore()
  const { changeTabsMeta, addVisitedRoute } = tabsStore

  const editRef = ref<any>(null)
  const tableSortRef = ref<any>(null)
  const list = ref<any>([])
  const listLoading = ref<boolean>(true)
  const layout = ref<string>('total, sizes, prev, pager, next, jumper')
  const total = ref<any>(0)
  const selectRows = ref<any>([])
  const queryForm = reactive<any>({
    pageNo: 1,
    pageSize: 10,
    checked1: true,
    checked2: false,
    checked3: false,
    checked4: false,
  })

  onActivated(() => {
    tableSortRef.value.doLayout()
    fetchData()
  })

  const onChange1 = (status: boolean) => {
    queryForm.checked1 = status
    queryData()
  }
  const onChange2 = (status: boolean) => {
    queryForm.checked2 = status
    queryData()
  }
  const onChange3 = (status: boolean) => {
    queryForm.checked3 = status
    queryData()
  }
  const onChange4 = (status: boolean) => {
    queryForm.checked4 = status
  }

  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
    queryData()
  }

  const fetchData = async () => {
    listLoading.value = true
    const { data } = await getList(queryForm)
    list.value = data.list
    total.value = data.total
    listLoading.value = false
  }

  const handleSizeChange = (value: number) => {
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
      $baseConfirm('你确定要删除当前项吗', null, async () => {
        const { msg }: any = await doDelete({ ids: row.id })
        $baseMessage(msg, 'success', 'hey')
        await fetchData()
      })
    } else {
      if (selectRows.value.length > 0) {
        const ids = selectRows.value.map((item: { id: any }) => item.id).join()
        $baseConfirm('你确定要删除选中项吗', null, async () => {
          const { msg }: any = await doDelete({ ids: ids })
          $baseMessage(msg, 'success', 'hey')
          await fetchData()
        })
      } else {
        $baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
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
    else
      $baseMessage('请选择一行进行详情页跳转', 'error', 'vab-hey-message-error')
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
      else
        $baseMessage(
          '请选择一行进行详情页跳转',
          'error',
          'vab-hey-message-error'
        )
    }
  }

  onMounted(() => {
    fetchData()
  })
</script>

<style lang="scss" scoped>
  .tabs-table-container {
    :deep() {
      .el-tabs {
        border-radius: var(--el-border-radius-base);

        &__nav-wrap {
          border-radius: var(--el-border-radius-base);
        }

        .el-tab-pane {
          display: flex;
          flex-direction: column;
          height: calc(
            $base-keep-alive-height - $base-padding - 70px
          ) !important;
          .el-check-tag {
            margin-right: 10px;
            border-radius: 99px;
          }

          .el-table {
            flex: 1;
          }
        }
      }
    }
  }
</style>
<style>
  /* 手机端禁用表格自动高度 */
  .mobile {
    .tabs-table-container.no-background-container {
      .el-tab-pane {
        display: block !important;
        height: auto !important;
      }
    }
  }
</style>
