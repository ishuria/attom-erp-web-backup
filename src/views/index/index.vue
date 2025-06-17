<template>
  <div class="index-container no-background-container">
    <el-row :gutter="20">
      <!-- 第一层 -->
      <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <top-card background="white" :count-config="countConfig2"  percentage="10%" title="本月总提成" />
      </el-col>
      <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <top-card background="white" :count-config="countConfig2" percentage="30%" title="本月考核完成数">
          <!-- <template #tag>
            <el-tag type="danger">日</el-tag>
          </template> -->
          <template #chart>
            <active-users-bar />
          </template>
        </top-card>
      </el-col>
      <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <top-card background="white" :count-config="countConfig2"  percentage="44%" title="OEM完成数" />
      </el-col>
      <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <top-card background="white" :count-config="countConfig2"  percentage="10%" title="推进中的项目" />
      </el-col>
      <!-- 第二层 -->
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <pending2 />
      </el-col>
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <version-information />
      </el-col>
      <!-- 第三层 -->
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <recommendation2 />
      </el-col>
      <!-- 第四层 -->
      <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <performance-history />
      </el-col>
      <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank title="上月超额完成排行" />
      </el-col>
      <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank title="上月提成排行" />
      </el-col>
      <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <rank title="上月新品提成排行(上线1年以内)" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { random } from 'lodash-es'

defineOptions({
  name: 'Index',
})



const countConfig2 = reactive<any>({
  startValue: 0,
  endValue: random(1, 50),
  decimals: 2,
  prefix: '￥',
  suffix: '',
  separator: ',',
  duration: 1000,
})
</script>

<style lang="scss" scoped>
.index-container {
  :deep() {
    .el-card {
      .el-card__header {
        position: relative;

        > div > span {
          display: flex;
          align-items: center;

          i {
            margin-right: 3px;
          }
        }
      }

      .el-card__body {
        position: relative;

        .echarts {
          width: 100%;
          height: 127px;
        }

        .card-footer-tag {
          position: absolute;
          right: var(--el-margin);
          bottom: 15px;
        }
      }
    }
  }
}
</style>