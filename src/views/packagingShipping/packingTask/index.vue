<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" :lazy="true" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="全部" :name="7">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item>
                <el-button type="primary">工作量预估</el-button>
              </el-form-item>
              <el-form-item label="站点" prop="site">
                <el-select v-model="allTaskForm.site" clearable placeholder="全部" @change="queryAllTaskData">
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="订货日期" prop="releaseDate">
                <el-date-picker
                  v-model="allTaskForm.releaseDate"
                  clearable
                  end-placeholder="结束日期"
                  range-separator="至"
                  start-placeholder="开始日期"
                  type="daterange"
                  @change="queryAllTaskData"
                />
              </el-form-item>
            </el-form>
            <div class="summary-info">
              <el-statistic class="compact-statistic" title="任务总数" :value="totalTaskNumber" />
            </div>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="allTaskForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="allTaskForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryAllTaskData"
                  @keyup.enter="queryAllTaskData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryAllTaskData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <packing-task-table
          :cell-style="cellStyle"
          :columns="allTaskColumns"
          :data="allTaskList"
          :header-cell-style="headerCellStyle"
          :loading="listLoading"
          :row-class-name="tableRowClassName"
          @cell-click="changeInput"
          @delete-task="handleDeleteTask"
          @get-package-code-path="getPackageCodePath"
          @image-preview="showPreviewImage"
          @quality-check-change="handleShowPackingCount"
          @row-click="handleRowClick"
          @selection-change="setSelectRows"
          @show-barcode="showBarcode"
          @show-modify="handleShowModify"
          @show-modify-task="handleShowModifyTask"
          @show-new-inspection-report="showNewInspectionReport"
          @show-parts-list="handleShowPartsList"
          @show-quality-inspection-report="handleShowQualityInspectionReport"
          @show-split-task="showSplitTask"
        />
        <vab-pagination
          :current-page="allTaskForm.pageNo"
          :page-size="allTaskForm.pageSize"
          :total="allTaskTotal"
          @current-change="handleAllTaskCurrentChange"
          @size-change="handleAllTaskSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="待打包" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item>
                <el-button
                  v-permissions="{ permission: [PackingTaskPermission.PACKING_TASK_START] }"
                  type="primary"
                  @click="handleShowStartTask"
                >
                  开始任务
                </el-button>
                <el-button
                  v-permissions="{ permission: [PackingTaskPermission.PACKING_TASK_GET_OFF_WORK] }"
                  type="primary"
                  @click="handleShowGetOffWork"
                >
                  下班
                </el-button>
                <el-button type="primary">工作量预估</el-button>
                <!-- <el-button type="warning" @click="handleOpenTest">测试模拟打卡</el-button> -->
              </el-form-item>
              <el-form-item label="站点" prop="site">
                <el-select v-model="queryForm.site" clearable placeholder="全部" @change="queryData">
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-form>
            <div class="summary-info">
              <el-statistic class="compact-statistic" title="任务总数" :value="totalTaskNumber" />
            </div>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <packing-task-table
          :cell-style="cellStyle"
          :columns="pendingPackColumns"
          :data="list"
          :header-cell-style="headerCellStyle"
          :loading="listLoading"
          :row-class-name="tableRowClassName"
          @cell-click="changeInput"
          @delete-task="handleDeleteTask"
          @get-package-code-path="getPackageCodePath"
          @image-preview="showPreviewImage"
          @quality-check-change="handleShowPackingCount"
          @row-click="handleRowClick"
          @selection-change="setSelectRows"
          @show-barcode="showBarcode"
          @show-modify="handleShowModify"
          @show-modify-task="handleShowModifyTask"
          @show-new-inspection-report="showNewInspectionReport"
          @show-parts-list="handleShowPartsList"
          @show-quality-inspection-report="handleShowQualityInspectionReport"
          @show-split-task="showSplitTask"
        />
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="进行中" :name="5">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item>
                <el-button
                  v-permissions="{ permission: [PackingTaskPermission.PACKING_TASK_START] }"
                  type="primary"
                  @click="handleShowStartTask"
                >
                  开始任务
                </el-button>
                <el-button
                  v-permissions="{ permission: [PackingTaskPermission.PACKING_TASK_ADD_PERSON] }"
                  type="primary"
                  @click="handleShowCurrentTask"
                >
                  当前任务加人
                </el-button>
                <el-button
                  v-permissions="{ permission: [PackingTaskPermission.PACKING_TASK_END] }"
                  type="primary"
                  @click="handleShowFinishTask"
                >
                  结束任务
                </el-button>
                <el-button
                  v-permissions="{ permission: [PackingTaskPermission.PACKING_TASK_GET_OFF_WORK] }"
                  type="primary"
                  @click="handleShowGetOffWork"
                >
                  下班
                </el-button>
                <el-button type="primary">工作量预估</el-button>
              </el-form-item>
              <el-form-item label="站点" prop="site">
                <el-select v-model="taskingForm.site" clearable placeholder="全部" @change="queryTaskingData">
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-form>
            <div class="summary-info">
              <el-statistic class="compact-statistic" title="任务总数" :value="totalTaskNumber" />
            </div>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="taskingForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="taskingForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryTaskingData"
                  @keyup.enter="queryTaskingData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryTaskingData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <packing-task-table
          :cell-style="cellStyle"
          :columns="taskingColumns"
          :data="taskingList"
          :header-cell-style="headerCellStyle"
          :loading="listLoading"
          :row-class-name="tableRowClassName"
          @cell-click="changeInput"
          @delete-task="handleDeleteTask"
          @get-package-code-path="getPackageCodePath"
          @image-preview="showPreviewImage"
          @row-click="handleRowClick"
          @selection-change="setSelectRows"
          @show-barcode="showBarcode"
          @show-modify="handleShowModify"
          @show-modify-task="handleShowModifyTask"
          @show-new-inspection-report="showNewInspectionReport"
          @show-parts-list="handleShowPartsList"
          @show-quality-inspection-report="handleShowQualityInspectionReport"
          @show-split-task="showSplitTask"
        />
        <vab-pagination
          :current-page="taskingForm.pageNo"
          :page-size="taskingForm.pageSize"
          :total="taskingTotal"
          @current-change="handleTaskingCurrentChange"
          @size-change="handleTaskingSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="已完成" :name="2">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item>
                <el-button
                  v-permissions="{ permission: [PackingTaskPermission.PACKING_TASK_START] }"
                  type="primary"
                  @click="handleShowStartTask"
                >
                  开始任务
                </el-button>
                <el-button
                  v-permissions="{ permission: [PackingTaskPermission.PACKING_TASK_GET_OFF_WORK] }"
                  type="primary"
                  @click="handleShowGetOffWork"
                >
                  下班
                </el-button>
                <el-button type="primary">工作量预估</el-button>
              </el-form-item>
              <el-form-item label="站点" prop="site">
                <el-select v-model="queryForm.site" clearable placeholder="全部" @change="queryData">
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-form>
            <div class="summary-info">
              <el-statistic class="compact-statistic" title="任务总数" :value="totalTaskNumber" />
            </div>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <packing-task-table
          :cell-style="cellStyle"
          :columns="completedColumns"
          :data="list"
          :header-cell-style="headerCellStyle"
          :loading="listLoading"
          :row-class-name="tableRowClassName"
          @cell-click="changeInput"
          @delete-task="handleDeleteTask"
          @get-package-code-path="getPackageCodePath"
          @image-preview="showPreviewImage"
          @row-click="handleRowClick"
          @selection-change="setSelectRows"
          @show-barcode="showBarcode"
          @show-modify="handleShowModify"
          @show-modify-task="handleShowModifyTask"
          @show-new-inspection-report="showNewInspectionReport"
          @show-parts-list="handleShowPartsList"
          @show-quality-inspection-report="handleShowQualityInspectionReport"
          @show-split-task="showSplitTask"
        />
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="零头" :name="3">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item>
                <el-button
                  v-permissions="{ permission: [PackingTaskPermission.PACKING_TASK_START] }"
                  type="primary"
                  @click="handleShowStartTask"
                >
                  开始任务
                </el-button>
                <el-button
                  v-permissions="{ permission: [PackingTaskPermission.PACKING_TASK_GET_OFF_WORK] }"
                  type="primary"
                  @click="handleShowGetOffWork"
                >
                  下班
                </el-button>
                <el-button type="primary">工作量预估</el-button>
              </el-form-item>
              <el-form-item label="站点" prop="site">
                <el-select v-model="queryForm.site" clearable placeholder="全部" @change="queryData">
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-form>
            <div class="summary-info">
              <el-statistic class="compact-statistic" title="任务总数" :value="totalTaskNumber" />
            </div>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <packing-task-table
          :cell-style="cellStyle"
          :columns="remainderColumns"
          :data="list"
          :header-cell-style="headerCellStyle"
          :loading="listLoading"
          :row-class-name="tableRowClassName"
          @cell-click="changeInput"
          @delete-task="handleDeleteTask"
          @get-package-code-path="getPackageCodePath"
          @image-preview="showPreviewImage"
          @row-click="handleRowClick"
          @selection-change="setSelectRows"
          @show-barcode="showBarcode"
          @show-modify="handleShowModify"
          @show-modify-task="handleShowModifyTask"
          @show-new-inspection-report="showNewInspectionReport"
          @show-parts-list="handleShowPartsList"
          @show-quality-inspection-report="handleShowQualityInspectionReport"
          @show-split-task="showSplitTask"
        />
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="售后" :name="4">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item>
                <el-button
                  v-permissions="{ permission: [PackingTaskPermission.PACKING_TASK_START] }"
                  type="primary"
                  @click="handleShowStartTask"
                >
                  开始任务
                </el-button>
                <el-button
                  v-permissions="{ permission: [PackingTaskPermission.PACKING_TASK_GET_OFF_WORK] }"
                  type="primary"
                  @click="handleShowGetOffWork"
                >
                  下班
                </el-button>
                <el-button type="primary">工作量预估</el-button>
              </el-form-item>
              <el-form-item label="站点" prop="site">
                <el-select v-model="queryForm.site" clearable placeholder="全部" @change="queryData">
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-form>
            <div class="summary-info">
              <el-statistic class="compact-statistic" title="任务总数" :value="totalTaskNumber" />
            </div>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <packing-task-table
          :cell-style="cellStyle"
          :columns="afterSaleColumns"
          :data="list"
          :header-cell-style="headerCellStyle"
          :loading="listLoading"
          :row-class-name="tableRowClassName"
          @cell-click="changeInput"
          @delete-task="handleDeleteTask"
          @get-package-code-path="getPackageCodePath"
          @image-preview="showPreviewImage"
          @row-click="handleRowClick"
          @selection-change="setSelectRows"
          @show-barcode="showBarcode"
          @show-modify="handleShowModify"
          @show-modify-task="handleShowModifyTask"
          @show-new-inspection-report="showNewInspectionReport"
          @show-parts-list="handleShowPartsList"
          @show-quality-inspection-report="handleShowQualityInspectionReport"
          @show-split-task="showSplitTask"
        />
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="未到货" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item>
                <el-button
                  v-permissions="{ permission: [PackingTaskPermission.PACKING_TASK_GET_OFF_WORK] }"
                  type="primary"
                  @click="handleShowGetOffWork"
                >
                  下班
                </el-button>
                <el-button type="primary">工作量预估</el-button>
              </el-form-item>
              <el-form-item label="站点" prop="site">
                <el-select v-model="queryForm.site" clearable placeholder="全部" @change="queryData">
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-form>
            <div class="summary-info">
              <el-statistic class="compact-statistic" title="任务总数" :value="totalTaskNumber" />
            </div>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <packing-task-table
          :cell-style="cellStyle"
          :columns="notArrivedColumns"
          :data="list"
          :header-cell-style="headerCellStyle"
          :loading="listLoading"
          :row-class-name="tableRowClassName"
          @cell-click="changeInput"
          @delete-task="handleDeleteTask"
          @get-package-code-path="getPackageCodePath"
          @image-preview="showPreviewImage"
          @row-click="handleRowClick"
          @selection-change="setSelectRows"
          @show-barcode="showBarcode"
          @show-modify="handleShowModify"
          @show-modify-task="handleShowModifyTask"
          @show-new-inspection-report="showNewInspectionReport"
          @show-parts-list="handleShowPartsList"
          @show-quality-inspection-report="handleShowQualityInspectionReport"
          @show-split-task="showSplitTask"
        />
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 零件清单 -->
    <vab-dialog v-model="dialogPartsListTableVisible" title="零配件清单" width="45%">
      <el-table
        border
        :cell-class-name="partsListCellClassName"
        :cell-style="partsListCellStyle"
        :data="partsList"
        :header-cell-style="{ textAlign: 'center' }"
        max-height="500px"
        stripe
      >
        <el-table-column label="零件ID" prop="existingPartsListId" />
        <el-table-column label="图片" prop="componentUrl" width="60">
          <template #default="{ row }">
            <el-image
              fit="fill"
              :src="row.componentUrl"
              style="display: block; width: 100%; height: 100%"
              @click="showPreviewImage(row.componentUrl)"
            >
              <template #error>
                <el-icon />
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="零件名" min-width="200" prop="componentName" />
        <el-table-column label="总数" prop="totalCount" />
        <el-table-column label="每套SKU数量" min-width="130" prop="count" />
        <el-table-column label="单位" prop="componentUnit" />
        <el-table-column label="收货仓库" min-width="130" prop="repositoryName" />
        <el-table-column label="签收日期" min-width="120" prop="signDate" />
      </el-table>
    </vab-dialog>
    <!-- 当前任务加人 - 人员选择 -->
    <vab-dialog v-model="currentTaskVisible" title="当前任务加人-人员选择" width="20%" @close="handleCloseCurrentTask">
      <el-table
        ref="currentTaskTableRef"
        border
        :cell-class-name="personSelectCellClassName"
        class="person-select"
        :data="currentTaskList"
        :header-cell-style="{ textAlign: 'center' }"
        stripe
        @selection-change="setSelectTaskAddRows"
      >
        <el-table-column align="center" label="姓名" min-width="100" prop="userName" />
        <el-table-column align="center" label="头像" prop="headerImage" width="65">
          <template #default="{ row }">
            <el-image
              fit="fill"
              :src="row.headerImage"
              style="display: block; width: 100%; height: 100%"
              @click="showPreviewImage(row.headerImage)"
            >
              <template #error>
                <el-icon />
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" type="selection" width="80" />
      </el-table>
      <template #footer>
        <el-button type="danger" @click="handleCloseCurrentTask">取消</el-button>
        <el-button type="success" @click="handleConfirmCurrentTask">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 下班人员 - 人员选择 -->
    <vab-dialog v-model="getOffWorkVisible" title="下班人员-人员选择" width="20%" @close="handleCloseGetOffWork">
      <el-table
        ref="getOffWorkTableRef"
        border
        :cell-class-name="personSelectCellClassName"
        class="person-select"
        :data="goOffWorkList"
        :header-cell-style="{ textAlign: 'center' }"
        stripe
        @selection-change="setSelectGetOffRows"
      >
        <el-table-column align="center" label="姓名" min-width="100" prop="userName" />
        <el-table-column align="center" label="头像" prop="headerImage" width="65">
          <template #default="{ row }">
            <el-image
              fit="fill"
              :src="row.headerImage"
              style="display: block; width: 100%; height: 100%"
              @click="showPreviewImage(row.headerImage)"
            >
              <template #error>
                <el-icon />
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" type="selection" width="80" />
      </el-table>
      <template #footer>
        <el-button type="danger" @click="handleCloseGetOffWork">取消</el-button>
        <el-button :loading="getOffWorkLoading" type="success" @click="handleConfirmGetOffWork">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 开始任务 - 人员选择 -->
    <vab-dialog v-model="personSelectVisible" title="开始任务-人员选择" width="20%" @close="handleCloseStartTask">
      <el-table
        ref="startTaskTableRef"
        border
        :cell-class-name="personSelectCellClassName"
        class="person-select"
        :data="startTaskList"
        :header-cell-style="{ textAlign: 'center' }"
        stripe
        @selection-change="setSelectPersonRows"
      >
        <el-table-column align="center" label="姓名" min-width="100" prop="userName" />
        <el-table-column align="center" label="头像" prop="headerImage" width="65">
          <template #default="{ row }">
            <el-image
              fit="fill"
              :src="row.headerImage"
              style="display: block; width: 100%; height: 100%"
              @click="showPreviewImage(row.headerImage)"
            >
              <template #error>
                <el-icon />
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" type="selection" width="80" />
      </el-table>
      <template #footer>
        <el-button type="danger" @click="handleCloseStartTask">取消</el-button>
        <el-button :loading="qualityProjectLoading" type="success" @click="handleShowQualityProject">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 结束任务 - 人员选择 -->
    <vab-dialog v-model="finishTaskVisible" title="结束任务-人员选择" width="20%" @close="handleCloseFinishTask">
      <el-table
        ref="finishTaskTableRef"
        border
        :cell-class-name="personSelectCellClassName"
        class="person-select"
        :data="endTaskList"
        :header-cell-style="{ textAlign: 'center' }"
        max-height="700"
        stripe
        @selection-change="setSelectFinishTaskRows"
      >
        <el-table-column align="center" label="姓名" min-width="100" prop="userName" />
        <el-table-column align="center" label="头像" prop="headerImage" width="65">
          <template #default="{ row }">
            <el-image
              fit="fill"
              :src="row.headerImage"
              style="display: block; width: 100%; height: 100%"
              @click="showPreviewImage(row.headerImage)"
            >
              <template #error>
                <el-icon />
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" type="selection" width="80" />
      </el-table>
      <template #footer>
        <el-button type="danger" @click="handleCloseFinishTask">取消</el-button>
        <el-button :loading="finishConfirmLoading" type="success" @click="handleConfirmFinishTask">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 开始任务 - 质检项目 -->
    <vab-dialog v-model="qualityProjectVisible" :draggable="false" title="质检项目" width="50%">
      <el-table
        border
        :cell-class-name="projectCellClassName"
        class="qualityProject"
        :data="skuQualityList"
        :header-cell-style="{ textAlign: 'center' }"
        :span-method="objectSpanMethod"
        stripe
        @cell-click="changeProjectInput"
      >
        <el-table-column label="SKU" min-width="100" prop="sku" :width="flexColumnWidth(skuQualityList, 'SKU', 'sku')" />
        <el-table-column label="图片" width="75">
          <template #default="{ row }">
            <el-image
              fit="fill"
              :src="row.skuImageUrl"
              style="display: block; width: 75px; height: 75px"
              @click="showPreviewImage(row.skuImageUrl)"
            >
              <template #error>
                <el-icon />
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" label="检查类型" min-width="100" prop="type" />
        <el-table-column label="打包注意事项" min-width="300" prop="packagePrecautions" />
        <el-table-column align="center" label="需质检" min-width="80" prop="status">
          <template #default="{ row }">
            <el-checkbox v-model="row.status" :false-value="0" :true-value="1" @change="handleInspectionChange(row)" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="需拍照" min-width="80" prop="isUploadImages">
          <template #default="{ row }">
            <el-checkbox v-model="row.isUploadImages" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="修改日期" min-width="110" prop="updateTime">
          <template #default="{ row }">
            {{ row.updateTime ? row.updateTime.split(' ')[0] : '' }}
          </template>
        </el-table-column>
      </el-table>
    </vab-dialog>
    <!-- 站点修改 -->
    <vab-dialog v-model="modifyVisible" title="站点修改" width="20%" @close="closeModifyDialog">
      <el-form
        ref="modifyFormRef"
        label-position="right"
        label-width="auto"
        :model="modifyForm"
        :rules="modifyRules"
        style="margin-right: 20px; margin-left: 20px"
      >
        <el-form-item label="站点" prop="site" style="width: 97%">
          <el-select v-model="modifyForm.site" clearable placeholder="请选择站点">
            <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="任务数" prop="packageTaskCount">
          <el-input v-model="modifyForm.packageTaskCount" clearable />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <el-button type="primary" @click="closeModifyDialog">取消</el-button>
        <el-button type="success" @click="confirmUpdateTask">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 任务数修改 -->
    <vab-dialog v-model="modifyTaskVisible" title="任务数修改" width="23%" @close="closeModifyTask">
      <el-form
        ref="modifyTaskFormRef"
        label-position="right"
        label-width="auto"
        :model="modifyTaskForm"
        :rules="modifyTaskRules"
        style="margin-right: 20px; margin-left: 20px"
      >
        <el-form-item label="数量减少的任务" prop="reduceTaskId" style="width: 97.5%">
          <el-select v-model="modifyTaskForm.reduceTaskId" clearable placeholder="请选择数量减少的任务" @change="reduceTaskChange">
            <el-option v-for="item in taskSplitOption" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="转移数量" prop="transferPackageTaskCount">
          <el-input-number v-model="modifyTaskForm.transferPackageTaskCount" clearable :max="maxCount" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="数量增加的任务" prop="increaseTaskId" style="width: 97.5%">
          <el-select v-model="modifyTaskForm.increaseTaskId" clearable :disabled="addTaskDisabled" placeholder="">
            <el-option v-for="item in addTaskOption" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="closeModifyTask">取消</el-button>
        <el-button type="success" @click="confirmModifyTask">确认</el-button>
      </template>
    </vab-dialog>
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
          <!-- <el-button type="primary" @click="handleShowDetails">明细</el-button> -->
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
        <el-form-item label="备注" prop="remark">
          <div style="width: 85%">
            <el-input v-model="packingCountForm.remark" resize="none" :rows="2" style="margin-bottom: 18px" type="textarea" />
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
    <!-- 明细 -->
    <vab-dialog v-model="detailsVisible" title="明细" width="40%">
      <el-table border :cell-style="detailsCellStyle" :data="fakeDetails" :header-cell-style="{ textAlign: 'center' }" stripe>
        <el-table-column label="零件ID" min-width="100" prop="id" />
        <el-table-column label="零件名" min-width="200" prop="componentName" />
        <el-table-column label="订货总数" min-width="100" prop="total" />
        <el-table-column label="单位" min-width="70" prop="unit" />
        <el-table-column label="缺" min-width="100" prop="lack" />
        <el-table-column label="坏" min-width="100" prop="bad" />
      </el-table>
    </vab-dialog>
    <!-- 打包任务的拆分 -->
    <vab-dialog v-model="splitTaskVisible" title="拆分" width="20%" @close="closeSplitTask">
      <el-form
        ref="splitTaskFormRef"
        label-position="right"
        label-width="auto"
        :model="splitTaskForm"
        :rules="splitRules"
        style="margin-right: 20px; margin-left: 20px"
      >
        <el-form-item label="转入的数量" prop="splitCount">
          <el-input v-model="splitTaskForm.splitCount" clearable />
        </el-form-item>
        <el-form-item label="转入的站点" prop="site" style="width: 97.5%">
          <el-select v-model="splitTaskForm.site" clearable placeholder="请选择站点">
            <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeSplitTask">取消</el-button>
        <el-button type="primary" @click="confirmSplitTask">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 生成条形码 -->
    <vab-dialog v-model="generateBarcodeVisible" title="生成条形码" width="20%" @close="closeBarcode">
      <el-form
        ref="barcodeFormRef"
        class="barcodeForm"
        label-position="top"
        :model="barcodeForm"
        :rules="barcodeFormRules"
        style="margin: 0"
      >
        <el-form-item label="尺寸" prop="sizeIdx">
          <el-select v-model="barcodeForm.sizeIdx" placeholder="请选择尺寸">
            <el-option v-for="item in sizeOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 2px">
          <el-checkbox v-model="barcodeForm.chokingWarning" :false-value="0" :true-value="1">窒息警告</el-checkbox>
          <el-checkbox v-model="barcodeForm.nippleClampWarning" :false-value="0" :true-value="1">奶嘴夹警告</el-checkbox>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="barcodeForm.brand" clearable style="min-width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeBarcode">取消</el-button>
        <el-button type="primary" @click="confirmGenerateBarcode">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 测试模拟打卡 -->
    <vab-dialog v-model="testVisible" title="测试模拟打卡" width="15%">
      <el-table border :data="testList" :header-cell-style="{ textAlign: 'center' }" stripe @selection-change="setSelectTestRows">
        <el-table-column label="姓名" prop="userName" />
        <el-table-column align="center" type="selection" />
      </el-table>
      <template #footer>
        <el-button @click="testVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmTest">确定</el-button>
      </template>
    </vab-dialog>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- 新品质检报告 -->
    <vab-quality-inspection-report v-model="newQualityInspectionReportVisible" :sku="sku" :sku-id="skuId" />
    <!-- 打包质检报告 -->
    <vab-packing-inspection-report v-model="qualityInspectionReportVisible" :sku="sku" :task-id="taskId" />
  </div>
