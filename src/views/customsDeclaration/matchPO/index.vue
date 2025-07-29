<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button v-permissions="{ permission: [ShipmentPermission.CUSTOMS_DECLARATION_GENERATE] }" :loading="declarationLoading" type="primary" @click="handleGenerateDeclaration">报关资料生成</el-button>
        <el-button v-permissions="{ permission: [ShipmentPermission.CUSTOMS_TAXREFUND] }" :loading="clearanceLoading" type="primary" @click="handleGenerateClearance">清关资料生成</el-button>
        <el-button v-permissions="{ permission: [ShipmentPermission.CUSTOMS_WAREHOUSE_RECEIPT_PDF] }" type="primary" @click="uploadPDFVisible = true">入仓单生成</el-button>
        <el-button v-permissions="{ permission: [ShipmentPermission.CUSTOMS_YFWB_LIST] }"  type="primary" @click="sentButNotReportedVisible = true">已发未报</el-button>
        <el-button v-permissions="{ permission: [ShipmentPermission.CUSTOMS_TARIFF_BILL_PDF] }" type="primary" @click="showTariffBillUpload">关税单上传</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keypress.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData"/>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      ref="tableRef"
      v-loading="listLoading"
      border
      :cell-style="CellStyle"
      class="noneHoveTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      :row-class-name="tableRowClassName"
      @selection-change="setSelectRows"
    >
      <el-table-column type="selection"/>
      <el-table-column label="发货日期" min-width="115" prop="shipmentDate">
        <template #default="{ row }">
          {{  row.shipmentDate ? row.shipmentDate.split(' ')[0] : '' }}
        </template>
      </el-table-column>
      <el-table-column label="合同编号" prop="contractNumber" :width="flexColumnWidth(list, '合同编号', 'contractNumber')"/>
      <el-table-column label="Shipment ID" prop="shipmentId" :width="flexColumnWidth(list, 'Shipment ID', 'shipmentId', 50)">
        <template #default="{ row }">
          <span class="copySku" @click="handleClipboard($event, row.shipmentId)" >
            {{ row.shipmentId }}
            <vab-icon icon="file-copy-2-fill" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Reference ID" min-width="130" prop="referenceId"/>
      <el-table-column label="站点" min-width="130" prop="site"/>
      <el-table-column label="货代单号" min-width="120" prop="freightForwardingNumber" :width="flexColumnWidth(list, '货代单号', 'freightForwardingNumber')"/>
      <el-table-column label="合并报关" prop="mergeCustomsDeclarationList" :width="calculateBrColumnWidth(list, (row: any) => row.mergeCustomsDeclarationList, 100, 27)">
        <template #default="{ row }">
          <el-tooltip content=" " :disabled="!row.overflow_mergeCustomsDeclarationList" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row._mergeCustomsDeclarationListFull }}</div>
            </template>
            <span v-html="row._mergeCustomsDeclarationList"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="合并清关" prop="mergeCustomsClearanceList" :width="calculateBrColumnWidth(list, (row: any) => row.mergeCustomsClearanceList, 100, 27)">
        <template #default="{ row }">
          <el-tooltip content=" " :disabled="!row.overflow_mergeCustomsClearanceList" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row._mergeCustomsClearanceListFull }}</div>
            </template>
            <span v-html="row._mergeCustomsClearanceList"></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="货代渠道" min-width="180" prop="channelId">
        <template #default="{ row }">
          <el-select v-model="row.channelId" >
            <el-option
              v-for="item in forwarderOption"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="箱数" min-width="80" prop="encasementNumber" />
      <el-table-column label="产品总数" min-width="100" prop="totalNumber"/>
      <el-table-column label="重量" min-width="70" prop="weight"/>
      <el-table-column label="体积" min-width="70" prop="volume"/>
      <el-table-column label="预估运费" min-width="100" prop=""/>
      <el-table-column label="实际运费" min-width="100" prop=""/>
      <el-table-column label="已付运费" min-width="100" prop="payStatus">
        <template #default="{ row }">
          <el-checkbox
            v-model="row.payStatus"
            :class="handleColorSwitch(row)"
            @change="handleUpdatePayStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="160" prop="status" >
        <template #default="{ row }">
          <span
            :style="{
              color: row.matchStatus === 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)' // 绿色
            }">
            {{ row.matchStatus === 0 ? '待匹配' : '已匹配' }}
          </span><br />
          <span :style="{ color: row.packArchiveStatus === 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)' }">
            {{ row.packArchiveStatus === 0 ? '待打包归档' : '已打包归档' }}
          </span><br />
          <span :style="{ color: row.taxRefundStatus === 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)' }">
            {{ row.taxRefundStatus === 0 ? '待归档到退税管理' : '已归档到退税管理' }}
          </span><br />
          <span :style="{ color: row.outboundStatus === 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)' }">
            {{ row.outboundStatus === 0 ? '待出库归档' : '已出库归档' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-permissions="ShipmentPermission.operationColPermission()" fixed="right" label="操作" width="115">
        <template #default="{ row }">
          <el-dropdown>
            <el-button v-permissions="{ permission: [ShipmentPermission.CUSTOMS_DETAIL_LIST] }" text type="primary" @click="showMatch(row)">
              匹配
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item  v-permissions="{ permission: [ShipmentPermission.CUSTOMS_DETAIL_LIST] }" @click="showMatch(row)">
                  <el-link type="primary" underline='never' >匹配</el-link>
                </el-dropdown-item>
                <el-dropdown-item v-permissions="{ permission: [ShipmentPermission.CUSTOMS_UPDATE] }" @click="showModify(row)">
                  <el-link :disabled="row.taxRefundStatus === 1" type="primary" underline='never'>修改</el-link>
                </el-dropdown-item>
                <el-dropdown-item v-permissions="{ permission: [ShipmentPermission.CUSTOMS_PACKAGE_ARCHIVE] }" @click="handleArchivePackage(row)">
                  <el-link :disabled="row.packArchiveStatus === 1" type="primary" underline='never' >打包归档</el-link>
                </el-dropdown-item>
                <el-dropdown-item v-permissions="{ permission: [ShipmentPermission.CUSTOMS_TAXREFUND_ARCHIVE] }" @click="handleArchiveTaxRefund(row)">
                  <el-link :disabled="row.taxRefundStatus === 1" type="primary" underline='never'>退税归档</el-link>
                </el-dropdown-item>
                <el-dropdown-item v-permissions="{ permission: [ShipmentPermission.CUSTOMS_OUTBOUND_ARCHIVE] }"  @click="handleArchiveOutbound(row)" >
                  <el-link :disabled="row.outboundStatus === 1" type="primary" underline='never' >出库归档</el-link>
                </el-dropdown-item>
                <el-dropdown-item v-permissions="{ permission: [ShipmentPermission.CUSTOMS_COST_LIST] }" @click="showFirstLegFreight(row)">
                  <el-link type="primary" underline='never' >头程运费</el-link>
                </el-dropdown-item>
                <el-dropdown-item >
                  <el-link type="primary" underline='never' >合同导入</el-link>
                </el-dropdown-item>
                <el-dropdown-item v-permissions="{ permission: [ShipmentPermission.CUSTOMS_PACKAGE_CANCEL_ARCHIVE] }" @click="handleCancelArchivePackage(row)">
                  <el-link :disabled="row.packArchiveStatus === 0" type="primary" underline='never'>撤销打包归档</el-link>
                </el-dropdown-item>
                <el-dropdown-item v-permissions="{ permission: [ShipmentPermission.CUSTOMS_TAXREFUND_CANCEL_ARCHIVE] }" @click="handleCancelArchiveTaxRefund(row)">
                  <el-link :disabled="row.taxRefundStatus === 0" type="primary" underline='never' >撤销退税归档</el-link>
                </el-dropdown-item>
                <el-dropdown-item v-permissions="{ permission: [ShipmentPermission.CUSTOMS_OUTBOUND_CANCEL] }" @click="handleCancelArchiveOutbound(row)">
                  <el-link :disabled="row.outboundStatus === 0" type="primary" underline='never'>撤销出库</el-link>
                </el-dropdown-item>
                <el-dropdown-item v-permissions="{ permission: [ShipmentPermission.CUSTOMS_CANCEL_ENCASEMENT] }" @click="handleCancelEncasement(row)">
                  <el-link type="primary" underline='never'>撤销装箱(删除)</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据"/>
      </template>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- 头程运费 -->
    <vab-dialog
      v-model="firstLegFreightVisible"
      class="dialog"
      :draggable="false"
      :title="`运费明细 | 货代单号：${_freightForwardingNumber} | 自测重量：${_weight} | 自测体积：${_volume}`"
      top="7vh"
      width="85%"
    >
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="showAddFee">添加费用</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
      <el-table
        border :cell-style="firstLegFreightStyle"
        class="noneHoveTable center-table"
        :data="costList"
        :header-cell-style="{ textAlign: 'center' }"
        max-height="70vh"
        show-summary
        stripe
        :summary-cell-style="{ textAlign: 'center' }"
        :summary-method="handleSummaryMethod"
        @cell-click="cellClick"
        @close="closeFirstLegFreight"
      >
        <el-table-column label="费用名" prop="costName" :width="flexColumnWidth(costList, '费用名', 'costName')"/>
        <el-table-column label="结算对象" min-width="120">
          <template #default="{ row }">
            <el-select v-model="row.settlementObject" :disabled="row.updateDisabled === 1" @change="handleUpdateSettlementObject(row)" >
              <el-option
                v-for="item in settlementObjectList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="70" prop="count">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.count"  @blur="clickCostCancel($event, row)" @keyup.enter="clickCostCancel($event, row)" />
            </div>
            <span>{{ row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="unitPrice" :width="flexColumnWidth(costList, '单价', 'unitPrice')">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.unitPrice"  @blur="clickCostCancel($event, row)" @keyup.enter="clickCostCancel($event, row)" />
            </div>
            <span>{{ row.unitPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预估总费用" min-width="110" prop="estimateCost"/>
        <el-table-column label="暂估汇率" min-width="100" prop="estimateExchangeRate">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.estimateExchangeRate"  @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.estimateExchangeRate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="货币" min-width="100" prop="currency">
          <template #default="{ row }">
            <el-select v-model="row.currency" :disabled="row.updateDisabled === 1" style="min-width: 100%;" @change="handleUpdateLegCurrency(row)">
              <el-option
                v-for="item in currencyList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="实际总费用" min-width="110" prop="actualCost">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.actualCost"  @blur="clickCostCancel($event, row)" @keyup.enter="clickCostCancel($event, row)" />
            </div>
            <span>{{ row.actualCost }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实际汇率" min-width="100" prop="actualExchangeRate">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.actualExchangeRate" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.actualExchangeRate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="差额" min-width="90" prop="difference">
          <template #default="{ row }">
            <span :style="{ color: row.difference < 0 ? 'var(--el-color-success)' : 'var(--el-color-danger)' }">{{ row.difference == null ? '' : `${row.difference * 100}%` }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已付" min-width="90" prop="payStatus">
          <template #default="{ row }">
            <el-checkbox v-model="row.payStatus" :false-value="0" :true-value="1" @change="handleUpdateLegPayStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="付款日期" min-width="180" prop="payDate"/>
        <el-table-column label="合并报关" min-width="100" prop="bgStatus">
          <template #default="{ row }">
            <el-checkbox v-model="row.bgStatus" :false-value="0" :true-value="1" @change="handleUpdateBgStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="合并报关的货代单号" prop="mergeCustomsDeclarationList" :width="calculateBrColumnWidth(costList, (row: any) => row.mergeCustomsDeclarationList)">
          <template #header>
            合并报关的<br />货代单号
          </template>
          <template #default="{ row }">
            <span v-html="row.mergeCustomsDeclarationList"></span>
          </template>
        </el-table-column>
        <el-table-column label="合并清关" min-width="100" prop="qgStatus">
          <template #default="{ row }">
            <el-checkbox v-model="row.qgStatus" :false-value="0" :true-value="1" @change="handleUpdateQgStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="合并清关的货代单号" prop="mergeCustomsClearanceList" :width="calculateBrColumnWidth(costList, (row: any) => row.mergeCustomsClearanceList)">
          <template #header>
            合并清关的<br />货代单号
          </template>
          <template #default="{ row }">
            <span v-html="row.mergeCustomsClearanceList"></span>
          </template>
        </el-table-column>
        <el-table-column label="SKU运费分摊方式" min-width="100" prop="">
          <template #header>
            SKU运费<br>分摊方式
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template #default="{ row, $index }">
            <el-link :disabled="row.updateDisabled === 1" type="danger" underline='never' @click="handleDelLeg($index, row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <template #footer></template>
    </vab-dialog>
    <!-- 匹配 -->
    <vab-match-dialog
      :disabled1="disabled1"
      :disabled2="disabled2"
      :disabled3="disabled3"
      :match-visible="matchVisible"
      :ship-id="shipId"
      :status="status"

      @update-match-visible="handleCloseMatch"
    />
    <!-- 修改货代渠道 -->
    <vab-dialog
      v-model="updateForwarderChannelVisible"
      title="修改货代渠道"
      width="20%"
    >
      <el-form ref="forwarderChannelFormRef" label-position="top" :model="forwarderChannelForm" :rules="forwarderChannelFormRules" style=" margin-right: 10px;margin-left: 10px">
        <el-form-item label="货代渠道" prop="forwarderChannel">
          <el-input v-model="forwarderChannelForm.forwarderChannel" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeForwarderChannel">取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 修改 -->
    <vab-dialog
      v-model="modifyVisible"
      title="修改"
      width="20%"
    >
      <el-form label-position="right" label-width="auto" :model="modifyForm" style="margin: 0;">
        <el-form-item label="合同编号" prop="contractNumber">
          <el-input v-model="modifyForm.contractNumber" clearable />
        </el-form-item>
        <el-form-item label="Reference ID" prop="referenceId">
          <el-input v-model="modifyForm.referenceId" clearable />
        </el-form-item>
        <el-form-item label="货代单号" prop="freightForwardingNumber">
          <el-input v-model="modifyForm.freightForwardingNumber" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modifyVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmModify">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 二次确认生成文件 -->
    <vab-dialog
      v-model="confirmTwiceVisible"
      :title="`确定要生成${confirmTwiceTitle}资料吗？`"
      width="20%"
      @close="closeGenerate"
    >
      <el-table
        border
        :data="confirmTwiceList"
        :header-cell-style="{ textAlign: 'center' }"
      >
        <el-table-column label="货代单号" prop="freightForwardingNumber"/>
        <el-table-column :label="`合并${confirmTwiceTitle}`" prop="mergeList">
          <template #default="{ row }">
            <span v-html="row.mergeList"></span>
          </template>
        </el-table-column>

      </el-table>
      <template #footer>
        <el-button @click="closeGenerate">取消</el-button>
        <el-button :loading="confirmTwiceTitle === '报关' ? declarationLoading : clearanceLoading" type="primary" @click="handleDownload">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 头程运费-添加费用 -->
    <vab-dialog v-model="addFeeVisible" :title="`货代渠道：${freightName}`" width="20%" >
      <el-form ref="addFeeFormRef" label-position="top" :model="addFeeForm" :rules="addFeeFormRules" >
        <el-form-item label="费用名" prop="costNameId">
          <el-select v-model="addFeeForm.costNameId" clearable filterable placeholder="请选择费用名" >
            <el-option
              v-for="item in costNameList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addFeeVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddFee">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 入仓单上传 -->
    <vab-dialog v-model="uploadPDFVisible" title="入仓单上传" width="25%">
      <el-upload
        v-model:file-list="fileList"
        :auto-upload="false"
        class="upload-demo"
        drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖拽至此处或 <em>点击上传</em>
        </div>
      </el-upload>
      <template #footer>
        <div style="text-align: center;">
          <el-button :loading="uploadLoading" type="success" @click="uploadPDF">上传</el-button>
        </div>
      </template>
    </vab-dialog>
    <sent-but-not-reported v-model="sentButNotReportedVisible" />
    <!-- 关税单上传 -->
    <tariff-bill-upload v-model="tariffBillUploadVisible" :shipmentIdList="shipmentIdList" />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Search, UploadFilled } from '@element-plus/icons-vue'
import type { FormInstance, TableInstance } from 'element-plus'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { addShipmentCost, archiveOutbound, archivePackageShipment, archiveTaxRefund, cancelArchiveOutbound, cancelArchivePackageShipment, cancelArchiveTaxRefund, cancelShipmentEncasement, delShipmentLeg, generateCustomsDeclaration, generateTaxRefund, getCostNameListByChannelId, getMatchPoList, getShipmentCostList, getShipmentLegCurrencyList, updateBgShipmentLeg, updateQgShipmentLeg, updateShipment, updateShipmentLeg, updateShipmentLegCurrency, updateShipmentLegPay, updateShipmentPay } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { downloadFileP, downloadFilePDH } from '/@/api/devlocal/download'
import { getChannelList, getSettlementObjectList } from '/@/api/devlocal/encasement'
import ShipmentPermission from '/@/permissions/shipment.ts'
import type { IGetMatchPoList } from '/@/type/customsDeclarationAndTaxRefund/matchPo'
import handleClipboard from '/@/utils/clipboard'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { calculateBrColumnWidth, flexColumnWidth, processField } from '/@/utils/tableColum'

defineOptions({
  name: 'MatchPO'
})

// 关税单上传
const tariffBillUploadVisible = ref<boolean>(false)
const shipmentIdList = ref<{ label: string, value: number }[]>([])
const showTariffBillUpload = () => {
  // 校验:多选‘匹配’里的记录后，才可以点击关税单上传’ 已经匹配过关税单的货件不能再匹配；
  if (selectRows.value.length === 0) {
    $baseMessage('您未选择任何行！', 'warning', 'hey')
    return
  }
  // 校验:多选的记录是同一个国家
  const countryList = selectRows.value.map((item: any) => item.site)
  if (new Set(countryList).size !== 1) {
    $baseMessage('多选的记录必须是同一个国家！', 'warning', 'hey')
    return
  }
  // 校验:已经匹配过关税单的货件不能再匹配
  if (selectRows.value.some((item: any) => item.tariffId !== null)) {
    $baseMessage('已经匹配过关税单的货件不能再匹配！', 'warning', 'hey')
    return
  }
  // 构建选择的shipmentId列表
  shipmentIdList.value = selectRows.value.map((item: any) => {
    return {
      label: item.shipmentId,
      value: item.id
    }
  })
  tariffBillUploadVisible.value = true
}
const uploadPDFVisible = ref<boolean>(false)
const fileList = ref<any[]>([])
const uploadLoading = ref<boolean>(false)
const uploadPDF = async () => {
  let uploadForm = new FormData()
  fileList.value.forEach((item: any) => {
    uploadForm.append('file', item.raw)
  })
  if (fileList.value.length === 0) {
    $baseMessage('请先上传文件！', 'warning', 'hey')
    return
  }
  uploadLoading.value = true
  const res = await downloadFilePDH("/upload/warehouse/receipt/pdf", uploadForm)
  if (res) {
    uploadLoading.value = false
    // console.log(res)
    if (res.type === 'application/json') {
        const text = await res.text(); // 把 blob 转成文本
        const json = JSON.parse(text);      // 解析成 JSON 对象
        $baseMessage(json?.msg, 'error')
    } else {
      $baseMessage('上传文件成功！', 'success', 'hey')
    }
  }
}

const sentButNotReportedVisible = ref<boolean>(false)
const addFeeFormRef = ref<FormInstance>()
const addFeeVisible = ref<boolean>(false)
const addFeeForm = reactive<any>({})
const addFeeFormRules = reactive<any>({
  costNameId: [
    { required: true, message: '请选择费用名', trigger: 'change' }
  ]
})
const costNameList = ref<{ id: number, label: string }[]>([])
const showAddFee = async () => {
  addFeeVisible.value = true
  if (channelId) {
    const { data } = await getCostNameListByChannelId({ channelId: channelId })
    costNameList.value = data
  } else {
    costNameList.value = []
  }

  addFeeFormRef.value?.resetFields()
}
const handleAddFee = async () => {
  addFeeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      // 先判断是否费用名重复
      const costNames = costList.value.map((item: any) => item.costName)
      const costName = costNameList.value.find((item: any) => item.id === addFeeForm.costNameId)?.label!
      if (costNames.includes(costName)) {
        $baseMessage('费用名重复，请重新选择！', 'error')
        return
      }
      // console.log(channelId)
      const { data } = await addShipmentCost({
        shipId: _shipId.value!,
        costName,
        shipmentId,
        channelId
      })
      if (data) {
        $baseMessage('添加费用成功！', 'success')
        addFeeVisible.value = false
        fetchCostData(_shipId.value!)
      }
    }
  })
}
const router = useRouter()
const route = useRoute()
const tableRef = ref<TableInstance>()
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const list = ref<IGetMatchPoList[]>([])
const listLoading = ref<boolean>(false)
const selectRows = ref<any>([])
const modifyVisible = ref<boolean>(false)
const modifyForm = reactive<any>({})
const _row = ref<any>(null)
const confirmTwiceVisible = ref<boolean>(false)
const confirmTwiceTitle = ref<string>('')
const confirmTwiceList = ref<any>([])
const closeGenerate = () => {
  if (confirmTwiceTitle.value === '报关')
    declarationLoading.value = false
  else
    clearanceLoading.value = false
  confirmTwiceVisible.value = false
}
const showModify = (row: any) => {
  if (row.taxRefundStatus === 1) return
  modifyVisible.value = true
  _row.value = row
  modifyForm.contractNumber = row.contractNumber
  modifyForm.referenceId = row.referenceId
  modifyForm.freightForwardingNumber = row.freightForwardingNumber
}
const setSelectRows = (value: any) => {
  selectRows.value = value
}
// 退税归档
const handleArchiveTaxRefund = (row: any) => {
  if (row.taxRefundStatus === 1) {
    $baseMessage('此记录已退税归档，请勿重复退税归档！', 'error')
    return
  }
  $baseConfirm('确定要退税归档吗？', null, async () => {
    const { data } = await archiveTaxRefund({
      id: row.id
    })
    if (data) {
      $baseMessage('退税归档成功！', 'success')
      fetchData()
    }
  })
}
const handleCancelArchiveTaxRefund = (row: any) => {
  if (row.taxRefundStatus === 0) {
    $baseMessage('此批次的状态不是已归档到税管理，不能进行撤销退税归档操作！', 'error')
    return
  }
  $baseConfirm('确定要撤销退税归档吗？', null, async () => {
    const { data } = await cancelArchiveTaxRefund({
      id: row.id
    })
    if (data) {
      $baseMessage('撤销退税归档成功！', 'success')
      fetchData()
    }
  })
}
// 货代渠道选项
const forwarderOption = ref<any>([])
// 头程运费可见
const firstLegFreightVisible = ref<boolean>(false)
// 匹配可见
const matchVisible = ref<boolean>(false)
const status = ref<number>(0)
const shipId = ref<number>(0)

// 撤销装箱
const handleCancelEncasement = async (row: any) => {
  $baseConfirm('确定要撤销装箱（删除）吗', null, async () => {
    const { data } = await cancelShipmentEncasement({
      id: row.id
    })
    if (data) {
      $baseMessage('撤销装箱（删除）成功！', 'success')
      fetchData()
    }
  })
}
const handleDownload = async () => {
  if (confirmTwiceTitle.value === '报关') {
    declarationLoading.value = true
    try {
      const ids = selectRows.value.map((item: any) => item.id).join(',')
      const { data } = await generateCustomsDeclaration({
        ids
      })
      if (data) {
        data.forEach(async (fileName: string) => {
          try {
            await downloadFileP('/shipment/download', {
              fileName
            }).then((res) => {
              console.log(res);
            }).catch((error) => {
              console.error(error);
            })
            $baseMessage('生成报关资料成功！', 'success')
          } catch {
            $baseMessage('生成报关资料失败！', 'error')
          }
        })
      }
    } catch(error) {
      console.error(error)
    } finally {
      declarationLoading.value = false
    }
  } else {
    clearanceLoading.value = true
    try {
      const ids = selectRows.value.map((item: any) => item.id).join(',')
      const { data } = await generateTaxRefund({
        ids
      })
      if (data) {
        data.forEach(async (fileName: string) => {
          try {
            await downloadFileP('/shipment/download', {
              fileName
            }).then((res) => {
              console.log(res);
            }).catch((error) => {
              console.error(error);
            })
            $baseMessage('生成清关资料成功！', 'success')
          } catch {
            $baseMessage('生成清关资料失败！', 'error')
          }
        })
      }
    } catch(error) {
      console.error(error)
    } finally {
      clearanceLoading.value = false
    }
  }
}
const isValid = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选择任何行！', 'error')
    return
  }
  // 判断选中的行的是否都是已归档到退税管理
  const valid = selectRows.value.every((item: any) => item.taxRefundStatus === 1)
  if (!valid) {
    $baseMessage('选中的行状态为‘待归档到退税管理’时，无法生成报关资料！', 'error')
    return
  }
  const valid2 = selectRows.value.every((item: any) => item.outboundStatus === 0)
  if (!valid2) {
    $baseMessage('选中的行状态为‘已出库归档’时，无法生成报关资料！', 'error')
    return
  }
  // const valid = selectRows.value.every((item: any) => item.packArchiveStatus === 1)
  // if (!valid) {
  //   $baseMessage('选中的行状态为‘待打包归档’时，无法生成报关资料！', 'error')
  //   return
  // }
  const allContractNumbers = selectRows.value.map((item: any) => item.contractNumber);
  const hasDifferentContractNumbers = new Set(allContractNumbers).size > 1;
  // console.log(allContractNumbers)
  // console.log(new Set(allContractNumbers))
  if (hasDifferentContractNumbers) {
    $baseMessage('选中的行包含不同的合同号，无法生成报关资料！', 'error');
    return;
  }
  confirmTwiceVisible.value = true
}
const declarationLoading = ref<boolean>(false)
const clearanceLoading = ref<boolean>(false)
// 报关资料生成
const handleGenerateDeclaration = () => {
  confirmTwiceTitle.value = '报关'
  isValid()
  confirmTwiceList.value = selectRows.value
    .filter((item: any) => item.freightForwardingNumber !== '' || item.mergeCustomsDeclarationList !== '')
    .map((item: any) => ({
      freightForwardingNumber: item.freightForwardingNumber,
      mergeList: item.mergeCustomsDeclarationList
    }));
}
// 清关资料生成
const handleGenerateClearance = async () => {
  confirmTwiceTitle.value = '清关'
  isValid()
  confirmTwiceList.value = selectRows.value
    .filter((item: any) => item.freightForwardingNumber !== '' || item.mergeCustomsClearanceList !== '')
    .map((item: any) => ({
      freightForwardingNumber: item.freightForwardingNumber,
      mergeList: item.mergeCustomsClearanceList
    }));
}
let copyRow: any

// 修改付款状态
const handleUpdatePayStatus = async (row: any) => {
  const item = payStatusList.value.find((item: any) => item.id === row.id)
  if (row.payStatus === true) {
    item!.payStatus = 2
  } else {
    item!.payStatus = 0
  }
  await updateShipmentPay({
    id: row.id,
    status: item?.payStatus!
  })
}

// 修改货代渠道可见
const updateForwarderChannelVisible = ref<boolean>(false)
const forwarderChannelForm = reactive<any>({})
const forwarderChannelFormRef = ref<FormInstance>()
const forwarderChannelFormRules = reactive<any>({
  forwarderChannel: [{ required: true, message: '请输入货代渠道', trigger: 'blur' }]
})
const confirmModify = async () => {
  const { data } = await updateShipment({
    id: _row.value.id,
    ...modifyForm
  })
  if (data) {
    $baseMessage('修改成功！', 'success')
    modifyVisible.value = false
    _row.value.contractNumber = modifyForm.contractNumber
    _row.value.referenceId = modifyForm.referenceId
    _row.value.freightForwardingNumber = modifyForm.freightForwardingNumber
  }
}

// 打包归档
const handleArchivePackage = async (row: any) => {
  if (row.packArchiveStatus === 1) {
    $baseMessage('此记录已打包归档，请勿重复打包归档！', 'error')
    return
  }
  $baseConfirm('确定要打包归档吗？', null, async () => {
    const { data } = await archivePackageShipment({
      id: row.id
    })
    if (data) {
      $baseMessage('打包归档成功', 'success')
      fetchData()
    }
  })
}

// 撤销打包归档
const handleCancelArchivePackage = async (row: any) => {
  if (row.packArchiveStatus === 0) {
    $baseMessage('此匹配数据状态不是已打包归档，不能进行撤销归档操作！', 'error')
    return
  }
  $baseConfirm('确定要撤销打包归档吗?', null, async () => {
    const { data } = await cancelArchivePackageShipment({
      id: row.id
    })
    if (data) {
      $baseMessage('撤销打包归档成功', 'success')
      fetchData()
    }
  })
}
// 出库归档
const handleArchiveOutbound = async (row: any) => {
  if (row.outboundStatus === 1) {
    $baseMessage('此记录已出库归档，请勿重复出库归档！', 'error')
    return
  }
  $baseConfirm('确定要出库归档吗？', null, async () => {
    const { data } = await archiveOutbound({
      id: row.id
    })
    if (data) {
      $baseMessage('出库归档成功', 'success')
      fetchData()
    }
  })
}
// 撤销出库归档
const handleCancelArchiveOutbound = async (row: any) => {
  if (row.outboundStatus === 0) {
    $baseMessage('该批次的出库状态不是已出库，不能进行撤销出库操作！', 'error')
    return
  }
  $baseConfirm('确定要撤销出库归档吗?', null, async () => {
    const { data } = await cancelArchiveOutbound({
      id: row.id
    })
    if (data) {
      $baseMessage('撤销出库归档成功', 'success')
      fetchData()
    }
  })
}
// 关闭货代渠道
const closeForwarderChannel = () => {
  updateForwarderChannelVisible.value = false
}
// 展示货代渠道
// const showForwarderChannel = () => {
//   updateForwarderChannelVisible.value = true
// }
const costList = ref<any>([])
const _shipId = ref<number>()
const _freightForwardingNumber = ref<string>('')
const _weight = ref<number>()
const _volume = ref<number>()

// 修改头程运费合并报关
const handleUpdateBgStatus = async (row: any) => {
  if (row.bgStatus && row.qgStatus) {
    $baseMessage('合并报关和合并清关只能选择一个', 'error')
    row.bgStatus = 0
    return
  }
  await updateBgShipmentLeg({
    id: row.id,
    status: row.bgStatus
  })
}
// 修改头程运费合并清关
const handleUpdateQgStatus = async (row: any) => {
  if (row.bgStatus && row.qgStatus) {
    $baseMessage('合并报关和合并清关只能选择一个', 'error')
    row.qgStatus = 0
    return
  }
  await updateQgShipmentLeg({
    id: row.id,
    status: row.qgStatus
  })
}
// 修改头程运费已付状态
const handleUpdateLegPayStatus = async (row: any) => {
  await updateShipmentLegPay({
    id: row.id,
    status: row.payStatus
  })
}
// 修改头程运费货币
const handleUpdateLegCurrency = async (row: any) => {
  const { data } = await updateShipmentLegCurrency({
    id: row.id,
    currency: row.currency
  })
  if (data) {
    row.estimateExchangeRate = data
  }
}
// 删除头程运费
const handleDelLeg = async (index: number, row: any) => {
  $baseConfirm('确定要删除费用吗?', null, async () => {
    const { data } = await delShipmentLeg({
      id: row.id
    })
    if (data) {
      costList.value.splice(index, 1)
      $baseMessage('删除费用成功！', 'success')
    }
  })
}
// 展示头程运费
const fetchCostData = async (id: number) => {
  try {
    const { data } = await getShipmentCostList({
      shipId: id
    })
    costList.value = data
    costList.value.forEach((item: any) => {
      item.mergeCustomsDeclarationList = item.mergeCustomsDeclarationList.join('<br />')
      item.mergeCustomsClearanceList = item.mergeCustomsClearanceList.join('<br />')
    })
    firstLegFreightVisible.value = true
  } catch {
    firstLegFreightVisible.value = false
  }
}
const currencyList = ref<{ id: number, label: string }[]>([])
let channelId = -1;
let freightName = ''
let shipmentId = ''
// 展示头程运费
const showFirstLegFreight = async (row: any) => {
  costList.value = []
  shipmentId = row.shipmentId
  _shipId.value = row.id
  _freightForwardingNumber.value = row.freightForwardingNumber
  _weight.value = row.weight
  _volume.value = row.volume
  channelId = row.channelId!
  freightName = forwarderOption.value.find((item: any) => item.id === row.channelId)?.label!
  const { data } = await getShipmentLegCurrencyList()
  currencyList.value = data
  await fetchCostData(row.id)
  fetchSettlementObjectData()
}
const settlementObjectList = ref<{ id: number, label: string }[]>([])
const fetchSettlementObjectData = async () => {
  const { data } = await getSettlementObjectList()
  settlementObjectList.value = data
}
// 关闭头程运费
const closeFirstLegFreight = () => {
  firstLegFreightVisible.value = false
}
// 开始匹配按钮是否禁用,所有按钮不显示
const disabled1 = ref<boolean>(false)
// 开始匹配禁用,所有按钮显示
const disabled2 = ref<boolean>(true)
// 控制所有按钮不显示
const disabled3 = ref<boolean>(false)
// 展示匹配
const showMatch = (row: IGetMatchPoList) => {
  status.value = row.packArchiveStatus!
  shipId.value = row.id!
  if (row.packArchiveStatus === 1) {
    disabled3.value = true
  } else if (row.packArchiveStatus === 0) {
    disabled3.value = false
  }
  if (row.lockStatus === 0) { //0 0 / 0 1 开始匹配显示,所有按钮不显示
    disabled1.value = false
    if (row.status === 0) {
      disabled2.value = true // 没有点开始匹配,所有按钮不显示
    } else if (row.status === 1) {
      disabled2.value = false // 开始匹配禁止,所有按钮显示
    }
  } else if (row.lockStatus === 1) { // 1 0
    disabled1.value = true //开始匹配禁用, 所有按钮不显示
  }
  matchVisible.value = true
}
// 关闭匹配
const handleCloseMatch = (value: boolean) => {
  matchVisible.value = value
  fetchData()
}

// 头程运费点击编辑
const cellClick = (row: any, column: any, cell: HTMLTableCellElement) => {
  const label = column.label
  if ((label === '数量' || label === '单价' || label === '暂估汇率') && row.updateDisabled === 1) {
    return
  }
  const firstChild = cell?.children[0]?.children[0];
  const secondChild = cell?.children[0]?.children[1];

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return;
  }

  copyRow = JSON.parse(JSON.stringify(row));

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none');
    secondChild.classList.add('none');

    focusAndSelectInput(cell);
  }
}
const clickCancel = async (event: Event, value: any) => {
  const rootElement = getRootElement(event.target, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    try {
      await updateShipmentLeg({
        id: value.id,
        count: value.count,
        unitPrice: value.unitPrice,
        estimateRate: value.estimateExchangeRate,
        actualRate: value.actualExchangeRate,
        cost: value.actualCost,
        settlementObject: value.settlementObject
      })
    } catch {
      Object.assign(value, copyRow)
    }
  }
}
const clickCostCancel = async (event: Event, value: any) => {
  const rootElement = getRootElement(event.target, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    try {
      await updateShipmentLeg({
        id: value.id,
        count: value.count,
        unitPrice: value.unitPrice,
        estimateRate: value.estimateExchangeRate,
        actualRate: value.actualExchangeRate,
        cost: value.actualCost,
        settlementObject: value.settlementObject
      })
      fetchCostData(_shipId.value!)
    } catch {
      Object.assign(value, copyRow)
    }
  }
}
const handleUpdateSettlementObject = async (row: any) => {
  try {
    await updateShipmentLeg({
      id: row.id,
      count: row.count,
      unitPrice: row.unitPrice,
      estimateRate: row.estimateExchangeRate,
      actualRate: row.actualExchangeRate,
      cost: row.actualCost,
      settlementObject: row.settlementObject
    })

  } catch {
    $baseMessage('更新失败！', 'error')
  }
}
// 头程运费：合计的方法
const handleSummaryMethod = ({ columns, data }: { columns: any[], data: any[] }): any[] => {
  const sums: any[] = []

  columns.forEach((column, index) => {
    // 第一列显示'合计'
    switch (index) {
      case 0: {
        sums[index] = h('div', { style: { fontWeight: '600' } }, [
          '总计',
        ])
        return
      }
      // case 6: {
      //   sums[index] = h('div', { style: { fontWeight: '600' } }, [
      //     'RMB',
      //   ])
      //   return
      // }
      case 7: {
        const values = data.map((item) => {
          // 计算每一行的合计值：实际总费用 * 实际汇率
          const estimateCost = Number(item['actualCost'])
          const estimateExchangeRate = Number(item['actualExchangeRate'])
          return estimateCost * estimateExchangeRate
        })

        // 计算所有值的合计
        sums[index] = h('div', { style: { fontWeight: '600' } }, [
          `${values.reduce((prev, curr) => {
            const value = Number(curr);
            if (Number.isNaN(value)) {
              return prev
            } else {
              return prev + curr // 累加有效的数值
            }
          }, 0).toFixed(2)}`,
        ])

        break;
      }
       case 4: {
        const values = data.map((item) => {
          // 计算每一行的合计值：预估总费用 * 暂估汇率
          const estimateCost = Number(item['estimateCost'])
          const estimateExchangeRate = Number(item['estimateExchangeRate'])
          return estimateCost * estimateExchangeRate
        })

        // 计算所有值的合计
        sums[index] = h('div', { style: { fontWeight: '600' } }, [
          `${values.reduce((prev, curr) => {
            const value = Number(curr);
            if (Number.isNaN(value)) {
              return prev
            } else {
              return prev + curr // 累加有效的数值
            }
          }, 0).toFixed(2)}`,
        ])

        break;
      }
      default: {
        sums[index] = '' // 如果不是 'estimateCost' 或 'estimateExchangeRate' 列，设置为空
      }
    }
  })

  return sums
}
const queryData = () => {
  queryForm.pageNo = 1
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSiz
    }
  })
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSiz
    }
  })
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSiz
    }
  })
  fetchData()
}

const CellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  if ([2, 3, 4, 6, 7, 8, 9].includes(data.columnIndex)) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: any
  rowIndex: number
}) => {
  if (row.lockStatus === 0 && row.status === 1) {
    return 'warning-row'
  }
  return ''
}
const firstLegFreightStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  switch (data.columnIndex) {
    case 0:
    case 13:
    case 15: {
      return {
        textAlign: 'left',
        cursor: 'not-allowed'
      }
    }
    case 4: {
      return {
        fontWeight: '600',
        textAlign: 'left',
        cursor: 'not-allowed'
      }
    }
    case 9:
    case 11: {
      return {
        textAlign: 'center',
        cursor: 'not-allowed'
      }
    }
    case 7: {
      return {
        fontWeight: '600',
        textAlign: 'center'
      }
    }
    case 2:
    case 3:
    case 5: {
      return {
        textAlign: 'left',
        cursor: 'pointer'
      }
    }
    default: {
      return {
        textAlign: 'center'
      }
    }
  }
}
const payStatusList = ref<{ id: number, payStatus: number }[]>([])
const handleColorSwitch = (row: any) => {
  const item = payStatusList.value.find((item: any) => item.id === row.id)
  if (item?.payStatus === 0) {
    return 'checkbox-blue'
  } else if (item?.payStatus === 1) {
    return 'checkbox-yellow'
  } else {
    return 'checkbox-green'
  }
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getMatchPoList(queryForm)
  total.value = data.total
  list.value = data.list
  list.value.forEach((item: any) => {
    payStatusList.value.push(
      {
        id: item.id,
        payStatus: item.payStatus
      }
    )
    item.payStatus = !!item.payStatus
    item.mergeCustomsDeclarationList = item.mergeCustomsDeclarationList.join('<br />')
    item.mergeCustomsClearanceList = item.mergeCustomsClearanceList.join('<br />')
    processField(item, 'mergeCustomsDeclarationList', 2)
    processField(item, 'mergeCustomsClearanceList', 2)
  })
  listLoading.value = false
}
// 获取货代渠道
const fetchChannelOption = async () => {
  const { data } = await getChannelList()
  forwarderOption.value = data
}
onBeforeMount(() => {
  const { pageNo, pageSize } = route.query
  queryForm.pageNo = Number(pageNo) || 1
  queryForm.pageSize = Number(pageSize) || 10
  fetchData()
  fetchChannelOption()
})
onActivated(() => {
  tableRef.value?.doLayout()
})
</script>

