<template>
  <div class="default-table-detail-container">
    <el-page-header :content="'商品分析和操作日志'" @back="goBack" ></el-page-header>
    <el-row :gutter="20">
      <!-- 左侧 -->
      <el-col :span="18">
        <div style="position: relative;">
          <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
            <el-tab-pane label="趋势总览" :name="0">
              <vab-card style="height: 550px; margin-bottom: 10px; display: flex; flex-direction: column;">
                <el-row :gutter="20">
                  <!-- 总销售额 -->
                  <el-col :span="4">
                    <vab-card class="top-card" shadow="always" @click="handleCard1Click">
                      <div class="parting-line" :class="{ 'parting-line-primary': card1Active }" ></div>
                      <el-dropdown >
                        <span>
                          {{ card1Text }}
                          <el-icon class="el-icon--right">
                            <arrow-down />
                          </el-icon>
                        </span>
                        <template #dropdown>
                          <el-dropdown-menu style="max-height: 450px; overflow: auto;">
                            <el-dropdown-item
                              v-for="(item, index) in dropdownItems"
                              :key="index"
                              @click="handleSwitchItem1(item.label)"
                              
                            >
                              {{ item.label }}
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                      <p>
                        {{ formattedAmount }}
                      </p>
                      <div class="bottom bottom-down">
                        $47.026.96
                        <vab-icon icon="arrow-down-line" />
                        <span>{{ '-9.75%' }}</span>
                      </div>
                    </vab-card>
                  </el-col>
                  <el-col :span="4">
                    <vab-card class="top-card" shadow="always" @click="handleCard2Click">
                      <div class="parting-line" :class="{ 'parting-line-orange': card2Active }" ></div>
                      <el-dropdown>
                        <span>
                          {{ card2Text }}
                          <el-icon class="el-icon--right">
                            <arrow-down />
                          </el-icon>
                        </span>
                        <template #dropdown>
                          <el-dropdown-menu style="max-height: 450px; overflow: auto;">
                            <el-dropdown-item
                              v-for="(item, index) in dropdownItems"
                              :key="index"
                              @click="handleSwitchItem2(item.label)"
                            >
                              {{ item.label }}
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                      <p>
                        {{ formattedAmount }}
                      </p>
                      <div class="bottom bottom-down">
                        $47.026.96
                        <vab-icon icon="arrow-down-line" />
                        <span>{{ '-9.75%' }}</span>
                      </div>
                    </vab-card>
                  </el-col>
                  <el-col :span="4">
                    <vab-card class="top-card" shadow="always" @click="handleCard3Click">
                      <div class="parting-line" :class="{ 'parting-line-green': card3Active }" ></div>
                      <el-dropdown>
                        <span>
                          {{ card3Text }}
                          <el-icon class="el-icon--right">
                            <arrow-down />
                          </el-icon>
                        </span>
                        <template #dropdown>
                          <el-dropdown-menu style="max-height: 450px; overflow: auto;">
                            <el-dropdown-item
                              v-for="(item, index) in dropdownItems"
                              :key="index"
                              @click="handleSwitchItem3(item.label)"
                            >
                              {{ item.label }}
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                      <p>
                        {{ formattedAmount }}
                      </p>
                      <div class="bottom bottom-down">
                        $47.026.96
                        <vab-icon icon="arrow-down-line" />
                        <span>{{ '-9.75%' }}</span>
                      </div>
                    </vab-card>
                  </el-col>
                  <el-col :span="4">
                    <vab-card class="top-card" shadow="always" @click="handleCard4Click">
                      <div class="parting-line" :class="{ 'parting-line-red': card4Active }" ></div>
                      <el-dropdown>
                        <span>
                          {{ card4Text }}
                          <el-icon class="el-icon--right">
                            <arrow-down />
                          </el-icon>
                        </span>
                        <template #dropdown>
                          <el-dropdown-menu style="max-height: 450px; overflow: auto;">
                            <el-dropdown-item
                              v-for="(item, index) in dropdownItems"
                              :key="index"
                              @click="handleSwitchItem4(item.label)"
                            >
                              {{ item.label }}
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                      <p>
                        {{ '26.58%' }}
                      </p>
                      <div class="bottom bottom-down">
                        $47.026.96
                        <vab-icon icon="arrow-down-line" />
                        <span>{{ '-9.75%' }}</span>
                      </div>
                    </vab-card>
                  </el-col>
                  <el-col :span="4">
                    <vab-card class="top-card" shadow="always" @click="handleCard5Click">
                      <div class="parting-line" :class="{ 'parting-line-purple': card5Active }" ></div>
                      <el-dropdown>
                        <span>
                          {{ card5Text }}
                          <el-icon class="el-icon--right">
                            <arrow-down />
                          </el-icon>
                        </span>
                        <template #dropdown>
                          <el-dropdown-menu style="max-height: 450px; overflow: auto;">
                            <el-dropdown-item
                              v-for="(item, index) in dropdownItems"
                              :key="index"
                              @click="handleSwitchItem5(item.label)"
                            >
                              {{ item.label }}
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                      <p>
                        {{ formattedAmount }}
                      </p>
                      <div class="bottom bottom-down">
                        $47.026.96
                        <vab-icon icon="arrow-down-line" />
                        <span>{{ '-9.75%' }}</span>
                      </div>
                    </vab-card>
                  </el-col>
                  <el-col :span="4">
                    <vab-card class="top-card" shadow="always" @click="handleCard6Click">
                      <div class="parting-line" :class="{ 'parting-line-yellow': card6Active }" ></div>
                      <el-dropdown>
                        <span>
                          {{ card6Text }}
                          <el-icon class="el-icon--right">
                            <arrow-down />
                          </el-icon>
                        </span>
                        <template #dropdown>
                          <el-dropdown-menu style="max-height: 450px; overflow: auto;">
                            <el-dropdown-item
                              v-for="(item, index) in dropdownItems"
                              :key="index"
                              @click="handleSwitchItem6(item.label)"
                            >
                              {{ item.label }}
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                      <p>
                        {{ '15.24%' }}
                      </p>
                      <div class="bottom bottom-down">
                        $47.026.96
                        <vab-icon icon="arrow-down-line" />
                        <span>{{ '-9.75%' }}</span>
                      </div>
                    </vab-card>
                  </el-col>
                </el-row>
                <vab-query-form>
                  <vab-query-form-right-panel :span="24">
                    <el-radio-group v-model="radio" size="small" @change="handleSwitchTime">
                      <el-radio-button label="日" value="day" />
                      <el-radio-button label="周" value="week" />
                      <el-radio-button label="月" value="month" />
                    </el-radio-group>
                  </vab-query-form-right-panel>
                </vab-query-form>
                <div ref="chartContainer" style="height: 350px;"></div>
              </vab-card>
              <div style="text-align: right; margin-bottom: 10px;">
                <el-popover :width="240" popper-style="max-height: 550px; overflow: auto;">
                  <template #reference>
                    <el-button>
                      <vab-icon icon="settings-line" />
                    </el-button>
                  </template>
                  <!-- <vab-draggable v-model="columns" :animation="600" handle=".handle" filter=".non-draggable" :onMove="handleMove">
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
                  </vab-draggable> -->
                </el-popover>
              </div>
              <el-table
                border 
                :header-cell-style="{ textAlign: 'center' }"
              >
                <el-table-column label="日期" prop="" min-width="115"></el-table-column>
                <el-table-column label="售价" prop="" min-width="90"></el-table-column>
                <el-table-column label="销售额" prop="" min-width="100"></el-table-column>
                <el-table-column label="销量" prop="" min-width="90"></el-table-column>
                <el-table-column label="自然单" prop="" min-width="100"></el-table-column>
                <el-table-column label="广告单" prop="" min-width="100"></el-table-column>
                <el-table-column label="广告占比" prop="" min-width="100"></el-table-column>
                <el-table-column label="CPA" prop="" min-width="80"></el-table-column>
                <el-table-column label="总访客" prop="" min-width="100"></el-table-column>
                <el-table-column label="PC访客" prop="" min-width="100"></el-table-column>
                <el-table-column label="广告访客" prop="" min-width="100"></el-table-column>
                <el-table-column label="自然访客" prop="" min-width="100"></el-table-column>
                <el-table-column label="广告转化率" prop="" min-width="110"></el-table-column>
                <el-table-column label="自然转化率" prop="" min-width="110"></el-table-column>
                <el-table-column label="综合转化率" prop="" min-width="110"></el-table-column>
                <el-table-column label="广告预算" prop="" min-width="100"></el-table-column>
                <el-table-column label="实际花费" prop="" min-width="100"></el-table-column>
                <el-table-column label="ACOS" prop="" min-width="80"></el-table-column>
                <el-table-column label="CPC" prop="" min-width="80"></el-table-column>
                <el-table-column label="VOC缺陷率" prop="" min-width="110"></el-table-column>
                <el-table-column label="小类排名" prop="" min-width="100"></el-table-column>
                <el-table-column label="大类排名" prop="" min-width="100"></el-table-column>
                <el-table-column label="退款率" prop="" min-width="100"></el-table-column>
                <el-table-column label="退货率" prop="" min-width="100"></el-table-column>
                <el-table-column label="FBA配送费" prop="" min-width="110"></el-table-column>
                <!-- <template #empty>
                  <el-empty class="vab-data-empty"></el-empty>
                </template> -->
              </el-table>
              <vab-pagination 
                :current-page="queryForm.pageNo"
                :page-size="queryForm.pageSize"
                :total="total"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
              />
            </el-tab-pane>
            <el-tab-pane label="SP广告饼图" :name="1">
              <vab-ad-pie-tab />
            </el-tab-pane>
            <el-tab-pane label="产品成本分析" :name="2">
              <vab-cost-analysis />
            </el-tab-pane>
            <el-tab-pane label="评论Reviews" :name="3">
              <vab-comment-reviews />
            </el-tab-pane>
            <el-tab-pane label="退货分析" :name="4">
              <vab-return-analysis />
            </el-tab-pane>
            <el-tab-pane label="竞品" :name="5"></el-tab-pane>
          </el-tabs>
        
          <!-- tab右边的选项 -->
          <div style="position: absolute; top: 0px; right: -9px;">
            <el-form v-if="activeName === 0" inline>
              <el-form-item label="展示">
                <el-select>
                  <el-option 
                    v-for="item in levelOption"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-radio-group>
                  <el-radio value="0" style="margin-right: 10px;">同比</el-radio>
                  <el-radio value="1">环比</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-select>
                  <el-option 
                    v-for="item in dateOption"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  range-separator="至"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
            <el-form v-if="activeName === 1" inline>
              <el-form-item>
                <el-select>
                  <el-option 
                    v-for="item in adOption"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-checkbox>过滤无数据</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-select>
                  <el-option 
                    v-for="item in dayOption"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  range-separator="至"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
            <el-form v-if="activeName === 2" inline>
              <el-form-item>
                <el-select>
                  <el-option 
                    v-for="item in dateOption"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  range-separator="至"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
            <el-form v-if="activeName === 3" inline>
              <el-form-item>
                <el-select>
                  <el-option 
                    v-for="item in dateOption"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  range-separator="至"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
            <el-form v-if="activeName === 4" inline>
              <el-form-item>
                <el-radio-group>
                  <el-radio-button label="退货时间" value="time1" />
                  <el-radio-button label="下单时间" value="time2" />
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-select>
                  <el-option 
                    v-for="item in dayOption"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  range-separator="至"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
      <!-- 右侧 -->
      <el-col :span="6">
        <div>
          <vab-card>
            <el-container style="display: flex; gap: 10px; align-items: flex-start;">
              <!-- 左侧图片 -->
              <el-aside :style="{ maxWidth: imageHeight + 'px', padding: '0' }">
                <el-image src="https://picsum.photos/200/200" style="border-radius: 10px; display: block;">
                  <template #error><el-icon></el-icon></template>
                </el-image>
              </el-aside>
              <!-- 右侧内容 -->
              <el-main style="flex: 1; padding: 0; font-weight: 600;">
                <!-- 标题和描述 -->
                <div style="margin-bottom: 15px;">
                  <el-link data-label="asin" class="custom-link" type="primary" style="font-weight: 600;">
                    {{ 'B08N5M7S6K' }}
                  </el-link>
                  <div style="margin-top: 6px;">NiHome-0451-MshRmLightSmallBRN</div>
                  <div style="margin-top: 6px;">蘑菇小夜灯-小号棕色底座款</div>
                  <!-- 评分部分 -->
                  <div class="rate-wrapper">
                    <span class="rate-value">{{ 4.6 }}</span>
                    <span><el-rate v-model="rate" :void-icon="Star" disabled class="custom-rate"  /></span>
                    <span class="rate-count">{{ 484 }}</span>
                  </div>
                </div>
                <!-- 买家之声和缺陷率 -->
                <div style="font-weight: 600;">
                  <el-link type="primary" class="custom-link" style="margin-right: 10px; font-weight: 600;">买家之声</el-link>
                  <el-tag style="background-color: #bad411; color: #fff; border-radius: 17px; padding: 0 30px;">
                    Good
                  </el-tag>
                  <div data-label="缺陷率" style="margin-top: 6px;">
                    缺陷率：<span style="color: #bad411;">4.09%</span> | 缺陷订单：<span style="color: #bad411;">40</span>/1201
                  </div>
                </div>
              </el-main>
            </el-container>
          </vab-card>
          <!-- 运营备注 -->
          <div style="margin-bottom: 20px;">
            <div style="margin-bottom: 10px;">
              运营备注 
              <el-select style="width: 30%; margin-left: 10px;">
                <el-option 
                  v-for="item in opeClassOption"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                />
              </el-select>
            </div>
            <el-input type="textarea" resize="none" :rows="6" placeholder="请输入运营备注" style="width: 100%;" />
          </div>
          <!-- 操作日志/事件清单 -->
          <div>
            <vab-query-form>
              <vab-query-form-left-panel >
                <el-form inline>
                  <el-form-item>
                    <span style="font-size: 20px;">操作日志/事件清单</span>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary">新增</el-button>
                  </el-form-item>
                </el-form>
              </vab-query-form-left-panel>
              <vab-query-form-right-panel >
                <el-form inline>
                  <el-form-item label="筛选展示">
                    <el-select>
                      <el-option 
                        v-for="item in filterShowOption"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
              </vab-query-form-right-panel>
            </vab-query-form>
            <el-table border stripe :header-cell-style="{ textAlign: 'center' }">
              <el-table-column label="日期"></el-table-column>
              <el-table-column label="类型"></el-table-column>
              <el-table-column label="内容"></el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Star } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { TabsPaneContext } from 'element-plus'
