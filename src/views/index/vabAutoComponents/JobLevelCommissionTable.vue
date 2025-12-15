<template>
  <vab-card class="assessmentTable">
    <template #header>
      <vab-icon icon="information-line" />
      产品经理职级提成
      <div class="right-select">
        <slot name="select"></slot>
      </div>
    </template>
    <el-table border :cell-style="{ textAlign: 'center' }" :data="props.list" :header-cell-style="{ textAlign: 'center' }">
      <el-table-column label="姓名" min-width="95" prop="userName" />
      <el-table-column label="当月职级" min-width="130" prop="monthlyLevel" />
      <el-table-column label="6个月平均新品提成" min-width="140" prop="newProductCommission" />
      <el-table-column label="提成比例" min-width="100" prop="commissionRatio" />
    </el-table>
  </vab-card>
</template>

<script lang="ts" setup>
import { IGetFrontPageJobLevelCommission } from '~/src/type/index/frontPage'

defineOptions({
  name: 'JobLevelCommissionTable',
})
const props = defineProps<{
  list: IGetFrontPageJobLevelCommission[]
}>()
</script>

<style lang="scss" scoped>
.assessmentTable {
  height: 478px;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: scroll;
  }

  :deep(.el-table) {
    height: 100%;
  }
  .right-select {
    position: absolute;
    top: 50%;
    right: 25px;
    width: auto;
    height: 60px;
    line-height: 60px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    z-index: 10;
  }
}
</style>
