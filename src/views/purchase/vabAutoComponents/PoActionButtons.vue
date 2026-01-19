<template>
  <div class="po-action-buttons-container">
    <!-- 左侧按钮组 -->
    <div class="left-section">
      <!-- 特定标签页按钮 -->
      <el-button
        v-if="showPackageTaskButton"
        v-permissions="{ permission: [PoPermission.PACKAGE_TASK_REPLEASE] }"
        :loading="packageTaskLoading"
        type="primary"
        @click="$emit('packageTaskRelease')"
      >
        发布打包任务
      </el-button>

      <!-- 公共操作按钮 -->
      <el-button
        v-if="showCommonButtons"
        v-permissions="{ permission: [PoPermission.TOTAL_PRICE_ALLOCATION] }"
        :loading="priceSharingLoading"
        type="primary"
        @click="$emit('totalPriceSharing')"
      >
        总价分摊
      </el-button>
      <el-button
        v-if="showCommonButtons"
        v-permissions="{ permission: [PoPermission.GENERATE_CONTRACT] }"
        :loading="generateContractLoading"
        type="primary"
        @click="$emit('generateContract')"
      >
        生成合同
      </el-button>
      <el-button
        v-if="showCommonButtons"
        v-permissions="{ permission: [PoPermission.AGGREGATION_CONTRACT] }"
        :loading="mergeContractLoading"
        type="primary"
        @click="$emit('mergeContract')"
      >
        聚合合同
      </el-button>
      <el-button
        v-if="showCommonButtons"
        v-permissions="{ permission: [PoPermission.REMITTANCE_TEMPLATE] }"
        :loading="moneyTransferLoading"
        type="primary"
        @click="$emit('generateMoneyTransfer')"
      >
        生成汇款模板
      </el-button>
      <el-button
        v-if="showCommonButtons"
        v-permissions="{ permission: [PoPermission.COST_REDUCTION_APPLY] }"
        :loading="reduceCostLoading"
        type="primary"
        @click="$emit('reduceCost')"
      >
        降本提成申请
      </el-button>
      <el-button
        v-if="showCommonButtons"
        v-permissions="{ permission: [PoPermission.COMPONENT_AUTO_QUERY] }"
        type="primary"
        @click="$emit('automaticSignature')"
      >
        自动签收设定
      </el-button>
      <el-button
        v-if="showCommonButtons"
        v-permissions="{ permission: [PoPermission.DELETE] }"
        :loading="delLoading"
        type="danger"
        @click="$emit('delete')"
      >
        删除
      </el-button>
      <el-button
        v-if="showCommonButtons"
        v-permissions="{ permission: [PoPermission.SPECIAL_DELETE] }"
        :loading="specialDelLoading"
        type="danger"
        @click="$emit('specialDelete')"
      >
        特殊Po删除
      </el-button>
      <el-button
        v-if="showCommonButtons"
        v-permissions="{ permission: [PoPermission.PO_AUTO_PAY_ADD_PATH] }"
        type="primary"
        @click="$emit('addAutomaticPayment')"
      >
        添加自动付款
      </el-button>
      <el-button
        v-if="showCommonButtons"
        v-permissions="{ permission: [PoPermission.PO_AUTO_PAY_LIST] }"
        type="primary"
        @click="$emit('automaticPaymentPreview')"
      >
        自动付款预览
      </el-button>
      <el-button
        v-if="showCommonButtons"
        v-permissions="{ permission: [PoPermission.REMITTANCE_CHECK] }"
        type="primary"
        @click="$emit('remittanCheck')"
      >
        汇款校对
      </el-button>
    </div>

    <!-- 统计信息 -->
    <div v-if="showBonusInfo" class="summary-info">
      <el-space :size="16" style="align-items: center">
        <!-- 采购奖金和跨月调整金额 -->
        <template
          v-if="
            currentRoleCode === ROLE_PURCHASINGASSISTANT_CODE ||
            currentRoleCode === ROLE_PURCHASER_CODE ||
            currentRoleCode === ROLE_BOSS_CODE
          "
        >
          <el-statistic
            class="compact-statistic"
            :formatter="(val: number) => Number(val || 0).toFixed(2)"
            title="采购奖金"
            :value="Number(procurementBonus) || 0"
          />
          <el-divider direction="vertical" style="height: 34px" />
          <el-statistic
            class="compact-statistic"
            :formatter="(val: number) => Number(val || 0).toFixed(2)"
            title="跨月调整金额"
            :value="Number(procurementBonusCrossMonth) || 0"
          />
        </template>
        <!-- 含税价格合计 -->
        <template
          v-if="
            currentRoleCode === ROLE_ACCOUNTANT_CODE ||
            currentRoleCode === ROLE_BOSS_CODE ||
            currentRoleCode === ROLE_PURCHASINGASSISTANT_CODE ||
            currentRoleCode === ROLE_PURCHASER_CODE
          "
        >
          <el-divider
            v-if="
              currentRoleCode === ROLE_PURCHASINGASSISTANT_CODE ||
              currentRoleCode === ROLE_PURCHASER_CODE ||
              currentRoleCode === ROLE_BOSS_CODE
            "
            direction="vertical"
            style="height: 34px"
          />
          <el-statistic
            class="compact-statistic"
            :formatter="(val: number) => Number(val || 0).toFixed(2)"
            title="含税价格合计"
            :value="Number(taxIncludedTotalPrice) || 0"
          />
        </template>
      </el-space>
    </div>

    <!-- 右侧区域：付款按钮 -->
    <div class="right-section">
      <!-- 付款相关按钮 -->
      <el-button
        v-if="showPaymentButtons"
        v-permissions="{ permission: [PoPermission.PAY] }"
        :loading="fullPaymentLoading"
        type="success"
        @click="$emit('paymentPaid')"
      >
        已付全款/尾款
      </el-button>
      <el-button
        v-if="showPaymentButtons"
        v-permissions="{ permission: [PoPermission.PAY_BATCH] }"
        :loading="installmentLoading"
        type="warning"
        @click="$emit('installment')"
      >
        分批付款
      </el-button>
      <el-button
        v-if="showPaymentButtons"
        v-permissions="{ permission: [PoPermission.PAY_REFUND] }"
        :loading="refundLoading"
        type="danger"
        @click="$emit('refund')"
      >
        退款
      </el-button>
      <el-button
        v-if="showPaymentButtons"
        v-permissions="{ permission: [PoPermission.PAY_REFUND_BATCH] }"
        :loading="batchRefundFullLoading"
        type="danger"
        @click="$emit('batchRefundFull')"
      >
        批量退全款
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ROLE_ACCOUNTANT_CODE, ROLE_BOSS_CODE, ROLE_PURCHASER_CODE, ROLE_PURCHASINGASSISTANT_CODE } from '/@/const/role'
import PoPermission from '/@/permissions/po'

