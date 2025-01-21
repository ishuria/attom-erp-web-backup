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
                  class="multiple-select"
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="1"
                  multiple
                  placeholder="请选择站点"
                  style="width: 220px"
                  @change="queryData"
                >
                  <template #header>
                    <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">所有</el-checkbox>
                  </template>
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="币种">
                <el-select placeholder="请选择币种">
                  <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="运营">
                <el-select v-model="queryForm.operationUserId" placeholder="请选择运营人员" style="width: 5em" @change="queryData">
                  <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="开发人">
                <el-select v-model="queryForm.developUserId" placeholder="请选择开发人" style="width: 5em" @change="queryData">
                  <el-option v-for="item in developUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="filterVisible = true">筛选</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="showOpeClassify">运营分类设定</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="keyWordTrendVisible = true">关键词排名趋势</el-button>
              </el-form-item>
              <el-form-item>
                <el-text style="margin-left: 10px; font-weight: 600">数据更新时间：2024年12月22日14:02</el-text>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="4">
            <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
              <template #reference>
                <el-button>
                  <vab-icon icon="settings-line" />
                </el-button>
              </template>
              <vab-draggable
                v-model="columns"
                :animation="600"
                filter=".non-draggable"
                handle=".handle"
                :on-end="handleEnd1"
                :on-move="handleMove1"
              >
                <div
                  v-for="item in columns"
                  :key="item.label"
                  :class="{ 'non-draggable': item.disableCheck }"
                  style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
                >
                  <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
                  <span style="flex: 1">{{ item.label }}</span>
                  <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center;">
                    <vab-icon icon="eye-line" />
                  </span>
                  <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer" @click="handleChecked(item)">
                    <vab-icon v-show="!item.checked" icon="eye-off-line" />
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                </div>
              </vab-draggable>
            </el-popover>
            <el-form inline :model="queryForm">
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
          :cell-class-name="clearPadding"
          :cell-style="cellStyle"
          class="noneHoverTable"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @cell-click="cellClick"
        >
          <el-table-column
            v-for="(item) in checkList1"
            :key="item.columnId"
            :fixed="item.isFixed"
            :label="item.label"
            :min-width="handleWidth(item)"
            :prop="item.prop"
            :width="item.width"
          >
            <template #header>
              <span v-if="item.label === '销量趋势(点击看明细)'">
                销量趋势
                <br />
                (点击看明细)
              </span>
              <span v-if="item.label === '2周广告转化'">
                2周广告
                <br />
                转化
              </span>
              <span v-if="item.label === '2周广告点击'">
                2周广告
                <br />
                点击
              </span>
              <span v-if="item.label === '库存可售'">
                库存
                <br />
                可售
              </span>
              <span v-if="item.label === '可售含在途'">
                可售
                <br />
                含在途
              </span>
              <span v-if="item.prop === 'outletDeal'">
                可报
                <br />
                Outlet Deal
              </span>
              <span v-if="item.label === '今销'">
                <el-tooltip content="" effect="dark" placement="top">
                  <span>今销 <el-icon style="vertical-align: middle"><question-filled /></el-icon> </span>
                  <template #content>
                    <div class="custom-tooltip">今日销售额</div>
                  </template>
                </el-tooltip>
              </span>
              <span v-if="item.label === '今广%'">
                <el-tooltip content="" effect="dark" placement="top">
                  <span>今广% <el-icon style="vertical-align: middle"><question-filled /></el-icon> </span>
                  <template #content>
                    <div class="custom-tooltip">今日广告销售占比</div>
                  </template>
                </el-tooltip>
              </span>
              <span v-if="item.label === '头部产品#'">
                <el-tooltip content="" effect="dark" placement="top">
                  <span>头部产品# <el-icon style="vertical-align: middle"><question-filled /></el-icon> </span>
                  <template #content>
                    <div class="custom-tooltip" >大于60：头部垄断较小<br />30 - 60：头部垄断中等<br />小于30：头部垄断严重</div>
                  </template>
                </el-tooltip>
              </span>
              <span v-if="item.label === 'FBA差异'">
                <el-tooltip content="" effect="dark" placement="top">
                  <span>FBA差异 <el-icon style="vertical-align: middle"><question-filled /></el-icon> </span>
                  <template #content>
                    <div class="custom-tooltip" >=亚马逊FBA - 自量FBA</div>
                  </template>
                </el-tooltip>
              </span>
              <span v-if="item.label === '月广告%'">
                <el-tooltip content="" effect="dark" placement="top">
                  <span>月广告% <el-icon style="vertical-align: middle"><question-filled /></el-icon> </span>
                  <template #content>
                    <div class="custom-tooltip" >月广告销售占比</div>
                  </template>
                </el-tooltip>
              </span>
            </template>
            <template #default="{ row }">
              <span v-if="item.label === '图片'">
                <el-image
                  fit="fill"
                  :src="row.skuImgUrl"
                  style="display: block; width: 75px; height: 75px"
                  @click="imagePreviewShow(row.skuImgUrl)"
                >
                  <template #error><el-icon /></template>
                </el-image>
              </span>
              <!-- SKU 展示-->
              <span v-if="item.label === 'SKU'">
                {{ row.sku }}
                <div class="rate-wrapper">
                  <span class="rate-value">{{ row.rating }}</span>
                  <span><el-rate v-model="row.displayRating" class="custom-rate" disabled :void-icon="Star" /></span>
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
                <el-select v-model="row.operationTypeId" style="min-width: 100%" @change="handleUpdateOpeType(row)">
                  <el-option v-for="a in row.operationTypeList" :key="a.id" :label="a.label" :value="a.id" />
                </el-select>
              </span>
              <span v-if="item.label === '停产'">
                <el-checkbox v-model="row.stopProductStatus" :false-value="0" :true-value="1" @change="handleUpdateSKUStopStatus(row)" />
              </span>
              <span v-if="label1.includes(item.label)">
                {{ currencySymbols.get('USD') }}{{ getRowValue(row, item.label, label1Map).toFixed(2) }}
              </span>
              <span v-if="label2.includes(item.label)">
                <!-- 处理 百分比（小数点后两位）-->
                {{ formatPercentage(getRowValue(row, item.label, label2Map)) }}
              </span>
              <span v-if="label3.includes(item.label)">
                <!-- 处理 天 -->
                {{ row[label3Map.get(item.label)!] != null ? row[label3Map.get(item.label)!] + '天' : '' }}
              </span>
              <span v-if="item.label === 'VOC满意度'">
                <el-tag v-if="row.vocSatisfaction === 0" class="customTag customTag-veryPoor">Very poor</el-tag>
                <el-tag v-if="row.vocSatisfaction === 1" class="customTag customTag-fair">Fair</el-tag>
                <el-tag v-if="row.vocSatisfaction === 2" class="customTag customTag-poor">Poor</el-tag>
                <el-tag v-if="row.vocSatisfaction === 3" class="customTag customTag-good">Good</el-tag>
                <el-tag v-if="row.vocSatisfaction === 4" class="customTag customTag-excellent">Excellent</el-tag>
              </span>
              <span v-if="item.label === '半年有货率'">{{ Math.floor(Number(row.availableRate)) }}%</span>
              <span v-if="item.label === '今广%'">{{ Math.floor(Number(row.currentAdvertisement)) }}%</span>
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
                  <vab-echarts-chart-pie :data="data1" />
                </div>
              </span>
              <span v-if="item.label === '季节系数'">
                <div style="width: 100%; height: 50px">
                  <vab-table-chart-line :x-axis-data="seasonalXData" :y-axis-data="seasonalYData" />
                </div>
              </span>
              <span v-if="item.label === '当前售价'">
                <el-link type="primary" @click="handleRouterPush">${{ row.sellingPrice }}</el-link>
              </span>
              <span v-if="item.label === '小类排名'">
                {{ row.nowSubcategoryRanking }}
                <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking >= 0" class="arrow-up" icon="arrow-up-fill" />
                <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking < 0" class="arrow-down" icon="arrow-down-fill" />
                <span style="color: #999">{{ row.nowSubcategoryRanking - row.beforeSubcategoryRanking }}</span>
              </span>
              <span v-if="item.label === '大类排名'">
                {{ row.nowMajorCategoryRanking }}
                <vab-icon
                  v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking < 0"
                  class="arrow-down"
                  icon="arrow-down-fill"
                />
                <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking >= 0" class="arrow-up" icon="arrow-up-fill" />
                <span style="color: #999">{{ row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking }}</span>
              </span>
              <span v-if="item.label === '剩余库存'">{{ row.availableInventory }}/{{ row.fbaCount }}</span>
              <span v-if="item.label === '库龄'">
                <span v-html="row.storageAge"></span>
              </span>
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
      <el-tab-pane label="ASIN" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel :span="20">
            <el-form inline :model="queryForm">
              <el-form-item label="站点">
                <el-select
                  v-model="asinQueryForm.site"
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="1"
                  multiple
                  placeholder="请选择站点"
                  style="width: 220px"
                  @change="queryAsinData"
                >
                  <template #header>
                    <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">所有</el-checkbox>
                  </template>
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="币种">
                <el-select placeholder="请选择币种">
                  <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="运营">
                <el-select v-model="asinQueryForm.operationUserId" placeholder="请选择运营人员" style="width: 5em" @change="queryAsinData">
                  <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="开发人">
                <el-select v-model="asinQueryForm.developUserId" placeholder="请选择开发人" style="width: 5em" @change="queryAsinData">
                  <el-option v-for="item in developUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="filterVisible = true">筛选</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="showOpeClassify">运营分类设定</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="keyWordTrendVisible = true">关键词排名趋势</el-button>
              </el-form-item>
              <el-form-item>
                <el-text style="margin-left: 10px; font-weight: 600">数据更新时间：2024年12月22日14:02</el-text>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="4">
            <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
              <template #reference>
                <el-button>
                  <vab-icon icon="settings-line" />
                </el-button>
              </template>
              <vab-draggable v-model="columnsAsin" :animation="600" filter=".non-draggable" handle=".handle" :on-end="handleEnd2" :on-move="handleMove2">
                <div
                  v-for="item in columnsAsin"
                  :key="item.label"
                  :class="{ 'non-draggable': item.disableCheck }"
                  style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
                >
                  <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
                  <span style="flex: 1">{{ item.label }}</span>
                  <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                  <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer" @click="handleChecked(item)">
                    <vab-icon v-show="!item.checked" icon="eye-off-line" />
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                </div>
              </vab-draggable>
            </el-popover>
            <el-form inline :model="queryForm">
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
          :cell-class-name="clearPadding"
          :cell-style="cellStyle"
          class="noneHoverTable"
          :data="asinList"
          :header-cell-style="{ textAlign: 'center' }"
          @cell-click="cellClick"
        >
          <el-table-column
            v-for="(item) in checkList2"
            :key="item.columnId"
            :fixed="item.isFixed"
            :label="item.label"
            :min-width="handleWidth(item)"
            :prop="item.prop"
            :width="item.width"
          >
            <template #header>
              <span v-if="item.label === '销量趋势(点击看明细)'">
                销量趋势
                <br />
                (点击看明细)
              </span>
              <span v-if="item.label === '2周广告转化'">
                2周广告
                <br />
                转化
              </span>
              <span v-if="item.label === '2周广告点击'">
                2周广告
                <br />
                点击
              </span>
              <span v-if="item.label === '库存可售'">
                库存
                <br />
                可售
              </span>
              <span v-if="item.label === '可售含在途'">
                可售
                <br />
                含在途
              </span>
              <span v-if="item.prop === 'outletDeal'">
                可报
                <br />
                Outlet Deal
              </span>
              <span v-if="item.label === '今销'">
                <el-tooltip content="" effect="dark" placement="top">
                  <span>今销 <el-icon style="vertical-align: middle"><question-filled /></el-icon> </span>
                  <template #content>
                    <div class="custom-tooltip">今日销售额</div>
                  </template>
                </el-tooltip>
              </span>
              <span v-if="item.label === '今广%'">
                <el-tooltip content="" effect="dark" placement="top">
                  <span>今广% <el-icon style="vertical-align: middle"><question-filled /></el-icon> </span>
                  <template #content>
                    <div class="custom-tooltip">今日广告销售占比</div>
                  </template>
                </el-tooltip>
              </span>
              <span v-if="item.label === '头部产品#'">
                <el-tooltip content="" effect="dark" placement="top">
                  <span>头部产品# <el-icon style="vertical-align: middle"><question-filled /></el-icon> </span>
                  <template #content>
                    <div class="custom-tooltip" >大于60：头部垄断较小<br />30 - 60：头部垄断中等<br />小于30：头部垄断严重</div>
                  </template>
                </el-tooltip>
              </span>
              <span v-if="item.label === '月广告%'">
                <el-tooltip content="" effect="dark" placement="top">
                  <span>月广告% <el-icon style="vertical-align: middle"><question-filled /></el-icon> </span>
                  <template #content>
                    <div class="custom-tooltip" >月广告销售占比</div>
                  </template>
                </el-tooltip>
              </span>
            </template>
            <template #default="{ row }">
              <span v-if="item.label === '图片'">
                <el-image
                  fit="fill"
                  :src="row.asinImgUrl"
                  style="display: block; width: 75px; height: 75px"
                  @click="imagePreviewShow(row.asinImgUrl)"
                >
                  <template #error>
                    <el-icon />
                  </template>
                </el-image>
              </span>
              <span v-if="item.label === 'ASIN'">
                <el-link type="primary">{{ row.asin }}</el-link>
                <div class="rate-wrapper">
                  <span class="rate-value">{{ row.rating }}</span>
                  <span><el-rate v-model="row.displayRating" class="custom-rate" disabled :void-icon="Star" /></span>
                  <span class="rate-count">{{ row.commentsNumbers }}</span>
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
                <el-select v-model="row.operationTypeId" style="min-width: 100%" @change="handleUpdateOpeType(row)">
                  <el-option v-for="select in row.operationTypeList" :key="select.id" :label="select.label" :value="select.id" />
                </el-select>
              </span>
              <span v-if="label1.includes(item.label)">
                {{ currencySymbols.get('USD') }}{{ getRowValue(row, item.label, label1Map).toFixed(2) }}
              </span>
              <span v-if="label2.includes(item.label)">
                {{ formatPercentage(getRowValue(row, item.label, label2Map)) }}
              </span>
              <span v-if="label3.includes(item.label)">
                <!-- 处理 天 -->
                {{ row[label3Map.get(item.label)!] != null ? row[label3Map.get(item.label)!] + '天' : '' }}
              </span>
              <span v-if="item.label === '半年有货率'">{{ Math.floor(Number(row.availableRate)) }}%</span>
              <span v-if="item.label === '今广%'">{{ Math.floor(Number(row.currentAdvertisement)) }}%</span>
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
                  <vab-echarts-chart-pie :data="data1" />
                </div>
              </span>
              <span v-if="item.label === '季节系数'">
                <div style="width: 100%; height: 50px">
                  <vab-table-chart-line :x-axis-data="seasonalXData" :y-axis-data="seasonalYData" />
                </div>
              </span>
              <span v-if="item.label === '小类排名'">
                {{ row.nowSubcategoryRanking }}
                <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking >= 0" class="arrow-up" icon="arrow-up-fill" />
                <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking < 0" class="arrow-down" icon="arrow-down-fill" />
                <span style="color: #999">{{ row.nowSubcategoryRanking - row.beforeSubcategoryRanking }}</span>
              </span>
              <span v-if="item.label === '大类排名'">
                {{ row.nowMajorCategoryRanking }}
                <vab-icon
                  v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking < 0"
                  class="arrow-down"
                  icon="arrow-down-fill"
                />
                <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking >= 0" class="arrow-up" icon="arrow-up-fill" />
                <span style="color: #999">{{ row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking }}</span>
              </span>
              <span v-if="item.label === '剩余库存'">{{ row.availableInventory }}/{{ row.fbaCount }}</span>
              <span v-if="item.label === '库龄'">
                <span v-html="row.storageAge"></span>
              </span>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="asinQueryForm.pageNo"
          :page-size="asinQueryForm.pageSize"
          :total="total"
          @current-change="handleAsinCurrentChange"
          @size-change="handleAsinSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="父体ASIN" :name="2">
        <vab-query-form>
          <vab-query-form-left-panel :span="20">
            <el-form inline :model="pAsinQueryForm">
              <el-form-item label="站点">
                <el-select
                  v-model="pAsinQueryForm.site"
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="1"
                  multiple
                  placeholder="请选择站点"
                  style="width: 220px"
                  @change="queryPAsinData"
                >
                  <template #header>
                    <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">所有</el-checkbox>
                  </template>
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="币种">
                <el-select placeholder="请选择币种">
                  <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="运营">
                <el-select
                  v-model="pAsinQueryForm.operationUserId"
                  placeholder="请选择运营人员"
                  style="width: 5em"
                  @change="queryPAsinData"
                >
                  <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="开发人">
                <el-select v-model="pAsinQueryForm.developUserId" placeholder="请选择开发人" style="width: 5em" @change="queryPAsinData">
                  <el-option v-for="item in developUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="showOpeClassify">运营分类设定</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="keyWordTrendVisible = true">关键词排名趋势</el-button>
              </el-form-item>
              <el-form-item>
                <el-text style="margin-left: 10px; font-weight: 600">数据更新时间：2024年12月22日14:02</el-text>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="4">
            <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
              <template #reference>
                <el-button>
                  <vab-icon icon="settings-line" />
                </el-button>
              </template>
              <vab-draggable v-model="columnsParentAsin" :animation="600" filter=".non-draggable" handle=".handle" :on-end="handleEnd3" :on-move="handleMove3">
                <div
                  v-for="item in columnsParentAsin"
                  :key="item.label"
                  :class="{ 'non-draggable': item.disableCheck }"
                  style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
                >
                  <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
                  <span style="flex: 1">{{ item.label }}</span>
                  <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                  <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer" @click="handleChecked(item)">
                    <vab-icon v-show="!item.checked" icon="eye-off-line" />
                    <vab-icon v-show="item.checked" icon="eye-line" />
                  </span>
                </div>
              </vab-draggable>
            </el-popover>
            <el-form inline :model="queryForm">
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
          :cell-class-name="clearPadding"
          :cell-style="cellStyle"
          class="noneHoverTable"
          :data="pAsinList"
          :header-cell-style="{ textAlign: 'center' }"
          @cell-click="cellClick"
        >
          <el-table-column
            v-for="(item) in checkList3"
            :key="item.columnId"
            :fixed="item.isFixed"
            :label="item.label"
            :min-width="handleWidth(item)"
            :prop="item.prop"
            :width="item.width"
          >
            <template #header>
              <span v-if="item.label === '销量趋势(点击看明细)'">
                销量趋势
                <br />
                (点击看明细)
              </span>
              <span v-if="item.label === '2周广告转化'">
                2周广告
                <br />
                转化
              </span>
              <span v-if="item.label === '2周广告点击'">
                2周广告
                <br />
                点击
              </span>
              <span v-if="item.label === '库存可售'">
                库存
                <br />
                可售
              </span>
              <span v-if="item.label === '可售含在途'">
                可售
                <br />
                含在途
              </span>
              <span v-if="item.label === '今销'">
                <el-tooltip content="" effect="dark" placement="top">
                  <span>今销 <el-icon style="vertical-align: middle"><question-filled /></el-icon> </span>
                  <template #content>
                    <div class="custom-tooltip">今日销售额</div>
                  </template>
                </el-tooltip>
              </span>
              <span v-if="item.label === '今广%'">
                <el-tooltip content="" effect="dark" placement="top">
                  <span>今广% <el-icon style="vertical-align: middle"><question-filled /></el-icon> </span>
                  <template #content>
                    <div class="custom-tooltip">今日广告销售占比</div>
                  </template>
                </el-tooltip>
              </span>
              <span v-if="item.label === '月广告%'">
                <el-tooltip content="" effect="dark" placement="top">
                  <span>月广告% <el-icon style="vertical-align: middle"><question-filled /></el-icon> </span>
                  <template #content>
                    <div class="custom-tooltip" >月广告销售占比</div>
                  </template>
                </el-tooltip>
              </span>
            </template>
            <template #default="{ row }">
              <span v-if="item.label === '图片'">
                <el-image
                  fit="fill"
                  :src="row.asinImgUrl"
                  style="display: block; width: 75px; height: 75px"
                  @click="imagePreviewShow(row.asinImgUrl)"
                >
                  <template #error>
                    <el-icon />
                  </template>
                </el-image>
              </span>

              <!-- 父体ASIN 展示 -->
              <span v-if="item.label === '父体ASIN'">
                <el-link type="primary">{{ row.parentAsin }}</el-link>
                <div class="rate-wrapper">
                  <span class="rate-value">{{ row.rating }}</span>
                  <span><el-rate v-model="row.displayRating" class="custom-rate" disabled :void-icon="Star" /></span>
                  <span class="rate-count">{{ row.commentsNumbers }}</span>
                </div>
              </span>
              <span v-if="item.label === 'SKU'">
                <el-tooltip content=" " :disabled="!row.overflow_sku" effect="dark" placement="top">
                  <template #content>
                    <div class="custom-tooltip">{{ row._skuFull }}</div>
                  </template>
                  <span v-html="row._sku"></span>
                </el-tooltip>
              </span>
              <span v-if="item.label === '销量趋势(点击看明细)'">
                <div class="custom-bar">
                  <vab-echarts-chart-bar :x-axis-data="row.saleTrendList.xAxis" :y-axis-data="row.saleTrendList.yAxis" />
                </div>
              </span>
              <span v-if="label1.includes(item.label)">
                {{ currencySymbols.get('USD') }}{{ getRowValue(row, item.label, label1Map).toFixed(2) }}
              </span>
              <span v-if="label2.includes(item.label)">
                {{ formatPercentage(getRowValue(row, item.label, label2Map)) }}
              </span>
              <span v-if="item.label === '今广%'">{{ Math.floor(Number(row.currentAdvertisement)) }}%</span>
              <span v-if="item.label === '广告'">
                <el-tag v-if="row.advertisementStatus === 0" type="danger">关</el-tag>
                <el-tag v-if="row.advertisementStatus === 1" type="success">开</el-tag>
              </span>
              <span v-if="item.label === '饼图'">
                <div style="width: 100%; height: 60px">
                  <vab-echarts-chart-pie :data="data1" />
                </div>
              </span>
              <span v-if="item.label === '小类排名'">
                {{ row.nowSubcategoryRanking }}
                <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking >= 0" class="arrow-up" icon="arrow-up-fill" />
                <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking < 0" class="arrow-down" icon="arrow-down-fill" />
                <span style="color: #999">{{ row.nowSubcategoryRanking - row.beforeSubcategoryRanking }}</span>
              </span>
              <span v-if="item.label === '大类排名'">
                {{ row.nowMajorCategoryRanking }}
                <vab-icon
                  v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking < 0"
                  class="arrow-down"
                  icon="arrow-down-fill"
                />
                <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking >= 0" class="arrow-up" icon="arrow-up-fill" />
                <span style="color: #999">{{ row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking }}</span>
              </span>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
        <vab-pagination
          :current-page="pAsinQueryForm.pageNo"
          :page-size="pAsinQueryForm.pageSize"
          :total="total"
          @current-change="handlePAsinCurrentChange"
          @size-change="handlePAsinSizeChange"
        />
      </el-tab-pane>
    </el-tabs>

    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- 运营分类 -->
    <vab-operational-classify :ope-classify-visible="opeClassifyVisible" @update-visible="closeOpeClassify" />
    <!-- 筛选 -->
    <vab-filter-dialog :filter-visible="filterVisible" @update-filter="handleConfirmFilter" @update-visible="handleCloseFilterDialog" />
    <!-- 关键词排名趋势 -->
    <vab-key-word-rank-trend :key-word-trend-visible="keyWordTrendVisible" @update-visible="handleCloseKeyWordTrend" />
    <!-- 运营备注 -->
    <vab-dialog v-model="remarkVisible" title="运营备注" width="20%">
      <el-input placeholder="请输入运营备注" :rows="15" type="textarea" />
      <template #footer>
        <el-button @click="remarkVisible = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 季节系数 -->
    <vab-dialog v-model="seasonalVisible" title="季节系数" width="40%" @open="handleSeasonalOpened">
      <div ref="chartContainer1" style="width: 100%; height: 400px"></div>
      <template #footer></template>
    </vab-dialog>
    <!-- 小类排名 -->
    <vab-dialog v-model="sRankVisible" title="小类排名" width="40%" @open="handleSRankOpened">
      <div ref="chartContainer2" style="width: 100%; height: 400px"></div>
      <template #footer></template>
    </vab-dialog>
    <!-- 大类排名 -->
    <vab-dialog v-model="bRankVisible" title="大类排名" width="40%" @open="handleBRankOpened">
      <div ref="chartContainer3" style="width: 100%; height: 400px"></div>
      <template #footer></template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { QuestionFilled, Search, Star } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { CheckboxValueType, TabsPaneContext } from 'element-plus'
