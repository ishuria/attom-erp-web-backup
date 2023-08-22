<template>
  <div class="guid-container">
    <el-button type="primary" @click="guide">打开页面引导</el-button>
  </div>
</template>

<script lang="ts" setup>
import intro from 'intro.js'
import 'intro.js/minified/introjs.min.css'

defineOptions({
  name: 'Guide',
})

const guide = () => {
  intro()
    .setOptions({
      steps: [
        {
          element: document.querySelector('.vab-buy'),
          title: '购买源码',
          intro: '这里是购买源码',
          position: 'left',
        },
        {
          element: document.querySelector('.vab-dark'),
          title: '暗黑模式',
          intro: '这里是暗黑模式',
          position: 'left',
        },
        {
          element: document.querySelector('.vab-color-picker'),
          title: '配色',
          intro: '这里是配色',
          position: 'left',
        },
        {
          element: document.querySelector('.ri-t-shirt-line'),
          title: '主题配置',
          intro: '这里是主题配置',
          position: 'left',
        },
        {
          element: document.querySelector('.ri-lock-line'),
          title: '锁屏',
          intro: '这里是锁屏',
          position: 'left',
        },
        {
          element: document.querySelector('.ri-notification-2-line'),
          title: '通知',
          intro: '这里是通知',
          position: 'left',
        },
        {
          element: document.querySelector('.ri-translate-2'),
          title: '国际化',
          intro: '这里是国际化',
          position: 'left',
        },
        {
          element: document.querySelector('.vab-full-screen'),
          title: '全屏',
          intro: '这里是全屏',
          position: 'left',
        },
        {
          element: document.querySelector('.ri-refresh-line'),
          title: '刷新',
          intro: '这里是刷新',
          position: 'left',
        },
        {
          element: document.querySelector('.vab-tabs-more-icon'),
          title: '操作',
          intro: '这里是操作',
          position: 'left',
        },
        {
          element: document.querySelector('.vab-buy'),
          title: '购买源码',
          intro: '这里是购买源码',
          position: 'left',
        },
      ],
      nextLabel: '下一步',
      prevLabel: '上一步',
      doneLabel: '完成',
      showBullets: true,
    })
    .start()
}
</script>

<style lang="scss">
.introjs-tooltip {
  width: 300px;
  background-color: var(--el-color-white);
  border-radius: var(--el-border-radius-base);
  transition: var(--el-transition);
}

.introjs-arrow.right {
  border-left-color: var(--el-color-white);
}

.introjs-button {
  padding: 8px 15px;
  line-height: 1;
  color: var(--el-color-white) !important;
  text-shadow: none;
  background-color: var(--el-color-primary);
  border: 1px solid var(--el-color-primary);
  border-radius: var(--el-border-radius-base);

  &:hover,
  &:active {
    color: var(--el-color-white) !important;
    background-color: var(--el-color-primary);
    border: 1px solid var(--el-color-primary);
    box-shadow: none;
    opacity: 0.6;
  }

  &:focus {
    color: var(--el-color-white) !important;
    background-color: var(--el-color-primary);
    border: 1px solid var(--el-color-primary);
    box-shadow: none;
  }

  &.introjs-disabled {
    display: none;
  }
}

.introjs-overlay {
  pointer-events: none;
}

.introjs-helperLayer.introjs-fixedTooltip {
  pointer-events: none;
  box-shadow:
    var(--el-color-primary) 0px 0px 1px 1px,
    rgba(0, 0, 0, 0.25) 0px 0px 0px 5000px !important;
}

.introjs-tooltip-header {
  padding: var(--el-padding);
  margin-right: 16px;
}

.introjs-tooltiptext {
  padding: calc(var(--el-padding) / 2) var(--el-padding) var(--el-padding) var(--el-padding);
}

.introjs-tooltip-title {
  font-size: var(--el-font-size-default);
  font-weight: normal;
  color: var(--el-text-color-primary);
}

.introjs-skipbutton {
  right: -15px;
  font-weight: normal;
  color: var(--el-color-black) !important;

  &:hover {
    color: var(--el-color-primary) !important;
  }
}

.introjs-bullets {
  padding-top: 0;
}

.introjs-tooltipbuttons {
  border-top: 0;
}
</style>
