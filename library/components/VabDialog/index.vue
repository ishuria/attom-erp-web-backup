<template>
  <el-dialog
    v-model="dialogVisible"
    v-bind="$attrs"
    :append-to-body="appendToBody"
    :class="customClass"
    :draggable="draggable"
    :fullscreen="isFullscreen"
    :lock-scroll="lockScroll"
    :show-close="false"
    :style="{
      transition: animated ? 'var(--el-transition)' : '',
    }"
    :width="width"
  >
    <template #header>
      <slot name="header">
        <div class="el-dialog__title" @dblclick="setFullscreen">{{ title }}</div>
      </slot>
      <button v-if="showClose" class="el-dialog__headerbtn" type="button" @click="closeDialog">
        <el-icon class="el-dialog__close"><close /></el-icon>
      </button>
      <button v-if="showFullscreen" class="el-dialog__headerbtn" style="right: 56px" type="button" @click="setFullscreen">
        <vab-icon class="el-dialog__close el-dialog__fullscreen" :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'" />
      </button>
    </template>
    <div v-loading="loading">
      <slot></slot>
    </div>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'
import { ElDialog } from 'element-plus'

const props = defineProps({
  ...ElDialog.props,
  modelValue: {
    type: Boolean,
    default: false,
  },
  showFullscreen: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  animated: {
    type: Boolean,
    default: true,
  },
  customClass: {
    type: String,
    default: '', //支持空、vab-dialog-info、vab-dialog-primary三种
  },
})
const emit = defineEmits(['update:modelValue'])

const dialogVisible = useVModel(props, 'modelValue', emit)
const isFullscreen = ref<any>(false)

const closeDialog = () => {
  dialogVisible.value = false
  isFullscreen.value = false
}
const setFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}
</script>
