<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" :lazy="true" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="待签收" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel :span="11">
            <el-button v-permissions="{ permission: [SignPermission.SIGN_BATCH] }" type="primary" @click="handleAllSigned">
              批量签收
            </el-button>
            <el-button v-permissions="{ permission: [SignPermission.SIGN_BATCH_LOG] }" type="primary" @click="handleBatchSignLog">
              批量跟单日志
            </el-button>
            <el-button :loading="exportLoading" type="primary" @click="handlePendingSignExport">导出</el-button>
            <el-select
              v-model="printer"
              v-permissions="{ permission: [SignPermission.SIGN_BATCH] }"
              clearable
              placeholder="请选择打印机"
              style="margin: 0 10px calc(var(--el-margin) / 2) 0"
              @change="handleChangePrinter"
            >
              <el-option v-for="item in printerOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select
              v-model="queryForm.site"
              clearable
              placeholder="全部站点"
              style="margin: 0 10px calc(var(--el-margin) / 2) 0"
              @change="queryData"
            >
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id">
                <el-text :style="{ color: getSiteBaseColor(item.label), marginRight: '6px' }">{{ item.label }}</el-text>
              </el-option>
            </el-select>
            <el-space :size="16" style="align-items: center">
              <el-statistic class="compact-statistic" title="SKU套数" :value="totalSkuNumber" />
              <el-divider direction="vertical" style="height: 34px" />
              <el-statistic class="compact-statistic" title="零件数量" :value="totalComponentNumber" />
            </el-space>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="13">
            <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
              <template #reference>
                <el-button>
                  <vab-icon icon="settings-line" />
                </el-button>
              </template>
              <vab-draggable
                v-model="columns"
                :animation="600"
                filter=".non-draggable"
                handle=".handle"
                :on-end="handleEnd"
                :on-move="handleMove"
              >
                <div
                  v-for="item in columns"
                  :key="item.label"
                  :class="{ 'non-draggable': item.disableCheck }"
                  style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
                >
                  <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
                  <span style="flex: 1">{{ item.label }}</span>
                  <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                    <vab-icon icon="eye-line" />
                  </span>
                  <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer" @click="handleChecked(item)">
                    <vab-icon v-show="!item.checked" icon="eye-off-line" />
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                </div>
              </vab-draggable>
            </el-popover>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-select v-model="queryForm.filterProblemComponent" placeholder="筛选问题零件" @change="queryData">
                  <el-option v-for="item in problemComponentOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-select v-model="queryForm.filterFollowLog" placeholder="筛选跟单日志" style="margin-left: 8px" @change="queryData">
                  <el-option v-for="item in followLogOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <div class="filter-group">
                  <el-checkbox-group v-model="queryForm.filters" @change="queryData">
                    <el-checkbox value="needFollowUp">需跟进产品</el-checkbox>
                  </el-checkbox-group>
                </div>
                <el-select v-model="queryForm.procurementManager" placeholder="筛选采购负责人" style="margin-left: 8px" @change="queryData">
                  <el-option v-for="item in procurementManagerList" :key="item.userId" :label="item.userName" :value="item.userId" />
                </el-select>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  class="search-input"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="debouncedQueryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          ref="tableRef"
          v-loading="listLoading"
          border
          :cell-class-name="getCellClass"
          :cell-style="cellStyle"
          class="noneHoveTable custom-table-hover"
          :data="list"
          :default-sort="{ prop: 'sellableDay', order: 'descending' }"
          :header-cell-style="{ 'text-align': 'center' }"
          :row-class-name="tableRowClassName"
          :span-method="objectSpanMethod"
          @cell-click="changeInput"
          @row-click="handleRowClick"
          @selection-change="setSelectRows"
          @sort-change="handleSortChange"
        >
          <el-table-column fixed="left" type="selection" />
          <el-table-column v-permissions="SignPermission.signOperationColume()" fixed="left" label="仓库操作" width="150">
            <template #default="{ row }">
              <el-space>
                <el-link
                  v-permissions="{ permission: [SignPermission.SIGN_COMPONENT] }"
                  type="primary"
                  underline="never"
                  @click="showSignDialog(row)"
                >
                  签收
                </el-link>
                <el-link
                  v-permissions="{ permission: [SignPermission.SIGN_RECORD_LIST] }"
                  type="primary"
                  underline="never"
                  @click="handleGetSignRecord(row)"
                >
                  明细
                </el-link>
                <el-link
                  v-permissions="{ permission: [SignPermission.SIGN_PRINT] }"
                  type="primary"
                  underline="never"
                  @click="showPrint(row)"
                >
                  打印
                </el-link>
              </el-space>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in checkList"
            :key="index"
            :fixed="item.isFixed"
            :label="item.label"
            :min-width="handleWidth(item)"
            :prop="item.prop"
            :sortable="item.sortable ? 'custom' : false"
            :width="item.width"
          >
            <template #header>
              <span v-if="item.label === '零件图片'">
                零件
                <br />
                图片
              </span>
              <span v-if="item.label === 'SKU图片'">
                SKU
                <br />
                图片
              </span>
            </template>
            <template #default="{ row }">
              <div v-if="item.label === '外发'">
                <el-checkbox v-model="row.outsourced" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
              </div>
              <div v-if="item.label === 'PO'">
                <span class="copySku">
                  <el-link type="primary" :underline="true" @click="openPoDetail(row.poSkuId)">{{ row.po }}</el-link>
                  <vab-icon icon="file-copy-2-fill" @click="handleClipboard($event, row.po)" />
                </span>
              </div>
              <div v-if="item.label === '零件图片'">
                <el-image fit="fill" :src="row.componentUrl" style="width: 100%; height: 100%" @click="showPreviewImage(row.componentUrl)">
                  <template #error>
                    <el-icon />
                  </template>
                </el-image>
              </div>

              <div v-if="item.label === 'PO日期'">
                {{ row.poDate ? row.poDate.split(' ')[0] : '' }}
              </div>
              <div v-if="item.label === '付款日期'">
                {{ row.payDate ? row.payDate.split(' ')[0] : '' }}
              </div>
              <div v-if="item.label === 'SKU图片'">
                <el-image fit="fill" :src="row.skuImageUrl" style="width: 100%; height: 100%" @click="showPreviewImage(row.skuImageUrl)">
                  <template #error>
                    <el-icon />
                  </template>
                </el-image>
              </div>
              <div v-if="item.label === 'SKU套数'">
                <div>
                  <span class="copySku" @click="handleClipboard($event, row.sku)">
                    {{ row.sku }}
                    <vab-icon icon="file-copy-2-fill" />
                  </span>
                  <br />
                  {{ row.productName }}
                </div>
                <div style="margin-top: 4px">
                  <el-tag size="default" :style="getSiteTagStyle(row.siteName)">
                    {{ row.siteName }}
                  </el-tag>
                  <span style="margin-left: 4px">{{ row.purchaseSkuNumber }}套</span>
                </div>
              </div>
              <div v-if="item.label === '站点'">
                <el-tag size="default" :style="getSiteTagStyle(row.siteName)">
                  {{ row.siteName }}
                </el-tag>
              </div>
              <div v-if="item.label === '生产完成日期'">
                <el-date-picker
                  v-model="row.produceCompletionDate"
                  placeholder="请选择日期"
                  size="large"
                  style="width: 100%"
                  type="date"
                  value-format="YYYY-MM-DD"
                  @change="changeProductDate(row)"
                />
              </div>
              <div v-if="item.label === '跟单日志'">
                <el-tooltip content=" " effect="dark" placement="top">
                  <template #content>
                    <div class="custom-tooltip">{{ removeHtmlTags(row.log) }}</div>
                  </template>
                  <div class="multi-line-ellipsis-1">{{ removeHtmlTags(row.log) }}</div>
                </el-tooltip>
              </div>
              <div v-if="item.label === '问题原因'">
                <el-select v-model="row.reason" clearable placeholder="请选择问题原因" @change="changeProblemReason(row)">
                  <el-option v-for="item in problemReasonOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </div>
              <div v-if="item.label === '需跟进产品'">
                <el-checkbox v-model="row.needFollowUp" disabled :false-value="0" :true-value="1" />
              </div>
            </template>
          </el-table-column>

          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="已签收" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel :span="11">
            <el-button v-permissions="{ permission: [SignPermission.SIGN_EXPORT] }" type="primary" @click="handleShowReceiptExport">
              入库单导出
            </el-button>
            <el-button v-permissions="{ permission: [SignPermission.SIGN_BATCH_LOG] }" type="primary" @click="handleBatchSignLog">
              批量跟单日志
            </el-button>
            <el-select
              v-model="printer"
              clearable
              placeholder="请选择打印机"
              style="margin: 0 10px calc(var(--el-margin) / 2) 0"
              @change="handleChangePrinter"
            >
              <el-option v-for="item in printerOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select
              v-model="queryForm.signUserId"
              clearable
              label="签收人员"
              placeholder="请选择签收人员"
              style="margin: 0 10px calc(var(--el-margin) / 2) 0"
              @change="queryData"
            >
              <el-option v-for="item in signUserOption" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
            <el-select
              v-model="queryForm.signDate"
              clearable
              label="签收日期"
              placeholder="请选择签收日期"
              style="margin: 0 10px calc(var(--el-margin) / 2) 0"
              @change="queryData"
            >
              <el-option v-for="item in signDateOption" :key="item" :label="item" :value="item" />
            </el-select>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="13">
            <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
              <template #reference>
                <el-button>
                  <vab-icon icon="settings-line" />
                </el-button>
              </template>
              <vab-draggable
                v-model="columns2"
                :animation="600"
                filter=".non-draggable"
                handle=".handle"
                :on-end="handleEnd2"
                :on-move="handleMove2"
              >
                <div
                  v-for="item in columns2"
                  :key="item.label"
                  :class="{ 'non-draggable': item.disableCheck }"
                  style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
                >
                  <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
                  <span style="flex: 1">{{ item.label }}</span>
                  <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                    <vab-icon icon="eye-line" />
                  </span>
                  <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer" @click="handleChecked(item)">
                    <vab-icon v-show="!item.checked" icon="eye-off-line" />
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                </div>
              </vab-draggable>
            </el-popover>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-select v-model="queryForm.filterProblemComponent" placeholder="筛选问题零件" @change="queryData">
                  <el-option v-for="item in problemComponentOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-select v-model="queryForm.filterFollowLog" placeholder="筛选跟单日志" style="margin-left: 8px" @change="queryData">
                  <el-option v-for="item in followLogOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <div class="filter-group">
                  <el-checkbox-group v-model="queryForm.filters" @change="queryData">
                    <el-checkbox value="needFollowUp">需跟进产品</el-checkbox>
                  </el-checkbox-group>
                </div>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  class="search-input"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="debouncedQueryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          ref="tableRef"
          v-loading="listLoading"
          border
          :cell-class-name="getCellClass2"
          :cell-style="cellStyle2"
          class="noneHoveTable custom-table-hover"
          :data="list"
          :default-sort="{ prop: 'signDate', order: 'descending' }"
          :header-cell-style="{ 'text-align': 'center' }"
          :row-class-name="tableRowClassName"
          :span-method="objectSpanMethod"
          stripe
          @cell-click="changeInput"
          @row-click="handleRowClick"
          @selection-change="setSelectRows"
          @sort-change="handleSortChange"
        >
          <el-table-column fixed="left" type="selection" />
          <el-table-column v-permissions="SignPermission.signArchiveOperationColume()" fixed="left" label="操作" width="150">
            <template #default="{ row }">
              <el-dropdown>
                <el-button text type="primary" @click="showPrint(row)">
                  打印面单
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="hasPermission({ permission: [SignPermission.SIGN_PRINT] })" @click="showPrint(row)">
                      <el-link type="primary" underline="never">打印面单</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="hasPermission({ permission: [SignPermission.SIGN_RECORD_LIST] })"
                      @click="handleGetSignedRecord(row)"
                    >
                      <el-link type="primary" underline="never">修改</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="hasPermission({ permission: [SignPermission.SIGN_DELETE] })" @click="handleIfShowRecord(row)">
                      <el-link type="danger" underline="never">取消签收</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in checkList2"
            :key="index"
            :fixed="item.isFixed"
            :label="item.label"
            :min-width="handleWidth(item)"
            :prop="item.prop"
            :sortable="item.sortable ? 'custom' : false"
            :width="item.width"
          >
            <template #header>
              <span v-if="item.label === '零件图片'">
                零件
                <br />
                图片
              </span>
              <span v-if="item.label === 'SKU图片'">
                SKU
                <br />
                图片
              </span>
            </template>
            <template #default="{ row }">
              <div v-if="item.label === '签收日期'">
                {{ row.signDate ? row.signDate.split(' ')[0] : '' }}
              </div>
              <div v-if="item.label === '外发'">
                <el-checkbox v-model="row.outsourced" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
              </div>
              <div v-if="item.label === 'PO'">
                <span class="copySku">
                  <el-link type="primary" :underline="true" @click="openPoDetail(row.poSkuId)">{{ row.po }}</el-link>
                  <vab-icon icon="file-copy-2-fill" @click="handleClipboard($event, row.po)" />
                </span>
              </div>
              <div v-if="item.label === '零件图片'">
                <el-image fit="fill" :src="row.componentUrl" style="width: 100%; height: 100%" @click="showPreviewImage(row.componentUrl)">
                  <template #error>
                    <el-icon />
                  </template>
                </el-image>
              </div>
              <div v-if="item.label === '签收物流单号'">
                <span class="overflow-text" v-html="row.signOrder"></span>
              </div>
              <div v-if="item.label === 'PO日期'">
                {{ row.poDate ? row.poDate.split(' ')[0] : '' }}
              </div>
              <div v-if="item.label === '付款日期'">
                {{ row.payDate ? row.payDate.split(' ')[0] : '' }}
              </div>
              <div v-if="item.label === 'SKU图片'">
                <el-image fit="fill" :src="row.skuImageUrl" style="width: 100%; height: 100%" @click="showPreviewImage(row.skuImageUrl)">
                  <template #error>
                    <el-icon />
                  </template>
                </el-image>
              </div>
              <div v-if="item.label === 'SKU'">
                <span class="copySku" @click="handleClipboard($event, row.sku)">
                  {{ row.sku }}
                  <vab-icon icon="file-copy-2-fill" />
                  <br />
                  {{ row.productName }}
                </span>
              </div>
              <div v-if="item.label === 'SKU套数'">
                <div>
                  <span class="copySku" @click="handleClipboard($event, row.sku)">
                    {{ row.sku }}
                    <vab-icon icon="file-copy-2-fill" />
                  </span>
                  <br />
                  {{ row.productName }}
                </div>
                <div style="margin-top: 4px">
                  <el-tag size="default" :style="getSiteTagStyle(row.siteName)">
                    {{ row.siteName }}
                  </el-tag>
                  <span style="margin-left: 4px">{{ row.purchaseSkuNumber }}套</span>
                </div>
              </div>
              <div v-if="item.label === '站点'">
                <el-tag size="default" :style="getSiteTagStyle(row.siteName)">
                  {{ row.siteName }}
                </el-tag>
              </div>
              <div v-if="item.label === '生产完成日期'">
                <el-date-picker
                  v-model="row.produceCompletionDate"
                  placeholder="请选择日期"
                  size="large"
                  style="width: 100%"
                  type="date"
                  value-format="YYYY-MM-DD"
                  @change="changeProductDate(row)"
                />
              </div>
              <div v-if="item.label === '跟单日志'">
                <el-tooltip content=" " effect="dark" placement="top">
                  <template #content>
                    <div class="custom-tooltip">{{ removeHtmlTags(row.log) }}</div>
                  </template>
                  <div class="multi-line-ellipsis-1">{{ removeHtmlTags(row.log) }}</div>
                </el-tooltip>
              </div>
              <div v-if="item.label === '问题原因'">
                {{ problemReasonOption.find((item) => item.value === row.problemReason)?.label }}
              </div>
              <div v-if="item.label === '需跟进产品'">
                <el-checkbox v-model="row.needFollowUp" disabled :false-value="0" :true-value="1" />
              </div>
            </template>
          </el-table-column>

          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <wang-editor
      :classify="classify"
      :content="progressLogCopy"
      :progress-id="detailId"
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorLogVisible"
      @click-boolean="clickLogBool"
      @click-child="clickLog"
    />
    <!-- 待签收修改 -->
    <vab-dialog v-model="modifyPendingVisible" :draggable="false" title="修改" width="40%" @close="closeModifyPendingDialog">
      <el-table
        border
        :cell-style="cellStyle3"
        :data="pendingSignRecord"
        :header-cell-style="{ textAlign: 'center' }"
        @cell-click="changeModifyInput"
      >
        <el-table-column label="签收日期" prop="createTime" />
        <el-table-column label="签收箱数" prop="signedBoxCount" />
        <el-table-column label="签收数量" prop="signCount" />
        <el-table-column label="单号" prop="signOrder">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.signOrder"
                clearable
                @blur="clickModifyOrderCancel($event, row)"
                @keyup.enter="clickModifyOrderCancel($event, row)"
              />
            </div>
            <span>{{ row.signOrder }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row, $index }">
            <el-button text type="danger" @click="handleDeleteSignRecord(row, $index)">删除并取消签收</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="closeModifyPendingDialog">取消</el-button>
        <el-button type="primary" @click="confirmModifyPending">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 已签收修改 -->
    <vab-dialog v-model="modifyVisible" title="修改" width="40%" @close="closeModifyDialog">
      <el-table
        border
        :cell-style="cellStyle4"
        :data="signedRecord"
        :header-cell-style="{ textAlign: 'center' }"
        @cell-click="changeModifyInput"
      >
        <el-table-column label="签收日期" prop="createTime">
          <template #default="{ row }">
            {{ row.createTime ? row.createTime.split(' ')[0] : '' }}
          </template>
        </el-table-column>
        <el-table-column label="签收箱数" prop="signedBoxCount" />
        <el-table-column label="签收数量" prop="signCount" />
        <el-table-column label="单号" prop="signOrder">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.signOrder"
                clearable
                @blur="clickModifyOrderCancel($event, row)"
                @keyup.enter="clickModifyOrderCancel($event, row)"
              />
            </div>
            <span>{{ row.signOrder }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row, $index }">
            <el-button text type="danger" @click="handleDeleteSignedRecord(row, $index)">删除并取消签收</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="closeModifyDialog">取消</el-button>
        <el-button type="primary" @click="confirmModify">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 入库单导出 -->
    <vab-dialog v-model="receiptExportVisible" title="入库单导出" width="25%" @close="closeReceiptExport">
      <el-form ref="receiptExportFormRef" :model="receiptExportForm">
        <el-form-item label="日期" label-width="70px" prop="date">
          <el-date-picker
            v-model="receiptExportForm.date"
            :editable="false"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeReceiptExport">取消</el-button>
        <el-button type="primary" @click="signExportSubmit">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 签收 -->
    <vab-dialog v-model="signVisible" title="签收" width="20%" @close="closeSignDialog">
      <el-form ref="signFormRef" label-position="right" label-width="auto" :model="signForm" :rules="signRules">
        <el-form-item label="签收箱数" prop="signedBoxCount">
          <el-input v-model="signForm.signedBoxCount" clearable />
        </el-form-item>
        <el-form-item label="签收数量" prop="signCount">
          <el-input v-model="signForm.signCount" clearable />
        </el-form-item>
        <el-form-item label="签收物流单号" prop="signOrder">
          <el-input v-model="signForm.signOrder" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :loading="signBntLoading" type="primary" @click="confirmSign">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 批量签收 -->
    <vab-sign-batch-dialog v-model="signBatchVisible" :loading="batchBtnLoading" @confirm="handleConfirmSignBatch" />
    <!-- 打印 -->
    <vab-print-count-dialog v-model="printCountVisible" :show-signed-box-count="activeName === 0" :sign-id="_id" />
    <!-- PO明细 -->
    <po-detail v-model="poDetailVisible" :close="closePoDetail" :poSkuId="poSkuId" />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import type { FormInstance, TableInstance, TabsPaneContext } from 'element-plus'
