<template>
  <vab-card class="top-card" shadow="always" @click="handleClick">
    <div class="parting-line" :class="partingLineClass"></div>
    <el-dropdown>
      <span>
        {{ title }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu style="max-height: 450px; overflow: auto">
          <el-dropdown-item v-for="(item, index) in dropdownItems" :key="index" :disabled="item.disabled" @click="handleItemClick(item)">
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <p>
      {{ value }}
    </p>
    <div class="bottom" :class="trendClass">
      {{ previousValue }}
      <vab-icon :icon="trendIcon" />
      <span>{{ trendPercentage }}</span>
    </div>
  </vab-card>
</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'

defineOptions({
  name: 'TrendCard',
})

interface DropdownItem {
  label: string
  disabled: boolean
}

interface Props {
  title: string
  value: string | number
  previousValue?: string | number
  trendPercentage?: string
  trendType?: 'up' | 'down' // 趋势类型：上升或下降
  active?: boolean
  colorType?: 'primary' | 'orange' | 'green' | 'red' | 'purple' | 'yellow'
  dropdownItems: DropdownItem[]
}

const props = withDefaults(defineProps<Props>(), {
  previousValue: '',
  trendPercentage: '',
  trendType: 'down',
  active: false,
  colorType: 'primary',
})

const emit = defineEmits<{
  click: []
  itemClick: [item: DropdownItem]
}>()

const partingLineClass = computed(() => {
  return props.active ? `parting-line-${props.colorType}` : ''
})

const trendClass = computed(() => {
  return props.trendType === 'up' ? 'bottom-up' : 'bottom-down'
})

const trendIcon = computed(() => {
  return props.trendType === 'up' ? 'arrow-up-line' : 'arrow-down-line'
})

const handleClick = () => {
  emit('click')
}

const handleItemClick = (item: DropdownItem) => {
  emit('itemClick', item)
}
</script>

<style lang="scss" scoped>
.top-card {
  position: relative;
  height: 120px !important;
  border-radius: 7%;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    cursor: pointer;
  }

  :deep() {
    .el-card__body {
      padding-top: 0;
      padding-right: 10px;
      padding-bottom: 10px;
      padding-left: 10px;
    }
  }

  .parting-line {
    float: top;
    width: 100%;
    height: 6px;
    margin-bottom: 10px;
    clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
    background: #e9f5fe;

    &-primary {
      background: #ff99cc;
    }

    &-orange {
      background: #e6a23c;
    }

    &-green {
      background: #34a9a9;
    }

    &-red {
      background: #e36060;
    }

    &-purple {
      background: #8a7ae3;
    }

    &-yellow {
      background: #ffd700;
    }
  }

  p {
    margin-top: 13px;
    margin-bottom: 13px;
    font-size: 24px;
    font-weight: 550;
  }

  .bottom {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    color: #666;

    &.bottom-up {
      color: #67c23a;
    }

    &.bottom-down {
      color: #f56c6c;
    }
  }
}
</style>
