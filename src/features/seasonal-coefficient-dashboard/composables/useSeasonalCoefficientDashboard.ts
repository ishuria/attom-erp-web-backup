import { debounce } from 'lodash-es'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { updateSeasonalCoefficient } from '/@/api/devlocal/seasonalCoefficient'
import { seasonalCoefficientDashboardApi } from '../api'
import {
  ALL_OPERATION_USER_ID,
  buildCurveOption,
  buildSparklineOption,
  formatMonth,
  formatPercent,
  getDiffBarStyle,
  getDiffStyle,
  getPlatformCodeById,
  MONTH_ACTUAL_FIELDS,
  type MonthActualField,
  normalizeOperationUserOptions,
  parseMonthlyValues,
} from '../service'
import type {
  IOperationUserOption,
  IPlatFormItem,
  ISeasonalCoefficientDashboardItem,
  ISeasonalCoefficientDashboardReq,
  ISeasonalCoefficientOption,
} from '../types'
import { useImagePreview } from '/@/hooks/useImagePreview'

export const useSeasonalCoefficientDashboard = () => {
  const { imagePreviewVisible, imagePreviewList, openImagePreview, closeImagePreview } = useImagePreview()
  const curveDialogVisible = ref(false)
  const curveDialogTitle = ref('')
  const curveDialogRow = ref<ISeasonalCoefficientDashboardItem | null>(null)
  const editingActuals = reactive<Record<MonthActualField, number | null>>({
    janActual: null,
    febActual: null,
    marActual: null,
    aprActual: null,
    mayActual: null,
    junActual: null,
    julActual: null,
    augActual: null,
    sepActual: null,
    octActual: null,
    novActual: null,
    decActual: null,
  })
  const editSaving = ref(false)

  const sparklineOption = (row: ISeasonalCoefficientDashboardItem) =>
    buildSparklineOption(parseMonthlyValues(row.monthlyRatio), parseMonthlyValues(row.monthlyActual))

  const curveDialogOption = computed(() => {
    if (!curveDialogRow.value) return {}
    const ratioArr = parseMonthlyValues(curveDialogRow.value.monthlyRatio)
    const actualArr = MONTH_ACTUAL_FIELDS.map((f) => Number(editingActuals[f] ?? 0))
    return buildCurveOption(ratioArr, actualArr)
  })

  const openCurveDialog = (row: ISeasonalCoefficientDashboardItem) => {
    const ratioArr = parseMonthlyValues(row.monthlyRatio)
    const actualArr = parseMonthlyValues(row.monthlyActual)
    if (!ratioArr.length && !actualArr.length) return
    curveDialogTitle.value = `${row.asin} · ${row.kindName ?? ''} 季节系数对比`
    curveDialogRow.value = row
    MONTH_ACTUAL_FIELDS.forEach((field, idx) => {
      const v = actualArr[idx]
      editingActuals[field] = v == null || Number.isNaN(v) ? null : Number(v)
    })
    curveDialogVisible.value = true
  }

  const closeCurveDialog = () => {
    curveDialogVisible.value = false
    curveDialogRow.value = null
  }

  const saveSeasonalCoefficient = async () => {
    if (!curveDialogRow.value?.kindId) {
      $baseMessage('缺少品类 ID，无法保存', 'error', '', false)
      return
    }
    for (const field of MONTH_ACTUAL_FIELDS) {
      const v = editingActuals[field]
      if (v == null || Number(v) <= 0) {
        $baseMessage('每月系数必须大于 0', 'warning', '', false)
        return
      }
    }
    editSaving.value = true
    try {
      const payload: any = { id: curveDialogRow.value.kindId }
      MONTH_ACTUAL_FIELDS.forEach((f) => {
        payload[f] = Number(editingActuals[f])
      })
      const { data } = await updateSeasonalCoefficient(payload)
      if (data) {
        $baseMessage('修改成功', 'success', '', false)
        closeCurveDialog()
        fetchData()
      } else {
        $baseMessage('修改失败', 'error', '', false)
      }
    } finally {
      editSaving.value = false
    }
  }

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0')
  const pickerMonths = ref<string | null>(currentMonth)
  const loading = ref(false)
  const platformList = ref<IPlatFormItem[]>([])
  const siteList = ref<ISeasonalCoefficientOption[]>([])
  const kindList = ref<ISeasonalCoefficientOption[]>([])
  const operationUserList = ref<IOperationUserOption[]>([])
  const productCount = ref<number | null>(null)
  const top10List = ref<ISeasonalCoefficientDashboardItem[]>([])
  const tableList = ref<ISeasonalCoefficientDashboardItem[]>([])
  const total = ref(0)

  const queryForm = reactive<ISeasonalCoefficientDashboardReq>({
    platformId: 0,
    site: 0,
    kindId: 0,
    month: new Date().getMonth() + 1,
    keyWord: '',
    pageNo: 1,
    pageSize: 20,
    orderByField: 'diff',
    orderDirection: 'desc',
    operationUserId: ALL_OPERATION_USER_ID,
  })

  watch(pickerMonths, (val) => {
    queryForm.month = val ? Number(val) : 0
  })

  const barChartOption = reactive<any>({
    grid: { top: 50, right: 60, bottom: 30, left: 60 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: [],
      name: '偏差率',
      nameLocation: 'end',
      nameTextStyle: { color: '#8c8c8c', fontSize: 12 },
      axisLabel: { fontSize: 11, color: '#595959' },
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: '产品数量',
      nameTextStyle: { color: '#8c8c8c', fontSize: 12 },
      minInterval: 1,
      axisLabel: { fontSize: 11, color: '#595959' },
      splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } },
    },
    series: [
      {
        type: 'bar',
        data: [],
        barMaxWidth: 48,
        label: { show: true, position: 'top', fontSize: 12, color: '#595959' },
      },
    ],
  })

  const hasBarData = computed(() => barChartOption.xAxis.data?.length > 0)

  const fetchOperationUserList = async (platformId: number) => {
    queryForm.operationUserId = ALL_OPERATION_USER_ID
    operationUserList.value = []
    if (!platformId) return

    const platformCode = getPlatformCodeById(platformList.value, platformId)
    if (!platformCode) return

    const { data } = await seasonalCoefficientDashboardApi.getOperationUserList(platformCode)
    operationUserList.value = normalizeOperationUserOptions(data || [])
  }

  const handlePlatformChange = async (platformId: number) => {
    queryForm.site = 0
    queryForm.kindId = 0
    siteList.value = []
    kindList.value = []
    if (!platformId) return

    const [{ data: sites }] = await Promise.all([
      seasonalCoefficientDashboardApi.getSiteListByPlatform(platformId),
      fetchOperationUserList(platformId),
    ])
    siteList.value = sites
  }

  const handleSiteChange = async (site: number) => {
    queryForm.kindId = 0
    kindList.value = []
    if (site == null) return

    const { data } = await seasonalCoefficientDashboardApi.getKindList(site)
    kindList.value = data
    kindList.value.unshift({ id: 0, label: '全部种类' })
    await fetchData()
  }

  const fetchData = async () => {
    loading.value = true
    try {
      const { data } = await seasonalCoefficientDashboardApi.getDashboard(queryForm)
      productCount.value = data.productCount
      top10List.value = data.top10List || []
      tableList.value = data.list?.list || []
      total.value = data.list?.tota || 0
      barChartOption.xAxis.data = (data.barChart || []).map((item: any) => item.x)
      barChartOption.series[0].data = (data.barChart || []).map((item: any) => item.y)
      const colors = ['#22c55e', '#22c55e', '#f97316', '#f97316', '#ef4444']
      barChartOption.series[0].itemStyle = {
        color: (params: any) => colors[params.dataIndex] ?? '#ef4444',
        borderRadius: [3, 3, 0, 0],
      }
    } finally {
      loading.value = false
    }
  }

  const fetchDataDebounce = debounce(fetchData, 300)

  const handleCurrentChange = (page: number) => {
    queryForm.pageNo = page
    fetchData()
  }

  const handleSizeChange = (size: number) => {
    queryForm.pageSize = size
    queryForm.pageNo = 1
    fetchData()
  }

  const handleSortChange = ({ prop, order }: { prop: string | null; order: string | null }) => {
    const directionMap: Record<string, string> = {
      ascending: 'asc',
      descending: 'desc',
    }

    queryForm.orderByField = prop ? prop : ''
    queryForm.orderDirection = order ? (directionMap[order] ?? '') : ''
    fetchData()
  }

  onMounted(async () => {
    const { data } = await seasonalCoefficientDashboardApi.getPlatformList()
    platformList.value = data
    if (!data.length) return

    queryForm.platformId = data[0].platformId
    const [{ data: sites }] = await Promise.all([
      seasonalCoefficientDashboardApi.getSiteListByPlatform(data[0].platformId),
      fetchOperationUserList(data[0].platformId),
    ])
    siteList.value = sites
    if (!sites.length) return

    queryForm.site = sites[0].id
    await handleSiteChange(sites[0].id)
  })

  const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
    if (data.column.label === '图片') {
      return 'clear-padding'
    }
    return ''
  }

  return {
    barChartOption,
    fetchData,
    fetchDataDebounce,
    formatMonth,
    formatPercent,
    getDiffBarStyle,
    getDiffStyle,
    handleCurrentChange,
    handlePlatformChange,
    handleSiteChange,
    handleSizeChange,
    handleSortChange,
    hasBarData,
    imagePreviewList,
    imagePreviewVisible,
    kindList,
    loading,
    openImagePreview,
    closeImagePreview,
    openCurveDialog,
    closeCurveDialog,
    curveDialogVisible,
    curveDialogTitle,
    curveDialogOption,
    curveDialogRow,
    editingActuals,
    editSaving,
    saveSeasonalCoefficient,
    MONTH_ACTUAL_FIELDS,
    sparklineOption,
    operationUserList,
    pickerMonths,
    platformList,
    productCount,
    queryForm,
    siteList,
    tableList,
    top10List,
    total,
    clearPadding,
  }
}
