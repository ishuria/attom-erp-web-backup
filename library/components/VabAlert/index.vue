<template>
  <el-alert
    v-bind="$attrs"
    :center="center"
    :closable="closable"
    :close-text="closeText"
    :description="description"
    :effect="effect"
    :show-icon="showIcon"
    :title="title"
    :type="type"
  >
    <template #title>
      <slot name="title">
        {{ title }}
      </slot>
    </template>
    <template v-if="description" #default>
      <slot name="default">
        {{ description }}
      </slot>
    </template>
  </el-alert>
</template>

<script setup lang="ts">
import { ElAlert } from 'element-plus'

defineOptions({
  name: 'VabAlert',
})

defineProps({
  ...ElAlert.props,
  closable: {
    type: Boolean,
    default: false,
  },
})
</script>
