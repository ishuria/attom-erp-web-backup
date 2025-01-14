<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="SKU" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel :span="20">
            <el-form inline :model="queryForm">
              <el-form-item label="站点">
                <el-select
                  v-model="queryForm.site"
                  multiple
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  placeholder="请选择站点"
                  :max-collapse-tags="1"
                  style="width: 220px"
                  @change="queryData"
                >
                  <template #header>
                    <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">
                      所有
                    </el-checkbox>
                  </template>
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="币种">
                <el-select placeholder="请选择币种">
                  <el-option v-for="item in currencyList" :label="item.label" :value="item.id" :key="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="运营">
                <el-select v-model="queryForm.operationUserId" @change="queryData" style="width: 5em;" placeholder="请选择运营人员">
                  <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="开发人">
                <el-select v-model="queryForm.developUserId" @change="queryData" style="width: 5em;" placeholder="请选择开发人">
                  <el-option v-for="item in developUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="filterVisible = true">筛选</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="showOpeClassify">运营分类设定</el-button>
              </el-form-item>
              <el-form-item >
                <el-button type="primary" @click="keyWordTrendVisible = true">关键词排名趋势</el-button>
              </el-form-item>
              <el-form-item >
                <el-text style="margin-left: 10px; font-weight: 600;">数据更新时间：2024年12月22日14:02</el-text>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="4">
            <el-popover :width="240" popper-style="max-height: 550px; overflow: auto;">
              <template #reference>
                <el-button>
                  <vab-icon icon="settings-line" />
                </el-button>
              </template>
              <vab-draggable v-model="columns" :animation="600" handle=".handle" filter=".non-draggable" :onMove="handleMove1" :onEnd="handleEnd1">
                <div
                  v-for="item in columns"
                  :key="item.label"
                  style="font-size: var(--el-font-size-base); display: flex; align-items: center;"
                  :class="{'non-draggable': item.disableCheck}" 
                >
                  <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px"/>
                  <span style="flex: 1">{{ item.label }}</span>
                  <span v-if="item.disableCheck" style="display: flex; align-items: center;" class="icon-hover">
                    <el-icon><View /></el-icon>
                  </span>
                  <span v-else @click="handleChecked(item)" class="icon-hover" style="cursor: pointer; display: flex; align-items: center;">
                    <el-icon v-show="!item.checked"><Hide /></el-icon>
                    <el-icon v-show="item.checked"><View /></el-icon>
                  </span>
                </div>
              </vab-draggable>
            </el-popover>
            <el-form inline :model="queryForm">
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter="queryData" @input="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" type="primary" :loading="listLoading" @click="queryData" ></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border stripe
          class="noneHoverTable"
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="cellStyle"
          :cell-class-name="clearPadding" 
          :data="list"
          @cell-click="cellClick"
        >
          <el-table-column
            v-for="(item, index) in checkList1"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :minWidth="handleWidth(item)"
            :fixed="item.isFixed"
          >
            <template #header>
              <span v-if="item.label === '销量趋势(点击看明细)'">
                销量趋势<br />(点击看明细)
              </span>
              <span v-if="item.label === '2周广告转化'">
                2周广告<br />转化
              </span>
              <span v-if="item.label === '2周广告点击'">
                2周广告<br />点击
              </span>
              <span v-if="item.label === '库存可售'">
                库存<br />可售
              </span>
              <span v-if="item.label === '可售含在途'">
                可售<br />含在途
              </span>
            </template>
            <template #default="{ row }">
              <span v-if="item.label === '图片'">
                <el-image :src="row.skuImgUrl" style="width: 75px; height: 75px; display: block;" fit="fill" @click="imagePreviewShow(row.skuImgUrl)" >
                  <template #error><el-icon></el-icon></template>
                </el-image>
              </span>
              <!-- SKU 展示-->
              <span v-if="item.label === 'SKU'">
                {{ row.sku }}
                <div class="rate-wrapper">
                  <span class="rate-value">{{ row.rating }}</span>
                  <span><el-rate v-model="row.displayRating" :void-icon="Star" disabled class="custom-rate" /></span>
                  <span class="rate-count">{{ row.commentsNumbers }}</span>
                </div>
              </span>
              <span v-if="item.label === 'ASIN'">
                <el-link type="primary">{{ row.asin }}</el-link>
              </span>
              <span v-if="item.label === '父体ASIN'">
                <el-link type="primary">{{ row.parentAsin }}</el-link>
              </span>
              <span v-if="item.label === '销量趋势(点击看明细)'">
                <div class="custom-bar">
                  <vab-echarts-chart-bar :x-axis-data="row.saleTrendList.xAxis" :y-axis-data="row.saleTrendList.yAxis" />
                </div>
              </span>
              <span v-if="item.label === '运营分类'">
                <el-select style="min-width: 100%;" v-model="row.operationTypeId" @change="handleUpdateOpeType(row)">
                  <el-option v-for="item in row.operationTypeList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </span>
              <span v-if="item.label === '停产'">
                <el-checkbox v-model="row.stopProductStatus" :true-value="1" :false-value="0" @change="handleUpdateSKUStopStatus(row)"></el-checkbox>
              </span>
              <span v-if="label1.includes(item.label)">
                {{ currencySymbols.get('USD') }}{{ getRowValue(row, item.label, label1Map).toFixed(2) }}
              </span>
              <span v-if="label2.includes(item.label)"> <!-- 处理 百分比（小数点后两位）-->
                {{ formatPercentage(getRowValue(row, item.label, label2Map)) }}
              </span>
              <span v-if="label3.includes(item.label)"> <!-- 处理 天 -->
                {{ row[label3Map.get(item.label)!] != null ? row[label3Map.get(item.label)!] + '天' : '' }}
              </span>
              <span v-if="item.label === 'VOC满意度'">
                <el-tag v-if="row.vocSatisfaction === 0" class="customTag customTag-veryPoor">
                  Very poor
                </el-tag>
                <el-tag v-if="row.vocSatisfaction === 1" class="customTag customTag-fair">
                  Fair
                </el-tag>
                <el-tag v-if="row.vocSatisfaction === 2" class="customTag customTag-poor">
                  Poor
                </el-tag>
                <el-tag v-if="row.vocSatisfaction === 3" class="customTag customTag-good">
                  Good
                </el-tag>
                <el-tag v-if="row.vocSatisfaction === 4" class="customTag customTag-excellent">
                  Excellent
                </el-tag>
              </span>
              <span v-if="item.label === '半年有货率'">
                {{ Math.floor(Number(row.availableRate)) }}%
              </span>
              <span v-if="item.label === '今广%'">
                {{ Math.floor(Number(row.currentAdvertisement)) }}%
              </span>
              <span v-if="item.label === '广告'">
                <el-tag v-if="row.advertisementStatus === 0" type="danger">关</el-tag>
                <el-tag v-if="row.advertisementStatus === 1" type="success">开</el-tag>
              </span>
              <span v-if="item.label === '运营备注'">
                <el-tooltip content=" " effect="dark" placement="top">
                  <template #content>
                    <div class="custom-tooltip">{{ removeHtmlTags(row.operationRemark) }}</div>
                  </template>
                  <span>{{ removeHtmlTags(row.operationRemark) }}</span>
                </el-tooltip>
              </span>
              <span v-if="item.label === '饼图'">
                <div style="width: 100%; height: 60px">
                  <VabEchartsChartPie :data="data1" />
                </div>
              </span>
              <span v-if="item.label === '季节系数'">
                <div style="width: 100%; height: 50px">
                  <VabTableChartLine :xAxisData="seasonalXData" :yAxisData="seasonalYData" />
                </div>
              </span>
              <span v-if="item.label === '当前售价'">
                <el-link type="primary" @click="handleRouterPush">${{ row.sellingPrice }}</el-link>
              </span>
              <span v-if="item.label === '小类排名'">
                {{ row.nowSubcategoryRanking }}
                <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking >= 0" icon="arrow-up-fill" class="arrow-up" />
                <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking < 0" icon="arrow-down-fill" class="arrow-down" />
                <span style="color: #999">{{ row.nowSubcategoryRanking - row.beforeSubcategoryRanking }}</span>
              </span>
              <span v-if="item.label === '大类排名'">
                {{ row.nowMajorCategoryRanking }}
                <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking < 0" icon="arrow-down-fill" class="arrow-down" />
                <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking >= 0" icon="arrow-up-fill" class="arrow-up" />
                <span style="color: #999">{{ row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking }}</span>
              </span>
              <span v-if="item.label === '剩余库存'">
                {{ row.availableInventory }}/{{ row.fbaCount }}
              </span>
              <span v-if="item.label === '库龄'">
                <span v-html="row.storageAge"></span>
              </span>
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
      <el-tab-pane label="ASIN" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel :span="20">
            <el-form inline :model="queryForm">
              <el-form-item label="站点">
                <el-select
                  v-model="asinQueryForm.site"
                  multiple
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  placeholder="请选择站点"
                  :max-collapse-tags="1"
                  style="width: 220px"
                  @change="queryData"
                >
                  <template #header>
                    <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">
                      所有
                    </el-checkbox>
                  </template>
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="币种">
                <el-select placeholder="请选择币种">
                  <el-option v-for="item in currencyList" :label="item.label" :value="item.id" :key="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="运营">
                <el-select v-model="asinQueryForm.operationUserId" @change="queryData" style="width: 5em;" placeholder="请选择运营人员">
                  <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="开发人">
                <el-select v-model="asinQueryForm.developUserId" @change="queryData" style="width: 5em;" placeholder="请选择开发人">
                  <el-option v-for="item in developUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="filterVisible = true">筛选</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="showOpeClassify">运营分类设定</el-button>
              </el-form-item>
              <el-form-item >
                <el-button type="primary" @click="keyWordTrendVisible = true">关键词排名趋势</el-button>
              </el-form-item>
              <el-form-item >
                <el-text style="margin-left: 10px; font-weight: 600;">数据更新时间：2024年12月22日14:02</el-text>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="4">
            <el-popover :width="240" popper-style="max-height: 550px; overflow: auto;">
              <template #reference>
                <el-button>
                  <vab-icon icon="settings-line" />
                </el-button>
              </template>
              <vab-draggable v-model="columnsAsin" :animation="600" handle=".handle" filter=".non-draggable" :onMove="handleMove2">
                <div
                  v-for="item in columnsAsin"
                  :key="item.label"
                  style="font-size: var(--el-font-size-base); display: flex; align-items: center;"
                  :class="{'non-draggable': item.disableCheck}" 
                >
                  <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px"/>
                  <span style="flex: 1">{{ item.label }}</span>
                  <span v-if="item.disableCheck" style="display: flex; align-items: center;" class="icon-hover">
                    <el-icon><View /></el-icon>
                  </span>
                  <span v-else @click="handleChecked(item)" class="icon-hover" style="cursor: pointer; display: flex; align-items: center;">
                    <el-icon v-show="!item.checked"><Hide /></el-icon>
                    <el-icon v-show="item.checked"><View /></el-icon>
                  </span>
                </div>
              </vab-draggable>
            </el-popover>
            <el-form inline :model="queryForm">
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter="queryData" @input="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" type="primary" :loading="listLoading" @click="queryData" ></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border
          class="noneHoverTable"
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="cellStyle"
          :cell-class-name="clearPadding" 
          :data="fakeData"
          @cell-click="cellClick"
        >
          <el-table-column
            v-for="(item, index) in checkList2"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :minWidth="handleWidth(item)"
            :fixed="item.isFixed"
          >
            <template #header>
              <span v-if="item.label === '销量趋势(点击看明细)'">
                销量趋势<br />(点击看明细)
              </span>
              <span v-if="item.label === '2周广告转化'">
                2周广告<br />转化
              </span>
              <span v-if="item.label === '2周广告点击'">
                2周广告<br />点击
              </span>
              <span v-if="item.label === '库存可售'">
                库存<br />可售
              </span>
              <span v-if="item.label === '可售含在途'">
                可售<br />含在途
              </span>
            </template>
            <template #default="{ row }">
              <span v-if="item.label === '图片'">
                <el-image :src="row.componentImage" style="width: 75px; height: 75px; display: block;" fit="fill" @click="imagePreviewShow(row.componentImage)" >
                  <template #error>
                    <el-icon></el-icon>
                  </template>
                </el-image>
              </span>
              <span v-if="item.label === 'ASIN'">
                <el-link type="primary">{{ row.asin }}</el-link>
                <div class="rate-wrapper">
                  <span class="rate-value">{{ row.rate }}</span>
                  <span><el-rate v-model="row.rate" :void-icon="Star" disabled class="custom-rate" /></span>
                  <span class="rate-count">{{ 484 }}</span>
                </div>
              </span>
              <span v-if="item.label === 'SKU'">
                <el-tooltip content=" " effect="dark" placement="top">
                  <template #content>
                    <div class="custom-tooltip">{{ removeHtmlTags(row.sku) }}</div>
                  </template>
                  <span>{{ removeHtmlTags(row.sku) }}</span>
                </el-tooltip>
              </span>
              <span v-if="item.label === '父体ASIN'">
                <el-link type="primary">{{ row.parentAsin }}</el-link>
              </span>
             
              <span v-if="item.label === '销量趋势(点击看明细)'">
                <div class="custom-bar">
                  <vab-echarts-chart-bar :x-axis-data="row.saleTrendList.xAxis" :y-axis-data="row.saleTrendList.yAxis" />
                </div>
              </span>
              <span v-if="item.label === '运营分类'">
                <el-select style="min-width: 100%;" v-model="row.operationTypeId" @change="handleUpdateOpeType(row)">
                  <el-option v-for="item in row.operationTypeList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </span>
              <span v-if="item.label === '停产'">
                <el-checkbox v-model="row.stopProductStatus" :true-value="1" :false-value="0" ></el-checkbox>
              </span>
              <span v-if="label1.includes(item.label)">
                {{ currencySymbols.get('USD') }}{{ getRowValue(row, item.label, label1Map).toFixed(2) }}
              </span>
              <span v-if="label2.includes(item.label)">
                {{ formatPercentage(getRowValue(row, item.label, label2Map)) }}
              </span>
              <span v-if="label3.includes(item.label)">
                {{ row[label3Map.get(item.label)!] }}天
              </span>
              <span v-if="item.label === '半年有货率'">
                {{ Math.floor(Number(row.availableRate)) }}%
              </span>
              <span v-if="item.label === '今广%'">
                {{ Math.floor(Number(row.currentAdvertisement)) }}%
              </span>
              <span v-if="item.label === '广告'">
                <el-tag v-if="row.advertisementStatus === 0" type="danger">关</el-tag>
                <el-tag v-if="row.advertisementStatus === 1" type="success">开</el-tag>
              </span>
              <span v-if="item.label === '运营备注'">
                <el-tooltip content=" " effect="dark" placement="top">
                  <template #content>
                    <div class="custom-tooltip">{{ removeHtmlTags(row.operationRemark) }}</div>
                  </template>
                  <span>{{ removeHtmlTags(row.operationRemark) }}</span>
                </el-tooltip>
              </span>
              <span v-if="item.label === '饼图'">
                <div style="width: 100%; height: 60px">
                  <VabEchartsChartPie :data="data1" />
                </div>
              </span>
              <span v-if="item.label === '季节系数'">
                <div style="width: 100%; height: 50px">
                  <VabTableChartLine :xAxisData="seasonalXData" :yAxisData="seasonalYData" />
                </div>
              </span>
              <span v-if="item.label === '小类排名'">
                {{ row.nowSubcategoryRanking }}
                <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking >= 0" icon="arrow-up-fill" class="arrow-up" />
                <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking < 0" icon="arrow-down-fill" class="arrow-down" />
                <span style="color: #999">{{ row.nowSubcategoryRanking - row.beforeSubcategoryRanking }}</span>
              </span>
              <span v-if="item.label === '大类排名'">
                {{ row.nowMajorCategoryRanking }}
                <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking < 0" icon="arrow-down-fill" class="arrow-down" />
                <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking >= 0" icon="arrow-up-fill" class="arrow-up" />
                <span style="color: #999">{{ row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking }}</span>
              </span>
              <span v-if="item.label === '剩余库存'">
                {{ row.availableInventory }}/{{ row.fbaCount }}
              </span>
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
      <el-tab-pane label="父体ASIN" :name="2">
        <vab-query-form>
          <vab-query-form-left-panel :span="20">
            <el-form inline :model="queryForm">
              <el-form-item label="站点">
                <el-select />
              </el-form-item>
              <el-form-item label="币种">
                <el-select />
              </el-form-item>
              <el-form-item label="运营">
                <el-select v-model="queryForm.operations" style="width: 5em;" >
                  <el-option 
                    v-for="item in operationsOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="开发人">
                <el-select v-model="queryForm.developer" style="width: 5em;" >
                  <el-option 
                    v-for="item in developerOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="showOpeClassify">运营分类设定</el-button>
              </el-form-item>
              <el-form-item >
                <el-button type="primary" @click="keyWordTrendVisible = true">关键词排名趋势</el-button>
              </el-form-item>
              <el-form-item >
                <el-text style="margin-left: 10px; font-weight: 600;">数据更新时间：2024年12月22日14:02</el-text>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="4">
            <el-popover :width="240" popper-style="max-height: 550px; overflow: auto;">
              <template #reference>
                <el-button>
                  <vab-icon icon="settings-line" />
                </el-button>
              </template>
              <vab-draggable v-model="columnsParentAsin" :animation="600" handle=".handle" filter=".non-draggable" :onMove="handleMove3">
                <div
                  v-for="item in columnsParentAsin"
                  :key="item.label"
                  style="font-size: var(--el-font-size-base); display: flex; align-items: center;"
                  :class="{'non-draggable': item.disableCheck}" 
                >
                  <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px"/>
                  <span style="flex: 1">{{ item.label }}</span>
                  <span v-if="item.disableCheck" style="display: flex; align-items: center;" class="icon-hover">
                    <el-icon><View /></el-icon>
                  </span>
                  <span v-else @click="handleChecked(item)" class="icon-hover" style="cursor: pointer; display: flex; align-items: center;">
                    <el-icon v-show="!item.checked"><Hide /></el-icon>
                    <el-icon v-show="item.checked"><View /></el-icon>
                  </span>
                </div>
              </vab-draggable>
            </el-popover>
            <el-form inline :model="queryForm">
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter="queryData" @input="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" type="primary" :loading="listLoading" @click="queryData" ></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border
          class="noneHoverTable"
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="cellStyle"
          :cell-class-name="clearPadding" 
          :data="fakeData"
          @cell-click="cellClick"
        >
          <el-table-column
            v-for="(item, index) in checkList3"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :minWidth="handleWidth(item)"
            :fixed="item.isFixed"
          >
            <template #header>
              <span v-if="item.label === '销量趋势(点击看明细)'">
                销量趋势<br />(点击看明细)
              </span>
              <span v-if="item.label === '2周广告转化'">
                2周广告<br />转化
              </span>
              <span v-if="item.label === '2周广告点击'">
                2周广告<br />点击
              </span>
              <span v-if="item.label === '库存可售'">
                库存<br />可售
              </span>
              <span v-if="item.label === '可售含在途'">
                可售<br />含在途
              </span>
            </template>
            <template #default="{ row }">
              <span v-if="item.label === '图片'">
                <el-image :src="row.componentImage" style="width: 75px; height: 75px; display: block;" fit="fill" @click="imagePreviewShow(row.componentImage)" >
                  <template #error>
                    <el-icon></el-icon>
                  </template>
                </el-image>
              </span>
        
              <!-- 父体ASIN 展示 -->
              <span v-if="item.label === '父体ASIN'">
                <el-link type="primary">{{ row.pAsin }}</el-link>
                <div class="rate-wrapper">
                  <span class="rate-value">{{ row.rate }}</span>
                  <span><el-rate v-model="row.rate" :void-icon="Star" disabled class="custom-rate"  /></span>
                  <span class="rate-count">{{ 484 }}</span>
                </div>
              </span>
              <span v-if="item.label === 'SKU'">
                <el-tooltip content=" " effect="dark" placement="top">
                  <template #content>
                    <div class="custom-tooltip">{{ removeHtmlTags(row.sku) }}</div>
                  </template>
                  <span>{{ removeHtmlTags(row.sku) }}</span>
                </el-tooltip>
              </span>
              <span v-if="item.label === '销量趋势(点击看明细)'">
                <div class="custom-bar">
                  <vab-echarts-chart-bar :x-axis-data="row.saleTrendList.xAxis" :y-axis-data="row.saleTrendList.yAxis" />
                </div>
              </span>
              <span v-if="item.label === '运营分类'">
                <el-select style="min-width: 100%;">
                  <el-option 
                    v-for="item in opeClassOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </span>
              <span v-if="item.label === '停产'">
                <el-checkbox :true-value="1" :false-value="0" ></el-checkbox>
              </span>
              <span v-if="label1.includes(item.label)">
                {{ currencySymbols.get('USD') }}{{ getRowValue(row, item.label, label1Map).toFixed(2) }}
              </span>
              <span v-if="label2.includes(item.label)">
                {{ formatPercentage(getRowValue(row, item.label, label2Map)) }}
              </span>
              <span v-if="item.label === '今广%'">
                {{ Math.floor(Number(row.currentAdvertisement)) }}%
              </span>
              <span v-if="item.label === '广告'">
                <el-tag v-if="row.ad === 0" type="danger">关</el-tag>
                <el-tag v-if="row.ad === 1" type="success">开</el-tag>
              </span>
              <span v-if="item.label === '饼图'">
                <div style="width: 100%; height: 60px">
                  <VabEchartsChartPie :data="data1" />
                </div>
              </span>
              <span v-if="item.label === '小类排名'">
                {{ 836 }}
                <vab-icon icon="arrow-up-fill" class="arrow-up" />
                <span style="color: #999">{{ 91 }}</span>
              </span>
              <span v-if="item.label === '大类排名'">
                {{ 836 }}
                <vab-icon icon="arrow-down-fill" class="arrow-down" />
                <span style="color: #999">{{ 91 }}</span>
              </span>
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
    </el-tabs>
    
    <el-image-viewer v-if="imagePreviewVisible" :url-list="imagePreviewList" @close="imagePreviewClose" hideOnClickModal/>
    <!-- 运营分类 -->
    <VabOperationalClassify 
      :opeClassifyVisible="opeClassifyVisible"
      @updateVisible="closeOpeClassify"
    />
    <!-- 筛选 -->
    <VabFilterDialog 
      :filter-visible="filterVisible"
      @update-visible="handleCloseFilterDialog"
      @update-filter="handleConfirmFilter"
    />
    <!-- 关键词排名趋势 -->
    <VabKeyWordRankTrend 
      :key-word-trend-visible="keyWordTrendVisible"
      @update-visible="handleCloseKeyWordTrend"
    />
    <!-- 运营备注 -->
    <vab-dialog
      title="运营备注"
      v-model="remarkVisible"
      width="20%"
    >
      <el-input type="textarea" :rows="15" placeholder="请输入运营备注" />
      <template #footer>
        <el-button @click="remarkVisible = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 季节系数 -->
    <vab-dialog
      title="季节系数"
      v-model="seasonalVisible"
      @open="handleSeasonalOpened"
      width="40%"
    >
      <div ref="chartContainer1" style="width: 100%; height: 400px;"></div>
      <template #footer></template>
    </vab-dialog>
    <!-- 小类排名 -->
    <vab-dialog
      title="小类排名"
      v-model="sRankVisible"
      width="40%"
      @open="handleSRankOpened"
    >
      <div ref="chartContainer2" style="width: 100%; height: 400px;"></div>
      <template #footer></template>
    </vab-dialog>
    <!-- 大类排名 -->
    <vab-dialog
      title="大类排名"
      v-model="bRankVisible"
      width="40%"
      @open="handleBRankOpened"
    >
      <div ref="chartContainer3" style="width: 100%; height: 400px;"></div>
      <template #footer></template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'productPerformance',
})
import { Hide, Search, Star, View } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { CheckboxValueType, TabsPaneContext } from 'element-plus'
import { CSSProperties } from 'vue'
import { DraggableEvent, VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { currencySymbols, months, opeClassOption } from '../constantOption'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'
import { filterAmazonSKUList, getCurrencyList, getDevelopUserList, getOperationAmazonSKUList, getOperationTypeList, updateOperationSKUDisContinuedStatus, updateOperationSKUOperateTypeList } from '/@/api/devlocal/productPerformance'
import { getDistributionOptionUserList, getDistributionSiteList } from '/@/api/devlocal/productDistribution'
import { IGetOperationAmazonSKUList, IGetOperationTypeListReq } from '/@/type/storeOperation/productPerformanceType'

const seasonalVisible = ref<boolean>(false)
const sRankVisible = ref<boolean>(false)
const bRankVisible = ref<boolean>(false)
const chartContainer1 = ref<HTMLElement | null>(null)
const chartContainer2 = ref<HTMLElement | null>(null)
const chartContainer3 = ref<HTMLElement | null>(null)
let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null
let chartInstance3: echarts.ECharts | null = null
let chartObserver1: ResizeObserver
let chartObserver2: ResizeObserver
let chartObserver3: ResizeObserver
const option1 = ref<any>({})
const option2 = ref<any>({})
const option3 = ref<any>({})
const seasonalXData = months.map((item) => item.label)
const seasonalYData = [1.2, 1.3, 1.2, 1.2, 1.4, 1.3, 1.2, 1.2, 1.4, 1.3, 1.3, 1.3]
const data1 = ref<any[]>([
  { value: 211.02, name: '高ACOS' },
  { value: 453.57, name: '低ACOS' },
  { value: 21.5, name: '高点击不出单' },
  { value: 83.31, name: '低点击不出单' },
])
const activeName = ref<number>(0)
const router = useRouter()
// 运营备注
const remarkVisible = ref<boolean>(false)
interface optionType {
  id: number
  label: string
}
const currencyList = ref<optionType[]>([])
const developUserList = ref<optionType[]>([])
const siteList = ref<optionType[]>([])
const operateUserList = ref<optionType[]>([])
const checkAll = ref<boolean>(false)
const indeterminate = ref<boolean>(false)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  site: [0, 1],
  operationUserId: 1,
  developUserId: 1
})
const asinQueryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  site: [0, 1],
  operationUserId: 1,
  developUserId: 1
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const list = ref<IGetOperationAmazonSKUList[]>([])
const { site } = toRefs(queryForm)
const handleConfirmFilter = async (filterForm: any) => {
  const { site, ...filterQueryForm } = queryForm
  const siteIds = site.join(',')
  const { data } = await filterAmazonSKUList({
    ...filterQueryForm,
    ...filterForm,
    siteIds
  })
  if (data) {
    $baseConfirm('SKU运营筛选成功！', 'success')
    filterVisible.value = false
    total.value = data.total
    list.value = data.list
  }
}
const handleUpdateOpeType = async (row: IGetOperationAmazonSKUList) => {
  const { data } = await updateOperationSKUOperateTypeList({
    id: row.id!,
    typeId: row.operationTypeId!
  })
}
const handleUpdateSKUStopStatus = async (row: IGetOperationAmazonSKUList) => {
  const { data } = await updateOperationSKUDisContinuedStatus({
    id: row.id!,
    status: row.stopProductStatus!
  })
}
watch(site, (val) => {
  if (val.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (val.length === siteList.value.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})
const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    queryForm.site = siteList.value.map((_) => _.id)
    // 全选的时候获取数据
    queryData()
  } else {
    queryForm.site = []
    // 取消全选获取数据
    queryData()
  }
}
const showRemark = () => {
  remarkVisible.value = true
}
interface IData {
  componentImage: string;
  sku: string;
  rate: number;
  asin: string;
  pAsin: string;
  saleTrendList: {};
  todaySell: number;
  todayOrder: number;
  todaySellD: number;
  todayAd: number;
  ad: number;
  pieChart: string;
  seasonalCoefficient: number;
  classify: string;
  sRank: number;
  bRank: number;
  topProduct: number;
  remark: string;
  fbaStorageFee: number;
  currentPrice: number;
  trialGrossProfit: number;
  fba: number;
  fbaA: number;
  fbaD: number;
  conversion: number;
  click: number;
  totalConvert: number;
  monthlySell: number;
  monthlyNetProfit: number;
  monthlySales: number;
  monthlyNetInterestRate: number;
  monthlyAdSales: number;
  monthlyAdSpend: number;
  monthlyAd: number;
  monthlyACOS: number;
  monthlyTACOS: number;
  yearACOS: number;
  yearTACOS: number;
  removeValue: number;
  remove: number;
  replaceValue: number;
  replace: number;
  monthlyReturns: number;
  monthlyRefund: number;
  VOCSatisfaction: number;
  VOCDefectP: number;
  VOCDefect: number;
  VOCOrder: number;
  newReleases: number;
  storageAge: string;
  remainingStock: string;
  receiving: number;
  recentlyStorage: string;
  totalStorage: number;
  stockSale: number;
  saleTransit: number;
  outOfStock: number;
  order: number;
  sign: string;
  monthlyAvailabilityRate: number;
  lowFeeDays: number;
  estimatedFees: number;
  profitLossPrice: number;
  profitPrice: number;
  suggestions: string;
  status: string;
  productDes: string;
  person: string;
  id: number;
}
const fakeData = ref<IData[]>([
  {
    componentImage: 'https://picsum.photos/200/200',
    sku: 'SKU12345',
    rate: 4.7,
    asin: 'B08N5M7S6K',
    pAsin: 'B08N5M7S6K',
    saleTrendList: {
      xAxis: [
        "21-04-1",
				"21-08-1",
				"22-05-1",
				"22-06-1",
				"22-07-1",
				"22-09-1",
				"22-10-1",
				"23-01-1",
				"23-05-1",
				"23-07-1",
				"23-10-1",
				"23-11-1"
      ],
      yAxis: [
        6611,
				53824,
				18712,
				18991,
				21611,
				10277,
				15420,
				9159,
				4192,
				3064,
				5619,
				4500
      ]
    },
    todaySell: 100,
    todayOrder: 50,
    todaySellD: 1500,
    todayAd: 10,
    ad: 1,
    pieChart: '',
    seasonalCoefficient: 1.5,
    classify: '电子产品',
    sRank: 5,
    bRank: 2,
    topProduct: 200,
    remark: '备注信息1',
    fbaStorageFee: 100,
    currentPrice: 29.99,
    trialGrossProfit: 0.5,
    fba: 3.99,
    fbaA: 2.99,
    fbaD: 5.66,
    conversion: 12,
    click: 300,
    totalConvert: 25,
    monthlySell: 1500,
    monthlyNetProfit: 5000,
    monthlySales: 45000,
    monthlyNetInterestRate: 11.1,
    monthlyAdSales: 1500,
    monthlyAdSpend: 800,
    monthlyAd: 30,
    monthlyACOS: 15,
    monthlyTACOS: 10,
    yearACOS: 12,
    yearTACOS: 8,
    removeValue: 100,
    remove: 5,
    replaceValue: 200,
    replace: 10,
    monthlyReturns: 3,
    monthlyRefund: 2,
    VOCSatisfaction: 1,
    VOCDefectP: 1,
    VOCDefect: 10,
    VOCOrder: 200,
    newReleases: 20,
    storageAge: '81-270 0\n71-360 0',
    remainingStock: '100/831',
    receiving: 50,
    recentlyStorage: '6天/1400\n12天/200',
    totalStorage: 500,
    stockSale: 300,
    saleTransit: 100,
    outOfStock: 0,
    order: 150,
    sign: '已签收',
    monthlyAvailabilityRate: 95,
    lowFeeDays: 5,
    estimatedFees: 2000,
    profitLossPrice: 18,
    profitPrice: 22,
    suggestions: '增加广告投放',
    status: '正常',
    productDes: '这是一款电子产品',
    person: '张三',
    id: 1
  },
  {
    componentImage: 'https://picsum.photos/200/200',
    sku: 'SKU67890',
    rate: 4.0,
    asin: 'B08XYZ1234',
    pAsin: 'B08XYZ1234',
    saleTrendList: {
      xAxis: [
        "21-04-1",
				"21-08-1",
				"22-05-1",
				"22-06-1",
				"22-07-1",
				"22-09-1",
				"22-10-1",
				"23-01-1",
				"23-05-1",
				"23-07-1",
				"23-10-1",
				"23-11-1"
      ],
      yAxis: [
        6611,
				53824,
				18712,
				18991,
				21611,
				10277,
				15420,
				9159,
				4192,
				3064,
				5619,
				4500
      ]
    },
    todaySell: 200,
    todayOrder: 100,
    todaySellD: 2500,
    todayAd: 15,
    ad: 0,
    pieChart: '',
    seasonalCoefficient: 1.8,
    classify: '家居用品',
    sRank: 3,
    bRank: 1,
    topProduct: 400,
    remark: '备注信息2',
    fbaStorageFee: 150,
    currentPrice: 45.99,
    trialGrossProfit: 15.5,
    fba: 3,
    fbaA: 4,
    fbaD: 5,
    conversion: 10,
    click: 500,
    totalConvert: 20,
    monthlySell: 2000,
    monthlyNetProfit: 7000,
    monthlySales: 80000,
    monthlyNetInterestRate: 8.75,
    monthlyAdSales: 2500,
    monthlyAdSpend: 1200,
    monthlyAd: 24,
    monthlyACOS: 14,
    monthlyTACOS: 9,
    yearACOS: 13,
    yearTACOS: 7,
    removeValue: 200,
    remove: 3,
    replaceValue: 400,
    replace: 12,
    monthlyReturns: 2,
    monthlyRefund: 1,
    VOCSatisfaction: 2,
    VOCDefectP: 2,
    VOCDefect: 5,
    VOCOrder: 300,
    newReleases: 15,
    storageAge: '81-270 0\n71-360 0',
    remainingStock: '100/831',
    receiving: 70,
    recentlyStorage: '6天/1400\n12天/200',
    totalStorage: 600,
    stockSale: 350,
    saleTransit: 120,
    outOfStock: 0,
    order: 180,
    sign: '未签收',
    monthlyAvailabilityRate: 98,
    lowFeeDays: 4,
    estimatedFees: 2500,
    profitLossPrice: 22,
    profitPrice: 26,
    suggestions: '增加促销活动',
    status: '待处理',
    productDes: '这是一款家居用品',
    person: '李四',
    id: 2
  },
  {
    componentImage: 'https://picsum.photos/200/200',
    sku: 'SKU12345',
    rate: 4.3,
    asin: 'B08N5M7S6K',
    pAsin: 'B08N5M7S6K',
    saleTrendList: {
      xAxis: [
        "21-04-1",
				"21-08-1",
				"22-05-1",
				"22-06-1",
				"22-07-1",
				"22-09-1",
				"22-10-1",
				"23-01-1",
				"23-05-1",
				"23-07-1",
				"23-10-1",
				"23-11-1"
      ],
      yAxis: [
        6611,
				53824,
				18712,
				18991,
				21611,
				10277,
				15420,
				9159,
				4192,
				3064,
				5619,
				4500
      ]
    },
    todaySell: 100,
    todayOrder: 50,
    todaySellD: 1500,
    todayAd: 10,
    ad: 0,
    pieChart: '',
    seasonalCoefficient: 1.5,
    classify: '电子产品',
    sRank: 5,
    bRank: 2,
    topProduct: 200,
    remark: '备注信息1',
    fbaStorageFee: 100,
    currentPrice: 29.99,
    trialGrossProfit: 10.5,
    fba: 3,
    fbaA: 4,
    fbaD: 5,
    conversion: 12,
    click: 300,
    totalConvert: 25,
    monthlySell: 1500,
    monthlyNetProfit: 5000,
    monthlySales: 45000,
    monthlyNetInterestRate: 11.1,
    monthlyAdSales: 1500,
    monthlyAdSpend: 800,
    monthlyAd: 30,
    monthlyACOS: 15,
    monthlyTACOS: 10,
    yearACOS: 12,
    yearTACOS: 8,
    removeValue: 100,
    remove: 5,
    replaceValue: 200,
    replace: 10,
    monthlyReturns: 3,
    monthlyRefund: 2,
    VOCSatisfaction: 3,
    VOCDefectP: 1,
    VOCDefect: 10,
    VOCOrder: 200,
    newReleases: 20,
    storageAge: '81-270 0\n71-360 0',
    remainingStock: '100/831',
    receiving: 50,
    recentlyStorage: '6天/1400\n12天/200',
    totalStorage: 500,
    stockSale: 300,
    saleTransit: 100,
    outOfStock: 0,
    order: 150,
    sign: '已签收',
    monthlyAvailabilityRate: 95,
    lowFeeDays: 5,
    estimatedFees: 2000,
    profitLossPrice: 18,
    profitPrice: 22,
    suggestions: '增加广告投放',
    status: '正常',
    productDes: '这是一款电子产品',
    person: '张三',
    id: 3
  },
])

