<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="SKU" :name="0">
        <el-skeleton animated :loading="listLoading">
          <template #template>
            <!-- 骨架屏模板 -->
            <div style="display: flex; flex-direction: column; height: calc(100vh - 210px);">
              <!-- 头部骨架 -->
              <div style="padding: 15px 10px 0">
                <el-skeleton-item style="width: 100%; height: 32px" variant="text" />
              </div>

              <!-- 表格骨架 -->
              <div style=" display: flex;flex: 1; flex-direction: column; padding: 15px 10px">
                <el-skeleton-item style="flex: 1; min-height: 300px" variant="p" />
                
                <!-- 分页骨架 -->
                <div style="display: flex; justify-content: center; margin-top: 20px">
                  <el-skeleton-item style="width: 100%; height: 32px" variant="text" />
                </div>
              </div>
            </div>
          </template>
    
          <!-- 实际内容 -->
          <template #default>
            <vab-query-form >
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
                      placeholder="全部站点"
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
                    <el-select v-model="currencySKU" clearable placeholder="请选择币种" @change="changeCurrencySKU">
                      <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="运营">
                    <el-select v-model="queryForm.operationUserId" :disabled="disabledOpe" placeholder="请选择运营人员" style="width: 5em" @change="queryData">
                      <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="开发人">
                    <el-select v-model="queryForm.developUserId" :disabled="disabledDev" placeholder="请选择开发人" style="width: 5em" @change="queryData">
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
              :header-cell-class-name="headerCell"
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
                :sortable="item.sortable"
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
                  <span v-if="item.prop === 'outletDeal'">
                    可报
                    <br />
                    Outlet Deal
                  </span>
                  <span v-if="item.label === '今销'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">今销 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip">今日销售额</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '今广%'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">今广% <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip">今日广告销售占比</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '头部产品#'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">头部产品# <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >大于60：头部垄断较小<br />30 - 60：头部垄断中等<br />小于30：头部垄断严重</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === 'FBA差异'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">FBA差异 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >=亚马逊FBA - 自量FBA</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月广告%'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月广告% <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >月广告销售占比</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月销售额'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月销售额 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的销售额</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月净利润'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月净利润 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的净利润</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月净利率'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月净利率 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的净利润率</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月退款%'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月退款% <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的退款占比</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月退货%'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月退货% <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的退货占比</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月广告销售'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月广告销售 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的广告销售</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月广告支出'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月广告支出 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的广告支出</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月ACOS'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月ACOS <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的ACOS</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月TACOS'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月TACOS <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的TACOS</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '1年ACOS'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">1年ACOS <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去360天的ACOS</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '1年TACOS'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">1年TACOS <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去360天的TACOS</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === 'FBA仓储费'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">FBA仓储费 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的FBA仓储费</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '可售含在途'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">可售<br />含在途 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >含在途数量的可售天数+断货天数</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '自量FBA'">
                    自量FBA
                    <br />
                    亚马逊FBA
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
                    <el-link :href="row.amazonUrl" style="margin-right: 3px" target="_blank">{{ row.sku }}</el-link>
                    <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)" >
                      <vab-icon icon="file-copy-2-fill" />
                    </span>
                    <div class="rate-wrapper">
                      <span class="rate-value">{{ row.rating !== 0 && row.rating != null ? row.rating.toFixed(1) : 0 }}</span>
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
                      <vab-echarts-chart-bar :x-axis-data="xAxis" :y-axis-data="row.saleVolumeList" />
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
                  <span v-if="item.label === '自量FBA'">
                    {{ (row.currencyIcon + (row.selfAssessmentFba ?? '')) }} <br /> {{ (row.currencyIcon + (row.amazonFba ?? '')) }}
                  </span>
                  <span v-if="label1.includes(item.label)">
                    {{ row[label1Map.get(item.label) as string] ? row.currencyIcon + row[label1Map.get(item.label) as string] : '' }}
                  </span>
                  <span v-if="label2.includes(item.label)">
                    {{ formatPercentage(row[label2Map.get(item.label) as string], 2) }}
                  </span>
                  <span v-if="label3.includes(item.label)">
                    <!-- 处理 天 -->
                    {{ row[label3Map.get(item.label)!] != null ? row[label3Map.get(item.label)!] + '天' : '' }}
                  </span>
                  <span v-if="label4.includes(item.label)">
                    {{ formatPercentage(row[label4Map.get(item.label) as string], 0) }}
                  </span>
                  <span v-if="item.label === 'VOC满意度'">
                    {{ row.vocNcxCount }} / {{ row.vocTotalOrderCount }}
                    <el-tag v-if="row.vocSatisfaction === '极差'" class="customTag customTag-veryPoor">极差 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
                    <el-tag v-if="row.vocSatisfaction === '一般'" class="customTag customTag-fair">一般 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
                    <el-tag v-if="row.vocSatisfaction === '不合格'" class="customTag customTag-poor">不合格 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
                    <el-tag v-if="row.vocSatisfaction === '良好'" class="customTag customTag-good">良好 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
                    <el-tag v-if="row.vocSatisfaction === '极好'" class="customTag customTag-excellent">极好 {{ formatPercentage(row.vocDefect, 2) }}</el-tag>
                  </span>
                  <span v-if="item.label === '状态'">
                    <el-tag v-if="row.status === 0" type="danger">停售</el-tag>
                    <el-tag v-if="row.status === 1" type="success">正常</el-tag>
                    <el-tag v-if="row.status === -1" type="info">领星未同步</el-tag>
                    <el-tag v-if="row.status === 2" type="warning">链接不完整</el-tag>
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
                      <el-text style="vertical-align: middle;" truncated>{{ removeHtmlTags(row.operationRemark) }}</el-text>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '饼图'">
                    <div style="width: 100%; height: 60px">
                      <vab-echarts-chart-pie :data="row.pieList" />
                    </div>
                  </span>
                  <span v-if="item.label === '季节系数'">
                    <div style="width: 100%; height: 50px">
                      <vab-table-chart-line :x-axis-data="seasonalXData" :y-axis-data="row.seasonalCoefficient?.actualList || []" />
                    </div>
                  </span>
                  <span v-if="item.label === '当前售价'">
                    <el-link type="primary" @click="handleRouterPush(row)">{{ row.currencyIcon + row.sellingPrice }}</el-link>
                  </span>
                  <span v-if="item.label === '小类排名'">
                    <div v-if="row.nowSubcategoryRanking !== null && row.beforeSubcategoryRanking !== null && row.nowSubcategoryRanking - row.beforeSubcategoryRanking !== 0">
                      <div>{{ row.nowSubcategoryRanking }}</div>
                      <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking < 0" class="arrow-up" icon="arrow-up-fill" />
                      <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking > 0" class="arrow-down" icon="arrow-down-fill" />
                      <span style="color: #999">{{ Math.abs(row.nowSubcategoryRanking - row.beforeSubcategoryRanking) }}</span>
                    </div>
                    <div v-if="row.nowSubcategoryRanking !== null && row.beforeSubcategoryRanking !== null && row.nowSubcategoryRanking - row.beforeSubcategoryRanking === 0">
                      <el-space>
                        {{ row.nowSubcategoryRanking }}
                        <span style="font-weight: 600;">-</span>
                      </el-space>
                    </div>
                  </span>
                  <span v-if="item.label === '大类排名'">
                    <div v-if="row.nowMajorCategoryRanking !== null && row.beforeMajorCategoryRanking !== null && row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking !== 0">
                      <div>{{ row.nowMajorCategoryRanking }}</div>
                      <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking < 0" class="arrow-up" icon="arrow-up-fill" />
                      <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking > 0" class="arrow-down" icon="arrow-down-fill"/>
                      <span style="color: #999">{{ Math.abs(row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking) }}</span>
                    </div>
                    <div v-if="row.nowMajorCategoryRanking !== null && row.beforeMajorCategoryRanking !== null && row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking === 0">
                      <el-space>
                        {{ row.nowMajorCategoryRanking }}
                        <span style="font-weight: 600;">-</span>
                      </el-space>
                    </div>
                  </span>
                  <span v-if="item.label === '剩余库存'">{{ row.availableInventory }}/{{ row.fbaCount }}</span>
                  <span v-if="item.label === '库龄'">
                    <span v-html="row.storageAge"></span>
                  </span>
                  <span v-if="item.label === '订货#'">
                    {{ row.orderCount }}<br><span style="font-weight: bold;">{{ row.orderTotalNumber }}</span>
                  </span>
                  <span v-if="item.label === '开发人员'">
                    <el-tooltip content=" " :disabled="!row.overflow_developName" effect="dark" placement="top">
                      <template #content>
                        <div class="custom-tooltip">{{ row._developNameFull }}</div>
                      </template>
                      <span v-html="row._developName"></span>
                    </el-tooltip>
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
          </template>
        </el-skeleton>
      </el-tab-pane>
      <el-tab-pane label="ASIN" :name="1">
        <el-skeleton animated :loading="listLoading">
          <template #template>
            <!-- 骨架屏模板 -->
            <div style="display: flex; flex-direction: column; height: calc(100vh - 210px);">
              <!-- 头部骨架 -->
              <div style="padding: 15px 10px 0">
                <el-skeleton-item style="width: 100%; height: 32px" variant="text" />
              </div>

              <!-- 表格骨架 -->
              <div style=" display: flex;flex: 1; flex-direction: column; padding: 15px 10px">
                <el-skeleton-item style="flex: 1; min-height: 300px" variant="p" />
                
                <!-- 分页骨架 -->
                <div style="display: flex; justify-content: center; margin-top: 20px">
                  <el-skeleton-item style="width: 100%; height: 32px" variant="text" />
                </div>
              </div>
            </div>
          </template>
    
          <!-- 实际内容 -->
          <template #default>
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
                      placeholder="全部站点"
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
                    <el-select v-model="currencyAsin" clearable placeholder="请选择币种" @change="changeCurrencyASIN">
                      <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="运营">
                    <el-select v-model="asinQueryForm.operationUserId" :disabled="disabledOpe" placeholder="请选择运营人员" style="width: 5em" @change="queryAsinData">
                      <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="开发人">
                    <el-select v-model="asinQueryForm.developUserId" :disabled="disabledDev" placeholder="请选择开发人" style="width: 5em" @change="queryAsinData">
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
                <el-form inline :model="asinQueryForm">
                  <el-form-item>
                    <el-input
                      v-model.trim="asinQueryForm.keyWord"
                      clearable
                      placeholder="请输入搜索关键词"
                      @input="queryAsinData"
                      @keyup.enter="queryAsinData"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryAsinData" />
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
              :header-cell-class-name="headerCell"
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
                :sortable="item.sortable"
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
                  <span v-if="item.prop === 'outletDeal'">
                    可报
                    <br />
                    Outlet Deal
                  </span>
                  <span v-if="item.label === '今销'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">今销 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip">今日销售额</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '今广%'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">今广% <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip">今日广告销售占比</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '头部产品#'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">头部产品# <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >大于60：头部垄断较小<br />30 - 60：头部垄断中等<br />小于30：头部垄断严重</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月广告%'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月广告% <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >月广告销售占比</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月销售额'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月销售额 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的销售额</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月净利润'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月净利润 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的净利润</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月净利率'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月净利率 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的净利润率</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月退款%'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月退款% <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的退款占比</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月退货%'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月退货% <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的退货占比</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月广告销售'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月广告销售 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的广告销售</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月广告支出'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月广告支出 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的广告支出</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月ACOS'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月ACOS <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的ACOS</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月TACOS'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月TACOS <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的TACOS</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '1年ACOS'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">1年ACOS <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去360天的ACOS</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '1年TACOS'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">1年TACOS <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去360天的TACOS</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === 'FBA仓储费'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">FBA仓储费 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的FBA仓储费</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '可售含在途'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">可售<br />含在途 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >含在途数量的可售天数+断货天数</div>
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
                      <span class="rate-value">{{ row.rating !== 0 && row.rating != null ? row.rating.toFixed(1) : 0 }}</span>
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
                  <span v-if="item.label === '父体ASIN'">
                    <el-link type="primary">{{ row.parentAsin }}</el-link>
                  </span>

                  <span v-if="item.label === '销量趋势(点击看明细)'">
                    <div class="custom-bar">
                      <vab-echarts-chart-bar :x-axis-data="xAxis" :y-axis-data="row.saleVolumeList" />
                    </div>
                  </span>
                  <span v-if="item.label === '运营分类'">
                    <el-select v-model="row.operationTypeId" style="min-width: 100%" @change="handleUpdateAsinOpeType(row)">
                      <el-option v-for="select in row.operationTypeList" :key="select.id" :label="select.label" :value="select.id" />
                    </el-select>
                  </span>
                  <span v-if="label1.includes(item.label)">
                    {{ row[label1Map.get(item.label) as string] ? row.currencyIcon + row[label1Map.get(item.label) as string] : '' }}
                  </span>
                  <span v-if="label2.includes(item.label)">
                    {{ formatPercentage(row[label2Map.get(item.label) as string], 2) }}
                  </span>
                  <span v-if="label3.includes(item.label)">
                    <!-- 处理 天 -->
                    {{ row[label3Map.get(item.label)!] != null ? row[label3Map.get(item.label)!] + '天' : '' }}
                  </span>
                  <span v-if="label4.includes(item.label)">
                    {{ formatPercentage(row[label4Map.get(item.label) as string], 0) }}
                  </span>
                  <span v-if="item.label === '广告'">
                    <el-tag v-if="row.advertisementStatus === 0" type="danger">关</el-tag>
                    <el-tag v-if="row.advertisementStatus === 1" type="success">开</el-tag>
                  </span>
                  <span v-if="item.label === '状态'">
                    <el-tag v-if="row.status === 0" type="danger">停售</el-tag>
                    <el-tag v-if="row.status === 1" type="success">正常</el-tag>
                    <el-tag v-if="row.status === -1" type="info">领星未同步</el-tag>
                    <el-tag v-if="row.status === 2" type="warning">链接不完整</el-tag>
                  </span>
                  <span v-if="item.label === '运营备注'">
                    <el-tooltip content=" " effect="dark" placement="top">
                      <template #content>
                        <div class="custom-tooltip">{{ removeHtmlTags(row.operationRemark) }}</div>
                      </template>
                      <el-text style="vertical-align: middle;" truncated>{{ removeHtmlTags(row.operationRemark) }}</el-text>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '饼图'">
                    <div style="width: 100%; height: 60px">
                      <vab-echarts-chart-pie :data="row?.pieList" />
                    </div>
                  </span>
                  <span v-if="item.label === '季节系数'">
                    <div style="width: 100%; height: 50px">
                      <vab-table-chart-line :x-axis-data="seasonalXData" :y-axis-data="row.seasonalCoefficient?.actualList || []" />
                    </div>
                  </span>
                  <span v-if="item.label === '小类排名'">
                    <div v-if="row.nowSubcategoryRanking !== null && row.beforeSubcategoryRanking !== null && row.nowSubcategoryRanking - row.beforeSubcategoryRanking !== 0">
                      <div>{{ row.nowSubcategoryRanking }}</div>
                      <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking < 0" class="arrow-up" icon="arrow-up-fill" />
                      <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking > 0" class="arrow-down" icon="arrow-down-fill" />
                      <span style="color: #999">{{ Math.abs(row.nowSubcategoryRanking - row.beforeSubcategoryRanking) }}</span>
                    </div>
                    <div v-if="row.nowSubcategoryRanking !== null && row.beforeSubcategoryRanking !== null && row.nowSubcategoryRanking - row.beforeSubcategoryRanking === 0">
                      <el-space>
                        {{ row.nowSubcategoryRanking }}
                        <span style="font-weight: 600;">-</span>
                      </el-space>
                    </div>
                  </span>
                  <span v-if="item.label === '大类排名'">
                    <div v-if="row.nowMajorCategoryRanking !== null && row.beforeMajorCategoryRanking !== null && row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking !== 0">
                      <div>{{ row.nowMajorCategoryRanking }}</div>
                      <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking < 0" class="arrow-up" icon="arrow-up-fill" />
                      <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking > 0" class="arrow-down" icon="arrow-down-fill"/>
                      <span style="color: #999">{{ Math.abs(row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking) }}</span>
                    </div>
                    <div v-if="row.nowMajorCategoryRanking !== null && row.beforeMajorCategoryRanking !== null && row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking === 0">
                      <el-space>
                        {{ row.nowMajorCategoryRanking }}
                        <span style="font-weight: 600;">-</span>
                      </el-space>
                    </div>
                  </span>
                  <span v-if="item.label === '剩余库存'">{{ row.availableInventory }}/{{ row.fbaCount }}</span>
                  <span v-if="item.label === '库龄'">
                    <span v-html="row.storageAge"></span>
                  </span>
                  <span v-if="item.label === '订货#'">
                    {{ row.orderCount }}<br><span style="font-weight: bold;">{{ row.orderTotalNumber }}</span>
                  </span>
                  <span v-if="item.label === '开发人员'">
                    <el-tooltip content=" " :disabled="!row.overflow_developName" effect="dark" placement="top">
                      <template #content>
                        <div class="custom-tooltip">{{ row._developNameFull }}</div>
                      </template>
                      <span v-html="row._developName"></span>
                    </el-tooltip>
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
          </template>
        </el-skeleton>
      </el-tab-pane>
      <el-tab-pane label="父体ASIN" :name="2">
        <el-skeleton animated :loading="listLoading">
          <template #template>
            <!-- 骨架屏模板 -->
            <div style="display: flex; flex-direction: column; height: calc(100vh - 210px);">
              <!-- 头部骨架 -->
              <div style="padding: 15px 10px 0">
                <el-skeleton-item style="width: 100%; height: 32px" variant="text" />
              </div>

              <!-- 表格骨架 -->
              <div style=" display: flex;flex: 1; flex-direction: column; padding: 15px 10px">
                <el-skeleton-item style="flex: 1; min-height: 300px" variant="p" />
                
                <!-- 分页骨架 -->
                <div style="display: flex; justify-content: center; margin-top: 20px">
                  <el-skeleton-item style="width: 100%; height: 32px" variant="text" />
                </div>
              </div>
            </div>
          </template>
          <template #default>
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
                      placeholder="全部站点"
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
                    <el-select v-model="currencyPAsin" clearable placeholder="请选择币种" @change="changeCurrencyPASIN">
                      <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="运营">
                    <el-select
                      v-model="pAsinQueryForm.operationUserId"
                       :disabled="disabledOpe"
                      placeholder="请选择运营人员"
                      style="width: 5em"
                      @change="queryPAsinData"
                    >
                      <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="开发人">
                    <el-select v-model="pAsinQueryForm.developUserId" :disabled="disabledDev" placeholder="请选择开发人" style="width: 5em" @change="queryPAsinData">
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
                <el-form inline :model="pAsinQueryForm">
                  <el-form-item>
                    <el-input
                      v-model.trim="pAsinQueryForm.keyWord"
                      clearable
                      placeholder="请输入搜索关键词"
                      @input="queryPAsinData"
                      @keyup.enter="queryPAsinData"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryPAsinData" />
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
              :header-cell-class-name="headerCell"
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
                :sortable="item.sortable"
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
                  <span v-if="item.label === '今销'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">今销 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip">今日销售额</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '今广%'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">今广% <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip">今日广告销售占比</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月广告%'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月广告% <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >月广告销售占比</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月销售额'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月销售额 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的销售额</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月净利润'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月净利润 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的净利润</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月净利率'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月净利率 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的净利润率</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月退款%'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月退款% <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的退款占比</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月退货%'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月退货% <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的退货占比</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月广告销售'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月广告销售 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的广告销售</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月广告支出'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月广告支出 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的广告支出</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月ACOS'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月ACOS <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的ACOS</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '月TACOS'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">月TACOS <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的TACOS</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '1年ACOS'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">1年ACOS <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去360天的ACOS</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '1年TACOS'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">1年TACOS <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去360天的TACOS</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === 'FBA仓储费'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">FBA仓储费 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >过去30天的FBA仓储费</div>
                      </template>
                    </el-tooltip>
                  </span>
                  <span v-if="item.label === '可售含在途'">
                    <el-tooltip content="" effect="dark" placement="top">
                      <div class="questionIcon">可售<br />含在途 <el-icon><question-filled /></el-icon> </div>
                      <template #content>
                        <div class="custom-tooltip" >含在途数量的可售天数+断货天数</div>
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
                      <span class="rate-value">{{ row.rating !== 0 && row.rating != null ? row.rating.toFixed(1) : 0 }}</span>
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
                      <vab-echarts-chart-bar :x-axis-data="xAxis" :y-axis-data="row.saleVolumeList" />
                    </div>
                  </span>
                  <span v-if="label1.includes(item.label)">
                    {{ row[label1Map.get(item.label) as string] ? row.currencyIcon + row[label1Map.get(item.label) as string] : '' }}
                  </span>
                  <span v-if="label2.includes(item.label)">
                    {{ formatPercentage(row[label2Map.get(item.label) as string], 2) }}
                  </span>
                  <span v-if="label4.includes(item.label)">
                    {{ formatPercentage(row[label4Map.get(item.label) as string], 0) }}
                  </span>
                  <span v-if="item.label === '广告'">
                    <el-tag v-if="row.advertisementStatus === 0" type="danger">关</el-tag>
                    <el-tag v-if="row.advertisementStatus === 1" type="success">开</el-tag>
                  </span>
                  <span v-if="item.label === '状态'">
                    <el-tag v-if="row.status === 0" type="danger">停售</el-tag>
                    <el-tag v-if="row.status === 1" type="success">正常</el-tag>
                    <el-tag v-if="row.status === -1" type="info">领星未同步</el-tag>
                    <el-tag v-if="row.status === 2" type="warning">链接不完整</el-tag>
                  </span>
                  <span v-if="item.label === '饼图'">
                    <div style="width: 100%; height: 60px">
                      <vab-echarts-chart-pie :data="row?.pieList || []" />
                    </div>
                  </span>
                  <span v-if="item.label === '小类排名'">
                    <div v-if="row.nowSubcategoryRanking !== null && row.beforeSubcategoryRanking !== null && row.nowSubcategoryRanking - row.beforeSubcategoryRanking !== 0">
                      <div>{{ row.nowSubcategoryRanking }}</div>
                      <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking < 0" class="arrow-up" icon="arrow-up-fill" />
                      <vab-icon v-if="row.nowSubcategoryRanking - row.beforeSubcategoryRanking > 0" class="arrow-down" icon="arrow-down-fill" />
                      <span style="color: #999">{{ Math.abs(row.nowSubcategoryRanking - row.beforeSubcategoryRanking) }}</span>
                    </div>
                    <div v-if="row.nowSubcategoryRanking !== null && row.beforeSubcategoryRanking !== null && row.nowSubcategoryRanking - row.beforeSubcategoryRanking === 0">
                      <el-space>
                        {{ row.nowSubcategoryRanking }}
                        <span style="font-weight: 600;">-</span>
                      </el-space>
                    </div>
                  </span>
                  <span v-if="item.label === '大类排名'">
                    <div v-if="row.nowMajorCategoryRanking !== null && row.beforeMajorCategoryRanking !== null && row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking !== 0">
                      <div>{{ row.nowMajorCategoryRanking }}</div>
                      <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking < 0" class="arrow-up" icon="arrow-up-fill" />
                      <vab-icon v-if="row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking > 0" class="arrow-down" icon="arrow-down-fill"/>
                      <span style="color: #999">{{ Math.abs(row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking) }}</span>
                    </div>
                    <div v-if="row.nowMajorCategoryRanking !== null && row.beforeMajorCategoryRanking !== null && row.nowMajorCategoryRanking - row.beforeMajorCategoryRanking === 0">
                      <el-space>
                        {{ row.nowMajorCategoryRanking }}
                        <span style="font-weight: 600;">-</span>
                      </el-space>
                    </div>
                  </span>
                  <span v-if="item.label === '开发人员'">
                    <el-tooltip content=" " :disabled="!row.overflow_developName" effect="dark" placement="top">
                      <template #content>
                        <div class="custom-tooltip">{{ row._developNameFull }}</div>
                      </template>
                      <span v-html="row._developName"></span>
                    </el-tooltip>
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
          </template>
        </el-skeleton>
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
      <el-input v-model="remark" placeholder="请输入运营备注" :rows="15" type="textarea" />
      <template #footer>
        <el-button @click="remarkVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdateRemark">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 季节系数 -->
    <vab-dialog v-model="seasonalVisible" title="季节系数" width="40%" @open="handleSeasonalOpened">
      <div ref="chartContainer1" style="width: 100%; height: 400px"></div>
      <template #footer></template>
    </vab-dialog>
    <!-- 小类排名/大类排名 -->
    <vab-dialog v-model="rankVisible" :title="title" width="40%" @open="handleRankOpened">
      <div style="text-align: center">
        <el-date-picker 
          v-model="rankDate"
          :clearable="false"
          :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]"
          :disabled-date="(time: Date) => time.getTime() > Date.now()"
          :editable="false"
          end-placeholder="结束日期"
          :shortcuts="shortcuts"
          start-placeholder="开始日期"
          type="daterange"
          @change="handleRankChange"
        />
      </div>
      <div ref="chartContainer2" v-loading="chartLoading" style="width: 100%; height: 400px"></div>
      <template #footer></template>
    </vab-dialog>
    <!-- VOC满意度 -->
    <vab-dialog v-model="vocVisible" title="VOC满意度" width="40%" @open="handleVocOpened">
      <div style="text-align: center">
        <el-date-picker 
          v-model="rankDate"
          :clearable="false"
          :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]"
          :disabled-date="(time: Date) => time.getTime() > Date.now()"
          :editable="false"
          end-placeholder="结束日期"
          :shortcuts="shortcuts"
          start-placeholder="开始日期"
          type="daterange"
          @change="fetchSkuVocData"
        />
      </div>
      <div ref="chartContainer3" v-loading="chartLoading" style="width: 100%; height: 400px"></div>
      <template #footer></template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { QuestionFilled, Search, Star } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import type { CheckboxValueType, TabsPaneContext } from 'element-plus'
