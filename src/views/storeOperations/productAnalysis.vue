<template>
  <div class="default-table-detail-container">
    <el-page-header :content="'商品分析和操作日志'" @back="goBack" ></el-page-header>
    <el-row :gutter="20">
      <!-- 左侧 -->
      <el-col :span="18">
        <div style="position: relative;">
          <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
            <el-tab-pane label="趋势总览" :name="0">
              <vab-trend-overview />
            </el-tab-pane>
            <el-tab-pane label="SP广告饼图" :name="1">
              <vab-ad-pie-tab />
            </el-tab-pane>
            <el-tab-pane label="产品成本分析" :name="2">
              <vab-cost-analysis v-if="activeName === 2" />
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
                <el-checkbox>跳过无数据</el-checkbox>
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
                <el-radio-group v-model="returnRadio">
                  <el-radio-button label="退货时间" :value="0" />
                  <el-radio-button label="下单时间" :value="1" />
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
        <div style="display: flex; flex-direction: column; height: 100%">
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
              <el-text>运营备注</el-text>
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
          <div style="display: flex; flex-direction: column; flex: 1; height: 100%">
            <vab-query-form>
              <vab-query-form-left-panel >
                <el-form inline>
                  <el-form-item>
                    <el-text>操作日志/事件清单</el-text>
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
            <el-table :data="fakeData" border style="flex: 1;" stripe :header-cell-style="{ textAlign: 'center' }">
              <el-table-column label="日期" prop="date" min-width="115" align="center"></el-table-column>
              <el-table-column label="类型" prop="type" min-width="130"></el-table-column>
              <el-table-column label="内容" prop="content" min-width="170">
                <template #default="{ row }">
                  <el-link type="primary">{{ row.content }}</el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
    <vab-dialog
      title="变化详情"
    >
      <el-table>
        
      </el-table>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Star } from '@element-plus/icons-vue'
import { TabsPaneContext } from 'element-plus'
import { adOption, dateOption, dayOption, filterShowOption, levelOption, opeClassOption } from './constantOption'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'

defineOptions({
  name: 'ProductAnalysis',
})

const route: any = useRoute()
const router: any = useRouter()
const tabsStore = useTabsStore()
const { changeTabsMeta, delVisitedRoute } = tabsStore
const routesStore = useRoutesStore()
const { changeActiveMenu } = routesStore

const activeName = ref<number>(0)

// 评分
const rate = ref<number>(4.7)
const returnRadio = ref<number>(0)

// 初始化图片高度
const imageHeight = ref<number>(0)

const fakeData = [
  {
    date: '2024-12-31',
    type: '系统抓取',
    content: '标题修改'
  }
]

const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  router.push({
    path: '/storeOperations/productPerformanceDashboard',
  })
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
const handleTabClick = (tab: TabsPaneContext) => {
  if (tab.props.name != undefined) {
    activeName.value = Number(tab.props.name)
    // window.addEventListener('resize', function () {
    //   chartInstance.resize()
    // })
  }
}

onMounted(() => {
  setImageHeight()
  activeName.value = Number(route.query.activeName);  
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
    // .aside-container {
    //   display: flex;
    //   flex-direction: column;
    //   height: calc(var(--el-container-height) - var(--el-padding) - 52px - 70px) !important;
    // }
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
          background: #ff99cc;
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
    }
  }
}
</style>