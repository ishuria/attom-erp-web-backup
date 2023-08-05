<template>
  <div class="data-screen-left3">
    <el-table :data="tableData">
      <el-table-column label="Name" prop="name" show-overflow-tooltip width="130px" />
      <el-table-column label="Address" prop="address" show-overflow-tooltip />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'DataScreenLeft3',
  })

  const tableData = [
    {
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
  ]
</script>

<style lang="scss" scoped>
  .data-screen-left3 {
    display: flex;
    flex-direction: column;
    height: calc(100% - 40px);
    margin-top: 20px;
    overflow: hidden;

    :deep() {
      .el-table {
        --el-table-border-color: #101f58;
        --el-table-border: 1px solid #101f58;
        --el-table-text-color: #fff;
        --el-table-header-text-color: : #fff;
        --el-table-row-hover-bg-color: transparent;
        --el-table-current-row-bg-color: transparent;
        --el-table-header-bg-color: transparent;
        --el-table-fixed-box-shadow: transparent;
        --el-table-bg-color: transparent;
        --el-table-tr-bg-color: transparent;
        --el-table-expanded-cell-bg-color: transparent;
        flex: 1;

        th {
          background: #101f58 !important;
          border-radius: 5px;
        }
      }
    }
  }
</style>
