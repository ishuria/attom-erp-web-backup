<template>
  <div class="comprehensive-table-container">
    <!-- 筛选区 -->
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item label="平台">
            <el-select v-model="queryForm.platformId" disabled placeholder="请选择平台" style="width: 120px" @change="handlePlatformChange">
              <el-option v-for="item in platformList" :key="item.platformId" :label="item.platformName" :value="item.platformId" />
            </el-select>
          </el-form-item>
          <el-form-item label="站点">
            <el-select
              v-model="queryForm.site"
              :disabled="!queryForm.platformId"
              placeholder="请选择站点"
              style="width: 160px"
              @change="handleSiteChange"
            >
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="种类">
            <el-select
              v-model="queryForm.kindId"
              :disabled="kindList.length === 0"
              placeholder="请选择种类"
              style="width: 150px"
              @change="fetchData"
            >
              <el-option v-for="item in kindList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="运营">
            <el-select
              v-model="queryForm.operationUserId"
              :disabled="operationUserList.length === 0"
              placeholder="请选择运营人员"
              style="width: 150px"
              @change="fetchData"
            >
              <el-option v-for="item in operationUserList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="fetchDataDebounce"
              @keydown.enter="fetchDataDebounce"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="loading" type="primary" @click="fetchDataDebounce" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <!-- 统计卡片 -->
    <div class="stat-section">
      <div class="stat-card" :class="{ 'stat-card--alert': productCount != null && productCount > 0 }">
        <div class="stat-card-content">
          <div class="stat-card-header">
            <span class="stat-name">偏差产品数</span>
            <span class="stat-threshold">≥ 20%</span>
            <el-tooltip content="平均偏差率绝对值超过 20% 的产品数量" placement="top">
              <el-icon class="stat-help"><question-filled /></el-icon>
            </el-tooltip>
            <el-icon class="stat-warn-icon" :class="{ 'stat-warn-icon--alert': productCount != null && productCount > 0 }">
              <warning />
            </el-icon>
          </div>
          <div class="stat-number" :class="{ 'stat-number--alert': productCount != null && productCount > 0 }">
            <el-skeleton v-if="loading" animated>
              <template #template>
                <el-skeleton-item style="width: 60px; height: 40px" variant="text" />
              </template>
            </el-skeleton>
            <template v-else>{{ productCount ?? '—' }}</template>
          </div>
        </div>
      </div>
    </div>

    <!-- 柱状图 + Top10 -->
    <el-row class="chart-row" :gutter="16">
      <!-- 偏差率分布 -->
      <el-col :span="15">
        <div class="panel">
          <div class="panel-head">
            <span class="panel-title">平均偏差率分布（产品数量）</span>
          </div>
          <div v-loading="loading" class="chart-body">
            <vab-chart v-if="hasBarData" :option="barChartOption" style="height: 100%; width: 100%" />
            <el-empty v-else description="暂无数据" :image-size="60" />
          </div>
        </div>
      </el-col>

      <!-- Top10 排行榜 -->
      <el-col :span="9">
        <div class="panel">
          <div class="panel-head">
            <span class="panel-title">Top 10 高偏差产品</span>
          </div>
          <div v-loading="loading" class="ranking-body">
            <div v-if="!top10List.length && !loading" class="ranking-empty">暂无数据</div>
            <div v-for="(row, index) in top10List" :key="row.asin + index" class="ranking-row">
              <span class="rank-badge" :class="`rank-badge--${index < 2 ? index + 1 : 'rest'}`">{{ index + 1 }}</span>
              <div class="rank-info">
                <el-link v-if="row.asinUrl" :href="row.asinUrl" target="_blank" type="primary">{{ row.asin }}</el-link>
                <span v-else class="rank-asin">{{ row.asin }}</span>
                <span class="rank-kind">{{ row.kindName }}</span>
              </div>
              <span class="rank-diff" :class="row.diff != null && Math.abs(row.diff) >= 20 ? 'rank-diff--danger' : 'rank-diff--safe'">
                {{ row.diff != null ? (row.diff > 0 ? '+' : '') + Number(row.diff).toFixed(2) + '%' : '—' }}
                <el-icon v-if="row.diff != null" :size="10">
                  <component :is="row.diff >= 0 ? 'ArrowUp' : 'ArrowDown'" />
                </el-icon>
              </span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 详情表格 -->
    <div class="panel detail-panel">
      <div class="panel-head">
        <span class="panel-title">季节系数详情</span>
      </div>
      <el-table v-loading="loading" :data="tableList" style="width: 100%" @sort-change="handleSortChange">
        <el-table-column label="ASIN" min-width="110">
          <template #default="{ row }">
            <el-link v-if="row.asinUrl" :href="row.asinUrl" target="_blank" type="primary">{{ row.asin }}</el-link>
            <span v-else>{{ row.asin }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" min-width="80">
          <template #default="{ row }">
            <el-image
              v-if="row.skuImgUrl"
              :src="row.skuImgUrl"
              style="width: 60px; height: 60px; cursor: pointer"
              @click="openImagePreview(toOriginalImage(row.skuImgUrl))"
            />
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column label="SKU" min-width="120" prop="sku" show-overflow-tooltip />
        <el-table-column label="季节系数曲线" min-width="200">
          <template #header>
            <div class="cell-header">
              <span class="cell-header-label">季节系数曲线</span>
              <span class="curve-legend">
                <i class="curve-legend-dot curve-legend-dot--ratio" />系统计算
                <i class="curve-legend-dot curve-legend-dot--actual" />实际设定
              </span>
            </div>
          </template>
          <template #default="{ row }">
            <div v-if="row.monthlyRatio || row.monthlyActual" class="sparkline-cell" @click="openCurveDialog(row)">
              <vab-chart :option="sparklineOption(row)" style="height: 40px; width: 100%" />
            </div>
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column label="品类" min-width="130" prop="kindName" show-overflow-tooltip />
        <!-- <el-table-column label="月份" min-width="100" prop="month">
          <template #default="{ row }">
            {{ formatMonth(row.month) }}
          </template>
        </el-table-column>
        <el-table-column label="预估系数" min-width="100" prop="estimate" />
        <el-table-column label="系统计算系数" min-width="100" prop="ratio" /> -->
        <el-table-column label="实际系数" min-width="100" prop="actual" />
        <el-table-column label="偏差率" min-width="100" sortable="custom">
          <template #header>
            <div class="cell-header">
              <el-tooltip effect="dark" placement="top">
                <span class="cell-header-label">
                  平均偏差率
                  <el-icon class="cell-header-icon"><question-filled /></el-icon>
                </span>
                <template #content>
                  <div class="custom-tooltip">| (系统计算的季节系数 - 系统设置的季节系数) | / 系统设置的季节系数</div>
                </template>
              </el-tooltip>
            </div>
          </template>
          <template #default="{ row }">
            <span :style="getDiffStyle(row.diff)">{{ formatPercent(row.diff) }}</span>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty class="vab-data-empty" />
        </template>
      </el-table>
      <div class="pagination">
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal teleported :url-list="imagePreviewList" @close="closeImagePreview" />

    <el-dialog v-model="curveDialogVisible" :title="curveDialogTitle" width="720px" @close="closeCurveDialog">
      <vab-chart :option="curveDialogOption" style="height: 380px; width: 100%" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { QuestionFilled, Search, Warning } from '@element-plus/icons-vue'
import { useSeasonalCoefficientDashboard } from '../composables/useSeasonalCoefficientDashboard'
import { toOriginalImage } from '/@/hooks/useImagePreview'
defineOptions({ name: 'SeasonalCoefficientDashboardFeature' })

const {
  barChartOption,
  closeCurveDialog,
  closeImagePreview,
  curveDialogOption,
  curveDialogTitle,
  curveDialogVisible,
  fetchData,
  fetchDataDebounce,
  formatPercent,
  getDiffBarStyle,
  getDiffStyle,
  handleCurrentChange,
  handlePlatformChange,
  handleSiteChange,
  handleSizeChange,
  handleSortChange,
  hasBarData,
  imagePreviewList,
  imagePreviewVisible,
  kindList,
  loading,
  openCurveDialog,
  openImagePreview,
  sparklineOption,
  operationUserList,
  platformList,
  productCount,
  queryForm,
  siteList,
  tableList,
  top10List,
  total,
} = useSeasonalCoefficientDashboard()
</script>

<style lang="scss" scoped>
.table-wrapper {
  background: #f5f7fa;
  padding: 16px;
}

// ── 统计卡片 ──────────────────────────────────────
.stat-section {
  margin-bottom: 16px;
}

.stat-card {
  position: relative;
  width: 420px;
  overflow: hidden;
  background: #fff;
  border-radius: 10px;
  border: none;

  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  cursor: default;
  transition:
    box-shadow 0.25s,
    transform 0.25s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  &--alert {
    border-color: #ffd6d5;
    background: linear-gradient(135deg, #fff 40%, #fff5f5 100%);

    &:hover {
      box-shadow: 0 4px 16px rgba(229, 57, 53, 0.1);
    }
  }

  &-content {
    padding: 14px 16px 16px;
  }

  &-header {
    display: flex;
    gap: 6px;
    align-items: center;
    margin-bottom: 10px;

    .stat-name {
      font-size: 13px;
      color: #595959;
    }

    .stat-threshold {
      padding: 1px 6px;
      font-size: 11px;
      font-weight: 600;
      color: #e53935;
      background: #fff1f0;
      border: 1px solid #ffd6d5;
      border-radius: 8px;
    }

    .stat-help {
      font-size: 13px;
      color: #bfbfbf;
      cursor: help;
    }

    .stat-warn-icon {
      margin-left: auto;
      font-size: 18px;
      color: #d9d9d9;
      transition: color 0.3s;

      &--alert {
        color: #e53935;
        animation: warn-pulse 2s ease-in-out infinite;
      }
    }
  }

  .stat-number {
    font-size: 44px;
    letter-spacing: 1px;
    font-weight: 700;
    line-height: 1;
    color: #bfbfbf;
    font-variant-numeric: tabular-nums;
    transition: color 0.3s;

    &--alert {
      color: #e53935;
    }
  }
}

@keyframes warn-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

// ── 等高行 ────────────────────────────────────────
.chart-row {
  margin-bottom: 20px;
  :deep(.el-col) {
    display: flex;
    flex-direction: column;
  }
}

.panel + .panel {
  margin-top: 16px;
}
// ── 通用面板 ──────────────────────────────────────
.panel {
  display: flex;

  flex-direction: column;
  flex: 1;
  overflow: visible;
  background: #fff;
  border-radius: 10px;

  border: none;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);

  &:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }
  &-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f0f0f0;

    padding: 16px;
  }

  &-title {
    font-weight: 600;
    color: #262626;
  }
}

