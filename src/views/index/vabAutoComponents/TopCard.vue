<template>
  <vab-card class="top-card" :class="'top-card-' + background">
    <el-row>
      <el-col :span="12">
        {{ title }}
        <template v-if="$slots.select">
          <slot name="select"></slot>
        </template>
        <p>
          <template v-if="$slots.count">
            <slot name="count">
            </slot>
          </template>
          <template v-else>
            <vab-count
              :decimals="countConfig.decimals"
              :duration="countConfig.duration"
              :end-value="countConfig.endValue"
              :prefix="countConfig.prefix"
              :separator="countConfig.separator"
              :start-value="countConfig.startValue"
              :suffix="countConfig.suffix"
            />
          </template>
          
          <vab-icon icon="bar-chart-2-fill" style="font-size: 20px; color: var(--el-color-info); margin-left: 5px" @click="handleJumpTo" />
        </p>
    
        <div v-if="icon" class="right-icon">
          <vab-icon :icon="icon" />
        </div>

        <div class="bottom">
          <div>
            较上月
            <vab-icon v-if="monthDiff >= 0" icon="arrow-up-line" />
            <vab-icon v-else icon="arrow-down-line" />
            <span :class="monthDiff >= 0 ? 'text-success' : 'text-danger'">{{ monthDiff }}%</span>
          </div>
          <div>
            较去年
            <vab-icon v-if="yearDiff >= 0" icon="arrow-up-line" />
              <vab-icon v-else icon="arrow-down-line" />
            <span :class="yearDiff >= 0 ? 'text-success' : 'text-danger'">{{ yearDiff }}%</span>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <template v-if="$slots.chart">
          <slot name="chart"></slot>
        </template>
        <template v-if="$slots.date">
          <slot name="date"></slot>
        </template>
      </el-col>
    </el-row>
  </vab-card>
</template>

<script lang="ts" setup>
import { random } from 'lodash-es'

defineOptions({
  name: 'TopCard',
})

const router = useRouter()

const props = defineProps({
  url: {
    type: String,
    default: 'index'
  },
  background: {
    type: String,
    default: 'white',
  },
  title: {
    type: String,
    default: 'Test',
  },
  icon: {
    type: String,
    default: '',
  },
  monthDiff: {
    type: Number,
    default: 0,
  },
  yearDiff: {
    type: Number,
    default: 0,
  },
  countConfig: {
    type: Object,
    default: () => {
      return {
        startValue: 0,
        endValue: random(1000, 20000),
        decimals: 0,
        prefix: '',
        suffix: '',
        separator: ',',
        duration: 8000,
      }
    },
  },
})
const emit = defineEmits(['open-table'])
const handleJumpTo = async () => {
  emit('open-table')
}
</script>

<style lang="scss" scoped>
.top-card {
  position: relative;
  height: 168px !important;

  :deep() {
    .el-select {
      transform: translateX(-10px);
      margin-top: -2px;
      min-width: 20px;
      width: 60px;
      float: right;
    }
    .el-button {
      transform: translateX(5px);
      margin-top: -2px;
      min-width: 50px;
      width: 60px;
      float: right;
    }
  }

  p {
    font-size: 23px;
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
    .ri-arrow-up-line {
      width: 18px;
      height: 18px;
      margin: 0 3px 0 1px;
      color: var(--el-color-success);
      background: var(--el-color-success-light);
      border-radius: 50%;
      transform: scale(0.8);
    }

    .ri-arrow-down-line {
      width: 18px;
      height: 18px;
      margin: 0 3px 0 1px;
      color: var(--el-color-danger);
      background: var(--el-color-danger-light);
      border-radius: 50%;
      transform: scale(0.8);
    }

    .text-success {
      color: var(--el-color-success);
    }
    .text-danger {
      color: var(--el-color-danger);
    }
  }

  &-blue {
    color: var(--el-color-white);
    background: var(--el-color-primary);
    background: linear-gradient(90deg, var(--el-color-primary-light-4), var(--el-color-primary));

    .right-icon {
      color: var(--el-color-primary);
      background: var(--el-color-white);
    }

    .bottom {
      .ri-arrow-up-line {
        color: var(--el-color-primary);
        background: var(--el-color-white);
      }

      span {
        color: var(--el-color-white);
      }
    }
  }
}
</style>