import type { CSSProperties } from 'vue'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { currencySymbols, months } from '../constantOption'
import { getDistributionOptionUserList, getDistributionSiteList } from '/@/api/devlocal/productDistribution'
import {
  filterAmazonSKUList,
  filterOperationAmazonAsinList,
  getCurrencyList,
  getDevelopUserList,
  getOperationAmazonSKUList,
  getOperationAsinList,
  getOperationColumnList,
  getOperationParentAsinList,
  hideOrShowOperationColumn,
  updateOperationSKUDisContinuedStatus,
  updateOperationSKUOperateTypeList,
  updateSortOperationColumn,
} from '/@/api/devlocal/productPerformance'
import type {
  IGetOperationAmazonSKUList,
  IGetOperationAsinList,
  IGetOperationColumnList,
  IGetOperationParentAsinList,
} from '/@/type/storeOperation/productPerformanceType'
import { getAmazonStars } from '/@/utils/rate'
import { calculateBrColumnWidth, flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'
defineOptions({
  name: 'ProductPerformance',
})

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
const checkAll = ref<boolean>(true)
const indeterminate = ref<boolean>(false)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  site: [],
  operationUserId: 1,
  developUserId: 1,
})
const asinQueryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  site: [],
  operationUserId: 1,
  developUserId: 1,
})
const pAsinQueryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  site: [],
  operationUserId: 1,
  developUserId: 1,
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const list = ref<IGetOperationAmazonSKUList[]>([])
const asinList = ref<IGetOperationAsinList[]>([])
const pAsinList = ref<IGetOperationParentAsinList[]>([])
const { site } = toRefs(queryForm)
const handleConfirmFilter = async (filterForm: any) => {
  if (activeName.value === 0) {
    const { site, ...filterQueryForm } = queryForm
    const siteIds = site.join(',')
    const { data } = await filterAmazonSKUList({
      ...filterQueryForm,
      ...filterForm,
      siteIds,
    })
    if (data) {
      $baseMessage('SKU运营筛选成功！', 'success')
      filterVisible.value = false
      total.value = data.total
      list.value = data.list
    }
  } else if (activeName.value === 1) {
    const { site, ...filterQueryForm } = asinQueryForm
    const siteIds = site.join(',')
    const { data } = await filterOperationAmazonAsinList({
      ...filterQueryForm,
      ...filterForm,
      siteIds,
    })
    if (data) {
      $baseConfirm('ASIN运营筛选成功！', 'success')
      filterVisible.value = false
      total.value = data.total
      asinList.value = data.list
    }
  }
}
const handleUpdateOpeType = async (row: IGetOperationAmazonSKUList) => {
  await updateOperationSKUOperateTypeList({
    id: row.id!,
    typeId: row.operationTypeId!,
  })
}
const handleUpdateSKUStopStatus = async (row: IGetOperationAmazonSKUList) => {
  await updateOperationSKUDisContinuedStatus({
    id: row.id!,
    status: row.stopProductStatus!,
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
    if (activeName.value === 0) {
      queryData()
    } else if (activeName.value === 1) {
      queryAsinData()
    } else {
      queryPAsinData()
    }
  } else {
    queryForm.site = []
    // 取消全选获取数据
    if (activeName.value === 0) {
      queryData()
    } else if (activeName.value === 1) {
      queryAsinData()
    } else {
      queryPAsinData()
    }
  }
}
const showRemark = () => {
  remarkVisible.value = true
}

function getRowValue(row: any, label: string, labelMap: any): number {
  const key = labelMap.get(label)
  // 如果找不到 key，返回 0；如果 key 存在，但 row[key] 不是数字，也返回 0
  return key !== undefined && typeof row[key] === 'number' ? row[key] : 0
}
function formatPercentage(value: number): string {
  const percentage = (value * 100).toFixed(2) // 将小数转换为百分比，并保留两位小数
  return `${percentage}%`
}

const label1 = [
  '今销',
  'FBA仓储费',
  '亚马逊FBA',
  'FBA差异',
  '月净利润',
  '月销售额',
  '月广告销售',
  '月广告支出',
  '预计下月仓储费',
  '盈亏售价',
  '30毛利售价',
]
const label2 = [
  '试算毛利',
  '2周广告转化',
  '2周广告点击',
  '2周总转化',
  '月净利率',
  '月广告%',
  '月ACOS',
  '月TACOS',
  '1年ACOS',
  '1年TACOS',
  '月退货%',
  '月退款%',
  'VOC缺陷%',
]
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
const columns = ref<any>([])
const columnsAsin = ref<any>([])
const columnsParentAsin = ref<any>([])

const initChart1 = () => {
  option1.value = {
    legend: {
      left: '40%',
      top: 0,
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
    },
    grid: {
      top: 50,
      bottom: 30,
      left: 50,
      right: 50,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: months.map((item) => item.label),
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999',
        },
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
          color: '#999',
        },
      },
    },
    series: [
      {
        name: '实际值',
        type: 'line',
        data: [1.2, 1.3, 1.2, 1.2, 1.4, 1.3, 1.2, 1.2, 1.4, 1.3, 1.3, 1.3],
        itemStyle: {
          color: '#52bfff',
        },
        smooth: true,
      },
      {
        name: '参考值',
        type: 'line',
        data: [1.21, 1.38, 1.38, 1.38, 1.2, 1.38, 1.2, 1.2, 1.2, 1.38, 1.38, 1.38],
        itemStyle: {
          color: '#ff8fa5',
        },
        smooth: true,
      },
    ],
  }

  chartInstance1?.setOption(option1.value)
}
const initChart2 = () => {
  option2.value = {
    tooltip: {
      trigger: 'axis',
      confine: true,
    },
    grid: {
      top: 50,
      bottom: 30,
      left: 50,
      right: 50,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['2024-12-26', '2024-12-27', '2024-12-28', '2024-12-29', '2024-12-30', '2024-12-31', '2025-01-01', '2025-01-02'],
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999',
        },
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
          color: '#999',
        },
      },
    },
    series: [
      {
        name: '小类排名',
        type: 'line',
        data: [0, 1, 2, 3, 4, 5, 6, 7],
        itemStyle: {
          color: '#52bfff',
        },
        smooth: true,
      },
    ],
  }

  chartInstance2?.setOption(option2.value)
}
const initChart3 = () => {
  option3.value = {
    tooltip: {
      trigger: 'axis',
      confine: true,
    },
    grid: {
      top: 50,
      bottom: 30,
      left: 50,
      right: 50,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['2024-12-26', '2024-12-27', '2024-12-28', '2024-12-29', '2024-12-30', '2024-12-31', '2025-01-01', '2025-01-02'],
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999',
        },
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
          color: '#999',
        },
      },
    },
    series: [
      {
        name: '大类排名',
        type: 'line',
        data: [0, 1, 2, 3, 4, 5, 6, 7],
        itemStyle: {
          color: '#52bfff',
        },
        smooth: true,
      },
    ],
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
  if (tab.props.name === 0) {
    fetchColumn()
    queryData()
    activeName.value = 0
  } else if (tab.props.name === 1) {
    fetchAsinColumn()
    queryAsinData()
    activeName.value = 1
  } else {
    fetchPAsinColumn()
    queryPAsinData()
    activeName.value = 2
  }
}
// 运营分类设定可见
const opeClassifyVisible = ref<boolean>(false)

