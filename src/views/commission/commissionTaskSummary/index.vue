<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="美工图片" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item label="站点">
                <el-select v-model="queryForm.site" @change="queryData">
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="设计任务">
                <el-select v-model="queryForm.designTaskId" placeholder="全部" @change="queryData">
                  <el-option v-for="item in designTypeOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
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
        <el-table border :cell-style="cellStyle" :data="list" :header-cell-style="{ textAlign: 'center' }" stripe>
          <el-table-column label="实际完成日期" min-width="120" prop="actualFinishDate">
            <template #default="{ row }">
              {{ row.actualFinishDate ? formatDate(new Date(row.actualFinishDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="人员" prop="userName" :width="flexColumnWidth(list, '人员', 'userName')" />
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku', 50)" >
            <template #default="{ row }">
              <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)" >
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="100" prop="status">
            <template #default="{ row }">
              <el-tag v-if="row.status === '未上架'" type="info">{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '结束'" type="danger">{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '暂停'" type="warning">{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '进行中'" type="success">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="任务ID" min-width="100" prop="taskId" />
          <el-table-column label="站点" min-width="130" prop="siteName" />
          <el-table-column label="提成模式" min-width="100" prop="mold" />
          <el-table-column label="设计任务" min-width="110" prop="designTask" />
          <el-table-column label="提前完成天数" min-width="120" prop="advanceDays">
            <template #default="{ row }">
              <el-text v-if="row.advanceDays >= 0" type="success">{{ row.advanceDays }}</el-text>
              <el-text v-if="row.advanceDays < 0" type="danger">{{ row.advanceDays }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="要求完成日期" min-width="120" prop="dueDate">
            <template #default="{ row }">
              {{ row.dueDate ? formatDate(new Date(row.dueDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="提成天数" min-width="100" prop="commissionDay" />
          <el-table-column label="合作提成比例" min-width="120" prop="cooperationProportion">
            <template #default="{ row }">
              {{ row.cooperationProportion ? row.cooperationProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="单人提成比例" min-width="120" prop="singleProportion">
            <template #default="{ row }">
              {{ row.singleProportion ? row.singleProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="合作权重" min-width="100" prop="cooperationWeight" />
          <el-table-column label="合作加成" min-width="100" prop="cooperationBonus" />
          <el-table-column label="最低要求转化率" min-width="130" prop="lowRate">
            <template #default="{ row }">
              {{ row.lowRate ? row.lowRate + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="{ row }">
              <el-link type="primary" underline='never' @click="showPictureUpdate(row)">修改</el-link>
              <span style="margin: 0 3px;"></span>
              <el-link type="danger" underline='never' @click="handlePausePicture(row)">暂停</el-link>
              <span style="margin: 0 3px;"></span>
              <el-link type="success" underline='never' @click="handleContinuePicture(row)">继续</el-link>
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
      <el-tab-pane label="美工长期" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item label="设计任务">
                <el-select v-model="longQueryForm.designTaskId" placeholder="全部" @change="longQueryData">
                  <el-option v-for="item in designTypeOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel >
            <el-form inline :model="longQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="longQueryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="longQueryData"
                  @keyup.enter="longQueryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="longQueryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table border :cell-style="cellStyle" :data="longList" :header-cell-style="{ textAlign: 'center' }" stripe>
          <el-table-column label="提成开始日期" min-width="120" prop="startDate">
            <template #default="{ row }">
              {{ row.startDate ? formatDate(new Date(row.startDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="人员" prop="userName" :width="flexColumnWidth(longList, '人员', 'userName')" />
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(longList, 'SKU', 'sku', 50)" >
            <template #default="{ row }">
              <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)" >
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="100" prop="status">
            <template #default="{ row }">
              <el-tag v-if="row.status === '暂停'" type="warning">{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '进行中'" type="success">{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '结束'" type="danger">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="任务ID" min-width="100" prop="taskId" />
          <el-table-column label="设计任务" min-width="100" prop="type" />
          <el-table-column label="提成结束日期" min-width="100" prop="endDate">
            <template #default="{ row }">
              {{ row.endDate ? formatDate(new Date(row.endDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="提成天数" min-width="100" prop="commissionDays" />
          <el-table-column label="合作提成比例" min-width="120" prop="cooperationProportion">
            <template #default="{ row }">
              {{ row.cooperationProportion ? row.cooperationProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="单人提成比例" min-width="120" prop="singleProportion">
            <template #default="{ row }">
              {{ row.singleProportion ? row.singleProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="合作权重" min-width="100" prop="cooperationWeight" />
          <el-table-column label="合作加成" min-width="100" prop="cooperationBonus" />
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="{ row }">
              <el-link type="primary" underline='never' @click="showLongUpdate(row)">修改</el-link>
              <span style="margin: 0 3px;"></span>
              <el-link type="danger" underline='never' @click="handlePauseLong(row)">暂停</el-link>
              <span style="margin: 0 3px;"></span>
              <el-link type="success" underline='never' @click="handleContinueLong(row)">继续</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="longQueryForm.pageNo"
          :page-size="longQueryForm.pageSize"
          :total="total"
          @current-change="handleLongCurrentChange"
          @size-change="handleLongSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="产品开发设计" :name="2">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
            <el-form inline :model="developQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="developQueryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="developQueryData"
                  @keyup.enter="developQueryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="developQueryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table border :cell-style="cellStyle" :data="developList" :header-cell-style="{ textAlign: 'center' }" stripe>
          <el-table-column label="采购计划发布日期" min-width="120" prop="releaseData">
            <template #default="{ row }">
              {{ row.releaseData ? formatDate(new Date(row.releaseData)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="人员" min-width="120" prop="userName" />
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(developList, 'SKU', 'sku', 50)" >
            <template #default="{ row }">
              <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)" >
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="100" prop="status">
            <template #default="{ row }">
              <el-tag v-if="row.status === '暂停'" type="warning">{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '进行中'" type="success">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="本职角色" min-width="100" prop="jobRole" />
          <el-table-column label="提成角色" min-width="100" prop="commissionRole" />
          <el-table-column label="净利提成基础比例" min-width="120" prop="baseProportion">
            <template #default="{ row }">
              {{ row.baseProportion ? row.baseProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="超额完成奖励" min-width="120" prop="rewardProportion">
            <template #default="{ row }">
              {{ row.rewardProportion ? row.rewardProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="{ row }">
              <el-link type="primary" underline='never' @click="showDevelopUpdate(row)">修改</el-link>
              <span style="margin: 0 3px;"></span>
              <el-link type="danger" underline='never' @click="handlePauseDevelop(row)">暂停</el-link>
              <span style="margin: 0 3px;"></span>
              <el-link type="success" underline='never' @click="handleContinueDevelop(row)">继续</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="developQueryForm.pageNo"
          :page-size="developQueryForm.pageSize"
          :total="total"
          @current-change="handleDevelopCurrentChange"
          @size-change="handleDevelopSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="采购降本" :name="3">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
            <el-form inline :model="costQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model.trim="costQueryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="costQueryData"
                  @keyup.enter="costQueryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="costQueryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table border :cell-style="cellStyle" :data="costList" :header-cell-style="{ textAlign: 'center' }" stripe>
          <el-table-column label="提成开始日期" min-width="120" prop="startDate">
            <template #default="{ row }">
              {{ row.startDate ? formatDate(new Date(row.startDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="人员" prop="userName" :width="flexColumnWidth(costList, '人员', 'userName')" />
          <el-table-column label="降本PO" min-width="100" prop="po" />
          <el-table-column label="状态" min-width="100" prop="status">
            <template #default="{ row }">
              <el-tag v-if="row.status === '暂停'" type="warning">{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '进行中'" type="success">{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '结束'" type="danger">{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '待审核'" type="primary">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(costList, 'SKU', 'sku', 50)" >
            <template #default="{ row }">
              <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)" >
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(costList, '零件名', 'componentName')" />
          <el-table-column label="供应商" prop="suppliserName" :width="flexColumnWidth(costList, '供应商', 'suppliserName')" />
          <el-table-column label="优化前成本￥" min-width="110" prop="optimizationBefore">
            <template #default="{ row }">￥{{ row.optimizationBefore }}</template>
          </el-table-column>
          <el-table-column label="优化后成本￥" min-width="110" prop="optimizationAfter">
            <template #default="{ row }">￥{{ row.optimizationAfter }}</template>
          </el-table-column>
          <el-table-column label="降本金额￥" min-width="120" prop="costReductionPrice">
            <template #default="{ row }">￥{{ row.costReductionPrice }}</template>
          </el-table-column>
          <el-table-column label="降本比例" min-width="120" prop="costReductionProportion">
            <template #default="{ row }">
              {{ row.costReductionProportion ? row.costReductionProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="提成比例" min-width="120" prop="commissionProportion">
            <template #default="{ row }">
              {{ row.commissionProportion ? row.commissionProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="提成天数" min-width="100" prop="commissionDays" />
          <el-table-column label="提成结束日期" min-width="120" prop="endDate">
            <template #default="{ row }">
              {{ row.endDate ? formatDate(new Date(row.endDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="180">
            <template #default="{ row }">
              <el-link v-if="row.status === '待审核'" type="success" underline='never' @click="handlePassCost(row)">审核通过</el-link>
              <span style="margin: 0 3px;"></span>
              <el-link v-if="row.status === '待审核'" type="danger" underline='never' @click="handleNotPassCost(row)">不通过</el-link>
              <span style="margin: 0 3px;"></span>
              <el-link v-if="row.status === '进行中' || row.status === '暂停'" type="primary" underline='never' @click="showCostUpdate(row)">修改</el-link>
              <span style="margin: 0 3px;"></span>
              <el-link v-if="row.status === '进行中' || row.status === '暂停'" type="warning" underline='never' @click="handlePauseCost(row)">暂停</el-link>
              <span style="margin: 0 3px;"></span>
              <el-link v-if="row.status === '进行中' || row.status === '暂停'" type="success" underline='never' @click="handleContinueCost(row)">继续</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="costQueryForm.pageNo"
          :page-size="costQueryForm.pageSize"
          :total="total"
          @current-change="handleCostCurrentChange"
          @size-change="handleCostSizeChange"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 美工图片修改 -->
    <vab-dialog v-model="pictureUpdateVisible" title="美工图片修改" width="20%">
      <el-form
        ref="pictureUpdateFormRef"
        label-position="right"
        label-width="auto"
        :model="pictureUpdateForm"
        :rules="pictureUpdateFormRules"
        style="margin: 0"
      >
        <el-form-item label="要求完成日期" prop="requiredCompletionDate">
          <el-date-picker v-model="pictureUpdateForm.requiredCompletionDate" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="提成天数" prop="commissionDays">
          <el-input v-model="pictureUpdateForm.commissionDays" disabled type="number" />
        </el-form-item>
        <el-form-item label="合作提成比例" prop="cooperationCommissionRatio">
          <el-input v-model="pictureUpdateForm.cooperationCommissionRatio" type="number" />
        </el-form-item>
        <el-form-item label="单人提成比例" prop="individualCommissionRate">
          <el-input v-model="pictureUpdateForm.individualCommissionRate" type="number" />
        </el-form-item>
        <el-form-item label="合作权重" prop="cooperationWeight">
          <el-input v-model="pictureUpdateForm.cooperationWeight" type="number" />
        </el-form-item>
        <el-form-item label="合作加成倍数" prop="addition">
          <el-input v-model="pictureUpdateForm.addition" type="number" />
        </el-form-item>
        <el-form-item label="最低要求转化率" prop="lowRate">
          <el-input v-model="pictureUpdateForm.lowRate" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pictureUpdateVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmUpdatePicture">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 美工长期修改 -->
    <vab-dialog v-model="longUpdateVisible" title="美工长期修改" width="20%">
      <el-form ref="longFormRef" label-position="right" label-width="auto" :model="longForm" :rules="longFormRules" style="margin: 0">
        <el-form-item label="提成天数" prop="commissionDays">
          <el-input v-model="longForm.commissionDays" disabled type="number" />
        </el-form-item>
        <el-form-item label="合作提成比例" prop="cooperationCommissionRatio">
          <el-input v-model="longForm.cooperationCommissionRatio" type="number" />
        </el-form-item>
        <el-form-item label="单人提成比例" prop="individualCommissionRate">
          <el-input v-model="longForm.individualCommissionRate" type="number" />
        </el-form-item>
        <el-form-item label="合作权重" prop="cooperationWeight">
          <el-input v-model="longForm.cooperationWeight" type="number" />
        </el-form-item>
        <el-form-item label="合作加成倍数" prop="addition">
          <el-input v-model="longForm.addition" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="longUpdateVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmLongUpdate">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 产品开发设计修改 -->
    <vab-dialog v-model="developUpdateVisible" title="产品开发设计修改" width="20%">
      <el-form
        label-position="right"
        label-width="auto"
        :model="developForm"
        style="margin: 0"
      >
        <el-form-item label="基础比例" prop="baseProportion">
          <el-input v-model="developForm.baseProportion" type="number" />
        </el-form-item>
        <el-form-item label="超额完成奖励" prop="rewardProportion">
          <el-input v-model="developForm.rewardProportion" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="developUpdateVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmDevelopUpdate">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 采购降本修改 -->
    <vab-dialog v-model="costUpdateVisible" title="采购降本修改" width="20%">
      <el-form ref="costFormRef" label-position="right" label-width="auto" :model="costForm" :rules="costFormRules" style="margin: 0">
        <el-form-item label="优化前成本￥" prop="beforePrice">
          <el-input v-model="costForm.beforePrice" type="number" />
        </el-form-item>
        <el-form-item label="优化后成本￥" prop="afterPrice">
          <el-input v-model="costForm.afterPrice" type="number" />
        </el-form-item>
        <el-form-item label="提成比例" prop="commissionProportion">
          <el-input v-model="costForm.commissionProportion" type="number" />
        </el-form-item>
        <el-form-item label="提成天数" prop="commissionDays">
          <el-input v-model="costForm.commissionDays" disabled type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="costUpdateVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmCostUpdate">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import type { CSSProperties } from 'vue'
import handleClipboard from '~/src/utils/clipboard'
import { designTypeOption } from '../../newProductTask/constantOption'
import {
  continueCommissionTaskPicture,
  continueDevelopDesignTask,
  continueLongCommissionTask,
  continueReductionCostTask,
  getCommissionTaskPictureList,
  getDevelopDesignTaskList,
  getLongCommissionTaskList,
  getReductionCostList,
  notPassReductionCostTask,
  passReductionCostTask,
  pauseCommissionTaskPicture,
  pauseDevelopDesignTask,
  pauseLongCommissionTask,
  pauseReductionCostTask,
  updateCommissionTaskPicture,
  updateDevelopDesignTask,
  updateLongCommissionTask,
  updateReductionCostTask,
} from '/@/api/devlocal/commission'
import { getSeasonalCoefficientSiteList } from '/@/api/devlocal/seasonalCoefficient'
import type {
  IGetCommissionTaskPictureList,
  IGetCommissionTaskPictureListReq,
  IGetDevelopDesignTaskList,
  IGetLongCommissionTaskList,
  IGetLongCommissionTaskListReq,
  IGetReductionCostList,
} from '/@/type/commission/commissionType'
import { formatDate } from '/@/utils/dateUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'CommissionTaskSummary',
})

const activeName = ref<number>(0)
const list = ref<IGetCommissionTaskPictureList[]>([])
const longList = ref<IGetLongCommissionTaskList[]>([])
const developList = ref<IGetDevelopDesignTaskList[]>([])
const costList = ref<IGetReductionCostList[]>([])
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const siteList = ref<{ id: number; label: string }[]>([])
const queryForm = reactive<IGetCommissionTaskPictureListReq>({
  site: -1,
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  designTaskId: -1
})
const longQueryForm = reactive<IGetLongCommissionTaskListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  designTaskId: -1
})
const developQueryForm = reactive<IGetLongCommissionTaskListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const costQueryForm = reactive<IGetLongCommissionTaskListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const pictureUpdateVisible = ref<boolean>(false)
const pictureUpdateForm = reactive<any>({})
const pictureUpdateFormRef = ref<FormInstance>()
const pictureUpdateFormRules = reactive<FormRules>({
  requiredCompletionDate: [{ required: true, message: '请选择要求完成日期', trigger: 'change' }],
  // commissionDays: [{ required: true, message: '请填写提成天数', trigger: 'blur' }],
  cooperationCommissionRatio: [{ required: true, message: '请填写合作提成比例', trigger: 'blur' }],
  individualCommissionRate: [{ required: true, message: '请填写单人提成比例', trigger: 'blur' }],
  cooperationWeight: [{ required: true, message: '请填写合作权重', trigger: 'blur' }],
  addition: [{ required: true, message: '请填写合作加成倍数', trigger: 'blur' }],
  lowRate: [{ required: true, message: '请填写最低要求转化率', trigger: 'blur' }],
})
const _id = ref<number>(0)
const longUpdateVisible = ref<boolean>(false)
const longForm = reactive<any>({})
const longFormRef = ref<FormInstance>()
const longFormRules = reactive<FormRules>({
  // commissionDays: [{ required: true, message: '请填写提成天数', trigger: 'blur' }],
  cooperationCommissionRatio: [{ required: true, message: '请填写合作提成比例', trigger: 'blur' }],
  individualCommissionRate: [{ required: true, message: '请填写单人提成比例', trigger: 'blur' }],
  cooperationWeight: [{ required: true, message: '请填写合作权重', trigger: 'blur' }],
  addition: [{ required: true, message: '请填写合作加成倍数', trigger: 'blur' }],
})
const developUpdateVisible = ref<boolean>(false)
const developForm = reactive<any>({})
// const developFormRef = ref<FormInstance>()
// const developFormRules = reactive<FormRules>({
//   baseProportion: [{ required: true, message: '请填写基础比例', trigger: 'blur' }],
//   rewardProportion: [{ required: true, message: '请填写超额完成奖励', trigger: 'blur' }],
// })
const costUpdateVisible = ref<boolean>(false)
const costForm = reactive<any>({})
const costFormRef = ref<FormInstance>()
const costFormRules = reactive<FormRules>({
  beforePrice: [{ required: true, message: '请填写优化前成本', trigger: 'blur' }],
  afterPrice: [{ required: true, message: '请填写优化后成本', trigger: 'blur' }],
  commissionProportion: [{ required: true, message: '请填写提成比例', trigger: 'blur' }],
  commissionDays: [{ required: true, message: '请填写提成天数', trigger: 'blur' }],
})
const handleConfirmCostUpdate = async () => {
  costFormRef.value?.validate(async (isValid) => {
    if (isValid) {
      const { commissionDays, ...filterForm } = costForm
      const { data } = await updateReductionCostTask({
        id: _id.value,
        ...filterForm,
        commissionProportion: Number(filterForm.commissionProportion) / 100,
      })
      if (data) {
        $baseMessage('修改采购降本任务成功！', 'success')
        costUpdateVisible.value = false
        costQueryData()
      }
    }
  })
}
const showCostUpdate = (row: IGetReductionCostList) => {
  costUpdateVisible.value = true
  _id.value = row.id!
  costForm.beforePrice = row.optimizationBefore
  costForm.afterPrice = row.optimizationAfter
  costForm.commissionProportion = row.commissionProportion
  costForm.commissionDays = row.commissionDays
}
const handlePauseCost = async (row: IGetReductionCostList) => {
  if (row.status !== '进行中') {
    $baseMessage('采购降本状态不为进行中，无效操作！', 'warning')
    return
  }
  $baseConfirm('确定暂停当前采购降本任务吗？', null, async () => {
    const { data } = await pauseReductionCostTask({
      id: row.id!,
    })
    if (data) {
      $baseMessage('暂停成功！', 'success')
      costQueryData()
    }
  })
}
const handleContinueCost = async (row: IGetReductionCostList) => {
  if (row.status !== '暂停') {
    $baseMessage('当前任务不是暂停状态，不能点击继续！', 'warning')
    return
  }
  $baseConfirm('确定继续当前采购降本任务吗？', null, async () => {
    const { data } = await continueReductionCostTask({
      id: row.id!,
    })
    if (data) {
      $baseMessage('继续成功！', 'success')
      costQueryData()
    }
  })
}
const handleNotPassCost = async (row: IGetReductionCostList) => {
  if (row.status !== '待审核') {
    $baseMessage('此采购降本状态不为待审核，无效操作！', 'warning')
    return
  }
  $baseConfirm('确定不通过当前采购降本任务吗？', null, async () => {
    const { data } = await notPassReductionCostTask({
      id: row.id!,
    })
    if (data) {
      $baseMessage('不通过成功！', 'success')
      costQueryData()
    }
  })
}
const handlePassCost = async (row: IGetReductionCostList) => {
  if (row.status !== '待审核') {
    $baseMessage('此采购降本状态不为待审核，无效操作！', 'warning')
    return
  }
  $baseConfirm('确定审核通过当前采购降本任务吗？', null, async () => {
    const { data } = await passReductionCostTask({
      id: row.id!,
    })
    if (data) {
      $baseMessage('审核通过成功！', 'success')
      costQueryData()
    }
  })
}
const handleConfirmDevelopUpdate = async () => {
  const { data } = await updateDevelopDesignTask({
    id: _id.value,
    baseProportion: Number(developForm.baseProportion) / 100,
    rewardProportion: Number(developForm.rewardProportion) / 100,
  })
  if (data) {
    $baseMessage('修改产品开发设计任务成功！', 'success')
    developUpdateVisible.value = false
    developQueryData()
  }
}
const handlePauseDevelop = async (row: IGetDevelopDesignTaskList) => {
  $baseConfirm('确定暂停当前产品开发设计任务吗？', null, async () => {
    const { data } = await pauseDevelopDesignTask({
      id: row.id!,
    })
    if (data) {
      $baseMessage('暂停成功！', 'success')
      developQueryData()
    }
  })
}
const handleContinueDevelop = async (row: IGetDevelopDesignTaskList) => {
  if (row.status !== '暂停') {
    $baseMessage('当前任务不是暂停状态，不能点击继续！', 'warning')
    return
  }
  $baseConfirm('确定继续当前产品开发设计任务吗？', null, async () => {
    const { data } = await continueDevelopDesignTask({
      id: row.id!,
    })
    if (data) {
      $baseMessage('继续成功！', 'success')
      developQueryData()
    }
  })
}
const handlePauseLong = async (row: IGetLongCommissionTaskList) => {
  $baseConfirm('确定暂停当前美工长期任务吗？', null, async () => {
    const { data } = await pauseLongCommissionTask({
      id: row.id!,
    })
    if (data) {
      $baseMessage('暂停成功！', 'success')
      longQueryData()
    }
  })
}
const handleContinueLong = async (row: IGetLongCommissionTaskList) => {
  if (row.status !== '暂停') {
    $baseMessage('当前任务不是暂停状态，不能点击继续！', 'warning')
    return
  }
  $baseConfirm('确定继续当前美工长期任务吗？', null, async () => {
    const { data } = await continueLongCommissionTask({
      id: row.id!,
    })
    if (data) {
      $baseMessage('继续成功！', 'success')
      longQueryData()
    }
  })
}
const handleConfirmLongUpdate = async () => {
  longFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { commissionDays, ...filterForm } = longForm
      const { data } = await updateLongCommissionTask({
        id: _id.value,
        ...filterForm,
        cooperationCommissionRatio: Number(filterForm.cooperationCommissionRatio) / 100,
        individualCommissionRate: Number(filterForm.individualCommissionRate) / 100,
      })
      if (data) {
        $baseMessage('修改美工长期任务成功！', 'success')
        longUpdateVisible.value = false
        longQueryData()
      }
    }
  })
}
const showDevelopUpdate = (row: IGetDevelopDesignTaskList) => {
  developUpdateVisible.value = true
  _id.value = row.id!
  developForm.baseProportion = row.baseProportion
  developForm.rewardProportion = row.rewardProportion
}
const showLongUpdate = (row: IGetLongCommissionTaskList) => {
  longUpdateVisible.value = true
  _id.value = row.id!
  longForm.commissionDays = row.commissionDay
  longForm.cooperationCommissionRatio = row.cooperationProportion
  longForm.individualCommissionRate = row.singleProportion
  longForm.cooperationWeight = row.cooperationWeight
  longForm.addition = row.cooperationBonus
}
const handleTabClick = (tab: TabsPaneContext) => {
  const name = tab.props.name
  switch (name) {
    case 0: {
      queryData()

      break
    }
    case 1: {
      longQueryData()

      break
    }
    case 2: {
      developQueryData()

      break
    }
    default: {
      costQueryData()
    }
  }
}
const handleConfirmUpdatePicture = async () => {
  pictureUpdateFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { commissionDays, ...filterForm } = pictureUpdateForm
      const { data } = await updateCommissionTaskPicture({
        id: _id.value,
        ...filterForm,
        cooperationCommissionRatio: Number(filterForm.cooperationCommissionRatio) / 100,
        individualCommissionRate: Number(filterForm.individualCommissionRate) / 100,
        lowRate: Number(filterForm.lowRate) / 100,
      })
      if (data) {
        $baseMessage('修改美工图片任务成功！', 'success')
        pictureUpdateVisible.value = false
        queryData()
      }
    }
  })
}
const showPictureUpdate = (row: IGetCommissionTaskPictureList) => {
  pictureUpdateVisible.value = true
  _id.value = row.id!
  pictureUpdateForm.requiredCompletionDate = row.dueDate
  pictureUpdateForm.commissionDays = row.commissionDay
  pictureUpdateForm.cooperationCommissionRatio = row.cooperationProportion
  pictureUpdateForm.individualCommissionRate = row.singleProportion
  pictureUpdateForm.cooperationWeight = row.cooperationWeight
  pictureUpdateForm.addition = row.cooperationBonus
  pictureUpdateForm.lowRate = row.lowRate
}
const handlePausePicture = async (row: IGetCommissionTaskPictureList) => {
  $baseConfirm('确定暂停当前美工图片任务吗？', null, async () => {
    const { data } = await pauseCommissionTaskPicture({
      id: row.id!,
    })
    if (data) {
      $baseMessage('暂停成功！', 'success')
      queryData()
    }
  })
}
const handleContinuePicture = async (row: IGetCommissionTaskPictureList) => {
  if (row.status !== '暂停') {
    $baseMessage('当前任务不是暂停状态，不能点击继续！', 'warning')
    return
  }
  $baseConfirm('确定继续当前美工图片任务吗？', null, async () => {
    const { data } = await continueCommissionTaskPicture({
      id: row.id!,
    })
    if (data) {
      $baseMessage('继续成功！', 'success')
      queryData()
    }
  })
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
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const handleLongCurrentChange = (value: number) => {
  longQueryForm.pageNo = value
  fetchLongData()
}
const handleLongSizeChange = (value: number) => {
  longQueryForm.pageNo = 1
  longQueryForm.pageSize = value
  fetchLongData()
}
const longQueryData = () => {
  longQueryForm.pageNo = 1
  fetchLongData()
}
const handleDevelopCurrentChange = (value: number) => {
  developQueryForm.pageNo = value
  fetchDevelopData()
}
const handleDevelopSizeChange = (value: number) => {
  developQueryForm.pageNo = 1
  developQueryForm.pageSize = value
  fetchDevelopData()
}
const developQueryData = () => {
  developQueryForm.pageNo = 1
  fetchDevelopData()
}
const handleCostCurrentChange = (value: number) => {
  costQueryForm.pageNo = value
  fetchCostData()
}
const handleCostSizeChange = (value: number) => {
  costQueryForm.pageNo = 1
  costQueryForm.pageSize = value
  fetchCostData()
}
const costQueryData = () => {
  costQueryForm.pageNo = 1
  fetchCostData()
}
const fetchSiteList = async () => {
  const { data } = await getSeasonalCoefficientSiteList()
  siteList.value = data
  siteList.value.unshift({ id: -1, label: '全部' })
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getCommissionTaskPictureList(queryForm)
  total.value = data.total
  list.value = data.list
  list.value.forEach((item) => {
    if (item.cooperationProportion) {
      item.cooperationProportion = parseFloat((item.cooperationProportion * 100).toFixed(2))
    }
    if (item.singleProportion) {
      item.singleProportion = parseFloat((item.singleProportion * 100).toFixed(2))
    }
    if (item.lowRate) {
      item.lowRate = parseFloat((item.lowRate * 100).toFixed(2))
    }
  })
  listLoading.value = false
}
const fetchLongData = async () => {
  listLoading.value = true
  const { data } = await getLongCommissionTaskList(longQueryForm)
  if (data) {
    total.value = data.total
    longList.value = data.list
    longList.value.forEach((item) => {
      if (item.cooperationProportion) {
        item.cooperationProportion = parseFloat((item.cooperationProportion * 100).toFixed(2))
      }
      if (item.singleProportion) {
        item.singleProportion = parseFloat((item.singleProportion * 100).toFixed(2))
      }
    })
  }
  listLoading.value = false
}
const fetchDevelopData = async () => {
  listLoading.value = true
  const { data } = await getDevelopDesignTaskList(developQueryForm)
  if (data) {
    total.value = data.total
    developList.value = data.list
    developList.value.forEach((item) => {
      if (item.baseProportion) {
        item.baseProportion = parseFloat((item.baseProportion * 100).toFixed(2))
      }
      if (item.rewardProportion) {
        item.rewardProportion = parseFloat((item.rewardProportion * 100).toFixed(2))
      }
    })
  }
  listLoading.value = false
}
const fetchCostData = async () => {
  listLoading.value = true
  const { data } = await getReductionCostList(costQueryForm)
  if (data) {
    total.value = data.total
    costList.value = data.list
    costList.value.forEach((item) => {
      if (item.costReductionProportion) {
        item.costReductionProportion = parseFloat((item.costReductionProportion * 100).toFixed(2))
      }
      if (item.commissionProportion) {
        item.commissionProportion = parseFloat((item.commissionProportion * 100).toFixed(2))
      }
    })
  }
  listLoading.value = false
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === 'SKU' || label === '零件名' || label === '供应商') {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}
onBeforeMount(() => {
  fetchSiteList()
  switch(activeName.value) {
    case 0: {
      fetchData()
      break
    }
    case 1: {
      fetchLongData()
      break
    }
    case 2: {
      fetchDevelopData()
      break
    }
    default: {
      fetchCostData()
    }
  }
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

              // .el-check-tag,
              // .el-form-item__label {
              //   margin: 0 10px 5px 0;
              //   border-radius: 99px;
              // }
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
.copySku {
  cursor: pointer;
  -webkit-user-select: text;
  user-select: text;
  transition: all 0.3s;
  &:hover {
    color: #000;
  }
}
</style>
