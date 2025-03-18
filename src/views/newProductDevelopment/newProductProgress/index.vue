handleSubmit<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" :lazy="true" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="进行中" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel >
            <el-button type="primary" @click="getSampleProgress">样品进度</el-button>
            <el-button type="primary" @click="getMoldProgress">开模进度</el-button>
            <el-button type="primary" @click="handlePersonSelect">参与人员筛选</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.productKeyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"/>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <el-table 
          ref="tableRef" 
          v-loading="listLoading" 
          border :cell-style="cellStyle"
          :data="progressList"
          :header-cell-style="{ 'text-align': 'center' }" 
          stripe
          @cell-click="changeInput"
        >
          <el-table-column label="优先级" min-width="90" prop="priority">
            <template #default = "{ row }">
              <el-select v-model="row.priority" size="default" style="min-width: 100%" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)">
                <el-option 
                  v-for="item in priorityOptions" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column class="image-wall" label="示例图片" min-width="450" prop="imageList">
            <template #default = "{ row }">
              <vue-draggable
                v-model="row.imageList"
                :animation="150"
                ghost-class="ghost"
                target="ul"
                @end="onEnd"
              >
                <el-upload 
                  :class="{ hide: row.hide }" 
                  :file-list="row.imageList" 
                  :http-request="uploadImage" 
                  :limit="5"
                  list-type="picture-card"
                >
                  <div 
                    style="display: flex; align-items: center; justify-content: center; width: 75px; height: 75px; "
                    @click="handleIconClick(row)"
                  >
                    <el-icon ><plus /></el-icon>
                  </div>

                  <template #file="{ file }">
                    <div>
                      <img alt="" class="el-upload-list__item-thumbnail" :src="file.url" />
                      <span class="el-upload-list__item-actions">
                        <span
                          class="el-upload-list__item-preview"
                          @click="handlePictureCardPreview(file, row)"
                        >
                          <el-icon><zoom-in /></el-icon>
                        </span>
                        <span
                          v-if="!disabled"
                          class="el-upload-list__item-delete"
                          @click="handleRemove(file, row)"
                        >
                          <el-icon><delete /></el-icon>
                        </span>
                      </span>
                      {{ file.name }}
                    </div>
                  </template>
                </el-upload>
              </vue-draggable>
            </template>
          </el-table-column>
          <el-table-column label="产品" min-width="160" prop="product">
            <template #default = "{ row }">
              <div class="none">
                <el-input v-model="row.product" autofocus :autosize="{ minRows: 1, maxRows: 2 }" type="textarea" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span v-html="formattedProgressLog(row.product)"></span>
            </template>
          </el-table-column>
          <el-table-column label="OEM" min-width="65" prop="oem">
            <template #default = "{ row }">
               <el-checkbox v-model="row.oem" class="custom-checkbox" :false-value="'0'" size="large" :true-value="'1'" @change="handleCheckbox(row.oem)"/>
            </template>
          </el-table-column>
          <el-table-column label="立项日期" prop="createTime" width="120">
            <template #default = "{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="当前阶段" min-width="90" prop="currentPhaseStatus">
            <template #default = "{ row }">
              <div class="none">
                <el-input v-model="row.currentPhaseStatus" autofocus :autosize="{ minRows: 1, maxRows: 2 }" type="textarea" @blur="clickCancel($event, row)"  @keyup.enter="clickCancel($event, row)"/>
              </div>
              <span>{{ row.currentPhaseStatus }}</span>
            </template>
          </el-table-column>      
          <el-table-column label="开发日志" min-width="500" prop="progressLog">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.progressLog) }}</div>
                </template>
                <span>{{ removeHtmlTags(row.progressLog) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="参与人员" min-width="100" prop="sharerName">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" v-html="row.sharerName.replace(/,/g, '<br/>')"></div>
                </template>
                <span style="color: rgb(192, 192, 192, 1)" v-html="row.sharerName.replace(/,/g, '<br/>')"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.remark) }}</div>
                </template>
                <span>{{ removeHtmlTags(row.remark) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="目标月销" min-width="90" prop="targetMonthlySales">
            <template #default = "{ row }">
              <div class="none">
                  <el-input v-model="row.targetMonthlySales" type="text" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.targetMonthlySales }}</span>
            </template>
          </el-table-column>
          <el-table-column label="新款评估编号" prop="evaluationId" width="130" />

          <el-table-column :fixed="fixed" label="操作" min-width="180px">
            <template #default="{ row }">
              <el-dropdown>
                <el-button text type="primary" @click="handleSampleCosting(row)">
                  拿样与核算
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleSampleCosting(row)">
                      <el-link type="primary" :underline="false" >拿样与核算</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="addProgressMold">
                      <el-link type="primary" :underline="false" >开模申请</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleOrderProcess(row)">
                      <el-link type="primary" :underline="false" >订大货申请</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleCopyProgress(row)">
                      <el-link type="primary" :underline="false" >复制</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleGetShareList(row.progressId)">
                      <el-link type="primary" :underline="false" >共享</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleGetEvaluationById(row.evaluationId)">
                      <el-link type="primary" :underline="false" >查看新款评估</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleArchived(row.progressId)">
                      <el-link type="primary" :underline="false" >归档</el-link>
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
        <default-table-edit ref="editRef" @fetch-data="fetchData" />
      </el-tab-pane>
      <el-tab-pane label="已归档" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="handleArchivedPersonselect">参与人员筛选</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <div class="custom-table-right-tools">
              <el-form inline :model="queryForm" @submit.prevent>
                <el-form-item>
                  <el-input v-model.trim="queryForm.productKeyWord" clearable placeholder="请输入搜索关键词" @keyup.enter="queryData" />
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
          border :data="progressList"
          :header-cell-style="{ 'text-align': 'center' }" 
          stripe
          @cell-click="changeInput"
        >
          <el-table-column align="center" label="优先级" min-width="90" prop="priority">
            <template #default = "{ row }">
              <el-select v-model="row.priority" disabled size="default" style="min-width: 100%;" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)">
                <el-option 
                  v-for="item in priorityOptions" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column class="image-wall" label="示例图片" min-width="450" prop="imageList">
            <template #default = "{ row }">
              <vue-draggable
                v-model="row.imageList"
                :animation="150"
                disabled
                ghost-class="ghost"
                target="ul"
                @end="onEnd"
              >
                <el-upload 
                  :class="{ hide: row.hide }" 
                  disabled 
                  :file-list="row.imageList" 
                  :http-request="uploadImage"
                  :limit="5"
                  list-type="picture-card"
                >
                  <div 
                    style="display: flex; align-items: center; justify-content: center; width: 75px; height: 75px;"
                    @click="handleIconClick(row)"
                  >
                    <el-icon ><plus /></el-icon>
                  </div>

                  <template #file="{ file }">
                    <div>
                      <img alt="" class="el-upload-list__item-thumbnail" :src="file.url" />
                      <span class="el-upload-list__item-actions">
                        <span
                          class="el-upload-list__item-preview"
                          @click="handlePictureCardPreview(file, row)"
                        >
                          <el-icon><zoom-in /></el-icon>
                        </span>
                        <span
                          v-if="!disabled"
                          class="el-upload-list__item-delete"
                          @click="handleRemove(file, row)"
                        >
                          <el-icon><delete /></el-icon>
                        </span>
                      </span>
                      {{ file.name }}
                    </div>
                  </template>
                </el-upload>
              </vue-draggable>
            </template>
          </el-table-column>
          <el-table-column label="产品" min-width="160" prop="product">
            <template #default = "{ row }">
              <span v-html="formattedProgressLog(row.product)"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="OEM" min-width="60" prop="oem">
            <template #default = "{ row }">
               <el-checkbox v-model="row.oem" class="custom-checkbox" disabled :false-value="'0'" size="large" :true-value="'1'" @change="handleCheckbox(row.oem)"/>
            </template>
          </el-table-column>
          <el-table-column align="center" label="立项日期" min-width="100" prop="createTime">
            <template #default = "{ row }">
              <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="当前阶段" min-width="100" prop="currentPhaseStatus">
            <template #default = "{ row }">
              <span>{{ row.currentPhaseStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开发日志" min-width="500" prop="progressLog">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.progressLog) }}</div>
                </template>
                <span>{{ removeHtmlTags(row.progressLog) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="参与人员" min-width="100" prop="sharerName">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div style="white-space: pre-wrap;" v-html="row.sharerName.replace(/,/g, '<br/>')"></div>
                </template>
                <span style="color: rgb(192, 192, 192, 1)" v-html="row.sharerName.replace(/,/g, '<br/>')"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.remark) }}</div>
                </template>
                <span>{{ removeHtmlTags(row.remark) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="目标月销" min-width="85" prop="targetMonthlySales">
            <template #default = "{ row }">
              <span>{{ row.targetMonthlySales }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="新款评估编号" min-width="110" prop="evaluationId">
            <template #default = "{ row }">
              <span style="color: rgb(192, 192, 192, 1)">{{ row.evaluationId }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :fixed="fixed" label="操作" min-width="100px">
            <template #default="{ row }">
              <el-button text type="primary" @click="handleCopyAchivedProgress(row)">
                复制
              </el-button>
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
        <default-table-edit ref="editRef" @fetch-data="fetchData" />
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer v-if ="dialogVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose"/>
    <wang-editor
      :classify="classify"
      :content="progressLogCopy"
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorLogVisible"
      @click-boolean="clickLogBool"
      @click-child="clickLog"
    />
    <wang-editor
      :classify="classify"
      :content="remarkCopy"
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorRemarkVisible"
      @click-boolean="clickRemarkBool"
      @click-child="clickRemark"
    />
    <!-- 共享 -->
    <vab-shared  
      :id = "shareId"
      :fetch-data="fetchData"
      :handler-switch-change="handlerSwitchChange"
      :list="shareUserList"
      :visible="sharedVisible"
      @update:shared-visible = "updateSharedVisibleValue"
    />
    
    <!-- 开模申请 -->
    <vab-dialog 
      v-model="moldVisible" 
      :before-close="handlerCloseDialog" 
      class="moldDialog"
      title="开模申请"
      width="500"
    >
      <el-divider style="margin-top: 0;"/>
      <el-form ref="formRef" class="demo-form" label-position="right" label-width="120px" :model="form" style="max-width: 340px; margin: 0 auto;">
        <el-form-item label="零件名" prop="componentName">
          <el-select v-model="form.componentName" clearable placeholder="" @change="handleComponentChange">
            <el-option 
              v-for="item in componentOptions" 
              :key="item.id" 
              :label="item.label" 
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商全名" prop="supplierName">
          <el-select v-model="form.supplierName" clearable :disabled="supplierDisabled" placeholder="" @change="handleSupplierChange">
            <el-option 
              v-for="item in supplierOptions" 
              :key="item.id" 
              :label="item.label" 
              :value="item.id"
            />
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
            <el-option label="王豪俊" value="王豪俊"/>
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
    <mold-progress 
      :mold-progress-visible="moldProgressDialog"
      @update:mold-progress-visible="moldProgressDialog = $event"
    />
    <!-- 新款评估 -->
    <vab-dialog 
      v-model="newEvaluationVisible" 
      :before-close="handlerEvaluationCloseDialog" 
      class="moldDialog"
      title="新款评估"
      width="90%"
      @opened="onDialogOpened"
    >
      <el-divider style="margin-top: 0; margin-bottom: 20px"/>
      <div id="table-height-container">
        <el-table 
          ref="evaluationTableRef" 
          v-loading="listLoading" 
          border :data="newEvaluationData" 
          :header-cell-style="{ 'text-align': 'center' }" 
          stripe
          @cell-click="keyWordTrendCellClick"
        >
          <el-table-column
v-for="(item, index) in indexColumns" :key="index" align="center" :label="item.label"
              :min-width="item.minWidth || 100" :prop="item.prop" width="auto">
            <template #default="{ row }">
              <div  v-if="item.label === '关键词趋势'" style="width: 80px; height: 63px;">
                <vab-echarts-chart-bar :x-axis-data="row.trendList.xAxis" :y-axis-data="row.trendList.yAxis" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer></template>
    </vab-dialog>
    <!-- 参与人员筛选 -->
    <vab-dialog 
      v-model="shareSelectVisible" 
      :before-close="handleShareSelectClose" 
      title="参与人员筛选"
      width="480"
    >
      <el-form style="margin: 0">
        <el-form-item label="参与人员列表">
          <el-select 
            v-model="shareSelect" 
            clearable 
            collapse-tags  
            collapse-tags-tooltip
            multiple
            placeholder="请选择参与人员"
          >
            <el-option v-for="item in optionShare" :key="item.userID" :label="item.userName" :value="item.userID" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleShareSelectConfirm">筛选</el-button>
      </template>
    </vab-dialog>
    <!-- 参与人员筛选 -->
    <vab-dialog 
      v-model="shareArchivedSelectVisible" 
      :before-close="handleArchivedShareSelectClose" 
      title="参与人员筛选"
      width="480"
    >
      <el-form style="margin: 0">
        <el-form-item label="参与人员列表">
          <el-select 
            v-model="shareArchivedSelect" 
            clearable 
            collapse-tags  
            collapse-tags-tooltip
            multiple
            placeholder="请选择参与人员"
          >
            <el-option v-for="item in optionArchivedShare" :key="item.userID" :label="item.userName" :value="item.userID" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleArchivedShareSelectConfirm">筛选</el-button>
      </template>
    </vab-dialog>
    <!-- 关键词趋势图表 -->
    <vab-trend 
      :key-word = "inputKeyWord"
      :trend-data = "trendEcahts"
      :trend-echarts-visible="keyWordTrendEchatsVisible"
      @update:clear-input-key-word = "cleanKeyWordTrendData"
      @update:trend-echarts-list  = "updateTrendEchatsData"
      @update:visible-value = "updateTrendVisibleValue"
    />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Delete, Plus, Search, ZoomIn } from '@element-plus/icons-vue'
import type { TableInstance, TabsPaneContext, UploadFile } from 'element-plus'
import { isEqual } from 'lodash'
import debounce from 'lodash/debounce'
import type { CSSProperties } from 'vue'
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useRoute } from 'vue-router'
import { indexColumns } from './indexColumns'
import moldProgress from './moldProgress.vue'
import sampleProgress from './sampleProgress.vue'
import wangEditor from './wangEditor.vue'
import {
copyProgress,
deleteImage,
getByIdQueryEvaluation,
getList,
getProgressComponentList,
getProgressFilter,
getProgressLog,
getProgressPersonList,
getProgressSharelist,
getProgressSuppliserList,
updateProgressArchive,
updateProgressImgSort,
updateProgressManage,
updateProgressMoldAdd,
updateProgressSharelist,
uploadFile
} from '/@/api/devlocal/progress'
import { useTabStateStore } from '/@/store/modules/tabsState'
import type { IKeyWordTrend } from '/@/type/evaluation/evaluationType'
import type { IGetByIdQueryEvaluation, IProgress, IProgressQueryReq, IProgressShared, ISelectShare } from '/@/type/progress/progressType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { convertString } from '/@/utils/stringUtils'
import { removeHtmlTags } from '/@/utils/tableColum'

defineOptions({
  name: 'ProgressTable',
})

const route = useRoute()
const tabStateStore = useTabStateStore()
const activeName = ref<number>(tabStateStore.getTabState(route.path, 0))
const router = useRouter()

const editRef = ref<any>(null)
const fixed = ref<string>('right')
const tableRef = ref<TableInstance>()
const evaluationTableRef = ref<TableInstance>()
// 表格加载loading状态
const listLoading = ref<boolean>(true)
// 新品进度列表
let progressList = ref<IProgress[]>([])
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
})

const priorityOptions = [
  { 
    value: "0",
    label: '高',
  },
  { 
    value: "1",
    label: '中',
  },
  { 
    value: "2",
    label: '低',
  },
]

// 图片
const dialogImageUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
const disabled = ref(false)
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
  productName: "",
  excludingTax: null,
  standardInvoice: null,
  specialInvoice: null,
  purchaseTotal: null,
  audit: ""
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
const keyWordTrendEchatsVisible = ref<boolean>(false)
// 图表
const trendEcahts = ref<IKeyWordTrend>({
  xAxis:[],
  yAxis:[]
})
// 输入的关键词
const inputKeyWord = ref<string>('')
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

const userNameList = ref<string[]>([])
const userNameArchivedList = ref<string[]>([])
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
  progressList.value=[]
  if (tab.props.name === '0')  queryForm.status = 0
  else queryForm.status = 1
  tabStateStore.setTabState(route.path, Number(tab.props.name));
  fetchData()
}
// 处理已归档
const handleArchived = async (progressId: number) => {
  const { data } = await updateProgressArchive({ progressId })
  if (data === true) {
    const index = progressList.value.findIndex((item: any) => item.progressId === progressId)
    progressList.value.splice(index, 1)
    $baseMessage("此条新品进度信息已归档成功!","success","hey")
  }
  
  // activeName.value = "1"
}
/**
 * 图片删除功能
 */
