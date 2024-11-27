<template>
  <vab-dialog
    title="发票匹配"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary">发票导入</el-button>
        <el-button type="primary">自动匹配</el-button>
        <el-button type="primary">清空全部PO</el-button>
        <el-button type="primary">全部删除</el-button>
        <el-switch>发票号码去重</el-switch>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" clearable  />
          </el-form-item>
          <el-input-item>
            <el-button type="primary" :icon="Search"></el-button>
          </el-input-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
const queryForm = ref<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
</script>