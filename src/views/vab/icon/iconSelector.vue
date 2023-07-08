<template>
  <div class="icon-selector-container">
    <el-popover
      popper-class="icon-selector-popper"
      trigger="hover"
      :width="305"
    >
      <template #reference>
        <el-button>
          <vab-icon :icon="icon" />
          图标选择器
          <vab-icon icon="arrow-down-s-line" />
        </el-button>
      </template>
      <vab-icon-selector @handle-icon="handleIcon" />
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'IconSelector',
  })
  const icon = ref<string>('24-hours-fill')

  const handleIcon = (item: string) => {
    icon.value = item
  }
</script>
