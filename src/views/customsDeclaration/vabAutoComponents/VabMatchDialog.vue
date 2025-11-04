<template>
  <div>
    <vab-dialog
      v-model="dflag"
      class="dialog"
      :class="{ fullscreenDialog: isFullscreen, normalDialog: !isFullscreen }"
      :draggable="false"
      :fullscreen="isFullscreen"
      title="匹配"
      top="5vh"
      :width="isFullscreen ? '100%' : 'fit-content'"
      @close="handleCloseCheck"
    >
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button v-if="!disabled3" :disabled="disabled1 || (!disabled1 && !disabled2)" type="primary" @click="handleStartMatch">
            开始匹配
          </el-button>
          <el-button v-if="!disabled3 && !disabled1 && !disabled2" type="primary" @click="showSentButNotReported">已发未报</el-button>
          <el-button v-if="!disabled3 && !disabled1 && !disabled2" type="primary" @click="handleClearCheckAll">清空全部</el-button>
          <el-switch
            v-model="displayMatch1Customs"
            active-text="隐藏不报关"
            class="display-site-switch"
            inactive-text="展示不报关"
            inline-prompt
            size="large"
            style="--el-switch-on-color: var(--el-color-success); --el-switch-off-color: var(--el-color-danger)"
            width="130"
            @change="queryData"
          />
        </vab-query-form-left-panel>
        <vab-query-form-right-panel>
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input
                v-model.trim="queryForm.keyWord"
                clearable
                placeholder="请输入搜索关键词"
                @input="queryData"
                @keydown.enter="queryData"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table
        border
        :cell-style="match1Style"
        class="noneHoveTable"
        :class="isFullscreen ? 'fullscreenTable' : 'normalTable'"
        :data="list"
        :header-cell-style="headerCellStyle"
        :row-class-name="tableRowClassName"
        :span-method="objectSpanMethod1"
        @row-click="handleRowClick"
      >
        <el-table-column label="SKU">
          <el-table-column label="带磁" prop="magnetic" width="70">
            <template #default="{ row }">
              <vab-icon v-if="row.magnetic === 1" icon="checkbox-circle-fill" style="color: var(--el-color-danger); font-size: 20px" />
              <vab-icon v-else icon="close-circle-fill" style="color: var(--el-color-success); font-size: 20px" />
            </template>
          </el-table-column>
          <el-table-column label="木制品" prop="woodenProduct" width="80">
            <template #default="{ row }">
              <vab-icon v-if="row.woodenProduct === 1" icon="checkbox-circle-fill" style="color: var(--el-color-danger); font-size: 20px" />
              <vab-icon v-else icon="close-circle-fill" style="color: var(--el-color-success); font-size: 20px" />
            </template>
          </el-table-column>
          <el-table-column label="玩具" prop="toy" width="70">
            <template #default="{ row }">
              <vab-icon v-if="row.toy === 1" icon="checkbox-circle-fill" style="color: var(--el-color-danger); font-size: 20px" />
              <vab-icon v-else icon="close-circle-fill" style="color: var(--el-color-success); font-size: 20px" />
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku', 45)">
            <template #default="{ row }">
              <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)">
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="装箱总数" prop="encasementCount" width="95" />
          <el-table-column label="站点" prop="site" width="140" />
          <el-table-column label="匹配的PO" prop="po" width="115">
            <template #default="{ row }">
              <span class="copySku" @click="handleClipboard($event, row.po)">
                {{ row.po }}
                <vab-icon v-if="row.po" icon="file-copy-2-fill" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="SKU实际数量" prop="skuActualCount" width="125" />
        </el-table-column>
        <el-table-column label="零件">
          <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(list, '零件名', 'componentName')" />
          <el-table-column label="实际数量" prop="actualComponentCount" width="95" />
          <el-table-column label="退税报关数量" prop="customsDeclarationCount" width="125" />
          <el-table-column label="PO总数" prop="purchaseCount" width="85" />
          <el-table-column label="采购方" prop="purchase" width="80" />
          <el-table-column label="不报关" prop="customsDeclarationStatus" width="75">
            <template #default="{ row }">
              <el-checkbox v-model="row.customsDeclarationStatus" disabled :false-value="0" :true-value="1" />
            </template>
          </el-table-column>
          <el-table-column label="发货/报关数不平" prop="flag" width="110">
            <template #default="{ row }">
              <!-- <vab-icon v-show="row.flag === true" icon="check-line" style="color: var(--el-color-primary)" /> -->
              <el-checkbox v-model="row.flag" disabled />
            </template>
          </el-table-column>
          <el-table-column label="有HS" width="70">
            <template #default="{ row }">
              <vab-icon v-if="row.componentInformationStatus === 1" icon="check-fill" style="color: var(--el-color-success)" />
              <vab-icon v-if="row.componentInformationStatus === 2" icon="close-fill" style="color: var(--el-color-danger)" />
            </template>
          </el-table-column>
          <el-table-column label="零件操作" width="95">
            <template #default="{ row }">
              <el-link
                :disabled="!row.poComponentId || row.customsDeclarationStatus === 1"
                type="primary"
                underline="never"
                @click="showModifyHS(row)"
              >
                修改HS
              </el-link>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column v-if="!disabled3 && !disabled1 && !disabled2" fixed="right" label="操作" width="150">
          <template #default="{ row }">
            <el-space alignment="center" :size="10">
              <el-link v-if="row.delStatus === 0" type="primary" underline="never" @click="handleShowMatch2(row)">匹配</el-link>
              <el-link v-if="row.delStatus === 0" type="danger" underline="never" @click="handleCheckClear(row)">清空</el-link>
              <el-link v-if="row.delStatus === 1" type="danger" underline="never" @click="handleDelCheckMatch(row)">删除</el-link>
            </el-space>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" />
        </template>
      </el-table>
      <!-- <vab-pagination
        :current-page="queryForm.pageNo"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      /> -->
      <template #footer>
        <div style="text-align: center">
          <el-button v-if="!disabled3 && !disabled1 && !disabled2" :loading="unlockLoading" type="danger" @click="handleUnlockAndClear">
            清空解锁
          </el-button>
          <el-button
            v-if="!disabled3 && !disabled1 && !disabled2"
            :loading="confirmMatchLoading"
            type="success"
            @click="handleConfirmCheckMatch"
          >
            确认匹配结果
          </el-button>
        </div>
      </template>
    </vab-dialog>
    <vab-dialog v-model="match2Visible" :before-close="handleCloseMatch2" :draggable="false" title="匹配" top="7vh" width="fit-content">
      <div style="width: fit-content; margin: 0 auto">
        <vab-query-form>
          <vab-query-form-left-panel :span="18">
            <el-button style="margin-right: 10px" type="primary" @click="handleClearAll">清空全部</el-button>
            <el-button v-if="!disabled3 && !disabled1 && !disabled2" type="primary" @click="showSentButNotReported">已发未报</el-button>
            <el-switch
              v-model="displaySite"
              active-text="只展示匹配站点"
              class="display-site-switch"
              inactive-text="展示全部站点"
              inline-prompt
              size="large"
              style="--el-switch-on-color: var(--el-color-success); --el-switch-off-color: var(--el-color-danger)"
              width="145"
            />
            <el-switch
              v-model="displayCustoms"
              active-text="隐藏不报关"
              class="display-site-switch"
              inactive-text="展示不报关"
              inline-prompt
              size="large"
              style="--el-switch-on-color: var(--el-color-success); --el-switch-off-color: var(--el-color-danger); margin-right: 10px"
              width="130"
            />
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="6">
            <el-form inline>
              <el-form-item>
                <el-input
                  v-model.trim="keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="fetchMatchData"
                  @keydown.enter="fetchMatchData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="match2ListLoading" type="primary" @click="fetchMatchData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
          <div style="margin-bottom: 20px">
            <el-text style="font-size: var(--el-font-size-base); font-weight: 600">
              SKU：
              <span :style="{ color: 'var(--el-color-primary)' }">{{ _sku }}</span>
              品名：
              <span :style="{ color: 'var(--el-color-primary)' }">{{ _desc }}</span>
              剩余未匹配数量：
              <span :style="{ color: 'var(--el-color-danger)' }">{{ _encasementCount }}</span>
            </el-text>
          </div>
        </vab-query-form>
        <el-table
          v-loading="match2ListLoading"
          border
          :cell-style="match2Style"
          class="noneHoveTable"
          :data="filteredMatchList"
          :header-cell-style="headerCellStyle2"
          max-height="70vh"
          :row-class-name="stripedRowClass2"
          :span-method="objectSpanMethod2"
          style="width: fit-content; margin: 0 auto"
        >
          <el-table-column label="SKU">
            <el-table-column label="匹配的PO" prop="po" :width="flexColumnWidth(matchList, '匹配的PO', 'po')" />
            <el-table-column label="打包任务状态" prop="status" :width="flexColumnWidth(matchList, '打包任务状态', 'status')">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="站点" prop="siteName" :width="flexColumnWidth(matchList, '站点', 'siteName')" />
            <!-- <el-table-column label="打包完成数(好)" prop="goodCount" :width="flexColumnWidth(matchList, '打包完成数(好)', 'goodCount')" />
            <el-table-column
              label="打包任务数"
              prop="packageTaskCount"
              :width="flexColumnWidth(matchList, '打包任务数', 'packageTaskCount')"
            /> -->
            <el-table-column label="打包完成数(好)" :width="flexColumnWidth(matchList, '打包完成数(好)', 'packageTaskCount', 50)">
              <template #header>
                <el-tooltip content="" effect="dark" placement="top">
                  <div class="questionIcon">
                    打包完成数(好)
                    <el-icon><question-filled /></el-icon>
                  </div>
                  <template #content>
                    <div class="custom-tooltip">打包完成数(好) / 打包任务数</div>
                  </template>
                </el-tooltip>
              </template>
              <template #default="{ row }">{{ row.goodCount }} / {{ row.packageTaskCount }}</template>
            </el-table-column>
            <el-table-column label="SKU实际数量" prop="skuActualCount" :width="flexColumnWidth(matchList, 'SKU实际数量', 'skuActualCount')">
              <template #default="{ row }">
                <el-input
                  v-model="row.skuActualCount"
                  :max="row.goodCount"
                  :min="0"
                  type="number"
                  @change="handleUpdateSkuCount(row)"
                  @focus="handleFocus(row)"
                  @wheel.stop.prevent
                />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="零件">
            <el-table-column
              label="退税报关数量"
              prop="customsDeclarationCount"
              :width="flexColumnWidth(matchList, '退税报关数量', 'customsDeclarationCount')"
            >
              <template #default="{ row }">
                <el-input
                  v-model="row.customsDeclarationCount"
                  :disabled="row.customsDeclarationStatus === 1"
                  :min="0"
                  type="number"
                  @change="handleUpdateComponentCustomCount(row)"
                  @focus="handleFocus(row)"
                  @wheel.stop.prevent
                />
              </template>
            </el-table-column>
            <el-table-column
              label="实际数量"
              prop="componentActualCount"
              :width="flexColumnWidth(matchList, '实际数量', 'componentActualCount')"
            />
            <!-- <el-table-column label="剩余可报" prop="reportable" :width="flexColumnWidth(matchList, '剩余可报', 'reportable')" />
            <el-table-column label="PO总数" prop="purchaseCount" :width="flexColumnWidth(matchList, 'PO总数', 'purchaseCount')" /> -->
            <el-table-column label="剩余可报" :width="flexColumnWidth(matchList, '剩余可报', 'purchaseCount', 50)">
              <template #header>
                <el-tooltip content="" effect="dark" placement="top">
                  <div class="questionIcon">
                    剩余可报
                    <el-icon><question-filled /></el-icon>
                  </div>
                  <template #content>
                    <div class="custom-tooltip">剩余可报 / PO总数</div>
                  </template>
                </el-tooltip>
              </template>
              <template #default="{ row }">{{ row.reportable }} / {{ row.purchaseCount }}</template>
            </el-table-column>

            <el-table-column label="已发未报" prop="yfwbCount" :width="flexColumnWidth(matchList, '已发未报', 'yfwbCount')" />
            <el-table-column label="已报未发" prop="ybwfCount" :width="flexColumnWidth(matchList, '已报未发', 'ybwfCount')" />
            <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(matchList, '零件名', 'componentName')" />

            <el-table-column label="采购方" prop="purchase" :width="flexColumnWidth(matchList, '采购方', 'purchase')" />
            <el-table-column
              label="不报关"
              prop="customsDeclarationStatus"
              :width="flexColumnWidth(matchList, '不报关', 'customsDeclarationStatus')"
            >
              <template #default="{ row }">
                <el-checkbox v-model="row.customsDeclarationStatus" disabled :false-value="0" :true-value="1" />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="330">
            <template #default="{ row }">
              <el-space alignment="center" :size="10">
                <!-- <el-link type="primary" underline="never" @click="handleInsertAll(row)">填入全部</el-link> -->
                <el-link :loading="row.loadingEdit" underline="never" @click="handleInsertAllBg(row)">填入(报关)</el-link>
                <el-link type="warning" underline="never" @click="handleInsertAllNotBg(row)">填入(不报关)</el-link>
                <el-link type="primary" underline="never" @click="handleShowPackingCount(row)">修正质检</el-link>
                <el-link type="danger" underline="never" @click="handleClear(row)">清空</el-link>
              </el-space>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 20px; text-align: center">
        <el-text style="font-size: var(--el-font-size-base); font-weight: 600">
          剩余SKU：
          <span :style="{ color: 'var(--el-color-danger)' }">{{ lastSku }}个</span>
        </el-text>
      </div>
      <template #footer>
        <div style="text-align: center">
          <el-button v-if="previousVisible" type="warning" @click="fetchPreviousMatchData">
            上一个
            <el-text style="font-size: 12px" type="info">(←)</el-text>
          </el-button>
          <el-button type="success" @click="handleCloseMatch2">关闭</el-button>
          <el-button v-if="nextVisible" type="warning" @click="fetchNextMatchData">
            下一个
            <el-text style="font-size: 12px" type="info">(→)</el-text>
          </el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 已发未报 -->
    <sent-but-not-reported v-model="sentButNotReportedVisible" :shipId="props.shipId" @query-data="queryData" />
    <!-- 点击清点质检 - 打包总数 -->
    <vab-dialog v-model="packingCountVisible" :before-close="closePackingCount" class="packingTotal" title="打包总数" width="22%">
      <el-form
        ref="packingCountFormRef"
        label-position="left"
        label-width="auto"
        :model="packingCountForm"
        style="margin-right: 0px; margin-left: 20px"
      >
        <el-form-item label="任务数量" prop="packageTaskCount">
          <div style="width: 85%">
            <el-input v-model="packingCountForm.packageTaskCount" disabled />
          </div>
        </el-form-item>
        <el-form-item label="好" prop="goodCount">
          <div style="width: 85%; margin-right: 10px">
            <el-input v-model.trim="packingCountForm.goodCount" clearable />
          </div>
          <div style="display: flex; align-items: center; width: 10%">
            <el-icon class="add-icon" :size="23" style="margin: 0 auto; cursor: pointer" @click="handleShowAdd"><circle-plus /></el-icon>
          </div>
        </el-form-item>
        <el-form-item label="留样" prop="keepSampleCount">
          <div style="width: 85%">
            <el-input v-model.trim="packingCountForm.keepSampleCount" clearable />
          </div>
        </el-form-item>
        <el-form-item label="坏" prop="badCount">
          <div style="width: 85%">
            <el-input v-model.trim="packingCountForm.badCount" clearable />
          </div>
        </el-form-item>
        <el-form-item label="缺">
          <div style="width: 85%">
            <el-input v-model="lackCount" disabled />
          </div>
        </el-form-item>
        <el-form-item label="多">
          <div style="width: 85%">
            <el-input v-model="manyCount" disabled />
          </div>
        </el-form-item>
        <el-form-item label="打包总数">
          <div style="width: 85%">
            <el-input v-model="packingTotal" disabled />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="margin-right: 10px">
          <el-button type="danger" @click="closePackingCount">取消</el-button>
          <el-button type="success" @click="confirmQualityCheck">确认</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 增加 -->
    <vab-dialog v-model="addVisible" title="增加" width="17%" @close="handleCloseAdd">
      <el-form ref="addFormRef" label-position="left" label-width="auto" :model="addForm" style="margin-right: 20px; margin-left: 20px">
        <el-form-item label="好" prop="good">
          <el-input v-model.trim="addForm.good" clearable />
        </el-form-item>
        <el-form-item label="留样" prop="sample">
          <el-input v-model.trim="addForm.sample" clearable />
        </el-form-item>
        <el-form-item label="坏" prop="bad">
          <el-input v-model.trim="addForm.bad" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseAdd">取消</el-button>
        <el-button type="primary" @click="handleConfirmAdd">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 修改HS -->
    <vab-dialog v-model="modifyHSVisible" title="修改HS" width="20%">
      <el-form label-position="left" label-width="auto" :model="modifyHsForm" style="margin-left: 0; margin-right: 0">
        <el-form-item label="HS">
          <el-select v-model="modifyHsForm.hsId" clearable filterable placeholder="请选择HS">
            <el-option v-for="item in hsOption" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="法定单位">
          <el-input v-model="modifyHsForm.statutoryUnit" clearable disabled />
        </el-form-item>
        <el-form-item label="每零件单位有多少个法定第1单位">
          <el-input v-model="modifyHsForm.quorum" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modifyHSVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmModify">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { CirclePlus, QuestionFilled, Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import type { CSSProperties } from 'vue'
