<template>
  <div class="time-picker-container no-background-container">
    <vab-card title="固定时间点">
      <el-time-select v-model="value" end="18:30" placeholder="选择时间" start="08:30" step="00:15" />
    </vab-card>
    <vab-card title="固定时间范围">
      <el-time-select v-model="startTime" end="18:30" placeholder="开始时间" start="08:30" step="00:15" style="margin-right: 10px" />
      <el-time-select v-model="endTime" end="18:30" :min-time="startTime" placeholder="结束时间" start="08:30" step="00:15" />
    </vab-card>

    <vab-card title="任意时间点">
      <el-time-picker
        v-model="value1"
        :disabled-hours="disabledHours"
        :disabled-minutes="disabledMinutes"
        :disabled-seconds="disabledSeconds"
        placeholder="任意时间点"
      />
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Timepicker',
})

const value = ref<string>('')
const value1 = ref<any>(new Date(2016, 9, 10, 18, 40))
const startTime = ref<string>('')
const endTime = ref<string>('')

const makeRange = (start: number, end: number) => {
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}

const disabledHours = () => {
  return makeRange(0, 16).concat(makeRange(19, 23))
}
const disabledMinutes: any = (hour: number) => {
  if (hour === 17) {
    return makeRange(0, 29)
  }
  if (hour === 18) {
    return makeRange(31, 59)
  }
}
const disabledSeconds: any = (hour: number, minute: number) => {
  if (hour === 18 && minute === 30) {
    return makeRange(1, 59)
  }
}
</script>

<style scoped>
.time-picker-container {
  :deep() {
    .el-select {
      width: 165px;
    }
  }
}
</style>