import { debounce, isEqual } from 'lodash-es'
import { CSSProperties, ref } from 'vue'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { getUserProcurementName } from '~/src/api/devlocal/user'
import { printerOption } from '../constantOption'
import { downloadFilePD } from '/@/api/devlocal/download'
import { getEncasementUserPrinter, updateEncasementUserPrinter } from '/@/api/devlocal/encasement'
import {
  batchUpdateSignLog,
  deleteSign,
  deleteSignRecord,
  getPackageSiteList,
  getSignDateList,
  getSignList,
  getSignLog,
  getSignRecord,
  getSignUserList,
  signBatch,
  signComponent,
  signMoreRecord,
  updateProblemReason,
  updateProductDate,
  updateRecordOrder,
  updateSignLog,
} from '/@/api/devlocal/packagingShipping'
import { getOperationColumnList, hideOrShowOperationColumn, updateSortOperationColumn } from '/@/api/devlocal/productPerformance'
import SignPermission from '/@/permissions/sign'
import type { IGetSignList } from '/@/type/packagingShipping/packagingType'
import { ISiteOption } from '/@/type/packagingShipping/shippedType'
import handleClipboard from '/@/utils/clipboard'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { hasPermission } from '/@/utils/permission'
import { calculateBrColumnWidth, flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'
import wangEditor from '/@/views/newProductDevelopment/newProductProgress/wangEditor.vue'
import poDetail from '/@/views/packagingShipping/components/poDetail.vue'
import VabSignBatchDialog from '/@/views/packagingShipping/vabAutoComponents/VabSignBatchDialog.vue'

defineOptions({
  name: 'PendingReceipt',
})

const totalSkuNumber = computed(() => {
  return selectRows.value.reduce((sum: number, item: any) => sum + (Number(item.purchaseSkuNumber) || 0), 0)
})
const totalComponentNumber = computed(() => {
  return selectRows.value.reduce((sum: number, item: any) => sum + (Number(item.purchaseCount) || 0), 0)
})

const signBntLoading = ref<boolean>(false)
const problemReasonOption = [
  { label: '供应商不配合', value: 0 },
  { label: '交期问题', value: 1 },
  { label: '开票问题', value: 2 },
  { label: '其他', value: 3 },
  { label: '交期延误-自动', value: 4 },
  { label: '新品', value: 5 },
]
const problemComponentOption = [
  { label: '全部零件', value: -1 },
  { label: '有问题零件', value: 1 },
  { label: '没问题零件', value: 0 },
]
const followLogOption = [
  { label: '全部跟单日志', value: -1 },
  { label: '已填写', value: 1 },
  { label: '未填写', value: 0 },
]
const columns = ref<any>([])
const checkList = computed(() => {
  return columns.value.filter((_: any) => _.checked)
})
const columns2 = ref<any>([])
const checkList2 = computed(() => {
  return columns2.value.filter((_: any) => _.checked)
})
const fetchColumn = async () => {
  const { data } = await getOperationColumnList({ type: 4 })
  columns.value = data
  columns.value.forEach((item: any) => {
    item.minWidth = item.width
    // 设置 最小宽度
    if (item.prop !== 'skuImageUrl' && item.prop !== 'componentUrl') {
      delete item.width
    }
    // 设置排序
    if (['po', 'payDate', 'sellableDay'].includes(item.prop)) {
      item.sortable = true
    }
  })
}
const fetchColumn2 = async () => {
  const { data } = await getOperationColumnList({ type: 5 })
  columns2.value = data
  columns2.value.forEach((item: any) => {
    item.minWidth = item.width
    // 设置 最小宽度
    if (item.prop !== 'skuImageUrl' && item.prop !== 'componentUrl') {
      delete item.width
    }
    if (['signDate'].includes(item.prop)) {
      item.sortable = true
    }
  })
}
const handleWidth = (item: any) => {
  switch (item.label) {
    case 'SKU套数': {
      return Math.max(flexColumnWidth(list.value, 'SKU套数', 'sku') + 60, flexColumnWidth(list.value, 'SKU套数', 'productName'))
    }
    case 'SKU': {
      return flexColumnWidth(list.value, 'SKU', 'sku', 60)
    }
    case '供应商': {
      return flexColumnWidth(list.value, '供应商', 'suppliserName')
    }
    case '零件名': {
      return flexColumnWidth(list.value, '零件名', 'componentName')
    }
    case '签收物流单号': {
      return calculateBrColumnWidth(list.value, (row: any) => row.signOrder, 100)
    }
    default: {
      return item.minWidth
    }
  }
}
const handleMove = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
}
const handleEnd = async () => {
  const req = columns.value.map((item: any, index: number) => {
    return {
      userId: item.userId,
      columnId: item.columnId,
      sort: index,
      // label: item.label
    }
  })
  await updateSortOperationColumn(req)
}
const handleMove2 = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns2.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
}
const handleEnd2 = async () => {
  const req = columns2.value.map((item: any, index: number) => {
    return {
      userId: item.userId,
      columnId: item.columnId,
      sort: index,
      // label: item.label
    }
  })
  await updateSortOperationColumn(req)
}
// 处理列是否隐藏
const handleChecked = async (item: any) => {
  item.checked = !item.checked
  const status = item.checked === true ? 1 : 0
  await hideOrShowOperationColumn({
    userId: item.userId,
    columnId: item.columnId,
    status,
  })
}
const selectedRowIndex = ref<number>(-1)
const handleRowClick = (row: any) => {
  selectedRowIndex.value = row.signId
}
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.signId === selectedRowIndex.value) {
    return 'select-row'
  }
  return ''
}