import { adOption, dateOption, dayOption, filterShowOption, levelOption, opeClassOption } from './constantOption'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'

defineOptions({
  name: 'ProductAnalysis',
})

const route: any = useRoute()
const tabsStore = useTabsStore()
const { changeTabsMeta, delVisitedRoute } = tabsStore
const routesStore = useRoutesStore()
const { changeActiveMenu } = routesStore

const activeName = ref<number>(0)
// 切换日，周，月
const radio = ref<string>('day')
// 评分
const rate = ref<number>(4.7)
const amount = 42442.71
// 控制数字显示为美元形式
const formattedAmount = amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
const chartContainer = ref(null)
let chartInstance: any = null
// 初始化图片高度
const imageHeight = ref<number>(0)
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
// 六个卡片是否选择状态
const card1Active = ref<boolean>(false)
const card2Active = ref<boolean>(false)
const card3Active = ref<boolean>(false)
const card4Active = ref<boolean>(false)
const card5Active = ref<boolean>(false)
const card6Active = ref<boolean>(false)
const card1Text = ref<string>('总销售额')
const card2Text = ref<string>('广告销售额')
const card3Text = ref<string>('广告花费')
const card4Text = ref<string>('ACOS')
const card5Text = ref<string>('点击成本')
const card6Text = ref<string>('TACOS')

