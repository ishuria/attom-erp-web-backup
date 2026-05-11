<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" :lazy="true" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="进行中" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="getSampleProgress">样品进度</el-button>
            <!--            <el-button type="primary" @click="getMoldProgress">开模进度</el-button>-->
            <el-button v-permissions="{ permission: [ProgressPermission.PERSON_FILTER] }" type="primary" @click="handlePersonSelect">
              参与人员筛选
            </el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.productKeyWord"
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
          :cell-style="cellStyle"
          class="custom-table-hover"
          :data="progressList"
          :header-cell-style="{ textAlign: 'center' }"
          :row-class-name="tableRowClassName"
          stripe
          @cell-click="changeInput"
          @row-click="handleRowClick"
        >
          <el-table-column label="ID" prop="progressId" width="70" />
          <el-table-column label="优先级" prop="priority" width="120">
            <template #default="{ row }">
              <el-select v-model="row.priority" class="center-select" style="min-width: 100%" @change="updatePriority(row)">
                <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="立项日期" prop="createTime" width="120">
            <template #default="{ row }">
              {{ row.createTime !== null ? row.createTime.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column label="参与人员" prop="sharerName" width="120">
            <template #default="{ row }">
              <span
                :style="{ display: 'inline-block', 'min-width': columnWidths.sharerName + 'px', 'text-align': 'left' }"
                v-html="row.sharerName.replace(/,/g, '<br/>')"
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="产品" prop="product" :width="columnWidths.product + 50">
            <template #default="{ row }">
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.product + 'px', 'text-align': 'left' }">
                {{ row.product }}
                <br />
                {{ row.mainSearchTerms }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="OEM" prop="oem" width="80">
            <template #default="{ row }">
              <el-checkbox
                v-model="row.oem"
                class="custom-checkbox"
                :false-value="'0'"
                size="large"
                :true-value="'1'"
                @change="(val) => handleCheckbox(val, row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="示例图片" prop="imageList" :width="imageColumnWidth">
            <template #default="{ row, $index }">
              <div style="display: flex; align-items: center">
                <vue-draggable v-model="row.imageList" :animation="150" class="image-list" ghost-class="ghost" @end="(event) => onEnd(row, event)">
                  <div v-for="(image, index) in row.imageList" :key="image.imageId" class="image-cell">
                    <div class="image-preview">
                      <img :alt="image.imageId" loading="lazy" :src="image.imageUrl" />
                      <div class="image-actions">
                        <el-icon @click="handlePictureCardPreview(image, row)"><zoom-in /></el-icon>
                        <el-icon @click="handleRemove(image, row)"><delete /></el-icon>
                      </div>
                    </div>
                  </div>
                </vue-draggable>

                <div v-if="row.imageList.length < 5" class="image-cell" :style="{ marginLeft: row.imageList.length > 0 ? 8 + 'px' : 0 }">
                  <div class="upload-placeholder" @click="showUploadDialog(row, $index)">
                    <el-icon><plus /></el-icon>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="开发日志" min-width="300" prop="progressLog">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">
                    {{ removeHtmlTags(row.progressLog) }}
                    <span v-if="row.progressLog?.length >= 300">...</span>
                  </div>
                </template>
                <div class="multi-line-ellipsis">
                  {{ removeHtmlTags(row.progressLog) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column label="当前阶段" prop="currentPhaseStatus" :width="columnWidths.currentPhaseStatus + 30">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.currentPhaseStatus" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.currentPhaseStatus + 'px', 'text-align': 'left' }">
                {{ row.currentPhaseStatus }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="160" prop="remark">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.remark) }}</div>
                </template>
                <div class="multi-line-ellipsis">{{ removeHtmlTags(row.remark) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="MOQ" prop="moq" width="100">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.moq" type="text" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>
                {{ row.moq }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="目标月销" prop="targetMonthlySales" width="120">
            <template #default="{ row }">
              <div class="none">
                <el-input
                  v-model="row.targetMonthlySales"
                  type="text"
                  @blur="clickCancel($event, row)"
                  @keyup.enter="clickCancel($event, row)"
                />
              </div>
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.targetMonthlySales + 'px', 'text-align': 'right' }">
                {{ row.targetMonthlySales }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="调研报告链接" prop="researchReportLink" width="200">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.researchReportLink }}</div>
                </template>
                <div class="multi-line-ellipsis-1">{{ row.researchReportLink }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="新款评估编号" prop="evaluationId" width="120" />

          <el-table-column :fixed="fixed" label="操作" width="180">
            <template #default="{ row }">
              <el-dropdown>
                <el-button text type="primary" @click="handleSampleCosting(row, 1)">
                  拿样与核算
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleSampleCosting(row, 1)">
                      <el-link type="primary" underline="never">拿样与核算</el-link>
                    </el-dropdown-item>
                    <!--                    <el-dropdown-item @click="addProgressMold">-->
                    <!--                      <el-link type="primary" underline="never">开模申请</el-link>-->
                    <!--                    </el-dropdown-item>-->
                    <el-dropdown-item @click="handleOrderProcess(row)">
                      <el-link type="primary" underline="never">{{ handleSwitchName(row) }}</el-link>
                    </el-dropdown-item>

                    <el-dropdown-item @click="handleCopyProgress(row)">
                      <el-link type="primary" underline="never">复制</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleGetShareList(row.progressId)">
                      <el-link type="primary" underline="never">共享</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleGetEvaluationById(row.evaluationId)">
                      <el-link type="primary" underline="never">查看新款评估</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleArchived(row.progressId)">
                      <el-link type="primary" underline="never">归档</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
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
      <el-tab-pane label="已归档" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button
              v-permissions="{ permission: [ProgressPermission.PERSON_FILTER] }"
              type="primary"
              @click="handleArchivedPersonselect"
            >
              参与人员筛选
            </el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <div class="custom-table-right-tools">
              <el-form inline :model="queryForm" @submit.prevent>
                <el-form-item>
                  <el-input
                    v-model.trim="queryForm.productKeyWord"
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
            </div>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          ref="tableRef"
          v-loading="listLoading"
          border
          :cell-style="cellStyle2"
          class="custom-table-hover"
          :data="progressList"
          :header-cell-style="{ textAlign: 'center' }"
          :row-class-name="tableRowClassName"
          stripe
          @cell-click="changeInput"
          @row-click="handleRowClick"
        >
          <el-table-column label="ID" prop="progressId" width="70" />
          <el-table-column label="优先级" prop="priority" width="90">
            <template #default="{ row }">
              {{ priorityOptions.find((item) => item.value === row.priority)?.label }}
            </template>
          </el-table-column>
          <el-table-column label="立项日期" prop="createTime" width="120">
            <template #default="{ row }">
              {{ row.createTime !== null ? row.createTime.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column label="参与人员" prop="sharerName" width="100">
            <template #default="{ row }">
              <span
                :style="{ display: 'inline-block', 'min-width': columnWidths.sharerName + 'px', 'text-align': 'left' }"
                v-html="row.sharerName.replace(/,/g, '<br/>')"
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="产品" prop="product" :width="columnWidths.product + 50">
            <template #default="{ row }">
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.product + 'px', 'text-align': 'left' }">
                {{ row.product }}
                <br />
                {{ row.mainSearchTerms }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="OEM" prop="oem" width="70">
            <template #default="{ row }">
              <el-checkbox
                v-model="row.oem"
                class="custom-checkbox"
                disabled
                :false-value="'0'"
                size="large"
                :true-value="'1'"
                @change="(val) => handleCheckbox(val, row)"
              />
            </template>
          </el-table-column>
          <el-table-column class="image-wall" label="示例图片" prop="imageList" :width="imageColumnWidth">
            <template #default="{ row, $index }">
              <div style="display: flex; align-items: center">
                <vue-draggable v-model="row.imageList" :animation="150" class="image-list" ghost-class="ghost" @end="(event) => onEnd(row, event)">
                  <div v-for="(image, index) in row.imageList" :key="image.imageId" class="image-cell">
                    <div class="image-preview">
                      <img :alt="image.imageId" loading="lazy" :src="image.imageUrl" />
                      <div class="image-actions">
                        <el-icon @click="handlePictureCardPreview(image, row)"><zoom-in /></el-icon>
                        <el-icon @click="handleRemove(image, row)"><delete /></el-icon>
                      </div>
                    </div>
                  </div>
                </vue-draggable>
                <!-- 添加按钮 -->
                <div v-if="row.imageList.length < 5" class="image-cell" :style="{ marginLeft: row.imageList.length > 0 ? 8 + 'px' : 0 }">
                  <div class="upload-placeholder" @click="showUploadDialog(row, $index)">
                    <el-icon><plus /></el-icon>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="开发日志" min-width="300" prop="progressLog">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">
                    {{ removeHtmlTags(row.progressLog) }}
                    <span v-if="row.progressLog?.length >= 300">...</span>
                  </div>
                </template>
                <div class="multi-line-ellipsis">
                  {{ removeHtmlTags(row.progressLog) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column label="备注" min-width="160" prop="remark">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.remark) }}</div>
                </template>
                <div class="multi-line-ellipsis">{{ removeHtmlTags(row.remark) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="MOQ" prop="moq" width="100" />
          <el-table-column label="当前阶段" prop="currentPhaseStatus" :width="columnWidths.currentPhaseStatus + 30">
            <template #default="{ row }">
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.currentPhaseStatus + 'px', 'text-align': 'left' }">
                {{ row.currentPhaseStatus }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="目标月销" prop="targetMonthlySales" width="120">
            <template #default="{ row }">
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.targetMonthlySales + 'px', 'text-align': 'right' }">
                {{ row.targetMonthlySales }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="调研报告链接" prop="" width="350">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.researchReportLink }}</div>
                </template>
                <div class="multi-line-ellipsis-1">{{ row.researchReportLink }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="新款评估编号" prop="evaluationId" width="120" />

          <el-table-column fixed="right" label="操作" width="190">
            <template #default="{ row }">
              <el-dropdown>
                <el-button text type="primary" @click="handleSampleCosting(row, 0)">
                  拿样与核算
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleSampleCosting(row, 0)">
                      <el-link type="primary" underline="never">拿样与核算</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleCopyAchivedProgress(row)">
                      <el-link type="primary" underline="never">复制到进行中</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
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
    <el-image-viewer v-if="dialogVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <wang-editor
      :classify="classify"
      :content="progressLogCopy"
      :progress-id="progressId"
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorLogVisible"
      @click-boolean="clickLogBool"
      @click-child="clickLog"
    />
    <wang-editor
      :classify="classify"
      :content="remarkCopy"
      :progress-id="progressId"
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorRemarkVisible"
      @click-boolean="clickRemarkBool"
      @click-child="clickRemark"
    />
    <!-- 共享 -->
    <vab-shared
      :id="shareId"
      :fetch-data="fetchData"
      :handler-switch-change="handlerSwitchChange"
      :list="shareUserList"
      :visible="sharedVisible"
      @update:shared-visible="updateSharedVisibleValue"
    />

    <!-- 开模申请 -->
    <vab-dialog v-model="moldVisible" :before-close="handlerCloseDialog" class="moldDialog" title="开模申请" width="500">
      <el-divider style="margin-top: 0" />
      <el-form
        ref="formRef"
        class="demo-form"
        label-position="right"
        label-width="120px"
        :model="form"
        style="max-width: 340px; margin: 0 auto"
      >
        <el-form-item label="零件名" prop="componentName">
          <el-select v-model="form.componentName" clearable placeholder="" @change="handleComponentChange">
            <el-option v-for="item in componentOptions" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商全名" prop="supplierName">
          <el-select v-model="form.supplierName" clearable :disabled="supplierDisabled" placeholder="" @change="handleSupplierChange">
            <el-option v-for="item in supplierOptions" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="模具费(不含税)" prop="excludingTax">
          <el-input v-model="form.excludingTax" clearable />
        </el-form-item>
        <el-form-item label="普票加税点" prop="standardInvoice">
          <el-input v-model="form.standardInvoice" clearable placeholder="例子：13个点则填13" />
        </el-form-item>
        <el-form-item label="专票加税点" prop="specialInvoice">
          <el-input v-model="form.specialInvoice" clearable placeholder="例子：13个点则填13" />
        </el-form-item>
        <el-form-item label="预估采购货值" prop="purchaseTotal">
          <el-input v-model="form.purchaseTotal" clearable />
        </el-form-item>
        <el-form-item label="审核人" prop="audit">
          <!-- <el-input v-model="form.name" clearable placeholder="王豪俊" disabled/> -->
          <el-select v-model="form.audit" clearable placeholder="王豪俊">
            <el-option label="王豪俊" value="王豪俊" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="handleCancle">退出</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </span>
      </template>
    </vab-dialog>
    <!-- 样品进度 -->
    <sample-progress
      :sample-progress-visible="sampleProgressDialog"
      @update:priview-list-value="setPreviewList"
      @update:sample-progress-visible="sampleProgressDialog = $event"
    />
    <!-- 开模进度 -->
    <mold-progress :mold-progress-visible="moldProgressDialog" @update:mold-progress-visible="moldProgressDialog = $event" />
    <!-- 新款评估 -->
    <vab-dialog
      v-model="newEvaluationVisible"
      :before-close="handlerEvaluationCloseDialog"
      class="moldDialog"
      title="新款评估"
      width="90%"
      @opened="onDialogOpened"
    >
      <div id="table-height-container">
        <el-table
          ref="evaluationTableRef"
          v-loading="listLoading"
          border
          :data="newEvaluationData"
          :header-cell-style="{ 'text-align': 'center' }"
          stripe
          @cell-click="keyWordTrendCellClick"
        >
          <el-table-column
            v-for="(item, index) in indexColumns"
            :key="index"
            align="center"
            :label="item.label"
            :min-width="item.minWidth || 100"
            :prop="item.prop"
            width="auto"
          >
            <template #default="{ row }">
              <div v-if="item.label === '关键词趋势'" style="width: 80px; height: 63px">
                <vab-echarts-chart-bar :x-axis-data="row.trendList.xAxis" :y-axis-data="row.trendList.yAxis" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer></template>
    </vab-dialog>
    <!-- 参与人员筛选 -->
    <vab-dialog v-model="shareSelectVisible" :before-close="handleShareSelectClose" title="参与人员筛选" width="480">
      <el-form style="margin: 0">
        <el-form-item label="参与人员列表">
          <el-tree-select
            v-model="shareSelect"
            check-strictly
            clearable
            :data="treeShareData"
            filterable
            multiple
            placeholder="请选择参与人员"
            :props="treeProps"
            :render-after-expand="false"
            show-checkbox
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleShareSelectConfirm">筛选</el-button>
      </template>
    </vab-dialog>
    <!-- 参与人员筛选 -->
    <vab-dialog v-model="shareArchivedSelectVisible" :before-close="handleArchivedShareSelectClose" title="参与人员筛选" width="480">
      <el-form style="margin: 0">
        <el-form-item label="参与人员列表">
          <el-tree-select
            v-model="shareArchivedSelect"
            check-strictly
            clearable
            :data="treeArchivedShareData"
            filterable
            multiple
            placeholder="请选择参与人员"
            :props="treeProps"
            :render-after-expand="false"
            show-checkbox
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleArchivedShareSelectConfirm">筛选</el-button>
      </template>
    </vab-dialog>
    <!-- 关键词趋势图表 -->
    <vab-trend
      :key-word="inputKeyWord"
      :trend-data="trendEcharts"
      :trend-echarts-visible="keyWordTrendEchartsVisible"
      @update:clear-input-key-word="cleanKeyWordTrendData"
      @update:trend-echarts-list="updateTrendEchatsData"
      @update:visible-value="updateTrendVisibleValue"
    />
    <!-- 上传图片 -->
    <vab-image-upload v-model="imageUploadVisible" @image-upload="uploadImage" />
    <!-- 更新产品名 -->
    <vab-dialog v-model="updateProductNameVisible" title="更新产品名" width="25%">
      <el-form ref="updateFormRef" label-position="top" :model="updateForm" :rules="updateFormRules">
        <el-form-item label="中文品名" prop="product">
          <el-input v-model="updateForm.product" clearable />
        </el-form-item>
        <el-form-item label="主要搜索词" prop="mainSearchTerms">
          <el-input v-model="updateForm.mainSearchTerms" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="updateProductNameVisible = false">取消</el-button>
        <el-button type="primary" @click="updateProductName">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 修改调研报告链接 -->
    <vab-remark-dialog
      v-model="updateResearchReportLinkVisible"
      :remark="researchReportLink"
      title="修改调研报告链接"
      @update:remark="updateResearchReportLink"
    />
    <!-- 复制打开的弹窗 -->
    <vab-dialog v-model="copyProgressVisible" title="复制" width="15%">
      <el-radio-group v-model="copyOptions">
        <el-radio :value="0">仅保留零件清单</el-radio>
        <el-radio :value="1">仅保留成本核算</el-radio>
        <el-radio :value="2">同时保留零件清单和成本核算</el-radio>
        <el-radio :value="3">都不保留</el-radio>
      </el-radio-group>

      <template #footer>
        <el-button @click="copyProgressVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmCopyProgress">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Delete, Plus, Search, ZoomIn } from '@element-plus/icons-vue'
import { ElLink, type FormInstance, type TableInstance, type TableTooltipData, type TabsPaneContext } from 'element-plus'
import { debounce, isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { getEvaluationTrendList } from '~/src/api/devlocal/evaluation'
import { getReviewIdByProgressId } from '~/src/api/devlocal/orderProcess'
import { updateProgressLog } from '~/src/api/devlocal/progressSample'
import { indexColumns } from './indexColumns'
import moldProgress from './moldProgress.vue'
import sampleProgress from './sampleProgress.vue'
import wangEditor from './wangEditor.vue'
import {
  copyProgress,
  deleteImage,
  getByIdQueryEvaluation,
  getList,
  getProgressLog,
  getProgressPersonList,
  getProgressSharelist,
  getProgressSuppliserList,
  updateProgressArchive,
  updateProgressImgSort,
  updateProgressManage,
  updateProgressMoldAdd,
  updateProgressSharelist,
  uploadFile,
} from '/@/api/devlocal/progress'
import ProgressPermission from '/@/permissions/progress'
import type { IKeyWordTrend } from '/@/type/evaluation/evaluationType'
import type { IGetByIdQueryEvaluation, IProgress, IProgressQueryReq, IProgressShared, ISelectShare } from '/@/type/progress/progressType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { convertString } from '/@/utils/stringUtils'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'

defineOptions({
  name: 'NewProductProgress',
})

const selectedRowIndex = ref<number>(-1)
// 行点击处理函数
const handleRowClick = (row: any, column: any, event: Event) => {
  selectedRowIndex.value = row.progressId
}
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.progressId === selectedRowIndex.value) {
    return 'select-row'
  }
  return ''
}
const tableRowFormatter = (data: TableTooltipData<IProgress>) => {
  return `${data.cellValue}: table formatter`
}

const withVNode = (data: TableTooltipData<IProgress>) => {
  return h(ElLink, { type: 'primary', href: data.cellValue }, () => h('span', null, data.cellValue))
}
const handleSwitchName = (row: any) => {
  if (row.bulkGoodsStatus === 1) {
    return '继续大货申请'
  } else if (row.bulkGoodsStatus === 2) {
    return '查看大货申请'
  }
  return '提交大货申请'
}
// 订大货
const handleOrderProcess = async (row: IProgress) => {
  const { data } = await getReviewIdByProgressId({ progressId: row.progressId! })
  // console.log('data', data)
  if (row.bulkGoodsStatus === 1) {
    await router.push({
      path: '/newProductDevelopment/orderingProcess',
      query: {
        reviewStatus: '0',
        reviewId: data,
      },
    })
    return
  } else if (row.bulkGoodsStatus === 0) {
    if (data) {
      await router.push({
        path: '/newProductDevelopment/orderingProcess',
        query: {
          reviewStatus: '0',
          reviewId: data,
        },
      })
    } else {
      await router.push({
        path: '/newProductDevelopment/orderingProcess',
        query: {
          progressId: row.progressId,
        },
      })
    }
  } else {
    await router.push({
      path: '/newProductDevelopment/orderingProcess',
      query: {
        reviewId: data,
      },
    })
  }
}
const updateResearchReportLinkVisible = ref<boolean>(false)
const researchReportLink = ref<string>('')

// 复制进度相关变量
const copyProgressVisible = ref<boolean>(false)
const copyOptions = ref<number>(2) // 默认选择"同时保留零件清单和成本核算"
const updateResearchReportLink = async (val: string) => {
  const { data } = await updateProgressManage({ ..._row, researchReportLink: val })
  if (data) {
    $baseMessage('修改调研报告链接成功', 'success')
    _row.researchReportLink = val
    updateResearchReportLinkVisible.value = false
  }
}
const updateFormRef = ref<FormInstance>()
const updateFormRules = reactive({
  product: [{ required: true, message: '请输入中文品名', trigger: 'blur' }],
  mainSearchTerms: [{ required: true, message: '请输入主要搜索词', trigger: 'blur' }],
})
// 更新产品名可见
const updateProductNameVisible = ref<boolean>(false)
const updateForm = reactive({
  product: '',
  mainSearchTerms: '',
})
const activeName = ref<number>(0)
const router = useRouter()
const route = useRoute()
const fixed = ref<string>('right')
const tableRef = ref<TableInstance>()
const evaluationTableRef = ref<TableInstance>()
// 表格加载loading状态
const listLoading = ref<boolean>(true)
// 新品进度列表
const progressList = ref<IProgress[]>([])
const imageColumnWidth = computed(() => {
  const imageWidth = 75
  const sidePadding = 24
  const imageGap = 8

  return progressList.value.reduce((maxWidth, row) => {
    const imageCount = row?.imageList?.length || 0
    const slotCount = imageCount < 5 ? imageCount + 1 : imageCount
    const totalWidth = slotCount * imageWidth + sidePadding + Math.max(slotCount - 1, 0) * imageGap

    return Math.max(maxWidth, totalWidth)
  }, imageWidth + sidePadding)
})
// 优化：使用 computed 缓存列宽度，但只在数据变化时重新计算
const columnWidths = computed(() => {
  // 如果列表为空，返回默认值，避免不必要的计算
  if (!progressList.value || progressList.value.length === 0) {
    return {
      currentPhaseStatus: 120,
      sharerName: 100,
      product: 200,
      targetMonthlySales: 120,
    }
  }
  return {
    currentPhaseStatus: flexColumnWidth(progressList.value, '当前阶段', 'currentPhaseStatus', 0),
    sharerName: flexColumnWidth(progressList.value, '参与人员', 'other', 0),
    product: Math.max(
      flexColumnWidth(progressList.value, '中文品名', 'product', 0),
      flexColumnWidth(progressList.value, '中文品名', 'mainSearchTerms', 0)
    ),
    targetMonthlySales: flexColumnWidth(progressList.value, '目标月销', 'targetMonthlySales', 0),
  }
})
let tableClickProgressId = ref<number>(0)
// 点击上传图标的行下标
let tableClickRowIndex = ref<number>(0)
// 总记录数
const total = ref<number>(0)
const queryForm = reactive<IProgressQueryReq>({
  pageNo: 1,
  pageSize: 20,
  productKeyWord: '',
  status: 0, //查询状态：0表示进行中 1表示已归档
  userNameList: [],
})

const priorityOptions = [
  {
    value: '2',
    label: '高',
  },
  {
    value: '1',
    label: '中',
  },
  {
    value: '0',
    label: '低',
  },
]
const dialogVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 点击日志弹出富文本框是否显示
const wangEditorLogVisible = ref<boolean>(false)
// 点击备注弹出富文本框是否显示
const wangEditorRemarkVisible = ref<boolean>(false)
const progressLogCopy = ref<string | undefined>('')
const remarkCopy = ref<string | undefined>('')
const classify = ref<string>('')
const tableClickIdx = ref<any>(0)
const currentRow = ref<any>(undefined) // 保存当前编辑的行数据

// 共享
const sharedVisible = ref<boolean>(false)
// 共享人id
const shareId = ref<string>('')
// 共享人列表
const shareUserList = ref<IProgressShared[]>([])
// 开模申请
const moldVisible = ref<boolean>(false)
// 开模申请数据表单
let form = ref<any>({
  componentName: '',
  supplierName: '',
  progressId: null,
  productName: '',
  excludingTax: null,
  standardInvoice: null,
  specialInvoice: null,
  purchaseTotal: null,
  audit: '',
})
// 零件列表
const componentOptions = ref<any>([])
// 供应商列表
const supplierOptions = ref<any>([])
// 控制供应商列表是否可选择
const supplierDisabled = ref<boolean>(true)
// 控制样品进度是否显示
const sampleProgressDialog = ref<boolean>(false)
// 控制开模进度是否显示
const moldProgressDialog = ref<boolean>(false)

// 控制查看新款评估是否显示
const newEvaluationVisible = ref<boolean>(false)
// 根据评估id找到的新款评估信息
const newEvaluationData = ref<IGetByIdQueryEvaluation[]>([])
const keyWordTrendEchartsVisible = ref<boolean>(false)
// 图表
const trendEcharts = ref<IKeyWordTrend>({
  xAxis: [],
  yAxis: [],
})
// 输入的关键词
const inputKeyWord = ref<string>('0')
// 控制参与人员筛选
const shareSelectVisible = ref<boolean>(false)
// 控制已归档参与人员筛选
const shareArchivedSelectVisible = ref<boolean>(false)
// 参与人员筛选列表
const optionShare = ref<any>([])
const optionArchivedShare = ref<any>([])
// 参与人员选中的值
const shareSelect = ref<ISelectShare[]>([])
const shareArchivedSelect = ref<ISelectShare[]>([])

// 树形选择器数据
const treeShareData = ref<any[]>([])
const treeArchivedShareData = ref<any[]>([])

// 树形选择器配置
const treeProps = {
  children: 'children',
  label: 'label',
  value: 'value',
  disabled: 'disabled',
}

const userNameList = ref<string[]>([])
const userNameArchivedList = ref<string[]>([])

// 将平铺数据转换为树形结构
const convertToTreeData = (data: any[]) => {
  // 如果没有数据，返回空数组
  if (!data || data.length === 0) {
    return []
  }

  // 检查是否有部门字段，如果没有则按角色或其他字段分组
  const hasDepartment = data.some((item) => item.department)
  const hasRoleName = data.some((item) => item.roleName)

  let groupField = 'department'
  if (!hasDepartment && hasRoleName) {
    groupField = 'roleName'
  } else if (!hasDepartment && !hasRoleName) {
    // 如果都没有，直接返回平铺结构
    return data.map((item) => ({
      label: item.userName,
      value: item.userID,
      disabled: false,
    }))
  }

  // 按指定字段分组
  const groupMap = new Map()

  data.forEach((item) => {
    const groupValue = item[groupField] || '未分组'
    if (!groupMap.has(groupValue)) {
      groupMap.set(groupValue, [])
    }
    groupMap.get(groupValue).push({
      label: item.userName,
      value: item.userID,
      disabled: false,
    })
  })

  // 转换为树形结构
  const treeData: any[] = []
  groupMap.forEach((users, groupName) => {
    treeData.push({
      label: groupName,
      value: groupName,
      disabled: true, // 分组节点不可选择
      children: users,
    })
  })

  return treeData
}

const handlerCloseDialog = () => {
  moldVisible.value = false
}
// 控制筛选对话框关闭
const handleShareSelectClose = () => {
  shareSelectVisible.value = false
  // shareSelect.value = []
}
// 控制筛选对话框关闭
const handleArchivedShareSelectClose = () => {
  shareArchivedSelectVisible.value = false
}
const handlerEvaluationCloseDialog = () => {
  newEvaluationVisible.value = false
}
const handleTabClick = (tab: TabsPaneContext) => {
  selectedRowIndex.value = -1
  progressList.value = []
  queryForm.userNameList = []
  if (Number(tab.props.name) === 0) queryForm.status = 0
  else queryForm.status = 1
  router.push({
    query: {
      ...route.query,
      tab: tab.props.name,
    },
  })
  fetchData()
}
// 处理已归档
const handleArchived = async (progressId: number) => {
  const { data } = await updateProgressArchive({ progressId })
  if (data === true) {
    const index = progressList.value.findIndex((item: any) => item.progressId === progressId)
    progressList.value.splice(index, 1)
    $baseMessage('此条新品进度信息已归档成功!', 'success', 'hey')
  }

  // activeName.value = "1"
}
/**
 * 图片删除功能
 */
const handleRemove = async (image: any, row: any) => {
  try {
    await $baseConfirm('确定要删除这张图片吗', '系统提示', async () => {
      const delImgForm = new FormData()
      delImgForm.append('type', '2')
      delImgForm.append('imageId', image.imageId)

      const { data } = await deleteImage(delImgForm)
      if (data === true) {
        // 删除成功后再更新UI
        const imageIndex = row.imageList.findIndex((item: any) => item.imageId === image.imageId)
        if (imageIndex !== -1) {
          row.imageList = [...row.imageList.slice(0, imageIndex), ...row.imageList.slice(imageIndex + 1)]
        }
        $baseMessage('此条产品图片信息删除成功!', 'success', 'hey')
      } else {
        $baseMessage('删除失败，请重试!', 'error', 'hey')
      }
    })
  } catch (error) {
    console.error('删除图片出错:', error)
    $baseMessage('删除出错，请重试!', 'error', 'hey')
  }
}

/**
 * 图片预览事件
 */
const handlePictureCardPreview = (image: any, row: any) => {
  dialogVisible.value = true
  // 重置并添加当前图片
  imagePreviewList.value = []
  imagePreviewList.value.push(image.imageUrl)

  // 添加其他图片
  row.imageList.forEach((item: any) => {
    if (item.imageId !== image.imageId) {
      imagePreviewList.value.push(item.imageUrl)
    }
  })
}
// 修改图片预览列表
const setPreviewList = (imageUrl: string) => {
  dialogVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(imageUrl)
  // console.log(imagePreviewList.value)
}

// 图片预览关闭事件
const imagePreviewClose = () => {
  dialogVisible.value = false
}
const imageUploadVisible = ref<boolean>(false)
// 打开上传图片弹窗
const showUploadDialog = (row: any, index: number) => {
  imageUploadVisible.value = true
  tableClickProgressId.value = row.progressId
  tableClickRowIndex.value = index
}

/**
 * 上传图片
 */
async function uploadImage(file: File) {
  try {
    const currentRow = progressList.value[tableClickRowIndex.value]
    // 确保 imageList 已初始化
    if (!currentRow.imageList) {
      currentRow.imageList = []
    }
    // sort 应该是当前数组长度（新图片会追加到最后）
    const sort = currentRow.imageList.length
    let imageForm = new FormData()

    imageForm.append('file', file)
    imageForm.append('progressId', tableClickProgressId.value.toString())
    imageForm.append('sort', sort.toString())

    const { data } = await uploadFile(imageForm)
    if (data) {
      const { fileId, url } = data
      // 根据 sort 值插入到正确位置，保持排序
      const newImage = {
        imageUrl: url,
        imageId: fileId,
      }
      // sort 值表示新图片应该插入的位置
      if (sort >= currentRow.imageList.length) {
        // 如果 sort 大于等于数组长度，追加到最后
        currentRow.imageList.push(newImage)
      } else {
        // 否则插入到指定位置
        currentRow.imageList.splice(sort, 0, newImage)
      }
      $baseMessage('图片上传成功!', 'success', 'hey')
      imageUploadVisible.value = false
    } else {
      $baseMessage('图片上传失败!', 'error', 'hey')
    }
  } catch (error) {
    console.error(error)
  }
}
// 移动之后触发修改排序接口
const sortDebounceMap = new Map<number, ReturnType<typeof debounce>>()

const onEnd = async (row: any, event?: { oldIndex?: number; newIndex?: number }) => {
  console.info('图片拖拽结束 onEnd 触发', {
    progressId: row?.progressId,
    oldIndex: event?.oldIndex,
    newIndex: event?.newIndex,
    imageList: row?.imageList,
    userNameList: queryForm.userNameList,
    status: queryForm.status,
  })

  if (event?.oldIndex === event?.newIndex) {
    console.info('图片排序未提交：拖拽位置未变化', {
      progressId: row?.progressId,
      oldIndex: event?.oldIndex,
      newIndex: event?.newIndex,
    })
    return
  }

  const progressId = row?.progressId
  if (!progressId) {
    console.warn('图片排序缺少 progressId，无法更新排序:', row)
    $baseMessage('图片排序更新失败：缺少进度ID', 'warning', 'hey')
    return
  }

  sortDebounceMap.get(progressId)?.cancel()
  await nextTick()

  const currentRow = progressList.value.find((item: any) => item.progressId === progressId) || row
  const imageList = Array.isArray(currentRow.imageList) ? currentRow.imageList : []
  const idList = imageList.map((item: any) => item.imageId).filter(Boolean)

  console.info('图片排序准备提交', {
    progressId,
    idList,
    imageList,
    currentRow,
    userNameList: queryForm.userNameList,
    status: queryForm.status,
  })

  if (idList.length < 2) {
    console.warn('图片排序未提交：有效图片数量不足', {
      progressId,
      imageList,
      idList,
    })
    $baseMessage('图片数量不足，无需更新排序', 'warning', 'hey')
    return
  }

  const debouncedSort = debounce(async () => {
    sortDebounceMap.delete(progressId)

    try {
      await updateProgressImgSort(idList)
      console.info('图片排序接口提交成功', {
        progressId,
        idList,
      })
      $baseMessage('图片排序更新成功', 'success', 'hey')
    } catch (error) {
      console.error('更新图片排序失败:', error)
      $baseMessage('更新图片排序失败，请稍后重试', 'error', 'hey')
    }
  }, 300)

  sortDebounceMap.set(progressId, debouncedSort)
  debouncedSort()
}
/**
 * 获取初始新品进度数据
 */
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getList(queryForm)
  // 立即显示数据，不阻塞渲染
  progressList.value = data.list
  total.value = data.total
  listLoading.value = false
}
let _row: any = null
const progressId = ref<number>(-1)
/**
 * 当点击时切换输入框，修改输入
 */
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
  if (column.label === '产品') {
    updateProductNameVisible.value = true
    updateForm.product = row.product
    updateForm.mainSearchTerms = row.mainSearchTerms
    _row = row
    return
  } else if (column.label === '调研报告链接') {
    researchReportLink.value = row.researchReportLink
    updateResearchReportLinkVisible.value = true
    _row = row
    return
  }
  // 保存当前编辑的行数据（用于后续操作）
  currentRow.value = row

  if (column.property == 'progressLog') {
    const { data } = await getProgressLog({ progressId: row.progressId })
    progressLogCopy.value = data
    wangEditorTitle.value = '编辑开发日志'
    classify.value = 'progressLog'
    progressId.value = row.progressId
    wangEditorLogVisible.value = !wangEditorLogVisible.value
  } else if (column.property == 'remark') {
    remarkCopy.value = row.remark
    wangEditorTitle.value = '编辑备注'
    classify.value = 'remark'
    progressId.value = row.progressId
    wangEditorRemarkVisible.value = !wangEditorRemarkVisible.value
  }
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
const handleCheckbox = async (value: any, row: any) => {
  // 通过 row 直接更新，不依赖索引
  row.oem = value
  await updateProgressManage(row)
}
const updateProductName = async () => {
  updateFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const { data } = await updateProgressManage({ ..._row, ...updateForm })
        if (data === true) {
          _row.product = updateForm.product
          _row.mainSearchTerms = updateForm.mainSearchTerms
          $baseMessage('产品名更新成功!', 'success', 'hey')
          updateProductNameVisible.value = false
        }
      } catch {
        $baseMessage('产品名更新失败!', 'error', 'hey')
      }
    }
  })
}
const updatePriority = async (row: any) => {
  await updateProgressManage(row)
}
/**
 * 输入失焦事件
 */
