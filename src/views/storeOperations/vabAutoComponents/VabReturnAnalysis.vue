<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18">
        <vab-card style="height: 300px"></vab-card>
      </el-col>
      <el-col :span="6">
        <vab-card style="height: 300px"></vab-card>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 20px;">
      <el-col :span="18">
        <span><strong>退货订单反馈</strong></span>
      </el-col>
      <el-col :span="6">
        <el-select placeholder="退货原因"></el-select>
      </el-col>
    </el-row>
    <el-table border stripe :header-cell-style="{ textAlign: 'center' }">
      <el-table-column label="订单号"></el-table-column>
      <el-table-column label="退货原因"></el-table-column>
      <el-table-column label="买家备注"></el-table-column>
      <el-table-column label="买家之声反馈"></el-table-column>
      <el-table-column label="退货时间"></el-table-column>
      <el-table-column label="订购时间"></el-table-column>
      <el-table-column label="订单标签"></el-table-column>
    </el-table>
  </div>
</template>