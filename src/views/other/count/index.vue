<template>
  <div class="count-container">
    <div class="count-text">
      <vab-count
        v-if="show"
        :decimals="form.decimals"
        :duration="form.duration"
        :end-value="form.endVal"
        :prefix="form.prefix"
        :separator="form.separator"
        :start-value="form.startVal"
        :suffix="form.suffix"
      />
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
      <el-form-item label="前缀">
        <el-input v-model="form.prefix" @change="handleChange" />
      </el-form-item>
      <el-form-item label="后缀">
        <el-input v-model="form.suffix" @change="handleChange" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'Count',
  })
  const show = ref<boolean>(true)
  const form = reactive<any>({
    startVal: 0,
    endVal: 999,
    decimals: 0,
    prefix: '',
    suffix: '',
    separator: ',',
    duration: 8000,
  })
  const handleChange = () => {
    show.value = false
    setTimeout(() => {
      show.value = true
    }, 300)
  }
</script>

<style lang="scss" scoped>
  .count-container {
    .count-text {
      height: 80px;
      margin-bottom: calc(var(--el-margin) / 2);
      font-size: 60px;
      font-weight: bold;
      text-align: center;
      background: linear-gradient(to top, #77e0a0, var(--el-color-primary));
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
</style>