</template>

<script lang="ts" setup>
import { CirclePlus, Search } from '@element-plus/icons-vue'
import { ElMessageBox, type FormInstance, type FormRules, type TableInstance, type TabsPaneContext } from 'element-plus'
import { debounce } from 'lodash-es'
import { computed, ref } from 'vue'
import { sizeOption } from '../constantOption'
import { getColumnsForTab, type PackingTaskColumn } from './packingTaskColumns'
import {
  addQualityCheck,
  checkGoOffWork,
  checkInMork,
  checkStartTaskPackage,
  confirmCurrentTaskAddPerson,
  confirmEndTask,
  confirmGoOffWork,
  confirmStartMoreTask,
  confirmStartTask,
  deletePackageTask,
  generatePackageBarcode,
  getBarCodePath,
  getEndTaskList,
  getFreeList,
  getGoOffWorkList,
  getPackageAllTaskList,
  getPackageComponentList,
  getPackageSiteList,
  getPackageTaskIsSplit,
  getPackageTaskList,
  getPackageTaskSplitList,
  getPackageTaskingList,
  getQualityCheck,
  getSkuQualityList,
  getStartTaskList,
  splitPackageTask,
  updatePackageTask,
  updatePackageTaskSite,
} from '/@/api/devlocal/packagingShipping'
import { updateProductQualityInspection } from '/@/api/devlocal/productInformation'
import PackingTaskPermission from '/@/permissions/packingTask'
import { useUserStore } from '/@/store/modules/user'
import type { IGetPackageTaskListQuery, IGetQualityCheck, IPackageTaskSplitOption } from '/@/type/packagingShipping/packagingType'
import { formatDate } from '/@/utils/dateUtils'
import { getDataAttribute, getSpecificChildren } from '/@/utils/nodeUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'PackingTask',
})