import type { CSSProperties } from 'vue'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { useRoute } from 'vue-router'
import { months } from '../constantOption'
import { getDistributionOptionUserList, getDistributionSiteList } from '/@/api/devlocal/productDistribution'
import {
filterAmazonSKUList,
filterOperationAmazonAsinList,
getCurrencyASINAmazonOperation,
getCurrencyList,
getCurrencyParentASINAmazonOperation,
getCurrencySKUAmazonOperation,
getDevelopUserList,
getOperationAmazonAsinRankCateList,
getOperationAmazonAsinRankList,
getOperationAmazonParentAsinRankCateList,
getOperationAmazonParentAsinRankList,
getOperationAmazonSKUList,
getOperationAmazonSkuRankCateList,
getOperationAmazonSkuRankList,
getOperationAmazonSkuVocList,
getOperationAsinList,
getOperationColumnList,
getOperationParentAsinList,
getUserAmazonOperation,
hideOrShowOperationColumn,
updateCurrencyASINAmazonOperation,
updateCurrencyParentASINAmazonOperation,
updateCurrencySKUAmazonOperation,
updateOperationASINOperateTypeList,
updateOperationSKUDisContinuedStatus,
updateOperationSKUOperateTypeList,
updateRemarkAmazonOperation,
updateSortOperationColumn
} from '/@/api/devlocal/productPerformance'
import { useAclStore } from '/@/store/modules/acl'
import { useTabStateStore } from '/@/store/modules/tabsState'
import type {
IGetOperationAmazonSKUList,
IGetOperationAsinList,
IGetOperationColumnList,
IGetOperationParentAsinList,
IOperationAmazonSkuRankList,
IOperationAmazonSkuVocList
} from '/@/type/storeOperation/productPerformanceType'
import handleClipboard from '/@/utils/clipboard'
import { formatPercentage, getAmazonStars, handleImgUrl } from '/@/utils/rate'
import { _addData } from '/@/utils/skuOptions'
import { calculateBrColumnWidth, flexColumnWidth, processField, removeHtmlTags } from '/@/utils/tableColum'