import {
  clearAllMatchComponent,
  clearAllMatchShipment,
  clearMatchComponent,
  clearMatchShipment,
  clearUnlockMatchShipment,
  delMatchShipment,
  getCheckMatchList,
  getMatchPackageList,
  getPurchaseComponentHsInfo,
  insertAllMatchComponent,
  lockMatchShipment,
  submitMatchShipment,
  submitMatchShipmentCheck,
  updateMatchComponentCustomCount,
  updateMatchQuality,
  updateMatchSkuActualCount,
  updatePurchaseComponentHs,
} from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { getQualityCheck } from '/@/api/devlocal/packagingShipping'
import { getHsSelectList } from '/@/api/devlocal/productInformation'
import type { IGetCheckMatchList, IGetMatchPackageList } from '/@/type/customsDeclarationAndTaxRefund/matchPo'
import type { IGetQualityCheck } from '/@/type/packagingShipping/packagingType'
import handleClipboard from '/@/utils/clipboard'
import { flexColumnWidth } from '/@/utils/tableColum'

const selectedRowIndex = ref<number>(-1)
// 行点击处理函数
const handleRowClick = (row: any, column: any, event: Event) => {
  selectedRowIndex.value = row.id
}
const headerCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column?.label
  // 顶层分组列“SKU/零件”的背景色
  if (['SKU', '装箱总数', '站点', '匹配的PO', 'SKU实际数量', '带磁', '木制品', '玩具'].includes(label)) {
    return {
      textAlign: 'center',
      backgroundColor: 'var(--el-color-primary-light-9)',
      color: 'var(--el-color-primary)',
      fontWeight: 600,
    }
  }
  if (['零件', '零件名', '实际数量', '退税报关数量', 'PO总数', '采购方', '不报关', '发货/报关数不平', '有HS', '零件操作'].includes(label)) {
    return {
      textAlign: 'center',
      backgroundColor: 'var(--el-color-warning-light-9)',
      color: 'var(--el-color-warning)',
      fontWeight: 600,
    }
  }
  return { textAlign: 'center' }
}
const headerCellStyle2 = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column?.label
  // 顶层分组列“SKU/零件”的背景色
  if (['SKU', '匹配的PO', '打包任务状态', '站点', '打包完成数(好)', 'SKU实际数量'].includes(label)) {
    return {
      textAlign: 'center',
      backgroundColor: 'var(--el-color-primary-light-9)',
      color: 'var(--el-color-primary)',
      fontWeight: 600,
    }
  }
  if (['零件', '零件名', '实际数量', '退税报关数量', '剩余可报', '已发未报', '已报未发', '采购方', '不报关'].includes(label)) {
    return {
      textAlign: 'center',
      backgroundColor: 'var(--el-color-warning-light-9)',
      color: 'var(--el-color-warning)',
      fontWeight: 600,
    }
  }
  return { textAlign: 'center' }
}
const getStatusType = (status: string) => {
  switch (status) {
    case '已完成':
      return 'success'
    case '未到货':
      return 'warning'
    case '售后':
      return 'danger'
    default:
      return 'info'
  }
}
const modifyHSVisible = ref<boolean>(false)
const modifyHsForm = reactive<any>({})
const hsOption = ref<{ id: number; label: string }[]>([])
const showModifyHS = async (row: any) => {
  modifyHSVisible.value = true
  // 获取hs下拉列表
  await fetchHsSelectList()
  const { data } = await getPurchaseComponentHsInfo({
    id: row.poComponentId,
  })
  Object.assign(modifyHsForm, data)
}
const handleConfirmModify = async () => {
  try {
    const { data } = await updatePurchaseComponentHs({
      id: modifyHsForm.id,
      hsId: modifyHsForm.hsId,
      quorum: modifyHsForm.quorum,
    })
    if (data) {
      $baseMessage('修改HS成功！', 'success')
      modifyHSVisible.value = false
      fetchData()
    }
  } catch (error) {
    $baseMessage('修改HS失败！', 'error')
  }
}
const fetchHsSelectList = async () => {
  const { data } = await getHsSelectList()
  hsOption.value = data
}
const match2ListLoading = ref<boolean>(false)
// 切换：展示匹配站点/全部站点 - 初始化为false，等数据加载完成后再设置为true
const displaySite = ref<boolean>(false)
// 切换：展示不报关/隐藏不报关
const displayCustoms = ref<boolean>(true)
// 匹配1 的 展示不报关/隐藏不报关
const displayMatch1Customs = ref<boolean>(true)
// 根据开关对 matchList 进行过滤（站点 + 报关）
const filteredMatchList = computed(() => {
  // 确保数据已加载
  if (!matchList.value || matchList.value.length === 0) {
    return []
  }

  let list = [...matchList.value] // 创建副本，保持原始顺序

  // 站点过滤：只展示匹配站点
  if (displaySite.value && _siteName.value.length > 0) {
    list = list.filter((item: any) => _siteName.value.includes(item.siteName))
  }
  // 报关过滤：隐藏不报关(customsDeclarationStatus=1=不报关)
  if (displayCustoms.value) {
    // 先按 mId 分组，判断是否整组都是不报关
    const groupMap = new Map<number, any[]>()
    for (const it of list) {
      const key = it.mId as number
      if (!groupMap.has(key)) groupMap.set(key, [])
      groupMap.get(key)!.push(it)
    }
    const result: any[] = []
    // 保持原始顺序，按 mId 在原始列表中的顺序处理
    const processedMIds = new Set<number>()
    for (const it of list) {
      const mId = it.mId as number
      if (!processedMIds.has(mId)) {
        processedMIds.add(mId)
        const items = groupMap.get(mId) || []
        const allNoCustoms = items.every((x: any) => Number(x.customsDeclarationStatus) === 1)
        if (allNoCustoms) {
          // 整组全部不报关：只保留一个（保留第一个）
          result.push(items[0])
        } else {
          // 否则，过滤掉不报关的，保留报关项
          items.forEach((x: any) => {
            const status = x.customsDeclarationStatus
            // customsDeclarationStatus 为 null/undefined 或不为 1 的都视为报关
            if (status === null || status === undefined || Number(status) !== 1) {
              result.push(x)
            }
          })
        }
      }
    }
    list = result
  }
  return list
})
const isFullscreen = ref<boolean>(false)

