<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <h2>云舟退税批次</h2>
      </vab-query-form-top-panel>
    </vab-query-form>
    <el-table
      border
      :header-cell-style="{ textAlign: 'center' }"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="发货日期"></el-table-column>
      <el-table-column label="报关单出口日期">
        <template #default="{ row }">
          <el-time-picker
           type="date"
          >
          </el-time-picker>
        </template>
      </el-table-column>
      <el-table-column label="合同编号"></el-table-column>
      <el-table-column label="未到发票"></el-table-column>
      <el-table-column label="发票总数"></el-table-column>
      <el-table-column label="退税完成">
        <el-checkbox :true-value="1" :false-value="0"></el-checkbox>
      </el-table-column>
      <el-table-column label="备注"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">明细</el-link>
          <el-link type="primary" :underline="false">发票归集</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty"></el-empty>
      </template>
    </el-table>
  </div>
</template>

<script lang="ts" setup>

</script>
