/**
 * 站点枚举，与后端 Site.java 对应
 */
export enum SiteEnum {
  ALL = -1,
  AMAZON_US = 0,
  AMAZON_UK = 1,
  AMAZON_DE = 2,
  AMAZON_CA = 3,
  WALMART_US = 4,
  AMAZON_MX = 5,
  AMAZON_BR = 6,
  AMAZON_IT = 7,
  AMAZON_FR = 8,
  AMAZON_ES = 9,
  AMAZON_NL = 10,
  AMAZON_SE = 11,
  AMAZON_TR = 12,
  AMAZON_PL = 13,
  AMAZON_BE = 14,
  AMAZON_JP = 15,
  TIKTOK_US = 16,
  US_OVERSEAS_WAREHOUSE = 17,
  AMAZON_IE = 18,
  AMAZON_SA = 19,
  AMAZON_UAE = 20,
}

/** 站点名称映射 */
export const SITE_NAME_MAP: Record<SiteEnum, string> = {
  [SiteEnum.ALL]: '全部站点',
  [SiteEnum.AMAZON_US]: '亚马逊US美国',
  [SiteEnum.AMAZON_UK]: '亚马逊UK英国',
  [SiteEnum.AMAZON_DE]: '亚马逊DE德国',
  [SiteEnum.AMAZON_CA]: '亚马逊CA加拿大',
  [SiteEnum.WALMART_US]: '沃尔玛US美国',
  [SiteEnum.AMAZON_MX]: '亚马逊MX墨西哥',
  [SiteEnum.AMAZON_BR]: '亚马逊BR巴西',
  [SiteEnum.AMAZON_IT]: '亚马逊IT意大利',
  [SiteEnum.AMAZON_FR]: '亚马逊FR法国',
  [SiteEnum.AMAZON_ES]: '亚马逊ES西班牙',
  [SiteEnum.AMAZON_NL]: '亚马逊NL荷兰',
  [SiteEnum.AMAZON_SE]: '亚马逊SE瑞典',
  [SiteEnum.AMAZON_TR]: '亚马逊TR土耳其',
  [SiteEnum.AMAZON_PL]: '亚马逊PL波兰',
  [SiteEnum.AMAZON_BE]: '亚马逊BE比利时',
  [SiteEnum.AMAZON_JP]: '亚马逊JP日本',
  [SiteEnum.TIKTOK_US]: 'Tiktok美国',
  [SiteEnum.US_OVERSEAS_WAREHOUSE]: '美国-海外仓',
  [SiteEnum.AMAZON_IE]: '亚马逊IE爱尔兰',
  [SiteEnum.AMAZON_SA]: '亚马逊SA沙特',
  [SiteEnum.AMAZON_UAE]: '亚马逊UAE阿联酋',
}

/** 核心 FBA 站点列表 */
export const FBA_CORE_SITE_LIST: { id: number; label: string }[] = [
  { id: SiteEnum.AMAZON_US, label: SITE_NAME_MAP[SiteEnum.AMAZON_US] },
  { id: SiteEnum.AMAZON_UK, label: SITE_NAME_MAP[SiteEnum.AMAZON_UK] },
  { id: SiteEnum.AMAZON_DE, label: SITE_NAME_MAP[SiteEnum.AMAZON_DE] },
  { id: SiteEnum.AMAZON_CA, label: SITE_NAME_MAP[SiteEnum.AMAZON_CA] },
  { id: SiteEnum.AMAZON_JP, label: SITE_NAME_MAP[SiteEnum.AMAZON_JP] },
  { id: SiteEnum.WALMART_US, label: SITE_NAME_MAP[SiteEnum.WALMART_US] },
]