// const aggregationTotal = ref<number>(0)
// const aggregationListLoading = ref<boolean>(false)
// // 0聚合 1明细 默认在聚合页
// // const tab = ref<number>(0)
// const aggregationList = ref<IGetYfwbAggregationList[]>([])
// const aggregationReq = reactive<IGetMatchPoListReq>({
//   keyWord: '',
//   pageNo: 1,
//   pageSize: 20,
// })
// const remark = ref<string>('')
// const remarkVisible = ref<boolean>(false)
const dflag = ref<boolean>(false)
const match2Visible = ref<boolean>(false)

const disabled1 = ref<boolean>(false)

const disabled2 = ref<boolean>(true)

const disabled3 = ref<boolean>(false)
let props = defineProps<{
  matchVisible: boolean
  status: number
  shipId: number
  disabled1: boolean
  disabled2: boolean
  disabled3: boolean
}>()
// 只监听对话框打开状态，不监听 disabled props
watch(
  () => props.matchVisible,
  (newVal) => {
    dflag.value = newVal
    if (newVal === true) {
      // 只在对话框打开时设置 disabled 状态
      disabled1.value = props.disabled1
      disabled2.value = props.disabled2
      disabled3.value = props.disabled3
      selectedRowIndex.value = -1
      fetchData()
    }
  }
)
const emit = defineEmits<{
  updateMatchVisible: [value: boolean]
}>()
const queryForm = reactive<any>({
  keyWord: '',
})
// const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const list = ref<IGetCheckMatchList[]>([])
const matchList = ref<IGetMatchPackageList[]>([])
const _sku = ref<string>('')
const _desc = ref<string>('')
const _id = ref<number>(0)
// let copyRow: any

