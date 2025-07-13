<template>
  <el-popover v-model:visible="visible" class="box-item" placement="bottom-start" :width="350">
    <template #reference>
      <vab-icon class="vab-box hidden-xs-only" icon="apps-2-ai-line" />
    </template>

    <div class="popover-content">
      <div v-for="(item, index) in cards" :key="index" class="card" @click="handleCardClick(item)">
        <div class="card-content">
          <vab-icon class="card-icon" :icon="item.icon" :style="{ backgroundColor: item.bgColor, color: item.color }" />
          <div class="text-wrapper">
            <span class="card-title">{{ translate(item.title) }}</span>
            <span class="card-desc">{{ translate(item.description) }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { translate } from '/@/i18n'

defineOptions({
  name: 'VabBox',
})

const router = useRouter()
const visible = ref<boolean>(false)

// 随机颜色库（可自定义）
const colors = [
  {
    bgColor: 'var(--el-color-primary-light-9)',
    color: 'var(--el-color-primary)',
  },
  {
    bgColor: 'var(--el-color-danger-light-9)',
    color: 'var(--el-color-danger)',
  },
  {
    bgColor: 'var(--el-color-warning-light-9)',
    color: 'var(--el-color-warning)',
  },
  {
    bgColor: 'var(--el-color-success-light-9)',
    color: 'var(--el-color-success)',
  },
  { bgColor: 'var(--el-color-info-light-9)', color: 'var(--el-color-info)' },
  { bgColor: '#F2ECFE', color: '#8545F7' },
  { bgColor: '#E7F8F6', color: '#18BBAA' },
]

// 卡片数据（含 description）
const cards = ref<any>([
  {
    title: '主题配置',
    description: '将主题配置',
    icon: 't-shirt-line',
  },

  {
    title: '数据大屏',
    description: '展示大屏效果',
    icon: 'bar-chart-box-ai-line',
    link: '/dataScreen',
  },
  {
    title: '工作台',
    description: '进入工作台',
    icon: 'artboard-line',
    link: '/workbench',
  },
  {
    title: '角色权限',
    description: '切换用户权限',
    icon: 'user-3-line',
    link: '/operate/permission',
  },
  {
    title: '页面引导',
    description: '开始页面引导',
    icon: 'guide-line',
    link: '/operate/guide',
  },
  {
    title: '门户',
    description: '进入门户',
    icon: 'home-4-line',
    link: '/portal',
  },
  {
    title: '购买链接',
    description: '前往购买正版',
    icon: 'shopping-bag-3-line',
    link: 'https://vuejs-core.cn/authorization/shop-vite.html',
  },
  { title: '帮助文档', description: '获取使用帮助', icon: 'question-line' },
])

// 洗牌算法 - 打乱数组顺序
const shuffle = (arr: any) => {
  const array = [...arr]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// 分配不重复颜色（若卡片数 ≤ 颜色种类）
const assignRandomColors = () => {
  const shuffledColors = shuffle(colors)
  cards.value.forEach((card: any, index: any) => {
    const colorObj = shuffledColors[index % shuffledColors.length] // 防止越界
    card.bgColor = colorObj.bgColor
    card.color = colorObj.color
  })
}

onMounted(() => {
  assignRandomColors()
})

// 点击事件处理
const handleCardClick = (card: any) => {
  const { title, link } = card
  switch (title) {
    case '主题配置': {
      $pub('shop-vite-open-theme')
      visible.value = false
      break
    }
    case '角色权限':
    case '页面引导': {
      if (link) router.push(link)
      visible.value = false
      break
    }
    case '工作台': {
      window.open('#/workbench')
      visible.value = false
      break
    }
    case '数据大屏': {
      window.open('#/dataScreen')
      visible.value = false
      break
    }
    case '购买链接': {
      if (link) window.open(link)
      visible.value = false
      break
    }
    case '帮助文档': {
      $baseAlert(
        '已购买用户请联系客服获取文档，购买地址：<a target="_blank" href="https://vuejs-core.cn/authorization/shop-vite.html">https://vuejs-core.cn/authorization/shop-vite.html</a>'
      )
      visible.value = false
      break
    }
    case '门户': {
      if (link) window.open(link, '_blank')
      visible.value = false
      break
    }
  }
}
</script>

<style lang="scss" scoped>
.vab-box {
  margin-right: var(--el-margin);
  cursor: pointer;
}

.popover-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列 */
  gap: 12px;
  width: 220px; /* 根据内容调整宽度 */
}

.card {
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    background-color: var(--el-color-info-light-9);
  }
}

.card-content {
  display: flex;
  gap: 10px;
  align-items: center;
}

.text-wrapper {
  display: flex;
  flex-direction: column;
}

.card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 20px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card-title {
  font-size: 14px;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.card-desc {
  width: 80px;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  color: var(--el-color-info-light-4);
  white-space: nowrap;
}

.vab-box:hover {
  animation: boxShake 0.5s;
}

@keyframes boxShake {
  0%,
  100% {
    transform: rotate(0);
  }
  20% {
    transform: rotate(-18deg);
  }
  40% {
    transform: rotate(15deg);
  }
  60% {
    transform: rotate(-10deg);
  }
  80% {
    transform: rotate(8deg);
  }
}
</style>