defineOptions({
  name: 'ProductPerformance',
})

const vocVisible = ref<boolean>(false)
const vocValue = ref<IOperationAmazonSkuVocList[]>([])
const title = ref<string>('')
const rankVisible = ref<boolean>(false)
const rankDate = ref<[Date, Date]>([
  new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30天前
  new Date() // 今天
])
const shortcuts = [
  {
    text: '近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 29)
      return [start, end]
    },
  },
  {
    text: '近60天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 59)
      return [start, end]
    },
  },
  {
    text: '近90天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 89)
      return [start, end]
    },
  },
  {
    text: '近半年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 6)
      return [start, end]
    },
  },
  {
    text: '近1年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setFullYear(start.getFullYear() - 1)
      return [start, end]
    },
  },
  {
    text: '全部',
    value: () => {
      const end = new Date()
      const start = new Date('2024-12-20') // 设置一个较早的起始日期
      return [start, end]
    },
  },
]
const route = useRoute()
const tabStateStore = useTabStateStore()
const activeName = ref<number>(tabStateStore.getTabState(route.path, 0))
const seasonalVisible = ref<boolean>(false)

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
const xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
const router = useRouter()
// 运营备注
const remarkVisible = ref<boolean>(false)
const remark = ref<string>('')
const _row = ref<any>(null)
interface optionType {
  id: number
  label: string
}
const currencyList = ref<optionType[]>([])
const currencySKU = ref<number | undefined>(0)
const currencyAsin = ref<number | undefined>(0)
const currencyPAsin = ref<number | undefined>(0)
const developUserList = ref<optionType[]>([])
const siteList = ref<optionType[]>([])
const operateUserList = ref<optionType[]>([])
const checkAll = ref<boolean>(false)
const indeterminate = ref<boolean>(false)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  site: [],
  operationUserId: '',
  developUserId: '',
})
const asinQueryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  site: [],
  operationUserId: '',
  developUserId: '',
})
const pAsinQueryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  site: [],
  operationUserId: '',
  developUserId: '',
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const list = ref<IGetOperationAmazonSKUList[]>([])
const asinList = ref<IGetOperationAsinList[]>([])
const pAsinList = ref<IGetOperationParentAsinList[]>([])
const { site } = toRefs(queryForm)
const aclStore = useAclStore()

