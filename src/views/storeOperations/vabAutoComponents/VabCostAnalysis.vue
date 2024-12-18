<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <vab-card style="height: 400px;"></vab-card>
      </el-col>
      <el-col :span="8">
        <vab-card style="height: 400px;"></vab-card>
      </el-col>
      <el-col :span="8">
        <vab-card style="height: 190px;"></vab-card>
        <vab-card style="height: 190px;"></vab-card>
      </el-col>
    </el-row>
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item>
            <el-text>产品成本核算</el-text>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">新增</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-table>

    </el-table>
  </div>
</template>