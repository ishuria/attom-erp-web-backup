<template>
  <div class="drawer-container no-background-container">
    <vab-card>
      <template #header>基础用法</template>
      <drawer-basic-usage />
    </vab-card>
    <vab-card>
      <template #header>不添加标题</template>
      <drawer-no-title />
    </vab-card>
    <vab-card>
      <template #header>自定义内容</template>
      <drawer-customization-content />
    </vab-card>
    <vab-card>
      <template #header>自定义头部</template>
      <drawer-customization-header />
    </vab-card>
    <vab-card>
      <template #header>嵌套抽屉</template>
      <drawer-nested-drawer />
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Drawer',
})
</script>