const dropdownItems = ref([
  { label: '总销售额' },
  { label: '广告销售额' },
  { label: '广告花费' },
  { label: '净利润' },
  { label: '预计下月仓储费' },
  { label: '点击成本' },
  { label: '售价' },
  { label: 'CPA' },
  { label: '广告转化率' },
  { label: '自然转化率', },
  { label: '综合转化率', },
  { label: '退货率', },
  { label: '退款率', },
  { label: '净利润率', },
  { label: '毛利润率', },
  { label: 'TACOS', },
  { label: 'ACOS', },
  { label: '广告点击率', },
  { label: '总访客', },
  { label: 'PC端访客', },
  { label: '移动端访客', },
  { label: '自然点击/访客', },
  { label: '广告点击/访客', },
  { label: 'Rating', },
  { label: '库存', },
  { label: '小类排名', },
  { label: '大类排名', },
  { label: '广告展现量', },
  { label: '退货量', },
  { label: '退货金额', },
  { label: '毛利润', },
])

type IData = {
  date: string
  adSales: number
  organicSales: number
  totalSales: number
  adSalesData: number
  adCostData: number
  netProfitData: number
  expectedStorageCostData: number
  clickCost: number
  priceData: number
  cpa: number
  adConversionRate: number
  naturalConversionRate: number
  overallConversionRate: number
  returnRate: number
  refundRate: number
  netProfitMargin: number
  grossProfitMargin: number
  tacos: number
  acos: number
}
type IDataProp = 'adSales' | 'organicSales'
  | 'totalSales' | 'adSalesData' | 'adCostData' | 'netProfitData' | 'expectedStorageCostData'
  | 'clickCost' | 'priceData' | 'cpa'
  | 'adConversionRate' | 'naturalConversionRate' | 'overallConversionRate'
  | 'returnRate' | 'refundRate' | 'netProfitMargin' | 'grossProfitMargin' | 'tacos' | 'acos'