const clickCancel = async (event: any, value: any) => {
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
    // 执行失去焦点处理逻辑
    try {
      await updateProgressManage({ ...value })
    } catch {
      Object.assign(value, _row)
    }
  }
}

/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickLog = async (val: any) => {
  try {
    if (!currentRow.value || !currentRow.value.progressId) {
      $baseMessage('数据错误，请刷新页面重试', 'error', 'hey')
      return
    }
    // 更新保存的行数据
    currentRow.value.progressLog = val

    // 发送更新请求
    const { data } = await updateProgressLog({
      progressId: currentRow.value.progressId,
      progressLog: val,
    })
  } catch (error: any) {
    console.error('更新开发日志失败:', error)
  }
}

const clickRemark = async (val: any) => {
  try {
    if (!currentRow.value || !currentRow.value.progressId) {
      $baseMessage('数据错误，请刷新页面重试', 'error', 'hey')
      return
    }

    // 更新保存的行数据
    currentRow.value.remark = val

    // 发送更新请求
    const { data } = await updateProgressManage(currentRow.value)
  } catch (error: any) {
    console.error('更新备注失败:', error)
  }
}

/**
 * 当点击取消，确认时，子组件传递给父组件 false
 */
const clickLogBool = (val: any) => {
  wangEditorLogVisible.value = val
  // console.log('点击logbool执行了');
}
const clickRemarkBool = (val: any) => {
  wangEditorRemarkVisible.value = val
  // console.log('点击remarkbool执行了');
}
/**
 * 获取新品进度列表数据
 */
