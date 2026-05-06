export interface FavoritePromptItem {
  id: number
  prompt: string
  category: string | null
  sortNo: number
  createTime: string
  updateTime: string
}

export interface FavoritePromptAddPayload {
  prompt: string
  category?: string | null
  sortNo?: number
}

export interface FavoritePromptUpdatePayload {
  id: number
  prompt?: string
  category?: string | null
  sortNo?: number
}
