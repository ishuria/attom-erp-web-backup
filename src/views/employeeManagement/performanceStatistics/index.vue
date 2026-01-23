<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-change="handleTabChange">
      <el-tab-pane label="全员明细" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline @submit.prevent>
              <el-form-item>
                <el-date-picker v-model="date" style="max-width: 300px" type="monthrange" value-format="YYYY-MM" @change="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button
                  v-permissions="{ permission: [PerformanceStatisticsPermission.ASSESSMENT_EXPORT] }"
                  :loading="generateLoading"
                  type="primary"
                  @click="userAttendanceExport"
                >
                  导出
                </el-button>
              </el-form-item>
            </el-form>
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
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-style="{ textAlign: 'center' }"
          class="all-table"
          :data="list"
          :default-sort="{ prop: 'month', order: 'descending' }"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @sort-change="handleSortChange"
        >
          <el-table-column label="基本信息">
            <el-table-column label="月份" min-width="100" prop="month" />
            <el-table-column label="姓名" min-width="90" prop="userName" />
            <el-table-column label="角色" min-width="120" prop="roleName" />
          </el-table-column>
          <el-table-column label="加班和请假">
            <el-table-column min-width="100" prop="overtimeHours" sortable="custom">
              <template #header>
                加班时长
                <br />
                (小时)
              </template>
            </el-table-column>
            <el-table-column min-width="100" prop="count" sortable="custom">
              <template #header>餐补次数</template>
            </el-table-column>
            <el-table-column min-width="90" prop="personalLeave" sortable="custom">
              <template #header>
                事假
                <br />
                (小时)
              </template>
            </el-table-column>
            <el-table-column min-width="100" prop="absenceDuration" sortable="custom">
              <template #header>
                缺勤时长
                <br />
                (小时)
              </template>
            </el-table-column>
            <el-table-column min-width="90" prop="shortLeave" sortable="custom">
              <template #header>
                短时请假
                <br />
                (小时)
              </template>
            </el-table-column>
            <el-table-column min-width="90" prop="sickLeave" sortable="custom">
              <template #header>
                病假
                <br />
                (小时)
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="考勤异常">
            <el-table-column min-width="100" prop="sWorkCount" sortable="custom">
              <template #header>
                上班缺卡
                <br />
                (次)
              </template>
            </el-table-column>
            <el-table-column min-width="100" prop="xWorkCount" sortable="custom">
              <template #header>
                下班缺卡
                <br />
                (次)
              </template>
            </el-table-column>
            <el-table-column min-width="90" prop="absenteeismCount" sortable="custom">
              <template #header>
                旷工
                <br />
                (天)
              </template>
            </el-table-column>
            <el-table-column min-width="90" prop="leaveEarlyCount" sortable="custom">
              <template #header>
                早退
                <br />
                (次)
              </template>
            </el-table-column>
            <el-table-column min-width="100" prop="leaveEarlyDuration" sortable="custom">
              <template #header>
                早退时长
                <br />
                (小时)
              </template>
            </el-table-column>
            <el-table-column min-width="90" prop="lateCount" sortable="custom">
              <template #header>
                迟到
                <br />
                (次数)
              </template>
            </el-table-column>
            <el-table-column min-width="100" prop="seriousLateCount" sortable="custom">
              <template #header>
                严重迟到
                <br />
                (次数)
              </template>
            </el-table-column>
            <el-table-column min-width="100" prop="lateDuration" sortable="custom">
              <template #header>
                迟到时长
                <br />
                (小时)
              </template>
            </el-table-column>
            <el-table-column min-width="130" prop="seriousLateDuration" sortable="custom">
              <template #header>
                严重迟到时长
                <br />
                (小时)
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="总奖金" min-width="110" prop="totalBonus" sortable="custom">
            <template #default="{ row }">
              {{ handleCalculateTotalBonus(row) }}
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" />
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
      <el-tab-pane label="全员概览" :name="1" />
      <el-tab-pane label="产品经理" :name="2">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline @submit.prevent>
              <el-form-item>
                <el-date-picker
                  v-model="assessmentDate"
                  style="max-width: 300px"
                  type="monthrange"
                  value-format="YYYY-MM"
                  @change="queryAssessmentData"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  v-permissions="{ permission: [PerformanceStatisticsPermission.ASSESSMENT_SETTING] }"
                  type="primary"
                  @click="showSetting"
                >
                  考核数设定
                </el-button>
                <el-button
                  v-permissions="{ permission: [PerformanceStatisticsPermission.PARAMETER_SETTING] }"
                  type="primary"
                  @click="showParameterSettings"
                >
                  参数设定
                </el-button>
                <el-button
                  v-permissions="{ permission: [PerformanceStatisticsPermission.ADJUST_DETAIL] }"
                  type="primary"
                  @click="adjustDetailVisible = true"
                >
                  调整明细
                </el-button>
                <el-button
                  v-permissions="{ permission: [PerformanceStatisticsPermission.ASSESSMENT_CHECKOUT] }"
                  type="primary"
                  @click="showCheckout"
                >
                  考核数结账
                </el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="assessmentQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="assessmentQueryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryAssessmentData"
                  @keyup.enter="queryAssessmentData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryAssessmentData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-style="cell3Style"
          :data="assessmentList"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
        >
          <el-table-column label="月份" min-width="100" prop="month" />
          <el-table-column label="姓名" min-width="100" prop="userName" />
          <el-table-column label="角色" min-width="120" prop="roleName" />
          <el-table-column label="职级" min-width="100" prop="jobLevel" />
          <el-table-column label="总考核完成数" min-width="120">
            <template #default="{ row }">{{ row.assessmentNumberFinish }} / {{ row.assessmentNumber }}</template>
          </el-table-column>
          <el-table-column label="OEM完成数" min-width="110">
            <template #default="{ row }">{{ row.oemFinish }} / {{ row.oem }}</template>
          </el-table-column>
          <el-table-column label="免考核" min-width="100" prop="noAssessment">
            <template #default="{ row }">
              <el-checkbox v-model="row.noAssessment" :false-value="0" :true-value="1" @change="handleChangeNoAssessment(row)" />
            </template>
          </el-table-column>
          <el-table-column label="未达标" min-width="100" prop="belowTarget">
            <template #default="{ row }">
              <el-checkbox v-model="row.belowTarget" disabled :false-value="0" :true-value="1" />
            </template>
          </el-table-column>
          <el-table-column label="新款采购额" min-width="110" prop="purchaseAmount" />
          <el-table-column label="新款评估跑分次数" min-width="145" prop="runsNumbers" />
          <el-table-column label="新品进度记录数" min-width="130" prop="progressNumbers" />
          <el-table-column label="拿样次数" min-width="100" prop="samplingFrequency" />
          <el-table-column label="侵权产品数" min-width="110" prop="infringementProductNumber" />
          <el-table-column label="下架产品数" min-width="110" prop="removeProductNumber" />
          <el-table-column label="销毁货值" min-width="100" prop="destroyGoodsValue" />
          <el-table-column min-width="120" prop="sixPastCommission">
            <template #header>
              过去6个月
              <br />
              月均产品提成
            </template>
          </el-table-column>
          <el-table-column min-width="155" prop="newProductCommission">
            <template #header>
              过去6个月月均
              <br />
              上线1年内新品提成
            </template>
          </el-table-column>
          <el-table-column label="总开发数" min-width="100" prop="totalNumber" />
          <el-table-column label="总停产数" min-width="100" prop="totalStopNumber" />
          <el-table-column label="停产%" min-width="90" prop="stopPercentage" />
          <el-table-column min-width="120" prop="newProductOneYearCommission">
            <template #header>
              上新1年内
              <br />
              产品提成
            </template>
          </el-table-column>
          <el-table-column label="当月产品总提成" min-width="130" prop="developmentDesign" />
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="assessmentQueryForm.pageNo"
          :page-size="assessmentQueryForm.pageSize"
          :total="assessmentTotal"
          @current-change="handleAssessmentCurrentChange"
          @size-change="handleAssessmentSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="打包" :name="3">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-date-picker v-model="date" style="max-width: 300px" type="monthrange" value-format="YYYY-MM" @change="queryData" />
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
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-style="{ textAlign: 'center' }"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
        >
          <el-table-column label="基本信息">
            <el-table-column label="月份" min-width="100" prop="month" />
            <el-table-column label="姓名" min-width="100" prop="userName" />
            <el-table-column label="角色" min-width="130" prop="roleName" />
          </el-table-column>

          <el-table-column label="打包时长(小时)" min-width="100" prop="packageDuration" />

          <template #empty>
            <el-empty class="vab-data-empty" />
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
      <el-tab-pane label="产品设计" :name="4">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-date-picker
              v-model="date"
              style="max-width: 300px"
              type="monthrange"
              value-format="YYYY-MM"
              @change="productDesignQueryData"
            />
            <el-select
              v-model="productDesignQueryForm.roleIdList"
              multiple
              placeholder="请选择角色"
              style="margin-left: 20px; width: 600px"
              @change="handleProductDesignRoleChange"
            >
              <template #header>
                <el-checkbox
                  v-model="productDesignCheckAll"
                  :indeterminate="productDesignIndeterminate"
                  @change="handleProductDesignCheckAll"
                >
                  全部
                </el-checkbox>
              </template>
              <el-option v-for="item in roleList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="productDesignQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="productDesignQueryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="productDesignQueryData"
                  @keyup.enter="productDesignQueryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="productDesignQueryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-style="{ textAlign: 'center' }"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @sort-change="handleSortChange"
        >
          <el-table-column label="基本信息">
            <el-table-column label="月份" min-width="100" prop="month" />
            <el-table-column label="姓名" min-width="100" prop="userName" />
            <el-table-column label="角色" min-width="130" prop="roleName" />
          </el-table-column>

          <el-table-column label="产品开发设计" min-width="130" prop="developmentDesign" sortable="custom" />

          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="productDesignQueryForm.pageNo"
          :page-size="productDesignQueryForm.pageSize"
          :total="total"
          @current-change="handleProductDesignCurrentChange"
          @size-change="handleProductDesignSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="平面设计" :name="5">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-date-picker v-model="date" style="max-width: 300px" type="monthrange" value-format="YYYY-MM" @change="artDesignQueryData" />
            <el-select
              v-model="artDesignQueryForm.roleIdList"
              multiple
              placeholder="请选择角色"
              style="margin-left: 20px; width: 600px"
              @change="handleArtDesignRoleChange"
            >
              <template #header>
                <el-checkbox v-model="artDesignCheckAll" :indeterminate="artDesignIndeterminate" @change="handleArtDesignCheckAll">
                  全部
                </el-checkbox>
              </template>
              <el-option v-for="item in roleList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="artDesignQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="artDesignQueryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="artDesignQueryData"
                  @keyup.enter="artDesignQueryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="artDesignQueryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-style="{ textAlign: 'center' }"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @sort-change="handleSortChange"
        >
          <el-table-column label="基本信息">
            <el-table-column label="月份" min-width="100" prop="month" />
            <el-table-column label="姓名" min-width="100" prop="userName" />
            <el-table-column label="角色" min-width="130" prop="roleName" />
          </el-table-column>

          <el-table-column label="美工图片" min-width="100" prop="artDesignPicture" sortable="custom" />
          <el-table-column label="美工长期" min-width="100" prop="artDesignLongTime" sortable="custom" />
          <el-table-column label="新品任务数" min-width="110" prop="newProductTaskCount" sortable />
          <el-table-column label="老品任务数" min-width="110" prop="oldProductTaskCount" sortable />
          <el-table-column label="临时任务数" min-width="110" prop="tempTaskCount" sortable />
          <el-table-column label="设计任务数" min-width="110" prop="designTaskCount" sortable />
          <el-table-column
            label="新品任务按时完成率"
            min-width="145"
            prop="newProductOnTimeRate"
            :sort-method="(a, b) => (a.newProductOnTimeRate ?? 0) - (b.newProductOnTimeRate ?? 0)"
            sortable
          >
            <template #default="{ row }">
              <span>{{ row.newProductOnTimeRate != null ? `${row.newProductOnTimeRate}%` : '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="老品任务按时完成率"
            min-width="145"
            prop="oldProductOnTimeRate"
            :sort-method="(a, b) => (a.oldProductOnTimeRate ?? 0) - (b.oldProductOnTimeRate ?? 0)"
            sortable
          >
            <template #default="{ row }">
              <span>{{ row.oldProductOnTimeRate != null ? `${row.oldProductOnTimeRate}%` : '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="临时任务按时完成率"
            min-width="145"
            prop="tempTaskOnTimeRate"
            :sort-method="(a, b) => (a.tempTaskOnTimeRate ?? 0) - (b.tempTaskOnTimeRate ?? 0)"
            sortable
          >
            <template #default="{ row }">
              <span>{{ row.tempTaskOnTimeRate != null ? `${row.tempTaskOnTimeRate}%` : '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="设计任务按时完成率"
            min-width="145"
            prop="designTaskOnTimeRate"
            :sort-method="(a, b) => (a.designTaskOnTimeRate ?? 0) - (b.designTaskOnTimeRate ?? 0)"
            sortable
          >
            <template #default="{ row }">
              <span>{{ row.designTaskOnTimeRate != null ? `${row.designTaskOnTimeRate}%` : '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="任务总数" min-width="100" prop="totalTaskCount" sortable />
          <el-table-column
            label="总按时完成率"
            min-width="120"
            prop="totalOnTimeRate"
            :sort-method="(a, b) => (a.totalOnTimeRate ?? 0) - (b.totalOnTimeRate ?? 0)"
            sortable
          >
            <template #default="{ row }">
              <span>{{ row.totalOnTimeRate != null ? `${row.totalOnTimeRate}%` : '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-link type="primary" underline="never" @click="showArtDesignTaskDetail(row)">任务明细</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="artDesignQueryForm.pageNo"
          :page-size="artDesignQueryForm.pageSize"
          :total="total"
          @current-change="handleArtDesignCurrentChange"
          @size-change="handleArtDesignSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="采购" :name="6">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-date-picker v-model="date" style="max-width: 300px" type="monthrange" value-format="YYYY-MM" @change="queryData" />
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
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-style="{ textAlign: 'center' }"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
        >
          <el-table-column label="基本信息">
            <el-table-column label="月份" min-width="100" prop="month" />
            <el-table-column label="姓名" min-width="100" prop="userName" />
            <el-table-column label="角色" min-width="130" prop="roleName" />
          </el-table-column>

          <el-table-column label="采购奖金" min-width="100" prop="procurementBonus" />
          <el-table-column label="采购奖金跨月调整" min-width="100" prop="procurementBonusCrossMonth">
            <template #default="{ row }">
              <span :class="{ 'negative-value': row.procurementBonusCrossMonth < 0 }">
                {{ row.procurementBonusCrossMonth ?? '' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="采购降本" min-width="100" prop="procurementCostReduction" />
          <el-table-column label="退税奖金" min-width="100" prop="taxRefundPrice" />

          <template #empty>
            <el-empty class="vab-data-empty" />
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
      <el-tab-pane label="主管" :name="7">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-date-picker
              v-model="date"
              style="max-width: 300px"
              type="monthrange"
              value-format="YYYY-MM"
              @change="supervisorQueryData"
            />
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="supervisorQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="supervisorQueryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="supervisorQueryData"
                  @keyup.enter="supervisorQueryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="supervisorQueryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-style="{ textAlign: 'center' }"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          :span-method="objectSpanMethod"
          stripe
        >
          <el-table-column label="基本信息">
            <el-table-column label="月份" min-width="100" prop="month" />
            <el-table-column label="姓名" min-width="100" prop="manageUserName" />
            <el-table-column label="职级" min-width="100" prop="jobTitle" />
            <el-table-column label="角色" min-width="130" prop="roleName" />
            <el-table-column label="直属下级" min-width="130" prop="userName" />
            <el-table-column label="直属下级新品提成" min-width="130" prop="newCommissionBonus" />
            <el-table-column label="新品管理奖金" min-width="130" prop="newBonus" />
            <el-table-column label="直属下级总提成" min-width="130" prop="totalCommissionBonus" />
            <el-table-column label="管理奖金比例" min-width="130" prop="proportion" />
            <el-table-column label="管理奖金明细" min-width="130" prop="managementBonus" />
            <el-table-column label="管理奖金" min-width="130" prop="totalManagementBonus" />
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="supervisorQueryForm.pageNo"
          :page-size="supervisorQueryForm.pageSize"
          :total="total"
          @current-change="handleSupervisorCurrentChange"
          @size-change="handleSupervisorSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="运营" :name="8">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-date-picker v-model="date" style="max-width: 300px" type="monthrange" value-format="YYYY-MM" @change="operationQueryData" />
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="operationQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="operationQueryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="operationQueryData"
                  @keyup.enter="operationQueryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="operationQueryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-style="{ textAlign: 'center' }"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
        >
          <el-table-column label="基本信息">
            <el-table-column label="月份" min-width="100" prop="month" />
            <el-table-column label="姓名" min-width="100" prop="manageUserName" />
            <el-table-column label="职级" min-width="100" prop="jobTitle" />
            <el-table-column label="角色" min-width="130" prop="roleName" />
            <el-table-column label="过去6个月月均产品提成" min-width="120" prop="sixPastCommission" />
            <el-table-column label="过去6个月月均上线1年内新品提成" min-width="155" prop="newProductCommission" />
            <el-table-column label="运营奖金" min-width="130" prop="totalManagementBonus" />
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="operationQueryForm.pageNo"
          :page-size="operationQueryForm.pageSize"
          :total="total"
          @current-change="handleOperationCurrentChange"
          @size-change="handleOperationSizeChange"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 考核数设定 -->
    <vab-dialog v-model="settingVisible" :draggable="false" title="产品经理考核设定和追踪" top="10vh" width="60%">
      <vab-query-form>
        <vab-query-form-right-panel :span="24">
          <el-form inline :model="settingQueryForm" @submit.prevent>
            <el-form-item>
              <el-input
                v-model.trim="settingQueryForm.keyWord"
                clearable
                placeholder="请输入搜索关键词"
                @input="querySettingData"
                @keyup.enter="querySettingData"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="settingListLoading" type="primary" @click="querySettingData" />
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table
        v-loading="settingListLoading"
        border
        :cell-style="cellStyle"
        class="noneHoverTable"
        :data="settingList"
        :header-cell-style="{ textAlign: 'center' }"
        max-height="700"
        stripe
        @cell-click="changeInput"
      >
        <el-table-column label="姓名" min-width="100" prop="userName" />
        <el-table-column label="月份" min-width="100" prop="month" />
        <el-table-column label="实际总完成数" min-width="130" prop="assessmentNumberFinish" />
        <el-table-column label="实际总考核数" min-width="130" prop="assessmentNumber">
          <!-- <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.assessmentNumber" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.assessmentNumber }}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="实际OEM完成数" min-width="140" prop="oemFinish" />
        <el-table-column label="实际OEM考核数" min-width="140" prop="oem">
          <!-- <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.oem" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.oem }}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="原始总考核数" min-width="120" prop="originalAssessmentNumber" />
        <el-table-column label="原始OEM考核数" min-width="140" prop="originalOem" />
        <el-table-column label="原始总完成数" min-width="120" prop="originalAssessmentNumberFinish" />
        <el-table-column label="原始OEM完成数" min-width="140" prop="originalOemFinish" />
        <el-table-column label="免考核" min-width="120" prop="noAssessment">
          <template #default="{ row }">
            <el-checkbox v-model="row.noAssessment" :false-value="0" :true-value="1" @change="handleChangeSettingStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="考核未达标" min-width="120" prop="status">
          <template #default="{ row }">
            <el-checkbox v-model="row.status" :false-value="0" :true-value="1" @change="handleChangeSettingStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template #default="{ row }">
            <el-link type="primary" underline="never" @click="showViewDetail(row)">查看调整明细</el-link>
          </template>
        </el-table-column>
      </el-table>
      <vab-pagination
        :current-page="settingQueryForm.pageNo"
        :page-size="settingQueryForm.pageSize"
        :total="settingTotal"
        @current-change="handleSettingCurrentChange"
        @size-change="handleSettingSizeChange"
      />
    </vab-dialog>
    <!-- 调整明细-->
    <adjust-detail-dialog v-model="adjustDetailVisible" :edit-disabled="false" @query-data="fetchAssessmentData" />
    <!-- 对应月份 对应人员调整明细 -->
    <vab-dialog v-model="viewDetailVisible" title="调整明细">
      <el-table border :cell-style="{ textAlign: 'center' }" :data="detailList" :header-cell-style="{ textAlign: 'center' }" stripe>
        <el-table-column label="月份" prop="month" />
        <el-table-column label="被调整人" prop="userName" />
        <el-table-column label="类型" prop="type">
          <template #default="{ row }">
            {{ row.type === 0 ? '考核数' : '完成数' }}
          </template>
        </el-table-column>
        <el-table-column label="调整数量" prop="adjustQuantity" />
        <el-table-column label="OEM">
          <template #default="{ row }">
            <el-checkbox v-model="row.oem" disabled :false-value="0" :true-value="1" />
          </template>
        </el-table-column>
        <el-table-column label="父体" prop="parent" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="来源" prop="source" />
        <template #empty>
          <el-empty class="vab-data-empty" style="min-height: 200px" />
        </template>
      </el-table>
    </vab-dialog>
    <!-- 参数设定 -->
    <parameter-settings-dialog v-model="parameterSettingsVisible" />
    <!-- 考核数结账 -->
    <vab-dialog v-model="checkoutVisible" title="考核数结账" width="15%" @close="closeCheckout">
      <el-form label-position="top">
        <el-form-item label="请选择结账人员">
          <el-select v-model="userIdList" multiple placeholder="请选择结账人员">
            <el-option v-for="item in productManagerList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="请选择结账月份">
          <el-date-picker v-model="checkoutDate" placeholder="请选择月份" style="min-width: 100%" type="month" value-format="YYYY-MM" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleCheckout">结账</el-button>
      </template>
    </vab-dialog>
    <!-- 任务明细 -->
    <art-design-task-detail-dialog v-model="artDesignTaskDetailVisible" :list="artDesignTaskDetailList" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { getDevelopDesignDetailRoleList } from '/@/api/devlocal/commission'
import { downloadFilePD } from '/@/api/devlocal/download'
import { getArtDesignTaskDetail } from '/@/api/devlocal/imageTask'
import {
  checkoutAssessmentNumber,
  getAdjustDetailByUser,
  getAssessmentList,
  getProductManager,
  getProductManagerAssessmentList,
  getUserAttendanceList,
  getUserAttendanceListBySupervisor,
  updateProductManagerAssessment,
  updateProductManagerNoAssessment,
} from '/@/api/devlocal/performanceStatistics'
import PerformanceStatisticsPermission from '/@/permissions/performanceStatistics'
import {
  IGetAdjustDetail,
  IGetAssessmentList,
  IGetAssessmentListReq,
  IGetProductManagerAssessmentList,
  IGetUserAttendanceList,
  IGetUserAttendanceManagementList,
} from '/@/type/employeeManagement/performanceStatistics'
import { IGetArtDesignTaskList } from '/@/type/listingTask/imageTaskType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

defineOptions({
  name: 'PerformanceStatistics',
})

// 对应调整明细
const viewDetailVisible = ref<boolean>(false)
const detailList = ref<IGetAdjustDetail[]>([])
const showViewDetail = async (row: IGetProductManagerAssessmentList) => {
  const { data } = await getAdjustDetailByUser({
    userId: row.userId,
    month: row.month!,
  })
  detailList.value = data
  viewDetailVisible.value = true
}
// 考核数结账
const checkoutVisible = ref<boolean>(false)
const productManagerList = ref<{ id: number; label: string }[]>([])
const showCheckout = async () => {
  const { data } = await getProductManager()
  productManagerList.value = data
  checkoutVisible.value = true
}
const closeCheckout = () => {
  userIdList.value = []
  checkoutVisible.value = false
}
const handleCheckout = async () => {
  if (userIdList.value.length === 0) {
    $baseMessage('您未选择任何人员进行结账！', 'warning')
    return
  }
  // console.log(checkoutDate.value)

  // 检查结账日期是否有效
  if (!checkoutDate.value) {
    $baseMessage('请选择结账月份！', 'warning')
    return
  }

  const { data } = await checkoutAssessmentNumber({
    userIdList: userIdList.value,
    checkoutMonth: checkoutDate.value,
  })
  if (data) {
    $baseMessage('考核数结账成功且发送邮件成功！', 'success')
    checkoutVisible.value = false
    fetchAssessmentData()
  }
}
const userIdList = ref<number[]>([])
// 调整明细
const adjustDetailVisible = ref<boolean>(false)
// 参数设定
const parameterSettingsVisible = ref<boolean>(false)
const showParameterSettings = () => {
  parameterSettingsVisible.value = true
}

const activeName = ref<number>(0)
/* ============================== 考勤明细变量 ============================== */
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const date = ref<[string, string]>(['', ''])
const queryForm = reactive<IGetAssessmentListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  startDate: '',
  endDate: '',
  status: 0,
  orderByField: 'month',
  orderDirection: 'desc',
})
// 平面设计 tab 专用的查询表单
const artDesignQueryForm = reactive<IGetAssessmentListReq & { roleIdList?: number[] }>({
  keyWord: '',
  pageNo: 1,
  pageSize: 50,
  startDate: '',
  endDate: '',
  status: 5,
  orderByField: 'month',
  orderDirection: 'desc',
  roleIdList: [],
})
// 产品设计 tab 专用的查询表单
const productDesignQueryForm = reactive<IGetAssessmentListReq & { roleIdList?: number[] }>({
  keyWord: '',
  pageNo: 1,
  pageSize: 50,
  startDate: '',
  endDate: '',
  status: 4,
  orderByField: 'month',
  orderDirection: 'desc',
  roleIdList: [],
})
// 主管 tab 专用的查询表单
const supervisorQueryForm = reactive<IGetAssessmentListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  startDate: '',
  endDate: '',
  orderByField: 'month',
  orderDirection: 'desc',
})
const list = ref<IGetUserAttendanceManagementList[]>([])
// 运营 tab 查询表单
const operationQueryForm = reactive<IGetAssessmentListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  startDate: '',
  endDate: '',
  orderByField: 'month',
  orderDirection: 'desc',
})
/* ============================== 考核数设定变量 ============================== */
const settingVisible = ref<boolean>(false)
const settingQueryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const settingTotal = ref<number>(0)
const settingListLoading = ref<boolean>(false)
const settingList = ref<IGetProductManagerAssessmentList[]>([])
let copyRow: any
/* ============================== 产品经理考核变量 ============================== */
const assessmentDate = ref<[string, string]>(['', ''])
// 结账月份
const checkoutDate = ref<string | null>(null)
const assessmentQueryForm = reactive<IGetAssessmentListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  startDate: '',
  endDate: '',
})
const assessmentList = ref<IGetAssessmentList[]>([])
const assessmentTotal = ref<number>(0)

/* ============================== 产品经理考核列表数据 ============================== */
const fetchAssessmentData = async () => {
  listLoading.value = true
  assessmentQueryForm.startDate = assessmentDate.value[0]
  assessmentQueryForm.endDate = assessmentDate.value[1]
  const { data } = await getAssessmentList(assessmentQueryForm)
  assessmentTotal.value = data.total
  assessmentList.value = data.list
  listLoading.value = false
}
const queryAssessmentData = () => {
  assessmentQueryForm.pageNo = 1
  fetchAssessmentData()
}
const handleAssessmentCurrentChange = (value: number) => {
  assessmentQueryForm.pageNo = value
  fetchAssessmentData()
}
const handleAssessmentSizeChange = (value: number) => {
  assessmentQueryForm.pageNo = 1
  assessmentQueryForm.pageSize = value
  fetchAssessmentData()
}

/* ============================== 考核数设定获取数据  ============================== */
const fetchSettingData = async () => {
  settingListLoading.value = true
  const { data } = await getProductManagerAssessmentList(settingQueryForm)
  settingTotal.value = data.total
  settingList.value = data.list
  settingListLoading.value = false
}
const querySettingData = () => {
  settingQueryForm.pageNo = 1
  fetchSettingData()
}
// 展示考核数设定
const showSetting = () => {
  settingVisible.value = true
  fetchSettingData()
}
const handleSettingCurrentChange = (value: number) => {
  settingQueryForm.pageNo = value
  fetchSettingData()
}
const handleSettingSizeChange = (value: number) => {
  settingQueryForm.pageNo = 1
  settingQueryForm.pageSize = value
  fetchSettingData()
}

const generateLoading = ref<boolean>(false)

const userAttendanceExport = async () => {
  try {
    generateLoading.value = true
    const response = await downloadFilePD('/user/attendance/export', {
      startDate: date.value[0],
      endDate: date.value[1],
    })

    // 如果返回的是 JSON 类型，说明可能是错误信息
    if (response.type === 'application/json') {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        const result = JSON.parse(reader.result as string)
        if (result.code === 5000) {
          $baseMessage(result.msg, 'error')
        }
      })
      reader.readAsText(response)
    }
    generateLoading.value = false
  } catch (error) {
    console.error(error)
    $baseMessage('下载失败，请稍后重试', 'error')
    generateLoading.value = false
  }
}

const changeInput = async (row: IGetProductManagerAssessmentList, column: any, cell: HTMLTableCellElement) => {
  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  copyRow = JSON.parse(JSON.stringify(row))

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')
    focusAndSelectInput(cell)
  }
}
// 考核数设定修改
const clickCancel = async (event: any, value: IGetProductManagerAssessmentList) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    try {
      await updateProductManagerAssessment({
        id: value.id,
        oem: value.oem,
        totalAssessment: value.assessmentNumber,
        status: value.status,
      })
    } catch {
      Object.assign(value, copyRow)
    }
  }
}
// 修改考核数设定的status
const handleChangeSettingStatus = async (row: IGetProductManagerAssessmentList) => {
  await updateProductManagerAssessment({
    id: row.id,
    status: row.status,
    oem: row.oem,
    totalAssessment: row.assessmentNumber,
    noAssessment: row.noAssessment,
  })
}
/* ============================== 考勤明细数据 ============================== */
const fetchData = async () => {
  listLoading.value = true
  queryForm.startDate = date.value[0]
  queryForm.endDate = date.value[1]
  const { data } = await getUserAttendanceList(queryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
// 平面设计 tab 的查询函数
const artDesignQueryData = () => {
  artDesignQueryForm.pageNo = 1
  artDesignQueryForm.startDate = date.value[0]
  artDesignQueryForm.endDate = date.value[1]
  fetchArtDesignData()
}
// 平面设计 tab 的数据获取函数
const fetchArtDesignData = async () => {
  listLoading.value = true
  const { data } = await getUserAttendanceList(artDesignQueryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
}
// 平面设计 tab 的分页处理函数
const handleArtDesignCurrentChange = (value: number) => {
  artDesignQueryForm.pageNo = value
  fetchArtDesignData()
}
const handleArtDesignSizeChange = (value: number) => {
  artDesignQueryForm.pageNo = 1
  artDesignQueryForm.pageSize = value
  fetchArtDesignData()
}
// 产品设计 tab 的查询函数
const productDesignQueryData = () => {
  productDesignQueryForm.pageNo = 1
  productDesignQueryForm.startDate = date.value[0]
  productDesignQueryForm.endDate = date.value[1]
  fetchProductDesignData()
}
// 产品设计 tab 的数据获取函数
const fetchProductDesignData = async () => {
  listLoading.value = true
  const { data } = await getUserAttendanceList(productDesignQueryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
}
// 产品设计 tab 的分页处理函数
const handleProductDesignCurrentChange = (value: number) => {
  productDesignQueryForm.pageNo = value
  fetchProductDesignData()
}
const handleProductDesignSizeChange = (value: number) => {
  productDesignQueryForm.pageNo = 1
  productDesignQueryForm.pageSize = value
  fetchProductDesignData()
}
// 主管 tab 的查询函数
const supervisorQueryData = () => {
  supervisorQueryForm.pageNo = 1
  supervisorQueryForm.startDate = date.value[0]
  supervisorQueryForm.endDate = date.value[1]
  fetchSupervisorData()
}
// 主管 tab 的数据获取函数
const fetchSupervisorData = async () => {
  listLoading.value = true
  const { data } = await getUserAttendanceListBySupervisor(supervisorQueryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
}
// 主管 tab 的分页处理函数
const handleSupervisorCurrentChange = (value: number) => {
  supervisorQueryForm.pageNo = value
  fetchSupervisorData()
}
const handleSupervisorSizeChange = (value: number) => {
  supervisorQueryForm.pageNo = 1
  supervisorQueryForm.pageSize = value
  fetchSupervisorData()
}
// 运营tab的查询函数
const operationQueryData = () => {
  operationQueryForm.pageNo = 1
  operationQueryForm.startDate = date.value[0]
  operationQueryForm.endDate = date.value[1]
  fetchOperationData()
}
// 运营tab的数据获取函数
const fetchOperationData = async () => {
  listLoading.value = true
  // const { data } = await getUserAttendanceList(operationQueryForm)
  // total.value = data.total
  // list.value = data.list
  listLoading.value = false
}
// 运营tab的分页处理函数
const handleOperationCurrentChange = (value: number) => {
  operationQueryForm.pageNo = value
  fetchOperationData()
}
const handleOperationSizeChange = (value: number) => {
  operationQueryForm.pageNo = 1
  operationQueryForm.pageSize = value
  fetchOperationData()
}
const handleChangeNoAssessment = async (row: IGetUserAttendanceList) => {
  await updateProductManagerNoAssessment({
    id: row.id!,
    status: row.noAssessment!,
  })
}
// 计算每行总奖金
const handleCalculateTotalBonus = (row: IGetUserAttendanceList) => {
  let totalBonus = 0
  if (row.procurementBonus != null) totalBonus += row.procurementBonus
  if (row.procurementCostReduction != null) totalBonus += row.procurementCostReduction
  if (row.artDesignPicture != null) totalBonus += row.artDesignPicture
  if (row.artDesignLongTime != null) totalBonus += row.artDesignLongTime
  if (row.developmentDesign != null) totalBonus += row.developmentDesign
  if (row.procurementBonusCrossMonth != null) totalBonus += row.procurementBonusCrossMonth
  if (row.taxRefundPrice != null) totalBonus += row.taxRefundPrice
  if (row.managementBonus != null) totalBonus += row.managementBonus
  return totalBonus.toFixed(2)
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  // const index = data.columnIndex
  // if (index === 0 || index === 1 || index === 2 || index === 4) {
  //   return {
  //     textAlign: 'center',
  //     cursor: 'not-allowed',
  //   }
  // } else if (index === 3 || index === 5) {
  //   return {
  //     textAlign: 'center',
  //     cursor: 'pointer',
  //   }
  // }
  return {
    textAlign: 'center',
  }
}
const cell3Style = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === '总考核完成数') {
    if (data.row.assessmentNumberFinish > data.row.assessmentNumber) {
      return {
        color: 'var(--el-color-success)',
        textAlign: 'center',
      }
    } else if (data.row.assessmentNumberFinish === data.row.assessmentNumber) {
      return {
        color: 'var(--el-color-primary)',
        textAlign: 'center',
      }
    } else {
      return {
        color: 'var(--el-color-danger)',
        textAlign: 'center',
      }
    }
  } else if (label === 'OEM完成数') {
    if (data.row.oemFinish >= data.row.oem) {
      return {
        color: 'var(--el-color-success)',
        textAlign: 'center',
      }
    } else if (data.row.oemFinish === data.row.oem) {
      return {
        color: 'var(--el-color-primary)',
        textAlign: 'center',
      }
    } else {
      return {
        color: 'var(--el-color-danger)',
        textAlign: 'center',
      }
    }
  }
  return {
    textAlign: 'center',
  }
}
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  // console.log(prop, order)

  // 平面设计 tab 的前端排序列（不需要调用后端接口）
  const frontendSortProps = [
    'newProductTaskCount',
    'oldProductTaskCount',
    'tempTaskCount',
    'designTaskCount',
    'newProductOnTimeRate',
    'oldProductOnTimeRate',
    'tempTaskOnTimeRate',
    'designTaskOnTimeRate',
    'totalTaskCount',
    'totalOnTimeRate',
  ]

  // 如果是前端排序列，直接返回，不调用后端接口
  if ((activeName.value === 4 || activeName.value === 5) && frontendSortProps.includes(prop)) {
    return
  }

  // 根据当前 tab 选择使用哪个 queryForm
  let currentForm = queryForm
  if (activeName.value === 4) {
    currentForm = productDesignQueryForm
  } else if (activeName.value === 5) {
    currentForm = artDesignQueryForm
  }
  if (currentForm.orderByField === prop) {
    if (!order) {
      if (currentForm.orderDirection === 'asc') {
        column.order = 'descending'
      } else if (currentForm.orderDirection === 'desc') {
        column.order = 'ascending'
      }
    }
  } else {
    column.order = 'descending'
  }
  currentForm.orderByField = prop
  currentForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  if (activeName.value === 4) {
    productDesignQueryData()
  } else if (activeName.value === 5) {
    artDesignQueryData()
  } else {
    queryData()
  }
}
// -------------------------- 平面设计 --------------------------
const artDesignTaskDetailVisible = ref<boolean>(false)
const artDesignTaskDetailList = ref<IGetArtDesignTaskList[]>([])
const showArtDesignTaskDetail = async (row: any) => {
  artDesignTaskDetailVisible.value = true
  const { data } = await getArtDesignTaskDetail({ userId: row.userId, month: row.month })
  artDesignTaskDetailList.value = data
}
const roleList = ref<{ id: number; label: string }[]>([])
// 产品设计 tab 的全选状态计算属性
const productDesignCheckAll = computed({
  get: () => {
    if (!roleList.value.length || !productDesignQueryForm.roleIdList) return false
    // 排除"全部"选项（如果有的话），只计算实际角色选项
    const validRoleIds = roleList.value.map((item) => item.id)
    return (
      productDesignQueryForm.roleIdList.length > 0 &&
      productDesignQueryForm.roleIdList.length === validRoleIds.length &&
      productDesignQueryForm.roleIdList.every((id) => validRoleIds.includes(id))
    )
  },
  set: (val: boolean) => {
    // 这个 setter 不会被直接调用，由 handleProductDesignCheckAll 处理
  },
})

// 产品设计 tab 的半选状态计算属性
const productDesignIndeterminate = computed(() => {
  if (!roleList.value.length || !productDesignQueryForm.roleIdList) return false
  const validRoleIds = roleList.value.map((item) => item.id)
  const selectedCount = productDesignQueryForm.roleIdList.filter((id) => validRoleIds.includes(id)).length
  return selectedCount > 0 && selectedCount < validRoleIds.length
})

// 处理产品设计 tab 的全选/取消全选
const handleProductDesignCheckAll = (val: boolean | string | number) => {
  if (Boolean(val)) {
    // 全选：选择所有角色
    productDesignQueryForm.roleIdList = roleList.value.map((item) => item.id)
  } else {
    // 取消全选：清空选择
    productDesignQueryForm.roleIdList = []
  }
  productDesignQueryData()
}

// 处理产品设计 tab 的角色选择变化
const handleProductDesignRoleChange = (value: number[]) => {
  productDesignQueryForm.roleIdList = value
  productDesignQueryData()
}

// 平面设计 tab 的全选状态计算属性
const artDesignCheckAll = computed({
  get: () => {
    if (!roleList.value.length || !artDesignQueryForm.roleIdList) return false
    // 排除"全部"选项（如果有的话），只计算实际角色选项
    const validRoleIds = roleList.value.map((item) => item.id)
    return (
      artDesignQueryForm.roleIdList.length > 0 &&
      artDesignQueryForm.roleIdList.length === validRoleIds.length &&
      artDesignQueryForm.roleIdList.every((id) => validRoleIds.includes(id))
    )
  },
  set: (val: boolean) => {
    // 这个 setter 不会被直接调用，由 handleArtDesignCheckAll 处理
  },
})

// 平面设计 tab 的半选状态计算属性
const artDesignIndeterminate = computed(() => {
  if (!roleList.value.length || !artDesignQueryForm.roleIdList) return false
  const validRoleIds = roleList.value.map((item) => item.id)
  const selectedCount = artDesignQueryForm.roleIdList.filter((id) => validRoleIds.includes(id)).length
  return selectedCount > 0 && selectedCount < validRoleIds.length
})

// 处理平面设计 tab 的全选/取消全选
const handleArtDesignCheckAll = (val: boolean | string | number) => {
  if (Boolean(val)) {
    // 全选：选择所有角色
    artDesignQueryForm.roleIdList = roleList.value.map((item) => item.id)
  } else {
    // 取消全选：清空选择
    artDesignQueryForm.roleIdList = []
  }
  artDesignQueryData()
}

// 处理平面设计 tab 的角色选择变化
const handleArtDesignRoleChange = (value: number[]) => {
  artDesignQueryForm.roleIdList = value
  artDesignQueryData()
}

const fetchArtDesignRoleList = async () => {
  const { data } = await getDevelopDesignDetailRoleList()
  roleList.value = data
  // 默认选择"平面设计主管"和"平面设计"（用于平面设计 tab）
  const artDesignDefaultRoleIds: number[] = []
  const artDesignManager = roleList.value.find((item) => item.label === '平面设计主管')
  const artDesign = roleList.value.find((item) => item.label === '平面设计')
  if (artDesignManager) artDesignDefaultRoleIds.push(artDesignManager.id)
  if (artDesign) artDesignDefaultRoleIds.push(artDesign.id)
  artDesignQueryForm.roleIdList = artDesignDefaultRoleIds.length > 0 ? artDesignDefaultRoleIds : []

  // 默认选择"工业设计"、"产品经理主管"、"产品经理"、"平面设计主管"和"平面设计"（用于产品设计 tab）
  const productDesignDefaultRoleIds: number[] = []
  const industrialDesign = roleList.value.find((item) => item.label === '工业设计')
  const productManagerDirector = roleList.value.find((item) => item.label === '产品经理主管')
  const productManager = roleList.value.find((item) => item.label === '产品经理')
  if (industrialDesign) productDesignDefaultRoleIds.push(industrialDesign.id)
  if (productManagerDirector) productDesignDefaultRoleIds.push(productManagerDirector.id)
  if (productManager) productDesignDefaultRoleIds.push(productManager.id)
  if (artDesignManager) productDesignDefaultRoleIds.push(artDesignManager.id)
  if (artDesign) productDesignDefaultRoleIds.push(artDesign.id)
  productDesignQueryForm.roleIdList = productDesignDefaultRoleIds.length > 0 ? productDesignDefaultRoleIds : []
}

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  let rowspan = 1 // 默认不跨行
  const label = column.label
  if (columnIndex === 0 || label === '姓名' || label === '职级' || label === '角色' || label === '管理奖金') {
    const id = row.managementId

    for (let i = rowIndex + 1; i < list.value.length; i++) {
      if (list.value[i].managementId === id) {
        rowspan++
      } else {
        break
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || list.value[rowIndex - 1].managementId !== id ? { rowspan, colspan: 1 } : { rowspan: 0, colspan: 0 }
  }

  // 对于其他列，默认返回不合并
  return { rowspan: 1, colspan: 1 }
}

// tab切换
const handleTabChange = () => {
  if (activeName.value === 2) {
    queryAssessmentData()
  } else if (activeName.value === 3) {
    queryForm.status = 3
    queryData()
  } else if (activeName.value === 4) {
    // 产品设计 tab 使用独立的 productDesignQueryForm
    productDesignQueryData()
  } else if (activeName.value === 5) {
    // 平面设计 tab 使用独立的 artDesignQueryForm
    artDesignQueryData()
  } else if (activeName.value === 7) {
    // 主管 tab 使用独立的 supervisorQueryForm
    supervisorQueryData()
  } else {
    queryForm.status = 0
    queryData()
  }
}
watch(
  () => date.value,
  () => {
    if (activeName.value === 4) {
      productDesignQueryData()
    } else if (activeName.value === 5) {
      artDesignQueryData()
    } else if (activeName.value === 7) {
      supervisorQueryData()
    } else {
      queryData()
    }
  },
  { deep: true }
)
watch(
  () => assessmentDate.value,
  () => {
    queryAssessmentData()
  },
  { deep: true }
)
onBeforeMount(async () => {
  // 设置默认月份为当月
  const now = dayjs()
  const startOfMonth = now.startOf('month').format('YYYY-MM')
  const endOfMonth = now.endOf('month').format('YYYY-MM')
  date.value = [startOfMonth, endOfMonth]
  assessmentDate.value = [startOfMonth, endOfMonth]
  // 获取角色列表（用于平面设计 tab）
  await fetchArtDesignRoleList()
  // 获取考勤明细数据
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

        .el-table {
          flex: 1;
        }
      }
    }
  }
}
.noneHoverTable {
  .none {
    display: none;
  }
  :deep() {
    .el-checkbox {
      transform: scale(1.3);
    }
  }
}
.negative-color {
  color: var(--el-color-danger);
}
.el-checkbox {
  transform: scale(1.2);
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
/* 修复排序图标位置和样式 */
:deep(.all-table .el-table__header-wrapper .el-table__header th) {
  position: relative;
}

/* 确保表头文字不会与排序图标重叠 */
:deep(.all-table .el-table__header-wrapper .el-table__header th .cell) {
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