const handleRemove = async (file: UploadFile, row: any) => {
  try {
    $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{

      const imageListCopy = [...row.imageList];

      // 找到要删除的元素的下标
      const i = imageListCopy.findIndex((item: any) => item.url === file.url);

      if (i === -1) {
        $baseMessage("错误，请联系开发人员!","error","hey")
        return
      }

      // 从复制的数组中移除该元素
      imageListCopy.splice(i, 1);
      // 将更新后的数组替换原来的 imageList
      row.imageList = imageListCopy;
      if (row.imageList.length <= 5) {
        row.hide = false
      }
      const delImgForm = new FormData()
      delImgForm.append('type', '2')
      delImgForm.append('imageId', file.name)

      const { data } = await deleteImage(delImgForm)
      if (data == true) {
        $baseMessage("此条产品图片信息删除成功!","success","hey")
      }
})
    
  } catch (error) {
    console.error(error)
  }
}

/**
 * 图片预览事件
 */
const handlePictureCardPreview = (file: UploadFile, row: any) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
  imagePreviewList.value = []
  const i = row.imageList.find((item: any) => item.uid === file.uid)
  imagePreviewList.value.push(file.url!)
  row.imageList.forEach((item: any) => {
    if (item.uid === i.uid) return
    imagePreviewList.value.push(item.url)
  })
}
// 修改图片预览列表
const setPreviewList = (imageUrl:string) =>{
    dialogVisible.value = true
    imagePreviewList.value = []
    imagePreviewList.value.push(imageUrl)
    // console.log(imagePreviewList.value)
}

