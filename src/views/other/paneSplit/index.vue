<template>
  <div class="pane-split-container no-background-container table-auto-height">
    <vab-card class="hidden-sm-and-up">
      <el-alert :closable="false" title="手机端不支持面板分割演示" type="error" />
    </vab-card>
    <vab-card class="hidden-xs-only">
      <vab-pane-split ratio="2/3">
        <template #one>
          <div class="pane-split-left">A</div>
        </template>
        <template #two>
          <vab-pane-split class="pane-split-right" horizontal>
            <template #one>
              <div class="pane-split-up">B</div>
            </template>
            <template #two>
              <div class="pane-split-down">C</div>
            </template>
          </vab-pane-split>
        </template>
      </vab-pane-split>
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'PaneSplit',
  })
</script>

<style lang="scss" scoped>
  .pane-split-container {
    width: 100%;
    height: calc(var(--el-keep-alive-height) - var(--el-padding)) !important;

    @mixin panel {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: var(--el-font-size-max);
      font-weight: bold;
      color: var(--el-color-white);
      user-select: none;
    }

    .pane-split-left {
      background-color: var(--el-color-primary);
      @include panel;
    }

    .pane-split-right {
      .pane-split-up {
        @include panel;
        background-color: var(--el-color-warning);
      }

      .pane-split-down {
        @include panel;
        background-color: var(--el-color-success);
      }
    }
  }
</style>
