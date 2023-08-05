<template>
  <div class="menu1-1-1-1-container">
    <el-alert :closable="false" title="路由1.1.1.1" type="success">
      <el-input v-model="value" clearable style="width: 250px" type="textarea" />
    </el-alert>
    <el-button type="primary" @click="handleAdd">模拟填充数据</el-button>
    <el-button type="primary" @click="handleRefresh">刷新当前标签页</el-button>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'Menu1111',
  })

  const value = ref<string>('')
  const $pub = inject<any>('$pub')

  const handleAdd = () => {
    value.value = '这是模拟填充的缓存数据，点击[刷新当前标签页]按钮可清除'
  }

  const handleRefresh = () => {
    $pub('reload-router-view', 'Menu1111')
  }
</script>