const selectedRowIndex = ref<number>(-1)
// 行点击处理函数
const handleRowClick = (row: any, column: any, event: Event) => {
  selectedRowIndex.value = row.id
}
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.id === selectedRowIndex.value) {
    return 'select-row'
  }
  return ''
}

// 传递给新品质检报告的sku
const sku = ref<string>('')
// 传递给新品质检报告的skuId
const skuId = ref<number>(0)
// 传递给打包质检报告的taskId
const taskId = ref<number>(0)
const newQualityInspectionReportVisible = ref<boolean>(false)
const activeName = ref<number>(7)

// 获取各个tab的列配置
const allTaskColumns = computed<PackingTaskColumn[]>(() => getColumnsForTab(7))
const pendingPackColumns = computed<PackingTaskColumn[]>(() => getColumnsForTab(1))
const taskingColumns = computed<PackingTaskColumn[]>(() => getColumnsForTab(5))
const completedColumns = computed<PackingTaskColumn[]>(() => getColumnsForTab(2))
const remainderColumns = computed<PackingTaskColumn[]>(() => getColumnsForTab(3))
const afterSaleColumns = computed<PackingTaskColumn[]>(() => getColumnsForTab(4))
const notArrivedColumns = computed<PackingTaskColumn[]>(() => getColumnsForTab(0))
const showPreviewImage = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const testVisible = ref<boolean>(false)
const testList = ref<any[]>([])
const showNewInspectionReport = (row: any) => {
  sku.value = row.sku
  skuId.value = row.skuId
  newQualityInspectionReportVisible.value = true
}
const handleInspectionChange = async (row: any) => {
  // 勾选了‘需拍照’的，无法 取消‘需质检’勾选
  if (row.isUploadImages) {
    row.status = 1
  }
  // 修改后不更新表格
  await updateProductQualityInspection(row)
}
// const handleOpenTest = async () => {
//   testVisible.value = true
//   const { data } = await getMorkPackageList()
//   testList.value = data
// }
const selectTestRows = ref<any>([])
const setSelectTestRows = (value: any) => {
  selectTestRows.value = value
}