<style lang="scss" scoped>
.el-checkbox {
  transform: scale(1.3);
  transform-origin: center;
}
:deep(.dialog .el-dialog__body) {
  padding-top: 5px;
}
// .el-table :deep(.reduce-padding .cell) {
//   padding-right: 3px;
//   padding-left: 3px;
// }
// :deep(.center-table tr:last-child td),
// :deep(.center-table tr:last-child th) {
//   text-align: center !important;
// }
.checkbox-yellow {
  :deep() {
    .el-checkbox__inner {
      &:hover {
        border-color: var(--el-color-warning);
      }
    }
  }
}
// 选中且不被禁用的样式
:deep(.checkbox-yellow .el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-color-warning);
  border-color: var(--el-color-warning);
}
.checkbox-blue {
  :deep() {
    .el-checkbox__inner {
      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }
}
// 选中且不被禁用的样式
:deep(.checkbox-blue .el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}
.checkbox-green {
  :deep() {
    .el-checkbox__inner {
      &:hover {
        border-color: var(--el-color-success);
      }
    }
  }
}
// 选中且不被禁用的样式
:deep(.checkbox-green .el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-color-success);
  border-color: var(--el-color-success);
}
// /* 取消没有条纹的行的悬停背景色 */
// :deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
//   background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
// }

// /* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
// :deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
//   background-color: #fafafa !important; /* 保持原有条纹颜色 */
// }
// .noneHoveTable :deep(.warning-row) {
//   --el-table-tr-bg-color: var(--el-color-warning-light-9);
// }
.noneHoveTable {
  :deep() {
    // 选中行样式优先级提高
    // .warning-row > td {
    //   background-color: #EDF1F7 !important;
    // }
    .warning-row > td {
      background-color: var(--el-color-warning-light-9) !important;
    }

    // 普通行hover时保持白色
    .el-table__body tr:not(.warning-row) {
      &.hover-row > td,
      &:hover > td {
        background-color: #ffffff !important;
      }
    }
  }
}
.none {
  display: none;
}
.copySku {
  cursor: pointer;
  -webkit-user-select: text;
  user-select: text;
  transition: all 0.3s;
  &:hover {
    color: #000;
  }
}
.custom-tooltip {
  max-width: 400px;
  font-size: 14px;
  white-space: pre-wrap;
}
</style>
