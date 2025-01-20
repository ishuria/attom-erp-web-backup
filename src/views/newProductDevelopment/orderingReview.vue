<template>
  <div class="step-form-container">
    <el-page-header style="margin-bottom: 0px;" @back="goBack">
      <template #content>
        <div class="flex items-center">
          <span> <strong> 新品订货审批 </strong></span>
        </div>
      </template>
    </el-page-header>

    <el-steps :active="active" align-center class="steps" :space="200" style="max-width: 800px;margin-bottom: 20px;">
      <el-step title="主管终审" />
      <el-step title="SKU创建" />
      <el-step title="运营分货" />
      <el-step title="产品经理审核" />
    </el-steps>
    <order-review-step1 
      v-if="active === 0" 
      :review-id="route.query.reviewId" 
      :review-status="route.query.reviewStatus"
      :review-step-no="route.query.reviewStepNo" 
      @change-step="handleSetStep" 
    />
    <order-review-step2 
      v-if="active === 1" 
      :review-id="route.query.reviewId" 
      :review-status="route.query.reviewStatus"
      :review-step-no="route.query.reviewStepNo" 
      @change-step="handleSetStep" 
    />
    <order-review-step3 
      v-if="active === 2" 
      :review-id="route.query.reviewId" 
      :review-status="route.query.reviewStatus"
      :review-step-no="route.query.reviewStepNo" 
      @change-step="handleSetStep" 
    />
    <order-review-step4 
      v-if="active === 3" 
      :review-id="route.query.reviewId" 
      :review-status="route.query.reviewStatus"
      :review-step-no="route.query.reviewStepNo" 
      @change-step="handleSetStep" 
   />
  </div>
</template>

<script lang="ts" setup>
import { handleActivePath } from '/@/utils/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { ref } from 'vue'
import orderReviewStep1 from './orderingReviewStep/orderReviewStep1.vue'
import orderReviewStep2 from './orderingReviewStep/orderReviewStep2.vue'
import orderReviewStep3 from './orderingReviewStep/orderReviewStep3.vue'
import orderReviewStep4 from './orderingReviewStep/orderReviewStep4.vue'
defineOptions({
  name: 'OrderingReview',
})

// route
const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
const active = ref<number>(Number(route.query.reviewStepNo))
const orderStep1Ref = ref(null)
const formData = ref<any>({})

const handleSetStep = (_active: any) => {
  active.value = _active
}


watch(active, (newActive) => {
  if (newActive === 0) {
    const orderStep1: any = orderStep1Ref.value;
    if (orderStep1) {
      formData.value = orderStep1.form;
    }
  }
});





// back
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  history.back()
}
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