const handleRankChange = () => {
  if (title.value === '小类排名') {
    fetchSkuRankData()
  } else if(title.value === '大类排名') {
    fetchSkuCateRankData()
  }
}
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
// 修改 ASIN 的运营分类
const handleUpdateAsinOpeType = async (row: IGetOperationAsinList) => {
  await updateOperationASINOperateTypeList({
    id: row.id!,
    typeId: row.operationTypeId!
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

const label1 = [
  '今销',
  'FBA仓储费',
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
  '月ACOS',
  '月TACOS',
  '1年ACOS',
  '1年TACOS',
  '月退货%',
  '月退款%',
]
const label3 = ['上新', '库存可售', '可售含在途', '断货']
const label4 = ['今广%', '半年有货率', '月广告%',]
const label1Map = new Map([
  ['今销', 'currentSalesPrice'],
  ['FBA仓储费', 'fbaStorageFee'],
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
  ['月ACOS', 'monthAcos'],
  ['月TACOS', 'monthTacos'],
  ['1年ACOS', 'yearAcos'],
  ['1年TACOS', 'yearTacos'],
  ['月退货%', 'monthReturnGoods'],
  ['月退款%', 'monthRefund'],
])
const label3Map = new Map([
  ['上新', 'newArrivalDay'],
  ['库存可售', 'esAvailableSaleDay'],
  ['可售含在途', 'esAvailableSaleDayTotal'],
  ['断货', 'outOfStock'],
])
const label4Map = new Map([
  ['今广%', 'currentAdvertisement'],
  ['半年有货率', 'availableRate'],
  ['月广告%', 'monthAdv'],
])
let _seasonalCoefficient = {
  actualList: [],
  referenceList: []
} 
const confirmUpdateRemark = async () => {
  const { data } = await updateRemarkAmazonOperation({
    site: _row.value.site,
    asin: _row.value.asin,
    remark: remark.value
  })
  if (data) {
    $baseMessage('运营备注修改成功！', 'success')
    remarkVisible.value = false
    _row.value.operationRemark = remark.value
  }
}
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
        data: _seasonalCoefficient.actualList,
        itemStyle: {
          color: '#52bfff',
        },
        smooth: true,
      },
      {
        name: '参考值',
        type: 'line',
        data: _seasonalCoefficient.referenceList,
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
      data: () => rankValue.value.map((item) => item.updateDate),
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
        data: () => rankValue.value.map((item) => item.rank),
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
      formatter: (params: any[]) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">不满意率</div>`

        // tooltip详情内容
        const itemHtmlStrArr = params.map((item) => {
          return `<div style="display: flex;align-items:center;">
            ${item.marker}
            <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 10px -1px 2px;">${params[0].name}</div>
            <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${item.value}%</span>
          </div>`
        })
        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr.join('')}
        </div>`
        // 最终html字符串
        const resHtmlStr = titleHtmlStr + contentHtmlStr
        return resHtmlStr
      }
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
      data: () => vocValue.value.map((item) => item.eventDate),
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
      name: '不满意率(%)',
      type: 'value',
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
        name: '不满意率',
        type: 'line',
        data: () => vocValue.value.map((item) => item.ncxRate),
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
const handleRankOpened = () => {
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
const handleVocOpened = () => {
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
    fetchCurrency()
    activeName.value = 0
  } else if (tab.props.name === 1) {
    fetchAsinColumn()
    queryAsinData()
    fetchAsinCurrency()
    activeName.value = 1
  } else {
    fetchPAsinColumn()
    queryPAsinData()
    fetchPAsinCurrency()
    activeName.value = 2
  }
  tabStateStore.setTabState(route.path, activeName.value);
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
        return flexColumnWidth(list.value, 'SKU-SKU-SKU-SKU-', 'sku', 60)
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
      case '产品描述': {
        return flexColumnWidth(list.value, '产品描述', 'productDesc');
      }
      case '开发人员': {
        return calculateBrColumnWidth(list.value, (row: any) => row._developName, 100)
      }
      case '剩余库存': {
        const availableWidth = flexColumnWidth(list.value, '剩余库存', 'availableInventory').slice(0, -2)
        const fbaWidth = flexColumnWidth(list.value, '/', 'fbaCount', 0).slice(0, -2)
        return `${Number(availableWidth) + Number(fbaWidth)}px`
      }
      default: {
        return item.minWidth
      }
    }
  } else if (activeName.value === 1) {
    switch (item.label) {
      case 'SKU': {
        return calculateBrColumnWidth(asinList.value, (row: any) => row._sku, 100)
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
      case '产品描述': {
        return flexColumnWidth(asinList.value, '产品描述', 'productDesc');
      }
      case '开发人员': {
        return calculateBrColumnWidth(asinList.value, (row: any) => row._developName, 100)
      }
      default: {
        return item.minWidth
      }
    }
  } else {
    switch (item.label) {
      case 'SKU': {
        return calculateBrColumnWidth(pAsinList.value, (row: any) => row._sku, 100, 30)
      }
      case '父体ASIN': {
        return flexColumnWidth(pAsinList.value, '父体ASIN-ASIN-ASIN', 'parentAsin')
      }
      case '产品描述': {
        return flexColumnWidth(pAsinList.value, '产品描述', 'productDesc');
      }
      case '开发人员': {
        return calculateBrColumnWidth(pAsinList.value, (row: any) => row._developName, 100)
      }
      default: {
        return item.minWidth
      }
    }
  }
}
let copyRow: any
const chartLoading = ref<boolean>(false)
const rankValue = ref<IOperationAmazonSkuRankList[]>([])
// 获取小类排名数据
const fetchSkuRankData = async () => {
  chartLoading.value = true
  const [startDate, endDate] = rankDate.value
  const formatStartDate = dayjs(startDate).format('YYYY-MM-DD')
  const formatEndDate = dayjs(endDate).format('YYYY-MM-DD')
  // console.log('日期范围：', formatStartDate, formatEndDate)
  if (activeName.value === 0) {
    const { data } = await getOperationAmazonSkuRankList({
      sku: copyRow.sku,
      siteId: copyRow.site,
      startDate: formatStartDate,
      endDate: formatEndDate,
    })
    rankValue.value = data
  } else if (activeName.value === 1) {
    const { data } = await getOperationAmazonAsinRankList({
      asin: copyRow.asin,
      siteId: copyRow.site,
      startDate: formatStartDate,
      endDate: formatEndDate,
    })
    rankValue.value = data
  } else {
    const { data } = await getOperationAmazonParentAsinRankList({
      parentAsin: copyRow.parentAsin,
      siteId: copyRow.site,
      startDate: formatStartDate,
      endDate: formatEndDate,
    })
    rankValue.value = data
  }
  
  // 更新图表数据
  if (chartInstance2) {
    option2.value.yAxis.name = '小类排名'
    option2.value.series[0].name = '小类排名'
    option2.value.xAxis.data = rankValue.value.map(item => item.updateDate)
    option2.value.series[0].data = rankValue.value.map(item => item.rank)
    chartInstance2.setOption(option2.value)
  }
  chartLoading.value = false
}
const fetchSkuCateRankData = async () => {
  chartLoading.value = true
  const [startDate, endDate] = rankDate.value
  const formatStartDate = dayjs(startDate).format('YYYY-MM-DD')
  const formatEndDate = dayjs(endDate).format('YYYY-MM-DD')
  // console.log('日期范围：', formatStartDate, formatEndDate)
  if (activeName.value === 0) {
    const { data } = await getOperationAmazonSkuRankCateList({
      sku: copyRow.sku,
      siteId: copyRow.site,
      startDate: formatStartDate,
      endDate: formatEndDate,
    })
    rankValue.value = data
  } else if(activeName.value === 1) {
    const { data } = await getOperationAmazonAsinRankCateList({
      asin: copyRow.asin,
      siteId: copyRow.site,
      startDate: formatStartDate,
      endDate: formatEndDate,
    })
    rankValue.value = data
  } else {
    const { data } = await getOperationAmazonParentAsinRankCateList({
      parentAsin: copyRow.parentAsin,
      siteId: copyRow.site,
      startDate: formatStartDate,
      endDate: formatEndDate,
    })
    rankValue.value = data
  }
  
  // 更新图表数据
  if (chartInstance2) {
    option2.value.yAxis.name = '大类排名'
    option2.value.series[0].name = '大类排名'
    option2.value.xAxis.data = rankValue.value.map(item => item.updateDate)
    option2.value.series[0].data = rankValue.value.map(item => item.rank)
    chartInstance2.setOption(option2.value)
  }
  chartLoading.value = false
}
// sku获取voc满意度趋势
const fetchSkuVocData = async () => {
  chartLoading.value = true
  const [startDate, endDate] = rankDate.value
  const formatStartDate = dayjs(startDate).format('YYYY-MM-DD')
  const formatEndDate = dayjs(endDate).format('YYYY-MM-DD')
  const { data } = await getOperationAmazonSkuVocList({
    sku: copyRow.sku,
    siteId: copyRow.site,
    startDate: formatStartDate,
    endDate: formatEndDate,
  })
  vocValue.value = data
  // 更新图表数据
  if (chartInstance3) {
    option3.value.xAxis.data = vocValue.value.map(item => item.eventDate)
    option3.value.series[0].data = vocValue.value.map(item => item.ncxRate)
    chartInstance3.setOption(option3.value)
  }
  chartLoading.value = false
}
const cellClick = async (row: any, column: any) => {
  const label = column.label
  switch (label) {
    case '销量趋势(点击看明细)': {
      router.push({
        path: '/storeOperations/productAnalysis',
        query: {
          activeName: 0,
        },
      })
      _addData(row) 
      break
    }
    case '饼图': {
      router.push({
        path: '/storeOperations/productAnalysis',
        query: {
          activeName: 1,
        },
      })
      _addData(row)
      break
    }
    case '运营备注': {
      showRemark()
      _row.value = row
      remark.value = row.operationRemark
      break
    }
    case '季节系数': {
      seasonalVisible.value = true
      _seasonalCoefficient = row.seasonalCoefficient
      break
    }
    case '小类排名': {
      rankVisible.value = true
      // 默认打开是近30天
      rankDate.value = [
        new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30天前
        new Date() // 今天
      ]
      copyRow = row
      title.value = '小类排名'
      fetchSkuRankData()
      break
    }
    case '大类排名': {
      rankVisible.value = true
      rankDate.value = [
        new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30天前
        new Date() // 今天
      ]
      copyRow = row
      title.value = '大类排名'
      fetchSkuCateRankData()
      break
    }
    case 'VOC满意度': {
      vocVisible.value = true
      rankDate.value = [
        new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30天前
        new Date() // 今天
      ]
      copyRow = row
      title.value = 'VOC满意度'
      fetchSkuVocData()
      break
    }
    // No default
  }
}
const handleRouterPush = (row: any) => {
  router.push({
    path: '/storeOperations/productAnalysis',
    query: {
      activeName: 2,
    },
  })
  _addData(row)
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
const changeCurrencySKU = async () => {
  const { data } = await updateCurrencySKUAmazonOperation({
    currency: currencySKU.value!
  })
  if (data) {
    queryData()
  }
}
const changeCurrencyASIN = async () => {
  const { data } = await updateCurrencyASINAmazonOperation({
    currency: currencyAsin.value!
  })
  if (data) {
    queryAsinData()
  }
}
const changeCurrencyPASIN = async () => {
  const { data } = await updateCurrencyParentASINAmazonOperation({
    currency: currencyPAsin.value!
  })
  if (data) {
    queryPAsinData()
  }
}
const headerCell = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (['今销', '月净利润', '月销售额'].includes(data.column.label)) {
    return 'header-cell'
  }
  return ''
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['SKU', 'ASIN', '父体ASIN', '库龄', '产品描述', '开发人员'].includes(label)) {
    return {
      textAlign: 'left',
    }
  } else if (label === '运营备注') {
    return {
      textAlign: 'left',
      cursor: 'pointer'
    }
  }
  else {
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
const fetchCurrency = async () => {
  const { data: sku } = await getCurrencySKUAmazonOperation()
  currencySKU.value = sku
}
const fetchAsinCurrency = async () => {
  const { data: asin } = await getCurrencyASINAmazonOperation()
  currencyAsin.value = asin
}
const fetchPAsinCurrency = async () => {
  const { data: pAsin } = await getCurrencyParentASINAmazonOperation()
  currencyPAsin.value = pAsin
}
const fetchDevelopUserList = async () => {
  const { data } = await getDevelopUserList()
  developUserList.value = data
  developUserList.value.unshift({ id: -1, label: '全部' })
}
const fetchUser = async () => {
  const { data } = await getUserAmazonOperation()
  queryForm.operationUserId = data.operationUserId
  queryForm.developUserId = data.developUserId
  asinQueryForm.operationUserId = data.operationUserId
  asinQueryForm.developUserId = data.developUserId
  pAsinQueryForm.operationUserId = data.operationUserId
  pAsinQueryForm.developUserId = data.developUserId
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

const fetchData = async () => {
  if (listLoading.value) return
  listLoading.value = true
  const { site, ...filterQueryForm } = queryForm
  const { data } = await getOperationAmazonSKUList({
    ...filterQueryForm,
    siteIds: site.join(','),
  })
  total.value = data.total
  list.value = data.list
  list.value.forEach((item) => {
    processField(item, 'developName', 2)
    if (item.skuImgUrl) item.skuImgUrl = handleImgUrl(item.skuImgUrl)
    item.displayRating = getAmazonStars(item.rating!, item.commentsNumbers!)
    item.storageAge = `
      <div class="storage-list">
        <div class="storage-item">
          <span class="value1">181-270</span>
          <span class="value2">${item.inventoryAgeLevel1Days ? item.inventoryAgeLevel1Days : ''}</span>
          <span class="value3">${item.inventoryAgeLevel1Days ? `($${item.inventoryAgeLevel1Value})` : ''}</span>
        </div>
        <div class="storage-item">
          <span class="value1">271-360</span>
          <span class="value2">${item.inventoryAgeLevel2Days ? item.inventoryAgeLevel2Days : ''}</span>
          <span class="value3">${item.inventoryAgeLevel2Days ? `($${item.inventoryAgeLevel2Value})` : ''}</span>
        </div>
        <div class="storage-item">
          <span class="value1">361+</span>
          <span class="value2">${item.inventoryAgeLevel3Days ? item.inventoryAgeLevel3Days : ''}</span>
          <span class="value3">${item.inventoryAgeLevel3Days ? `($${item.inventoryAgeLevel3Value})` : ''}</span>
        </div>
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
    processField(item, 'sku', 2)
    processField(item, 'developName', 2)
    if (item.asinImgUrl) item.asinImgUrl = handleImgUrl(item.asinImgUrl)
    item.displayRating = getAmazonStars(item.rating!, item.commentsNumbers!)
  
    item.storageAge = `
      <div class="storage-list">
        <div class="storage-item">
          <span class="value1">181-270</span>
          <span class="value2">${item.inventoryAgeLevel1Days ? item.inventoryAgeLevel1Days : ''}</span>
          <span class="value3">${item.inventoryAgeLevel1Days ? `($${item.inventoryAgeLevel1Value})` : ''}</span>
        </div>
        <div class="storage-item">
          <span class="value1">271-360</span>
          <span class="value2">${item.inventoryAgeLevel2Days ? item.inventoryAgeLevel2Days : ''}</span>
          <span class="value3">${item.inventoryAgeLevel2Days ? `($${item.inventoryAgeLevel2Value})` : ''}</span>
        </div>
        <div class="storage-item">
          <span class="value1">361+</span>
          <span class="value2">${item.inventoryAgeLevel3Days ? item.inventoryAgeLevel3Days : ''}</span>
          <span class="value3">${item.inventoryAgeLevel3Days ? `($${item.inventoryAgeLevel3Value})` : ''}</span>
        </div>
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
    processField(item, 'developName', 2)
    if (item.asinImgUrl) item.asinImgUrl = handleImgUrl(item.asinImgUrl)
    item.displayRating = getAmazonStars(item.rating!, item.commentsNumbers!)
  })
  listLoading.value = false
}

const fetchColumn = async () => {
  const { data } = await getOperationColumnList({ type: 0 })
  columns.value = data
  const indicesToDelete: number[] = [] // 存储要删除的索引

  columns.value.forEach((item: IGetOperationColumnList, index: number) => {
    item.minWidth = item.width;
    if (item.prop !== 'skuImgUrl') {
      delete item.width
    }
    if (['currentSalesNumber', 'currentSalesOrder', 'monthSalesVolume', 'monthNetProfit', 'monthSalesPrice', 'currentSalesPrice'].includes(item.prop)) {
      item.sortable = true
    }
    if (['skuImgUrl', 'sku'].includes(item.prop)) {
      item.isFixed = true
    }
    if (item.prop === 'vocDefect') {
      indicesToDelete.push(index)
    }
    if (item.prop === 'vocNcxCount') {
      indicesToDelete.push(index)
    }
    if (item.prop === 'vocTotalOrderCount') {
      indicesToDelete.push(index)
    }
    if (item.prop === 'amazonFba') {
      indicesToDelete.push(index)
    }
    if (item.prop === 'selfAssessmentFba') {
      item.minWidth = '120'
    }
  })
   
  for (let i = indicesToDelete.length - 1; i >= 0; i--) {
    columns.value.splice(indicesToDelete[i], 1); //删除项
  }
}
const fetchAsinColumn = async () => {
  const { data } = await getOperationColumnList({ type: 1 })
  columnsAsin.value = data
  columnsAsin.value.forEach((item: IGetOperationColumnList) => {
    item.minWidth = item.width;
    if (item.prop !== 'asinImgUrl') {
      delete item.width
    }
    if (['currentSalesNumber', 'currentSalesOrder', 'monthSalesVolume', 'monthNetProfit', 'monthSalesPrice', 'currentSalesPrice'].includes(item.prop)) {
      item.sortable = true
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
    if (['currentSalesNumber', 'currentSalesOrder', 'monthSalesVolume', 'monthNetProfit', 'monthSalesPrice', 'currentSalesPrice'].includes(item.prop)) {
      item.sortable = true
    }
    if (['asinImgUrl', 'sku', 'parentAsin'].includes(item.prop)) {
      item.isFixed = true
    }
  })
}
const disabledOpe = ref<boolean>(false)
const disabledDev = ref<boolean>(false)
const operationAndDevelopSelect = () => {
  const role = aclStore.getRole[0]
  switch (role) {
    // 老板和运营主管
    case 'ROLE_BOSS': 
    case 'ROLE_ECOMMERCEOPERATIONLEAD': {
      disabledOpe.value = false
      disabledDev.value = false
    
      break;
    }
    // 运营
    case 'ROLE_ECOMMERCEOPERATOR': {
      disabledOpe.value = true
      disabledDev.value = false

      break;
    }
    // 产品经理,产品设计,工业设计
    case 'ROLE_PRODUCTMANAGER': 
    case 'ROLE_PRODUCTDESIGNER': 
    case 'ROLE_INDUSTRIAL_DESIGN': {
      disabledOpe.value = false
      disabledDev.value = true
      
      break;
    }
    // 产品主管, 行政主管
    case 'ROLE_PRODUCTMANNAGERLEAD':
    case 'ROLE_ADMINBUYERLEAD': {
      disabledOpe.value = false
      disabledDev.value = false
      
      break;
    }
  // No default
  }
}
const developSelect = () => {
  return aclStore.getRole[0] === 'ROLE_PRODUCTMANNAGERLEAD' || aclStore.getRole[0] === 'ROLE_BOSS'
}
onBeforeMount(() => {
  if (activeName.value === 0) {
    fetchData()
    fetchColumn()
  } else if(activeName.value === 1) {
    fetchAsinColumn()
    fetchAsinData()
  } else {
    fetchPAsinColumn()
    fetchPAsinData()
  }
  fetchSiteList()
  fetchCurrencyList()
  fetchCurrency()
  fetchOperateUserList()
  fetchDevelopUserList()
  fetchUser()
  // console.log(aclStore.getRole)
  operationAndDevelopSelect()
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
          
          .copySku {
            display: inline-block; /* 使宽度适应内容，方便点击 */
            padding: 5px 5px 5px 0; 
            cursor: pointer;
            -webkit-user-select: text;
            user-select: text;
            // transition: all 0.3s;
            &:hover {
              color: #000;
            }
          }
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
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoverTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}
/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoverTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
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
.questionIcon {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    margin-left: 3px;
  }
}
.noneHoverTable :deep(.header-cell .cell) {
  display: flex;          /* 应用 Flexbox 布局 */
  align-items: center;   /* 垂直居中 */
  justify-content: center;
}
</style>
