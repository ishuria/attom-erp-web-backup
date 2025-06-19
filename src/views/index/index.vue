<template>
  <div class="index-container no-background-container">
    <el-row :gutter="20">
      <!-- 第一层 -->
      <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <top-card background="white" :count-config="countConfig1"  percentage="10%" title="本月总提成" >
          <template #select>
            <el-select v-model="type" size="small" >
              <el-option 
                v-for="item in selectOption"
                :label="item.label"
                :key="item.value"
                :value="item.value"
              />
            </el-select>
          </template>
          <template #chart>
            <vab-commission-chart-pie :data="pieList" />
          </template>
        </top-card>
      </el-col>
      <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <top-card v-if="ableViewCard" background="white" percentage="30%" title="本月考核完成数">
          <template #count>
            <vab-count
              :decimals="countConfig2.decimals"
              :duration="countConfig2.duration"
              :end-value="countConfig2.endValue"
              :prefix="countConfig2.prefix"
              :separator="countConfig2.separator"
              :start-value="countConfig2.startValue"
              :suffix="countConfig2.suffix"
            />
            <vab-count
              :decimals="countConfig3.decimals"
              :duration="countConfig3.duration"
              :end-value="countConfig3.endValue"
              :prefix="countConfig3.prefix"
              :separator="countConfig3.separator"
              :start-value="countConfig3.startValue"
              :suffix="countConfig3.suffix"
            />
          </template>
          <template #chart>
            <assessment-pie :percentage="30" />
          </template>
        </top-card>
      </el-col>
      <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <top-card v-if="ableViewCard" background="white" percentage="44%" title="OEM完成数" >
          <template #count>
            <vab-count
              :decimals="countConfig2.decimals"
              :duration="countConfig2.duration"
              :end-value="countConfig2.endValue"
              :prefix="countConfig2.prefix"
              :separator="countConfig2.separator"
              :start-value="countConfig2.startValue"
              :suffix="countConfig2.suffix"
            />
            <vab-count
              :decimals="countConfig3.decimals"
              :duration="countConfig3.duration"
              :end-value="countConfig3.endValue"
              :prefix="countConfig3.prefix"
              :separator="countConfig3.separator"
              :start-value="countConfig3.startValue"
              :suffix="countConfig3.suffix"
            />
          </template>
          <template #chart>
            <assessment-pie :percentage="33" />
          </template>
        </top-card>
      </el-col>
      <el-col :lg="4" :md="12" :sm="24" :xl="4" :xs="24">
        <top-card v-if="ableViewCard" background="white" :count-config="countConfig4"  percentage="10%" title="推进中的项目" url="/newProductDevelopment/newProductProgress">
          <template #chart>
            <in-progress-projects-bar />
          </template>
        </top-card>
      </el-col>
      <!-- 第二层 -->
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <!-- <pending2 /> -->
      </el-col>
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <version-information />
      </el-col>
      <!-- 第三层 -->
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <!-- <recommendation2 /> -->
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
import { redColorList } from '../commission/constantOption'
import { colorList } from '../storeOperations/constantOption'
import { ROLE_ADMINBUYERLEAD_CODE, ROLE_BOSS_CODE, ROLE_PRODUCTMANAGER_CODE, ROLE_PRODUCTMANNAGERLEAD_CODE } from '/@/const/role'
import { useAclStore } from '/@/store/modules/acl'

defineOptions({
  name: 'Index',
})

const currentRoleCode = useAclStore().getRole[0];
const ableViewCard = currentRoleCode === ROLE_BOSS_CODE || currentRoleCode === ROLE_PRODUCTMANAGER_CODE || currentRoleCode === ROLE_PRODUCTMANNAGERLEAD_CODE || currentRoleCode === ROLE_ADMINBUYERLEAD_CODE;
const type = ref<number>(0)
const selectOption = [
  { label: '站点', value: 0 },
  { label: '类型', value: 1 }
]
let pieList = [ 
  {
    name:"亚马逊US美国",
    value: 3187.54
  },
  {
    name:"亚马逊UK英国",
    value: 17.15
  },
  {
    name:"亚马逊DE德国",
    value:136.93
  },
  {
    name:"亚马逊CA加拿大",
    value:0.00
  },
  {
    name:"沃尔玛US美国",
    value:0.00
  },
  {
    name:"亚马逊MX墨西哥",
    value:0.00
  },
  {
    name:"亚马逊BR巴西",
    value:0.00
  },
  {
    name:"亚马逊IT意大利",
    value:-13.20
  },
  {
    name:"亚马逊FR法国",
    value:-0.19
  },
  {
    name:"亚马逊ES西班牙",
    value:-0.05
  },
  {
    name:"亚马逊NL荷兰",
    value:0.00
  },
  {
    name:"亚马逊SE瑞典",
    value:0.00
  },
  {
    name:"亚马逊TR土耳其",
    value:0.00
  },
  {
    name:"亚马逊PL波兰",
    value:0.00
  },
  {
    name:"亚马逊BE比利时",
    value:6.93
  },
  {
    name:"亚马逊JP日本",
    value:0.00
  },
  {
    name:"Tiktok美国",
    value:0.00
  }
]

const countConfig1 = reactive<any>({
  startValue: 0,
  endValue: random(1, 50),
  decimals: 2,
  prefix: '￥',
  suffix: '',
  separator: ',',
  duration: 1000,
})
const countConfig2 = reactive<any>({
  startValue: 0,
  endValue: 3,
  decimals: 0,
  prefix: '',
  suffix: '/',
  separator: ',',
  duration: 1000,
})
const countConfig3 = reactive<any>({
  startValue: 0,
  endValue: 10,
  decimals: 0,
  prefix: '',
  suffix: '',
  separator: ',',
  duration: 1000,
})
const countConfig4 = reactive<any>({
  startValue: 0,
  endValue: random(1, 50),
  decimals: 0,
  prefix: '',
  suffix: '个',
  separator: ',',
  duration: 1000,
})
onBeforeMount(() => {
  let i = 0
  pieList = pieList.map((item: any, index: number) => {
    const trueValue = item.value
    const itemStyle = { color: colorList[index] }
    if (item.value < 0) {
      item.value = Math.abs(item.value)
      itemStyle.color = redColorList[i]
      i++
    }
    return {
      name: item.name,
      value: item.value,
      trueValue,
      itemStyle,
    }
  })
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