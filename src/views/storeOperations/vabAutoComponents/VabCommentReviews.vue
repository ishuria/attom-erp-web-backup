<template>
  <div class="comment-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <vab-card class="comment-card comment-card-green" shadow="always">
          <div class="parting-line parting-line-green"></div>
          <div class="comment-title">
            <vab-icon class="title-icon title-icon-green" icon="emotion-happy-line" />
            <span class="title-text title-text-green">好评</span>
            <span class="title-sub">（4-5星）</span>
          </div>
          <div class="comment-data">
            <div>
              <p class="comment-label">好评数</p>
              <p class="comment-value">{{ goodCount }}</p>
            </div>
            <div class="comment-item center">
              <p class="comment-label">好评率</p>
              <p class="comment-value">{{ goodRate }}%</p>
            </div>
          </div>
        </vab-card>
      </el-col>

      <el-col :span="8">
        <vab-card class="comment-card comment-card-red" shadow="always">
          <div class="parting-line parting-line-red"></div>
          <div class="comment-title">
            <vab-icon class="title-icon title-icon-red" icon="emotion-unhappy-line" />
            <span class="title-text title-text-red">差评</span>
            <span class="title-sub">（1-3星）</span>
          </div>
          <div class="comment-data">
            <div>
              <p class="comment-label">差评数</p>
              <p class="comment-value">{{ badCount }}</p>
            </div>
            <div class="comment-item center">
              <p class="comment-label">差评率</p>
              <p class="comment-value">{{ badRate }}%</p>
            </div>
          </div>
        </vab-card>
      </el-col>
    </el-row>
    <div style="position: relative">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="全部" :name="-1">
          <el-table border :data="list">
            <el-table-column label="评价时间" prop="reviewDate" width="125">
              <template #default="{ row }">
                {{ row.reviewDate ? row.reviewDate.split(' ')[0] : '' }}
              </template>
            </el-table-column>
            <el-table-column label="更新时间" prop="updateTime" width="125">
              <template #default="{ row }">
                {{ row.updateTime ? row.updateTime.split(' ')[0] : '' }}
              </template>
            </el-table-column>
            <el-table-column label="评级" prop="lastStar" width="150">
              <template #default="{ row }">
                <div class="rate-wrapper" style="cursor: pointer" @click="">
                  <span class="rate-value">{{ row.lastStar }}</span>
                  <span>
                    <el-rate v-model="row.lastStar" class="custom-rate" disabled :void-icon="Star" />
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="点赞数" prop="reviewLikes" width="100" />
            <el-table-column label="Review ID" prop="reviewId" width="180" />
            <el-table-column label="评价内容" prop="lastContent" />
            <el-table-column label="买家信息" prop="author" width="200" />
            <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 300px" />
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
        <el-tab-pane label="4-5星" :name="0">
          <el-table border :data="list">
            <el-table-column label="评价时间" prop="reviewDate" width="125">
              <template #default="{ row }">
                {{ row.reviewDate ? row.reviewDate.split(' ')[0] : '' }}
              </template>
            </el-table-column>
            <el-table-column label="更新时间" prop="updateTime" width="125">
              <template #default="{ row }">
                {{ row.updateTime ? row.updateTime.split(' ')[0] : '' }}
              </template>
            </el-table-column>
            <el-table-column label="评级" prop="lastStar" width="150">
              <template #default="{ row }">
                <div class="rate-wrapper" style="cursor: pointer" @click="">
                  <span class="rate-value">{{ row.lastStar }}</span>
                  <span>
                    <el-rate v-model="row.lastStar" class="custom-rate" disabled :void-icon="Star" />
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="点赞数" prop="reviewLikes" width="100" />
            <el-table-column label="Review ID" prop="reviewId" width="180" />
            <el-table-column label="评价内容" prop="lastContent" />
            <el-table-column label="买家信息" prop="author" width="200" />
            <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 300px" />
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
        <el-tab-pane label="1-3星" :name="1">
          <el-table border :data="list">
            <el-table-column label="评价时间" prop="reviewDate" width="125">
              <template #default="{ row }">
                {{ row.reviewDate ? row.reviewDate.split(' ')[0] : '' }}
              </template>
            </el-table-column>
            <el-table-column label="更新时间" prop="updateTime" width="125">
              <template #default="{ row }">
                {{ row.updateTime ? row.updateTime.split(' ')[0] : '' }}
              </template>
            </el-table-column>
            <el-table-column label="评级" prop="lastStar" width="150">
              <template #default="{ row }">
                <div class="rate-wrapper" style="cursor: pointer" @click="">
                  <span class="rate-value">{{ row.lastStar }}</span>
                  <span>
                    <el-rate v-model="row.lastStar" class="custom-rate" disabled :void-icon="Star" />
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="点赞数" prop="reviewLikes" width="100" />
            <el-table-column label="Review ID" prop="reviewId" width="180" />
            <el-table-column label="评价内容" prop="lastContent" />
            <el-table-column label="买家信息" prop="author" width="200" />
            <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 300px" />
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
      <!-- tab右边的选项 -->
      <div style="position: absolute; top: 0px; right: -9px">
        <el-form inline>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="loading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Search, Star } from '@element-plus/icons-vue'
