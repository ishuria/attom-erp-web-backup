<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" :lazy="true" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="进行中" :name="8">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item label="审批状态">
                <el-select v-model="queryForm.status" @change="queryData">
                  <el-option v-for="item in reviewStatusOption" :key="item.value" :label="item.label" :value="item.value">
                    <el-text :style="{ color: getStatusBaseColor(item.value), marginRight: '6px' }">{{ item.label }}</el-text>
                  </el-option>
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
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          ref="tableRef"
          border
          :cell-class-name="clearPadding"
          :cell-style="cellStyle"
          class="noneHoveTable custom-table-hover"
          :data="dataList"
          :header-cell-style="{ 'text-align': 'center' }"
          :row-class-name="stripedRowClass"
          :span-method="objectSpanMethod"
          @row-click="handleRowClick"
        >
          <el-table-column label="提交日期" min-width="115" prop="createTime">
            <template #default="{ row }">
              <span>{{ formatDate(new Date(row.createTime)) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="图片" width="75">
            <template #default="{ row }">
              <el-image
                fit="fill"
                :src="row.skuImage"
                style="display: block; width: 75px; height: 75px"
                @click="setPreviewList(row.skuImage)"
              >
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" :min-width="Math.max(columnWidths.sku + 30, columnWidths.productName + 30)" prop="sku">
            <template #default="{ row }">
              {{ row.sku }}
              <br />
              {{ row.productName }}
            </template>
          </el-table-column>
          <el-table-column label="主站点" min-width="130" prop="siteName" />
          <el-table-column label="主站首单Po" min-width="115" prop="po" />
          <el-table-column label="首单实际成本" prop="poCost" width="125" />
          <el-table-column label="审批成本" min-width="100" prop="reviewCost" />
          <el-table-column label="相差" min-width="100" prop="difference" />
          <el-table-column label="产品定位" :min-width="columnWidths.productPosition + 30" prop="productPosition" />
          <el-table-column label="Vine数量" min-width="100" prop="vineCount" />
          <el-table-column label="平面设计" min-width="90" prop="graphicDesign">
            <template #default="{ row }">
              <el-checkbox
                v-model="row.graphicDesign"
                class="custom-checkbox"
                :disabled="true"
                :false-value="0"
                size="large"
                :true-value="1"
              />
            </template>
          </el-table-column>
          <el-table-column label="OEM" prop="oem" width="80">
            <template #default="{ row }">
              <el-checkbox v-model="row.oem" class="custom-checkbox" :disabled="true" :false-value="0" size="large" :true-value="1" />
            </template>
          </el-table-column>

          <el-table-column label="有效计数" min-width="100" prop="effectiveCount">
            <template #default="{ row }">
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.effectiveCount + 'px', 'text-align': 'right' }">
                {{ row.effectiveCount }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="产品经理" min-width="100" prop="productManager">
            <template #default="{ row }">
              <span
                :style="{ display: 'inline-block', 'min-width': columnWidths.productManager + 'px', 'text-align': 'left' }"
                v-html="row.productManager"
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="产品设计" min-width="100" prop="productDesign">
            <template #default="{ row }">
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.productDesign + 'px', 'text-align': 'left' }">
                {{ row.productDesign }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="立项日期" min-width="115" prop="projectInitiationDate">
            <template #default="{ row }">
              <span>{{ formatDate(new Date(row.projectInitiationDate)) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审批日期" min-width="115" prop="reviewDate">
            <template #default="{ row }">
              <span>{{ row.reviewDate != null ? formatDate(new Date(row.reviewDate)) : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="耗时" min-width="100" prop="timeConsuming">
            <template #default="{ row }">
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.timeConsuming + 'px', 'text-align': 'right' }">
                {{ row.timeConsuming }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="审批状态" min-width="130" prop="reviewStatus">
            <template #default="{ row }">
              <el-tag :style="getSiteTagStyle(row.reviewStatus)">{{ generateStatus(row.reviewStatus) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审批人" min-width="100" prop="reviewPersonName">
            <template #default="{ row }">
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.reviewPersonName + 'px', 'text-align': 'left' }">
                {{ row.reviewPersonName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="新款评估编号" min-width="100" prop="evaluationId">
            <template #header>
              新款评估
              <br />
              编号
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="130">
            <template #default="{ row }">
              <el-dropdown>
                <el-button text type="primary" @click="handleOrderProcess(row)">
                  {{ row.reviewStatus === 0 || row.reviewStatus === 2 ? '编辑' : '查看' }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleOrderProcess(row)">
                      <el-link type="primary" underline="never">
                        {{ row.reviewStatus === 0 || row.reviewStatus === 2 ? '编辑' : '查看' }}
                      </el-link>
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="
                        row.reviewStatus === 1 ||
                        row.reviewStatus === 2 ||
                        row.reviewStatus === 3 ||
                        row.reviewStatus === 4 ||
                        row.reviewStatus === 5 ||
                        row.reviewStatus === 7
                      "
                      @click="handleOrderReview(row)"
                    >
                      <el-link type="primary" underline="never">审批和PO发布</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleGetScoreById(row.reviewMainId)">
                      <el-link type="primary" underline="never">分数明细</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleArchived(row.reviewMainId)">
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
      <el-tab-pane label="已完成" :name="6">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
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
        <el-table
          ref="tableRef"
          border
          :cell-class-name="clearPadding"
          :cell-style="cellStyle"
          class="noneHoveTable custom-table-hover"
          :data="dataList"
          :header-cell-style="{ 'text-align': 'center' }"
          :row-class-name="stripedRowClass"
          :span-method="objectSpanMethod"
          @row-click="handleRowClick"
          @sort-change="handleSortChange"
        >
          <el-table-column label="提交日期" min-width="115" prop="createTime">
            <template #default="{ row }">
              <span>{{ formatDate(new Date(row.createTime)) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="图片" width="75">
            <template #default="{ row }">
              <el-image
                fit="fill"
                :src="row.skuImage"
                style="display: block; width: 75px; height: 75px"
                @click="setPreviewList(row.skuImage)"
              >
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" :min-width="Math.max(columnWidths.sku + 30, columnWidths.productName + 30)" prop="sku">
            <template #default="{ row }">
              {{ row.sku }}
              <br />
              {{ row.productName }}
            </template>
          </el-table-column>
          <el-table-column label="主站点" min-width="130" prop="siteName" />
          <el-table-column label="主站首单Po" min-width="115" prop="po" />
          <el-table-column label="首单实际成本" prop="poCost" width="125" />
          <el-table-column label="审批成本" min-width="100" prop="reviewCost" />
          <el-table-column label="相差" min-width="100" prop="difference" sortable="custom" />
          <el-table-column label="产品定位" :min-width="columnWidths.productPosition + 30" prop="productPosition" />
          <el-table-column label="Vine数量" min-width="100" prop="vineCount" />
          <el-table-column label="平面设计" min-width="90" prop="graphicDesign">
            <template #default="{ row }">
              <el-checkbox
                v-model="row.graphicDesign"
                class="custom-checkbox"
                :disabled="true"
                :false-value="0"
                size="large"
                :true-value="1"
              />
            </template>
          </el-table-column>
          <el-table-column label="OEM" prop="oem" width="80">
            <template #default="{ row }">
              <el-checkbox v-model="row.oem" class="custom-checkbox" :disabled="true" :false-value="0" size="large" :true-value="1" />
            </template>
          </el-table-column>

          <el-table-column label="有效计数" min-width="100" prop="effectiveCount">
            <template #default="{ row }">
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.effectiveCount + 'px', 'text-align': 'right' }">
                {{ row.effectiveCount }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="产品经理" min-width="100" prop="productManager">
            <template #default="{ row }">
              <span
                :style="{ display: 'inline-block', 'min-width': columnWidths.productManager + 'px', 'text-align': 'left' }"
                v-html="row.productManager"
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="产品设计" min-width="100" prop="productDesign">
            <template #default="{ row }">
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.productDesign + 'px', 'text-align': 'left' }">
                {{ row.productDesign }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="立项日期" min-width="115" prop="projectInitiationDate">
            <template #default="{ row }">
              <span>{{ formatDate(new Date(row.projectInitiationDate)) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审批日期" min-width="115" prop="reviewDate">
            <template #default="{ row }">
              <span>{{ row.reviewDate != null ? formatDate(new Date(row.reviewDate)) : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="耗时" min-width="100" prop="timeConsuming">
            <template #default="{ row }">
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.timeConsuming + 'px', 'text-align': 'right' }">
                {{ row.timeConsuming }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="审批状态" min-width="130" prop="reviewStatus">
            <template #default="{ row }">
              <el-tag type="success">{{ generateStatus(row.reviewStatus) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审批人" min-width="100" prop="reviewPersonName">
            <template #default="{ row }">
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.reviewPersonName + 'px', 'text-align': 'left' }">
                {{ row.reviewPersonName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="新款评估编号" min-width="100" prop="evaluationId">
            <template #header>
              新款评估
              <br />
              编号
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="130">
            <template #default="{ row }">
              <el-dropdown>
                <el-button text type="primary" @click="handleOrderProcess(row)">
                  {{ row.reviewStatus === 0 || row.reviewStatus === 2 ? '编辑' : '查看' }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleOrderProcess(row)">
                      <el-link type="primary" underline="never">
                        {{ row.reviewStatus === 0 || row.reviewStatus === 2 ? '编辑' : '查看' }}
                      </el-link>
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="
                        row.reviewStatus === 1 ||
                        row.reviewStatus === 2 ||
                        row.reviewStatus === 3 ||
                        row.reviewStatus === 4 ||
                        row.reviewStatus === 5 ||
                        row.reviewStatus === 7
                      "
                      @click="handleOrderReview(row)"
                    >
                      <el-link type="primary" underline="never">审批和PO发布</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleGetScoreById(row.reviewMainId)">
                      <el-link type="primary" underline="never">分数明细</el-link>
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
      <el-tab-pane label="已归档" :name="9">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
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
        <el-table
          ref="tableRef"
          border
          :cell-class-name="clearPadding"
          :cell-style="cellStyle"
          class="noneHoveTable custom-table-hover"
          :data="dataList"
          :header-cell-style="{ 'text-align': 'center' }"
          :row-class-name="stripedRowClass"
          :span-method="objectSpanMethod"
          @row-click="handleRowClick"
        >
          <el-table-column label="提交日期" min-width="115" prop="createTime">
            <template #default="{ row }">
              <span>{{ formatDate(new Date(row.createTime)) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="图片" width="75">
            <template #default="{ row }">
              <el-image
                fit="fill"
                :src="row.skuImage"
                style="display: block; width: 75px; height: 75px"
                @click="setPreviewList(row.skuImage)"
              >
                <template #error>
                  <el-icon />
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" :min-width="Math.max(columnWidths.sku + 30, columnWidths.productName + 30)" prop="sku">
            <template #default="{ row }">
              {{ row.sku }}
              <br />
              {{ row.productName }}
            </template>
          </el-table-column>
          <el-table-column label="主站点" min-width="130" prop="siteName" />
          <el-table-column label="主站首单Po" min-width="115" prop="po" />
          <el-table-column label="首单实际成本" prop="poCost" width="125" />
          <el-table-column label="审批成本" min-width="100" prop="reviewCost" />
          <el-table-column label="相差" min-width="100" prop="difference" />
          <el-table-column label="产品定位" :min-width="columnWidths.productPosition + 30" prop="productPosition" />
          <el-table-column label="Vine数量" min-width="100" prop="vineCount" />
          <el-table-column label="平面设计" min-width="90" prop="graphicDesign">
            <template #default="{ row }">
              <el-checkbox
                v-model="row.graphicDesign"
                class="custom-checkbox"
                :disabled="true"
                :false-value="0"
                size="large"
                :true-value="1"
              />
            </template>
          </el-table-column>
          <el-table-column label="OEM" prop="oem" width="80">
            <template #default="{ row }">
              <el-checkbox v-model="row.oem" class="custom-checkbox" :disabled="true" :false-value="0" size="large" :true-value="1" />
            </template>
          </el-table-column>

          <el-table-column label="有效计数" min-width="100" prop="effectiveCount">
            <template #default="{ row }">
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.effectiveCount + 'px', 'text-align': 'right' }">
                {{ row.effectiveCount }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="产品经理" min-width="100" prop="productManager">
            <template #default="{ row }">
              <span
                :style="{ display: 'inline-block', 'min-width': columnWidths.productManager + 'px', 'text-align': 'left' }"
                v-html="row.productManager"
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="产品设计" min-width="100" prop="productDesign">
            <template #default="{ row }">
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.productDesign + 'px', 'text-align': 'left' }">
                {{ row.productDesign }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="立项日期" min-width="115" prop="projectInitiationDate">
            <template #default="{ row }">
              <span>{{ formatDate(new Date(row.projectInitiationDate)) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审批日期" min-width="115" prop="reviewDate">
            <template #default="{ row }">
              <span>{{ row.reviewDate != null ? formatDate(new Date(row.reviewDate)) : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="耗时" min-width="100" prop="timeConsuming">
            <template #default="{ row }">
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.timeConsuming + 'px', 'text-align': 'right' }">
                {{ row.timeConsuming }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="审批状态" min-width="100" prop="reviewStatus">
            <template #default="{ row }">
              <el-tag type="info">已归档</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审批人" min-width="100" prop="reviewPersonName">
            <template #default="{ row }">
              <span :style="{ display: 'inline-block', 'min-width': columnWidths.reviewPersonName + 'px', 'text-align': 'left' }">
                {{ row.reviewPersonName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="新款评估编号" min-width="100" prop="evaluationId">
            <template #header>
              新款评估
              <br />
              编号
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="130">
            <template #default="{ row }">
              <el-link type="primary" underline="never" @click="handleGetScoreById(row.reviewMainId)">分数明细</el-link>
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

    <!-- 新款评估 -->
    <vab-dialog v-model="newScoreVisible" :before-close="handlerScoreCloseDialog" class="moldDialog" title="分数明细" width="90%">
      <el-divider style="margin-top: 0; margin-bottom: 20px" />
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
    <!-- 关键词趋势图表 -->
    <vab-trend
      :key-word="inputKeyWord"
      :trend-data="trendEcahts"
      :trend-echarts-visible="keyWordTrendEchatsVisible"
      @update:clear-input-key-word="cleanKeyWordTrendData"
      @update:trend-echarts-list="updateTrendEchatsData"
      @update:visible-value="updateTrendVisibleValue"
    />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import type { TableColumnCtx, TableInstance, TabsPaneContext } from 'element-plus'
import type { CSSProperties } from 'vue'
import { indexColumns } from '../newProductProgress/indexColumns'
import { getReviewEvaluationId, getReviewList, updateReviewArchived } from '/@/api/devlocal/orderingReview'
import { getByIdQueryEvaluation } from '/@/api/devlocal/progress'
import type { IKeyWordTrend } from '/@/type/evaluation/evaluationType'
import type { IGetByIdQueryEvaluation } from '/@/type/progress/progressType'
import type { IReviewQueryItem, IReviewQueryReq } from '/@/type/review/review'
import { formatDate } from '/@/utils/dateUtils'
import { _setStepNo } from '/@/utils/stepNoState'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'NewProductApprovalAndRecords',
})

const activeName = ref<number>(8)
const handleTabClick = (tab: TabsPaneContext) => {
  queryForm.status = Number(tab.props.name)
  queryData()
}
const reviewStatusOption = ref<{ label: string; value: number }[]>([
  { label: '全部', value: 8 },
  { label: '编辑中', value: 0 },
  { label: '待审核', value: 1 },
  { label: '主管审批未通过', value: 2 },
  { label: 'SKU创建', value: 3 },
  { label: '运营分货', value: 4 },
  { label: '待发布PO', value: 5 },
  { label: '待产品经理审核', value: 7 },
])
const selectedRowIndex = ref<number>(-1)
// 行点击处理函数
const handleRowClick = (row: any, column: any, event: Event) => {
  selectedRowIndex.value = row.reviewMainId
}

const columnWidths = computed(() => ({
  sku: flexColumnWidth(dataList.value, 'SKU', 'sku', 0),
  productName: flexColumnWidth(dataList.value, '产品', 'productName', 0),
  effectiveCount: flexColumnWidth(dataList.value, '有效计m', 'effectiveCount', 0),
  timeConsuming: flexColumnWidth(dataList.value, '耗m', 'timeConsuming', 0),
  productManager: flexColumnWidth(dataList.value, '产品经理', 'other', 0),
  productDesign: flexColumnWidth(dataList.value, '产品设计', 'other', 0),
  reviewStatus: flexColumnWidth(dataList.value, '审批状态', 'reviewStatus', 0),
  reviewPersonName: flexColumnWidth(dataList.value, '审批人', 'other', 0),
  productPosition: flexColumnWidth(dataList.value, '产品定位', 'productPosition', 0),
}))
interface SpanMethodProps {
  row: IReviewQueryItem
  column: TableColumnCtx<IReviewQueryItem>
  rowIndex: number
  columnIndex: number
}
const router = useRouter()
const route = useRoute()
const tableRef = ref<TableInstance>()
const listLoading = ref<boolean>(true)
const total = ref<number>(0)
const queryForm = reactive<IReviewQueryReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  status: 8,
  orderByField: '',
  orderDirection: 'desc',
})

const dataList = ref<IReviewQueryItem[]>([])
// 控制分数明细是否显示
const newScoreVisible = ref<boolean>(false)
// 根据评估id找到的新款评估信息
const newEvaluationData = ref<IGetByIdQueryEvaluation[]>([])
// 输入的关键词
const inputKeyWord = ref<string>('')
// 图表
const trendEcahts = ref<IKeyWordTrend>({
  xAxis: [],
  yAxis: [],
})
const keyWordTrendEchatsVisible = ref<boolean>(false)
const formattedProgressLog = (str: string) => {
  return str.replaceAll(/([\u4e00-\u9fa5]) ([A-Za-z])/g, '$1<br>$2').replaceAll(/([A-Za-z]) ([\u4e00-\u9fa5])/g, '$1<br>$2')
}
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
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
// 分数明细
const handleGetScoreById = async (idNo: number) => {
  const { data: evaluationId } = await getReviewEvaluationId({ reviewId: idNo })

  newScoreVisible.value = true
  const { data } = await getByIdQueryEvaluation({ idNo: evaluationId })
  newEvaluationData.value = [data]
}
const handlerScoreCloseDialog = () => {
  newScoreVisible.value = false
}
const keyWordTrendCellClick = async (row: any, column: any) => {
  if (column.label === '关键词趋势') {
    inputKeyWord.value = row.amazonFrontendKeywords
    trendEcahts.value.xAxis = row.trendList.xAxis
    trendEcahts.value.yAxis = row.trendList.yAxis
    keyWordTrendEchatsVisible.value = true
  }
}
const updateTrendVisibleValue = (newValue: boolean) => {
  keyWordTrendEchatsVisible.value = newValue
}
// 清除关键词趋势相关数据
const cleanKeyWordTrendData = (newValue: string) => {
  inputKeyWord.value = newValue
  trendEcahts.value.xAxis = []
  trendEcahts.value.yAxis = []
  keyWordTrendEchatsVisible.value = false
}
const updateTrendEchatsData = (newValue: IKeyWordTrend) => {
  trendEcahts.value = newValue
}

// 审批状态对应的文本和颜色
// 审批状态 -> 自定义颜色映射
const getStatusBaseColor = (status: number) => {
  const colorMap: Record<number, string> = {
    0: '#E6A23C', // 编辑中 - 橙色
    1: '#409EFF', // 待审核 - 蓝色
    2: '#F56C6C', // 主管审批未通过 - 红色
    3: '#67C23A', // SKU创建 - 绿色
    4: '#8E44AD', // 运营分货 - 紫色
    5: '#2AC3A2', // 待发布PO - 青绿
    7: '#9AC332', // 待提交给采购审核
  }
  return colorMap[status] ?? '#909399'
}

// 返回协调的tag样式：浅色背景 + 同色文字
const getSiteTagStyle = (status: number) => {
  const base = getStatusBaseColor(status)
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

const generateStatus = (value: number) => {
  switch (value) {
    case 0: {
      return '编辑中'
    }
    case 1: {
      return '待审核'
    }
    case 2: {
      return '主管审批未通过'
    }
    case 3: {
      return 'SKU创建'
    }
    case 4: {
      return '运营分货'
    }
    case 5: {
      return '待发布PO'
    }
    case 6: {
      return '已完成'
    }
    case 7: {
      return '待产品经理审核'
    }
    default: {
      return '未知'
    }
  }
}
const handleArchived = (reviewMainId: number) => {
  $baseConfirm('确定要归档吗？', null, async () => {
    const { data } = await updateReviewArchived({ reviewId: reviewMainId })
    if (data === true) {
      $baseMessage('此条新品审核信息已归档成功!', 'success', 'hey')
      fetchData()
    }
  })
}

const fetchData = async () => {
  if (route.query.reviewId) {
    queryForm.keyWord = route.query.reviewId as string
  }
  listLoading.value = true
  const { data } = await getReviewList(queryForm)
  dataList.value = data.list!
  total.value = data.total
  listLoading.value = false
  previous = null
  currentGroupIndex = 0
}

const handleOrderReview = (row: IReviewQueryItem) => {
  // console.log(row);
  router.push({
    path: '/newProductDevelopment/orderingReview',
    query: {
      reviewId: row.reviewMainId,
      reviewStatus: row.reviewStatus,
      reviewStepNo: row.reviewStepNo,
    },
  })
}

const handleOrderProcess = (row: IReviewQueryItem) => {
  // 只有编辑的按照row的stepNo设置步骤
  if (row.reviewStatus === 0 || row.reviewStatus === 2) {
    _setStepNo(row.reviewMainId!, row.stepNo!)
  }
  router.push({
    path: '/newProductDevelopment/orderingProcess',
    query: {
      reviewStatus: row.reviewStatus,
      reviewId: row.reviewMainId,
    },
  })
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  router.push({
    query: {
      ...route.query,
      pageNo: '1',
      pageSize: value,
      status: queryForm.status,
    },
  })
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
      ...route.query,
      pageNo: value,
      pageSize: queryForm.pageSize,
      status: queryForm.status,
    },
  })
  fetchData()
}

const queryData = () => {
  queryForm.pageNo = 1
  debugger
  router.push({
    query: {
      ...route.query,
      pageNo: '1',
      status: queryForm.status,
    },
  })
  fetchData()
}

// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
// 修改图片预览列表
const setPreviewList = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}

// 列表col合并方法
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
  const label = column.label
  // 设置需要合并的列
  if (['提交日期', '图片', '立项日期', '审批日期', '耗时', '审批状态', '审批人', '操作', '新款评估编号'].includes(label)) {
    // 获取当前row的id
    const reviewMainId = row.reviewMainId
    // 默认不跨行
    let rowspan = 1
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < dataList.value.length!; i++) {
      // 如果id一样需要合并
      if (dataList.value[i].reviewMainId === reviewMainId) {
        rowspan++
      } else {
        break
      }
    }

    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || dataList.value[rowIndex - 1].reviewMainId !== reviewMainId) {
      return { rowspan, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.columnIndex === 1) {
    return 'clear-padding'
  }
  return ''
}

let previous: any = null
let currentGroupIndex = 0 // 当前组索引

const stripedRowClass = (_row: any) => {
  const { row } = _row

  // 直接基于 reviewMainId 的值来确定条纹，确保稳定性
  const stripedClass = row.reviewMainId % 2 === 0 ? 'el-table__row--striped' : ''

  // 选中状态
  const selectedClass = row.reviewMainId === selectedRowIndex.value ? 'select-row' : ''

  // 组合类名
  return [stripedClass, selectedClass].filter(Boolean).join(' ')
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (['SKU'].includes(data.column.label)) {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}

onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  const { pageNo, pageSize, status } = route.query
  if (pageNo) {
    queryForm.pageNo = Number(pageNo)
  }
  if (pageSize) {
    queryForm.pageSize = Number(pageSize)
  }
  if (status) {
    queryForm.status = Number(status)
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
              margin-bottom: 5px !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
            .el-form-item:last-child {
              margin-bottom: 5px !important;
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

.status-editing {
  color: orange;
}

.status-failed {
  color: red;
}

.status-success {
  color: black;
}

.status-finished {
  color: green;
}

.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}

// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.5px;
}
:deep(.moldDialog .el-dialog__body) {
  padding-top: 0;
}
:deep(.row-striped) {
  // background-color: var(--el-fill-color-lighter);
  background-color: var(--el-fill-color-lighter);
}
.noneHoveTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoveTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
</style>