// 图片预览关闭事件
const imagePreviewClose = () =>{
  dialogVisible.value = false;
}
/**
 * 点击添加图标事件
 */
const handleIconClick = (row: any) => {
  tableClickProgressId.value = row.progressId
  tableClickRowIndex.value = progressList.value.findIndex(item => item.progressId == row.progressId) as any
  // console.log('点击行的下标', tableClickRowIndex.value);
}


/**
 * 上传图片
 */
const imageForm = ref(new FormData()) as any;
async function uploadImage (params: any) {
  try {
    let imgListlength = progressList.value[tableClickRowIndex.value].imageList!.length + 1
    if (imgListlength === 5) {
      // isUpdate.value = !isUpdate.value
      progressList.value[tableClickRowIndex.value].hide = true
    }
    let sort = progressList.value[tableClickRowIndex.value].imageList!.length - 1
    imageForm.value = new FormData(); // 每次上传前重置 FormData
    imageForm.value.append('file', params.file);
    imageForm.value.append('progressId', tableClickProgressId.value);
    imageForm.value.append('sort', sort);

    const { data } = await uploadFile(imageForm.value)
    const { fileId, url } = data
    const imageListCopy = [...progressList.value[tableClickRowIndex.value].imageList!];
    imageListCopy.push({
        url,
        name: fileId,
    });
    let newArray = [...progressList.value]
    newArray[tableClickRowIndex.value].imageList  = imageListCopy;
    progressList.value = JSON.parse(JSON.stringify(newArray))
    if (imgListlength === 5) {
      progressList.value[tableClickRowIndex.value].hide = true
    }
    
  } catch (error) {
    console.error(error)
  }
}
const dlist = ref<any>([])
// 移动之后触发修改排序接口
const onEnd = debounce(async () => {
    try {
        dlist.value = progressList.value[tableClickRowIndex.value].imageList
        // console.log(dlist.value)
        const idList = dlist.value.map((item: any) =>{
            return item.name
        })
        await updateProgressImgSort(idList)
    }catch(error){
        console.error(error as Error)
    }
}, 500)
/**
 * 获取初始新品进度数据
 */