const getOffWorkLoading = ref<boolean>(false)

const handleConfirmTest = async () => {
  if (selectTestRows.value.length === 0) {
    $baseMessage('您未选择任何行！', 'warning')
    return
  }
  const userIds = selectTestRows.value.map((item: any) => item.userId).join(',')
  const { data } = await checkInMork({ userIds })
  if (data) {
    $baseMessage('测试模拟打卡成功！', 'success')
    testVisible.value = false
  } else {
    $baseMessage('测试模拟打卡失败！', 'error')
  }
}
const _id = ref<number>(0)
const generateBarcodeVisible = ref<boolean>(false)
const barcodeForm = reactive<any>({
  sizeIdx: 1,
  chokingWarning: 0,
  nippleClampWarning: 0,
})
const barcodeFormRef = ref<FormInstance>()
const barcodeFormRules = reactive<FormRules>({
  sizeIdx: [{ required: true, message: '请选择尺寸', trigger: 'change' }],
  brand: [{ required: true, message: '请填写品牌', trigger: 'blur' }],
})
const showBarcode = (row: any) => {
  _id.value = row.id
  generateBarcodeVisible.value = true
}
const closeBarcode = () => {
  barcodeFormRef.value?.resetFields()
  generateBarcodeVisible.value = false
}
const confirmGenerateBarcode = async () => {
  barcodeFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await generatePackageBarcode({
        packageId: _id.value,
        ...barcodeForm,
      })
      if (data) {
        $baseMessage('生成条形码成功!', 'success')
        closeBarcode()
      }
    }
  })
}
// 任务书修改form
const modifyTaskForm = reactive<any>({})
const modifyTaskFormRef = ref<FormInstance>()
const modifyTaskVisible = ref<boolean>(false)
const closeModifyTask = () => {
  modifyTaskFormRef.value?.resetFields()
  modifyTaskVisible.value = false
}
const confirmModifyTask = async () => {
  modifyTaskFormRef.value?.validate(async (valid: any) => {
    if (valid) {
      const { data } = await updatePackageTask({
        taskId: copyRow.value.id,
        reduceTaskId: modifyTaskForm.reduceTaskId,
        increaseTaskId: modifyTaskForm.increaseTaskId,
        transferPackageTaskCount: Number(modifyTaskForm.transferPackageTaskCount),
      })
      if (data) {
        closeModifyTask()
        $baseMessage('修改任务数成功', 'success', 'hey')
        fetchData()
      }
    }
  })
}
// 任务拆分列表
const taskSplitOption = ref<IPackageTaskSplitOption[]>([])
// 任务数增加列表
const addTaskOption = ref<IPackageTaskSplitOption[]>([])
// 任务数增加数量的禁止
const addTaskDisabled = ref<boolean>(true)
// 转移数量的最大值
const maxCount = ref<number>(0)
const reduceTaskChange = (value: any) => {
  const item = taskSplitOption.value.find((item: IPackageTaskSplitOption) => item.id === value)
  const numberAfterColon = item!.label.match(/(?<=:)\d+/)?.[0]
  maxCount.value = Number(numberAfterColon)
  // console.log(maxCount.value);

  addTaskOption.value = taskSplitOption.value.filter((item: IPackageTaskSplitOption) => item.id !== value)
  addTaskDisabled.value = false
}
const handleShowModifyTask = async (row: any) => {
  const { data } = await getPackageTaskIsSplit({
    taskId: row.id,
  })
  if (data === true) {
    copyRow.value = row
    addTaskDisabled.value = true
    modifyTaskVisible.value = true
    const { data: taskSplitData } = await getPackageTaskSplitList({
      taskId: row.id,
    })
    taskSplitOption.value = taskSplitData
  } else {
    $baseMessage('此PO只有一条打包任务，无法修改任务数', 'error')
  }
}
// 任务数修改rule
const modifyTaskRules = reactive<any>({
  reduceTaskId: [{ required: true, message: '请选择数量减少的任务', trigger: 'change' }],
  transferPackageTaskCount: [{ required: true, message: '请输入转移数量', trigger: 'blur' }],
  increaseTaskId: [{ required: true, message: '请选择数量增加的任务', trigger: 'change' }],
})
// 打包选中的行
const selectRows = ref<any>([])
const setSelectRows = (value: any[]) => {
  selectRows.value = value
}
const totalTaskNumber = computed(() => {
  return selectRows.value.reduce((sum: number, item: any) => sum + (Number(item.packageTaskCount) || 0), 0)
})