// ── 柱状图 ────────────────────────────────────────
.chart-body {
  flex: 1;
  min-height: 200px;
  padding: 12px 16px;
}

// ── Top10 排行榜 ──────────────────────────────────
.ranking {
  &-body {
    flex: 1;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #e8e8e8;
      border-radius: 2px;
    }
  }

  &-empty {
    padding: 40px 0;
    color: #999;
    text-align: center;
  }

  &-row {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 7px 16px;
    border-bottom: 1px solid #f5f5f5;
    transition: background 0.15s;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #fafafa;
    }
  }
}

.rank {
  &-badge {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    font-weight: 700;
    border-radius: 6px;
    font-variant-numeric: tabular-nums;

    &--1 {
      background: #fffbe6;
      color: #d48806;
    }
    &--2 {
      background: #f5f5f5;
      color: #595959;
    }
    &--rest {
      color: #bfbfbf;
    }
  }

  &-info {
    display: flex;
    flex: 1;
    gap: 6px;
    align-items: baseline;
    min-width: 0;
    overflow: hidden;
  }

  &-kind {
    color: #8c8c8c;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-diff {
    display: flex;
    flex-shrink: 0;
    gap: 2px;
    align-items: center;
    font-weight: 600;
    font-variant-numeric: tabular-nums;

    &--danger {
      color: #e53935;
    }
    &--safe {
      color: #52c41a;
    }
  }
}
.ranking-row:hover {
  background: #f6faff;
}
// ── 详情表格 ──────────────────────────────────────
.detail-panel {
  :deep(.el-table__header-wrapper th) {
    background-color: #fafafa;

    font-weight: 500;
  }
  :deep(.el-table__body tr:hover > td) {
    background: #fafcff !important;
  }
}

.diff-viz-track {
  width: 100%;
  height: 6px;
  background: #f5f5f5;
  border-radius: 3px;

  .diff-viz-fill {
    height: 100%;
    background: #e53935;
    border-radius: 3px;
    transition: width 0.4s ease;
  }
}

.cell-header {
  display: inline-flex;
  align-items: center;

  .cell-header-label {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    cursor: pointer;
  }

  .cell-header-icon {
    font-size: 17px;
    margin-top: -1px;
    color: #bfbfbf;
  }
}

.curve-legend {
  margin-left: 8px;
  font-weight: 400;
  font-size: 11px;
  color: #8c8c8c;

  .curve-legend-dot {
    display: inline-block;
    width: 10px;
    height: 2px;
    margin: 0 4px 0 8px;
    vertical-align: middle;

    &--ratio {
      background: #1677ff;
    }

    &--actual {
      background: #fa8c16;
    }
  }
}

.sparkline-cell {
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.75;
  }
}

.pagination {
  margin-bottom: 20px;
}
</style>