// const onChangeStatus = (value: number) => {
//   tab.value = value
//   if (tab.value === 0) {
//     queryAggregationData()
//   } else {
//     querySentData()
//   }
// }
// const handleConfirmAgg = async () => {
//   if (selectAggRows.value.length === 0) {
//     $baseMessage('您未选中任何行!', 'warning')
//     return
//   }
//   const valid = selectAggRows.value.every((item) => item.pendingCustomsClearance && item.pendingCustomsClearance > 0)
//   // const req = selectAggRows.value.map((item) => {
//   //   return {
//   //     poId: item.poId!,
//   //     poComponentId: item.poComponentId!,
//   //     sku: item.sku!,
//   //   }
//   // })
//   let req: number[] = []
//   selectAggRows.value.forEach((item) => {
//     req.push(item.id)
//   })
//   if (valid) {
//     const { data } = await submitMatchSentList({
//       id: props.shipId,
//       list: req,
//     })
//     if (data) {
//       $baseMessage('确认成功！', 'success')
//       sentButNotReportedVisible.value = false
//       queryData()
//     }
//   } else {
//     $baseMessage('待报关数量不能为空或者不能为0', 'error')
//     return
//   }
// }
// const handleUpdateRemark = async (value: string) => {
//   const { data } = await updateShipmentYfwbRemark({
//     id: copyRow.id,
//     remark: value,
//   })
//   if (data) {
//     $baseMessage('修改备注成功!', 'success')
//     remarkVisible.value = false
//     copyRow.remark = value
//   }
// }

// const changeInput = (row: any, column: any) => {
//   if (column.label === '备注') {
//     copyRow = row
//     remarkVisible.value = true
//     remark.value = row.remark
//   }
// }
// 关闭匹配2
const handleCloseMatch2 = () => {
  match2Visible.value = false
  matchList.value = []
  Object.keys(skuActualCountMap).forEach((key) => delete skuActualCountMap[key])
  Object.keys(customsDeclarationCountMap).forEach((key) => delete customsDeclarationCountMap[key])
  fetchData()
}
// 已发未报-明细多选
// const selectRows = ref<IGetMatchSentList[]>([])
// const setSelectRows = (value: IGetMatchSentList[]) => {
//   selectRows.value = value
// }
// 已发未报-聚合多选
// const selectAggRows = ref<IGetYfwbAggregationList[]>([])
// const setSelectAggRows = (value: IGetYfwbAggregationList[]) => {
//   selectAggRows.value = value
// }
// 打包总数是否可见
const packingCountVisible = ref<boolean>(false)
// 增加是否可见
const addVisible = ref<boolean>(false)
interface IAddForm {
  good: number | null
  sample: number | null
  bad: number | null
}
// 增加form
const addForm = reactive<IAddForm>({
  good: null,
  sample: null,
  bad: null,
})
// 增加form-ref
const addFormRef = ref<FormInstance>()

// 点击增加按钮
const handleShowAdd = () => {
  addVisible.value = true
}

// 关闭增加
const handleCloseAdd = () => {
  addFormRef.value?.resetFields()
  addVisible.value = false
}
// 增加确认
const handleConfirmAdd = () => {
  let good = Number(addForm.good)
  let sample = Number(addForm.sample)
  let bad = Number(addForm.bad)
  let pGood = Number(packingCountForm.goodCount)
  packingCountForm.goodCount = pGood + good
  let pSample = Number(packingCountForm.keepSampleCount)
  packingCountForm.keepSampleCount = pSample + sample
  let pBad = Number(packingCountForm.badCount)
  packingCountForm.badCount = pBad + bad
  handleCloseAdd()
}