const fetchData = async () => {
  listLoading.value = true
  // console.log(queryForm)
  const { data } = await getList(queryForm)
  progressList.value = data.list
  total.value = data.total
  listLoading.value = false

  progressList.value.forEach(item => {
    const tempArr: string[] = []
    item.imageList!.forEach(image => {
      tempArr.push(image.imageUrl!)
      image.url = image.imageUrl;
      image.name = image.imageId;
      delete image.imageUrl;
      delete image.imageId;
    })
    
    if(tempArr.length === 5){
      item.hide = true
    } else {
      item.hide = false
    }
  })
}
let _row: any = null
/**
 * 当点击时切换输入框，修改输入
 */
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => { 
  
  // 获取行的下标
  tableClickIdx.value = progressList.value.indexOf(row)
  if (column.property == 'progressLog') {
    const { data } = await getProgressLog({ progressId: row.progressId })
    // progressLogCopy.value = progressList.value[tableClickIdx.value].progressLog
    progressLogCopy.value = data
    wangEditorTitle.value = '编辑开发日志'
    classify.value = 'progressLog'
    wangEditorLogVisible.value = !wangEditorLogVisible.value
  } else if (column.property == 'remark'){
    remarkCopy.value = progressList.value[tableClickIdx.value].remark
    wangEditorTitle.value = '编辑备注'
    classify.value = 'remark'
    wangEditorRemarkVisible.value = !wangEditorRemarkVisible.value
  }
  const firstChild = cell?.children[0]?.children[0];
  const secondChild = cell?.children[0]?.children[1];

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return;
  }

  _row = JSON.parse(JSON.stringify(row));

  if (firstChild.classList.contains('none')) {
    
    
    firstChild.classList.remove('none');
    secondChild.classList.add('none');
    
    focusAndSelectInput(cell);
  }
  
}
const handleCheckbox = async (value: any) => {
  // console.log(value);
  // console.log(tableClickIdx.value)
  progressList.value[tableClickIdx.value].oem = value
  await updateProgressManage(progressList.value[tableClickIdx.value])
}
/**
 * 输入失焦事件
 */
