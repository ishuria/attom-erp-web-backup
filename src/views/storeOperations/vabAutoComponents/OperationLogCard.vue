<template>
  <div style="display: flex; flex: 1; flex-direction: column; height: 100%">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item>
            <el-text>{{ title }}</el-text>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">{{ addButtonText }}</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline>
          <el-form-item label="筛选展示">
            <el-select v-model="selectedFilter" @change="handleFilterChange">
              <el-option v-for="item in filterOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table border :data="filteredData" :header-cell-style="{ textAlign: 'center' }" stripe style="flex: 1">
      <el-table-column align="center" label="日期" min-width="115" prop="date" />
      <el-table-column label="类型" min-width="130" prop="type" />
      <el-table-column label="内容" min-width="170" prop="content">
        <template #default="{ row }">
          <el-link type="primary" @click="handleContentClick(row)">{{ row.content }}</el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 变化详情对话框 -->
    <vab-dialog v-model="changeDetailVisible" :title="changeDetailTitle">
      <el-table border :data="changeDetailData">
        <el-table-column label="变化类型">
          <template #default="{ row }">
            {{ changeDetailType }}
          </template>
        </el-table-column>
        <el-table-column label="变化前" :prop="beforeProp">
          <template v-if="beforeFormatter" #default="{ row }">{{ beforeFormatter(row) }}</template>
        </el-table-column>
        <el-table-column label="变化后" :prop="afterProp">
          <template v-if="afterFormatter" #default="{ row }">{{ afterFormatter(row) }}</template>
        </el-table-column>
      </el-table>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'OperationLogCard',
})

interface FilterOption {
  label: string
  value: number | string
}

interface LogItem {
  date: string
  type: string
  content: string
  [key: string]: any
}

interface ChangeDetailItem {
  [key: string]: any
}

interface Props {
  title?: string
  addButtonText?: string
  data: LogItem[]
  filterOptions?: FilterOption[]
  // 变化详情配置
  changeDetailConfig?: {
    [content: string]: {
      title: string
      type: string
      data: ChangeDetailItem[]
      beforeProp?: string
      afterProp?: string
      beforeFormatter?: (row: any) => string
      afterFormatter?: (row: any) => string
    }
  }
}

const props = withDefaults(defineProps<Props>(), {
  title: '操作日志/事件清单',
  addButtonText: '新增',
  data: () => [],
  filterOptions: () => [
    { label: '全部', value: -1 },
    { label: '手动输入', value: 0 },
    { label: '系统抓取', value: 1 },
    { label: '广告', value: 2 },
  ],
  changeDetailConfig: () => ({}),
})

const emit = defineEmits<{
  add: []
  contentClick: [row: LogItem]
}>()

const selectedFilter = ref<number | string>(-1)
const changeDetailVisible = ref<boolean>(false)
const changeDetailTitle = ref<string>('')
const changeDetailType = ref<string>('')
const changeDetailData = ref<ChangeDetailItem[]>([])
const beforeProp = ref<string>('')
const afterProp = ref<string>('')
const beforeFormatter = ref<((row: any) => string) | undefined>(undefined)
const afterFormatter = ref<((row: any) => string) | undefined>(undefined)

// 筛选后的数据
const filteredData = computed(() => {
  if (selectedFilter.value === -1) {
    return props.data
  }
  // 根据类型筛选，假设 type 字段对应筛选值
  // 这里需要根据实际数据结构调整
  return props.data.filter((item) => {
    // 如果 type 是字符串，需要映射到数值
    const typeMap: Record<string, number> = {
      手动输入: 0,
      系统抓取: 1,
      广告: 2,
    }
    const itemTypeValue = typeMap[item.type]
    return itemTypeValue !== undefined && itemTypeValue === selectedFilter.value
  })
})

// 处理筛选变化
const handleFilterChange = () => {
  // 筛选逻辑已在 computed 中处理
}

// 处理新增
const handleAdd = () => {
  emit('add')
}

// 处理内容点击
const handleContentClick = (row: LogItem) => {
  emit('contentClick', row)

  // 如果有配置的变化详情，显示对话框
  if (props.changeDetailConfig && props.changeDetailConfig[row.content]) {
    const config = props.changeDetailConfig[row.content]
    changeDetailTitle.value = config.title
    changeDetailType.value = config.type
    changeDetailData.value = config.data || []
    beforeProp.value = config.beforeProp || ''
    afterProp.value = config.afterProp || ''
    beforeFormatter.value = config.beforeFormatter
    afterFormatter.value = config.afterFormatter
    changeDetailVisible.value = true
  }
}
</script>
