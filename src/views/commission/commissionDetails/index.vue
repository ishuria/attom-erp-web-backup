<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="美工图片" :name="0">
        <vab-query-form>
          <vab-query-form-top-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item label="分类">
                <el-check-tag :checked="queryForm.status === 0" @change="onChangeStatus(0)">未上架</el-check-tag>
                <el-check-tag :checked="queryForm.status === 1" @change="onChangeStatus(1)">进行中</el-check-tag>
                <el-check-tag :checked="queryForm.status === 2" @change="onChangeStatus(2)">暂停</el-check-tag>
                <el-check-tag :checked="queryForm.status === 3" @change="onChangeStatus(3)">已结束</el-check-tag>
              </el-form-item>
            </el-form>
          </vab-query-form-top-panel>
          <vab-query-form-left-panel>
            <el-form inline>
              <template  v-if="currentRoleCode === ROLE_BOSS_CODE">
                <el-form-item label="人员">
                  <el-select v-model="queryForm.userId" placeholder="请选择人员" @change="queryData">
                    <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="站点">
                  <el-select v-model="queryForm.site" placeholder="请选择站点" @change="queryData">
                    <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                  </el-select>
                </el-form-item>
              </template>
              <el-form-item label="发放月份">
                <el-select v-model="queryForm.month" placeholder="请选择发放月份" @change="queryData" >
                  <el-option
                    v-for="item in monthOption"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-text style="margin-left: 10px">提成总金额：</el-text>
                <el-text type="success">234.56元</el-text>
              </el-form-item>
              <el-form-item>
                <el-text style="margin-left: 10px" type="info">(更新时间：{{updateDate}})</el-text>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model="queryForm.keyWord"
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
          border
          :cell-class-name="clearPadding"
          :cell-style="cellStyle"
          class="noneHoverTable"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @cell-click="cellClick"
        >
          <el-table-column label="提成结束日期" min-width="130" prop="endDate">
            <template #default="{ row }">
              {{ row.endDate ? formatDate(new Date(row.endDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="人员" prop="userName" :width="flexColumnWidth(list, '人员', 'userName')" />
          <el-table-column label="图片" prop="skuImageUrl" width="75">
            <template #default="{ row }">
              <el-image :src="row.skuImageUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row.skuImageUrl)">
                <template #error><el-icon /></template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')">
            <template #default="{ row }">
              {{ row.sku }}
              <br />
              {{ row.desc }}
            </template>
          </el-table-column>
          <el-table-column label="站点" min-width="140" prop="siteName" />
          <el-table-column label="状态" min-width="100" prop="status">
            <template #default="{ row }">
              <el-tag v-if="row.status === '未上架'" type="info">{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '已结束'" type="danger">{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '暂停'" type="warning">{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '进行中'" type="success">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="提成模式" min-width="100" prop="mold" />
          <el-table-column label="类型" min-width="110" prop="type" />
          <el-table-column label="奖金￥" min-width="100" prop="bonus">
            <template #default="{ row }">
              {{ row.bonus ? '￥' + row.bonus : '' }}
            </template>
          </el-table-column>
          <el-table-column label="站点分布" min-width="100" prop="">
            <div style="width: 100%; height: 60px">
              <vab-echarts-chart-pie :data="data1" />
            </div>
          </el-table-column>
          <el-table-column label="提成开始日期" min-width="130" prop="startDate">
            <template #default="{ row }">
              {{ row.startDate ? formatDate(new Date(row.startDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="剩余提成天数" min-width="130">
            <template #default="{ row }">{{ row.remainingDays }} / {{ row.commissionDay }}</template>
          </el-table-column>
          <el-table-column label="销售额/差额" min-width="110" prop="salesDifference">
            <template #default="{ row }">{{ row.currencySymbol }}{{ row.salesDifference }}</template>
          </el-table-column>
          <el-table-column label="汇率" min-width="100" prop="avgRate" />
          <el-table-column label="提成比例" min-width="120" prop="cooperationProportion">
            <template #default="{ row }">
              {{ row.cooperationProportion ? row.cooperationProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="转化率加成" min-width="110" prop="conversionRateIncrease" />
          <el-table-column label="断货补偿天数" min-width="130" prop="outOfStockDays" />
          <el-table-column label="提前完成天数" min-width="130" prop="advanceDays">
            <template #default="{ row }">
              <el-text v-if="row.advanceDays >= 0" type="success">{{ row.advanceDays }}</el-text>
              <el-text v-if="row.advanceDays < 0" type="danger">{{ row.advanceDays }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="平均转化率" min-width="110" prop="avgConversionRate">
            <template #default="{ row }">
              {{ row.avgConversionRate ? row.avgConversionRate + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="要求转化率" min-width="130" prop="lowRate">
            <template #default="{ row }">
              {{ row.lowRate ? row.lowRate + '%' : '' }}
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
          <vab-query-form-top-panel>
            <el-form inline :model="longQueryForm" @submit.prevent>
              <el-form-item label="分类">
                <el-check-tag :checked="longQueryForm.status === 0" @change="onChangeLongStatus(0)">进行中</el-check-tag>
                <el-check-tag :checked="longQueryForm.status === 1" @change="onChangeLongStatus(1)">暂停</el-check-tag>
                <el-check-tag :checked="longQueryForm.status === 2" @change="onChangeLongStatus(2)">已结束</el-check-tag>
              </el-form-item>
            </el-form>
          </vab-query-form-top-panel>
          <vab-query-form-left-panel>
            <el-form inline>
             <template   v-if="currentRoleCode === ROLE_BOSS_CODE">
               <el-form-item label="人员">
                 <el-select v-model="longQueryForm.userId" placeholder="请选择人员" @change="longQueryData">
                   <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
                 </el-select>
               </el-form-item>
               <el-form-item label="站点">
                 <el-select v-model="longQueryForm.site" placeholder="请选择站点" @change="longQueryData">
                   <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                 </el-select>
               </el-form-item>
             </template>
              <el-form-item label="发放月份">
                <el-select v-model="longQueryForm.month" placeholder="请选择发放月份" @change="longQueryData" >
                  <el-option
                    v-for="item in monthOption"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-text style="margin-left: 10px">提成总金额：</el-text>
                <el-text type="success">234.56元</el-text>
              </el-form-item>
              <el-form-item>
                <el-text style="margin-left: 10px" type="info">(更新时间：{{updateDate}})</el-text>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="longQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model="longQueryForm.keyWord"
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
        <el-table
          border
          :cell-class-name="clearPadding"
          :cell-style="cellStyle"
          class="noneHoverTable"
          :data="longList"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @cell-click="cellClick"
        >
          <el-table-column label="提成结束日期" min-width="130" prop="endDate">
            <template #default="{ row }">
              {{ row.endDate ? formatDate(new Date(row.endDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="人员" prop="userName" :width="flexColumnWidth(longList, '人员', 'userName')" />
          <el-table-column label="图片" prop="skuImageUrl" width="75">
            <template #default="{ row }">
              <el-image :src="row.skuImageUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row.skuImageUrl)">
                <template #error><el-icon /></template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(longList, 'SKU', 'sku')">
            <template #default="{ row }">
              {{ row.sku }}
              <br />
              {{ row.desc }}
            </template>
          </el-table-column>
          <el-table-column label="站点" min-width="140" prop="siteName" />
          <el-table-column label="状态" min-width="100" prop="status">
            <template #default="{ row }">
              <el-tag v-if="row.status === '未上架'" type="info">{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '已结束'" type="danger">{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '暂停'" type="warning">{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '进行中'" type="success">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="奖金￥" min-width="100" prop="bonus">
            <template #default="{ row }">
              {{ row.bonus ? '￥' + row.bonus : '' }}
            </template>
          </el-table-column>
          <el-table-column label="SKU累计奖金￥" min-width="100" prop="accumulateBonus">
            <template #default="{ row }">
              {{ row.accumulateBonus ? '￥' + row.accumulateBonus : '' }}
            </template>
          </el-table-column>
          <el-table-column label="站点分布" min-width="100" prop="">
            <div style="width: 100%; height: 60px">
              <vab-echarts-chart-pie :data="data1" />
            </div>
          </el-table-column>
          <el-table-column label="提成开始日期" min-width="130" prop="startDate">
            <template #default="{ row }">
              {{ row.startDate ? formatDate(new Date(row.startDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="剩余提成天数" min-width="130">
            <template #default="{ row }">{{ row.remainingDays }} / {{ row.commissionDay }}</template>
          </el-table-column>
          <el-table-column label="当月销售额" min-width="110" prop="monthSales">
            <template #default="{ row }">
              <span v-if="row.monthSales">{{ row.currencySymbol }}{{ row.monthSales }}</span>
            </template>
          </el-table-column>
          <el-table-column label="汇率" min-width="100" prop="exchangeRate" />
          <el-table-column label="提成比例" min-width="120" prop="cooperationProportion">
            <template #default="{ row }">
              {{ row.cooperationProportion ? row.cooperationProportion + '%' : '' }}
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
          <vab-query-form-left-panel>
            <el-form inline>
              <template  v-if="currentRoleCode === ROLE_BOSS_CODE">
                <el-form-item label="人员">
                  <el-select v-model="developQueryForm.userId" placeholder="请选择人员" @change="developQueryData">
                    <el-option v-for="item in developUserList" :key="item.id" :label="item.label" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="站点">
                  <el-select v-model="developQueryForm.site" placeholder="请选择站点" @change="developQueryData">
                    <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                  </el-select>
                </el-form-item>
              </template>
              <el-form-item label="发放月份">
                <el-select v-model="developQueryForm.month" placeholder="请选择发放月份" @change="developQueryData" >
                  <el-option
                    v-for="item in monthOption"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-text style="margin-left: 10px">提成金额：</el-text>
                <el-text type="success">{{ amount3.toFixed(2) }}元</el-text>
              </el-form-item>
              <el-form-item>
                <el-text style="margin-left: 10px" type="info">(更新时间：{{updateDate}})</el-text>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="developQueryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model="developQueryForm.keyWord"
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
        <el-table
          border
          :cell-class-name="clearPadding"
          :cell-style="cellStyle"
          class="noneHoverTable"
          :data="developList"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @cell-click="cellClick"
        >
          <el-table-column label="发布日期" min-width="130" prop="releaseDate">
            <template #default="{ row }">
              {{ row.releaseDate ? formatDate(new Date(row.releaseDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="人员" prop="userName" :width="flexColumnWidth(developList, '人员', 'userName')" />
          <el-table-column label="图片" prop="skuImageUrl" width="75">
            <template #default="{ row }">
              <el-image :src="row.skuImageUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row.skuImageUrl)">
                <template #error><el-icon /></template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(developList, 'SKU', 'sku')">
            <template #default="{ row }">
              {{ row.sku }}
              <br />
              {{ row.desc }}
            </template>
          </el-table-column>
          <el-table-column label="站点" min-width="150" prop="siteName" />
          <el-table-column label="状态" min-width="100" prop="status">
            <template #default="{ row }">
              <el-tag v-if="row.status === '暂停'" type="warning">{{ row.status }}</el-tag>
              <el-tag v-if="row.status === '进行中'" type="success">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="提成角色" min-width="100" prop="commissionRole" />
          <el-table-column label="当月总提成" min-width="110" prop="currentMonthBonus">
            <template #default="{ row }">
              <el-text v-if="row.currentMonthBonus >= 0" type="success">
                {{ row.currentMonthBonus ? '￥' + row.currentMonthBonus : '' }}
              </el-text>
              <el-text v-if="row.currentMonthBonus < 0" type="danger">
                {{ row.currentMonthBonus ? '￥' + row.currentMonthBonus : '' }}
              </el-text>
            </template>
          </el-table-column>
          <el-table-column label="SKU累计提成￥" min-width="140" prop="cumulativeCommission">
            <template #default="{ row }">
              {{ row.cumulativeCommission ? '￥' + row.cumulativeCommission : '' }}
            </template>
          </el-table-column>
          <el-table-column label="站点分布" min-width="130" prop="">
            <div style="width: 100%; height: 60px">
              <vab-echarts-chart-pie :data="data1" />
            </div>
          </el-table-column>
          <el-table-column label="总提成比例" min-width="120" prop="totalCommissionProportion">
            <template #default="{ row }">
              {{ row.totalCommissionProportion ? row.totalCommissionProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="基础提成比例" min-width="120" prop="baseProportion">
            <template #default="{ row }">
              {{ row.baseProportion ? row.baseProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="超额完成加成" min-width="120" prop="rewardProportion">
            <template #default="{ row }">
              {{ row.rewardProportion ? row.rewardProportion + '%' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="月净利润" min-width="130">
            <template #default="{ row }">
              <el-text v-if="row.monthProfit >= 0" type="success">{{ row.currencySymbol }}{{ row.monthProfit }}</el-text>
              <el-text v-if="row.monthProfit < 0" type="danger">{{ row.currencySymbol }}{{ row.monthProfit }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="月销售额" min-width="130">
            <template #default="{ row }">{{ row.currencySymbol }}{{ row.monthSales }}</template>
          </el-table-column>
          <el-table-column label="月净利率" min-width="130" prop="monthProfitMargin">
            <template #default="{ row }">
              <el-text v-if="row.monthProfitMargin >= 0" type="success">
                {{ row.monthProfitMargin ? row.monthProfitMargin + '%' : '' }}
              </el-text>
              <el-text v-if="row.monthProfitMargin < 0" type="danger">
                {{ row.monthProfitMargin ? row.monthProfitMargin + '%' : '' }}
              </el-text>
            </template>
          </el-table-column>
          <el-table-column label="月销量" min-width="100" prop="monthSalesVolume" />
          <el-table-column label="汇率" min-width="100" prop="exchangeRate" />
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
    </el-tabs>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- 站点分布 -->
    <vab-dialog v-model="sitePieVisible" :title="`${'2024年1月'}各站点奖金占比`" width="30%" @open="handlePieOpened">
      <div ref="chartContainer" style="width: 100%; height: 400px"></div>
      <template #footer></template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { TabsPaneContext } from 'element-plus'
import type { CSSProperties } from 'vue'
import { getCommissionDetailDevelopList, getCommissionDetailLongList, getCommissionDetailPictureList, getCommissionTypeMonth, getDevelopDesignDetailUserList } from '/@/api/devlocal/commission'
import { getArtDesignTaskUserList } from '/@/api/devlocal/imageTask'
import { getOperationUpdateDate } from '/@/api/devlocal/productPerformance'
import { getSeasonalCoefficientSiteList } from '/@/api/devlocal/seasonalCoefficient'
import { ROLE_BOSS_CODE } from '/@/const/role.ts'
import { useAclStore } from '/@/store/modules/acl'
import type {
  IGetCommissionDetailDevelopList,
  IGetCommissionDetailDevelopListReq,
  IGetCommissionDetailLongList,
  IGetCommissionDetailPictureList,
  IGetCommissionDetailPictureListReq,
} from '/@/type/commission/commissionType'
import { formatDate } from '/@/utils/dateUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'CommissionDetails',
})
const chartContainer = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let chartObserver: ResizeObserver
const currentRoleCode = useAclStore().getRole[0];
const option = ref<any>({})
const data1 = ref<any[]>([
  { value: 300.57, name: '亚马逊UK英国' },
  { value: 211.02, name: '亚马逊US美国' },
  { value: 83.31, name: '亚马逊CA加拿大' },
  { value: 50.31, name: '沃尔玛US美国' },
  { value: 40.3, name: '亚马逊BR巴西' },
  { value: 30.3, name: '亚马逊MX墨西哥' },
  { value: 21.5, name: '亚马逊DE德国' },
  { value: 20.3, name: '亚马逊IT意大利' },
  // { value: 10.3, name: '亚马逊FR法国' },
  // { value: 60.3, name: '亚马逊ES西班牙' },
  // { value: 40.3, name: '亚马逊NL荷兰' },
  // { value: 70.3, name: '亚马逊SE瑞典' },
  // { value: 80.3, name: '亚马逊TR土耳其' },
  // { value: 90.3, name: '亚马逊PL波兰' },
  // { value: 100.3, name: '亚马逊BE比利时' },
])
const sitePieVisible = ref<boolean>(false)

const amount3 = ref<number>(0)

const list = ref<IGetCommissionDetailPictureList[]>([])
const longList = ref<IGetCommissionDetailLongList[]>([])
const developList = ref<IGetCommissionDetailDevelopList[]>([])

const siteList = ref<{ id: number; label: string }[]>([])
const userList = ref<{ id: number; label: string }[]>([])
const activeName = ref<number>(0)
const queryForm = reactive<IGetCommissionDetailPictureListReq>({
  keyWord: '',
  site: -1,
  userId: -1,
  month: '',
  status: 1,
  pageNo: 1,
  pageSize: 20,
})
const longQueryForm = reactive<IGetCommissionDetailPictureListReq>({
  keyWord: '',
  site: -1,
  userId: -1,
  month: '',
  status: 0,
  pageNo: 1,
  pageSize: 20,
})
const developQueryForm = reactive<IGetCommissionDetailDevelopListReq>({
  keyWord: '',
  site: -1,
  userId: -1,
  month: '',
  pageNo: 1,
  pageSize: 20,
})

const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])

const initChart = () => {
  // 配置项
  option.value = {
    // legend: {
    //   // top: '5%',
    //   left: 'center'
    // },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">${params.data.name}</div>`

        // tooltip详情内容
        let itemHtmlStrArr = ''

        itemHtmlStrArr = `<div style="display: flex;align-items:center;">
          ${params.marker}
          <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 20px 0 2px;">奖金: </div>
          <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">￥${params.data.value} | ${params.percent}%</span>
        </div>`

        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr}
        </div>`
        // 最终html字符串
        const resHtmlStr = titleHtmlStr + contentHtmlStr
        return resHtmlStr
      },
    },
    series: [
      {
        name: '奖金',
        type: 'pie',
        radius: '65%',
        left: 0,
        right: 0,
        top: 0,
        bottom: 20,
        // clockwise: false,
        startAngle: 90, //起始角度
        labelLine: {
          lineStyle: {
            width: 1.5,
          },
          length: 15,
          length2: 0,
          maxSurfaceAngle: 80,
        },
        avoidLabelOverlap: true, // 避免标签重叠
        minShowLabelAngle: 5,
        label: {
          position: 'outer',
          alignTo: 'edge',
          edgeDistance: 10,
          lineHeight: 20,
          formatter: (params: any) => {
            const { data, percent } = params
            // const sortedData = params.seriesData
            //   .sort((a: any, b: any) => b.value - a.value) // 排序
            //   .slice(0, 3); // 获取前 3 项
            return `{a|${data.name}}\n{x|￥${data.value} | ${percent}% }`
          },

          rich: {
            a: {
              color: '#000',
              fontSize: 17,
              fontWeight: 550,
              // padding: [0, 0, 5, 0],
            },
            x: {
              color: '#999',
              fontSize: 16,
              lineHeight: 20,
              // padding: [15, 0, 10, 0],
            },
          },
        },
        labelLayout(params: any) {
          const isLeft = params.labelRect.x < chartInstance?.getWidth()! / 2
          const points = params.labelLinePoints as number[][]
          // Update the end point.
          points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width

          return {
            labelLinePoints: points,
          }
        },
        data: data1,
        color: [
          '#ffdc4c', // 金黄色
          '#62d9ad', // 青绿色
          '#e65a56', // 珊瑚红
          '#00aeef', // 天蓝色
          '#ffa500', // 橙色
          '#20c997', // 翠绿色
          '#f94d50', // 鲜红色
          '#0088cc', // 深天蓝色
          '#ffcc33', // 明黄色
          '#66cdaa', // 中青绿色
          '#d9534f', // 番茄红
          '#33b5e5', // 浅蓝色
          '#ffc107', // 柠檬黄
          '#3cb371', // 春绿色
          '#dc3545', // 枸杞红
          '#5bc0de', // 宝石蓝
        ],
      },
    ],
  }
  chartInstance?.setOption(option.value)
}
const handlePieOpened = () => {
  nextTick(() => {
    if (chartContainer.value) {
      chartInstance = echarts.init(chartContainer.value)
      chartObserver = new ResizeObserver(() => {
        if (chartInstance) {
          chartInstance.resize()
        }
      })
      chartObserver.observe(chartContainer.value)
      initChart()
    }
  })
}
const cellClick = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  const label = column.label
  if (label === '站点分布') {
    sitePieVisible.value = true
  }
}

const handleTabClick = async (tab: TabsPaneContext) => {
  const name = tab.props.name
  activeName.value = Number(name)
  await fetchCommissionTypeMonth()
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
      fetchDevelopUserList()
      developQueryData()

      break
    }
    // No default
  }
  fetchUpdateDate()
  // else {
  //   costQueryData()
  // }
}
const onChangeStatus = (value: number) => {
  queryForm.status = value
  queryData()
}
const onChangeLongStatus = (value: number) => {
  longQueryForm.status = value
  longQueryData()
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
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

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === 'SKU') {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片' || data.column.label === '零件图片') {
    return 'clear-padding'
  }
  return ''
}
const fetchSiteList = async () => {
  const { data } = await getSeasonalCoefficientSiteList()
  siteList.value = data
  siteList.value.unshift({ id: -1, label: '全部' })
}
const developUserList = ref<{ id: number; label: string }[]>([])
const fetchDevelopUserList = async () => {
  const { data } = await getDevelopDesignDetailUserList()
  developUserList.value = data
  developUserList.value.unshift({ id: -1, label: '全部' })
}
const fetchUserList = async () => {
  const { data } = await getArtDesignTaskUserList()
  userList.value = data
  userList.value.unshift({ id: -1, label: '全部' })
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getCommissionDetailPictureList(queryForm)
  if (data) {
    total.value = data.total
    list.value = data.list
  }
  listLoading.value = false
}
const fetchLongData = async () => {
  listLoading.value = true
  const { data } = await getCommissionDetailLongList(longQueryForm)
  if (data) {
    total.value = data.total
    longList.value = data.list
    longList.value.forEach((item) => {
      if (item.cooperationProportion) {
        item.cooperationProportion = parseFloat((item.cooperationProportion * 100).toFixed(2))
      }
    })
  }
  listLoading.value = false
}
const fetchDevelopData = async () => {
  listLoading.value = true
  const { data } = await getCommissionDetailDevelopList(developQueryForm)
  if (data) {
    amount3.value = 0
    total.value = data.total
    developList.value = data.list
    developList.value.forEach((item) => {
      if (item.currentMonthBonus) {
        amount3.value += item.currentMonthBonus
      }
      if (item.totalCommissionProportion) {
        item.totalCommissionProportion = parseFloat((item.totalCommissionProportion * 100).toFixed(2))
      }
      if (item.baseProportion) {
        item.baseProportion = parseFloat((item.baseProportion * 100).toFixed(2))
      }
      if (item.rewardProportion) {
        item.rewardProportion = parseFloat((item.rewardProportion * 100).toFixed(2))
      }
      if (item.monthProfitMargin) {
        item.monthProfitMargin = parseFloat((item.monthProfitMargin * 100).toFixed(2))
      }
    })
  }
  listLoading.value = false
}

const updateDate = ref<string | undefined>('')
const fetchUpdateDate = async () => {
  const { data } = await getOperationUpdateDate({ type: activeName.value + 3})
  updateDate.value = data
}
const monthOption = ref<{ id: number, label: string }[]>([])
const fetchCommissionTypeMonth = async () => {
  const { data } = await getCommissionTypeMonth({ type: activeName.value })
  monthOption.value = data
  switch(activeName.value) {
    case 0: {
      if (monthOption.value.length > 0) {
        queryForm.month = monthOption.value[0].label
      }
      break
    }
    case 1: {
      if (monthOption.value.length > 0) {
        longQueryForm.month = monthOption.value[0].label
      }
      break
    }
    case 2: {
      if (monthOption.value.length > 0) {
        developQueryForm.month = monthOption.value[0].label
      }
      break
    }
  }
}
onBeforeMount(async () => {
  await fetchSiteList()
  await fetchUpdateDate()
  await fetchCommissionTypeMonth()
  switch(activeName.value) {
    case 0: {
      fetchUserList()
      queryData()
      break
    }
    case 1: {
      fetchUserList()
      longQueryData()
      break
    }
    case 2: {
      fetchDevelopUserList()
      developQueryData()
      break
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

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
          }
        }

        .noneHoverTable {
          flex: 1;
          .clear-padding {
            padding-top: 0;
            padding-bottom: 0;
            .cell {
              padding-right: 0;
              padding-left: 0;
            }
          }
        }
      }
    }
  }
}
</style>