const clickCancel = async (event: any, value: any) =>{

  const rootElement = getRootElement(event.srcElement, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }
  if (isEqual(_row, value)) {
    return
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    await updateProgressManage({...value})
  }
}

/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickLog = async (val: any) => {
  // console.log('新的val', val);
  
  progressList.value[tableClickIdx.value].progressLog = val
  progressLogCopy.value = val
  // console.log('点击log执行了');
  await updateProgressManage(progressList.value[tableClickIdx.value]) //发送更新数据请求
}
const clickRemark = async (val: any) => {
  progressList.value[tableClickIdx.value].remark = val
  remarkCopy.value = val
  // console.log('点击remark执行了');
  await updateProgressManage(progressList.value[tableClickIdx.value]) //发送更新数据请求
}

/**
 * 当点击取消，确认时，子组件传递给父组件 false
 */
const clickLogBool = ( val: any) => {
  wangEditorLogVisible.value = val
  // console.log('点击logbool执行了');
}
const clickRemarkBool = ( val: any) => {
  wangEditorRemarkVisible.value = val
  // console.log('点击remarkbool执行了');
}
/**
 * 获取新品进度列表数据
 */
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const formattedProgressLog = (str: string) => {
  return str
    .replaceAll(/([\u4e00-\u9fa5]) ([A-Za-z])/g, '$1<br>$2')
    .replaceAll(/([A-Za-z]) ([\u4e00-\u9fa5])/g, '$1<br>$2');
};
/**
 * 分页大小的改变
 */
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