const data: IData[] = [
  { date: "2023-10-14", adSales: 10, organicSales: 20, totalSales: 5, adSalesData: 15 , adCostData: 20, netProfitData: 33, expectedStorageCostData: 25, clickCost: 12, priceData: 60, cpa: 90, adConversionRate: 66, 
    naturalConversionRate: 100, overallConversionRate: 90, returnRate: 80, refundRate: 70, netProfitMargin: 110, grossProfitMargin: 120, tacos: 105, acos: 115
   },
  { date: "2024-10-19", adSales: 5, organicSales: 10, totalSales: 5, adSalesData: 15, adCostData: 20, netProfitData: 33, expectedStorageCostData: 25, clickCost: 12, priceData: 60, cpa: 90, adConversionRate: 66, 
    naturalConversionRate: 100, overallConversionRate: 90, returnRate: 80, refundRate: 70, netProfitMargin: 110, grossProfitMargin: 120, tacos: 105, acos: 115
   },
  { date: "2024-11-01", adSales: 10, organicSales: 20, totalSales: 5, adSalesData: 15, adCostData: 20, netProfitData: 33, expectedStorageCostData: 25, clickCost: 12, priceData: 60, cpa: 90, adConversionRate: 66, 
    naturalConversionRate: 100, overallConversionRate: 90, returnRate: 80, refundRate: 70, netProfitMargin: 110, grossProfitMargin: 120, tacos: 105, acos: 115
   },
  { date: "2024-11-02", adSales: 5, organicSales: 10, totalSales: 5, adSalesData: 15, adCostData: 20, netProfitData: 33, expectedStorageCostData: 25, clickCost: 12, priceData: 60, cpa: 90, adConversionRate: 66, 
    naturalConversionRate: 100, overallConversionRate: 90, returnRate: 80, refundRate: 70, netProfitMargin: 110, grossProfitMargin: 120, tacos: 105, acos: 115
   },
  { date: "2024-12-01", adSales: 10, organicSales: 20, totalSales: 5, adSalesData: 15, adCostData: 20, netProfitData: 33, expectedStorageCostData: 25, clickCost: 12, priceData: 60, cpa: 90, adConversionRate: 66, 
    naturalConversionRate: 100, overallConversionRate: 90, returnRate: 80, refundRate: 70, netProfitMargin: 110, grossProfitMargin: 120, tacos: 105, acos: 115
   },
  { date: "2024-12-02", adSales: 5, organicSales: 10, totalSales: 5, adSalesData: 15, adCostData: 20, netProfitData: 33, expectedStorageCostData: 25, clickCost: 12, priceData: 60, cpa: 90, adConversionRate: 66, 
    naturalConversionRate: 100, overallConversionRate: 90, returnRate: 80, refundRate: 70, netProfitMargin: 110, grossProfitMargin: 120, tacos: 105, acos: 115
   },
  { date: "2024-12-08", adSales: 10, organicSales: 20, totalSales: 5, adSalesData: 15, adCostData: 20, netProfitData: 33, expectedStorageCostData: 25, clickCost: 12, priceData: 60, cpa: 90, adConversionRate: 66, 
    naturalConversionRate: 100, overallConversionRate: 90, returnRate: 80, refundRate: 70, netProfitMargin: 110, grossProfitMargin: 120, tacos: 105, acos: 115
   },
  { date: "2024-12-09", adSales: 10, organicSales: 20, totalSales: 5, adSalesData: 15, adCostData: 20, netProfitData: 33, expectedStorageCostData: 25, clickCost: 12, priceData: 60, cpa: 90, adConversionRate: 66, 
    naturalConversionRate: 100, overallConversionRate: 90, returnRate: 80, refundRate: 70, netProfitMargin: 110, grossProfitMargin: 120, tacos: 105, acos: 115
   }
]