const batchBtnLoading = ref<boolean>(false)
const signLoading = ref<boolean>(false)
const printer = ref<string>('')
const activeName = ref<number>(0)
const printCountVisible = ref<boolean>(false)
const _id = ref<number>(0)

const selectRows = ref<any>([])
const setSelectRows = (value: any[]) => {
  selectRows.value = value
}
const list = ref<IGetSignList[]>([])
const tableRef = ref<TableInstance>()
const listLoading = ref<boolean>(true)
// 批量签收可见
const signBatchVisible = ref<boolean>(false)
// 获取默认打印机
const fetchDefaultPrinter = async () => {
  const { data } = await getEncasementUserPrinter()
  printer.value = data
}
const handleChangePrinter = async () => {
  try {
    await updateEncasementUserPrinter({ printer: printer.value })
  } catch (error) {
    $baseMessage(error, 'error')
  }
}
const showPrint = (row: any) => {
  _id.value = row.signId
  printCountVisible.value = true
}
// 签收可见
const signVisible = ref<boolean>(false)
// 签收form
const signForm = reactive<any>({
  signCount: '',
  signOrder: '',
  signedBoxCount: '',
})
const signRules = reactive<any>({
  signedBoxCount: [{ pattern: /^[1-9]\d*$/, message: '签收箱数必须为正整数', trigger: 'blur' }],
  signCount: [{ required: true, message: '请输入签收数量', trigger: 'blur' }],
  signOrder: [{ required: true, message: '请输入签收物流单号', trigger: 'blur' }],
})
const signFormRef = ref<FormInstance>()
const copyRow = ref<any>()
const getLatestSignedBoxCount = (signedBoxCount?: string) => signedBoxCount?.split(',')[0]?.trim() || ''
// 展示签收弹窗
const showSignDialog = (row: any) => {
  signVisible.value = true
  copyRow.value = row
  // 默认初始化签收数量为零件采购数量
  signForm.signCount = Number(row.purchaseCount - row.signCount)
  signForm.signedBoxCount = getLatestSignedBoxCount(row.signedBoxCount)
}
// 关闭签收弹窗
const closeSignDialog = () => {
  signFormRef.value?.resetFields()
  signVisible.value = false
}
// 确认签收
const confirmSign = async () => {
  const valid = await signFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }
  try {
    signLoading.value = true
    signBntLoading.value = true
    const { data } = await signComponent({
      signId: copyRow.value.signId,
      signCount: signForm.signCount,
      signedBoxCount: signForm.signedBoxCount ? Number(signForm.signedBoxCount) : undefined,
      signOrder: signForm.signOrder,
    })
    if (data) {
      $baseMessage('签收成功', 'success')
      signLoading.value = false
      signBntLoading.value = false
      closeSignDialog()
      fetchData()
    }
  } catch (error) {
    signLoading.value = false
    signBntLoading.value = false
  }
}
// 修改弹窗是否可见
const modifyVisible = ref<boolean>(false)
// 待签收弹窗是否可见
const modifyPendingVisible = ref<boolean>(false)
// 关闭修改弹窗
const closeModifyDialog = () => {
  modifyVisible.value = false
}
const confirmModify = () => {
  closeModifyDialog()
  fetchData()
}
// 关闭修改弹窗
const closeModifyPendingDialog = () => {
  modifyPendingVisible.value = false
}
const confirmModifyPending = () => {
  closeModifyPendingDialog()
  fetchData()
}
// 入库单导出表单
const receiptExportForm = reactive<any>({
  date: '',
})

