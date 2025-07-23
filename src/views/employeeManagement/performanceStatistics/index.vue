<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-change="handleTabChange">
      <el-tab-pane label="全员明细" :name="0">
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
          <el-table-column label="加班和请假">
            <el-table-column min-width="100" prop="overtimeHours">
              <template #header>
                加班时长
                <br />
                (小时)
              </template>
            </el-table-column>
            <el-table-column min-width="90" prop="personalLeave">
              <template #header>
                事假
                <br />
                (天)
              </template>
            </el-table-column>
            <el-table-column min-width="90" prop="annualLeave">
              <template #header>
                年假
                <br />
                (天)
              </template>
            </el-table-column>
            <el-table-column min-width="90" prop="sickLeave">
              <template #header>
                病假
                <br />
                (小时)
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="考勤异常">
            <el-table-column min-width="100" prop="sWorkCount">
              <template #header>
                上班缺卡
                <br />
                (次)
              </template>
            </el-table-column>
            <el-table-column min-width="100" prop="xWorkCount">
              <template #header>
                下班缺卡
                <br />
                (次)
              </template>
            </el-table-column>
            <el-table-column min-width="90" prop="absenteeismCount">
              <template #header>
                旷工
                <br />
                (天)
              </template>
            </el-table-column>
            <el-table-column min-width="100" prop="absenceDuration">
              <template #header>
                缺勤时长
                <br />
                (小时)
              </template>
            </el-table-column>
            <el-table-column min-width="90" prop="leaveEarlyCount">
              <template #header>
                早退
                <br />
                (次)
              </template>
            </el-table-column>
            <el-table-column min-width="100" prop="leaveEarlyDuration">
              <template #header>
                早退时长
                <br />
                (小时)
              </template>
            </el-table-column>
            <el-table-column min-width="90" prop="lateCount">
              <template #header>
                迟到
                <br />
                (次数)
              </template>
            </el-table-column>
            <el-table-column min-width="100" prop="seriousLateCount">
              <template #header>
                严重迟到
                <br />
                (次数)
              </template>
            </el-table-column>
            <el-table-column min-width="100" prop="lateDuration">
              <template #header>
                迟到时长
                <br />
                (小时)
              </template>
            </el-table-column>
            <el-table-column min-width="130" prop="seriousLateDuration">
              <template #header>
                严重迟到时长
                <br />
                (小时)
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="总奖金" min-width="110" prop="">
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
                <el-button type="primary" @click="showSetting">考核数设定</el-button>
                <el-button type="primary" @click="showParameterSettings">参数设定</el-button>
                <el-button type="primary" @click="adjustDetailVisible = true">调整明细</el-button>
                <el-button type="primary" @click="showCheckout">考核数结账</el-button>
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

          <el-table-column label="产品开发设计" min-width="130" prop="developmentDesign" />

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
      <el-tab-pane label="平面设计" :name="5">
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

          <el-table-column label="美工图片" min-width="100" prop="artDesignPicture" />
          <el-table-column label="美工长期" min-width="100" prop="artDesignLongTime" />

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
        <el-table-column label="考核未达标" min-width="120" prop="status">
          <template #default="{ row }">
            <el-checkbox v-model="row.status" :false-value="0" :true-value="1" @change="handleChangeSettingStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template #default="{ row }">
            <el-link type="primary" underline='never' @click="showViewDetail(row)">查看调整明细</el-link>
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
    <adjust-detail-dialog v-model="adjustDetailVisible" @query-data="fetchAssessmentData" />
    <!-- 对应月份 对应人员调整明细 -->
    <vab-dialog v-model="viewDetailVisible" title="调整明细">
         <el-table border :cell-style="{ textAlign: 'center' }" :data="detailList" :header-cell-style="{ textAlign: 'center' }" stripe>
        <el-table-column label="月份" prop="month" />
        <el-table-column label="被调整人" prop="userName" />
        <el-table-column label="类型" prop="type" >
          <template #default="{ row }">
            {{ row.type === 0 ? '考核数' : '完成数' }}
          </template>
        </el-table-column>
        <el-table-column label="调整数量" prop="adjustQuantity" />
        <el-table-column label="OEM" >
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
    <vab-dialog v-model="parameterSettingsVisible" title="参数设定" width="16%">
      <el-form ref="parameterSettingsFormRef" :model="parameterSettingsForm" :rules="parameterSettingsRules" style="margin-left: 0; margin-right: 0;" >
        <el-form-item label="最大超额完成数" prop="count">
          <el-input v-model="parameterSettingsForm.count" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="updateParameterSettings">修改</el-button>
      </template>
    </vab-dialog>
    <!-- 考核数结账 -->
    <vab-dialog v-model="checkoutVisible" title="考核数结账" width="20%" @close="closeCheckout">
      <el-form label-position="top">
        <el-form-item label="请选择结账人员">
          <el-select v-model="userIdList" multiple placeholder="请选择结账人员">
            <el-option
              v-for="item in productManagerList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleCheckout">结账</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { FormInstance } from 'element-plus'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import {
    checkoutAssessmentNumber,
    getAdjustDetailByUser,
    getAssessmentList,
    getMaximumOverfulfillment,
    getProductManager,
    getProductManagerAssessmentList,
    getUserAttendanceList,
    updateMaximumOverfulfillment,
    updateProductManagerAssessment,
} from '/@/api/devlocal/performanceStatistics'
import type {
    IGetAdjustDetail,
    IGetAssessmentList,
    IGetAssessmentListReq,
    IGetProductManagerAssessmentList,
    IGetUserAttendanceList,
} from '/@/type/employeeManagement/performanceStatistics'
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
const productManagerList = ref<{ id: number, label: string }[]>([])
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
    $baseMessage("您未选择任何人员进行结账！", 'warning')
    return
  }
  const { data } = await checkoutAssessmentNumber({
    userIdList: userIdList.value,
    startMonth: date.value[0],
    endMonth: date.value[1],
  })
  if (data) {
    $baseMessage("考核数结账成功且发送邮件成功！", 'success')
    checkoutVisible.value = false
  }
}
const userIdList = ref<number[]>([])
// 调整明细
const adjustDetailVisible = ref<boolean>(false)
// 参数设定
const parameterSettingsVisible = ref<boolean>(false)
const parameterSettingsForm = reactive<any>({
  count: undefined,
})
const parameterSettingsFormRef = ref<FormInstance>()
const parameterSettingsRules = reactive<any>({
  count: [{ required: true, message: '请输入最大超额完成数', trigger: 'blur' }],
})
const showParameterSettings = async () => {
  const { data } = await getMaximumOverfulfillment()
  parameterSettingsForm.count = data
  parameterSettingsVisible.value = true
}
const updateParameterSettings = async () => {
  parameterSettingsFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await updateMaximumOverfulfillment({
        number: parameterSettingsForm.count,
      })
      if (data) {
        $baseMessage("修改成功！", 'success')
        parameterSettingsVisible.value = false
      }
    }
  })
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
})
const list = ref<IGetUserAttendanceList[]>([])
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
// 计算每行总奖金
const handleCalculateTotalBonus = (row: IGetUserAttendanceList) => {
  let totalBonus = 0
  if (row.procurementBonus != null) totalBonus += row.procurementBonus
  if (row.procurementCostReduction != null) totalBonus += row.procurementCostReduction
  if (row.artDesignPicture != null) totalBonus += row.artDesignPicture
  if (row.artDesignLongTime != null) totalBonus += row.artDesignLongTime
  if (row.developmentDesign != null) totalBonus += row.developmentDesign
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
// tab切换
const handleTabChange = () => {
  if (activeName.value === 2) {
    queryAssessmentData()
  } else if (activeName.value === 3) {
    queryForm.status = 1
    queryData()
  } else {
    queryForm.status = 0
    queryData()
  }
}

onBeforeMount(() => {
  // 设置默认月份为当月
  const now = dayjs()
  const startOfMonth = now.startOf('month').format('YYYY-MM')
  const endOfMonth = now.endOf('month').format('YYYY-MM')
  date.value = [startOfMonth, endOfMonth]
  assessmentDate.value = [startOfMonth, endOfMonth]
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
</style>