// 按周分组并累加
const getWeeklyData = (data: IData[], type: IDataProp): any[] => {
  const weeklyData: Record<string, number> = {}

  // 遍历数据，按周累加
  data.forEach((item) => {
    const week = getWeekOfYear(item.date) // 获取 "YYYY-Wxx"
    if (!weeklyData[week]) {
      weeklyData[week] = 0 
    }
    weeklyData[week] += item[type] 
  })

  return Object.keys(weeklyData).map((week) => ({
    date: week,
    [type]: weeklyData[week],
  }))
}
// 按月分组并累加
const getMonthlyData = (data: IData[], type: IDataProp): any[] => {
  const monthlyData: any = {}
  data.forEach((item) => {
    const month = item.date.slice(0, 7) // 提取 "YYYY-MM"
    if (!monthlyData[month]) {
      monthlyData[month] = 0 // 初始化
    }
    monthlyData[month] += item[type] // 累加值
  })

  return Object.keys(monthlyData).map((month) => ({
    date: month,
    [type]: monthlyData[month],
  }))
}
// 判断是否可选择，已选中需要取消选中再进行选择
const handleCanSelect = (cardActive: boolean) => {
  if (cardActive) {
    $baseMessage('请先取消选中，再进行选择！', 'error')
    return false
  }
  return true
}
const handleSwitchItem1 = (dataName: string) => {
  const can = handleCanSelect(card1Active.value)
  if (can) {
    card1Text.value = dataName
    card1Active.value = false
  }
}
const handleSwitchItem2 = (dataName: string) => {
  const can = handleCanSelect(card2Active.value)
  if (can) {
    card2Text.value = dataName
    card2Active.value = false
  }
}
const handleSwitchItem3 = (dataName: string) => {
  const can = handleCanSelect(card3Active.value)
  if (can) {
    card3Text.value = dataName
    card3Active.value = false
  }
}
const handleSwitchItem4 = (dataName: string) => {
  const can = handleCanSelect(card4Active.value)
  if (can) {
    card4Text.value = dataName
    card4Active.value = false
  }
}
const handleSwitchItem5 = (dataName: string) => {
  const can = handleCanSelect(card5Active.value)
  if (can) {
    card5Text.value = dataName
    card5Active.value = false
  }
}
const handleSwitchItem6 = (dataName: string) => {
  const can = handleCanSelect(card6Active.value)
  if (can) {
    card6Text.value = dataName
    card6Active.value = false
  }
}
/**
 * @description 计算当前日期是该年的第几周,生成字符串
 * @param date 
 */
function getWeekOfYear(date: Date | string | number): string {
  // 确保当前日期 date 参数可以被解析为有效的日期对象
  const currentDate = new Date(date)
  if (isNaN(currentDate.getTime())) {
    throw new Error("提供的日期无效")
  }

  const year = currentDate.getFullYear()
  // startDate为当年的第一天
  const startDate = new Date(year, 0, 1)

  // 计算当前日期与第一天的差值，单位是天
  const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))

  // 计算当前日期属于哪一周
  const weekNumber = Math.ceil((daysDiff + 1) / 7)

  return `${year}-W${weekNumber}`
}

const groups = {
  price1: ['总销售额', '广告销售额', '广告花费', '净利润', '预计下月仓储费'],
  price2: ['点击成本', '售价', 'CPA'],
  percent1: ['广告转化率', '自然转化率', '综合转化率'],
  percent2: ['退货率', '退款率', '净利润率', '毛利润率', 'TACOS', 'ACOS'],
  percent3: ['广告点击率'],
  int1: ['总访客', 'PC端访客', '移动端访客', '自然访客', '广告访客'],
  int2: ['Rating'],
  int3: ['库存'],
  int4: ['小类排名'],
  int5: ['大类排名']
}
/**
 * @description 获取字段所属组
 * @param item 所有可以选择的字段
 */
function getGroup(item: string): string | null {
  for (const [group, fields] of Object.entries(groups)) {
    if (fields.includes(item)) {
      return group
    }
  }
  return null
}

// name -> prop
const nameMapProp: Record<string, IDataProp> = {
  '广告销量': 'adSales',
  '自然销量': 'organicSales',
  '总销售额': 'totalSales',
  '广告销售额': 'adSalesData',
  '广告花费': 'adCostData',
  '净利润': 'netProfitData',
  '预计下月仓储费': 'expectedStorageCostData',
  '点击成本': 'clickCost',
  '售价': 'priceData',
  'CPA': 'cpa',
  '广告转化率': 'adConversionRate',
  '自然转化率': 'naturalConversionRate',
  '综合转化率': 'overallConversionRate',
  '退货率': 'returnRate',
  '退款率': 'refundRate',
  '净利润率': 'netProfitMargin',
  '毛利润率': 'grossProfitMargin',
  'TACOS': 'tacos',
  'ACOS': 'acos',
}

// 初始化选中状态
let selectedItems: string[] = []
const option = ref<any>({})

