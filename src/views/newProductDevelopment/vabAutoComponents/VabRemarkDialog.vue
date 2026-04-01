<template>
  <vab-dialog
    v-model="visible"
    :title="props.title"
    width="25%"
    @close="handleCloseDialog"
  >
    <el-input v-model="dRemark" :rows="20" type="textarea" />
    <template #footer>
      <el-button @click="handleCloseDialog">取消</el-button>
      <el-button type="primary" @click="handleConfirmUpdate">确定</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'VabRemarkDialog'
})

const props = defineProps<{
  modelValue: boolean
  title: string
  remark: string
}>()
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
const dRemark = ref<string>('')

watch(() => props.modelValue, (val) => {
  if (val) {
    dRemark.value = props.remark
  }
})
const emit = defineEmits(['update:modelValue', 'update:remark'])
const handleCloseDialog = () => {
  visible.value = false
}
const handleConfirmUpdate = () => {
  emit('update:remark', dRemark.value)
}
</script>