/**
 * 分页页数改变
 */
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}


// 拿样与核算
const handleSampleCosting = (row: IProgress) =>{
  router.push({
    path: '/newProductDevelopment/productProgressComponent',
    query: {
      title: "零件清单",
      progressId: row.progressId,
      product: row.product,
    },
  })
}
// 订大货
const handleOrderProcess = (row: IProgress) =>{
  router.push({
    path: '/newProductDevelopment/orderingProcess',
    query: {
      progressId: row.progressId,
    },
  })
}
// 样品进度
const getSampleProgress = async () => {
  sampleProgressDialog.value = true
}
const getMoldProgress = async () => {
  moldProgressDialog.value = true
}

// 开模申请
const addProgressMold = async () => {
  moldVisible.value = true
  const { data } = await getProgressComponentList({ progressId: 6 })
  componentOptions.value = data
}
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
    const { data } = await updateProgressMoldAdd({
      ...form.value,
      progressId: progressList.value[tableClickIdx.value].progressId,
      productName: progressList.value[tableClickIdx.value].product,
    })
    if (data === true) {
      $baseMessage("开模申请信息提交成功!","success","hey")
    }
  } catch (error) {
    console.log(error)
  }
  moldVisible.value = false
  form.value = {
    componentName: '',
    supplierName: '',
    progressId: null,
    productName: "",
    excludingTax: null,
    standardInvoice: null,
    specialInvoice: null,
    purchaseTotal: null,
    audit: ""
  }
}
const copyRow = ref<any>(null)
// 订大货申请
// 复制
const handleCopyProgress = (row: any) => {
  $baseConfirm('是否要复制本条新品进度信息？', '复制', async () => {
    const { data } = await copyProgress({ progressId: row.progressId })
    if (data === true) {
      copyRow.value = JSON.parse(JSON.stringify(row))
      const index = progressList.value.indexOf(row)
      progressList.value.splice(index + 1, 0, copyRow.value)
      $baseMessage(`复制成功！`, "success", "hey")
    }
  }, null)
}
const handleCopyAchivedProgress = (row: any) => {
  $baseConfirm('是否要复制本条新品进度信息？', '复制', async () => {
    const { data } = await copyProgress({ progressId: row.progressId })
    if (data === true) {
      $baseMessage(`复制成功！`, "success", "hey")
    }
  }, null)
}