// 开始任务人员选择选中的行
const selectPersonRows = ref<any>([])
const setSelectPersonRows = (value: string) => {
  selectPersonRows.value = value
}
// 下班人员选中的行
const selectGetOffRows = ref<any>([])
const setSelectGetOffRows = (value: string) => {
  selectGetOffRows.value = value
}
// 任务加人选中的行
const selectTaskAddRows = ref<any>([])
const setSelectTaskAddRows = (value: string) => {
  selectTaskAddRows.value = value
}
// 结束任务选中的行
const selectFinishTaskRows = ref<any>([])
const setSelectFinishTaskRows = (value: string) => {
  selectFinishTaskRows.value = value
}

const tableRef = ref<TableInstance>()
const list = ref<any>([])
const listLoading = ref<boolean>(true)
// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}

const fakeDetails = [
  {
    id: 1,
    componentName: '零件330',
    total: 99,
    unit: '个',
    lack: 3,
    bad: 6,
  },
]

// 零件清单表格是否可见
const dialogPartsListTableVisible = ref<boolean>(false)
// 零件清单列表
const partsList = ref<any>([])
// 打包条形码文件夹
const getPackageCodePath = async (row: any) => {
  const { data } = await getBarCodePath({
    taskId: row.id,
  })
  if (data) {
    const { isSupported, copy } = useClipboard({ legacy: true })
    if (!isSupported) usePermission('clipboard-write')

    copy(data)
      .then(() => {
        $baseMessage('已复制路径到剪贴板！', 'success')
      })
      .catch(() => {
        $baseMessage('复制失败，请重试', 'error')
      })
  }
}
// 展示零件清单
const handleShowPartsList = async (row: any) => {
  const { data } = await getPackageComponentList({
    id: row.id,
  })
  partsList.value = data
  dialogPartsListTableVisible.value = true
}
// 零件清单cellStyle
const partsListCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): any => {
  if (data.columnIndex !== 2) {
    return {
      textAlign: 'center',
    }
  }
}
// 零件清单去掉padding
const partsListCellClassName = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.columnIndex === 1) {
    return 'clear-padding'
  }
  return ''
}

