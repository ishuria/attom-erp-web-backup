import type { IOperationUserOption, IPlatFormItem, PlatformCodeType } from './types'

export const ALL_OPERATION_USER_ID = -1

export const createAllOperationOption = (): IOperationUserOption => ({
  id: ALL_OPERATION_USER_ID,
  label: '全部运营',
})

export const getPlatformCodeById = (platformList: IPlatFormItem[], platformId: number) => {
  const platform = platformList.find((item) => item.platformId === platformId)
  return platform?.platformCode as PlatformCodeType | undefined
}

export const normalizeOperationUserOptions = (list: IOperationUserOption[] = []) => [createAllOperationOption(), ...list]

export const formatMonth = (month: string | number) => {
  if (!month) return '-'
  return `${Number(month)}月`
}

export const formatPercent = (val: number | null | undefined) => {
  if (val == null) return '-'
  return `${val > 0 ? '+' : ''}${Number(val).toFixed(2)}%`
}

export const getDiffStyle = (val: number | null | undefined) => {
  if (val == null) return {}
  if (Math.abs(val) >= 20) return { color: '#e53935', fontWeight: '600' }
  return { color: '#52c41a' }
}

export const getDiffBarStyle = (diff: number | null | undefined) => {
  if (diff == null) return {}
  return { width: `${Math.min(Math.abs(diff), 100)}%` }
}

export const parseMonthlyValues = (raw: string | null | undefined): number[] => {
  if (!raw) return []
  return raw
    .split(',')
    .map((v) => Number(v))
    .map((v) => (Number.isFinite(v) ? v : 0))
}

const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const COLOR_RATIO = '#1677ff'
const COLOR_ACTUAL = '#fa8c16'

export const buildSparklineOption = (ratioArr: number[], actualArr: number[]) => ({
  grid: { top: 4, right: 4, bottom: 4, left: 4 },
  tooltip: { show: false },
  xAxis: { type: 'category', show: false, data: MONTH_LABELS, boundaryGap: false },
  yAxis: { type: 'value', show: false },
  series: [
    {
      type: 'line',
      data: ratioArr,
      smooth: true,
      symbol: 'none',
      lineStyle: { color: COLOR_RATIO, width: 1.5 },
      areaStyle: { color: 'rgba(22, 119, 255, 0.08)' },
    },
    {
      type: 'line',
      data: actualArr,
      smooth: true,
      symbol: 'none',
      lineStyle: { color: COLOR_ACTUAL, width: 1.5, type: 'dashed' },
    },
  ],
})

export const buildCurveOption = (ratioArr: number[], actualArr: number[]) => ({
  grid: { top: 40, right: 24, bottom: 40, left: 56 },
  legend: { data: ['系统计算', '实际设定'], top: 0 },
  tooltip: {
    trigger: 'axis',
    valueFormatter: (val: number) => (val == null ? '-' : Number(val).toFixed(4)),
  },
  xAxis: { type: 'category', data: MONTH_LABELS, boundaryGap: false },
  yAxis: { type: 'value', name: '系数' },
  series: [
    {
      name: '系统计算',
      type: 'line',
      data: ratioArr,
      smooth: true,
      lineStyle: { color: COLOR_RATIO, width: 2 },
      itemStyle: { color: COLOR_RATIO },
      areaStyle: { color: 'rgba(22, 119, 255, 0.08)' },
    },
    {
      name: '实际设定',
      type: 'line',
      data: actualArr,
      smooth: true,
      lineStyle: { color: COLOR_ACTUAL, width: 2, type: 'dashed' },
      itemStyle: { color: COLOR_ACTUAL },
    },
  ],
})