// 切换 日，周，月
const handleSwitchTime = () => {
 
  let adSalesData: any[] = []
  let organicSalesData: any[] = []
  if (radio.value === 'day') {
    adSalesData = data
    organicSalesData = data
  } else if (radio.value === 'week') {
    adSalesData = getWeeklyData(data, 'adSales')
    organicSalesData = getWeeklyData(data, 'organicSales')
  } else if (radio.value === 'month') {
    adSalesData = getMonthlyData(data, 'adSales')
    organicSalesData = getMonthlyData(data, 'organicSales')
  }
  option.value.xAxis.data = adSalesData.map((item: any) => item.date)
  option.value.series[0].data = adSalesData.map((d: any) => d.adSales)
  option.value.series[1].data = organicSalesData.map((d: any) => d.organicSales)

  updateYAxisData(data)
  updateChart()
}
// 更新 Y 轴数据随时间切换的函数
const updateYAxisData = (data: any[]) => {
  option.value.series.forEach((s: any, index: number) => {
    if (index !== 0 && index !== 1) {
      const prop = nameMapProp[s.name]
      let processedData: any[] = []
      if (radio.value === 'day') {
        processedData = data
      } else if (radio.value === 'week') {
        processedData = getWeeklyData(data, prop)
      } else if (radio.value === 'month') {
        processedData = getMonthlyData(data, prop)
      }
      s.data = processedData.map((d: any) => d[prop]) 
    }
  })
}
// 初始化图表
const initChart = () => {
  // 初始化图表的配置项
  option.value = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '6%',
      bottom: '7%',
      right: '7%',
    },
    xAxis: {
      type: 'category',
      data: data.map((item: any) => item.date),
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '广告/自然销量',
        position: 'left',
        nameTextStyle: {
          color: '#409EFF',
          align: 'center',
        },
        axisLabel: {
          fontWeight: 'bold',
        },
        min: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#409EFF',
          },
        },
      },
      // {
      //   type: 'value',
      //   name: '总销售额',
      //   position: 'right',
      //   axisLabel: {
      //     formatter: '${value}',
      //     fontWeight: 'bold',
      //   },
      //   min: 0,
      //   nameTextStyle: {
      //     color: '#f7ab1b',
      //     align: 'left',
      //   },
      //   axisLine: {
      //     show: true,
      //     lineStyle: {
      //       color: '#f7ab1b',
      //     },
      //   },
      //   splitLine: {
      //     show: false,
      //   },
      // },
      // {
      //   type: 'value',
      //   name: '花费',
      //   offset: 70,
      //   position: 'right',
      //   axisLabel: {
      //     formatter: '${value}',
      //     fontWeight: 'bold',
      //   },
      //   min: 0,
      //   nameTextStyle: {
      //     color: '#40c9c6',
      //     align: 'left',
      //   },
      //   axisLine: {
      //     show: true,
      //     lineStyle: {
      //       color: '#40c9c6',
      //     },
      //   },
      //   splitLine: {
      //     show: false,
      //   },
      // },
    ],
    series: [
      {
        name: '广告销量',
        type: 'bar',
        yAxisIndex: 0,
        data: data.map((item: any) => item.adSales),
        barWidth: 20,
        itemStyle: {
          color: '#409EFF',
        },
        opacity: 0.9,
        stack: 'sales'
      },
      {
        name: '自然销量',
        type: 'bar',
        yAxisIndex: 0,
        data: data.map((item: any) => item.organicSales),
        barWidth: 20,
        itemStyle: {
          color: '#67C23A',
        },
        opacity: 0.9,
        stack: 'sales'
      },
    ],
  };

  // 设置图表实例的配置项
  chartInstance.setOption(option.value);
}

// 更新图表
const updateChart = () => {
  chartInstance.setOption(option.value, true) // 第二个参数 `true` 表示合并旧的配置
}

const yAxisMapping = new Map() // 字段所属的组 -> yAxisIndex
let currentYAxisCount = 1 // 当前已有的 Y 轴数量（柱状图默认占用 yAxis[0]）

function updateYAxisOffsets() {
  // 重设每个 Y 轴的 offset，确保不重叠
  option.value.yAxis.forEach((yAxis: any, index: number) => {
    yAxis.offset = Math.floor(index / 2) * 60; // 每两个 Y 轴之间间隔 60px
    // 保证 Y 轴位置不重叠
    yAxis.position = index % 2 === 0 ? 'left' : 'right'
  })
}
function handleSelectionChange(selected: boolean, dataGroup: IDataGroup, dataName: string) {
  if (selected) {
    let yAxisIndex: number

    // 1. 处理是否共用y轴还是添加新的y轴
    if (!yAxisMapping.has(dataGroup)) {
      // 如果该数据组没有对应的 Y 轴，动态添加
      if (currentYAxisCount >= 4) {
        $baseMessage('最多只能支持三个额外的 Y 轴，请重新选择', 'error')
        return true
      }
      yAxisIndex = currentYAxisCount
      yAxisMapping.set(dataGroup, yAxisIndex)
 
      // 新增 Y 轴配置
      option.value.yAxis.push({
        type: 'value',
        name: dataName,
        position: currentYAxisCount % 2 === 0 ? 'left' : 'right',
        offset: (Math.floor(currentYAxisCount / 2)) * 60,
        nameTextStyle: {
          fontWeight: 'bold',
          color: getYAxisColor(dataGroup),
        },
        axisLabel: {
          fontWeight: 'bold',
        },
        min: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: getYAxisColor(dataGroup),
          },
        },
        splitLine: {
          show: false,
        },
      })

      currentYAxisCount++
      updateYAxisOffsets()
    } else {
      // 如果该数据组已有 Y 轴，复用它
      yAxisIndex = yAxisMapping.get(dataGroup)
    }

    // 添加新 series
    option.value.series.push({
      name: dataName, 
      type: 'line', 
      yAxisIndex, 
      data: getDataForName(dataGroup, dataName),
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        color: getYAxisColor(dataGroup),
      },
      itemStyle: {
        color: getYAxisColor(dataGroup),
      },
    })
  } else {
    // 取消选中时，移除选中的字段
    const index = selectedItems.findIndex((item: string) => item === dataName)
    if (index !== -1) {
      selectedItems.splice(index, 1)
    }
    // 取消选中时，移除对应的 series
    const seriesIndex = option.value.series.findIndex((s: any) => s.name === dataName)
    if (seriesIndex !== -1) {
      option.value.series.splice(seriesIndex, 1) // 移除对应的 series
    }
  
    // 如果当前字段所属的组的所有 series 都被移除，移除对应的 Y 轴
    const isGroupEmpty = option.value.series.every(
      (s: any) => s.yAxisIndex !== yAxisMapping.get(dataGroup)
    )
    
    if (isGroupEmpty) {
      const yAxisIndex = yAxisMapping.get(dataGroup)

      yAxisMapping.delete(dataGroup)
      currentYAxisCount--

      // 更新所有 series 的 yAxisIndex
      option.value.series.forEach((s: any) => {
        if (s.yAxisIndex > yAxisIndex) {
          s.yAxisIndex--  // 大于已删除的 Y 轴的index，都减一
        }
      })

      // 移除 Y 轴配置
      option.value.yAxis = option.value.yAxis.filter((yAxis: any, index: number) => index !== yAxisIndex)

      updateYAxisIndex()  // 更新 yAxisMapping 和 series 的对应索引
      updateYAxisOffsets()
    }
  }
  updateChart()
  return false
}

