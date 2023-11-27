<template>
  <div class="dialog-container">
    <el-form label-position="top" :model="form">
      <el-form-item label="标题">
        <el-input v-model="form.title" style="width: 345px" />
      </el-form-item>
      <el-form-item class="hidden-xs-only" label="弹窗宽度（30% - 60%）">
        <el-input v-model="form.content" style="width: 345px" type="textarea" />
      </el-form-item>
      <el-form-item label="基础配置">
        <el-checkbox v-model="form.showFullscreen" label="开启全屏按钮" />
        <el-checkbox v-if="form.showFullscreen" v-model="form.animated" label="开启全屏动画" />
        <el-checkbox v-model="form.draggable" class="hidden-xs-only" label="开启拖拽" />
      </el-form-item>
      <el-form-item class="hidden-xs-only" label="弹窗宽度（30% - 60%）">
        <el-slider v-model="form.width" :max="60" :min="30" style="width: 345px" />
      </el-form-item>
      <el-form-item label="操作">
        <el-button type="primary" @click="handleOpen">打开弹窗</el-button>
      </el-form-item>
    </el-form>

    <vab-dialog
      v-model="dialogVisible"
      :animated="form.animated"
      append-to-body
      :draggable="form.draggable"
      :show-fullscreen="form.showFullscreen"
      :title="form.title"
      :width="form.width + '%'"
    >
      {{ form.content }}
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Dialog',
})

const form = reactive<any>({
  showFullscreen: true,
  animated: false,
  draggable: true,
  width: 30,
  title: '温馨提示',
  content: '昨夜西风凋碧树，独上高楼望尽天涯路',
})

const dialogVisible = ref<any>(false)

const handleOpen = () => {
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped></style>
