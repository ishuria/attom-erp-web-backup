<template>
  <div class="step-form-container">
    <el-page-header style="margin-bottom: 0px" @back="goBack">
      <template #content>
        <div class="flex items-center">
          <span><strong>新品订货审批</strong></span>
        </div>
      </template>
    </el-page-header>

    <el-steps :active="active" align-center class="steps" :space="200" style="max-width: 800px; margin-bottom: 20px">
      <el-step title="主管终审" />
      <el-step title="SKU创建" />
      <el-step title="运营分货" />
      <el-step title="产品经理审核" />
      <el-step title="采购审核" />
    </el-steps>
    <order-review-step1
      v-if="active === 0"
      :edit-disabled="editDisabled"
      :review-id="reviewId"
      :review-status="reviewStatus"
      :review-step-no="reviewStepNo"
      @change-step="handleSetStep"
    />
    <order-review-step2
      v-if="active === 1"
      :edit-disabled="editDisabled"
      :review-id="reviewId"
      :review-status="reviewStatus"
      :review-step-no="reviewStepNo"
      @change-step="handleSetStep"
    />
    <order-review-step3
      v-if="active === 2"
      :edit-disabled="editDisabled"
      :review-id="reviewId"
      :review-status="reviewStatus"
      :review-step-no="reviewStepNo"
      @change-step="handleSetStep"
    />
    <order-review-step4
      v-if="active === 3"
      :edit-disabled="editDisabled"
      :review-id="reviewId"
      :review-status="reviewStatus"
      :review-step-no="reviewStepNo"
      @change-step="handleSetStep"
    />
    <order-review-step5
      v-if="active === 4"
      :edit-disabled="editDisabled"
      :review-id="reviewId"
      :review-status="reviewStatus"
      :review-step-no="reviewStepNo"
      @change-step="handleSetStep"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import orderReviewStep1 from './orderingReviewStep/orderReviewStep1.vue'
import orderReviewStep2 from './orderingReviewStep/orderReviewStep2.vue'
import orderReviewStep3 from './orderingReviewStep/orderReviewStep3.vue'
import orderReviewStep4 from './orderingReviewStep/orderReviewStep4.vue'
import orderReviewStep5 from './orderingReviewStep/orderReviewStep5.vue'
import { reviewStepEditDisabledStatus } from '/@/api/devlocal/orderingReview'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'
defineOptions({
  name: 'OrderingReview',
})

// route
const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
const reviewId = computed(() => Number(route.query.reviewId ?? 0))
const reviewStatus = computed(() => Number(route.query.reviewStatus ?? 0))
const reviewStepNo = computed(() => Number(route.query.reviewStepNo ?? 0))
const active = ref<number>(reviewStepNo.value)

const handleSetStep = (_active: any) => {
  active.value = _active
}

// back
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  history.back()
}
const editDisabled = ref<boolean>(false)
const fetchStepEditDisabledStatus = async () => {
  editDisabled.value = false
  const { data } = await reviewStepEditDisabledStatus({ reviewId: reviewId.value, step: active.value + 1 })
  editDisabled.value = data
}
watch(active, () => {
  fetchStepEditDisabledStatus()
})
onMounted(() => {
  fetchStepEditDisabledStatus()
})
</script>

<style lang="scss" scoped>
.step-form-container {
  :deep() {
    .el-steps {
      margin: var(--el-margin) auto calc(var(--el-margin) * 2) auto;

      .el-step__title.is-process {
        color: var(--el-color-primary);
      }

      .el-step__description.is-process {
        color: var(--el-color-primary);
      }

      .el-step__head {
        &.is-process {
          color: var(--el-color-primary);
          border-color: var(--el-color-primary);

          .el-step__icon.is-text {
            color: var(--el-color-primary);
            border: 1px solid;
          }

          .el-step__line {
            height: 1px;
          }
        }

        &.is-wait {
          .el-step__icon.is-text {
            border: 1px solid;
          }

          .el-step__line {
            height: 1px;
          }
        }

        &.is-finish {
          .el-step__icon.is-text {
            color: var(--el-color-white);
            background: var(--el-color-primary);
          }

          .el-step__line {
            height: 1px;
            background: var(--el-color-primary);
          }
        }
      }
    }
  }
}
</style>
