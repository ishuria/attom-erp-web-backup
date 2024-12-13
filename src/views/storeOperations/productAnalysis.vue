<template>
  <div class="default-table-detail-container">
    <el-page-header :content="'商品分析和操作日志'" @back="goBack" ></el-page-header>
    <el-row :gutter="20">
      <el-col :span="18">
        <div>
          <div style="position: relative;">
            <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
              <el-tab-pane label="趋势总览" :name="0">
                <el-row :gutter="20">
                  <el-col :span="4">
                    <vab-card class="top-card" shadow="always" @click="handleCard1Click">
                      <div class="parting-line" :class="{ 'parting-line-primary': card1Active }" ></div>
                      <el-dropdown>
                        <span>
                          总销售额
                          <el-icon class="el-icon--right">
                            <arrow-down />
                          </el-icon>
                        </span>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item>Rating</el-dropdown-item>
                            <el-dropdown-item>自然销量</el-dropdown-item>
                            <el-dropdown-item>净利润</el-dropdown-item>
                            <el-dropdown-item>总转化率</el-dropdown-item>
                            <el-dropdown-item>访客数</el-dropdown-item>
                            <el-dropdown-item>点击率</el-dropdown-item>
                            <el-dropdown-item>库存</el-dropdown-item>
                            <el-dropdown-item>售价</el-dropdown-item>
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
                          广告销售额
                          <el-icon class="el-icon--right">
                            <arrow-down />
                          </el-icon>
                        </span>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item>Rating</el-dropdown-item>
                            <el-dropdown-item>自然销量</el-dropdown-item>
                            <el-dropdown-item>净利润</el-dropdown-item>
                            <el-dropdown-item>总转化率</el-dropdown-item>
                            <el-dropdown-item>访客数</el-dropdown-item>
                            <el-dropdown-item>点击率</el-dropdown-item>
                            <el-dropdown-item>库存</el-dropdown-item>
                            <el-dropdown-item>售价</el-dropdown-item>
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
                          花费
                          <el-icon class="el-icon--right">
                            <arrow-down />
                          </el-icon>
                        </span>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item>Rating</el-dropdown-item>
                            <el-dropdown-item>自然销量</el-dropdown-item>
                            <el-dropdown-item>净利润</el-dropdown-item>
                            <el-dropdown-item>总转化率</el-dropdown-item>
                            <el-dropdown-item>访客数</el-dropdown-item>
                            <el-dropdown-item>点击率</el-dropdown-item>
                            <el-dropdown-item>库存</el-dropdown-item>
                            <el-dropdown-item>售价</el-dropdown-item>
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
                          ACOS
                          <el-icon class="el-icon--right">
                            <arrow-down />
                          </el-icon>
                        </span>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item>Rating</el-dropdown-item>
                            <el-dropdown-item>自然销量</el-dropdown-item>
                            <el-dropdown-item>净利润</el-dropdown-item>
                            <el-dropdown-item>总转化率</el-dropdown-item>
                            <el-dropdown-item>访客数</el-dropdown-item>
                            <el-dropdown-item>点击率</el-dropdown-item>
                            <el-dropdown-item>库存</el-dropdown-item>
                            <el-dropdown-item>售价</el-dropdown-item>
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
                          点击成本
                          <el-icon class="el-icon--right">
                            <arrow-down />
                          </el-icon>
                        </span>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item>Rating</el-dropdown-item>
                            <el-dropdown-item>自然销量</el-dropdown-item>
                            <el-dropdown-item>净利润</el-dropdown-item>
                            <el-dropdown-item>总转化率</el-dropdown-item>
                            <el-dropdown-item>访客数</el-dropdown-item>
                            <el-dropdown-item>点击率</el-dropdown-item>
                            <el-dropdown-item>库存</el-dropdown-item>
                            <el-dropdown-item>售价</el-dropdown-item>
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
                          TACOS
                          <el-icon class="el-icon--right">
                            <arrow-down />
                          </el-icon>
                        </span>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item>Rating</el-dropdown-item>
                            <el-dropdown-item>自然销量</el-dropdown-item>
                            <el-dropdown-item>净利润</el-dropdown-item>
                            <el-dropdown-item>总转化率</el-dropdown-item>
                            <el-dropdown-item>访客数</el-dropdown-item>
                            <el-dropdown-item>点击率</el-dropdown-item>
                            <el-dropdown-item>库存</el-dropdown-item>
                            <el-dropdown-item>售价</el-dropdown-item>
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
                <vab-card style="height: 480px;">
                  <vab-query-form>
                    <vab-query-form-right-panel :span="24">
                      <el-radio-group v-model="radio" >
                        <el-radio-button label="日" value="day" />
                        <el-radio-button label="周" value="weak" />
                        <el-radio-button label="月" value="month" />
                      </el-radio-group>
                    </vab-query-form-right-panel>
                  </vab-query-form>
                  <div ref="chartContainer" style="width: 100%; height: 400px;">
                        
                  </div>
                </vab-card>
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

              </el-tab-pane>
              <el-tab-pane label="产品成本分析" :name="2">

              </el-tab-pane>
              <el-tab-pane label="评论Reviews" :name="3">

              </el-tab-pane>
              <el-tab-pane label="退货分析" :name="4">

              </el-tab-pane>
              <el-tab-pane label="竞品" :name="5">

              </el-tab-pane>
            </el-tabs>
          
            <!-- tab右边的选项 -->
            <div style="position: absolute; top: 0px; right: -10px;">
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
                  <el-checkbox>同比</el-checkbox>
                </el-form-item>
                <el-form-item>
                  <el-checkbox>环比</el-checkbox>
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
        </div>
      </el-col>
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
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span >4.7</span>
                    <el-rate v-model="rate" disabled style="font-size: var(--el-font-size-base);"></el-rate>
                    <span style="color: #3c7687;">484</span>
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
              <el-table border stripe :header-cell-style="{ textAlign: 'center' }">
                <el-table-column label="日期"></el-table-column>
                <el-table-column label="类型"></el-table-column>
                <el-table-column label="内容"></el-table-column>
              </el-table>
            </vab-query-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { TabsPaneContext } from 'element-plus'