import { TabsPaneContext } from 'element-plus'
import { getAmazonStarsByStar } from '~/src/utils/rate'
import { getCommentReviews } from '/@/api/devlocal/productAnalysis'
import { IGetCommentReviews } from '/@/type/storeOperation/productAnalysisType'

const props = defineProps<{
  selectDateRange: [string, string]
  asin: string
  site: number
}>()
const activeName = ref<number>(-1)

const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const loading = ref<boolean>(false)

const total = ref<number>(0)

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const list = ref<IGetCommentReviews[]>([])
const goodCount = ref<number>(0)
const badCount = ref<number>(0)
const goodRate = ref<number>(0)
const badRate = ref<number>(0)
const fetchData = async () => {
  loading.value = true
  try {
    const { data } = await getCommentReviews({
      asin: props.asin,
      site: props.site,
      startDate: props.selectDateRange[0],
      endDate: props.selectDateRange[1],
      keyWord: queryForm.keyWord,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
      type: activeName.value,
    })
    list.value = data.list

    total.value = data.total
    goodCount.value = data.goodCount
    badCount.value = data.badCount
    goodRate.value = data.goodRate
    badRate.value = data.badRate
  } catch (error) {
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}
const handleTabClick = async (tab: TabsPaneContext) => {
  const name = tab.props.name
  activeName.value = Number(name)
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.comment-container {
  .el-tab-pane {
    display: flex;
    flex-direction: column;
    height: calc(var(--el-container-height) - var(--el-padding) - 52px - 70px - 214px) !important;

    .el-table {
      flex: 1;
    }
  }

  .comment-card {
    height: 150px;
    position: relative;

    :deep() {
      .el-card__body {
        padding-top: 15px;
        padding-bottom: 15px;
      }
    }

    &-green {
      background-color: #f0f8f1;
    }
    &-orange {
      background-color: #fef7f0;
    }
    &-red {
      background-color: #fdf2f2;
    }

    .parting-line {
      position: absolute;
      top: 0;
      left: 0;
      width: 4px; /* 设置竖线的宽度 */
      height: 100%; /* 竖线高度等于父容器高度 */
      margin-bottom: 10px;
      &-green {
        background: #67c23a;
      }
      &-orange {
        background: #f27a00;
      }
      &-red {
        background: #e52e2e;
      }
    }

    .comment-title {
      display: flex;
      align-items: center;
      font-size: calc(var(--el-font-size-base) + 2px);

      .title-icon {
        font-size: 1.3em;

        margin-right: 5px;

        &-orange {
          color: #f27a00;
        }
        &-green {
          color: #67c23a;
        }
        &-red {
          color: #e52e2e;
        }
      }
      .title-text {
        font-weight: bold;

        &-orange {
          color: #f27a00;
        }
        &-green {
          color: #67c23a;
        }
        &-red {
          color: #e52e2e;
        }
      }
      .title-sub {
        color: #a9a4a1;
        font-size: var(--el-font-size-base);
      }
    }

    .comment-data {
      margin-top: 10px;
      display: flex;
      position: relative;

      /* 中间内容 */
      .comment-item.center {
        margin: 0 auto;
      }

      .comment-label {
        font-size: var(--el-font-size-base);
        color: #a9a4a1;
      }
      .comment-value {
        margin-top: 10px;
        font-size: calc(var(--el-font-size-base) + 10px);
        font-weight: bold;
        color: #000;
      }
    }
  }
  :deep() {
    .el-tabs {
      border-radius: var(--el-border-radius-base);

      &__header {
        border-top-left-radius: var(--el-border-radius-base);
        border-top-right-radius: var(--el-border-radius-base);
        background-color: #fff;
        margin-bottom: 0;
        border-bottom: 0;
      }

      &__nav-wrap {
        border-radius: var(--el-border-radius-base);
      }
      .el-tabs__item.is-active {
        background-color: rgb(78, 136, 243, 0.1);
      }
    }
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
}
</style>
