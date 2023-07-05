<template>
  <div class="count-container">
    <div class="count-text">
      <span>{{ output.toFixed(form.decimals) }}</span>
    </div>
    <el-form inline :model="form">
      <el-form-item label="起始值">
        <el-input-number v-model="form.startVal" @change="handleChange" />
      </el-form-item>
      <el-form-item label="最终值">
        <el-input-number v-model="form.endVal" @change="handleChange" />
      </el-form-item>
      <el-form-item label="持续时间">
        <el-input-number v-model="form.duration" @change="handleChange" />
      </el-form-item>
      <el-form-item label="小数位数">
        <el-input-number v-model="form.decimals" @change="handleChange" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  defineOptions({
    name: 'Count',
  })
  const form = reactive({
    startVal: 0,
    endVal: 999,
    decimals: 0,
    duration: 8000,
  })
  const baseNumber = ref(form.startVal)
  let output
  const handleChange = () => {
    baseNumber.value = form.startVal
    output = useTransition(baseNumber, {
      duration: form.duration,
      transition: [0.2, 0.2, 0, 1],
    })
    baseNumber.value = form.endVal
  }
  handleChange()
</script>

<style lang="scss" scoped>
  .count-container {
    .count-text {
      height: 80px;
      margin-bottom: $base-margin;
      font-size: 60px;
      font-weight: bold;
      text-align: center;
      background: linear-gradient(to top, #77e0a0, #75c3e9);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
</style>
