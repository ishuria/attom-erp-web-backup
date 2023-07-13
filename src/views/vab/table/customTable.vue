<script lang="ts" setup>
  import { doDelete, getList } from '/@/api/table'
  import VabDraggable from 'vuedraggable'
  import { Delete, Plus, Search } from '@element-plus/icons-vue'

  defineOptions({
    name: 'CustomTable',
  })

  const $baseConfirm = inject<any>('$baseConfirm')
  const $baseMessage = inject<any>('$baseMessage')
  const tableSortRef = ref<any>(null)
  const editRef = ref<any>(null)
  const border = ref<boolean>(true)
  const stripe = ref<boolean>(false)
  const lineHeight = ref<any>('default')
  const isFullscreen = ref<boolean>(false)
  const list = ref<any>([])
  const listLoading = ref<boolean>(true)
  const layout = ref<string>('total, sizes, prev, pager, next, jumper')
  const total = ref<any>(0)
  const selectRows = ref<any>([])
  const columns = ref<any>([
    {
      label: 'id',
      prop: 'id',
      sortable: true,
    },
    {
      label: '标题',
      prop: 'title',
      sortable: true,
      disableCheck: true,
      checked: true,
    },
    {
      label: '图片',
      prop: 'title',
    },
    {
      label: '作者',
      prop: 'author',
      sortable: true,
      checked: true,
    },
    {
      label: '评级',
      prop: 'rate',
      sortable: true,
      checked: true,
    },
    {
      label: '点击量',
      prop: 'pageViews',
      sortable: true,
      checked: true,
    },
    {
      label: '时间',
      prop: 'datetime',
      sortable: true,
      checked: true,
    },
    {
      label: '描述',
      prop: 'description',
      sortable: true,
    },
  ])
  const checkList = ref<any>([])
  const queryForm = reactive<any>({
    pageNo: 1,
    pageSize: 20,
    title: '',
  })

  const dragOptions = computed(() => {
    return {
      animation: 600,
      group: 'description',
    }
  })

  const finallyColumns = computed(() => {
    return columns.value.filter((item: any) =>
      checkList.value.includes(item.label)
    )
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

  const clickFullScreen = () => {
    isFullscreen.value = !isFullscreen.value
  }

  const setSelectRows = (value: any) => {
    selectRows.value = value
  }

  const handleAdd = () => {
    editRef.value.showEdit()
  }

  const handleEdit = (row: any) => {
    editRef.value.showEdit(row)
  }

  const handleDelete = (row: any) => {
    if (row.id) {
      $baseConfirm('你确定要删除当前项吗', null, async () => {
        const { msg }: any = await doDelete({ ids: row.id })
        $baseMessage(msg, 'success', 'vab-hey-message-success')
        await fetchData()
      })
    } else {
      if (selectRows.value.length > 0) {
        const ids = selectRows.value.map((item: any) => item.id).join()
        $baseConfirm('你确定要删除选中项吗', null, async () => {
          const { msg }: any = await doDelete({ ids: ids })
          $baseMessage(msg, 'success', 'vab-hey-message-success')
          await fetchData()
        })
      } else {
        $baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
      }
    }
  }

  onMounted(() => {
    columns.value.forEach((item: any) => {
      if (item.checked) checkList.value.push(item.label)
    })

    fetchData()
  })
</script>

<template>
  <div
    class="custom-table-container table-auto-height"
    :class="{ 'vab-fullscreen': isFullscreen }"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline label-width="0" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.title" clearable placeholder="标题" />
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
            <el-button :icon="Plus" type="primary" @click="handleAdd">
              添加
            </el-button>
            <el-button :icon="Delete" type="danger" @click="handleDelete">
              删除
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <div class="custom-table-right-tools">
          <el-button class="hidden-xs-only">
            <el-checkbox v-model="stripe" label="斑马纹" />
          </el-button>
          <el-button class="hidden-xs-only">
            <el-checkbox v-model="border" label="边框" />
          </el-button>
          <el-button @click="queryData">
            <vab-icon icon="refresh-line" />
          </el-button>
          <el-button @click="clickFullScreen">
            <vab-icon
              :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
            />
          </el-button>
          <el-popover trigger="hover" :width="162">
            <el-radio-group v-model="lineHeight">
              <el-radio-button label="large">大</el-radio-button>
              <el-radio-button label="default">中</el-radio-button>
              <el-radio-button label="small">小</el-radio-button>
            </el-radio-group>
            <template #reference>
              <el-button>
                <vab-icon icon="line-height" />
              </el-button>
            </template>
          </el-popover>
          <el-popover popper-class="custom-table-checkbox" trigger="hover">
            <template #reference>
              <el-button>
                <vab-icon icon="settings-line" />
              </el-button>
            </template>
            <el-checkbox-group v-model="checkList">
              <vab-draggable
                item-key="{ element }"
                :list="columns"
                v-bind="dragOptions"
              >
                <template #item="{ element }">
                  <div>
                    <el-checkbox
                      :disabled="element.disableCheck === true"
                      :label="element.label"
                    >
                      {{ element.label }}
                    </el-checkbox>
                  </div>
                </template>
              </vab-draggable>
            </el-checkbox-group>
          </el-popover>
        </div>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      ref="tableSortRef"
      v-loading="listLoading"
      :border="border"
      :data="list"
      :size="lineHeight"
      :stripe="stripe"
      @selection-change="setSelectRows"
    >
      <el-table-column type="selection" width="38" />
      <el-table-column align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in finallyColumns"
        :key="index"
        align="center"
        :label="item.label"
        :prop="item.prop"
        show-overflow-tooltip
        :sortable="item.sortable"
      >
        <template #default="{ row }">
          <span v-if="item.label === '评级'">
            <el-rate v-model="row.rate" disabled />
          </span>
          <el-popover
            v-if="item.label === '图片'"
            placement="top-start"
            trigger="hover"
          >
            <el-image :src="row.image" />
            <template #reference>
              <el-image :src="row.image" />
            </template>
          </el-popover>
          <span v-else>{{ row[item.prop] }}</span>
        </template>
      </el-table-column>

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

<style lang="scss" scoped>
  .custom-table-container {
    .custom-table-right-tools {
      display: flex;
      align-items: center;

      :deep() {
        .el-button {
          [class*='ri-'] {
            margin-right: 0;
          }
        }
      }
    }
  }
</style>
