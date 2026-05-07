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