const receiptExportFormRef = ref<FormInstance>()
// 入库单导出是否可见
const receiptExportVisible = ref<boolean>(false)
// 打开入库单导出弹窗
const handleShowReceiptExport = () => {
  receiptExportVisible.value = true
}
const closeReceiptExport = () => {
  receiptExportFormRef.value?.resetFields()
  receiptExportVisible.value = false
}
const exportLoading = ref<boolean>(false)
const handlePendingSignExport = async () => {
  const idList = selectRows.value.map((row: any) => row.signId)
  if (idList.length === 0) {
    $baseMessage('您未选择任何行！', 'warning')
    return
  }
  try {
    exportLoading.value = true
    await downloadFilePD('/pending/sign/export', {
      idList: idList,
    })
  } catch (error) {
    exportLoading.value = false
  } finally {
    exportLoading.value = false
  }
}
const signExportSubmit = async () => {
  await downloadFilePD('/sign/export/aiTuom', {
    startDate: receiptExportForm.date[0],
    endDate: receiptExportForm.date[1],
  })

  await downloadFilePD('/sign/export/yunzhou', {
    startDate: receiptExportForm.date[0],
    endDate: receiptExportForm.date[1],
  })
}

// 批量签收
const handleAllSigned = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning')
    return
  }
  signBatchVisible.value = true
}
const handleBatchSignLog = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning')
    return
  }
  detailId.value = 0
  progressLogCopy.value = ''
  wangEditorTitle.value = '批量新增跟单日志'
  classify.value = 'signBatchLog'
  wangEditorLogVisible.value = true
}
const handleConfirmSignBatch = async (form: { signedBoxCount?: number; signOrder: string }) => {
  try {
    batchBtnLoading.value = true
    const signIds = selectRows.value.map((item: any) => item.signId).join(',')
    const { data } = await signBatch({
      signIds,
      signedBoxCount: form.signedBoxCount,
      signOrder: form.signOrder,
    })
    if (data) {
      signBatchVisible.value = false
      batchBtnLoading.value = false
      $baseMessage('批量签收成功', 'success')
      fetchData()
    }
  } catch (error) {
    batchBtnLoading.value = false
  }
}