// 质检报告是否可见
const qualityInspectionReportVisible = ref<boolean>(false)
// 展示质检报告
const handleShowQualityInspectionReport = async (row: any) => {
  taskId.value = row.id
  sku.value = row.sku
  qualityInspectionReportVisible.value = true
}
// 开始任务人员选择展示与否
const personSelectVisible = ref<boolean>(false)
const startTaskTableRef = ref<TableInstance>()
// 下班人员标识
const getOffWorkVisible = ref<boolean>(false)
const getOffWorkTableRef = ref<TableInstance>()
// 结束任务标识
const finishTaskVisible = ref<boolean>(false)
const finishTaskTableRef = ref<TableInstance>()
// 当前任务标识
const currentTaskVisible = ref<boolean>(false)
const currentTaskTableRef = ref<TableInstance>()
// 开始任务的列表
const startTaskList = ref<any>([])
// 结束任务的列表
const endTaskList = ref<any>([])
// 当前任务加人的列表
const currentTaskList = ref<any>([])
// 下班任务的列表
const goOffWorkList = ref<any>([])
// 获取当前用户
const useUser = useUserStore()
const currentUser = useUser.getUsername
// 当前任务加人显示
const handleShowCurrentTask = async () => {
  const { data } = await getFreeList()
  // 排除掉自己,自己已在任务中
  if (data) {
    currentTaskList.value = data.filter((item) => item.userName !== currentUser)
  }
  currentTaskVisible.value = true
}
// 下班人员显示
const handleShowGetOffWork = async () => {
  const { data } = await getGoOffWorkList()
  goOffWorkList.value = data
  getOffWorkVisible.value = true
}

// 点击开始任务
const handleShowStartTask = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning')
    return
  }

  const { data } = await getStartTaskList()
  startTaskList.value = data
  personSelectVisible.value = true
}
// 结束任务显示
const handleShowFinishTask = async () => {
  const { data } = await getEndTaskList()
  endTaskList.value = data
  finishTaskVisible.value = true
}
// 质检项目展示与否
const qualityProjectVisible = ref<boolean>(false)
// 删除任务
const handleDeleteTask = (row: any) => {
  $baseConfirm('确定删除该任务吗？', '系统提示', async () => {
    const { data } = await deletePackageTask({
      id: row.id,
    })
    if (data) {
      $baseMessage('删除任务成功', 'success')
      fetchData()
    }
  })
}

// 人员选择的padding
const personSelectCellClassName = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.columnIndex === 1) {
    return 'clear-padding'
  }
  return ''
}
// 当前任务加人的取消
const handleCloseCurrentTask = () => {
  currentTaskTableRef.value?.clearSelection()
  currentTaskVisible.value = false
}
// 当前任务加人的确定
const handleConfirmCurrentTask = async () => {
  if (selectTaskAddRows.value.length === 0) {
    $baseMessage('您未选中任何人员', 'warning')
    return
  }
  const userIds = selectTaskAddRows.value.map((item: any) => item.userId).join(',')
  const { data } = await confirmCurrentTaskAddPerson({
    userIds,
  })
  if (data) {
    $baseMessage('当前任务加人成功!', 'success')
    queryTaskingData()
  }
  handleCloseCurrentTask()
}
// 下班人员的取消
const handleCloseGetOffWork = async () => {
  getOffWorkTableRef.value?.clearSelection()
  getOffWorkVisible.value = false
}
// 下班人员的确定
const handleConfirmGetOffWork = async () => {
  if (selectGetOffRows.value.length === 0) {
    $baseMessage('您未选中任何人员', 'warning')
    return
  }
  const userIds = selectGetOffRows.value.map((item: any) => item.userId).join(',')
  const { data } = await checkGoOffWork({
    userIds,
  })
  if (data) {
    $baseConfirm('下班人员列表中，存在有未结束任务的人。确定是否要下班并结束任务?', '系统提示', async () => {
      getOffWorkLoading.value = true
      const { data: goOff } = await confirmGoOffWork({
        userIds,
      })
      if (goOff === true) {
        $baseMessage('下班人员确定成功', 'success')
        getOffWorkLoading.value = false
      }
    })
  } else {
    getOffWorkLoading.value = true
    const { data: goOff } = await confirmGoOffWork({
      userIds,
    })
    if (goOff === true) {
      $baseMessage('下班人员确定成功', 'success')
      getOffWorkLoading.value = false
    }
  }
  handleCloseGetOffWork()
  // selectRows.value = []
}
// 结束任务的取消
const handleCloseFinishTask = () => {
  finishTaskTableRef.value?.clearSelection()
  finishTaskVisible.value = false
}
const finishConfirmLoading = ref<boolean>(false)
const qualityProjectLoading = ref<boolean>(false)

