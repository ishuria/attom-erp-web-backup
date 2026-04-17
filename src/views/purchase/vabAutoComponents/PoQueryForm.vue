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
    <el-form-item label="">
      <el-select v-model="queryForm.site" clearable placeholder="全部站点" @change="$emit('query')">
        <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id">
          <el-text :style="{ color: getSiteBaseColor(item.label), marginRight: '6px' }">{{ item.label }}</el-text>
        </el-option>
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
import { ISiteOption } from '/@/type/packagingShipping/shippedType'

defineProps<{
  queryForm: any
  publisherOptions: any[]
  listLoading?: boolean
  siteList: ISiteOption[]
}>()

defineEmits<{
  query: []
  input: []
}>()

// 站点 -> 自定义颜色映射
const getSiteBaseColor = (siteName: string) => {
  if (!siteName) return '#909399'
  const colorMap: Record<string, string> = {
    亚马逊US美国: '#67C23A', // 绿色
    亚马逊UK英国: '#409EFF', // 蓝色
    亚马逊DE德国: '#8E44AD', // 紫色（由红色改为紫色）
    亚马逊CA加拿大: '#2AC3A2', // 青绿
    沃尔玛US美国: '#E6A23C', // 橙色
    亚马逊JP日本: '#5C6BC0', // 靛蓝
    Tiktok美国: '#34495E', // 深石板色
    '美国-海外仓': '#909399', // 灰色
  }
  return colorMap[siteName] ?? '#909399'
}
</script>

<style lang="scss" scoped>
// 搜索框宽度设置
.search-input {
  width: 300px !important;
}
</style>