// 打包总数form
const packingCountForm = reactive<IGetQualityCheck>({})
// 打包总数formRef
const packingCountFormRef = ref<FormInstance>()
// 传递给打包总数的值
const _mId = ref<number>()
const _taskId = ref<number>()
// 展示打包总数
const handleShowPackingCount = async (row: any) => {
  packingCountVisible.value = true
  _mId.value = row.mId
  _taskId.value = row.taskId
  const { data } = await getQualityCheck({
    id: row.taskId,
  })
  Object.assign(packingCountForm, data)
  if (!data!.id) {
    packingCountForm.packageTaskCount = row.packageTaskCount
  }
  // if (!data?.packageTaskCount) {
  //   packingCountForm.packageTaskCount = 0
  // }
  lackCount.value = data?.lackCount!
  manyCount.value = data?.manyCount
}
// 清点质检的取消
const closePackingCount = () => {
  packingCountVisible.value = false
}
// 清点质检的确认
const confirmQualityCheck = async () => {
  const { data } = await updateMatchQuality({
    taskId: _taskId.value!,
    mId: _mId.value!,
    goodCount: packingCountForm.goodCount!,
    manyCount: manyCount.value!,
    keepSampleCount: packingCountForm.keepSampleCount!,
    lackCount: lackCount.value,
    badCount: packingCountForm.badCount!,
  })
  if (data) {
    $baseMessage('修正质检信息成功', 'success')
    packingCountVisible.value = false
    fetchMatchData()
  }
}
// 缺的数量
const lackCount = computed<number>({
  get() {
    let good = Number(packingCountForm.goodCount)
    let bad = Number(packingCountForm.badCount)
    let taskCount = Number(packingCountForm.packageTaskCount)
    if (good <= taskCount) {
      taskCount - good - bad
    }
    return 0
  },
  set() {},
})
// 多的数量
const manyCount = computed({
  get() {
    let good = Number(packingCountForm.goodCount)
    let taskCount = Number(packingCountForm.packageTaskCount)
    if (good > taskCount) {
      return good - taskCount
    }
  },
  set() {},
})
// 打包总数数量
const packingTotal = computed({
  get() {
    let good = Number(packingCountForm.goodCount)
    let bad = Number(packingCountForm.badCount)
    return good + bad
  },
  set() {},
})
// 开始匹配
const handleStartMatch = async () => {
  const { data } = await lockMatchShipment({
    id: props.shipId,
  })
  if (data) {
    $baseMessage('开始匹配成功', 'success')
    disabled1.value = false
    disabled2.value = false
  }
}
const keyWord = ref('')
// 获取第二个匹配的数据
const fetchMatchData = async () => {
  match2ListLoading.value = true
  try {
    const { data } = await getMatchPackageList({
      sku: _sku.value,
      status: props.status,
      matchId: _id.value,
      keyWord: keyWord.value,
    })
    matchList.value = data
    matchList.value.forEach((item: any) => {
      if (item.skuActualCount !== 0 && item.skuActualCount != null && item.skuActualCount != undefined) {
        skuActualCountMap[item.mId] = Number(item.skuActualCount) || 0
      }
      if (item.customsDeclarationCount !== '0' && item.customsDeclarationCount != null && item.customsDeclarationCount != undefined) {
        customsDeclarationCountMap[item.poComponentId] = Number(item.customsDeclarationCount) || 0
      }
    })
    // 默认只展示匹配站点，需要对 matchList 做处理 筛选出和_siteName一样的数据
    return data // 返回数据，确保 Promise 正确解析
  } catch (error) {
    console.error(error)
    throw error // 重新抛出错误，让调用者可以处理
  } finally {
    match2ListLoading.value = false
  }
}
// 上一个显示
const previousVisible = ref<boolean>(false)
// 下一个显示
const nextVisible = ref<boolean>(false)
// 剩余未匹配数的初始值
const _originalCount = ref<number>(0)
// 剩余SKU数
const lastSku = ref<number>(0)
// 点击上一个
const fetchPreviousMatchData = async () => {
  match2ListLoading.value = true
  try {
    const index = idList.value.indexOf(_id.value)
    _id.value = idList.value[index - 1]
    const item = list.value.find((item: any) => item.id === _id.value)
    _sku.value = item!.sku
    _desc.value = item!.desc
    _originalCount.value = Number(item!.encasementCount)
    const siteNames = list.value
      .filter((item: any) => item.id === _id.value)
      .map((item: any) => item.site)
      .filter(Boolean)
    _siteName.value = [...new Set(siteNames)]
    displaySite.value = true // 确保站点筛选生效
    Object.keys(skuActualCountMap).forEach((key) => delete skuActualCountMap[key])
    Object.keys(customsDeclarationCountMap).forEach((key) => delete customsDeclarationCountMap[key])
    const { data } = await getMatchPackageList({
      sku: _sku.value,
      status: props.status,
      matchId: _id.value,
      keyWord: keyWord.value,
    })
    matchList.value = data
    matchList.value.forEach((item: any) => {
      if (item.skuActualCount !== 0 && item.skuActualCount != null && item.skuActualCount != undefined) {
        skuActualCountMap[item.mId] = Number(item.skuActualCount) || 0
      }
      if (item.customsDeclarationCount !== '0' && item.customsDeclarationCount != null && item.customsDeclarationCount != undefined) {
        customsDeclarationCountMap[item.poComponentId] = Number(item.customsDeclarationCount) || 0
      }
    })
    handleShowPreviousOrNext(_id.value)
  } catch (error) {
    console.error(error)
  } finally {
    match2ListLoading.value = false
  }
}
// 点击下一个
const fetchNextMatchData = async () => {
  match2ListLoading.value = true
  try {
    const index = idList.value.indexOf(_id.value)
    _id.value = idList.value[index + 1]
    const item = list.value.find((item: any) => item.id === _id.value)
    _sku.value = item!.sku
    _desc.value = item!.desc
    _originalCount.value = Number(item!.encasementCount)
    const siteNames = list.value
      .filter((item: any) => item.id === _id.value)
      .map((item: any) => item.site)
      .filter(Boolean)
    _siteName.value = [...new Set(siteNames)]

    displaySite.value = true // 确保站点筛选生效
    Object.keys(skuActualCountMap).forEach((key) => delete skuActualCountMap[key])
    Object.keys(customsDeclarationCountMap).forEach((key) => delete customsDeclarationCountMap[key])
    const { data } = await getMatchPackageList({
      sku: _sku.value,
      status: props.status,
      matchId: _id.value,
      keyWord: keyWord.value,
    })
    matchList.value = data

    matchList.value.forEach((item: any) => {
      if (item.skuActualCount !== 0 && item.skuActualCount != null && item.skuActualCount != undefined) {
        skuActualCountMap[item.mId] = Number(item.skuActualCount) || 0
      }
      if (item.customsDeclarationCount !== '0' && item.customsDeclarationCount != null && item.customsDeclarationCount != undefined) {
        customsDeclarationCountMap[item.poComponentId] = Number(item.customsDeclarationCount) || 0
      }
    })
    handleShowPreviousOrNext(_id.value)
  } catch (error) {
    console.error(error)
  } finally {
    match2ListLoading.value = false
  }
}
const handleShowPreviousOrNext = (id: number) => {
  const length = idList.value.length
  const index = idList.value.indexOf(id)
  lastSku.value = length - index - 1
  // 处理上一个还是下一个显示
  if (length === 1) {
    // 只有一个元素时，不显示上一个和下一个按钮
    previousVisible.value = false
    nextVisible.value = false
  } else if (index === 0) {
    // 第一个元素，只显示下一个
    previousVisible.value = false
    nextVisible.value = true
  } else if (index === length - 1) {
    // 最后一个元素，只显示上一个
    previousVisible.value = true
    nextVisible.value = false
  } else {
    // 中间元素，显示上一个和下一个
    previousVisible.value = true
    nextVisible.value = true
  }
}
const _siteName = ref<string[]>([])
const handleShowMatch2 = (row: any) => {
  match2Visible.value = true
  _sku.value = row.sku
  _desc.value = row.desc
  _id.value = row.id
  _originalCount.value = Number(row.encasementCount)
  // 匹配操作列是合并的 应该找到这个匹配对应数据的站点然后去重
  // 找到这个row的pid 和 id
  const siteNames = list.value
    .filter((item: any) => item.id === row.id)
    .map((item: any) => item.site)
    .filter(Boolean)
  _siteName.value = [...new Set(siteNames)]

  // 先获取数据，再设置显示模式
  handleShowPreviousOrNext(row.id)
  fetchMatchData().then(() => {
    // 数据加载完成后再设置显示模式，确保过滤生效
    displaySite.value = true
  })
}
// 已发未报的展示
const sentButNotReportedVisible = ref<boolean>(false)
// const querySentForm = reactive<any>({
//   keyWord: '',
//   pageNo: 1,
//   pageSize: 20,
// })
// const sentTotal = ref<number>(0)
// const sentListLoading = ref<boolean>(false)
// const sentList = ref<IGetMatchSentList[]>([])
// const querySentData = () => {
//   querySentForm.pageNo = 1
//   fetchSentData()
// }
// const handleCurrentSentChange = (value: number) => {
//   querySentForm.pageNo = value
//   fetchSentData()
// }
// const handleSizeSentChange = (value: number) => {
//   querySentForm.pageNo = 1
//   querySentForm.pageSize = value
//   fetchSentData()
// }
// 展示已发未报
const showSentButNotReported = () => {
  sentButNotReportedVisible.value = true
  // tab.value = 0
  // fetchAggregationData()
}
// 已发未报-明细归档
// const handleArchive = async () => {
//   if (selectRows.value.length === 0) {
//     $baseMessage('您未选择任何行!', 'warning')
//     return
//   }
//   if (selectRows.value.length > 1) {
//     $baseMessage('只能选择一项进行归档!', 'warning')
//     return
//   }
//   $baseConfirm('确定要归档吗?', null, async () => {
//     const { data } = await archiveMatchSentList({
//       id: selectRows.value[0].id!,
//     })
//     if (data) {
//       $baseMessage('归档成功', 'success')
//       querySentData()
//     }
//   })
// }
// 已发未报-聚合归档
// const handleArchiveAgg = async () => {
//   if (selectAggRows.value.length === 0) {
//     $baseMessage('您未选择任何行!', 'warning')
//     return
//   }
//   $baseConfirm('确定要归档吗？', null, async () => {
//     const req = selectAggRows.value.map((item) => {
//       return {
//         poId: item.poId!,
//         poComponentId: item.poComponentId!,
//         sku: item.sku!,
//         id: item.id
//       }
//     })
//     const { data } = await archiveShipmentYfwbAggregation(req)
//     if (data) {
//       $baseMessage('聚合归档成功！', 'success')
//       queryAggregationData()
//     }
//   })
// }
// 已发未报明细 获取数据
// const fetchSentData = async () => {
//   sentListLoading.value = true
//   const { data } = await getMatchSentList(querySentForm)
//   sentTotal.value = data.total
//   sentList.value = data.list
//   sentListLoading.value = false
// }
// // 已发未报 聚合获取数据
// const fetchAggregationData = async () => {
//   aggregationListLoading.value = true
//   const { data } = await getShipmentYfwbAggregationList(aggregationReq)
//   aggregationTotal.value = data.total
//   aggregationList.value = data.list
//   aggregationListLoading.value = false
// }
// const queryAggregationData = () => {
//   aggregationReq.pageNo = 1
//   fetchAggregationData()
// }
// const handleCurrentAggChange = (value: number) => {
//   aggregationReq.pageNo = value
//   fetchAggregationData()
// }
// const handleSizeAggChange = (value: number) => {
//   aggregationReq.pageNo = 1
//   aggregationReq.pageSize = value
//   fetchAggregationData()
// }
// 关闭匹配
const handleCloseCheck = () => {
  displayMatch1Customs.value = true
  emit('updateMatchVisible', false)
}

