<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="SKU" :name="0">
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
              <vab-draggable v-model="columns" :animation="600" handle=".handle" filter=".non-draggable" :onMove="handleMove1">
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
          border
          class="noneHoverTable"
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="cellStyle"
          :cell-class-name="clearPadding" 
          :data="fakeData"
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
                <el-image :src="row.componentImage" style="width: 75px; height: 75px; display: block;" fit="fill" @click="imagePreviewShow(row.componentImage)" >
                  <template #error>
                    <el-icon></el-icon>
                  </template>
                </el-image>
              </span>
              <!-- SKU 展示-->
              <span v-if="item.label === 'SKU'">
                {{ row.sku }}
                <div class="rate-wrapper">
                  <span class="rate-value">{{ row.rate }}</span>
                  <span><el-rate v-model="row.rate" :void-icon="Star" disabled class="custom-rate" /></span>
                  <span class="rate-count">{{ 484 }}</span>
                </div>
              </span>
              <span v-if="item.label === 'ASIN'">
                <el-link type="primary">{{ row.asin }}</el-link>
              </span>
              <span v-if="item.label === '父体ASIN'">
                <el-link type="primary">{{ row.pAsin }}</el-link>
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
              <span v-if="label3.includes(item.label)">
                {{ row[label3Map.get(item.label)!] }}天
              </span>
              <span v-if="item.label === 'VOC满意度'">
                <el-tag v-if="row.VOCSatisfaction === 0" class="customTag customTag-veryPoor">
                  Very poor
                </el-tag>
                <el-tag v-if="row.VOCSatisfaction === 1" class="customTag customTag-fair">
                  Fair
                </el-tag>
                <el-tag v-if="row.VOCSatisfaction === 2" class="customTag customTag-poor">
                  Poor
                </el-tag>
                <el-tag v-if="row.VOCSatisfaction === 3" class="customTag customTag-good">
                  Good
                </el-tag>
                <el-tag v-if="row.VOCSatisfaction === 4" class="customTag customTag-excellent">
                  Excellent
                </el-tag>
              </span>
              <span v-if="item.label === '半年有货率'">
                {{ Math.floor(Number(row.monthlyAvailabilityRate)) }}%
              </span>
              <span v-if="item.label === '今广%'">
                {{ Math.floor(Number(row.todayAd)) }}%
              </span>
              <span v-if="item.label === '广告'">
                {{ row.ad === 0 ? '关' : '开' }}
              </span>
              <span v-if="item.label === '运营备注'">
                <el-tooltip content=" " effect="dark" placement="top">
                  <template #content>
                    <div class="custom-tooltip">{{ removeHtmlTags(row.remark) }}</div>
                  </template>
                  <span>{{ removeHtmlTags(row.remark) }}</span>
                </el-tooltip>
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
                <el-link type="primary">{{ row.pAsin }}</el-link>
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
              <span v-if="label3.includes(item.label)">
                {{ row[label3Map.get(item.label)!] }}天
              </span>
              <span v-if="item.label === '半年有货率'">
                {{ Math.floor(Number(row.monthlyAvailabilityRate)) }}%
              </span>
              <span v-if="item.label === '今广%'">
                {{ Math.floor(Number(row.todayAd)) }}%
              </span>
              <span v-if="item.label === '广告'">
                {{ row.ad === 0 ? '关' : '开' }}
              </span>
              <span v-if="item.label === '运营备注'">
                <el-tooltip content=" " effect="dark" placement="top">
                  <template #content>
                    <div class="custom-tooltip">{{ removeHtmlTags(row.remark) }}</div>
                  </template>
                  <span>{{ removeHtmlTags(row.remark) }}</span>
                </el-tooltip>
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
                {{ Math.floor(Number(row.todayAd)) }}%
              </span>
              <span v-if="item.label === '广告'">
                {{ row.ad === 0 ? '关' : '开' }}
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
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'productPerformance',
})
import { Hide, Search, Star, View } from '@element-plus/icons-vue'
import { TabsPaneContext } from 'element-plus'
import { CSSProperties } from 'vue'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { currencySymbols, opeClassOption } from '../constantOption'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'

const activeName = ref<number>(0)
const router = useRouter()
// 运营备注
const remarkVisible = ref<boolean>(false)
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
  monthlyStorageFee: number;
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
    monthlyStorageFee: 100,
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
    monthlyStorageFee: 150,
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
    monthlyStorageFee: 100,
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