// 待签收表格
const pendingSignRecord = ref<any>([])
// 已签收表格
const signedRecord = ref<any>([])
// 查询签收记录
const handleGetSignRecord = async (row: any) => {
  modifyPendingVisible.value = true
  const { data } = await getSignRecord({
    signId: row.signId,
  })
  if (data) {
    pendingSignRecord.value = data
  }
}
const handleGetSignedRecord = async (row: any) => {
  modifyVisible.value = true
  const { data } = await getSignRecord({
    signId: row.signId,
  })
  if (data) {
    signedRecord.value = data
  }
}
const handleDeleteSignRecord = async (row: any, index: number) => {
  $baseConfirm('确定删除并取消签收吗', '系统提示', async () => {
    const { data } = await deleteSignRecord({
      signRecordId: row.id,
    })
    if (data) {
      pendingSignRecord.value.splice(index, 1)
      $baseMessage('删除取消零件签收成功！', 'success')
    }
  })
}
const handleDeleteSignedRecord = async (row: any, index: number) => {
  $baseConfirm('确定删除并取消签收吗', '系统提示', async () => {
    const { data } = await deleteSignRecord({
      signRecordId: row.id,
    })
    if (data) {
      signedRecord.value.splice(index, 1)
      $baseMessage('删除取消零件签收成功！', 'success')
    }
  })
}
const handleIfShowRecord = async (row: any) => {
  const { data } = await signMoreRecord({
    signId: row.signId,
  })
  if (data === true) {
    handleGetSignedRecord(row)
  } else {
    const { data } = await deleteSign({
      signId: row.signId,
    })
    if (data) {
      $baseMessage('取消签收成功', 'success')
      fetchData()
    }
  }
}