// 更新剩余的 Y 轴和系列的索引
function updateYAxisIndex() {
  Array.from(yAxisMapping.keys()).forEach((group, index) => {
    yAxisMapping.set(group, index + 1) // 保留 0 为柱状图
    option.value.series.forEach((s: any) => {
      if (s.yAxisIndex === index + 1) {
        s.yAxisIndex = index + 1
      }
    })
  })
}
type IDataGroup =  'price1' | 'price2' | 'percent1'| 'percent2'
//| 'percent3'| 'int1'| 'int2'| 'int3'| 'int4'| 'int5'
/**
 *  percent3: '广告点击率',
    int1: '总访客',
    int2: 'Rating',
    int3: '库存',
    int4: '小类排名',
    int5: '大类排名',
 * 
 */

// 获取数据组对应的颜色
function getYAxisColor(groupName: IDataGroup) {
  const colorMap = {
    'price1': '#f7ab1b',  // 总销售额, 广告销售额等（黄色）
    'price2': '#40c9c6',  // 点击成本, 售价等（青色）
    'percent1': '#8a7ae3',  // 广告转化率, 自然转化率等（紫色）
    'percent2': '#f26d00',  // 退货率, 净利润率等（橙色）
    'percent3': '#ff99cc',  // 广告点击率（粉色）
    'int1': '#66ccff',  // 总访客, PC端访客等（蓝色）
    'int2': '#ff66ff',  // Rating 等（紫红色）
    'int3': '#4c9900',  // 库存等（绿色）
    'int4': '#ff6666',  // 小类排名等（红色）
    'int5': '#33cc33',  // 大类排名等（绿色）
  }

  // 默认颜色为灰色
  return colorMap[groupName] || '#999999';
}

// 根据数据组和数据名称获取数据
function getDataForName(dataGroup: IDataGroup, dataName: string) {
  const prop = nameMapProp[dataName]
  return data.map((item: any) => item[prop]) || [];
}

// 处理选中的值重复问题
const handleUnique = (cardText: string) => {
  const index = selectedItems.findIndex((item: string) => item === cardText)
  if (index !== -1) {
    $baseMessage('选中的值不能重复, 请重新选择', 'error')
    return false
  } else {
    selectedItems.push(cardText)
    return true
  }
}
const handleCard1Click = () => {
  card1Active.value = !card1Active.value
  
  // 如果是柱状单独处理
  // if (card1Text.value === '自然销量' || card1Text.value === '广告销量') {
  //   handleBarUpdate(card1Active.value, card1Text.value)
  //   return
  // } else {
  // 处理card选择字段重复，如果重复，选中为false
  if (card1Active.value) {
    const unique = handleUnique(card1Text.value)
    if (!unique) {
      card1Active.value = false
      return
    }
  }
  console.log(card1Text.value);
  const dataGroup = getGroup(card1Text.value) as IDataGroup
  console.log(dataGroup);
  const moreThan3 = handleSelectionChange(card1Active.value, dataGroup, card1Text.value) 
  if (moreThan3) {
    card1Active.value = false
  }
  
}

