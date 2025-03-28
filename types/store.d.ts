declare interface AclModuleType {
  admin: boolean
  permission: string[]
  role: string[]
}

declare interface BingModuleType {
  backgroundList: string[]
}

declare interface ErrorLogModuleType {
  errorLogs: any[]
}

declare interface RoutesModuleType {
  tab: {
    data: string | undefined
  }
  tabMenu: string | undefined
  activeMenu: {
    data: string | undefined
  }
  routes: any[]
  allRoutes: any[]
  breadcrumbRoutes: any[]
}

declare type DeviceType = 'mobile' | 'desktop'
declare type LanguageType = 'zh' | 'en'

declare interface SettingsModuleType {
  collapse: boolean
  device: DeviceType
  language: LanguageType
  lock: boolean
  logo: string
  mode: string
  persistenceTab: boolean
  theme: ThemeType
  title: string
  scrollTop: []
}

declare interface TabsModuleType {
  caughtRoutes: []
  visitedRoutes: any[]
}

declare interface UserModuleType {
  avatar: string
  token: string | boolean
  username: string
}

interface ComponentList {
  actualTaxRate?: number;
  componentName?: string;
  componentUrl?: string;
  contractTerms?: string;
  currency?: number;
  customsDeclarationStatus?: number;
  existingPartsListId?: number;
  freight?: string;
  id?: number;
  invoicing?: number;
  invoicingTaxRate?: number;
  minQuantity?: number;
  moldCost?: string;
  moreCount?: number;
  numCartons?: number;
  orderNo?: string;
  poSkuId?: number;
  preTaxPrice?: string;
  purchaseCount?: number;
  purchaseId?: number;
  purchaseLink?: string;
  purchaseMatters?: string;
  repositoryId?: number;
  stock?: number;
  suppliserId?: number;
  suppliserList?: SuppliserList[];
  taxIncludedPrice?: string;
  totalPrice?: string;
  unit?: string;
  unitPrice?: string;
  useStockCount?: number;
  [property: string]: any;
}
declare interface SkuType {
  tempId: string
  poDetailData: {
    createTime?: string
    id?: number
    minQuantity?: number
    numCartons?: number
    orderTotalPrice?: string
    packedTenRecord?: string
    poRemarks?: string
    poSkuId?: number
    productManager?: string
    productName?: string
    purchaseSkuNumber?: number
    repositoryId?: number
    site?: number
    sku?: string
    skuImgUrl?: string
    skuRemarks?: string
    [property: string]: any;
  }
  skuComponentList: ComponentList[]
}
declare interface SkuModuleType {
  data: SkuType[]
}

declare interface PackingType {
  tempId: string
  fnSkuOrUpc: string
  sku: string
  productName: string
  count?: number
  skuImageUrl: string
}
declare interface PackingModuleType {
  packingData: PackingType[]
}
/**
 * 存储tab切换的状态
 */
declare interface TabState {
  [key: string]: number // 使用路径作为key，存储对应的tab值
}

/**
 * 存储步骤 reviewId -> stepNo
 */
declare interface StepNoState {
  stepNoMap: Map<number, number>
}