const queryData = () => {
  queryForm.pageNo = 1
  router.push({
    query: {
      ...route.query,
      pageNo: '1',
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}

// 防抖处理搜索输入，减少请求频率
const debouncedQueryData = debounce(() => {
  queryData()
}, 300)
/**
 * 分页大小的改变
 */
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  router.push({
    query: {
      ...route.query,
      pageNo: '1',
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
/**
 * 分页页数改变
 */
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
      ...route.query,
      pageNo: value,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
// 拿样与核算
const handleSampleCosting = (row: IProgress, button: number) => {
  router.push({
    path: '/newProductDevelopment/productProgressComponent',
    query: {
      title: '零件清单',
      progressId: row.progressId,
      product: `${row.product!} ${row.mainSearchTerms!}`,
      button: button,
    },
  })
}

// 样品进度
const getSampleProgress = async () => {
  sampleProgressDialog.value = true
}
// const getMoldProgress = async () => {
//   moldProgressDialog.value = true
// }

// // 开模申请
// const addProgressMold = async () => {
//   moldVisible.value = true
//   const { data } = await getProgressComponentList({ progressId: 6 })
//   componentOptions.value = data
// }
const handleComponentChange = async (value: any) => {
  if (value) {
    supplierDisabled.value = false
  } else if (!value) {
    supplierDisabled.value = true
  }
  const { data } = await getProgressSuppliserList({ componentId: value })
  supplierOptions.value = data
  const item = componentOptions.value.find((i: any) => i.id === value)
  form.value.componentName = item.label
}
const handleSupplierChange = (value: any) => {
  const item = supplierOptions.value.find((i: any) => i.id === value)
  form.value.supplierName = item.label
}
const handleCancle = () => {
  moldVisible.value = false
}
const handleSubmit = async () => {
  try {
    if (!currentRow.value || !currentRow.value.progressId) {
      $baseMessage('数据错误，请刷新页面重试', 'error', 'hey')
      return
    }

    const { data } = await updateProgressMoldAdd({
      ...form.value,
      progressId: currentRow.value.progressId,
      productName: currentRow.value.product,
    })
    if (data === true) {
      $baseMessage('开模申请信息提交成功!', 'success', 'hey')
    }
  } catch (error) {
    console.log(error)
    $baseMessage('开模申请提交失败，请重试', 'error', 'hey')
  }
  moldVisible.value = false
  form.value = {
    componentName: '',
    supplierName: '',
    progressId: null,
    productName: '',
    excludingTax: null,
    standardInvoice: null,
    specialInvoice: null,
    purchaseTotal: null,
    audit: '',
  }
}
const copyRow = ref<any>(null)
// 订大货申请
// 复制
const handleCopyProgress = (row: any) => {
  copyRow.value = row
  copyProgressVisible.value = true
}

// 确认复制进度
const handleConfirmCopyProgress = async () => {
  if (!copyRow.value) return

  try {
    const { data } = await copyProgress({
      progressId: copyRow.value.progressId,
      copyOption: copyOptions.value,
    })
    if (data === true) {
      $baseMessage(`复制成功！`, 'success', 'hey')
      fetchData()
      copyProgressVisible.value = false
      copyRow.value = null
    }
  } catch (error) {
    console.error('复制失败:', error)
    $baseMessage('复制失败，请重试', 'error')
  }
}
const handleCopyAchivedProgress = (row: any) => {
  copyRow.value = row
  copyProgressVisible.value = true
}

// 共享
const handleGetShareList = async (progressId: number) => {
  sharedVisible.value = true
  const { data } = await getProgressSharelist({ progressId })
  shareId.value = convertString(progressId)
  shareUserList.value = data
  // console.log('shareUserList.value', shareUserList.value)
}
/**
 * 共享操作
 */
const handlerSwitchChange = async (row: any) => {
  let type = 1

  if (row.share === true) {
    type = 0
  }
  const { data } = await updateProgressSharelist({
    progressId: parseInt(shareId.value),
    userId: row.userID,
    type: type,
  })

  if (data === true && type === 0) {
    $baseMessage(`已共享给${row.userName}成功！`, 'success', 'hey')
  }

  if (data === true && type === 1) {
    $baseMessage(`取消共享给${row.userName}成功！`, 'success', 'hey')
  }
}
// 获取参与人员列表
const handlePersonSelect = async () => {
  shareSelectVisible.value = true
  const { data } = await getProgressPersonList()
  // console.log(activeName.value);

  optionShare.value = data
  // 转换为树形数据
  treeShareData.value = convertToTreeData(data)
  // console.log(treeShareData.value)
}
const handleArchivedPersonselect = async () => {
  shareArchivedSelectVisible.value = true
  const { data } = await getProgressPersonList()

  optionArchivedShare.value = data
  // 转换为树形数据
  treeArchivedShareData.value = convertToTreeData(data)
}
// 确认筛选
const handleShareSelectConfirm = async () => {
  userNameList.value = []
  shareSelectVisible.value = false
  // console.log(shareSelect.value);
  shareSelect.value.forEach((item: any) => {
    const i = optionShare.value.find((option: any) => option.userID === item)
    userNameList.value.push(i.userName)
  })
  // console.log(userNameList.value);
  // console.log(shareSelect.value);
  // listLoading.value = true
  // if (shareSelect.value.length === 0) {
  //   // 如果没有筛选任何人
  //   fetchData()
  // } else {
  //   const { data } = await getProgressFilter({
  //     userNameList: userNameList.value,
  //     status: queryForm.status,
  //     pageNo: queryForm.pageNo,
  //     pageSize: queryForm.pageSize,
  //   })
  //   progressList.value = data.list
  //   total.value = data.total
  //   listLoading.value = false
  // }
  queryForm.userNameList = userNameList.value
  fetchData()
}
const handleArchivedShareSelectConfirm = async () => {
  userNameArchivedList.value = []
  shareArchivedSelectVisible.value = false
  // console.log(shareSelect.value);
  shareArchivedSelect.value.forEach((item: any) => {
    const i = optionArchivedShare.value.find((option: any) => option.userID === item)
    userNameArchivedList.value.push(i.userName)
  })

  // listLoading.value = true
  // if (shareArchivedSelect.value.length === 0) {
  //   // 如果没有筛选任何人
  //   fetchData()
  // } else {
  // const { data } = await getProgressFilter({
  //   userNameList: userNameArchivedList.value,
  //   status: queryForm.status,
  //   pageNo: queryForm.pageNo,
  //   pageSize: queryForm.pageSize,
  // })
  queryForm.userNameList = userNameArchivedList.value
  fetchData()
  // shareSelect.value = []
  // }
}
const updateSharedVisibleValue = (newValue: boolean) => {
  sharedVisible.value = newValue
}
// 查看新款评估
const handleGetEvaluationById = async (idNo: number) => {
  newEvaluationVisible.value = true
  const { data } = await getByIdQueryEvaluation({ idNo })
  newEvaluationData.value = [data]
}
const onDialogOpened = () => {
  evaluationTableRef.value?.doLayout()
}
const keyWordTrendCellClick = async (row: any, column: any) => {
  if (column.label === '关键词趋势') {
    inputKeyWord.value = row.amazonFrontendKeywords
    const { data } = await getEvaluationTrendList({ keyWord: inputKeyWord.value, type: 0 })
    if (data && data.xAxis && data.yAxis) {
      trendEcharts.value.xAxis = data.xAxis
      trendEcharts.value.yAxis = data.yAxis
    }
    keyWordTrendEchartsVisible.value = true
  }
}
const updateTrendVisibleValue = (newValue: boolean) => {
  keyWordTrendEchartsVisible.value = newValue
}
// 清除关键词趋势相关数据
const cleanKeyWordTrendData = (newValue: string) => {
  inputKeyWord.value = newValue
  trendEcharts.value.xAxis = []
  trendEcharts.value.yAxis = []
  keyWordTrendEchartsVisible.value = false
}
const updateTrendEchatsData = (newValue: IKeyWordTrend) => {
  trendEcharts.value = newValue
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  switch (label) {
    case '立项日期':
    case '参与人员': {
      return {
        textAlign: 'center',
        color: '#999',
        cursor: 'not-allowed',
      }
    }
    case '示例图片':
    case '产品':
    case '当前阶段': {
      return {
        cursor: 'pointer',
        textAlign: 'center',
      }
    }
    case '开发日志':
    case '备注':
    case '调研报告链接': {
      return {
        textAlign: 'left',
        cursor: 'pointer',
      }
    }
    case '目标月销': {
      return {
        textAlign: 'center',
        cursor: 'pointer',
      }
    }
    default: {
      return {
        textAlign: 'center',
      }
    }
  }
}
const cellStyle2 = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  switch (label) {
    case '立项日期':
    case '参与人员':
    case '当前阶段':
    case '产品':
    case '优先级': {
      return {
        textAlign: 'center',
        color: '#999',
        cursor: 'not-allowed',
      }
    }
    case '目标月销': {
      return {
        textAlign: 'center',
        color: '#999',
        cursor: 'not-allowed',
      }
    }
    case '示例图片':
    case '开发日志':
    case '备注':
    case '调研报告链接': {
      return {
        cursor: 'pointer',
        textAlign: 'left',
      }
    }
    default: {
      return {
        textAlign: 'center',
      }
    }
  }
}
onActivated(() => {
  tableRef.value?.doLayout()
})
onBeforeMount(() => {
  const { pageNo, pageSize, tab } = route.query
  if (pageNo) {
    queryForm.pageNo = Number(pageNo)
  }
  if (pageSize) {
    queryForm.pageSize = Number(pageSize)
  }
  if (tab) {
    queryForm.status = Number(tab)
    activeName.value = Number(tab)
  }
  fetchData()
})
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
          .el-form {
            .el-form-item:first-child {
              margin: 0 !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
            .el-form-item:last-child {
              margin: 0 !important;
            }
          }
        }

        .el-table {
          flex: 1;
        }
      }
    }
  }
}

// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}

// 控制编辑框显示与隐藏
.none {
  display: none !important;
}
.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
.ghost {
  background: #c8ebfb;
  opacity: 0.5;
}
// 开模申请
:deep(.moldDialog .el-dialog__body) {
  padding-top: 0;
}

:deep(.shareSelectDialog .el-dialog__body) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.overflow-text {
  display: block;
  max-height: 81.2px; /* 设置文本的最大高度 */
  overflow-y: auto; /* 溢出时显示垂直滚动条 */
}

.image-list {
  display: flex;
  gap: 8px;
  align-items: center;
}

.image-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 75px;

  .image-preview {
    position: relative;
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      cursor: move; // 添加拖拽指针
      object-fit: cover;
    }

    .image-actions {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0);
      opacity: 0;
      transition: all 0.3s;

      .el-icon {
        font-size: 20px;
        color: #fff;
        cursor: pointer;

        &:hover {
          transform: scale(1.1);
        }
      }
    }

    &:hover .image-actions {
      background: rgba(0, 0, 0, 0.45);
      opacity: 1;
    }
  }

  .upload-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);

    &:hover {
      border-color: var(--el-color-primary);
      .el-icon {
        color: var(--el-color-primary);
      }
    }

    .el-icon {
      font-size: 20px;
      color: #999;
    }
  }
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
:deep(.center-select) {
  text-align: center;
  text-align-last: center;
}
</style>