// 结束任务的确定
const handleConfirmFinishTask = debounce(async () => {
  try {
    if (selectFinishTaskRows.value.length === 0) {
      $baseMessage('您未选中任何人员', 'warning')
      return
    }
    finishConfirmLoading.value = true
    const userIds = selectFinishTaskRows.value.map((item: any) => item.userId).join(',')
    const { data } = await confirmEndTask({
      userIds,
    })
    if (data) {
      $baseMessage('结束任务成功', 'success')
      queryTaskingData()
      handleCloseFinishTask()
    }
  } catch (error) {
    console.error(error)
  } finally {
    finishConfirmLoading.value = false
  }
}, 5000)
// 开始任务的取消
const handleCloseStartTask = () => {
  startTaskTableRef.value?.clearSelection()
  personSelectVisible.value = false
}
// 开始任务确定后的质检列表
const skuQualityList = ref<any>([])
const showSkuQualityList = async (taskIds: string, startTaskUserIds: string) => {
  if (selectRows.value.length > 1) {
    await confirmStartMoreTask({
      taskIds,
      startTaskUserIds,
    })
    personSelectVisible.value = false
  } else {
    await confirmStartTask({
      taskId: Number(taskIds),
      startTaskUserIds,
    })
    personSelectVisible.value = false
  }
  fetchData()
  const { data } = await getSkuQualityList({
    ids: taskIds,
  })
  if (data) {
    // 只展示需质检的项目
    skuQualityList.value = data.filter((item: any) => item.status === 1)
    qualityProjectVisible.value = true
    // selectRows.value = []
  }
}
// 点击开始任务-人员选择后的质检项目
const handleShowQualityProject = debounce(async () => {
  try {
    if (selectPersonRows.value.length === 0) {
      $baseMessage('您未选中任何人员', 'warning')
      return
    }
    qualityProjectLoading.value = true
    const taskIds = selectRows.value.map((item: any) => item.id).join(',')
    const startTaskUserIds = selectPersonRows.value.map((item: any) => item.userId).join(',')
    const { data: res, msg } = await checkStartTaskPackage({
      taskIds,
      startTaskUserIds,
    })
    if (res) {
      await showSkuQualityList(taskIds, startTaskUserIds)
    } else {
      ElMessageBox.confirm(msg, '系统提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        showClose: false,
        type: 'warning',
        customStyle: { whiteSpace: 'pre-line', maxWidth: '600px' },
      }).then(() => {
        showSkuQualityList(taskIds, startTaskUserIds)
      })
    }
  } finally {
    qualityProjectLoading.value = false
  }
}, 5000)
// // 修改优先打包
// const handleUpdatePriority = async (row: any) => {
//   await updatePriorityPackaging({
//     id: row.id,
//     priorityPackaging: row.priorityPackaging,
//   })
// }
// 修改显示与否
const modifyVisible = ref<boolean>(false)
// 展示修改
const handleShowModify = (row: any) => {
  modifyVisible.value = true
  copyRow.value = row
}
// 修改的表单
const modifyForm = reactive<any>({
  site: undefined,
})
// 修改的rule
const modifyRules = reactive<any>({
  site: [{ required: true, message: '请选择站点', trigger: 'change' }],
  taskCount: [{ required: true, message: '请输入任务数', trigger: 'blur' }],
})
const modifyFormRef = ref<FormInstance>()
// 关闭修改弹窗
const closeModifyDialog = () => {
  modifyFormRef.value?.resetFields()
  modifyVisible.value = false
}
// 确认修改
const confirmUpdateTask = async () => {
  const { data } = await updatePackageTaskSite({
    taskId: copyRow.value.id,
    site: modifyForm.site,
  })
  if (data) {
    $baseMessage('修改打包任务成功', 'success')
    closeModifyDialog()
    fetchData()
  }
}
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
// 明细是否可见
const detailsVisible = ref<boolean>(false)
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
let copyRow = ref<any>()
// 展示打包总数
const handleShowPackingCount = async (row: any) => {
  // 点击了清单质检
  if (row.qualityCheckStatus === 1) {
    packingCountVisible.value = true
    copyRow.value = row
    // 重置表单
    Object.keys(packingCountForm).forEach((key) => {
      packingCountForm[key as keyof typeof packingCountForm] = undefined
    })
    const { data } = await getQualityCheck({
      id: row.id,
    })
    if (data && Object.keys(data).length > 0) {
      Object.assign(packingCountForm, data)
    }
    if (!data!.id) {
      packingCountForm.packageTaskCount = row.packageTaskCount
    }
    // if (!data?.packageTaskCount) {
    //   packingCountForm.packageTaskCount = 0
    // }
    lackCount.value = data?.lackCount!
    manyCount.value = data?.manyCount
  } else {
    await addQualityCheck({
      taskId: row.id,
      status: row.qualityCheckStatus,
    })
  }
}
// 清点质检的取消
const closePackingCount = () => {
  packingCountVisible.value = false
  copyRow.value.qualityCheckStatus = 0
}
// 清点质检的确认
const confirmQualityCheck = async () => {
  const { data } = await addQualityCheck({
    taskId: copyRow.value.id,
    goodCount: packingCountForm.goodCount!,
    manyCount: manyCount.value,
    keepSampleCount: packingCountForm.keepSampleCount,
    lackCount: lackCount.value,
    badCount: packingCountForm.badCount,
    remark: packingCountForm.remark,
    status: copyRow.value.qualityCheckStatus,
  })
  if (data) {
    $baseMessage('添加质检信息成功', 'success')
    packingCountVisible.value = false
    fetchData()
  }
}
// 缺的数量
const lackCount = computed<number>({
  get() {
    let good = Number(packingCountForm.goodCount)
    let bad = Number(packingCountForm.badCount)
    let taskCount = Number(packingCountForm.packageTaskCount)
    if (good <= taskCount) {
      return taskCount - good - bad
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
// 拆分可见
const splitTaskVisible = ref<boolean>(false)
// 展示拆分
const showSplitTask = (row: any) => {
  splitTaskVisible.value = true
  copyRow.value = row
}
// 拆分表单
const splitTaskForm = reactive<any>({
  splitCount: null,
})
const splitRules = reactive<any>({
  splitCount: [{ required: true, message: '请填写拆分数量', trigger: 'blur' }],
  site: [{ required: true, message: '请选择站点', trigger: 'change' }],
})
const splitTaskFormRef = ref<FormInstance>()
// 关闭拆分
const closeSplitTask = () => {
  splitTaskFormRef.value?.resetFields()
  splitTaskVisible.value = false
}
// 确认拆分
const confirmSplitTask = async () => {
  splitTaskFormRef.value?.validate(async (valid: any) => {
    if (valid) {
      const { data } = await splitPackageTask({
        taskId: copyRow.value.id,
        splitCount: splitTaskForm.splitCount,
        site: splitTaskForm.site,
      })
      if (data) {
        $baseMessage('拆分打包任务成功', 'success')
        closeSplitTask()
        fetchData()
      }
    }
  })
}
const router = useRouter()
const route = useRoute()
// 总记录数
const total = ref<number>(0)
const queryForm = reactive<IGetPackageTaskListQuery>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
  status: 1, // 0未到货 1待打包 2已完成 3零头 4售后 5进行中
  site: undefined, //0 亚马逊US 1 亚马逊DE 2 亚马逊UK 3亚马逊CA 4 沃尔玛US
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
const handleTaskingSizeChange = (value: number) => {
  taskingForm.pageNo = 1
  taskingForm.pageSize = value
  fetchTaskingData()
}
const handleTaskingCurrentChange = (value: number) => {
  taskingForm.pageNo = value
  fetchTaskingData()
}
const queryTaskingData = () => {
  taskingForm.pageNo = 1
  fetchTaskingData()
}
const queryAllTaskData = () => {
  allTaskForm.pageNo = 1
  fetchAllTaskData()
}

// 监听日期变化，确保数据及时更新
watch(
  () => allTaskForm.releaseDate,
  () => {
    queryAllTaskData()
  },
  { deep: true }
)
const handleAllTaskSizeChange = (value: number) => {
  allTaskForm.pageNo = 1
  allTaskForm.pageSize = value
  fetchAllTaskData()
}
const handleAllTaskCurrentChange = (value: number) => {
  allTaskForm.pageNo = value
  fetchAllTaskData()
}
const taskingForm = reactive<any>({
  keyWord: '',
  site: undefined,
  pageNo: 1,
  pageSize: 20,
})
const taskingList = ref<any>([])
const taskingTotal = ref<number>(0)
const fetchTaskingData = async () => {
  listLoading.value = true
  const { data } = await getPackageTaskingList(taskingForm)
  if (data) {
    taskingTotal.value = data.total!
    taskingList.value = data.list
    taskingList.value.forEach((item: any) => {
      item.packageRemarkList = item.packageRemarkList.join('<br>')
      item._sku = `${item.sku}<br/>${item.desc}`
    })
    listLoading.value = false
  }
}
const allTaskForm = reactive<any>({
  keyWord: '',
  site: undefined,
  releaseDate: null, // 日期范围，格式为 [startDate, endDate]
  pageNo: 1,
  pageSize: 20,
})
const allTaskList = ref<any>([])
const allTaskTotal = ref<number>(0)
const fetchAllTaskData = async () => {
  listLoading.value = true

  // 处理日期范围数据
  const requestData = { ...allTaskForm }
  if (allTaskForm.releaseDate && Array.isArray(allTaskForm.releaseDate) && allTaskForm.releaseDate.length === 2) {
    // 将日期范围转换为开始和结束日期
    requestData.startDate = formatDate(allTaskForm.releaseDate[0])
    requestData.endDate = formatDate(allTaskForm.releaseDate[1])
    delete requestData.releaseDate // 删除原始日期范围字段
  }

  const { data } = await getPackageAllTaskList(requestData)
  if (data) {
    allTaskList.value = data.list
    allTaskTotal.value = data.total!
    allTaskList.value.forEach((item: any) => {
      item.packageRemarkList = item.packageRemarkList.join('<br>')
      item._sku = `${item.sku}<br/>${item.desc}`
    })
    listLoading.value = false
  }
}
const handleTabClick = (tab: TabsPaneContext) => {
  list.value = []
  // selectRows.value = []
  if (tab.props.name !== undefined) {
    // activeName.value = tab.props.name;
    queryForm.status = Number(tab.props.name)
  }
  activeName.value = Number(tab.props.name)
  router.push({
    query: {
      ...route.query,
      tab: queryForm.status,
      pageNo: 1,
      pageSize: 20,
    },
  })
  if (queryForm.status !== 5 && activeName.value !== 7) {
    fetchData()
  } else if (queryForm.status === 5) {
    fetchTaskingData()
  } else if (activeName.value === 7) {
    fetchAllTaskData()
  }
}
// 表头样式
const headerCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.column.label === '任务数') {
    return { color: '#4E88F3', textAlign: 'center' as const }
  }
  if (data.column.label === '推荐数量') {
    return { color: '#13CE66', textAlign: 'center' as const }
  }
  return { textAlign: 'center' as const }
}
// 打包表格样式
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): any => {
  const label = data.column.label
  if (label === '任务数') {
    return {
      color: '#4E88F3',
      textAlign: 'center',
    }
  }
  if (label === '推荐数量') {
    return {
      color: '#13CE66',
      textAlign: 'center',
    }
  }
  if (label !== 'SKU' && label !== '打包注意事项') {
    return {
      textAlign: 'center',
    }
  }
  // 确保总是返回一个对象
  return {}
}
// 明细表格样式
const detailsCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.columnIndex !== 1) {
    return {
      textAlign: 'center' as const,
    }
  }
  return {}
}

