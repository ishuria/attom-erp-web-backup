<template>
  <vab-dialog
    v-model="dflag"
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
  remarkVisible: boolean
  title: string
  remark: string
}>()

const dflag = ref<boolean>(false)
const dRemark = ref<string>('')
watchEffect(() => {
  dflag.value = props.remarkVisible
  dRemark.value = props.remark
})
const emit = defineEmits(['update:remarkVisible', 'update:remark'])
const handleCloseDialog = () => {
  emit('update:remarkVisible', false)
}
const handleConfirmUpdate = () => {
  emit('update:remark', dRemark.value)
}
</script>