const router = useRouter()
const route = useRoute()
// 总记录数
const total = ref<number>(0)
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
  status: 0, //0待签收 1签收
  signUserId: -1,
  signDate: '',
  orderByField: 'po',
  orderDirection: 'asc',
  filterProblemComponent: -1,
  filterFollowLog: -1,
  filters: [],
  procurementManager: -1,
})
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const changeProductDate = async (row: any) => {
  // 由于 el-date-picker 已设置 value-format="YYYY-MM-DD"，值已经是字符串格式
  // 如果删除日期，produceCompletionDate 会是 null，需要处理
  const date = row.produceCompletionDate || ''
  const { data } = await updateProductDate({
    signId: row.signId,
    date: date,
  })
  if (data) {
    fetchData()
  }
  // console.log(row.produceCompletionDate);
}
const changeProblemReason = async (row: any) => {
  await updateProblemReason({
    signId: row.signId,
    reason: row.reason,
  })
}

// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 点击日志弹出富文本框是否显示
const wangEditorLogVisible = ref<boolean>(false)
const progressLogCopy = ref<string | undefined>('')
const classify = ref<string>('')

// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}

const handleTabClick = async (tab: TabsPaneContext) => {
  list.value = []
  selectRows.value = []
  if (tab.props.name !== undefined) {
    const tabName = Number(tab.props.name)
    activeName.value = tabName
    queryForm.status = tabName
  }

  await router.push({
    query: {
      ...route.query,
      tab: queryForm.status,
      pageNo: 1,
      pageSize: 20,
    },
  })
  if (queryForm.status === 0) {
    fetchColumn()
  } else {
    fetchColumn2()
  }
  await fetchData()
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): any => {
  const label = data.column.label
  if (['零件名', '收货仓库', '签收物流单号', 'SKU', 'SKU套数', '供应商', '跟单日志'].includes(label)) {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}
const cellStyle2 = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['零件名', '收货仓库', '签收物流单号', 'SKU', 'SKU套数', '供应商', '跟单日志'].includes(label)) {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}
const cellStyle3 = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): any => {
  if (data.columnIndex === 0) {
    return {
      textAlign: 'center',
      color: '#bbb',
      cursor: 'not-allowed',
    }
  }
  return {
    textAlign: 'center',
  }
}
const cellStyle4 = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): any => {
  if (data.columnIndex === 0 || data.columnIndex === 1 || data.columnIndex === 2) {
    return {
      textAlign: 'center',
      color: '#bbb',
      cursor: 'not-allowed',
    }
  }
  return {
    textAlign: 'center',
  }
}
/**
 * 当点击时切换输入框，修改输入
 */
