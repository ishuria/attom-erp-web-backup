<template>
  <div class="menu1-1-1-1-container">
    <el-alert :closable="false" title="路由1.1.1.1" type="success">
      <el-input v-model="value" />
    </el-alert>
    <el-button type="primary" @click="handleRefresh">刷新当前标签页</el-button>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'Menu1111',
  })

  const value = ref('')
  const $pub = inject('$pub')

  const handleRefresh = () => {
    $pub('reload-router-view', 'Menu1111')
  }
</script>
