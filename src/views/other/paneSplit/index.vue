<script lang="ts" setup>
  defineOptions({
    name: 'PaneSplit',
  })
</script>

<template>
  <div class="pane-split-container no-background-container">
    <vab-pane-split>
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
  </div>
</template>

<style lang="scss" scoped>
  .pane-split-container {
    width: 100%;
    height: calc($base-keep-alive-height - $base-padding) !important;

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
