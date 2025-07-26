class ShipmentPermission {
  /** 报关资料生成 */
  static readonly CUSTOMS_DECLARATION_GENERATE = 'shipment:generate:customs:declaration'
  /** 清关资料生成 */
  static readonly CUSTOMS_TAXREFUND = 'shipment:generate:taxRefund'
  /** 入仓单生成 */
  static readonly CUSTOMS_WAREHOUSE_RECEIPT_PDF = 'shipment:upload:warehouse:receipt:pdf'
  /** 已发未报查询 */
  static readonly CUSTOMS_YFWB_LIST = 'shipment:yfwb:aggregation:list'
  /** 关税单上传 */
  static readonly CUSTOMS_TARIFF_BILL_PDF = 'shipment:upload:tariff:bill:pdf'
  /** 查看匹配 */
  static readonly CUSTOMS_DETAIL_LIST = 'shipment:detail:list'
  /** 修改 */
  static readonly CUSTOMS_UPDATE = 'shipment:update'
  /** 打包归档 */
  static readonly CUSTOMS_PACKAGE_ARCHIVE = 'shipment:package:archive'
  /** 退税归档 */
  static readonly CUSTOMS_TAXREFUND_ARCHIVE = 'shipment:taxRefund:archive'
  /** 查询头程运费 */
  static readonly CUSTOMS_COST_LIST = 'shipment:cost:list'
  /** 撤销打包归档 */
  static readonly CUSTOMS_PACKAGE_CANCEL_ARCHIVE = 'shipment:package:cancel:archive'
  /** 撤销退税归档 */
  static readonly CUSTOMS_TAXREFUND_CANCEL_ARCHIVE = 'shipment:taxRefund:cancel:archive'
  /** 撤销装箱 */
  static readonly CUSTOMS_CANCEL_ENCASEMENT = 'shipment:cancel:encasement'
  /** 出库归档 */
  static readonly CUSTOMS_OUTBOUND_ARCHIVE = 'shipment:outbound:archive'
  /** 撤销出库归档 */
  static readonly CUSTOMS_OUTBOUND_CANCEL = 'shipment:outbound:cancel'

  /** 操作列权限 */
  static operationColPermission(): PermissionConfig {
    return {
      role: [],
      permission: [
        this.CUSTOMS_DETAIL_LIST,
        this.CUSTOMS_UPDATE,
        this.CUSTOMS_PACKAGE_ARCHIVE,
        this.CUSTOMS_TAXREFUND_ARCHIVE,
        this.CUSTOMS_COST_LIST,
        this.CUSTOMS_PACKAGE_CANCEL_ARCHIVE,
        this.CUSTOMS_TAXREFUND_CANCEL_ARCHIVE,
        this.CUSTOMS_CANCEL_ENCASEMENT,
        this.CUSTOMS_OUTBOUND_ARCHIVE,
        this.CUSTOMS_OUTBOUND_CANCEL,
      ],
      mode: 'oneOf',
    }
  }
}

export default ShipmentPermission
