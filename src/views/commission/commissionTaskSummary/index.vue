<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="美工图片" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form>
              <el-form-item label="站点">
                <el-select v-model="queryForm.site" @change="queryData">
                  <el-option v-for="item in siteList" :label="item.label" :value="item.id" :key="item.id" />
                </el-select>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form :model="queryForm" inline @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @keyup.enter="queryData" @input="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="listLoading" :icon="Search" @click="queryData" ></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border stripe
          :header-cell-style="{ textAlign: 'center' }" :cell-style="cellStyle"
          :data="list"
        >
          <el-table-column label="实际完成日期" prop="actualFinishDate" min-width="120">
            <template #default="{ row }">
              {{ row.actualFinishDate ? formatDate(new Date(row.actualFinishDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="人员" prop="userName" :width="flexColumnWidth(list, '人员', 'userName')"></el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')"></el-table-column>
          <el-table-column label="状态" prop="status" min-width="100">
            <template #default="{ row }">
              <el-tag v-if="row.status === '未上架'" type="info" >{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '已结束'" type="danger" >{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '暂停'" type="warning" >{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '进行中'" type="success" >{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="任务ID" prop="taskId" min-width="100"></el-table-column>
          <el-table-column label="站点" prop="siteName" min-width="130"></el-table-column>
          <el-table-column label="提成模式" prop="mold" min-width="100"></el-table-column>
          <el-table-column label="设计任务" prop="designTask" min-width="110"></el-table-column>
          <el-table-column label="提前完成天数" prop="advanceDays" min-width="120">
            <template #default="{ row }">
              <el-text v-if="row.advanceDays >= 0" type="success">{{ row.advanceDays }}</el-text>
              <el-text v-if="row.advanceDays < 0" type="danger">{{ row.advanceDays }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="要求完成日期" prop="dueDate" min-width="120">
            <template #default="{ row }">
              {{ row.dueDate ? formatDate(new Date(row.dueDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="提成天数" prop="commissionDay" min-width="100"></el-table-column>
          <el-table-column label="合作提成比例" prop="cooperationProportion" min-width="120">
            <template #default="{ row }">
              {{ row.cooperationProportion ? row.cooperationProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="单人提成比例" prop="singleProportion" min-width="120">
            <template #default="{ row }">
              {{ row.singleProportion ? row.singleProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="合作权重" prop="cooperationWeight" min-width="100"></el-table-column>
          <el-table-column label="合作加成" prop="cooperationBonus" min-width="100"></el-table-column>
          <el-table-column label="最低要求转化率" prop="lowRate" min-width="130">
            <template #default="{ row }">
              {{ row.lowRate ? row.lowRate + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-link type="primary" :underline="false" @click="showPictureUpdate(row)">修改</el-link>
              <el-link type="danger" :underline="false" @click="handlePausePicture(row)">暂停</el-link>
              <el-link type="success" :underline="false" @click="handleContinuePicture(row)">继续</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"></el-empty>
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
          <vab-query-form-right-panel :span="24">
            <el-form :model="longQueryForm" inline @submit.prevent>
              <el-form-item>
                <el-input v-model="longQueryForm.keyWord" clearable placeholder="请输入搜索关键词" @keyup.enter="longQueryData" @input="longQueryData" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="listLoading" :icon="Search" @click="longQueryData" ></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border stripe
          :header-cell-style="{ textAlign: 'center' }" :cell-style="cellStyle"
          :data="longList"
        >
          <el-table-column label="提成开始日期" prop="startDate" min-width="120">
            <template #default="{ row }">
              {{ row.startDate ? formatDate(new Date(row.startDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="人员" prop="userName" :width="flexColumnWidth(longList, '人员', 'userName')"></el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(longList, 'SKU', 'sku')"></el-table-column>
          <el-table-column label="状态" prop="status" min-width="100">
            <template #default="{ row }">
              <el-tag v-if="row.status === '暂停'" type="warning" >{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '进行中'" type="success" >{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '已结束'" type="danger" >{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="任务ID" prop="taskId" min-width="100"></el-table-column>
          <el-table-column label="任务类型" prop="type" min-width="100"></el-table-column>
          <el-table-column label="提成结束日期" prop="endDate" min-width="100">
            <template #default="{ row }">
              {{ row.endDate ? formatDate(new Date(row.endDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="提成天数" prop="commissionDay" min-width="100"></el-table-column>
          <el-table-column label="合作提成比例" prop="cooperationProportion" min-width="120">
            <template #default="{ row }">
              {{ row.cooperationProportion ? row.cooperationProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="单人提成比例" prop="singleProportion" min-width="120">
            <template #default="{ row }">
              {{ row.singleProportion ? row.singleProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="合作权重" prop="cooperationWeight" min-width="100"></el-table-column>
          <el-table-column label="合作加成" prop="cooperationBonus" min-width="100"></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-link type="primary" :underline="false" @click="showLongUpdate(row)">修改</el-link>
              <el-link type="danger" :underline="false" @click="handlePauseLong(row)">暂停</el-link>
              <el-link type="success" :underline="false" @click="handleContinueLong(row)">继续</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"></el-empty>
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
            <el-form :model="developQueryForm" inline @submit.prevent>
              <el-form-item>
                <el-input v-model="developQueryForm.keyWord" clearable placeholder="请输入搜索关键词" @keyup.enter="developQueryData" @input="developQueryData" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="listLoading" :icon="Search" @click="developQueryData" ></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border stripe
          :header-cell-style="{ textAlign: 'center' }" :cell-style="cellStyle"
          :data="developList"
        >
          <el-table-column label="采购计划发布日期" prop="releaseData" min-width="120">
            <template #default="{ row }">
              {{ row.releaseData ? formatDate(new Date(row.releaseData)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="人员" prop="userName" min-width="120"></el-table-column>
          <el-table-column label="SKU" prop="sku" min-width="200"></el-table-column>
          <el-table-column label="状态" prop="status" min-width="100">
            <template #default="{ row }">
              <el-tag v-if="row.status === '暂停'" type="warning" >{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '进行中'" type="success" >{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="本职角色" prop="jobRole" min-width="100"></el-table-column>
          <el-table-column label="提成角色" prop="commissionRole" min-width="100"></el-table-column>
          <el-table-column label="净利提成基础比例" prop="baseProportion" min-width="120">
            <template #default="{ row }">
              {{ row.baseProportion ? row.baseProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="超额完成奖励" prop="rewardProportion" min-width="120">
            <template #default="{ row }">
              {{ row.rewardProportion ? row.rewardProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-link type="primary" :underline="false" @click="showDevelopUpdate(row)">修改</el-link>
              <el-link type="danger" :underline="false" @click="handlePauseDevelop(row)">暂停</el-link>
              <el-link type="success" :underline="false" @click="handleContinueDevelop(row)">继续</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"></el-empty>
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
            <el-form :model="costQueryForm" inline @submit.prevent>
              <el-form-item>
                <el-input v-model="costQueryForm.keyWord" clearable placeholder="请输入搜索关键词" @keyup.enter="costQueryData" @input="costQueryData" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="listLoading" :icon="Search" @click="costQueryData" ></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border stripe
          :header-cell-style="{ textAlign: 'center' }" :cell-style="cellStyle"
          :data="costList"
        >
          <el-table-column label="提成开始日期" prop="startDate" min-width="120">
            <template #default="{ row }">
              {{ row.startDate ? formatDate(new Date(row.startDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="人员" prop="userName" :width="flexColumnWidth(costList, '人员', 'userName')"></el-table-column>
          <el-table-column label="降本PO" prop="po" min-width="100"></el-table-column>
          <el-table-column label="状态" prop="status" min-width="100">
            <template #default="{ row }">
              <el-tag v-if="row.status === '暂停'" type="warning" >{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '进行中'" type="success" >{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '已结束'" type="danger" >{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '待审核'" type="primary" >{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(costList, 'SKU', 'sku')"></el-table-column>
         
          <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(costList, '零件名', 'componentName')"></el-table-column>
          <el-table-column label="供应商" prop="suppliserName" :width="flexColumnWidth(costList, '供应商', 'suppliserName')"></el-table-column>
          <el-table-column label="优化前成本￥" prop="optimizationBefore" min-width="110">
            <template #default="{ row }">
              ￥{{ row.optimizationBefore }}
            </template>
          </el-table-column>
          <el-table-column label="优化后成本￥" prop="optimizationAfter" min-width="110">
            <template #default="{ row }">
              ￥{{ row.optimizationAfter }}
            </template>
          </el-table-column>
          <el-table-column label="降本金额￥" prop="costReductionPrice" min-width="120">
            <template #default="{ row }">
              ￥{{ row.costReductionPrice }}
            </template>
          </el-table-column>
          <el-table-column label="降本比例" prop="costReductionProportion" min-width="120">
            <template #default="{ row }">
              {{ row.costReductionProportion ? row.costReductionProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="提成比例" prop="commissionProportion" min-width="120">
            <template #default="{ row }">
              {{ row.commissionProportion ? row.commissionProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="提成天数" prop="commissionDays" min-width="100"></el-table-column>
          <el-table-column label="提成结束日期" prop="endDate" min-width="120">
            <template #default="{ row }">
              {{ row.endDate ? formatDate(new Date(row.endDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280" fixed="right">
            <template #default="{ row }">
              <el-link type="success" :underline="false" @click="handlePassCost(row)">审核通过</el-link>
              <el-link type="danger" :underline="false" @click="handleNotPassCost(row)">不通过</el-link>
              <el-link type="primary" :underline="false" @click="showCostUpdate(row)">修改</el-link>
              <el-link type="primary" :underline="false" @click="handlePauseCost(row)">暂停</el-link>
              <el-link type="primary" :underline="false" @click="handleContinueCost(row)">继续</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"></el-empty>
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
    <vab-dialog
      title="美工图片修改"
      width="20%"
      v-model="pictureUpdateVisible"
    >
      <el-form ref="pictureUpdateFormRef" :rules="pictureUpdateFormRules" label-position="right" label-width="auto" :model="pictureUpdateForm" style="margin: 0;">
        <el-form-item label="要求完成日期" prop="requiredCompletionDate">
          <el-date-picker v-model="pictureUpdateForm.requiredCompletionDate" type="date" value-format="YYYY-MM-DD"></el-date-picker>
        </el-form-item>
        <el-form-item label="提成天数" prop="commissionDays">
          <el-input v-model="pictureUpdateForm.commissionDays" type="number" disabled />
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
    <vab-dialog
      title="美工长期修改"
      width="20%"
      v-model="longUpdateVisible"
    >
      <el-form ref="longFormRef" :model="longForm" :rules="longFormRules" style="margin: 0;" label-position="right" label-width="auto" >
        <el-form-item label="提成天数" prop="commissionDays">
          <el-input v-model="longForm.commissionDays" type="number" disabled />
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
    <vab-dialog
      title="产品开发设计修改"
      width="20%"
      v-model="developUpdateVisible"
    >
      <el-form ref="developFormRef" :model="developForm" :rules="developFormRules" style="margin: 0;" label-position="right" label-width="auto" >
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
    <vab-dialog
      title="采购降本修改"
      width="20%"
      v-model="costUpdateVisible"
    >
      <el-form ref="costFormRef" :model="costForm" :rules="costFormRules" style="margin: 0;" label-position="right" label-width="auto" >
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
          <el-input v-model="costForm.commissionDays" type="number" disabled />
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
import { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import { CSSProperties } from 'vue'
import { continueCommissionTaskPicture, continueDevelopDesignTask, continueLongCommissionTask, continueReductionCostTask, getCommissionTaskPictureList, getDevelopDesignTaskList, getLongCommissionTaskList, getReductionCostList, notPassReductionCostTask, passReductionCostTask, pauseCommissionTaskPicture, pauseDevelopDesignTask, pauseLongCommissionTask, pauseReductionCostTask, updateCommissionTaskPicture, updateDevelopDesignTask, updateLongCommissionTask, updateReductionCostTask } from '/@/api/devlocal/commission'
import { getSeasonalCoefficientSiteList } from '/@/api/devlocal/seasonalCoefficient'
import { IGetCommissionTaskPictureList, IGetCommissionTaskPictureListReq, IGetDevelopDesignTaskList, IGetLongCommissionTaskList, IGetLongCommissionTaskListReq, IGetReductionCostList } from '/@/type/commission/commissionType'
import { formatDate } from '/@/utils/dateUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'CommissionTask'
})
const list = ref<IGetCommissionTaskPictureList[]>([])
const longList = ref<IGetLongCommissionTaskList[]>([])
const developList = ref<IGetDevelopDesignTaskList[]>([])
const costList = ref<IGetReductionCostList[]>([])
const activeName = ref<number>(0)
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const siteList = ref<{ id: number, label: string }[]>([])
const queryForm = reactive<IGetCommissionTaskPictureListReq>({
  site: -1,
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const longQueryForm = reactive<IGetLongCommissionTaskListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const developQueryForm = reactive<IGetLongCommissionTaskListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const costQueryForm = reactive<IGetLongCommissionTaskListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
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
const developFormRef = ref<FormInstance>()
const developFormRules = reactive<FormRules>({
  baseProportion: [{ required: true, message: '请填写基础比例', trigger: 'blur' }],
  rewardProportion: [{ required: true, message: '请填写超额完成奖励', trigger: 'blur' }],
})
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
        commissionProportion: Number(filterForm.commissionProportion) / 100
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
      id: row.id!
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
      id: row.id!
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
      id: row.id!
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
      id: row.id!
    })
    if (data) {
      $baseMessage('审核通过成功！', 'success')
      costQueryData()
    }
  })
}
const handleConfirmDevelopUpdate = async () => {
  developFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await updateDevelopDesignTask({
        id: _id.value,
        baseProportion: Number(developForm.baseProportion) / 100,
        rewardProportion: Number(developForm.rewardProportion) / 100
      })
      if (data) {
        $baseMessage('修改产品开发设计任务成功！', 'success')
        developUpdateVisible.value = false
        developQueryData()
      }
    }
  })
}
const handlePauseDevelop = async (row: IGetDevelopDesignTaskList) => {
  $baseConfirm('确定暂停当前产品开发设计任务吗？', null, async () => {
    const { data } = await pauseDevelopDesignTask({
      id: row.id!
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
      id: row.id!
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
      id: row.id!
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
      id: row.id!
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
  if (name === 0) {
    queryData()
  } else if (name === 1) {
    longQueryData()
  } else if (name === 2) {
    developQueryData()
  } else {
    costQueryData()
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
        lowRate: Number(filterForm.lowRate) / 100
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
      id: row.id!
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
      id: row.id!
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
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === 'SKU' || label === '零件名' || label === '供应商') {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
onBeforeMount(() => {
  fetchSiteList()
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
</style>
