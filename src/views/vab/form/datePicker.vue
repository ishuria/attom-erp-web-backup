<template>
  <div class="date-picker-container no-background-container">
    <vab-card shadow="hover">
      <template #header>
        <span>选择日</span>
      </template>
      <el-date-picker v-model="value1" placeholder="选择日期" type="date" />
      <el-date-picker
        v-model="value2"
        :disabled-date="disabledDate"
        placeholder="选择日期"
        :shortcuts="shortcuts"
        type="date"
      />
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>其他日期单位</span>
      </template>
      <el-date-picker
        v-model="value3"
        format="yyyy 第 WW 周"
        placeholder="选择周"
        type="week"
      />
      <el-date-picker v-model="value4" placeholder="选择月" type="month" />
      <el-date-picker v-model="value5" placeholder="选择年" type="year" />
      <el-date-picker
        v-model="value6"
        placeholder="选择一个或多个日期"
        type="dates"
      />
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>选择日期范围</span>
      </template>
      <el-date-picker
        v-model="value7"
        end-placeholder="结束日期"
        range-separator="至"
        start-placeholder="开始日期"
        type="daterange"
      />
    </vab-card>
    <vab-card shadow="hover">
      <template #header>
        <span>选择月份范围</span>
      </template>
      <el-date-picker
        v-model="value8"
        end-placeholder="结束月份"
        range-separator="至"
        start-placeholder="开始月份"
        type="monthrange"
      />
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'DatePicker',
  })

  const disabledDate = (time: any) => {
    return time.getTime() > Date.now()
  }
  const shortcuts: Ref<any> = ref([
    {
      text: '今天',
      value: new Date(),
    },
    {
      text: '昨天',
      value: () => {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24)
        return date
      },
    },
    {
      text: '一周前',
      value: () => {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
        return date
      },
    },
  ])
  const value1: Ref<any> = ref('')
  const value2: Ref<any> = ref('')
  const value3: Ref<any> = ref('')
  const value4: Ref<any> = ref('')
  const value5: Ref<any> = ref('')
  const value6: Ref<any> = ref('')
  const value7: Ref<any> = ref('')
  const value8: Ref<any> = ref('')
</script>

<style lang="scss" scoped>
  .date-picker-container {
    :deep() {
      .el-range-separator {
        box-sizing: content-box;
      }

      .el-input {
        width: 180px;
        margin-bottom: 10px;

        &:first-child {
          margin-right: 10px;
        }

        & + .el-input {
          margin-right: 10px;
          margin-left: 0;
        }
      }
    }
  }
</style>