defineProps<{
  showCommonButtons?: boolean
  showPackageTaskButton?: boolean
  showBonusInfo?: boolean
  showPaymentButtons?: boolean
  priceSharingLoading?: boolean
  generateContractLoading?: boolean
  mergeContractLoading?: boolean
  moneyTransferLoading?: boolean
  reduceCostLoading?: boolean
  delLoading?: boolean
  specialDelLoading?: boolean
  fullPaymentLoading?: boolean
  installmentLoading?: boolean
  refundLoading?: boolean
  batchRefundFullLoading?: boolean
  packageTaskLoading?: boolean
  procurementBonus?: string | number
  procurementBonusCrossMonth?: string | number
  taxIncludedTotalPrice?: string | number
  currentRoleCode?: string
  remittanCheck?: boolean
}>()

defineEmits<{
  totalPriceSharing: []
  generateContract: []
  mergeContract: []
  generateMoneyTransfer: []
  reduceCost: []
  automaticSignature: []
  delete: []
  specialDelete: []
  packageTaskRelease: []
  paymentPaid: []
  installment: []
  refund: []
  batchRefundFull: []
  addAutomaticPayment: []
  automaticPaymentPreview: []
  remittanCheck: []
}>()
</script>

<style lang="scss" scoped>
.po-action-buttons-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: flex-start;
}

.left-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  max-width: 1050px;

  // 按钮间距，与 vab-query-form 保持一致
  :deep(.el-button) {
    margin: 0 10px calc(var(--el-margin) / 2) 0 !important;
  }
}
.summary-info {
  margin: 0 10px calc(var(--el-margin) / 2) 0;
  display: flex;
  align-items: center;
}

.right-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex-shrink: 0;

  // 按钮间距，与 vab-query-form 保持一致
  :deep(.el-button) {
    margin: 0 10px calc(var(--el-margin) / 2) 0 !important;
  }
}

.compact-statistic {
  :deep() {
    .el-statistic__head {
      margin-bottom: 0;
      font-size: 14px;
    }
    .el-statistic__content {
      margin-top: 2px;
      font-size: 18px;
    }
  }
}
</style>
