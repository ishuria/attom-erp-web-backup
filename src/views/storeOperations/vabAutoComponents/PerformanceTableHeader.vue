<template>
  <span v-if="item.label === '销量趋势(点击看明细)'">
    销量趋势
    <br />
    (点击看明细)
  </span>
  <span v-else-if="item.label === '小类排名'">
    小类
    <br />
    (可点)
  </span>
  <span v-else-if="item.label === '大类排名'">
    大类
    <br />
    (可点)
  </span>
  <span v-else-if="item.label === 'VOC满意度'">
    VOC满意度
    <br />
    (点击看明细)
  </span>
  <span v-else-if="item.label === '2周广告点击'">
    2周广告
    <br />
    点击
  </span>
  <span v-else-if="item.prop === 'outletDeal'">
    可报
    <br />
    Outlet Deal
  </span>
  <span v-else-if="item.label === '今销'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        今销
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">今日销售额</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '今广'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        今广
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">今日广告销售占比</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '头部产品#'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        头部产品#
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">
          大于60：头部垄断较小
          <br />
          30 - 60：头部垄断中等
          <br />
          小于30：头部垄断严重
        </div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === 'FBA差异'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        FBA差异
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">=自量FBA - 亚马逊FBA</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '月广%'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        月广%
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">月广告销售占比</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '结算月量'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        结算
        <br />
        月量
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">过去30天的结算销量</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '结算月额'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        结算
        <br />
        月额
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">过去30天的结算销售额</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '订单月量'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        订单月量
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">过去30天的订单销量</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '订单月额'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        订单月额
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">过去30天的订单销售额</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '月净利润'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        月净利润
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">过去30天的净利润</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '月净利'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        月净利
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">过去30天的结算净利润率</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '月退款%'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        月退款%
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">过去30天的退款占比</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '月退货%'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        月退货%
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">过去30天的退货占比</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '月广告销售'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        月广告销售
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">过去30天的广告销售</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '月广告支出'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        月广告支出
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">过去30天的广告支出</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '月ACOS'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        月ACOS
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">过去30天的ACOS</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '月TACOS'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        月TACOS
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">过去30天的TACOS</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '1年ACOS'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        1年ACOS
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">过去360天的ACOS</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '1年TACOS'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        1年TACOS
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">过去360天的TACOS</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === 'FBA仓储费'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        FBA仓储费
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip-new">
          过去30天的FBA仓储费
          <br />
          数值 = 领星的FBA仓储费 + FBA仓储费差异 + FBA长期仓储费 + FBA长期仓储费差异
        </div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '可售总'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        可售总
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">SKU对应ASIN的(总FBA库存+在途数量)的可售天数+断货天数</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '可售'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        可售
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">SKU对应ASIN的总FBA库存数的可售天数</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '2周广告转化'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        2周广告
        <br />
        转化
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">2周订单数之和/2周点击之和</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '2周总转化'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        2周总转化
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">SKU对应的ASIN的2周总转化率</div>
      </template>
    </el-tooltip>
  </span>
  <span v-else-if="item.label === '自量FBA'">
    自量FBA
    <br />
    亚马逊FBA
  </span>
  <span v-else-if="item.label === '剩余库存'">
    <el-tooltip content="" effect="dark" placement="top">
      <div class="questionIcon">
        剩余库存
        <el-icon><question-filled /></el-icon>
      </div>
      <template #content>
        <div class="custom-tooltip">总库存+接收中/可售库存</div>
      </template>
    </el-tooltip>
  </span>
  <!-- 默认显示：如果以上条件都不匹配，直接显示列标题 -->
  <span v-else>{{ item.label }}</span>
</template>

<script lang="ts" setup>
import { QuestionFilled } from '@element-plus/icons-vue'

defineOptions({
  name: 'PerformanceTableHeader',
})

interface Props {
  item: any
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.questionIcon {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    margin-left: 3px;
  }
}
</style>
