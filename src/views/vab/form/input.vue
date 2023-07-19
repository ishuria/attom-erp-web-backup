<template>
  <div class="input-container no-background-container">
    <vab-card>
      <template #header>
        <span>基础用法</span>
      </template>
      <el-space wrap>
        <el-input v-model="input1" placeholder="请输入内容" />
      </el-space>
    </vab-card>
    <vab-card>
      <template #header>
        <span>禁用状态</span>
      </template>
      <el-space wrap>
        <el-input v-model="input2" :disabled="true" placeholder="请输入内容" />
      </el-space>
    </vab-card>
    <vab-card>
      <template #header>
        <span>可清空</span>
      </template>
      <el-space wrap>
        <el-input v-model="input3" clearable placeholder="请输入内容" />
      </el-space>
    </vab-card>
    <vab-card>
      <template #header>
        <span>密码框</span>
      </template>
      <el-space wrap>
        <el-input
          v-model="input4"
          clearable
          placeholder="请输入内容"
          show-password
        />
      </el-space>
    </vab-card>
    <vab-card>
      <template #header>
        <span>带 icon 的输入框</span>
      </template>
      <el-space wrap>
        <el-input
          v-model="input5"
          placeholder="请输入内容"
          :suffix-icon="Search"
        />
        <el-input
          v-model="input6"
          placeholder="请输入内容"
          :prefix-icon="Search"
        />
      </el-space>
    </vab-card>
    <vab-card>
      <template #header>
        <span>复合型输入框</span>
      </template>
      <el-space wrap>
        <el-input v-model="input7" clearable placeholder="请输入内容">
          <template #prepend>Http://</template>
        </el-input>
        <el-input v-model="input8" clearable placeholder="请输入内容">
          <template #append>.com</template>
        </el-input>
        <el-input v-model="input9" clearable placeholder="请输入内容">
          <template #prepend>
            <el-select v-model="select" placeholder="请选择">
              <el-option label="选项1" :value="1" />
              <el-option label="选项2" :value="2" />
              <el-option label="选项3" :value="3" />
            </el-select>
          </template>
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </el-space>
    </vab-card>
    <vab-card>
      <template #header>
        <span>textarea</span>
      </template>
      <el-space wrap>
        <el-input
          v-model="textarea"
          placeholder="请输入内容"
          :rows="2"
          type="textarea"
        />
      </el-space>
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
  import { Search } from '@element-plus/icons-vue'

  defineOptions({
    name: 'Input',
  })

  const input1 = ref<string>('')
  const input2 = ref<string>('')
  const input3 = ref<string>('')
  const input4 = ref<string>('')
  const input5 = ref<string>('')
  const input6 = ref<string>('')
  const input7 = ref<string>('')
  const input8 = ref<string>('')
  const input9 = ref<string>('')
  const select = ref<any>(1)
  const textarea = ref<string>('')
</script>

<style lang="scss" scoped>
  .input-container {
    :deep() {
      .el-select {
        .el-input__wrapper {
          width: 80px;
        }
      }
    }
  }
</style>
