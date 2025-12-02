<template>
  <el-form v-permissions="{ permission: [PoPermission.QUERY] }" inline :model="queryForm" @submit.prevent>
    <!-- 报关状态筛选 -->
    <el-form-item label="">
      <el-select v-model="queryForm.customsStatus" clearable placeholder="报关状态筛选" style="max-width: 140px" @change="$emit('query')">
        <el-option label="全部报关状态" :value="-1" />
        <el-option label="报关" :value="0" />
        <el-option label="不报关" :value="1" />
      </el-select>
    </el-form-item>
    <!-- 发布人筛选 -->
    <el-form-item label="">
      <el-select
        v-model="queryForm.publisher"
        clearable
        placeholder="发布人筛选"
        style="max-width: 120px"
        value-key="userId"
        @change="$emit('query')"
      >
        <el-option v-for="item in publisherOptions" :key="item.userId" :label="item.userName" :value="item" />
      </el-select>
    </el-form-item>
    <!-- 搜索关键词 -->
    <el-form-item>
      <el-input
        v-model.trim="queryForm.keyWord"
        class="search-input"
        clearable
        placeholder="请输入搜索关键词"
        @input="$emit('input')"
        @keyup.enter="$emit('query')"
      />
    </el-form-item>
    <!-- 查询按钮 -->
    <el-form-item>
      <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="$emit('query')" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import PoPermission from '/@/permissions/po'

defineProps<{
  queryForm: any
  publisherOptions: any[]
  listLoading?: boolean
}>()

defineEmits<{
  query: []
  input: []
}>()
</script>

<style lang="scss" scoped>
// 搜索框宽度设置
.search-input {
  width: 300px !important;
}
</style>
