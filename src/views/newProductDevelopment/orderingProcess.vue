<template>
    <div class="step-form-container">
        <el-page-header  @back="goBack" style="margin-bottom: 0px;">
            <template #content>
                <div class="flex items-center">
                    <span> <strong> 新品订货流程 </strong></span>
                </div>
            </template>
        </el-page-header>
        
        <el-steps :active="active" align-center class="steps" :space="200" style="max-width: 1100px">
            <el-step title="产品基础信息录入" />
            <el-step title="拿样零件添加" />
            <el-step title="零件信息完善与售价核对" />
            <el-step title="新供应信息完善" />
            <el-step title="完善SKU信息" />
            <el-step title="检查并提交" />
        </el-steps>
        <order-step1 v-if="active === 0" @change-step="handleSetStep" />
        <order-step2 v-if="active === 1" @change-step="handleSetStep" />
        <order-step3 v-if="active === 2" @change-step="handleSetStep" />
        <order-step4 v-if="active === 3" @change-step="handleSetStep" />
    </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'OrderingProcess',
})
import { handleActivePath } from '/@/utils/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import type { FormInstance } from 'element-plus'
import orderStep1 from './orderingProcessStep/orderStep1.vue'
import orderStep2 from './orderingProcessStep/orderStep2.vue'
import orderStep3 from './orderingProcessStep/orderStep3.vue'
import orderStep4 from './orderingProcessStep/orderStep4.vue'

// route
const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
const active = ref<any>(0)
// 预览图片列表
const imagePriviewList = ref<string[]>([])
const form = reactive<any>({})
const handleSetStep = (_active: any) => {
  active.value = _active
}





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