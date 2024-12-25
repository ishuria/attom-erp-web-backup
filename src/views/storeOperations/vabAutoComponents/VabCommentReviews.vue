<template>
  <div class="comment-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <vab-card class="comment-card comment-card-green" shadow="always">
          <div class="parting-line parting-line-green" ></div>
          <div class="comment-title">
            <vab-icon icon="emotion-happy-line" class="title-icon title-icon-green" />
            <span class="title-text title-text-green">好评</span>
            <span class="title-sub">（4-5星）</span>
          </div>
          <div class="comment-data">
            <div>
              <p class="comment-label">好评数</p>
              <p class="comment-value">0</p>
            </div>
            <div class="comment-item center">
              <p class="comment-label">好评率</p>
              <p class="comment-value">0%</p>
            </div>
          </div>
        </vab-card>
      </el-col>
      <el-col :span="8">
        <vab-card class="comment-card comment-card-orange" shadow="always">
          <div class="parting-line parting-line-orange" ></div>
          <div class="comment-title">
            <vab-icon icon="emotion-normal-line" class="title-icon title-icon-orange" />
            <span class="title-text title-text-orange">中评</span>
            <span class="title-sub">（3星）</span>
          </div>
          <div class="comment-data">
            <div>
              <p class="comment-label">中评数</p>
              <p class="comment-value">0</p>
            </div>
            <div class="comment-item center">
              <p class="comment-label">中评率</p>
              <p class="comment-value">0%</p>
            </div>
          </div>
        </vab-card>
      </el-col>
      <el-col :span="8">
        <vab-card class="comment-card comment-card-red" shadow="always">
          <div class="parting-line parting-line-red" ></div>
          <div class="comment-title">
            <vab-icon icon="emotion-unhappy-line" class="title-icon title-icon-red" />
            <span class="title-text title-text-red">差评</span>
            <span class="title-sub">（1-2星）</span>
          </div>
          <div class="comment-data">
            <div>
              <p class="comment-label">差评数</p>
              <p class="comment-value">0</p>
            </div>
            <div class="comment-item center">
              <p class="comment-label">差评率</p>
              <p class="comment-value">0%</p>
            </div>
          </div>
        </vab-card>
      </el-col>
    </el-row>
    <div style="position: relative;">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="4-5星" :name="0">
          <el-table border>
            <el-table-column label="图片"></el-table-column>
            <el-table-column label="ASIN"></el-table-column>
            <el-table-column label="评级"></el-table-column>
            <el-table-column label="点赞数"></el-table-column>
            <el-table-column label="Review ID"></el-table-column>
            <el-table-column label="评价内容"></el-table-column>
            <el-table-column label="买家信息"></el-table-column>
            <el-table-column label="国家"></el-table-column>
            <el-table-column label="店铺"></el-table-column>
            <el-table-column label="评价时间"></el-table-column>
            <el-table-column label="更新时间"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="1-3星" :name="1">
          <el-table border>
            <el-table-column label="图片"></el-table-column>
            <el-table-column label="ASIN"></el-table-column>
            <el-table-column label="评级"></el-table-column>
            <el-table-column label="点赞数"></el-table-column>
            <el-table-column label="Review ID"></el-table-column>
            <el-table-column label="评价内容"></el-table-column>
            <el-table-column label="买家信息"></el-table-column>
            <el-table-column label="国家"></el-table-column>
            <el-table-column label="店铺"></el-table-column>
            <el-table-column label="评价时间"></el-table-column>
            <el-table-column label="更新时间"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- tab右边的选项 -->
      <div style="position: absolute; top: 0px; right: -9px;">
        <el-form inline>
          <el-form-item>
            <el-input placeholder="请输入搜索关键词" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search"></el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'

const activeName = ref<number>(0)

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
        background: #67C23A;
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
          color: #67C23A;
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
          color: #67C23A;
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
  
}

</style>