// 用于存储改变过的项
const skuActualCountMap = reactive<Record<string, number>>({})
const customsDeclarationCountMap = reactive<Record<string, number>>({})
let originalSkuActualCount = 0
const handleFocus = (row: IGetMatchPackageList) => {
  originalSkuActualCount = Number(row.skuActualCount)
  // 如果该 mId 不存在于 changedItems 中，初始化记录
  if (!(row.mId in skuActualCountMap)) {
    skuActualCountMap[row.mId] = Number(row.skuActualCount) || 0
  }
  if (!(row.mId in customsDeclarationCountMap)) {
    customsDeclarationCountMap[row.poComponentId] = Number(row.customsDeclarationCount) || 0
  }
}
const handleUpdateSkuCount = async (row: IGetMatchPackageList) => {
  if (originalSkuActualCount !== 0 && Number(row.skuActualCount) === 0) {
    $baseMessage('已填入的sku数量如果要设置为0，请使用清空按钮，而不是直接填0！', 'error')
    row.skuActualCount = originalSkuActualCount
    return
  }
  if (row.goodCount == null || row.goodCount == undefined) {
    $baseMessage('当前打包显示的打包任务没有好的数量，不能输入数量！', 'error')
    if (row.mId in skuActualCountMap) {
      const previousValues = skuActualCountMap[row.mId]
      row.skuActualCount = previousValues
    }
    return
  }

  try {
    match2ListLoading.value = true
    const { data } = await updateMatchSkuActualCount({
      id: _id.value,
      poId: row.poId,
      sku: row.sku,
      mId: row.mId,
      skuCount: row.skuActualCount,
    })

    if (data) {
      await fetchMatchData()
      skuActualCountMap[row.mId] = Number(row.skuActualCount)
    }
  } catch {
    // 恢复修改前的值
    if (row.mId in skuActualCountMap) {
      const previousValues = skuActualCountMap[row.mId]
      row.skuActualCount = previousValues
    }
  }
  match2ListLoading.value = false
}

const _encasementCount = computed(() => {
  // 初始值减去所有修改过的 skuActualCount
  const changedTotal = Object.values(skuActualCountMap).reduce((sum, count) => sum + count, 0)
  return _originalCount.value - changedTotal
})

// 修改零件的退税报关数量
const handleUpdateComponentCustomCount = async (row: IGetMatchPackageList) => {
  try {
    const { data } = await updateMatchComponentCustomCount({
      id: _id.value,
      mId: row.mId,
      dId: row.dId,
      count: row.customsDeclarationCount,
    })
    if (data) {
      await fetchMatchData()
      customsDeclarationCountMap[row.poComponentId] = Number(row.customsDeclarationCount)
    }
  } catch {
    // 恢复修改前的值
    if (row.poComponentId in customsDeclarationCountMap) {
      const previousValues = customsDeclarationCountMap[row.poComponentId]
      row.customsDeclarationCount = previousValues
    }
  }
}
// 填入(报关)
const handleInsertAllBg = async (row: IGetMatchPackageList) => {
  // if (row.goodCount !== null && row.goodCount > _encasementCount.value) {
  //   $baseMessage("打包完成数(好)的数量不能大于剩余未匹配数量，无法填入全部！", 'error')
  //   return
  // }
  try {
    if (!row.goodCount) {
      $baseMessage('打包任务数没有好的数量，不能进行匹配！', 'error')
      return
    }
    match2ListLoading.value = true
    const { data } = await insertAllMatchComponent({
      id: _id.value,
      poId: row.poId,
      sku: row.sku,
      mId: row.mId,
      type: 0,
    })
    if (data) {
      $baseMessage('填入(报关)成功', 'success')
      await fetchMatchData()
    }
    match2ListLoading.value = false
  } catch (error) {
    match2ListLoading.value = false
    console.error(error)
  }
}