// 质检项目去掉padding
const projectCellClassName = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}
// 质检项目的图片预览
const changeProjectInput = (row: any, column: any, cell: HTMLTableCellElement) => {
  let el = getSpecificChildren(cell, 'img')[0]
  if (getDataAttribute(el, 'img') && el) {
    imagePreviewVisible.value = true
    imagePreviewList.value = []
    imagePreviewList.value.push(el.src!)
  }
}
/**
 * 当点击时切换输入框，修改输入
 */
const changeInput = async (row: any, column: any) => {
  if (column.label === '打包注意事项') {
    handleShowQualityInspectionReport(row)
  }
}
// 开始确定选择后的的质检列表col合并方法
const objectSpanMethod = ({ row, rowIndex, columnIndex }: any) => {
  // 设置需要合并的列
  if (columnIndex === 0 || columnIndex === 1) {
    // 获取当前row的零件id
    const id = row.skuId
    // 默认不跨行
    let rowspan = 1
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < skuQualityList.value.length; i++) {
      // 如果零件id一样需要合并
      if (skuQualityList.value[i].skuId === id) {
        rowspan++
      } else {
        break
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || skuQualityList.value[rowIndex - 1].skuId !== id) {
      return { rowspan, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}
const fetchData = async () => {
  try {
    listLoading.value = true
    const { data } = await getPackageTaskList(queryForm)
    if (data) {
      listLoading.value = false
      total.value = data.total!
      list.value = data.list
      list.value.forEach((item: any) => {
        item.packageRemarkList = item.packageRemarkList.join('<br>')
        item._sku = `${item.sku}<br/>${item.desc}`
      })
    }
  } catch (error) {
    console.error(error)
  }
}
onActivated(() => {
  tableRef.value?.doLayout()
})
const siteList = ref<any>([])
const getSiteList = async () => {
  const { data } = await getPackageSiteList()
  siteList.value = data
}
onBeforeMount(() => {
  const { tab, pageNo, pageSize } = route.query
  if (tab) {
    queryForm.status = Number(tab)
    activeName.value = Number(tab)
  } else {
    activeName.value = 7
  }
  if (pageNo) {
    queryForm.pageNo = Number(pageNo)
    allTaskForm.pageNo = Number(pageNo)
  }
  if (pageSize) {
    queryForm.pageSize = Number(pageSize)
    allTaskForm.pageSize = Number(pageSize)
  }
  if (queryForm.status !== 5 && activeName.value !== 7) {
    fetchData()
  } else if (queryForm.status === 5) {
    fetchTaskingData()
  } else if (activeName.value === 7) {
    fetchAllTaskData()
  }
  getSiteList()
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
          .right-panel {
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
        }

        .el-table {
          flex: 1;

          .copySku {
            cursor: pointer;
            -webkit-user-select: text;
            user-select: text;
            transition: all 0.3s;
            &:hover {
              color: #000;
            }
          }
        }
        .el-checkbox {
          transform: scale(1.2); // 放大 20%
          transform-origin: center; // 确保放大从中心开始
        }
        .none {
          display: none;
        }
      }
    }
  }
}
.quality-inspection :deep(.el-checkbox) {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
.person-select :deep(.el-checkbox) {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
.qualityProject :deep(.el-checkbox) {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
// // 设置行高
// :deep(.el-table .el-table__body .cell) {
//   min-height: 60px;
// }

.none {
  display: none;
}
.left-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
}
.el-input {
  flex: 1; /* 输入框占满可用空间 */
  margin-right: 10px; /* 输入框和按钮之间的间距 */
}
.packingTotal {
  .el-dialog :deep(.el-dialog__body) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.add-icon:hover {
  color: var(--el-color-primary);
}
.overflow-text {
  display: block;
  max-height: 60px;
  overflow-y: auto;
}
.barcodeForm {
  .el-checkbox {
    :deep(.el-checkbox__input) {
      transform: scale(1.1);
    }
  }
}
:deep(.custom-dialog .el-dialog__body) {
  padding-top: 0;
}
// 选中且不被禁用的样式
:deep(.custom-checkbox .el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中且被禁用的样式
:deep(.custom-checkbox .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
  background: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中后中间的 “✔” 的样式
:deep(.custom-checkbox .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
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
/* 统计样式 */
.summary-info {
  margin: 0px 10px calc(var(--el-margin) / 2) 15px;
}
</style>
