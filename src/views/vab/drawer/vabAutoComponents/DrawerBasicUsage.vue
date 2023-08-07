<template>
  <el-radio-group v-model="direction">
    <el-radio label="ltr">从左到右</el-radio>
    <el-radio label="rtl">从右到右</el-radio>
    <el-radio label="ttb">从上到下</el-radio>
    <el-radio label="btt">从下到上</el-radio>
  </el-radio-group>
  <br />
  <br />
  <el-button type="primary" @click="drawer = true">打开</el-button>
  <el-button type="primary" @click="drawer2 = true">包含页脚</el-button>

  <el-drawer v-model="drawer" :before-close="handleClose" :direction="direction" title="我是标题">
    <span>Hi, there!</span>
  </el-drawer>
  <el-drawer v-model="drawer2" :direction="direction">
    <template #header>
      <h4>按时段设置标题</h4>
    </template>
    <template #default>
      <div>
        <el-radio v-model="radio1" label="Option 1">选项1</el-radio>
        <el-radio v-model="radio1" label="Option 2">选项2</el-radio>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'

const drawer = ref<boolean>(false)
const drawer2 = ref<boolean>(false)
const direction = ref<any>('rtl')
const radio1 = ref<any>('Option 1')
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('您确定要关闭抽屉吗？', {
    draggable: true,
  })
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

function cancelClick() {
  drawer2.value = false
}

function confirmClick() {
  ElMessageBox.confirm(`您确认选择${radio1.value}吗？`, {
    draggable: true,
  })
    .then(() => {
      drawer2.value = false
    })
    .catch(() => {
      // catch error
    })
}
</script>