function getRowValue(row: any, label: string, labelMap: any): number {
  const key = labelMap.get(label)
  // 如果找不到 key，返回 0；如果 key 存在，但 row[key] 不是数字，也返回 0
  return typeof key !== 'undefined' && typeof row[key] === 'number' ? row[key] : 0
}
function formatPercentage(value: number): string {
  const percentage = (value * 100).toFixed(2)  // 将小数转换为百分比，并保留两位小数
  return `${percentage}%`
}

const label1 = ['今销', 'FBA仓储费', '亚马逊FBA', 'FBA差异', '月净利润', '月销售额', '月广告销售', '月广告支出', '预计下月仓储费', '盈亏售价', '30毛利售价']
const label2 = ['试算毛利', '2周广告转化', '2周广告点击', '2周总转化', '月净利率', '月广告%', '月ACOS', '月TACOS', '1年ACOS', '1年TACOS', '月退货%', '月退款%', 'VOC缺陷%']
const label3 = ['上新', '库存可售', '可售含在途', '断货']
const label1Map = new Map([
  ['今销', 'currentSalesPrice'],
  ['FBA仓储费', 'fbaStorageFee'],
  ['亚马逊FBA', 'amazonFba'],
  ['FBA差异', 'differenceFba'],
  ['月净利润', 'monthNetProfit'],
  ['月销售额', 'monthSalesPrice'],
  ['月广告销售', 'monthAdvSales'],
  ['月广告支出', 'monthAdvExpenditure'],
  ['预计下月仓储费', 'estimateNextMonthStorageFee'],
  ['盈亏售价', 'profitLossSellingPrice'],
  ['30毛利售价', 'grossSellingPrice'],
])
const label2Map = new Map([
  ['试算毛利', 'grossProfit'],
  ['2周广告转化', 'tWksAdvRate'],
  ['2周广告点击', 'tWksClickRate'],
  ['2周总转化', 'tWksTotalConv'],
  ['月净利率', 'monthNetProfitMargin'],
  ['月广告%', 'monthAdv'],
  ['月ACOS', 'monthAcos'],
  ['月TACOS', 'monthTacos'],
  ['1年ACOS', 'yearAcos'],
  ['1年TACOS', 'yearTacos'],
  ['月退货%', 'monthReturnGoods'],
  ['月退款%', 'monthRefund'],
  ['VOC缺陷%', 'vocDefect'],
])
const label3Map = new Map([
  ['上新', 'newArrivalDay'],
  ['库存可售', 'esAvailableSaleDay'],
  ['可售含在途', 'esAvailableSaleDayTotal'],
  ['断货', 'outOfStock'],
])

