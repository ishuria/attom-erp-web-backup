import { columnConfigs, splitUsernames } from '/@/views/newProductTask/constantOption'
import { getArtDesignTaskList } from '/@/api/devlocal/imageTask'
import type { IGetArtDesignTaskListReq } from '/@/type/listingTask/imageTaskType'
import { formatDate } from '/@/utils/dateUtils'
import { calculateBrColumnWidth, flexColumnWidth } from '/@/utils/tableColum'
import type { ListingImageTaskColumnWidths, ListingImageTaskRow, ListingImageTaskStatus } from '../types'

const USER_FIELD_PROPS = columnConfigs.map((item) => item.prop)
const BR_FIELDS = [
  'basePicture',
  'modeling',
  'rendering',
  'aAdd',
  'video',
  'instructionManual',
  'colorDesign',
  'productPlaneDesign',
  'operation',
  'productDesign',
  'productManager',
]

const emptyColumnWidths = (): ListingImageTaskColumnWidths => ({
  sku: 120,
  publisher: 100,
  byProp: {},
})

const toBrText = (value: unknown) => String(value ?? '').replaceAll(',', '<br />')

export function useListingImageTask() {
  const router = useRouter()
  const route = useRoute()

  const activeName = ref<ListingImageTaskStatus>(3)
  const queryForm = reactive<IGetArtDesignTaskListReq>({
    keyword: '',
    pageNo: 1,
    pageSize: 50,
    status: 3,
    taskType: '',
    operationUserId: -1,
  })
  const list = ref<ListingImageTaskRow[]>([])
  const total = ref<number>(0)
  const listLoading = ref<boolean>(false)
  const columnWidths = ref<ListingImageTaskColumnWidths>(emptyColumnWidths())
  const selectedRows = ref<ListingImageTaskRow[]>([])

  let searchDebounceTimer: ReturnType<typeof setTimeout> | undefined
  let latestRequestId = 0

  const syncRouteQuery = () => {
    router.push({
      query: {
        ...route.query,
        tab: activeName.value,
        pageNo: queryForm.pageNo,
        pageSize: queryForm.pageSize,
      },
    })
  }

  const normalizeRows = (rows: ListingImageTaskRow[]) => {
    return rows.map((row) => {
      const normalized = row as ListingImageTaskRow
      normalized._finishDateText = normalized.finishDate ? formatDate(new Date(normalized.finishDate)) : ''
      normalized._actualFinishDateText = normalized.actualFinishDate ? formatDate(new Date(normalized.actualFinishDate)) : ''
      normalized._usernamesByProp = USER_FIELD_PROPS.reduce<Record<string, string[]>>((result, prop) => {
        result[prop] = splitUsernames(normalized[prop])
        return result
      }, {})

      BR_FIELDS.forEach((field) => {
        normalized[`_${field}`] = toBrText(normalized[field])
      })

      return normalized
    })
  }

  const calculateColumnWidths = (rows: ListingImageTaskRow[]) => {
    if (rows.length === 0) {
      columnWidths.value = emptyColumnWidths()
      return
    }

    const byProp: Record<string, number> = {}
    columnConfigs.forEach((col) => {
      if (!col.isSpecial && col.dataKey) {
        byProp[col.prop] = calculateBrColumnWidth(rows, (row: ListingImageTaskRow) => row[col.dataKey as string], col.baseWidth, 30)
      }
    })

    columnWidths.value = {
      sku: Math.max(flexColumnWidth(rows, 'SKU', 'sku'), flexColumnWidth(rows, 'SKU', 'desc')),
      publisher: flexColumnWidth(rows, '发布人', 'publisherPersonName'),
      byProp,
    }
  }

  const clearSelection = () => {
    selectedRows.value = []
  }

  const setSelectedRows = (value: ListingImageTaskRow[]) => {
    selectedRows.value = value
  }

  const fetchData = async () => {
    const requestId = ++latestRequestId
    listLoading.value = true

    try {
      const { data } = await getArtDesignTaskList(queryForm)
      if (requestId !== latestRequestId) return

      total.value = data.total
      const rows = normalizeRows(data.list as ListingImageTaskRow[])
      list.value = rows
      calculateColumnWidths(rows)
    } catch (error) {
      if (requestId === latestRequestId) {
        console.error('获取数据失败:', error)
      }
    } finally {
      if (requestId === latestRequestId) {
        listLoading.value = false
      }
    }
  }

  const queryDataImmediate = () => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
      searchDebounceTimer = undefined
    }
    queryForm.pageNo = 1
    syncRouteQuery()
    clearSelection()
    fetchData()
  }

  const queryDataDebounced = () => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
    }
    searchDebounceTimer = setTimeout(queryDataImmediate, 300)
  }

  const handleCurrentChange = (value: number) => {
    queryForm.pageNo = value
    syncRouteQuery()
    clearSelection()
    fetchData()
  }

  const handleSizeChange = (value: number) => {
    queryForm.pageNo = 1
    queryForm.pageSize = value
    syncRouteQuery()
    clearSelection()
    fetchData()
  }

  const handleTabChange = (status: ListingImageTaskStatus) => {
    activeName.value = status
    queryForm.status = status
    queryForm.pageNo = 1
    if (status !== 2) {
      queryForm.taskType = ''
    }
    syncRouteQuery()
    clearSelection()
    fetchData()
  }

  const initFromRoute = () => {
    const { pageNo, pageSize, tab } = route.query
    if (pageNo) {
      queryForm.pageNo = Number(pageNo)
    }
    if (pageSize) {
      queryForm.pageSize = Number(pageSize)
    }
    if (tab) {
      activeName.value = Number(tab) as ListingImageTaskStatus
      queryForm.status = activeName.value
    }
  }

  const dispose = () => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
      searchDebounceTimer = undefined
    }
    latestRequestId += 1
  }

  return {
    activeName,
    clearSelection,
    columnWidths,
    dispose,
    fetchData,
    handleCurrentChange,
    handleSizeChange,
    handleTabChange,
    initFromRoute,
    list,
    listLoading,
    queryDataDebounced,
    queryDataImmediate,
    queryForm,
    selectedRows,
    setSelectedRows,
    total,
  }
}