const clickRow = ref<any>() // 当点击零件采购注意事项时候的行
const detailId = ref<number>(-1)
const changeInput = async (row: any, column: any) => {
  if (column.property === 'log') {
    clickRow.value = row
    const { data } = await getSignLog({ signId: row.signId })
    detailId.value = row.signId
    progressLogCopy.value = data
    row.log = data
    wangEditorTitle.value = '编辑跟单日志'
    classify.value = 'signLog'
    wangEditorLogVisible.value = !wangEditorLogVisible.value
  }
}
const showPreviewImage = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
let _row: any
/**
 * 当点击修改时切换输入框，修改输入
 */
const changeModifyInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  _row = JSON.parse(JSON.stringify(row))

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }
}

const clickModifyOrderCancel = async (event: any, value: any) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(_row, value)) {
    return
  }
  if (event.type === 'blur') {
    try {
      await updateRecordOrder({
        signRecordId: value.id,
        order: value.signOrder,
      })
    } catch {
      Object.assign(value, _row)
    }
  }
}

/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickLog = async (val: any) => {
  if (classify.value === 'signBatchLog') {
    const signIds = selectRows.value.map((item: any) => item.signId).join(',')
    const { data } = await batchUpdateSignLog({ signIds, log: val })
    if (data === true) {
      $baseMessage('批量新增跟单日志成功', 'success')
      wangEditorLogVisible.value = false
      selectRows.value = []
      await fetchData()
    }
    return
  }
  const { data } = await updateSignLog({ signId: clickRow.value.signId, log: val })
  if (data === true) {
    progressLogCopy.value = val
    clickRow.value.log = val
  }
}
/**
 * 当点击取消，确认时，子组件传递给父组件 false
 */
