<template>
  <vab-card v-loading="loading" :body-style="{ height: '422px' }" class="bonus-card" skeleton>
    <template #header>
      <vab-icon icon="align-top" />
      个人奖金
      <div class="right-select">
        <slot name="select"></slot>
      </div>
    </template>
    <el-table border :data="data" :header-cell-style="{ textAlign: 'center' }" max-height="360" show-summary>
      <el-table-column align="center" label="月份" prop="month" width="100" />
      <el-table-column align="center" label="奖金类型" min-width="120" prop="bonusType" />
      <el-table-column align="center" label="金额" prop="bonus" width="120">
        <template #default="{ row }">
          <span>¥{{ row.bonus?.toFixed(2) || '0.00' }}</span>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 300px" />
      </template>
    </el-table>
  </vab-card>
</template>

<script lang="ts" setup>
import type { IGetFrontPagePersonalBonusItem } from '/@/type/index/frontPage'

defineOptions({
  name: 'PersonalBonusCard',
})

interface Props {
  data: IGetFrontPagePersonalBonusItem[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  loading: false,
})
</script>

<style lang="scss" scoped>
.bonus-card {
  position: relative;

  :deep(.el-card__header) {
    position: relative;

    display: flex;
    align-items: center;
  }

  .right-select {
    position: absolute;
    top: 50%;
    right: 10px;
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