const label1 = ['今销', 'FBA仓储费', '当前售价', '亚马逊FBA', 'FBA差异', '月净利润', '月销售额', '月广告销售', '月广告支出', '预计下月仓储费', '盈亏售价', '30毛利售价']
const label2 = ['试算毛利', '2周广告转化', '2周广告点击', '2周总转化', '月净利率', '月广告%', '月ACOS', '月TACOS', '1年ACOS', '1年TACOS', '月退货%', '月退款%', 'VOC缺陷%']
const label3 = ['上新', '库存可售', '可售含在途', '断货']
const label1Map = new Map([
  ['今销', 'totalSellD'],
  ['FBA仓储费', 'monthlyStorageFee'],
  ['当前售价', 'currentPrice'],
  ['亚马逊FBA', 'fbaA'],
  ['FBA差异', 'fbaD'],
  ['月净利润', 'monthlyNetProfit'],
  ['月销售额', 'monthlySales'],
  ['月广告销售', 'monthlyAdSales'],
  ['月广告支出', 'monthlyAdSpend'],
  ['预计下月仓储费', 'estimatedFees'],
  ['盈亏售价', 'profitLossPrice'],
  ['30毛利售价', 'profitPrice'],
])
const label2Map = new Map([
  ['试算毛利', 'trialGrossProfit'],
  ['2周广告转化', 'conversion'],
  ['2周广告点击', 'click'],
  ['2周总转化', 'totalConvert'],
  ['月净利率', 'monthlyNetInterestRate'],
  ['月广告%', 'monthlyAd'],
  ['月ACOS', 'monthlyACOS'],
  ['月TACOS', 'monthlyTACOS'],
  ['1年ACOS', 'yearACOS'],
  ['1年TACOS', 'yearTACOS'],
  ['月退货%', 'monthlyReturns'],
  ['月退款%', 'monthlyRefund'],
  ['VOC缺陷%', 'VOCDefectP'],
])
const label3Map = new Map([
  ['上新', 'newReleases'],
  ['库存可售', 'stockSale'],
  ['可售含在途', 'saleTransit'],
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
    prop: 'componentImage',
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
    prop: 'pAsin',
    disableCheck: true,
    checked: true,
    minWidth: 110,
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
    prop: 'totalSellD',
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
    label: '季节系数',
    prop: 'seasonalCoefficient',
    checked: true,
    minWidth: 100,
  },
  {
    label: '运营分类',
    prop: 'classify',
    checked: true,
    minWidth: 130,
  },
  {
    label: '停产',
    prop: 'ting',
    checked: true,
    minWidth: 60,
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
    label: '头部产品#',
    prop: 'topProduct',
    checked: true,
    minWidth: 100,
  },
  {
    label: '运营备注',
    prop: 'remark',
    checked: true,
    minWidth: 150,
  },
  {
    label: 'FBA仓储费',
    prop: 'monthlyStorageFee',
    checked: true,
    minWidth: 150,
  },
  {
    label: '当前售价',
    prop: 'currentPrice',
    checked: true,
    minWidth: 100,
  },
  {
    label: '试算毛利',
    prop: 'trialGrossProfit',
    checked: true,
    minWidth: 100,
  },
  {
    label: '自量FBA',
    prop: 'fba',
    checked: true,
    minWidth: 100,
  },
  {
    label: '亚马逊FBA',
    prop: 'fbaA',
    checked: true,
    minWidth: 110,
  },
  {
    label: 'FBA差异',
    prop: 'fbaD',
    checked: true,
    minWidth: 100,
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
    label: 'VOC满意度',
    prop: 'VOCSatisfaction',
    checked: true,
    minWidth: 130,
  },
  {
    label: 'VOC缺陷%',
    prop: 'VOCDefectP',
    checked: true,
    minWidth: 110,
  },
  {
    label: 'VOC缺陷#',
    prop: 'VOCDefect',
    checked: true,
    minWidth: 110,
  },
  {
    label: 'VOC总订单',
    prop: 'VOCOrder',
    checked: true,
    minWidth: 110,
  },
  {
    label: '上新',
    prop: 'newReleases',
    checked: true,
    minWidth: 90,
  },
  {
    label: '库龄',
    prop: 'storageAge',
    checked: true,
    minWidth: 90,
  },
  {
    label: '剩余库存',
    prop: 'remainingStock',
    checked: true,
    minWidth: 100,
  },
  {
    label: '接收中',
    prop: 'receiving',
    checked: true,
    minWidth: 90,
  },
  {
    label: '最近入库',
    prop: 'recentlyStorage',
    checked: true,
    minWidth: 100,
  },
  {
    label: '总入库',
    prop: 'totalStorage',
    checked: true,
    minWidth: 90,
  },
  {
    label: '库存可售',
    prop: 'stockSale',
    checked: true,
    minWidth: 100,
  },
  {
    label: '可售含在途',
    prop: 'saleTransit',
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
    prop: 'order',
    checked: true,
    minWidth: 90,
  },
  {
    label: '计划#',
    prop: 'order',
    checked: true,
    minWidth: 90,
  },
  {
    label: '签收',
    prop: 'sign',
    checked: true,
    minWidth: 90,
  },
  {
    label: '半年有货率',
    prop: 'monthlyAvailabilityRate',
    checked: true,
    minWidth: 110,
  },
  {
    label: '低量仓储费天数',
    prop: 'lowFeeDays',
    checked: true,
    minWidth: 140,
  },
  {
    label: '预估下月仓储费',
    prop: 'estimatedFees',
    checked: true,
    minWidth: 140,
  },
  {
    label: '盈亏售价',
    prop: 'profitLossPrice',
    checked: true,
    minWidth: 100,
  },
  {
    label: '30毛利售价',
    prop: 'profitPrice',
    checked: true,
    minWidth: 110,
  },
  {
    label: '操作建议',
    prop: 'suggestions',
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
    prop: 'pAsin',
    disableCheck: true,
    checked: true,
    minWidth: 110,
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
    minWidth: 120,
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
    label: '季节系数',
    prop: 'seasonalCoefficient',
    checked: true,
    minWidth: 100,
  },
  {
    label: '运营分类',
    prop: 'classify',
    checked: true,
    minWidth: 130,
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
    label: '头部产品#',
    prop: 'topProduct',
    checked: true,
    minWidth: 100,
  },
  {
    label: '运营备注',
    prop: 'remark',
    checked: true,
    minWidth: 150,
  },
  {
    label: 'FBA仓储费',
    prop: 'monthlyStorageFee',
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
    label: '上新',
    prop: 'newReleases',
    checked: true,
    minWidth: 90,
  },
  {
    label: '库龄',
    prop: 'storageAge',
    checked: true,
    minWidth: 90,
  },
  {
    label: '剩余库存',
    prop: 'remainingStock',
    checked: true,
    minWidth: 100,
  },
  {
    label: '接收中',
    prop: 'receiving',
    checked: true,
    minWidth: 90,
  },
  {
    label: '最近入库',
    prop: 'recentlyStorage',
    checked: true,
    minWidth: 100,
  },
  {
    label: '总入库',
    prop: 'totalStorage',
    checked: true,
    minWidth: 90,
  },
  {
    label: '库存可售',
    prop: 'stockSale',
    checked: true,
    minWidth: 100,
  },
  {
    label: '可售含在途',
    prop: 'saleTransit',
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
    prop: 'order',
    checked: true,
    minWidth: 90,
  },
  {
    label: '计划#',
    prop: 'order',
    checked: true,
    minWidth: 90,
  },
  {
    label: '签收',
    prop: 'sign',
    checked: true,
    minWidth: 90,
  },
  {
    label: '半年有货率',
    prop: 'monthlyAvailabilityRate',
    checked: true,
    minWidth: 110,
  },
  {
    label: '预估下月仓储费',
    prop: 'estimatedFees',
    checked: true,
    minWidth: 140,
  },
  {
    label: '操作建议',
    prop: 'suggestions',
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
    minWidth: 120,
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
    prop: 'monthlyStorageFee',
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
      return flexColumnWidth(fakeData.value, 'SKU-SKU-SKU-SKU-', 'sku')
    } else if (item.label === 'ASIN') {
      return flexColumnWidth(fakeData.value, 'ASIN', 'asin')
    } else if (item.label === '父体ASIN') {
      return flexColumnWidth(fakeData.value, '父体ASIN', 'pAsin')
    } else {
      return item.minWidth
    }
  } else if (activeName.value === 1) {
    if (item.label === 'SKU') {
      return flexColumnWidth(fakeData.value, 'SKU', 'sku')
    } else if (item.label === 'ASIN') {
      return flexColumnWidth(fakeData.value, 'ASIN-ASIN-ASIN-ASI', 'asin')
    } else if (item.label === '父体ASIN') {
      return flexColumnWidth(fakeData.value, '父体ASIN', 'pAsin')
    } else {
      return item.minWidth
    }
  } else {
    if (item.label === 'SKU') {
      return flexColumnWidth(fakeData.value, 'SKU', 'sku')
    } else if (item.label === '父体ASIN') {
      return flexColumnWidth(fakeData.value, '父体ASIN-ASIN-ASIN', 'pAsin')
    } else {
      return item.minWidth
    }
  }
}
const cellClick = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  if (column.label === '销量趋势(点击看明细)') {
    router.push({
      path: '/storeOperations/productAnalysis',
    })
  } else if (column.label === '运营备注') {
    showRemark()
  }
}
const handleChecked = (item: any) => {
  item.checked = !item.checked
}
const handleMove1 = (event: any) => {
  const { related  } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns.value[targetIndex]?.disableCheck) {
    return false; // 禁止移动到目标
  }

  return true; // 允许其他操作
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

const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  // fetchData()
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === 'SKU' || label === 'ASIN' || label === '父体ASIN' || label === '运营备注') {
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
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}

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
</style>