const checkList1 = computed(() => {
  return columns.value.filter((_: any) => _.checked)
})
const checkList2 = computed(() => {
  return columnsAsin.value.filter((_: any) => _.checked)
})
const checkList3 = computed(() => {
  return columnsParentAsin.value.filter((_: any) => _.checked)
})
const columns = ref<any>([
  {
    label: '图片',
    prop: 'skuImgUrl',
    disableCheck: true,
    checked: true,
    width: 75,
    isFixed: 'left'
  },
  {
    label: 'SKU',
    prop: 'sku',
    disableCheck: true,
    checked: true,
    minWidth: 100,
    isFixed: 'left'
  },
  {
    label: 'ASIN',
    prop: 'asin',
    disableCheck: true,
    checked: true,
    minWidth: 100,
    isFixed: 'left'
  },
  {
    label: '父体ASIN',
    prop: 'parentAsin',
    disableCheck: true,
    checked: true,
    minWidth: 110,
    isFixed: 'left'
  },
  {
    label: '站点',
    prop: 'siteName',
    checked: true,
    minWidth: 130,
  },
  {
    label: '销量趋势(点击看明细)',
    prop: 'trend',
    checked: true,
    minWidth: 180,
  },
  {
    label: '今销#',
    prop: 'currentSalesNumber',
    checked: true,
    minWidth: 90,
  },
  {
    label: '今单#',
    prop: 'currentSalesOrder',
    checked: true,
    minWidth: 90,
  },
  {
    label: '今销',
    prop: 'currentSalesPrice',
    checked: true,
    minWidth: 90,
  },
  {
    label: '今广%',
    prop: 'currentAdvertisement',
    checked: true,
    minWidth: 90,
  },
  {
    label: '广告',
    prop: 'advertisementStatus',
    checked: true,
    minWidth: 80,
  },
  {
    label: '饼图',
    prop: 'pieChart',
    checked: true,
    minWidth: 100,
  },
  {
    label: '季节系数',
    prop: 'seasonalCoefficient',
    checked: true,
    minWidth: 100,
  },
  {
    label: '运营分类',
    prop: 'operationTypeId',
    checked: true,
    minWidth: 130,
  },
  {
    label: '停产',
    prop: 'stopProductStatus',
    checked: true,
    minWidth: 60,
  },
  {
    label: '小类排名',
    prop: 'nowSubcategoryRanking',
    checked: true,
    minWidth: 100,
  },
  {
    label: '大类排名',
    prop: 'nowMajorCategoryRanking',
    checked: true,
    minWidth: 100,
  },
  {
    label: '头部产品#',
    prop: 'headerCount',
    checked: true,
    minWidth: 100,
  },
  {
    label: '运营备注',
    prop: 'operationRemark',
    checked: true,
    minWidth: 150,
  },
  {
    label: 'FBA仓储费',
    prop: 'fbaStorageFee',
    checked: true,
    minWidth: 150,
  },
  {
    label: '当前售价',
    prop: 'sellingPrice',
    checked: true,
    minWidth: 100,
  },
  {
    label: '试算毛利',
    prop: 'grossProfit',
    checked: true,
    minWidth: 100,
  },
  {
    label: '自量FBA',
    prop: 'selfAssessmentFba',
    checked: true,
    minWidth: 100,
  },
  {
    label: '亚马逊FBA',
    prop: 'amazonFba',
    checked: true,
    minWidth: 110,
  },
  {
    label: 'FBA差异',
    prop: 'differenceFba',
    checked: true,
    minWidth: 100,
  },
  {
    label: '2周广告转化',
    prop: 'tWksAdvRate',
    checked: true,
    minWidth: 120,
  },
  {
    label: '2周广告点击',
    prop: 'tWksClickRate',
    checked: true,
    minWidth: 120,
  },
  {
    label: '2周总转化',
    prop: 'tWksTotalConv',
    checked: true,
    minWidth: 110,
  },
  {
    label: '月销量',
    prop: 'monthSalesVolume',
    checked: true,
    minWidth: 90,
  },
  {
    label: '月净利润',
    prop: 'monthNetProfit',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月销售额',
    prop: 'monthSalesPrice',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月净利率',
    prop: 'monthNetProfitMargin',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月广告销售',
    prop: 'monthAdvSales',
    checked: true,
    minWidth: 110,
  },
  {
    label: '月广告支出',
    prop: 'monthAdvExpenditure',
    checked: true,
    minWidth: 110,
  },
  {
    label: '月广告%',
    prop: 'monthAdv',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月ACOS',
    prop: 'monthAcos',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月TACOS',
    prop: 'monthTacos',
    checked: true,
    minWidth: 100,
  },
  {
    label: '1年ACOS',
    prop: 'yearAcos',
    checked: true,
    minWidth: 100,
  },
  {
    label: '1年TACOS',
    prop: 'yearTacos',
    checked: true,
    minWidth: 110,
  },
  {
    label: '移除量',
    prop: 'removalAmount',
    checked: true,
    minWidth: 90,
  },
  {
    label: '替换量',
    prop: 'replacementAmount',
    checked: true,
    minWidth: 90,
  },
  {
    label: '月退货%',
    prop: 'monthReturnGoods',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月退款%',
    prop: 'monthRefund',
    checked: true,
    minWidth: 100,
  },
  {
    label: 'VOC满意度',
    prop: 'vocSatisfaction',
    checked: true,
    minWidth: 130,
  },
  {
    label: 'VOC缺陷%',
    prop: 'vocDefect',
    checked: true,
    minWidth: 110,
  },
  {
    label: 'VOC缺陷#',
    prop: 'vocNcxCount',
    checked: true,
    minWidth: 110,
  },
  {
    label: 'VOC总订单',
    prop: 'vocTotalOrderCount',
    checked: true,
    minWidth: 110,
  },
  {
    label: '上新',
    prop: 'newArrivalDay',
    checked: true,
    minWidth: 90,
  },
  {
    label: '库龄',
    prop: 'inventoryAge',
    checked: true,
    minWidth: 180,
  },
  {
    label: '剩余库存',
    prop: 'availableInventory',
    checked: true,
    minWidth: 100,
  },
  {
    label: '接收中',
    prop: 'acceptingCount',
    checked: true,
    minWidth: 90,
  },
  {
    label: '最近入库',
    prop: 'recentlyInboundStorage',
    checked: true,
    minWidth: 100,
  },
  {
    label: '总入库',
    prop: 'inboundStorageTotal',
    checked: true,
    minWidth: 90,
  },
  {
    label: '库存可售',
    prop: 'esAvailableSaleDay',
    checked: true,
    minWidth: 100,
  },
  {
    label: '可售含在途',
    prop: 'esAvailableSaleDayTotal',
    checked: true,
    minWidth: 110,
  },
  {
    label: '断货',
    prop: 'outOfStock',
    checked: true,
    minWidth: 90,
  },
  {
    label: '订货#',
    prop: '',
    checked: true,
    minWidth: 90,
  },
  {
    label: '计划#',
    prop: '',
    checked: true,
    minWidth: 90,
  },
  {
    label: '签收',
    prop: '',
    checked: true,
    minWidth: 90,
  },
  {
    label: '半年有货率',
    prop: 'availableRate',
    checked: true,
    minWidth: 110,
  },
  {
    label: '低量仓储费天数',
    prop: 'warehousing',
    checked: true,
    minWidth: 140,
  },
  {
    label: '预估下月仓储费',
    prop: 'estimateNextMonthStorageFee',
    checked: true,
    minWidth: 140,
  },
  {
    label: '盈亏售价',
    prop: 'profitLossSellingPrice',
    checked: true,
    minWidth: 100,
  },
  {
    label: '30毛利售价',
    prop: 'grossSellingPrice',
    checked: true,
    minWidth: 110,
  },
  {
    label: '操作建议',
    prop: 'operateSuggestion',
    checked: true,
    minWidth: 100,
  },
  {
    label: '状态',
    prop: 'status',
    checked: true,
    minWidth: 100,
  },
  {
    label: '产品描述',
    prop: '',
    checked: true,
    minWidth: 100,
  },
  {
    label: '产品经理',
    prop: '',
    checked: true,
    minWidth: 100,
  },
])
const columnsAsin = ref<any>([
  {
    label: '图片',
    prop: 'componentImage',
    disableCheck: true,
    checked: true,
    width: 75,
    isFixed: 'left'
  },
  {
    label: 'ASIN',
    prop: 'asin',
    disableCheck: true,
    checked: true,
    minWidth: 100,
    isFixed: 'left'
  },
  {
    label: 'SKU',
    prop: 'sku',
    disableCheck: true,
    checked: true,
    minWidth: 100,
    isFixed: 'left'
  },
  {
    label: '父体ASIN',
    prop: 'parentAsin',
    disableCheck: true,
    checked: true,
    minWidth: 110,
    isFixed: 'left'
  },
  {
    label: '站点',
    prop: 'siteName',
    checked: true,
    minWidth: 100,
  },
  {
    label: '销量趋势(点击看明细)',
    prop: 'trend',
    checked: true,
    minWidth: 180,
  },
  {
    label: '今销#',
    prop: 'currentSalesNumber',
    checked: true,
    minWidth: 90,
  },
  {
    label: '今单#',
    prop: 'currentSalesOrder',
    checked: true,
    minWidth: 90,
  },
  {
    label: '今销',
    prop: 'currentSalesPrice',
    checked: true,
    minWidth: 90,
  },
  {
    label: '今广%',
    prop: 'currentAdvertisement',
    checked: true,
    minWidth: 90,
  },
  {
    label: '广告',
    prop: 'advertisementStatus',
    checked: true,
    minWidth: 80,
  },
  {
    label: '饼图',
    prop: 'pieChart',
    checked: true,
    minWidth: 100,
  },
  {
    label: '季节系数',
    prop: 'seasonalCoefficient',
    checked: true,
    minWidth: 100,
  },
  {
    label: '运营分类',
    prop: 'operationTypeId',
    checked: true,
    minWidth: 130,
  },
  {
    label: '小类排名',
    prop: '',
    checked: true,
    minWidth: 100,
  },
  {
    label: '大类排名',
    prop: '',
    checked: true,
    minWidth: 100,
  },
  {
    label: '头部产品#',
    prop: 'headerCount',
    checked: true,
    minWidth: 100,
  },
  {
    label: '运营备注',
    prop: 'operationRemark',
    checked: true,
    minWidth: 150,
  },
  {
    label: 'FBA仓储费',
    prop: 'fbaStorageFee',
    checked: true,
    minWidth: 120,
  },
  {
    label: '2周广告转化',
    prop: 'tWksAdvRate',
    checked: true,
    minWidth: 120,
  },
  {
    label: '2周广告点击',
    prop: 'tWksClickRate',
    checked: true,
    minWidth: 120,
  },
  {
    label: '2周总转化',
    prop: 'tWksTotalConv',
    checked: true,
    minWidth: 110,
  },
  {
    label: '月销量',
    prop: 'monthSalesVolume',
    checked: true,
    minWidth: 90,
  },
  {
    label: '月净利润',
    prop: 'monthNetProfit',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月销售额',
    prop: 'monthSalesPrice',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月净利率',
    prop: 'monthNetProfitMargin',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月广告销售',
    prop: 'monthAdvSales',
    checked: true,
    minWidth: 110,
  },
  {
    label: '月广告支出',
    prop: 'monthAdvExpenditure',
    checked: true,
    minWidth: 110,
  },
  {
    label: '月广告%',
    prop: 'monthAdv',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月ACOS',
    prop: 'monthAcos',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月TACOS',
    prop: 'monthTacos',
    checked: true,
    minWidth: 100,
  },
  {
    label: '1年ACOS',
    prop: 'yearAcos',
    checked: true,
    minWidth: 100,
  },
  {
    label: '1年TACOS',
    prop: 'yearTacos',
    checked: true,
    minWidth: 110,
  },
  {
    label: '移除量',
    prop: 'removalAmount',
    checked: true,
    minWidth: 90,
  },
  {
    label: '替换量',
    prop: 'replacementAmount',
    checked: true,
    minWidth: 90,
  },
  {
    label: '月退货%',
    prop: 'monthReturnGoods',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月退款%',
    prop: 'monthRefund',
    checked: true,
    minWidth: 100,
  },
  {
    label: '上新',
    prop: 'newArrivalDay',
    checked: true,
    minWidth: 90,
  },
  {
    label: '库龄',
    prop: 'inventoryAge',
    checked: true,
    minWidth: 90,
  },
  {
    label: '剩余库存',
    prop: '',
    checked: true,
    minWidth: 100,
  },
  {
    label: '接收中',
    prop: 'acceptingCount',
    checked: true,
    minWidth: 90,
  },
  {
    label: '最近入库',
    prop: 'recentlyInboundStorage',
    checked: true,
    minWidth: 100,
  },
  {
    label: '总入库',
    prop: 'inboundStorageTotal',
    checked: true,
    minWidth: 90,
  },
  {
    label: '库存可售',
    prop: 'esAvailableSaleDay',
    checked: true,
    minWidth: 100,
  },
  {
    label: '可售含在途',
    prop: 'esAvailableSaleDayTotal',
    checked: true,
    minWidth: 110,
  },
  {
    label: '断货',
    prop: 'outOfStock',
    checked: true,
    minWidth: 90,
  },
  {
    label: '订货#',
    prop: 'orderSkuNumber',
    checked: true,
    minWidth: 90,
  },
  {
    label: '计划#',
    prop: 'planPoPurchaseSkuNumber',
    checked: true,
    minWidth: 90,
  },
  {
    label: '签收',
    prop: 'quantityReceived',
    checked: true,
    minWidth: 90,
  },
  {
    label: '半年有货率',
    prop: 'availableRate',
    checked: true,
    minWidth: 110,
  },
  {
    label: '预估下月仓储费',
    prop: 'estimateNextMonthStorageFee',
    checked: true,
    minWidth: 140,
  },
  {
    label: '操作建议',
    prop: 'operateSuggestion',
    checked: true,
    minWidth: 100,
  },
  {
    label: '状态',
    prop: 'status',
    checked: true,
    minWidth: 100,
  },
  {
    label: '产品描述',
    prop: '',
    checked: true,
    minWidth: 100,
  },
  {
    label: '产品经理',
    prop: '',
    checked: true,
    minWidth: 100,
  },
])
const columnsParentAsin = ref<any>([
  {
    label: '图片',
    prop: 'componentImage',
    disableCheck: true,
    checked: true,
    width: 75,
    isFixed: 'left'
  },
  {
    label: '父体ASIN',
    prop: 'pAsin',
    disableCheck: true,
    checked: true,
    minWidth: 110,
    isFixed: 'left'
  },
  {
    label: 'SKU',
    prop: 'sku',
    disableCheck: true,
    checked: true,
    minWidth: 100,
    isFixed: 'left'
  },
  {
    label: '站点',
    prop: 'site',
    checked: true,
    minWidth: 100,
  },
  {
    label: '销量趋势(点击看明细)',
    prop: 'trend',
    checked: true,
    minWidth: 180,
  },
  {
    label: '今销#',
    prop: 'todaySell',
    checked: true,
    minWidth: 90,
  },
  {
    label: '今单#',
    prop: 'todayOrder',
    checked: true,
    minWidth: 90,
  },
  {
    label: '今销',
    prop: 'todaySellD',
    checked: true,
    minWidth: 90,
  },
  {
    label: '今广%',
    prop: 'todayAd',
    checked: true,
    minWidth: 90,
  },
  {
    label: '广告',
    prop: 'ad',
    checked: true,
    minWidth: 80,
  },
  {
    label: '饼图',
    prop: 'pieChart',
    checked: true,
    minWidth: 100,
  },
  {
    label: '小类排名',
    prop: 'sRank',
    checked: true,
    minWidth: 100,
  },
  {
    label: '大类排名',
    prop: 'bRank',
    checked: true,
    minWidth: 100,
  },
  {
    label: 'FBA仓储费',
    prop: 'fbaStorageFee',
    checked: true,
    minWidth: 120,
  },
  {
    label: '2周广告转化',
    prop: 'conversion',
    checked: true,
    minWidth: 120,
  },
  {
    label: '2周广告点击',
    prop: 'click',
    checked: true,
    minWidth: 120,
  },
  {
    label: '2周总转化',
    prop: 'totalConvert',
    checked: true,
    minWidth: 110,
  },
  {
    label: '月销量',
    prop: 'monthlySell',
    checked: true,
    minWidth: 90,
  },
  {
    label: '月净利润',
    prop: 'monthlyNetProfit',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月销售额',
    prop: 'monthlySales',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月净利率',
    prop: 'monthlyNetInterestRate',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月广告销售',
    prop: 'monthlyAdSales',
    checked: true,
    minWidth: 110,
  },
  {
    label: '月广告支出',
    prop: 'monthlyAdSpend',
    checked: true,
    minWidth: 110,
  },
  {
    label: '月广告%',
    prop: 'monthlyAd',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月ACOS',
    prop: 'monthlyACOS',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月TACOS',
    prop: 'monthlyTACOS',
    checked: true,
    minWidth: 100,
  },
  {
    label: '1年ACOS',
    prop: 'yearACOS',
    checked: true,
    minWidth: 100,
  },
  {
    label: '1年TACOS',
    prop: 'yearTACOS',
    checked: true,
    minWidth: 110,
  },
  {
    label: '移除量',
    prop: 'remove',
    checked: true,
    minWidth: 90,
  },
  {
    label: '替换量',
    prop: 'replace',
    checked: true,
    minWidth: 90,
  },
  {
    label: '月退货%',
    prop: 'monthlyReturns',
    checked: true,
    minWidth: 100,
  },
  {
    label: '月退款%',
    prop: 'monthlyRefund',
    checked: true,
    minWidth: 100,
  },
  {
    label: '预估下月仓储费',
    prop: 'estimatedFees',
    checked: true,
    minWidth: 140,
  },
  {
    label: '状态',
    prop: 'status',
    checked: true,
    minWidth: 100,
  },
  {
    label: '产品描述',
    prop: 'productDes',
    checked: true,
    minWidth: 100,
  },
  {
    label: '产品经理',
    prop: 'person',
    checked: true,
    minWidth: 100,
  },
])
const operationsOption = [
  {
    label: '全部',
    value: 0
  },
  {
    label: '王鑫',
    value: 1
  },
  {
    label: '赵前程',
    value: 2
  },
]
const developerOption = [
  {
    label: '全部',
    value: 0
  },
  {
    label: '王宏',
    value: 1
  },
  {
    label: '王文育',
    value: 2
  },
  {
    label: '任佳茗',
    value: 3
  },
]
const initChart1 = () => {
  option1.value = {
    legend: {
      left: '40%',
      top: 0,
    },
    tooltip: {
      trigger: 'axis',
      confine: true
    },
    grid: {
      top: 50,
      bottom: 30,
      left: 50,
      right: 50,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months.map((item) => item.label),
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
    },
    yAxis: {
      name: '系数',
      type: 'value',
      min: 'dataMin', // 自动以数据中的最小值为起点
      boundaryGap: [0, 0.1],
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999'
        }
      }
    },
    series: [
      {
        name: '实际值',
        type: 'line',
        data: [1.2, 1.3, 1.2, 1.2, 1.4, 1.3, 1.2, 1.2, 1.4, 1.3, 1.3, 1.3],
        itemStyle: {
          color: '#52bfff'
        },
        smooth: true,
      },
      {
        name: '参考值',
        type: 'line',
        data: [1.21, 1.38, 1.38, 1.38, 1.2, 1.38, 1.2, 1.2, 1.2, 1.38, 1.38, 1.38],
        itemStyle: {
          color: '#ff8fa5'
        },
        smooth: true,
      },
    ]
  }
  
  chartInstance1?.setOption(option1.value)
}
const initChart2 = () => {
  option2.value = {
    tooltip: {
      trigger: 'axis',
      confine: true
    },
    grid: {
      top: 50,
      bottom: 30,
      left: 50,
      right: 50,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['2024-12-26', '2024-12-27', '2024-12-28', '2024-12-29', '2024-12-30', '2024-12-31', '2025-01-01', '2025-01-02'],
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
    },
    yAxis: {
      name: '小类排名',
      type: 'value',
      min: 'dataMin', // 自动以数据中的最小值为起点
      boundaryGap: [0, 0.1],
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999'
        }
      }
    },
    series: [
      {
        name: '小类排名',
        type: 'line',
        data: [0, 1, 2, 3, 4, 5, 6, 7],
        itemStyle: {
          color: '#52bfff'
        },
        smooth: true,
      },
    ]
  }
  
  chartInstance2?.setOption(option2.value)
}
const initChart3 = () => {
  option3.value = {
    tooltip: {
      trigger: 'axis',
      confine: true
    },
    grid: {
      top: 50,
      bottom: 30,
      left: 50,
      right: 50,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['2024-12-26', '2024-12-27', '2024-12-28', '2024-12-29', '2024-12-30', '2024-12-31', '2025-01-01', '2025-01-02'],
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
    },
    yAxis: {
      name: '大类排名',
      type: 'value',
      min: 'dataMin', // 自动以数据中的最小值为起点
      boundaryGap: [0, 0.1],
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999'
        }
      }
    },
    series: [
      {
        name: '大类排名',
        type: 'line',
        data: [0, 1, 2, 3, 4, 5, 6, 7],
        itemStyle: {
          color: '#52bfff'
        },
        smooth: true,
      },
    ]
  }
  
  chartInstance3?.setOption(option3.value)
}
const handleSeasonalOpened = () => {
  nextTick(() => {
    if (chartContainer1.value) {
      chartInstance1 = echarts.init(chartContainer1.value)
      chartObserver1 = new ResizeObserver(() => {
        if (chartInstance1) {
          chartInstance1.resize()
        }
      })
      chartObserver1.observe(chartContainer1.value)
      initChart1()
    }
  })
}
const handleSRankOpened = () => {
  nextTick(() => {
    if (chartContainer2.value) {
      chartInstance2 = echarts.init(chartContainer2.value)
      chartObserver2 = new ResizeObserver(() => {
        if (chartInstance2) {
          chartInstance2.resize()
        }
      })
      chartObserver2.observe(chartContainer2.value)
      initChart2()
    }
  })
}
const handleBRankOpened = () => {
  nextTick(() => {
    if (chartContainer3.value) {
      chartInstance3 = echarts.init(chartContainer3.value)
      chartObserver3 = new ResizeObserver(() => {
        if (chartInstance3) {
          chartInstance3.resize()
        }
      })
      chartObserver3.observe(chartContainer3.value)
      initChart3()
    }
  })
}
const handleTabClick = (tab: TabsPaneContext) => {
  if (tab.props.name != undefined) {
    console.log(tab.props.name);
    // if (Number(tab.props.name) === 0) {
      
    // }
  }
}
// 运营分类设定可见
const opeClassifyVisible = ref<boolean>(false)