const clickLogBool = (val: any) => {
  wangEditorLogVisible.value = val
}
// 防抖处理
const debouncedQueryData = debounce(() => {
  queryData()
}, 700)
const fetchData = async () => {
  listLoading.value = true
  const { filters, ...params } = queryForm
  const { data } = await getSignList({
    ...params,
    filterNeedFollowUp: filters.includes('needFollowUp') ? 1 : -1,
  })
  if (data) {
    list.value = data.list!
    total.value = data.total!
    list.value.forEach((item: any) => {
      if (item.signOrder) {
        item.signOrder = item.signOrder.replaceAll(',', '<br>')
      }
    })
  }
  listLoading.value = false
}
const getCellClass = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.column.label === '零件图片' || data.column.label === 'SKU图片') {
    return 'clear-padding'
  }
  return ''
}
const getCellClass2 = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.column.label === '零件图片' || data.column.label === 'SKU图片') {
    return 'clear-padding'
  }
  return ''
}
onActivated(() => {
  tableRef.value?.doLayout()
})
const signUserOption = ref<{ id: number; label: string }[]>([])
const signDateOption = ref<string[]>([])
const fetchUserList = async () => {
  const { data } = await getSignUserList()
  signUserOption.value = data
  signUserOption.value.unshift({ id: -1, label: '全部' })
}
const fetchSignDateList = async () => {
  const { data } = await getSignDateList()
  signDateOption.value = data
}
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  // console.log(prop, order)
  if (queryForm.orderByField === prop) {
    if (!order) {
      if (queryForm.orderDirection === 'asc') {
        column.order = 'descending'
      } else if (queryForm.orderDirection === 'desc') {
        column.order = 'ascending'
      }
    }
  } else {
    column.order = 'descending'
  }
  queryForm.orderByField = prop
  queryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  queryData()
}

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  let rowspan = 1 // 默认不跨行
  const label = column.label
  if (label === 'SKU图片' || label === 'SKU套数' || label === '站点' || label === '剩余可售') {
    const po = row.po
    const purchaseSkuNumber = (row as any).purchaseSkuNumber

    // 只有当 po 和 purchaseSkuNumber 都一致时才合并
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      const nextRow = list.value[i] as any
      if (nextRow.po === po && nextRow.purchaseSkuNumber === purchaseSkuNumber) {
        rowspan++
      } else {
        break
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    const prevRow = rowIndex > 0 ? (list.value[rowIndex - 1] as any) : null
    const isFirstRow = rowIndex === 0 || !prevRow || prevRow.po !== po || prevRow.purchaseSkuNumber !== purchaseSkuNumber
    return isFirstRow ? { rowspan, colspan: 1 } : { rowspan: 0, colspan: 0 }
  }

  // 对于其他列，默认返回不合并
  return { rowspan: 1, colspan: 1 }
}
// 站点 -> 自定义颜色映射
const getSiteBaseColor = (siteName: string) => {
  if (!siteName) return '#909399'
  const colorMap: Record<string, string> = {
    亚马逊US美国: '#67C23A', // 绿色
    亚马逊UK英国: '#409EFF', // 蓝色
    亚马逊DE德国: '#8E44AD', // 紫色（由红色改为紫色）
    亚马逊CA加拿大: '#2AC3A2', // 青绿
    沃尔玛US美国: '#E6A23C', // 橙色
    亚马逊JP日本: '#5C6BC0', // 靛蓝
    Tiktok美国: '#34495E', // 深石板色
    '美国-海外仓': '#909399', // 灰色
  }
  return colorMap[siteName] ?? '#909399'
}
// 返回协调的tag样式：浅色背景 + 同色文字
const getSiteTagStyle = (siteName: string) => {
  const base = getSiteBaseColor(siteName)
  // 将16进制转换为rgba，背景使用较低透明度
  const hexToRgba = (hex: string, alpha = 0.15) => {
    const h = hex.replace('#', '')
    const bigint = parseInt(h, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return {
    backgroundColor: hexToRgba(base, 0.15),
    color: base,
    border: '1px solid ' + hexToRgba(base, 0.35),
    fontSize: '14px',
  }
}
// 站点列表
const siteList = ref<ISiteOption[]>([])
// 获取站点信息
const fetchSiteData = async () => {
  const { data } = await getPackageSiteList()
  siteList.value = data
  siteList.value.unshift({ id: -1, label: '全部站点' })
}
const defaultProcurementManager = { userId: -1, userName: '全部采购负责人' }
/** 获取采购负责人列表 */
const procurementManagerList = ref<{ userId: number; userName: string }[]>([])
const fetchProcurementManagerList = async () => {
  const { data } = await getUserProcurementName({
    name: '',
  })
  data.unshift(defaultProcurementManager)
  procurementManagerList.value = data
}
onBeforeMount(async () => {
  fetchProcurementManagerList()
  fetchSiteData()
  fetchUserList()
  fetchSignDateList()
  fetchDefaultPrinter()
  const { pageNo, pageSize, tab } = route.query
  if (pageNo) {
    queryForm.pageNo = Number(pageNo)
  }
  if (pageSize) {
    queryForm.pageSize = Number(pageSize)
  }
  if (tab) {
    activeName.value = Number(tab)
    queryForm.status = Number(tab)
  }
  if (queryForm.status === 0) {
    await fetchColumn()
  } else {
    await fetchColumn2()
  }
  await fetchData()
})

/******* PO明细弹窗 *******/
const poDetailVisible = ref<boolean>(false)
const poSkuId = ref<number | null>(null)
// 打开PO明细弹窗
const openPoDetail = (skuId: any) => {
  const id = skuId ?? null
  if (id == null) {
    ElMessage.warning('缺少 PO SKU') // 按需
    return
  }
  poDetailVisible.value = true
  poSkuId.value = id
}
// 关闭PO明细弹窗
const closePoDetail = () => {
  poDetailVisible.value = false
  poSkuId.value = null
}
</script>

<style lang="scss" scoped>
.tabs-table-container {
  :deep() {
    .el-tabs {
      border-radius: var(--el-border-radius-base);

      &__header {
        border-top-left-radius: var(--el-border-radius-base);
        border-top-right-radius: var(--el-border-radius-base);
      }

      &__nav-wrap {
        border-radius: var(--el-border-radius-base);
      }

      .el-tab-pane {
        display: flex;
        flex-direction: column;
        height: calc(var(--el-container-height) - var(--el-padding) - 52px) !important;

        .vab-query-form {
          .left-panel {
            margin-bottom: 5px !important;
          }
          .right-panel {
            margin-bottom: 5px !important;
          }
        }

        .el-table {
          flex: 1;
          .el-table__body {
            .cell {
              max-height: 81.2px;
            }
          }
          .clear-padding {
            padding-top: 0px;
            padding-bottom: 0px;
          }
          .clear-padding .cell {
            padding-right: 0px;
            padding-left: 0px;
          }
        }
      }
      .el-table {
        .el-checkbox {
          transform: scale(1.2); // 放大 20%
          transform-origin: center; // 确保放大从中心开始
        }
      }
    }
  }
}
// 控制编辑框显示与隐藏
.none {
  display: none;
}
.overflow-text {
  display: block;
  max-height: 65.2px;
  overflow-y: auto;
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
.handle {
  cursor: grab;
}
.disabled-handle {
  cursor: not-allowed;
}
.icon-dis {
  padding: 6px;
}
.icon-hover {
  padding: 6px;
  border-radius: 4px; /* 圆角 */
  transition: background-color 0.3s; /* 动画过渡效果 */
}
.icon-hover:hover {
  color: var(--el-color-primary);
  background-color: #f2f2f2; /* 浅灰色背景 */
}
// 搜索框宽度设置
.search-input {
  width: 300px !important;
}
.filter-group {
  display: inline-flex;
  align-items: center;
  margin-left: 12px;
  padding: 1px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f3f4;
  }
}
.compact-statistic {
  :deep() {
    .el-statistic__head {
      margin-bottom: 0;
      font-size: 14px;
    }
    .el-statistic__content {
      margin-top: 2px;
      font-size: 18px;
    }
  }
}

// 斑马纹样式
:deep(.custom-table-hover) {
  .el-table__body tr.el-table__row--striped > td.el-table__cell {
    background-color: #fafafa !important;
  }

  // 条纹行hover时保持条纹颜色
  .el-table__body tr.el-table__row--striped.hover-row > td.el-table__cell {
    background-color: #fafafa !important;
  }

  // 选中行保持蓝色背景 - 优先级最高
  .el-table__body tr.select-row > td.el-table__cell {
    background-color: #7bddde !important;
  }

  // 选中行悬浮时也保持蓝色背景
  .el-table__body tr.select-row.hover-row > td.el-table__cell {
    background-color: #7bddde !important;
  }
}
</style>