const handleCard2Click = () => {
  card2Active.value = !card2Active.value
  
  if (card2Active.value) {
    const unique = handleUnique(card2Text.value)
    if (!unique) {
      card2Active.value = false
      return
    }
  }
  const dataGroup = getGroup(card2Text.value) as IDataGroup
  console.log(dataGroup);
  const moreThan3 = handleSelectionChange(card2Active.value, dataGroup, card2Text.value) 
  if (moreThan3) {
    card2Active.value = false
  }
  
}
const handleCard3Click = () => {
  card3Active.value = !card3Active.value

  if (card3Active.value) {
    const unique = handleUnique(card3Text.value)
    if (!unique) {
      card3Active.value = false
      return
    }
  }
  const dataGroup = getGroup(card3Text.value) as IDataGroup
  console.log(dataGroup);
  const moreThan3 = handleSelectionChange(card3Active.value, dataGroup, card3Text.value) 
  if (moreThan3) {
    card3Active.value = false
  }
}
const handleCard4Click = () => {
  card4Active.value = !card4Active.value
  
  if (card4Active.value) {
    const unique = handleUnique(card4Text.value)
    if (!unique) {
      card4Active.value = false
      return
    }
  }
  const dataGroup = getGroup(card4Text.value) as IDataGroup
  console.log(dataGroup);
  const moreThan3 = handleSelectionChange(card4Active.value, dataGroup, card4Text.value) 
  if (moreThan3) {
    card4Active.value = false
  }
}
const handleCard5Click = () => {
  card5Active.value = !card5Active.value
  
  if (card5Active.value) {
    const unique = handleUnique(card5Text.value)
    if (!unique) {
      card5Active.value = false
      return
    }
  }
  const dataGroup = getGroup(card5Text.value) as IDataGroup
  console.log(dataGroup);
  const moreThan3 = handleSelectionChange(card5Active.value, dataGroup, card5Text.value) 
  if (moreThan3) {
    card5Active.value = false
  }
}
const handleCard6Click = () => {
  card6Active.value = !card6Active.value
 
  if (card6Active.value) {
    const unique = handleUnique(card6Text.value)
    if (!unique) {
      card6Active.value = false
      return
    }
  }
  const dataGroup = getGroup(card6Text.value) as IDataGroup
  console.log(dataGroup);
  const moreThan3 = handleSelectionChange(card6Active.value, dataGroup, card6Text.value) 
  if (moreThan3) {
    card6Active.value = false
  }
  
}

const handleTabClick = (tab: TabsPaneContext) => {
  if (tab.props.name != undefined) {
    activeName.value = Number(tab.props.name)
  }
}
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  history.back()
}
// 动态设置图片列高度
const setImageHeight = () => {
  const dom1 = document.querySelector('.el-link[data-label="asin"]');
  const dom2 = document.querySelector('div[data-label="缺陷率"]');

  if (dom1 && dom2) {
    const height1 = dom1.getBoundingClientRect();
    const height2 = dom2.getBoundingClientRect();
    imageHeight.value = height2.bottom - height1.top;
  }
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  // fetchData()
}

onMounted(() => {
  setImageHeight()
  if (chartContainer.value) {
    chartInstance = echarts.init(chartContainer.value)
    initChart()
  }
  handleSwitchTime()
})

</script>

<style lang="scss" scoped>
.default-table-detail-container {
  :deep() {
    .el-form--inline {
      .el-form-item {
        margin-right: 10px;
      }
    }

    .el-descriptions__label {
      min-width: 80px !important;
      text-align: right;
    }

    .vab-query-form {
      .left-panel {
        margin-bottom: 0;
      }
      .right-panel {
        margin-bottom: 0;
      }
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
      .rate-count {
        color: #36788C;
        margin-left: -11px;
      }
    }
    .custom-link.is-underline::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      height: 0;
      bottom: 0;
      border-bottom: 1px solid var(--el-color-primary);
    }
    .top-card {
      position: relative;
      height: 126px !important;
      border-radius: 7%;

      &:hover {
        cursor: pointer;
      }
    
      .el-card__body {
        padding-top: 0;
        padding-left: 10px;
        padding-right: 10px;
        padding-bottom: 10px;
      }
      .el-tag {
        float: right;
      }
    
      .parting-line {
        float: top;
        width: 100%;
        height: 6px;
        margin-bottom: 10px;
        background: #e9f5fe;
        clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
        /* 梯形形状：
          - 左上角 (0, 0)
          - 右上角 (100%, 0)
          - 右下角 (95%, 100%)
          - 左下角 (5%, 100%) */
        &-primary {
          background: #409EFF;
        }
        &-orange {
          background: #E6A23C;
        }
        &-green {
          background: #34a9a9;
        }
        &-red {
          background: #e36060;
        }
        &-purple {
          background: #8a7ae3; // 一种柔和的紫色
        }
        &-yellow {
          background: #ffd700; // 明亮的金黄色
        }
      }
      p {
        margin-top: 13px;
        margin-bottom: 13px;
        font-size: 28px;
        font-weight: 600;
      }

      .right-icon {
        position: absolute;
        top: 50%;
        right: 20px;
        width: 60px;
        height: 60px;
        line-height: 60px;
        color: var(--el-color-primary);
        text-align: center;
        background: var(--el-color-primary-light-9);
        border-radius: 50%;
        transform: translateY(-50%);

        i {
          font-size: 35px;
        }
      }

      .bottom {
        &-up {
          .ri-arrow-up-line {
            width: 18px;
            height: 18px;
            margin: 0 3px 0 2px;
            color: var(--el-color-success);
            background: var(--el-color-success-light);
            border-radius: 50%;
          }

          span {
            color: var(--el-color-success);
          }
        }
        &-down {
          .ri-arrow-down-line {
            width: 18px;
            height: 18px;
            margin: 0 3px 0 2px;
            color: var(--el-color-warning);
            background: var(--el-color-warning-light);
            border-radius: 50%;
          }

          span {
            color: var(--el-color-warning);
          }
        }
      }
    }
    .el-tabs {
      border-radius: var(--el-border-radius-base);

      &__header {
        border-top-left-radius: var(--el-border-radius-base);
        border-top-right-radius: var(--el-border-radius-base);
      }

      &__nav-wrap {
        border-radius: var(--el-border-radius-base);
      }
      .el-tabs__item.is-active {
        background-color: rgb(78, 136, 243, 0.1);
      }
      .el-tab-pane {
        display: flex;
        flex-direction: column;
        height: calc(var(--el-container-height) - var(--el-padding) - 52px - 70px) !important;

        .el-table {
          flex: 1;
        }
      }
    }
  }
}
</style>