const showOpeClassify = () => {
  opeClassifyVisible.value = true
}
const closeOpeClassify = () => {
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
    switch (item.label) {
      case 'SKU': {
        return flexColumnWidth(list.value, 'SKU-SKU-SKU-SKU-', 'sku')
      }
      case 'ASIN': {
        return flexColumnWidth(list.value, 'ASIN', 'asin')
      }
      case '父体ASIN': {
        return flexColumnWidth(list.value, '父体ASIN', 'parentAsin')
      }
      case '运营分类': {
        return flexColumnWidth(list.value, '运营分类', 'operationTypeList', 60); // 处理运营分类列
      }
      default: {
        return item.minWidth
      }
    }
  } else if (activeName.value === 1) {
    switch (item.label) {
      case 'SKU': {
        return flexColumnWidth(asinList.value, 'SKU', 'sku')
      }
      case 'ASIN': {
        return flexColumnWidth(asinList.value, 'ASIN-ASIN-ASIN-ASI', 'asin')
      }
      case '父体ASIN': {
        return flexColumnWidth(asinList.value, '父体ASIN', 'parentAsin')
      }
      case '运营分类': {
        return flexColumnWidth(asinList.value, '运营分类', 'operationTypeList', 60); // 处理运营分类列
      }
      default: {
        return item.minWidth
      }
    }
  } else {
    if (item.label === 'SKU') {
      return calculateBrColumnWidth(pAsinList.value, (row: any) => row._sku, 100)
    } else if (item.label === '父体ASIN') {
      return flexColumnWidth(pAsinList.value, '父体ASIN-ASIN-ASIN', 'parentAsin')
    } else {
      return item.minWidth
    }
  }
}
const cellClick = (row: any, column: any) => {
  const label = column.label
  switch (label) {
    case '销量趋势(点击看明细)': {
      router.push({
        path: '/storeOperations/productAnalysis',
        query: {
          activeName: 0,
        },
      })

      break
    }
    case '饼图': {
      router.push({
        path: '/storeOperations/productAnalysis',
        query: {
          activeName: 1,
        },
      })

      break
    }
    case '运营备注': {
      showRemark()

      break
    }
    case '季节系数': {
      seasonalVisible.value = true

      break
    }
    case '小类排名': {
      sRankVisible.value = true

      break
    }
    case '大类排名': {
      bRankVisible.value = true

      break
    }
    // No default
  }
}
const handleRouterPush = () => {
  router.push({
    path: '/storeOperations/productAnalysis',
    query: {
      activeName: 2,
    },
  })
}
// 处理列是否隐藏
const handleChecked = async (item: any) => {
  item.checked = !item.checked
  const status = item.checked === true ? 1 : 0
  await hideOrShowOperationColumn({
    userId: item.userId,
    columnId: item.columnId,
    status
  })
}
const handleMove1 = (event: any) => {

  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
}
const handleEnd1 = async () => {
  const req = columns.value.map((item: IGetOperationColumnList, index: number) => {
    return {
      userId: item.userId,
      columnId: item.columnId,
      sort: index,
      // label: item.label
    }
  }) 
  await updateSortOperationColumn(req)
}
const handleEnd2 = async () => {
  const req = columnsAsin.value.map((item: IGetOperationColumnList, index: number) => {
    return {
      userId: item.userId,
      columnId: item.columnId,
      sort: index,
    }
  }) 
  await updateSortOperationColumn(req)
}
const handleEnd3 = async () => {
  const req = columnsParentAsin.value.map((item: IGetOperationColumnList, index: number) => {
    return {
      userId: item.userId,
      columnId: item.columnId,
      sort: index,
    }
  }) 
  await updateSortOperationColumn(req)
}
const handleMove2 = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columnsAsin.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
}
const handleMove3 = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columnsParentAsin.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
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
const queryAsinData = () => {
  asinQueryForm.pageNo = 1
  fetchAsinData()
}
const handleAsinCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchAsinData()
}
const handleAsinSizeChange = (value: number) => {
  queryForm.pageSize = value
  fetchAsinData()
}
const queryPAsinData = () => {
  pAsinQueryForm.pageNo = 1
  fetchPAsinData()
}
const handlePAsinCurrentChange = (value: number) => {
  pAsinQueryForm.pageNo = value
  fetchPAsinData()
}
const handlePAsinSizeChange = (value: number) => {
  pAsinQueryForm.pageSize = value
  fetchPAsinData()
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === 'SKU' || label === 'ASIN' || label === '父体ASIN' || label === '运营备注' || label === '库龄') {
    return {
      textAlign: 'left',
    }
  } else {
    return {
      textAlign: 'center',
    }
  }
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
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
  queryForm.site = siteList.value.map((_) => _.id)
  asinQueryForm.site = siteList.value.map((_) => _.id)
  pAsinQueryForm.site = siteList.value.map((_) => _.id)
}
const fetchOperateUserList = async () => {
  const { data } = await getDistributionOptionUserList()
  operateUserList.value = data
  operateUserList.value.unshift({ id: -1, label: '全部' })
}
// 处理","号分隔的SKU换行以及tooltip展示
function processField(item: any, fieldName: string, max: number) {
  const fieldArray = item[fieldName]?.split(',')
  if (fieldArray && fieldArray.length > max) {
    item[`_${fieldName}`] = [fieldArray[0], fieldArray[1]].join('<br />') // 显示在表格上的处理过的
    item[`_${fieldName}`] += '...'
    item[`overflow_${fieldName}`] = true // 判断tooltip是否显示
    item[`_${fieldName}Full`] = fieldArray.join('\n') // tooltip显示全部内容
  } else {
    item[`overflow_${fieldName}`] = false
    item[`_${fieldName}`] = fieldArray?.join('<br />')!
    item[`_${fieldName}Full`] = item[`_${fieldName}`]
  }
}
const fetchData = async () => {
  listLoading.value = true
  const { site, ...filterQueryForm } = queryForm
  const { data } = await getOperationAmazonSKUList({
    ...filterQueryForm,
    siteIds: site.join(','),
  })
  total.value = data.total
  list.value = data.list
  list.value.forEach((item) => {
    item.displayRating = computed(() => getAmazonStars(item.rating!))
    item.saleTrendList = {
      xAxis: [
        '21-04-1',
        '21-08-1',
        '22-05-1',
        '22-06-1',
        '22-07-1',
        '22-09-1',
        '22-10-1',
        '23-01-1',
        '23-05-1',
        '23-07-1',
        '23-10-1',
        '23-11-1',
      ],
      yAxis: [6611, 53824, 18712, 18991, 21611, 10277, 15420, 9159, 4192, 3064, 5619, 4500],
    }
    item.storageAge = `
      <div class="storage-list">
        ${storageList
          .map(
            (item) => `
          <div class="storage-item">
            <span class="value1">${item.name}</span>
            <span class="value2">${item.fba}</span>
            <span class="value3">${item.fba ? `($${item.price})` : ''}</span>
          </div>
        `
          )
          .join('')}
      </div>
    `
  })
  listLoading.value = false
}
const fetchAsinData = async () => {
  listLoading.value = true
  const { site, ...filterQueryForm } = asinQueryForm
  const { data } = await getOperationAsinList({
    ...filterQueryForm,
    siteIds: site.join(','),
  })
  total.value = data.total
  asinList.value = data.list
  asinList.value.forEach((item) => {
    item.displayRating = computed(() => getAmazonStars(item.rating!))
    item.saleTrendList = {
      xAxis: [
        '21-04-1',
        '21-08-1',
        '22-05-1',
        '22-06-1',
        '22-07-1',
        '22-09-1',
        '22-10-1',
        '23-01-1',
        '23-05-1',
        '23-07-1',
        '23-10-1',
        '23-11-1',
      ],
      yAxis: [6611, 53824, 18712, 18991, 21611, 10277, 15420, 9159, 4192, 3064, 5619, 4500],
    }
    item.storageAge = `
      <div class="storage-list">
        ${storageList
          .map(
            (item) => `
          <div class="storage-item">
            <span class="value1">${item.name}</span>
            <span class="value2">${item.fba}</span>
            <span class="value3">${item.fba ? `($${item.price})` : ''}</span>
          </div>
        `
          )
          .join('')}
      </div>
    `
  })
  listLoading.value = false
}
const fetchPAsinData = async () => {
  listLoading.value = true
  const { site, ...filterQueryForm } = pAsinQueryForm
  const { data } = await getOperationParentAsinList({
    ...filterQueryForm,
    siteIds: site.join(','),
  })
  total.value = data.total
  pAsinList.value = data.list
  pAsinList.value.forEach((item) => {
    processField(item, 'sku', 2)
    item.displayRating = computed(() => getAmazonStars(item.rating!))
    item.saleTrendList = {
      xAxis: [
        '21-04-1',
        '21-08-1',
        '22-05-1',
        '22-06-1',
        '22-07-1',
        '22-09-1',
        '22-10-1',
        '23-01-1',
        '23-05-1',
        '23-07-1',
        '23-10-1',
        '23-11-1',
      ],
      yAxis: [6611, 53824, 18712, 18991, 21611, 10277, 15420, 9159, 4192, 3064, 5619, 4500],
    }
  })
  listLoading.value = false
}
const storageList = [
  { name: '181-270', fba: 10, price: 2.34 },
  { name: '271-360', fba: 216, price: 35.33 },
  { name: '361+', fba: 0 },
]
const fetchColumn = async () => {
  const { data } = await getOperationColumnList({ type: 0 })
  columns.value = data
  columns.value.forEach((item: IGetOperationColumnList) => {
    item.minWidth = item.width;
    if (item.prop !== 'skuImgUrl') {
      delete item.width
    }
    if (item.prop === 'siteName') {
      item.minWidth = '150'
    }
    if (item.prop === 'outletDeal') {
      item.minWidth = '110'
    }
    if (item.prop === 'lowVolumeDelivery') {
      item.minWidth = '130'
    }
    if (item.prop === 'currentAdvertisement') {
      item.minWidth = '100'
    }
    if (item.prop === 'headerCount') {
      item.minWidth = '120'
    }
    if (item.prop === 'differenceFba') {
      item.minWidth = '120'
    }
    if (item.prop === 'monthAdv') {
      item.minWidth = '110'
    }
    if (['skuImgUrl', 'sku', 'asin', 'parentAsin'].includes(item.prop)) {
      item.isFixed = true
    }
  })
}
const fetchAsinColumn = async () => {
  const { data } = await getOperationColumnList({ type: 1 })
  columnsAsin.value = data
  columnsAsin.value.forEach((item: IGetOperationColumnList) => {
    item.minWidth = item.width;
    if (item.prop !== 'asinImgUrl') {
      delete item.width
    }
    if (item.prop === 'siteName') {
      item.minWidth = '150'
    }
    if (item.prop === 'outletDeal') {
      item.minWidth = '110'
    }
    if (item.prop === 'lowVolumeDelivery') {
      item.minWidth = '130'
    }
    if (item.prop === 'currentAdvertisement') {
      item.minWidth = '100'
    }
    if (item.prop === 'headerCount') {
      item.minWidth = '120'
    }
    if (item.prop === 'monthAdv') {
      item.minWidth = '110'
    }
    if (['asinImgUrl', 'sku', 'asin', 'parentAsin'].includes(item.prop)) {
      item.isFixed = true
    }
  })
}
const fetchPAsinColumn = async () => {
  const { data } = await getOperationColumnList({ type: 2 })
  columnsParentAsin.value = data
  columnsParentAsin.value.forEach((item: IGetOperationColumnList) => {
    item.minWidth = item.width;
    if (item.prop !== 'asinImgUrl') {
      delete item.width
    }
    if (item.prop === 'siteName') {
      item.minWidth = '150'
    }
    if (item.prop === 'currentAdvertisement') {
      item.minWidth = '100'
    }
    if (item.prop === 'monthAdv') {
      item.minWidth = '110'
    }
    if (['asinImgUrl', 'sku', 'parentAsin'].includes(item.prop)) {
      item.isFixed = true
    }
  })
}
onBeforeMount(() => {
  fetchSiteList()
  fetchCurrencyList()
  fetchOperateUserList()
  fetchDevelopUserList()
  fetchColumn()
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
                margin: 0 5px 5px 0;
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
      font-weight: 550;
      color: #000;
    }
    .value3 {
      font-weight: 550;
      color: var(--el-color-danger);
    }
  }
}
.handle {
  cursor: grab;
}
.icon-dis {
  padding: 6px;
}
.icon-hover {
  padding: 6px;
  border-radius: 4px; /* 圆角 */
  transition: background-color 0.3s; /* 动画过渡效果 */
}
.icon-hover:hover {
  color: var(--el-color-primary);
  background-color: #f2f2f2; /* 浅灰色背景 */
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
  gap: 20px;
  align-items: center;
  width: 100%;
}
.rate-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;

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
    margin-left: -11px;
    color: #36788c;
  }
}
.custom-tooltip {
  max-width: 400px;
  font-size: var(--el-font-size-base);
  white-space: pre-wrap;
}
.customTag {
  width: 7em;
  padding: 0 30px;
  color: #fff;
  border: 0;
  border-radius: 17px;

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
  margin-left: 3px;
  font-weight: 600;
  color: #ff3f48;
  transform: scale(0.9, 1.4);
}
.arrow-down {
  margin-left: 3px;
  font-weight: 600;
  color: #67c23a;
  transform: scale(0.9, 1.4);
}
.custom-tooltip {
  white-space: pre-wrap; 
  max-width: 400px; 
  font-size: var(--el-font-size-base);
}
</style>
