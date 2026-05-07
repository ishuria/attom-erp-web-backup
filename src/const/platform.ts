/**
 * 平台编码常量，与后端 com.attom.types.enums.Platform 对齐
 * 后端 PlatformOperationRespDTO.platformCode 就是这些值
 */
export const PlatformCode = {
  AMAZON: 'Amazon',
  WALMART: 'Walmart',
  TIKTOK: 'TikTok',
} as const

export type PlatformCodeType = (typeof PlatformCode)[keyof typeof PlatformCode]

/** 平台中文名映射，前端展示用 */
export const PLATFORM_NAME_MAP: Record<PlatformCodeType, string> = {
  [PlatformCode.AMAZON]: '亚马逊',
  [PlatformCode.WALMART]: '沃尔玛',
  [PlatformCode.TIKTOK]: 'TikTok',
}