// 共享
const handleGetShareList = async (progressId: number) => {
  sharedVisible.value = true
  const { data } = await getProgressSharelist({ progressId })
  shareId.value = convertString(progressId)
  shareUserList.value = data
  console.log('shareUserList.value', shareUserList.value)
}
/**
   * 共享操作
   */
   const handlerSwitchChange = async (row: any) => {
    let type = 1;
  
    if (row.share === true) {
      type = 0
    }
    const { data } = await updateProgressSharelist({
      progressId: parseInt(shareId.value),
      userId: row.userID,
      type: convertString(type)
    })
  
    if (data === true && type === 0) {
      $baseMessage(`已共享给${row.userName}成功！`, "success", "hey")
    }
  
    if (data === true && type === 1) {
      $baseMessage(`取消共享给${row.userName}成功！`, "success", "hey")
    }
  }
// 获取参与人员列表
const handlePersonSelect = async () => {
  shareSelectVisible.value = true
  const { data } = await getProgressPersonList()
  // console.log(activeName.value);

  optionShare.value = data
}
const handleArchivedPersonselect = async () => {
  shareArchivedSelectVisible.value = true
  const { data } = await getProgressPersonList()

  optionArchivedShare.value = data
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
  listLoading.value = true
  if (shareSelect.value.length === 0) { // 如果没有筛选任何人
    fetchData()
  } else {
    const { data } = await getProgressFilter({
    userNameList: userNameList.value, 
    status: queryForm.status,
    pageNo: queryForm.pageNo,
    pageSize: queryForm.pageSize,
  })
  progressList.value = data.list
  total.value = data.total
  listLoading.value = false

  progressList.value.forEach(item => {
    const tempArr: string[] = []
    item.imageList!.forEach(image => {
      tempArr.push(image.imageUrl!)
      image.url = image.imageUrl;
      image.name = image.imageId;
      delete image.imageUrl;
      delete image.imageId;
    })
    
    if(tempArr.length === 5){
      item.hide = true
    } else {
      item.hide = false
    }
  })
  // shareSelect.value = []
  }
}
const handleArchivedShareSelectConfirm = async () => {
  userNameArchivedList.value = []
  shareArchivedSelectVisible.value = false
  // console.log(shareSelect.value);
  shareArchivedSelect.value.forEach((item: any) => {
    const i = optionArchivedShare.value.find((option: any) => option.userID === item)
    userNameArchivedList.value.push(i.userName)
  })
  
  listLoading.value = true
  if (shareArchivedSelect.value.length === 0) { // 如果没有筛选任何人
    fetchData()
  } else {
    const { data } = await getProgressFilter({
    userNameList: userNameArchivedList.value, 
    status: queryForm.status,
    pageNo: queryForm.pageNo,
    pageSize: queryForm.pageSize,
  })
  progressList.value = data.list
  total.value = data.total
  listLoading.value = false

  progressList.value.forEach(item => {
    const tempArr: string[] = []
    item.imageList!.forEach(image => {
      tempArr.push(image.imageUrl!)
      image.url = image.imageUrl;
      image.name = image.imageId;
      delete image.imageUrl;
      delete image.imageId;
    })
    
    if(tempArr.length === 5){
      item.hide = true
    } else {
      item.hide = false
    }
  })
  // shareSelect.value = []
  }
}
const updateSharedVisibleValue = (newValue:boolean) =>{
  sharedVisible.value = newValue
}
// 查看新款评估
const handleGetEvaluationById = async (idNo: number) => {
  newEvaluationVisible.value = true
  const { data } = await getByIdQueryEvaluation({ idNo })
  newEvaluationData.value = [data];
}
const onDialogOpened = () => {
  evaluationTableRef.value?.doLayout();
};
const keyWordTrendCellClick = async(row: any, column: any) => {
  if (column.label === "关键词趋势") {
    inputKeyWord.value = row.amazonFrontendKeywords
    trendEcahts.value.xAxis = row.trendList.xAxis
    trendEcahts.value.yAxis = row.trendList.yAxis
    keyWordTrendEchatsVisible.value = true
  }
}
const updateTrendVisibleValue = (newValue:boolean) =>{
  keyWordTrendEchatsVisible.value = newValue
}
// 清除关键词趋势相关数据
const cleanKeyWordTrendData = (newValue:string) => {
  inputKeyWord.value = newValue
  trendEcahts.value.xAxis = []
  trendEcahts.value.yAxis = []
  keyWordTrendEchatsVisible.value = false
}
const updateTrendEchatsData = (newValue: IKeyWordTrend) => {
  trendEcahts.value = newValue
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const index = data.columnIndex
  if (index === 4 || index === 7 || index === 10) {
    return {
      textAlign: 'center',
      color: '#999',
      cursor: 'not-allowed'
    }
  } else if (index === 1 || index === 2 || index === 6 || index === 8) {
    return {
      textAlign: 'left'
    }
  } else {
    return {
      textAlign: 'center'
    }
  }
}
onActivated(() => { 
  tableRef.value?.doLayout()
})
onBeforeMount(() => {
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

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 75px;
  height: 75px;
  margin: 0 8px 0 0;
  transition: none;
}
:deep(.el-upload--picture-card) {
  width: 75px;
  height: 75px;
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}


// 控制添加图片图标显示与隐藏
.hide :deep(.el-upload--picture-card) {
  display: none
}
// 控制编辑框显示与隐藏
.none {
  display: none;
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
// .overflow-text {
//   max-height: 60px;
//   display: block;
//   overflow-y: auto;
// }
// .shareSelectDialog {
//   .el-dialog__body {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//   }
// }
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
.custom-tooltip {
  max-width: 400px; 
  font-size: var(--el-font-size-base);
  white-space: pre-wrap; 
}
</style>
