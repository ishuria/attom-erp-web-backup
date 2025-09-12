<template>
  <div>
    <vab-dialog v-model="visible" title="历史价格" width="800px">
      <div class="price-summary">
        <!-- 展示降本申请优化前和优化后价格 -->
        <div class="price-cards">
          <div class="price-card before-price">
            <div class="price-label">优化前价格</div>
            <div class="price-value">¥{{ beforePrice || '0.00' }}</div>
          </div>
          <div class="price-arrow">
            <el-icon color="#409EFF" size="20">
              <arrow-right />
            </el-icon>
          </div>
          <div class="price-card after-price">
            <div class="price-label">优化后价格</div>
            <div class="price-value">¥{{ afterPrice || '0.00' }}</div>
          </div>
        </div>
      </div>
      <el-table
        border
        :cell-style="{ textAlign: 'center' }"
        :data="list"
        :header-cell-style="{ textAlign: 'center' }"
        max-height="60vh"
        stripe
      >
        <el-table-column label="PO日期" min-width="115" prop="releaseDate">
          <template #default="{ row }">
            {{ row.releaseDate ? formatDate(new Date(row.releaseDate)) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="PO" min-width="110" prop="po" />
        <el-table-column label="出厂单价" min-width="100" prop="unitPrice" />
        <el-table-column label="开票" min-width="100" prop="invoicing" />
        <el-table-column label="采购方" min-width="100" prop="purchase" />
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
        </template>
      </el-table>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import type { IGetCostReductionHistoryPriceList } from '/@/type/commission/commissionType'
import { formatDate } from '/@/utils/dateUtils'

defineOptions({
  name: 'HistoryPriceTable',
})

const props = defineProps<{
  modelValue: boolean
  list: IGetCostReductionHistoryPriceList[]
  beforePrice: number
  afterPrice: number
}>()
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
const emit = defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.price-summary {
  margin-bottom: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .price-cards {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;

    .price-card {
      flex: 1;
      max-width: 160px;
      padding: 12px;
      background: white;
      border-radius: 6px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      &.before-price {
        border-left: 3px solid #f56c6c;

        .price-value {
          color: #f56c6c;
        }
      }

      &.after-price {
        border-left: 3px solid #67c23a;

        .price-value {
          color: #67c23a;
        }
      }

      .price-label {
        font-size: 14px;
        color: #666;
        margin-bottom: 4px;
        font-weight: 500;
      }

      .price-value {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
    }

    .price-arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