const showOpeClassify = () => {
  opeClassifyVisible.value = true
}
const closeOpeClassify = (value: boolean) => {
  opeClassifyVisible.value = false
}
// 筛选可见
const filterVisible = ref<boolean>(false)
const handleCloseFilterDialog = (value: boolean) => {
  filterVisible.value = value
}
// 关键词趋势
const keyWordTrendVisible = ref<boolean>(false)
const handleCloseKeyWordTrend = (value: boolean) => {
  keyWordTrendVisible.value = value
}


// 处理自适应宽度
const handleWidth = (item: any) => {
  if (activeName.value === 0) {
    if (item.label === 'SKU') {
      return flexColumnWidth(list.value, 'SKU-SKU-SKU-SKU-', 'sku')
    } else if (item.label === 'ASIN') {
      return flexColumnWidth(list.value, 'ASIN', 'asin')
    } else if (item.label === '父体ASIN') {
      return flexColumnWidth(list.value, '父体ASIN', 'parentAsin')
    } else {
      return item.minWidth
    }
  } else if (activeName.value === 1) {
    if (item.label === 'SKU') {
      return flexColumnWidth(fakeData.value, 'SKU', 'sku')
    } else if (item.label === 'ASIN') {
      return flexColumnWidth(fakeData.value, 'ASIN-ASIN-ASIN-ASI', 'asin')
    } else if (item.label === '父体ASIN') {
      return flexColumnWidth(fakeData.value, '父体ASIN', 'parentAsin')
    } else {
      return item.minWidth
    }
  } else {
    if (item.label === 'SKU') {
      return flexColumnWidth(fakeData.value, 'SKU', 'sku')
    } else if (item.label === '父体ASIN') {
      return flexColumnWidth(fakeData.value, '父体ASIN-ASIN-ASIN', 'parentAsin')
    } else {
      return item.minWidth
    }
  }
}
const cellClick = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  const label = column.label
  if (label === '销量趋势(点击看明细)') {
    router.push({
      path: '/storeOperations/productAnalysis',
      query: {
        activeName: 0
      }
    })
  } else if (label === '饼图') {
    router.push({
      path: '/storeOperations/productAnalysis',
      query: {
        activeName: 1
      }
    })
  } else if (label === '运营备注') {
    showRemark()
  } else if (label === '季节系数') {
    seasonalVisible.value = true
  } else if (label === '小类排名') {
    sRankVisible.value = true
  } else if (label === '大类排名') {
    bRankVisible.value = true
  }
}
const handleRouterPush = () => {
  router.push({
    path: '/storeOperations/productAnalysis',
    query: {
      activeName: 2
    }
  })
}
const handleChecked = (item: any) => {
  item.checked = !item.checked
}
const handleMove1 = (event: any) => {
  console.log(event);
  
  const { related  } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns.value[targetIndex]?.disableCheck) {
    return false; // 禁止移动到目标
  }

  return true; // 允许其他操作
}
const handleEnd1 = (event: any) => {
  // console.log(event);
  
}
const handleMove2 = (event: any) => {
  const { related  } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columnsAsin.value[targetIndex]?.disableCheck) {
    return false; // 禁止移动到目标
  }

  return true; // 允许其他操作
}
const handleMove3 = (event: any) => {
  const { related  } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columnsParentAsin.value[targetIndex]?.disableCheck) {
    return false; // 禁止移动到目标
  }

  return true; // 允许其他操作
}
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
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
  queryForm.pageSize = value
  fetchData()
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === 'SKU' || label === 'ASIN' || label === '父体ASIN' || label === '运营备注' || label === '库龄') {
    return {
      textAlign: 'left'
    }
  } else {
    return {
      textAlign: 'center'
    }
  }
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  const label = data.column.label
  if (label === '图片' || label === '饼图') {
    return 'clear-padding'
  }
  return ''
}
const fetchCurrencyList = async () => {
  const { data } = await getCurrencyList()
  currencyList.value = data
}
const fetchDevelopUserList = async () => {
  const { data } = await getDevelopUserList()
  developUserList.value = data
  developUserList.value.unshift({ id: -1, label: '全部' })
}
const fetchSiteList = async () => {
  const { data } = await getDistributionSiteList()
  siteList.value = data
}
const fetchOperateUserList = async () => {
  const { data } = await getDistributionOptionUserList()
  operateUserList.value = data
  operateUserList.value.unshift({ id: -1, label: '全部' })
}
/**
 * 评分转换规则:
    星星展示规则和亚马逊一致，冒号右边为评分区间：
    5星：    [4.8,5]
    4星半： [4.3,4.8)
    4星：    [3.8,4.3)
    3星半： [3.3,3.8)
    3星：    [2.8,3.3)
    2星半： [2.3,2.8)
    2星：    [1.8,2.3)
    1星半： [1.3,1.8)
    1星：    [0,1.3)
*/
function getAmazonStars(score: number) {
  if (score >= 4.8) return 5;
  if (score >= 4.3) return 4.5;
  if (score >= 3.8) return 4;
  if (score >= 3.3) return 3.5;
  if (score >= 2.8) return 3;
  if (score >= 2.3) return 2.5;
  if (score >= 1.8) return 2;
  if (score >= 1.3) return 1.5;
  return 1;
}
const fetchData = async () => {
  listLoading.value = true
  const { site, ...filterQueryForm } = queryForm
  const { data } = await getOperationAmazonSKUList({
    ...filterQueryForm,
    siteIds: site.join(',')
  })
  total.value = data.total
  list.value = data.list
  list.value.forEach((item) => {
    item.displayRating = computed(() => getAmazonStars(item.rating!));
    item.saleTrendList = {
      xAxis: [
        "21-04-1",
				"21-08-1",
				"22-05-1",
				"22-06-1",
				"22-07-1",
				"22-09-1",
				"22-10-1",
				"23-01-1",
				"23-05-1",
				"23-07-1",
				"23-10-1",
				"23-11-1"
      ],
      yAxis: [
        6611,
				53824,
				18712,
				18991,
				21611,
				10277,
				15420,
				9159,
				4192,
				3064,
				5619,
				4500
      ]
    }
    item.storageAge = `
      <div class="storage-list">
        ${storageList.map((item) => `
          <div class="storage-item">
            <span class="value1">${item.name}</span>
            <span class="value2">${item.fba}</span>
            <span class="value3">${item.fba ? `($${item.price})` : ''}</span>
          </div>
        `).join('')}
      </div>
    `

  })
  listLoading.value = false
}
const storageList = [
  { name: '181-270', fba: 10, price: 2.34 },
  { name: '271-360', fba: 216, price: 35.33 },
  { name: '361+', fba: 0 },
]
onBeforeMount(() => {
  fetchSiteList()
  fetchCurrencyList()
  fetchOperateUserList()
  fetchDevelopUserList()
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
            margin-bottom: 0;
          }
          .el-form {
            .el-form-item:first-child {
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

    .storage-list {
      display: grid;
    }

    .storage-item {
      display: grid;
      grid-template-columns: 65px 35px 60px; /* 设定固定列宽 */
      text-align: left;
    }
 
    .value2 {
      color: #000;
      font-weight: 550;
    }
    .value3 {
      color: var(--el-color-danger);
      font-weight: 550;
    }
  }
}
.icon-hover {
  padding: 6px;
  border-radius: 4px; /* 圆角 */
  transition: background-color 0.3s; /* 动画过渡效果 */
}
.icon-hover:hover {
  background-color: #f2f2f2; /* 浅灰色背景 */
  color: var(--el-color-primary);
}
.noneHoverTable :deep(.clear-padding) {
  padding-top: 0px;
  padding-bottom: 0px;
}
.noneHoverTable :deep(.clear-padding .cell) {
  padding-right: 0px;
  padding-left: 0px;
}
.noneHoverTable :deep(.reduce-padding .cell) {
  padding-right: 2px;
  padding-left: 2px;
}
.noneHoverTable :deep(.el-checkbox) {
  transform: scale(1.3);
  transform-origin: center;
}
.disabled-handle {
  cursor: not-allowed;
}
.flex {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}
.rate-wrapper {
  display: flex; 
  align-items: center; 
  gap: 8px;

  .rate-value {
    width: 25px; /* 固定宽度，保证分数区域宽度一致 */
    text-align: left; /* 文本右对齐 */
  }
  .custom-rate {
    --el-rate-icon-size: 20px; /* 调整星星的大小 */
    --el-rate-fill-color: #f09000; /* 填充星星的颜色 */
    --el-rate-text-color: #f09000; /* 文本颜色一致 */
    --el-rate-disabled-void-color: #fff; /* 未填充星星的颜色 */
    --el-rate-void-color: #fff; /* 空星颜色 */

    :deep() {
      .el-rate__item {
        margin-top: -2px;
        margin-right: 0;
        margin-left: -9px;
        .el-icon {
          stroke: #f09000; /* 星星边框颜色 */
          stroke-width: 60px; /* 星星边框的粗细 */
        }
      }
    }

  }
  .rate-count {
    color: #36788C;
    margin-left: -11px;
  }
}
.custom-tooltip {
  white-space: pre-wrap; 
  max-width: 400px; 
  font-size: var(--el-font-size-base);
}
.customTag {
  color: #fff; 
  border-radius: 17px; 
  padding: 0 30px;
  border: 0;
  width: 7em;

  &-veryPoor {
    background-color: #e32e00; 
  }
  &-good {
    background-color: #bad411; 
  }
  &-fair {
    background-color: #ffc400;
  }
  &-poor {
    background-color: #ff9900;
  }
  &-excellent {
    background-color: #49850f;
  }
}
.custom-bar {
  width: 100%;
  height: 50px;
}
.arrow-up {
  color: #ff3f48; 
  font-weight: 600;
  transform: scale(0.9, 1.4);  
  margin-left: 3px;
}
.arrow-down {
  color: #67C23A;
  font-weight: 600;
  transform: scale(0.9, 1.4);  
  margin-left: 3px;
}

</style>