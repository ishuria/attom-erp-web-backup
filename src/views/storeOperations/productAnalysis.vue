<template>
  <div class="default-table-detail-container">
    <el-page-header :content="'商品分析和操作日志'" @back="goBack" ></el-page-header>
    <el-row :gutter="20">
      <el-col :span="18">
        <div>
          <div style="position: relative;">
            <el-tabs v-model="activeName" type="card" @tab-click="">
              <el-tab-pane label="趋势总览" :name="0">
                <el-row :gutter="20">
                  <el-col :span="4">
                    <vab-card class="top-card" shadow="always" >
                      <div class="parting-line parting-line-primary" ></div>
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
                    <vab-card class="top-card" shadow="always" >
                      <div class="parting-line parting-line-orange" ></div>
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
                    <vab-card class="top-card" shadow="always" >
                      <div class="parting-line parting-line-orange" ></div>
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
                    <vab-card class="top-card" shadow="always" >
                      <div class="parting-line parting-line-orange" ></div>
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
                    <vab-card class="top-card" shadow="always" >
                      <div class="parting-line parting-line-orange" ></div>
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
                    <vab-card class="top-card" shadow="always" >
                      <div class="parting-line parting-line-orange" ></div>
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
                <vab-card style="height: 280px;">
                  <vab-query-form>
                    <vab-query-form-right-panel :span="24">
                      <el-radio-group v-model="radio" >
                        <el-radio-button label="日" value="day" />
                        <el-radio-button label="周" value="weak" />
                        <el-radio-button label="月" value="month" />
                      </el-radio-group>

                    </vab-query-form-right-panel>
                  </vab-query-form>
                </vab-card>
                <el-table
                  border 
                  :header-cell-style="{ textAlign: 'center' }"
                >
                  <el-table-column label="日期"></el-table-column>
                  <el-table-column label="售价"></el-table-column>
                  <el-table-column label="销售额"></el-table-column>
                  <el-table-column label="销量"></el-table-column>
                  <el-table-column label="自然单"></el-table-column>
                  <el-table-column label="广告单"></el-table-column>
                  <el-table-column label="广告占比"></el-table-column>
                  <el-table-column label="CPA"></el-table-column>
                  <el-table-column label="总访客"></el-table-column>
                  <el-table-column label="PC访客"></el-table-column>
                  <el-table-column label="广告访客"></el-table-column>
                  <el-table-column label="自然访客"></el-table-column>
                  <el-table-column label="广告转化率"></el-table-column>
                  <el-table-column label="自然转化率"></el-table-column>
                  <el-table-column label="综合转化率"></el-table-column>
                  <el-table-column label="广告预算"></el-table-column>
                  <el-table-column label="实际花费"></el-table-column>
                  <el-table-column label="ACOS"></el-table-column>
                  <el-table-column label="CPC"></el-table-column>
                  <!-- <template #empty>
                    <el-empty class="vab-data-empty"></el-empty>
                  </template> -->
                </el-table>
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
          
            <div style="position: absolute; top: 0px; right: 0px;">
              <el-form inline>
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
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <vab-card>
            <el-row :gutter="20">
              <el-col :span="9">
                <el-image src="https://picsum.photos/200/200" style="height: 100%;">
                  <template #error>
                    <el-icon></el-icon>
                  </template>
                </el-image>
              </el-col>
              <el-col :span="15" style="line-height: 1.3em;">
                <div style="margin-bottom: 10px;">
                  <el-link type="primary">{{ 'B08N5M7S6K' }}</el-link>
                  <div>NiHome-0451-MshRmLightSmallBRN</div>
                  <div>蘑菇小夜灯-小号棕色底座款</div>
                  <div>
                    <span>4.7</span>
                    <span><el-rate disabled /> </span>
                    <span>484</span>
                  </div>
                </div>
                <div>
                  <el-link type="primary" style="margin-right: 10px;">买家之最</el-link>
                  <el-tag style="background-color: #bad411; color: #fff; width: 7em; height: 1.5em; border-radius: 17px;">Good</el-tag>
                  <div>缺陷率：<span style="color: #bad411;">4.09%</span> | 缺陷订单：<span style="color: #bad411">40</span>/1201</div>
                </div>
              </el-col>
            </el-row>
          </vab-card>
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
            <el-input type="textarea" resize="none" :rows="9" />
          </div>
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
import { dateOption, filterShowOption, levelOption, opeClassOption } from './constantOption'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'
import { ArrowDown } from '@element-plus/icons-vue'

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
const amount = 42442.71
const formattedAmount = amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  history.back()
}
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
    //   border-left: 1px solid black;
    // }
  }

}



.top-card {
  position: relative;
  height: 168px !important;
  border-radius: 7%;

  &:hover {
    .parting-line {
      &-primary {
        background: var(--el-color-primary);
      }
      &-orange {
        background: var(--el-color-warning);
      }
    }
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
    &-danger {
      background: var(--el-color-danger);
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

</style>