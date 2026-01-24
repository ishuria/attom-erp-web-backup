<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="美工类型" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="showParamSetting">参数设定</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline @submit.prevent>
              <el-form-item>
                <el-input v-model="keyWord" clearable placeholder="请输入搜索关键词" @input="fetchData" @keyup.enter="fetchData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="fetchData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border
          :cell-style="cellStyle"
          class="noneHoverTable"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @cell-click="changeInput"
        >
          <el-table-column label="姓名" min-width="" prop="userName" />
          <el-table-column label="角色" min-width="" prop="roleName" />
          <el-table-column label="图片提成天数" min-width="" prop="pictureDay">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.pictureDay" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.pictureDay }}</span>
            </template>
          </el-table-column>
          <el-table-column label="图片提成单人比例" min-width="" prop="singlePersonProportion">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.singlePersonProportion" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.singlePersonProportion ? row.singlePersonProportion + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="建模提成单人比例" min-width="" prop="moldingProportion">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.moldingProportion" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.moldingProportion ? row.moldingProportion + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="渲染提成单人比例" min-width="" prop="renderingProportion">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.renderingProportion" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.renderingProportion ? row.renderingProportion + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="A+提成单人比例" min-width="" prop="aPlusProportion">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.aPlusProportion" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.aPlusProportion ? row.aPlusProportion + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="视频提成单人比例" min-width="" prop="videoProportion">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.videoProportion" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.videoProportion ? row.videoProportion + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="说明书/包装提成单人比例" min-width="" prop="instructionManualRate">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.instructionManualRate" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.instructionManualRate ? row.instructionManualRate + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="长期提成天数" min-width="" prop="longDay">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.longDay" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.longDay }}</span>
            </template>
          </el-table-column>
          <el-table-column label="长期提成单人比例" min-width="" prop="longSinglePersonProportion">
            <template #default="{ row }">
              <div class="none">
                <el-input
                  v-model="row.longSinglePersonProportion"
                  @blur="clickCancel($event, row)"
                  @keyup.enter="clickCancel($event, row)"
                />
              </div>
              <span>{{ row.longSinglePersonProportion ? row.longSinglePersonProportion + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="合作权重" min-width="" prop="cooperationWeight">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.cooperationWeight" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.cooperationWeight }}</span>
            </template>
          </el-table-column>
          <el-table-column label="合作加成倍数" min-width="" prop="addition">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.addition" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.addition }}</span>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="产品类型" :name="1">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
            <el-form inline @submit.prevent>
              <el-form-item>
                <el-input v-model="keyWord2" clearable placeholder="请输入搜索关键词" @input="fetchData2" @keyup.enter="fetchData2" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="fetchData2" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border
          :cell-style="cellStyle"
          class="noneHoverTable"
          :data="list2"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @cell-click="changeInput"
        >
          <el-table-column label="姓名" prop="userName" />
          <el-table-column label="角色" prop="roleName" />
          <el-table-column label="产品开发类型">
            <el-table-column label="净利提成模式">
              <el-table-column label="产品经理净利提成比例" prop="productManagerProportion" width="190">
                <template #default="{ row }">
                  <div class="none">
                    <el-input
                      v-model="row.productManagerProportion"
                      @blur="clickCancel2($event, row)"
                      @keyup.enter="clickCancel2($event, row)"
                    />
                  </div>
                  <span>{{ row.productManagerProportion ? row.productManagerProportion + '%' : '' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="产品设计净利提成比例" prop="productDesignProportion" width="190">
                <template #default="{ row }">
                  <div class="none">
                    <el-input
                      v-model="row.productDesignProportion"
                      @blur="clickCancel2($event, row)"
                      @keyup.enter="clickCancel2($event, row)"
                    />
                  </div>
                  <span>{{ row.productDesignProportion ? row.productDesignProportion + '%' : '' }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="通用调整">
              <el-table-column label="达标递增" prop="delivery">
                <template #default="{ row }">
                  <div class="none">
                    <el-input v-model="row.delivery" @blur="clickCancel2($event, row)" @keyup.enter="clickCancel2($event, row)" />
                  </div>
                  <span>{{ row.delivery ? row.delivery + '%' : '' }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="考核数">
              <el-table-column label="默认总考核数" prop="defaultAssessmentNumber">
                <template #default="{ row }">
                  <div class="none">
                    <el-input
                      v-model="row.defaultAssessmentNumber"
                      @blur="clickCancel2($event, row)"
                      @keyup.enter="clickCancel2($event, row)"
                    />
                  </div>
                  <span>{{ row.defaultAssessmentNumber ? row.defaultAssessmentNumber : '' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="默认OEM考核数" prop="defaultOem">
                <template #default="{ row }">
                  <div class="none">
                    <el-input v-model="row.defaultOem" @blur="clickCancel2($event, row)" @keyup.enter="clickCancel2($event, row)" />
                  </div>
                  <span>{{ row.defaultOem ? row.defaultOem : '' }}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column label="产品采购类型(供应链)">
            <el-table-column label="云舟报关计件" prop="yunzhouCount">
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.yunzhouCount" @blur="clickCancel2($event, row)" @keyup.enter="clickCancel2($event, row)" />
                </div>
                <span>{{ row.yunzhouCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="云舟不报关计件" prop="yunzhouNoBgCount">
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.yunzhouNoBgCount" @blur="clickCancel2($event, row)" @keyup.enter="clickCancel2($event, row)" />
                </div>
                <span>{{ row.yunzhouNoBgCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="埃托姆计件" prop="aiTuoMCount">
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.aiTuoMCount" @blur="clickCancel2($event, row)" @keyup.enter="clickCancel2($event, row)" />
                </div>
                <span>{{ row.aiTuoMCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Attom计件" prop="attomCount">
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.attomCount" @blur="clickCancel2($event, row)" @keyup.enter="clickCancel2($event, row)" />
                </div>
                <span>{{ row.attomCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="降本提成比例" prop="proportion">
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.proportion" @blur="clickCancel2($event, row)" @keyup.enter="clickCancel2($event, row)" />
                </div>
                <span>{{ row.proportion ? row.proportion + '%' : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="降本提成天数" prop="day">
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.day" @blur="clickCancel2($event, row)" @keyup.enter="clickCancel2($event, row)" />
                </div>
                <span>{{ row.day }}</span>
              </template>
            </el-table-column>
            <el-table-column label="退税提成比例" prop="taxRefundBonusRatio">
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.taxRefundBonusRatio" @blur="clickCancel2($event, row)" @keyup.enter="clickCancel2($event, row)" />
                </div>
                <span>{{ row.taxRefundBonusRatio ? row.taxRefundBonusRatio + '%' : '' }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="管理分">
            <el-table-column label="直属主管管理总分" prop="directSupervisorTotalScore">
              <template #default="{ row }">
                <div class="none">
                  <el-input
                    v-model="row.directSupervisorTotalScore"
                    @blur="clickCancel2($event, row)"
                    @keyup.enter="clickCancel2($event, row)"
                  />
                </div>
                <span>{{ row.directSupervisorTotalScore }}</span>
              </template>
            </el-table-column>
            <el-table-column label="直属主管管理OEM分" prop="directSupervisorOemScore" width="170">
              <template #default="{ row }">
                <div class="none">
                  <el-input
                    v-model="row.directSupervisorOemScore"
                    @blur="clickCancel2($event, row)"
                    @keyup.enter="clickCancel2($event, row)"
                  />
                </div>
                <span>{{ row.directSupervisorOemScore }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" />
          </template>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="运营类型" :name="2">
        <div class="operation-config-container">
          <!-- 考核指标配置 -->
          <el-card class="config-card indicator-card" header="考核指标配置" shadow="never">
            <div class="indicator-list">
              <!-- 老品认领提成比例 -->
              <div class="indicator-item">
                <div class="indicator-content">
                  <span class="bullet">■</span>
                  <span class="indicator-text">
                    老品认领提成比例
                    <el-input-number
                      v-model="operationConfig.oldProductClaimRatio"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                      @blur="handleOldProductRatioBlur"
                    />
                    %
                  </span>
                </div>
              </div>

              <!-- 广告ACOS -->
              <div class="indicator-item">
                <div class="indicator-content">
                  <span class="bullet">■</span>
                  <span class="indicator-text">
                    广告ACOS <=
                    <el-input-number
                      v-model="operationConfig.indicators[0].baseValue"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                    />
                    %
                  </span>
                </div>
                <div class="indicator-sub">
                  <span class="sub-bullet">●</span>
                  <span class="indicator-text">
                    每超
                    <el-input-number
                      v-model="operationConfig.indicators[0].stepValue"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0.01"
                      :precision="2"
                      style="width: 80px"
                    />
                    %（不足
                    <span class="inline-value">{{ operationConfig.indicators[0].stepValue }}</span>
                    %按
                    <span class="inline-value">{{ operationConfig.indicators[0].stepValue }}</span>
                    %计），提成比例减少
                    <el-input-number
                      v-model="operationConfig.indicators[0].deductionRate"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                    />
                    %
                  </span>
                </div>
              </div>

              <!-- Total ACOS (ACOG) -->
              <div class="indicator-item">
                <div class="indicator-content">
                  <span class="bullet">■</span>
                  <span class="indicator-text">
                    Total ACOS (ACOG) <=
                    <el-input-number
                      v-model="operationConfig.indicators[1].baseValue"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                    />
                    %
                  </span>
                </div>
                <div class="indicator-sub">
                  <span class="sub-bullet">●</span>
                  <span class="indicator-text">
                    每超
                    <el-input-number
                      v-model="operationConfig.indicators[1].stepValue"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0.01"
                      :precision="2"
                      style="width: 80px"
                    />
                    %（不足
                    <span class="inline-value">{{ operationConfig.indicators[1].stepValue }}</span>
                    %按
                    <span class="inline-value">{{ operationConfig.indicators[1].stepValue }}</span>
                    %计），提成比例减少
                    <el-input-number
                      v-model="operationConfig.indicators[1].deductionRate"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                    />
                    %
                  </span>
                </div>
              </div>

              <!-- ASOAS广告销售额占比 -->
              <div class="indicator-item">
                <div class="indicator-content">
                  <span class="bullet">■</span>
                  <span class="indicator-text">
                    ASOAS广告销售额占比 >=
                    <el-input-number
                      v-model="operationConfig.indicators[2].baseValue"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                    />
                    %
                  </span>
                </div>
                <div class="indicator-sub">
                  <span class="sub-bullet">●</span>
                  <span class="indicator-text">
                    每少
                    <el-input-number
                      v-model="operationConfig.indicators[2].stepValue"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0.01"
                      :precision="2"
                      style="width: 80px"
                    />
                    %（不足
                    <span class="inline-value">{{ operationConfig.indicators[2].stepValue }}</span>
                    %按
                    <span class="inline-value">{{ operationConfig.indicators[2].stepValue }}</span>
                    %计），提成比例减少
                    <el-input-number
                      v-model="operationConfig.indicators[2].deductionRate"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                    />
                    %
                  </span>
                </div>
              </div>

              <!-- 冗余库存占比 -->
              <div class="indicator-item">
                <div class="indicator-content">
                  <span class="bullet">■</span>
                  <span class="indicator-text">
                    冗余库存占比（结算时，剩余总可售天数>=
                    <el-input-number
                      v-model="operationConfig.indicators[3].daysThreshold"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="1000"
                      :min="0"
                      :precision="0"
                      style="width: 80px"
                    />
                    天的产品的库存占比<=
                    <el-input-number
                      v-model="operationConfig.indicators[3].baseValue"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                    />
                    %）
                  </span>
                </div>
                <div class="indicator-sub">
                  <span class="sub-bullet">●</span>
                  <span class="indicator-text">
                    每超
                    <el-input-number
                      v-model="operationConfig.indicators[3].stepValue"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0.01"
                      :precision="2"
                      style="width: 80px"
                    />
                    %，提成比例减少
                    <el-input-number
                      v-model="operationConfig.indicators[3].deductionRate"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                    />
                    %
                  </span>
                </div>
              </div>

              <!-- 低动销 -->
              <div class="indicator-item">
                <div class="indicator-content">
                  <span class="bullet">■</span>
                  <span class="indicator-text">
                    低动销（结算时，总可售天数>=
                    <el-input-number
                      v-model="operationConfig.indicators[4].daysThreshold"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="1000"
                      :min="0"
                      :precision="0"
                      style="width: 80px"
                    />
                    天）的比例<=
                    <el-input-number
                      v-model="operationConfig.indicators[4].baseValue"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                    />
                    %
                  </span>
                </div>
                <div class="indicator-sub">
                  <span class="sub-bullet">●</span>
                  <span class="indicator-text">
                    每超
                    <el-input-number
                      v-model="operationConfig.indicators[4].stepValue"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0.01"
                      :precision="2"
                      style="width: 80px"
                    />
                    %，提成比例减少
                    <el-input-number
                      v-model="operationConfig.indicators[4].deductionRate"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                    />
                    %
                  </span>
                </div>
              </div>

              <!-- 高库龄库存 -->
              <div class="indicator-item">
                <div class="indicator-content">
                  <span class="bullet">■</span>
                  <span class="indicator-text">
                    高库龄库存（库龄>=181天库存的占比需要<=
                    <el-input-number
                      v-model="operationConfig.indicators[5].baseValue"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                    />
                    %）
                  </span>
                </div>
                <div class="indicator-sub">
                  <span class="sub-bullet">●</span>
                  <span class="indicator-text">
                    每超
                    <el-input-number
                      v-model="operationConfig.indicators[5].stepValue"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0.01"
                      :precision="2"
                      style="width: 80px"
                    />
                    %，提成比例减少
                    <el-input-number
                      v-model="operationConfig.indicators[5].deductionRate"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                    />
                    %
                  </span>
                </div>
              </div>

              <!-- 不可售产品销量占比 -->
              <div class="indicator-item">
                <div class="indicator-content">
                  <span class="bullet">■</span>
                  <span class="indicator-text">
                    不可售产品销量占比<=
                    <el-input-number
                      v-model="operationConfig.indicators[6].baseValue"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                    />
                    %
                  </span>
                </div>
                <div class="indicator-sub">
                  <span class="sub-bullet">●</span>
                  <span class="indicator-text">
                    每超
                    <el-input-number
                      v-model="operationConfig.indicators[6].stepValue"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0.01"
                      :precision="2"
                      style="width: 80px"
                    />
                    %，提成比例减少
                    <el-input-number
                      v-model="operationConfig.indicators[6].deductionRate"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                    />
                    %
                  </span>
                </div>
              </div>

              <!-- 未发库存 -->
              <div class="indicator-item">
                <div class="indicator-content">
                  <span class="bullet">■</span>
                  <span class="indicator-text">
                    未发库存（结算时，在上海仓库滞留超过
                    <el-input-number
                      v-model="operationConfig.indicators[7].daysThreshold"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="1000"
                      :min="0"
                      :precision="0"
                      style="width: 80px"
                    />
                    天的产品比例<=
                    <el-input-number
                      v-model="operationConfig.indicators[7].baseValue"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                    />
                    %）
                  </span>
                </div>
                <div class="indicator-sub">
                  <span class="sub-bullet">●</span>
                  <span class="indicator-text">
                    每超
                    <el-input-number
                      v-model="operationConfig.indicators[7].stepValue"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0.01"
                      :precision="2"
                      style="width: 80px"
                    />
                    %，提成比例减少
                    <el-input-number
                      v-model="operationConfig.indicators[7].deductionRate"
                      class="inline-input highlight-input"
                      :controls="false"
                      :max="100"
                      :min="0"
                      :precision="2"
                      style="width: 80px"
                    />
                    %
                  </span>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
    <vab-dialog v-model="paramSetting" :draggable="false" title="参数设定" width="20%">
      <el-form ref="formRef" label-position="right" label-width="auto" :model="form" :rules="formRules" style="margin: 0 0 20px 0">
        <el-form-item label="初始目标ACOS" prop="acos">
          <el-input v-model="form.acos" type="number" />
        </el-form-item>
        <el-form-item label="转化率加成上限" prop="upperLimit">
          <el-input v-model="form.upperLimit" type="number" />
        </el-form-item>
        <el-form-item label="图片优化任务最低要求转化率" prop="minConversionRate">
          <el-input v-model="form.minConversionRate">
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="断货补偿天数上限" prop="compensationDay">
          <el-input v-model="form.compensationDay" type="number" />
        </el-form-item>
        <el-form-item label="新品要求转化率打折比例" prop="newDiscountRatio">
          <el-input v-model="form.newDiscountRatio">
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="转化率不达标豁免金额($)">
          <el-input v-model="form.price" />
        </el-form-item>
      </el-form>
      <el-table border class="noneHoverTable" :data="list3" stripe @cell-click="changeInput">
        <el-table-column label="客单价" prop="unitPrice" />
        <el-table-column label="初始目标转化率" prop="targetRate">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.targetRate" type="number" @blur="clickCancel3($event, row)" @keyup.enter="clickCancel3($event, row)" />
            </div>
            <span>{{ row.targetRate ? row.targetRate + '%' : '' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="paramSetting = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmParamSetting">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import {
  getCommissionArtTypeList,
  getCommissionProductTypeList,
  getCommissionSetting,
  getOldProductProportion,
  updateCommissionArtType,
  updateCommissionProductType,
  updateCommissionProductTypeScore,
  updateCommissionSetting1,
  updateCommissionSetting2,
  updateOldProductProportion,
} from '/@/api/devlocal/commission'
import type {
  IGetCommissionArtTypeList,
  IGetCommissionProductTypeList,
  IGetCommissionSettingTableList,
  IUpdateCommissionSetting1Req,
} from '/@/type/commission/commissionType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

defineOptions({
  name: 'CommissionCoefficientSetting',
})

const activeName = ref<number>(0)
const paramSetting = ref<boolean>(false)
const keyWord = ref<string>('')
const keyWord2 = ref<string>('')
const listLoading = ref<boolean>(false)
const list = ref<IGetCommissionArtTypeList[]>([])
const list2 = ref<IGetCommissionProductTypeList[]>([])
const list3 = ref<IGetCommissionSettingTableList[]>([])
let copyRow: any
const form = reactive<any>({})
const formRef = ref<FormInstance>()
const formRules = reactive<FormRules<IUpdateCommissionSetting1Req>>({
  acos: [{ required: true, message: '请输入初始acos转化率', trigger: 'blur' }],
  upperLimit: [{ required: true, message: '请输入转化率加成上限', trigger: 'blur' }],
  minConversionRate: [{ required: true, message: '请输入最低转化率', trigger: 'blur' }],
  compensationDay: [{ required: true, message: '请输入断货补偿天数上限', trigger: 'blur' }],
  newDiscountRatio: [{ required: true, message: '请输入新品要求转化率打折比例', trigger: 'blur' }],
})
const handleConfirmParamSetting = async () => {
  formRef.value?.validate(async (isValid) => {
    if (isValid) {
      const { data } = await updateCommissionSetting1({
        acos: form.acos,
        upperLimit: form.upperLimit,
        minConversionRate: Number(form.minConversionRate) / 100,
        compensationDay: form.compensationDay,
        newDiscountRatio: Number(form.newDiscountRatio) / 100,
        price: form.price,
      })
      if (data) {
        $baseMessage('提交成功！', 'success')
        paramSetting.value = false
      }
    }
  })
}
const showParamSetting = async () => {
  paramSetting.value = true
  const { data } = await getCommissionSetting()
  Object.assign(form, data)
  list3.value = data.list
  list3.value.forEach((item) => {
    item.targetRate = parseFloat((item.targetRate * 100).toFixed(2))
  })
}
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
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

// table blur事件
const clickCancel = async (event: any, value: any) => {
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
      await updateCommissionArtType({
        id: value.id,
        pictureDay: value.pictureDay,
        singlePersonProportion: Number(value.singlePersonProportion) / 100,
        longDay: value.longDay,
        longSinglePersonProportion: Number(value.longSinglePersonProportion) / 100,
        cooperationWeight: value.cooperationWeight,
        addition: value.addition,
        moldingProportion: Number(value.moldingProportion) / 100,
        renderingProportion: Number(value.renderingProportion) / 100,
        aPlusProportion: Number(value.aPlusProportion) / 100,
        videoProportion: Number(value.videoProportion) / 100,
        instructionManualRate: Number(value.instructionManualRate) / 100,
      })
    } catch {
      Object.assign(value, copyRow)
    }
  }
}
// table blur事件
const clickCancel2 = async (event: any, value: any) => {
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
      // 检测是否修改了管理分相关字段
      const isScoreFieldChanged =
        copyRow?.directSupervisorTotalScore !== value.directSupervisorTotalScore ||
        copyRow?.directSupervisorOemScore !== value.directSupervisorOemScore

      // 检测是否修改了其他字段
      const isOtherFieldChanged =
        copyRow?.productManagerProportion !== value.productManagerProportion ||
        copyRow?.productDesignProportion !== value.productDesignProportion ||
        copyRow?.delivery !== value.delivery ||
        copyRow?.yunzhouCount !== value.yunzhouCount ||
        copyRow?.yunzhouNoBgCount !== value.yunzhouNoBgCount ||
        copyRow?.aiTuoMCount !== value.aiTuoMCount ||
        copyRow?.attomCount !== value.attomCount ||
        copyRow?.proportion !== value.proportion ||
        copyRow?.day !== value.day ||
        copyRow?.defaultAssessmentNumber !== value.defaultAssessmentNumber ||
        copyRow?.defaultOem !== value.defaultOem ||
        copyRow?.taxRefundBonusRatio !== value.taxRefundBonusRatio

      // 如果修改了管理分字段，调用评分更新接口
      if (isScoreFieldChanged) {
        await updateCommissionProductTypeScore({
          userId: value.userId,
          totalScore: Number(value.directSupervisorTotalScore) || 0,
          oemScore: Number(value.directSupervisorOemScore) || 0,
        })
      }

      // 如果修改了其他字段，调用产品类型更新接口
      if (isOtherFieldChanged) {
        await updateCommissionProductType({
          id: value.id,
          productManagerProportion: Number(value.productManagerProportion) / 100,
          productDesignProportion: Number(value.productDesignProportion) / 100,
          delivery: Number(value.delivery) / 100,
          yunzhouCount: value.yunzhouCount,
          yunzhouNoBgCount: value.yunzhouNoBgCount,
          aiTuoMCount: value.aiTuoMCount,
          attomCount: value.attomCount,
          proportion: Number(value.proportion) / 100,
          day: value.day,
          defaultAssessmentNumber: value.defaultAssessmentNumber,
          defaultOem: value.defaultOem,
          taxRefundBonusRatio: value.taxRefundBonusRatio / 100,
        })
      }
    } catch {
      Object.assign(value, copyRow)
    }
  }
}
const clickCancel3 = async (event: any, value: any) => {
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
      await updateCommissionSetting2({
        id: value.id,
        targetRate: Number(value.targetRate) / 100,
      })
    } catch {
      Object.assign(value, copyRow)
    }
  }
}

// ============ 运营类型相关 ============

interface OperationIndicator {
  key: string
  name: string
  baseValue: number
  stepValue: number
  daysThreshold?: number // 天数阈值（如360天、150天、60天）
  deductionRate: number
}

interface OperationConfig {
  oldProductClaimRatio: number
  indicators: OperationIndicator[]
}

// 运营配置数据
const operationConfig = ref<OperationConfig>({
  oldProductClaimRatio: 20,
  indicators: [
    {
      key: 'acos',
      name: '广告ACOS',
      baseValue: 35,
      stepValue: 1,
      deductionRate: 0.2,
    },
    {
      key: 'totalAcos',
      name: 'Total ACOS (ACOG)',
      baseValue: 15,
      stepValue: 0.5,
      deductionRate: 0.2,
    },
    {
      key: 'adSalesRatio',
      name: 'ASOAS广告销售额占比',
      baseValue: 40,
      stepValue: 1,
      deductionRate: 0.2,
    },
    {
      key: 'redundantInventory',
      name: '冗余库存占比',
      baseValue: 16,
      stepValue: 0.5,
      daysThreshold: 360,
      deductionRate: 0.2,
    },
    {
      key: 'lowSalesRatio',
      name: '低动销比例',
      baseValue: 20,
      stepValue: 1,
      daysThreshold: 150,
      deductionRate: 0.2,
    },
    {
      key: 'highAgeInventory',
      name: '高库龄库存占比',
      baseValue: 15,
      stepValue: 1,
      deductionRate: 0.2,
    },
    {
      key: 'unsellableRatio',
      name: '不可售产品销量占比',
      baseValue: 2.5,
      stepValue: 0.1,
      deductionRate: 0.2,
    },
    {
      key: 'unshippedInventory',
      name: '未发库存比例',
      baseValue: 10,
      stepValue: 1,
      daysThreshold: 60,
      deductionRate: 0.2,
    },
  ],
})

// 复制原始数据用于对比
let copyOperationConfig: OperationConfig | null = null

// 获取运营配置
const fetchOperationConfig = async () => {
  try {
    // 获取老品认领比例
    const { data: oldProductProportion } = await getOldProductProportion()
    operationConfig.value.oldProductClaimRatio = oldProductProportion
    copyOperationConfig = JSON.parse(JSON.stringify(operationConfig.value))
  } catch (error) {
    console.error('获取运营配置失败:', error)
    $baseMessage('获取配置失败', 'error')
  }
}

// 老品认领比例失焦保存
const handleOldProductRatioBlur = async () => {
  // 检查值是否发生变化
  if (copyOperationConfig && operationConfig.value.oldProductClaimRatio === copyOperationConfig.oldProductClaimRatio) {
    return
  }
  try {
    const { data } = await updateOldProductProportion({
      proportion: operationConfig.value.oldProductClaimRatio,
    })
    if (data) {
      $baseMessage('保存成功！', 'success')
      copyOperationConfig = JSON.parse(JSON.stringify(operationConfig.value))
    }
  } catch (error) {
    console.error('保存老品认领比例失败:', error)
    $baseMessage('保存失败，请重试', 'error')
    // 保存失败时恢复原值
    if (copyOperationConfig) {
      operationConfig.value.oldProductClaimRatio = copyOperationConfig.oldProductClaimRatio
    }
  }
}

// 保存老品认领比例
const handleSaveOldProductProportion = async () => {
  try {
    const { data } = await updateOldProductProportion({
      proportion: operationConfig.value.oldProductClaimRatio,
    })
    if (data) {
      $baseMessage('保存成功！', 'success')
      copyOperationConfig = JSON.parse(JSON.stringify(operationConfig.value))
    }
  } catch (error) {
    console.error('保存老品认领比例失败:', error)
    $baseMessage('保存失败，请重试', 'error')
  }
}

// ============ 结束运营类型相关 ============

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getCommissionArtTypeList({
    keyWord: keyWord.value,
  })
  list.value = data
  listLoading.value = false
}
const fetchData2 = async () => {
  listLoading.value = true
  const { data } = await getCommissionProductTypeList({
    keyWord: keyWord2.value,
  })
  list2.value = data
  list2.value.forEach((item) => {
    if (item.productManagerProportion) {
      item.productManagerProportion = parseFloat((item.productManagerProportion * 100).toFixed(2))
    }
    if (item.productDesignProportion) {
      item.productDesignProportion = parseFloat((item.productDesignProportion * 100).toFixed(2))
    }
    if (item.delivery) {
      item.delivery = parseFloat((item.delivery * 100).toFixed(2))
    }
    if (item.proportion) {
      item.proportion = parseFloat((item.proportion * 100).toFixed(2))
    }
    if (item.taxRefundBonusRatio) {
      item.taxRefundBonusRatio = parseFloat((item.taxRefundBonusRatio * 100).toFixed(2))
    }
  })
  listLoading.value = false
}
const handleTabClick = (tab: TabsPaneContext) => {
  if (tab.props.name === 1) {
    fetchData2()
  } else if (tab.props.name === 0) {
    fetchData()
  } else if (tab.props.name === 2) {
    fetchOperationConfig()
  }
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const index = data.columnIndex
  if (index === 0 || index === 1) {
    return {
      textAlign: 'center',
      fontWeight: 'bold',
    }
  }
  return {
    textAlign: 'center',
  }
}
onBeforeMount(() => {
  if (activeName.value === 0) {
    fetchData()
  } else if (activeName.value === 1) {
    fetchData2()
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
    .el-table__body .cell {
      min-height: 34px;
      line-height: 34px;
    }
  }
}

// 运营类型配置样式
.operation-config-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;

  .config-card {
    margin-bottom: 20px;

    :deep(.el-card__header) {
      background-color: #f5f7fa;
      font-weight: bold;
      font-size: 16px;
    }
  }

  .indicator-card {
    .indicator-list {
      .indicator-item {
        margin-bottom: 20px;
        padding: 15px;
        background-color: #f9fafb;
        border-radius: 4px;
        border-left: 4px solid var(--el-color-primary);

        &:last-child {
          margin-bottom: 0;
        }

        .indicator-content {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          font-size: 16px;
          line-height: 36px;

          .bullet {
            color: var(--el-color-primary);
            margin-right: 8px;
            font-size: 16px;
          }

          .indicator-text {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 4px;

            .inline-input {
              margin: 0 4px;

              :deep(.el-input__wrapper) {
                padding: 0 10px;
                box-shadow: 0 0 0 1px #dcdfe6 inset;
              }

              :deep(.el-input__inner) {
                font-size: 15px;
              }

              // &.highlight-input {
              //   :deep(.el-input__wrapper) {
              //     background-color: #fff9e6;
              //     box-shadow: 0 0 0 1px #ffd666 inset;
              //   }

              //   :deep(.el-input__inner) {
              //     text-align: center;
              //     font-weight: bold;
              //     color: #e6a23c;
              //   }
              // }
            }

            .inline-value {
              font-size: 15px;
              // color: #e6a23c;
              // font-weight: bold;
              // padding: 0 2px;
            }
          }
        }

        .indicator-sub {
          display: flex;
          align-items: center;
          padding-left: 20px;
          font-size: 15px;
          line-height: 34px;
          color: #606266;

          .sub-bullet {
            color: #909399;
            margin-right: 8px;
            font-size: 12px;
          }

          .indicator-text {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 4px;

            .inline-input {
              margin: 0 4px;

              :deep(.el-input__wrapper) {
                padding: 0 10px;
                box-shadow: 0 0 0 1px #dcdfe6 inset;
              }

              :deep(.el-input__inner) {
                font-size: 15px;
              }

              // &.highlight-input {
              //   :deep(.el-input__wrapper) {
              //     background-color: #fff9e6;
              //     box-shadow: 0 0 0 1px #ffd666 inset;
              //   }

              //   :deep(.el-input__inner) {
              //     text-align: center;
              //     font-weight: bold;
              //     color: #e6a23c;
              //   }
              // }
            }

            .inline-value {
              font-size: 15px;
              // color: #e6a23c;
              // font-weight: bold;
              // padding: 0 2px;
            }
          }
        }
      }
    }
  }

  .operation-actions {
    text-align: center;
    margin-top: 20px;
    padding: 20px 0;
  }
}
</style>
