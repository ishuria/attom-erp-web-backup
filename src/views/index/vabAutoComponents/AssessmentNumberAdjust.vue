<template>
  <div>
    <vab-dialog v-model="visible" title="考核数调整" width="800">
    
   
      <div class="slider-demo-block">
        <span class="demonstration">放到下月的完成数</span>
        <el-slider v-model="value" :disabled="disabled" :max="max" show-input :show-tooltip="false" :step="0.01" @input="handleAdjustValue" />
      </div>
      <el-table border :data="list" >
        <el-table-column align="center" label="本月完成数" prop="monthlyCompletion" />
        <el-table-column align="center" label="本月考核数" prop="monthlyAssess" />
        <el-table-column align="center" label="下月完成数" prop="nextMonthCompletion" />
        <el-table-column align="center" label="下月考核数" prop="nextMonthAssess" />
      </el-table>
   
      <template #footer>
        <el-button :disabled="disabled" type="primary" @click="handleConfirm">提交</el-button>
      </template>
    </vab-dialog>
  </div>

</template>

<script lang="ts" setup>
import { getMonthlyAndNextMonthAssess, submitAssess } from '/@/api/devlocal/frontPage'
import { IAssessAdjustRes } from '/@/type/index/frontPage'

defineOptions({
  name: 'AssessmentNumberAdjust',
})

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue', 'update:frontPage'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
watch(() => props.modelValue, async () => {
  if (!props.modelValue) return
  await fetchData()
})
const value = ref<number>(0)
const max = ref<number>(0)
const list = ref<IAssessAdjustRes[]>([])
const disabled = ref<boolean>(false)

const handleConfirm = async () => {
  $baseConfirm("每月只能提交一次且不可修改，是否确认提交？", null, async () => {
    const { data } = await submitAssess({ number: value.value })
    if (data) {
      $baseMessage("提交成功", "success")
      visible.value = false
      emit('update:frontPage')
    }
  })
}
const handleAdjustValue = () => {
  list.value[0].nextMonthCompletion = parseFloat((originalNextMonthCompletion.value + value.value).toFixed(2))
  list.value[0].monthlyCompletion = parseFloat((originalMonthCompletion.value - value.value).toFixed(2))
}
const originalMonthCompletion = ref<number>(0)
const originalNextMonthCompletion = ref<number>(0)
const fetchData = async () => {
  const { data } = await getMonthlyAndNextMonthAssess()
  list.value[0] = data
  max.value = data.monthlyCompletion - data.monthlyAssess
  if (max.value <= 0) {
    disabled.value = true
  }
  originalMonthCompletion.value = data.monthlyCompletion
  originalNextMonthCompletion.value = data.nextMonthCompletion
}
</script>

<style lang="scss" scoped>
.slider-demo-block {
  max-width: 800px;
  display: flex;
  align-items: center;

  .demonstration {
    font-size: 16px;
    margin-top: -10px;
    width: 160px;
  }

  .el-slider {
    margin-top: 10px;
    margin-left: 20px;
    margin-bottom: 20px;
  }
}

</style>