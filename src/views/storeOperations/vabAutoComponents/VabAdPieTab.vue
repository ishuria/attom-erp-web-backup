<template>
  <div>
    <vab-card style="height: 400px;">
      <el-row>
        <el-col :span="12"></el-col>
        <el-col :span="12"></el-col>
      </el-row>
    </vab-card>
    <div style="text-align: right">
      <el-form inline :model="queryForm" @submit.prevent>
        <el-form-item>
          <el-checkbox>精准搜索</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @keyup.enter="queryData" @input="queryData" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="listLoading" @click="queryData"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table border stripe :header-cell-style="{textAlign: 'center'}">
      <el-table-column label="客户搜索词" prop="" min-width="120"></el-table-column>
      <el-table-column label="展示量" prop="" min-width="90"></el-table-column>
      <el-table-column label="点击量" prop="" min-width="90"></el-table-column>
      <el-table-column label="点击率(我们/大盘)" prop="" min-width="170"></el-table-column>
      <el-table-column label="转化率(我们/大盘)" prop="" min-width="170"></el-table-column>
      <el-table-column label="花费" prop="" min-width="80"></el-table-column>
      <el-table-column label="订单数" prop="" min-width="90"></el-table-column>
      <el-table-column label="ACOS" prop="" min-width="90"></el-table-column>
      <el-table-column label="CPC" prop="" min-width="80"></el-table-column>
      <el-table-column label="建议竞价" prop="" min-width="100"></el-table-column>
      <el-table-column label="广告日总展示" prop="" min-width="130"></el-table-column>
      <el-table-column label="估算广告日总点击" prop="" min-width="170"></el-table-column>
      <el-table-column label="曝光量排名" prop="" min-width="120"></el-table-column>
      <el-table-column label="品牌占有率" prop="" min-width="120"></el-table-column>
      <el-table-column label="分类" prop="" min-width="90"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'

const listLoading = ref<boolean>(false)
const queryForm = reactive<any>({
  keyWord: ''
})
const queryData = () => {
  // fetchData()
}
</script>