import { adOption, dateOption, dayOption, filterShowOption, levelOption, opeClassOption } from './constantOption'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

defineOptions({
  name: 'ProductAnalysis',
})

const route: any = useRoute()
const tabsStore = useTabsStore()
const { changeTabsMeta, delVisitedRoute } = tabsStore
const routesStore = useRoutesStore()
const { changeActiveMenu } = routesStore

const activeName = ref<number>(0)
const radio = ref<string>('day')
const rate = ref<number>(4.7)
const amount = 42442.71
const formattedAmount = amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
const chartContainer = ref(null)
let chartInstance: any = null
const imageHeight = ref<number>(0)

// 六个卡片是否选择状态
const card1Active = ref<boolean>(false)
const card2Active = ref<boolean>(false)
const card3Active = ref<boolean>(false)
const card4Active = ref<boolean>(false)
const card5Active = ref<boolean>(false)
const card6Active = ref<boolean>(false)

const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  // fetchData()
}

// 计算该日期是当年的第几周
function getWeekOfYear(date: Date | string | number): number {
  // 确保 date 参数可以被解析为有效的日期对象
  const currentDate = new Date(date)
  if (isNaN(currentDate.getTime())) {
    throw new Error("Invalid date provided")
  }

  // 设置该日期为当年的第一天
  const startDate = new Date(currentDate.getFullYear(), 0, 1)

  // 计算该日期与第一天的差值，单位是天
  const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))

  // 计算该日期属于哪一周
  const weekNumber = Math.ceil((daysDiff + 1) / 7)

  return weekNumber
}