// 填入(不报关)
const handleInsertAllNotBg = async (row: IGetMatchPackageList) => {
  try {
    match2ListLoading.value = true
    const { data } = await insertAllMatchComponent({
      id: _id.value,
      poId: row.poId,
      sku: row.sku,
      mId: row.mId,
      type: 1,
    })
    if (data) {
      $baseMessage('填入(不报关)成功', 'success')
      await fetchMatchData()
    }
    match2ListLoading.value = false
  } catch (error) {
    match2ListLoading.value = false
    console.error(error)
  }
}

// 查看匹配的清空
const handleCheckClear = async (row: IGetCheckMatchList) => {
  $baseConfirm('确定要清空吗?', null, async () => {
    try {
      const { data } = await clearMatchShipment({
        id: row.id,
      })
      if (data) {
        $baseMessage('清空成功', 'success')
        await fetchData()
      }
    } catch (error) {
      console.error(error)
    }
  })
}
// 清空
const handleClear = async (row: IGetMatchPackageList) => {
  try {
    match2ListLoading.value = true
    // let list: number[] = []
    // matchList.value.forEach((item: any) => {
    //   if (item.mId === row.mId && item.customsDeclarationStatus === 0) {
    //     list.push(item.poComponentId)
    //   }
    // })
    // if (Number(row.skuActualCount) === 0 && list.length === 0) {

    //   return
    // }
    const { data } = await clearMatchComponent({
      mId: row.mId,
      id: _id.value,
      // poComponentId: list.join(','),
    })
    if (data) {
      $baseMessage('清空成功', 'success')
      await fetchMatchData()
      skuActualCountMap[row.mId] = 0
    }
    match2ListLoading.value = false
  } catch (error) {
    match2ListLoading.value = false
    console.error(error)
  }
}
// 查看匹配的清空全部
const handleClearCheckAll = async () => {
  const setIds = new Set()
  list.value.forEach((item: IGetCheckMatchList) => {
    setIds.add(item.id)
  })
  const ids = Array.from(setIds).join(',')
  $baseConfirm('确定要清空全部吗?', null, async () => {
    try {
      const { data } = await clearAllMatchShipment({
        ids,
      })
      if (data) {
        $baseMessage('清空全部成功', 'success')
        await fetchData()
      }
    } catch (error) {
      console.error(error)
    }
  })
}
// 清空全部
const handleClearAll = async () => {
  const setMids = new Set()
  let list: { mid: number; poComponentId: number }[] = []
  matchList.value.forEach((row: IGetMatchPackageList) => {
    // const exists = list.some(item =>
    //   item.mid === row.mId && item.poComponentId === row.poComponentId
    // );
    if (row.skuActualCount && row.customsDeclarationStatus === 0) {
      list.push({ mid: row.mId, poComponentId: row.poComponentId })
    }
    if (row.skuActualCount) {
      setMids.add(row.mId)
    }
  })
  const mIds = Array.from(setMids).join(',')
  $baseConfirm('确定要清空全部吗?', null, async () => {
    try {
      const { data } = await clearAllMatchComponent({
        list,
        id: _id.value,
        mIds,
      })
      if (data) {
        $baseMessage('清空全部成功', 'success')
        await fetchMatchData()
        Object.keys(skuActualCountMap).forEach((key) => (skuActualCountMap[key] = 0))
      }
    } catch (error) {
      console.error(error)
    }
  })
}
// 查看匹配的删除
const handleDelCheckMatch = async (row: IGetCheckMatchList) => {
  try {
    const { data } = await delMatchShipment({
      id: row.id,
    })
    if (data) {
      $baseMessage('删除成功', 'success')
      await fetchData()
    }
  } catch (error) {
    console.error(error)
  }
}
// 清空解锁loading
const unlockLoading = ref<boolean>(false)
// 清空解锁并取消
const handleUnlockAndClear = async () => {
  unlockLoading.value = true
  const setIds = new Set()
  list.value.forEach((item: IGetCheckMatchList) => {
    setIds.add(item.id)
  })
  const ids = Array.from(setIds).join(',')
  try {
    const { data } = await clearUnlockMatchShipment({
      ids,
      id: props.shipId,
    })
    if (data) {
      $baseMessage('清空解锁并取消成功', 'success')
      emit('updateMatchVisible', false)
    }
  } catch (error) {
    console.error(error)
  } finally {
    unlockLoading.value = false
  }
}
// 确实匹配loading
const confirmMatchLoading = ref<boolean>(false)
// 确认提交
const handleConfirmCheckMatch = async () => {
  confirmMatchLoading.value = true
  try {
    const params = { id: props.shipId }
    const { data } = await submitMatchShipmentCheck(params)
    if (data === true) {
      const { data } = await submitMatchShipment(params)
      if (data) {
        $baseMessage('确认提交成功!', 'success')
        emit('updateMatchVisible', false)
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    confirmMatchLoading.value = false
  }
}
interface PIdInfo {
  pIds: number[] // 存储不同的pId
  encasementCount: number // 装箱总数
  skuActualCount: number[] // SKU实际数量
}

// 创建一个Map来存储id与对应的信息
const idMap = ref(new Map<number, PIdInfo>())

const idList = ref<any[]>([])
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getCheckMatchList({ ...queryForm, shipId: props.shipId, customsStatus: displayMatch1Customs.value ? 0 : 1 })
  list.value = data
  let idSet = new Set()
  idMap.value.clear() // 每次必须先清空
  list.value.forEach((item: any) => {
    if (item.delStatus === 0) {
      idSet.add(item.id)
    }
    if (idMap.value.has(item.id)) {
      // 如果id已存在，更新pIds数组
      const info = idMap.value.get(item.id)
      if (info && !info.pIds.includes(item.pId)) {
        info.pIds.push(item.pId)
        info.skuActualCount.push(item.skuActualCount)
      }
    } else {
      // 如果是新的id，创建新的记录
      idMap.value.set(item.id, {
        pIds: [item.pId],
        encasementCount: item.encasementCount,
        skuActualCount: [item.skuActualCount],
      })
    }
  })

  idList.value = Array.from(idSet).sort((a: any, b: any) => a - b)
  list.value.sort((a, b) => {
    return a.id - b.id
  })
  listLoading.value = false
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
// const handleCurrentChange = (value: number) => {
//   queryForm.pageNo = value
//   fetchData()
// }
// const handleSizeChange = (value: number) => {
//   queryForm.pageNo = 1
//   queryForm.pageSize = value
//   fetchData()
// }

const objectSpanMethod1 = ({ row, column, rowIndex, columnIndex }: any) => {
  let rowspan = 1 // 默认不跨行
  const label = column.label
  if (label === 'SKU' || label === '装箱总数' || label === '操作' || label === '带磁' || label === '木制品' || label === '玩具') {
    const id = row.id

    for (let i = rowIndex + 1; i < list.value.length; i++) {
      if (list.value[i].id === id) {
        rowspan++
      } else {
        break
      }
    }
    // rowspan = list.value.filter(item => item.id === id).length

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || list.value[rowIndex - 1].id !== id ? { rowspan, colspan: 1 } : { rowspan: 0, colspan: 0 }
  }

  if (label === '站点' || label === '匹配的PO' || label === 'SKU实际数量') {
    const pId = row.pId
    const id = row.id

    for (let i = rowIndex + 1; i < list.value.length; i++) {
      if (list.value[i].pId === pId && list.value[i].id === id) {
        rowspan++
      } else {
        break
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || list.value[rowIndex - 1].pId !== pId || list.value[rowIndex - 1].id !== row.id
      ? { rowspan, colspan: 1 }
      : { rowspan: 0, colspan: 0 }
  }

  // 对于其他列，默认返回不合并
  return { rowspan: 1, colspan: 1 }
}

//匹配2合并
const objectSpanMethod2 = ({ row, column, rowIndex, columnIndex }: any) => {
  // 设置需要合并的列
  const label = column.label
  if (['匹配的PO', '站点', '打包完成数(好)', '打包任务状态', 'SKU实际数量', '操作'].includes(label)) {
    // 获取当前row的零件id
    const id = row.mId
    // 默认不跨行
    let rowspan = 1
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < filteredMatchList.value.length; i++) {
      // 如果零件id一样需要合并
      if (filteredMatchList.value[i].mId === id) {
        rowspan++
      } else {
        break
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || filteredMatchList.value[rowIndex - 1].mId !== id) {
      return { rowspan, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}

let previous: any = null
let currentGroupIndex = 0 // 当前组索引

const stripedRowClass = (_row: any) => {
  const { row } = _row
  const currentId = row.id
  // 检查当前行是否与上一行不同
  if (currentId !== previous) {
    previous = currentId
    currentGroupIndex++
  }
  // 根据当前组索引设置条纹样式
  return currentGroupIndex % 2 === 0 ? 'el-table__row--striped' : ''
}
let previous2: any = null
let currentGroupIndex2 = 0 // 当前组索引

const stripedRowClass2 = (_row: any) => {
  const { row } = _row
  const currentId = row.mId
  // 检查当前行是否与上一行不同
  if (currentId !== previous2) {
    previous2 = currentId
    currentGroupIndex2++
  }
  // 根据当前组索引设置条纹样式
  return currentGroupIndex2 % 2 === 0 ? 'el-table__row--striped' : ''
}

const match1Style = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  switch (label) {
    case '装箱总数':
    case '站点':
    case '匹配的PO':
    case 'SKU实际数量': {
      if (idMap.value.has(data.row.id)) {
        const info = idMap.value.get(data.row.id)
        if (info) {
          const totalSkuActualCount = info.skuActualCount.reduce((sum: number, count: number) => sum + (Number(count) || 0), 0)
          if (totalSkuActualCount === info.encasementCount) {
            return {
              color: '',
              textAlign: 'center',
            }
          } else {
            return {
              color: 'var(--el-color-danger)',
              textAlign: 'center',
            }
          }
        }
      } else {
        return {
          textAlign: 'center',
        }
      }

      break
    }
    case 'SKU': {
      if (idMap.value.has(data.row.id)) {
        const info = idMap.value.get(data.row.id)
        if (info) {
          const totalSkuActualCount = info.skuActualCount.reduce((sum: number, count: number) => sum + (Number(count) || 0), 0)
          if (totalSkuActualCount === info.encasementCount) {
            return {
              color: '',
              textAlign: 'left',
            }
          } else {
            return {
              color: 'var(--el-color-danger)',
              textAlign: 'left',
            }
          }
        }
      } else {
        return {
          textAlign: 'left',
        }
      }

      break
    }
    case '零件名': {
      return {
        textAlign: 'left',
      }
    }
    case '采购方':
    case 'PO总数': {
      const purchase = data.row.purchase
      if (purchase === '云舟') {
        return {
          textAlign: 'center',
          color: 'var(--el-color-primary)',
        }
      } else if (purchase === 'Attom') {
        return {
          textAlign: 'center',
          color: 'var(--el-color-warning)',
        }
      } else {
        return {
          textAlign: 'center',
          color: '#6C3483',
        }
      }
    }
    // No default
  }
  return {
    textAlign: 'center',
    color: '',
  }
}
const match2Style = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (data.column.label !== '零件名') {
    return {
      textAlign: 'center',
    }
  }
  return {
    textAlign: 'left',
  }
}
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  // if (!row.shipmentId) {
  //   return 'danger-row'
  // }
  if (row.id === selectedRowIndex.value) {
    return 'select-row'
  }
  return ''
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  // 只在匹配对话框打开时响应键盘事件
  if (!match2Visible.value) return

  // 防止在输入框中触发
  const target = event.target as HTMLElement
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
    return
  }

  switch (event.key) {
    case 'ArrowLeft':
      // 左方向键 - 上一个
      if (previousVisible.value) {
        event.preventDefault()
        fetchPreviousMatchData()
      }
      break
    case 'ArrowRight':
      // 右方向键 - 下一个
      if (nextVisible.value) {
        event.preventDefault()
        fetchNextMatchData()
      }
      break
  }
}

// 生命周期钩子
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="scss" scoped>
.display-site-switch {
  margin: -10px 8px 0 5px;
  vertical-align: middle;

  /* inline-prompt 模式下文字在 inner 内部，这里单独处理 */
  :deep(.el-switch__inner .is-text) {
    font-size: 15px;
    font-weight: 700;
  }
}
.group-header {
  padding: 4px 8px;
  color: #fff;
  border-radius: 6px;
  display: inline-block;
}
.group-header-sku {
  background-color: #409eff; /* 蓝色 */
}
.group-header-component {
  background-color: #67c23a; /* 绿色 */
}
.noneHoveTable {
  :deep() {
    .danger-row > td {
      background-color: var(--el-color-danger-light-9) !important;
    }

    td {
      background-color: #ffffff !important;
    }
    .select-row > td {
      background-color: #7bddde !important;
    }
  }
}
:deep(.striped) {
  background-color: #fafafa;
}
.add-icon:hover {
  color: var(--el-color-primary);
}
.dialog {
  .el-dialog {
    height: 80vh;
    max-height: 80vh;
  }
  .vab-query-form {
    .top-panel {
      .el-form {
        .el-form-item:first-child {
          // margin: 0 !important;

          .el-check-tag,
          .el-form-item__label {
            margin: 0 10px 5px 0;
            border-radius: 99px;
          }
        }
      }
    }
  }

  .fixed-header {
    position: sticky;
    top: 0;
    z-index: 2;
    padding-bottom: 10px;
    background: #fff;
  }

  .table-container {
    height: calc(100vh - 220px);
    margin-top: 10px;
    overflow-y: auto;

    :deep(.el-table__header-wrapper) {
      position: sticky;
      top: 0;
      z-index: 1;
    }
  }

  // :deep(.el-dialog) {
  //   &.is-fullscreen {
  //     width: 100% !important;
  //     .el-dialog__body {
  //       width: 100%;
  //     }
  //   }
  // }
}
// 选中且不被禁用的样式
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中且被禁用的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
  background: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中后中间的 “✔” 的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
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
.fullscreenDialog .el-dialog {
  display: flex;
  flex-direction: column;
}
.normalDialog .el-dialog {
  height: 90vh;
  max-height: 90vh;
}
.fullscreenTable {
  height: calc(100vh - 190px);
  max-height: calc(100vh - 190px);
}
.normalTable {
  height: calc(90vh - 190px);
  max-height: calc(90vh - 190px);
}
.questionIcon {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    margin-left: 3px;
  }
}
</style>