const drawChart = () => {
  // 初始化日期数据
  const dates = [
    '2023-01-01', '2023-01-02', '2023-01-03', '2023-01-04', '2023-01-05',
    '2023-01-06', '2023-01-07', '2023-01-08', '2023-01-09', '2023-01-10',
    '2023-10-14', '2023-10-15', '2023-10-16', '2023-10-17', '2023-10-18',
    '2023-10-19', '2023-10-20', '2023-10-21', '2023-10-22', '2023-10-23',
    '2023-10-24', '2023-10-25', '2023-10-26', '2023-10-27', '2023-10-28',
    '2023-10-29', '2023-10-30', '2023-11-01', '2023-11-03', '2023-11-05',
    '2023-11-07', '2023-11-09', '2023-11-11', '2023-11-13'
  ]

  // 销量
  // const salesVolumeData = [
  //   10, 20, 30, 40, 5,
  //   10, 20, 30, 40, 5,
  //   10, 20, 30, 40, 5,
  //   10, 20, 30, 40, 5,
  //   10, 20, 30, 5, 40,
  //   10, 20, 30, 5, 40,
  //   10, 20, 30, 40
  // ]
  const salesVolumeData = [
    { date: "2024-12-01", value: 10 },
    { date: "2024-12-02", value: 15 },
    { date: "2024-12-08", value: 20 },
    { date: "2024-12-09", value: 25 }
  ]
  // ACOS数据（%）
  const acosData = [
    10, 20, 30, 40, 5,
    10, 20, 30, 40, 5,
    10, 20, 30, 5, 40,
    10, 20, 30, 5, 40,
    10, 20, 30, 40
  ]
  // 广告销售额数据（美元）
  const salesData = dates.map(() => Math.round(Math.random() * 1000))
  // 广告花费数据（美元）
  const costData = dates.map(() => Math.round(Math.random() * 50))

  // 格式化日期为周数组
  const getWeeklyData = (dates: string[]): string[] => {
    const weeks: string[] = []
    let currentWeek = ""

    // 确保日期数组按时间排序
    dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

    dates.forEach(date => {
      const parsedDate = new Date(date)
      if (isNaN(parsedDate.getTime())) {
        console.warn(`Invalid date: ${date}`)
        return;
      }

      const week = getWeekOfYear(parsedDate) // 获取日期的周数
      
      const year = parsedDate.getFullYear()
      const weekIdentifier = `${year}W${week}`

      if (currentWeek !== weekIdentifier) {
        weeks.push(weekIdentifier)
        currentWeek = weekIdentifier
      }
    })

    return weeks
  }

  // 格式化日期为月数组
  const getMonthlyData = (dates: string[]): string[] => {
    let months: string[] = []
    let currentMonth = ""
    dates.forEach(date => {
      const month = date.slice(0, 7) // 取到 'YYYY-MM'
      if (currentMonth !== month) {
        months.push(date.slice(0, 7)) // 按月份的第一天显示
        currentMonth = month
      }
    })
    return months
  }
 

  // function groupByWeek(data: {date: string, value: number}[]) {
  //   const weeklyData: any = {};

  //   data.forEach(({ date, value }) => {
  //     const week = `${dayjs(date).year()}-W${getWeeklyData(date)}`;
  //     if (!weeklyData[week]) weeklyData[week] = 0;
  //     weeklyData[week] += value;
  //   });

  //   return Object.entries(weeklyData).map(([week, total]) => ({
  //     week,
  //     total
  //   }));
  // }

  // const groupedData = groupByWeek(salesVolumeData)

  // 按需切换数据
  let currentView = 'week'  // 默认视图是日视图

  const updateChart = (viewType: string) => {
    let xAxisData: string[] = []

    if (viewType === 'day') {
      xAxisData = dates
    } else if (viewType === 'week') {
      xAxisData = getWeeklyData(dates)
    } else if (viewType === 'month') {
      xAxisData = getMonthlyData(dates)
    }

    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['销量', 'ACOS', '广告销售额', '花费'],
        left: 'center',
      },
      grid: {
        left: '7%',
        bottom: '7%',
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisTick: {
          alignWithLabel: true
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '销量',
          position: 'left',
          nameTextStyle: {
            color: '#409EFF',
            align: 'right',
          },
          axisLabel: {
            formatter: '{value}%',
            fontWeight: 'bold'
          },
          min: 0,
          max: 50,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#409EFF',
            }
          }
        },
        {
          type: 'value',
          name: 'ACOS',
          position: 'left',
          offset: 50,
          nameTextStyle: {
            fontWeight: 'bold',
            align: 'right',
            color: '#8a7ae3'
          },
          axisLabel: {
            fontWeight: 'bold'
          },
          min: 0,
          max: 1800,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#8a7ae3'
            }
          },
          splitLine: {
            show: false
          }
        },
        {
          type: 'value',
          name: '广告销售额',
          position: 'right',
          axisLabel: {
            formatter: '${value}'
          },
          min: 0,
          max: 1800,
          nameTextStyle: {
            color: '#f7ab1b',
            align: 'left',
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#f7ab1b',
            }
          },
          splitLine: {
            show: false
          }
        },
        {
          type: 'value',
          name: '花费',
          offset: 70,
          position: 'right',
          axisLabel: {
            formatter: '${value}'
          },
          min: 0,
          max: 500,
          nameTextStyle: {
            color: '#40c9c6',
            align: 'left',
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#40c9c6',
            }
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: '销量',
          type: 'bar',
          yAxisIndex: 0,
          data: acosData,
          barWidth: 20,
          itemStyle: {
            color: '#409EFF'
          },
          opacity: 0.9
        },
        {
          name: 'ACOS',
          type: 'line',
          yAxisIndex: 1,
          data: salesVolumeData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: '#8a7ae3'
          },
          itemStyle: {
            color: '#8a7ae3'
          }
        },
        {
          name: '广告销售额',
          type: 'line',
          yAxisIndex: 2,
          data: salesData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: '#f7ab1b'
          },
          itemStyle: {
            color: '#f7ab1b'
          }
        },
        {
          name: '花费',
          type: 'line',
          yAxisIndex: 3,
          data: costData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: '#40c9c6'
          },
          itemStyle: {
            color: '#40c9c6'
          },
          areaStyle: {
            color: 'rgba(64, 201, 198, 0.2)'
          }
        }
      ]
    }

    chartInstance.setOption(option)
  }

  updateChart(currentView)
}
const handleCard1Click = () => {
  card1Active.value = !card1Active.value
}
const handleCard2Click = () => {
  card2Active.value = !card2Active.value
}
const handleCard3Click = () => {
  card3Active.value = !card3Active.value
}
const handleCard4Click = () => {
  card4Active.value = !card4Active.value
}
const handleCard5Click = () => {
  card5Active.value = !card5Active.value
}
const handleCard6Click = () => {
  card6Active.value = !card6Active.value
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
onMounted(() => {
  setImageHeight()
  if (chartContainer.value) {
    chartInstance = echarts.init(chartContainer.value)
    drawChart()
  }
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

    .vab-query-form .left-panel {
      margin-bottom: 0;
    }
    .vab-query-form .right-panel {
      margin-bottom: 0;
    }
    // .el-tabs {
    //   border-left: 1px solid var(--el-border-color-light);
    // }
  }

}



.top-card {
  position: relative;
  height: 168px !important;
  border-radius: 7%;

  &:hover {
    cursor: pointer;
  }
  :deep() {
    .el-card__body {
      padding-top: 0;
      padding-left: 10px;
      padding-right: 10px;
    }
    .el-tag {
      float: right;
    }
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
.custom-link.is-underline::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 0;
  bottom: 0;
  border-bottom: 1px solid var(--el-color-primary);
}
</style>