<template>
  <div class="step-form-container">
    <el-page-header  style="margin-bottom: 0px;" @back="goBack">
      <template #title >
        退出
      </template>

      <template #content>
        <div class="flex items-center">
          <span> <strong> 新品订货流程 </strong></span>
        </div>
      </template>
    </el-page-header>
    <!-- 编辑 以及 订大货进入 -->
    <div :class="{ 'none1': isNone1 }">
      <el-steps :active="active" align-center class="steps" :space="200" style="max-width: 1100px;">
        <el-step title="产品基础信息录入" />
        <el-step title="拿样零件添加" />
        <el-step title="零件信息完善与售价核对" />
        <el-step title="新供应信息完善" />
        <el-step title="完善SKU信息" />
        <el-step title="检查并提交" />
      </el-steps>
      <order-step1 
        v-if="active === 0" 
        @change-step="handleSetStep" 
        @send-data-to-step2="setStep2Data"
      />
      <order-step2 
        v-if="active === 1"
        :step1-data="step2ReceivedData" 
        @change-step="handleSetStep"
        @update:image-preview-visible="updateUploadPreviewVisible"
        @update:preview-list-value="setPreviewList"
      />
      <order-step3 
        v-if="active === 2" 
        :step1-data="step2ReceivedData" 
        @change-step="handleSetStep"
        @update:image-preview-visible="updateUploadPreviewVisible"
        @update:preview-list-value="setPreviewList"
      />
      <order-step4 v-if="active === 3" :step1-data="step2ReceivedData" @change-step="handleSetStep" />
      <order-step5 
        v-if="active === 4" 
        :step1-data="step2ReceivedData" 
        @change-step="handleSetStep"
        @update:image-preview-visible="updateUploadPreviewVisible"
        @update:preview-list-value="setPreviewList"
      />
      <order-step6 
        v-if="active === 5" 
        :step1-data="step2ReceivedData"             
        @change-step="handleSetStep"
        @update:image-preview-visible="updateUploadPreviewVisible"
        @update:preview-list-value="setPreviewList"
      />
    </div>
    <!-- 只能查看 -->
    <div :class="{ 'none2': isNone2 }">
      <el-steps :active="activeCheck" align-center class="steps" :space="200" style="max-width: 1000px;">
        <el-step title="产品基础信息录入" />
        <el-step title="零件信息完善与售价核对" />
        <el-step title="新供应信息完善" />
        <el-step title="完善SKU信息" />
        <el-step title="检查并提交" />
      </el-steps>
      <order-check-step1 v-if="activeCheck === 0" @change-check-step="handleCheckSetStep" />
      <order-check-step2 v-if="activeCheck === 1" @change-check-step="handleCheckSetStep" @update:image-preview-visible="updateUploadPreviewVisible" @update:preview-list-value="setPreviewList" />
      <order-check-step3 v-if="activeCheck === 2" @change-check-step="handleCheckSetStep" />
      <order-check-step4 v-if="activeCheck === 3" @change-check-step="handleCheckSetStep" @update:image-preview-visible="updateUploadPreviewVisible" @update:preview-list-value="setPreviewList" />
      <order-check-step5 v-if="activeCheck === 4" @change-check-step="handleCheckSetStep" @update:image-preview-visible="updateUploadPreviewVisible" @update:preview-list-value="setPreviewList" />
    </div>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose"/>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import orderCheckStep1 from './orderingProcessStep/orderCheckStep1.vue'
import orderCheckStep2 from './orderingProcessStep/orderCheckStep2.vue'
import orderCheckStep3 from './orderingProcessStep/orderCheckStep3.vue'
import orderCheckStep4 from './orderingProcessStep/orderCheckStep4.vue'
import orderCheckStep5 from './orderingProcessStep/orderCheckStep5.vue'
import orderStep1 from './orderingProcessStep/orderStep1.vue'
import orderStep2 from './orderingProcessStep/orderStep2.vue'
import orderStep3 from './orderingProcessStep/orderStep3.vue'
import orderStep4 from './orderingProcessStep/orderStep4.vue'
import orderStep5 from './orderingProcessStep/orderStep5.vue'
import orderStep6 from './orderingProcessStep/orderStep6.vue'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'
defineOptions({
  name: 'OrderingProcess',
})

// route
const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore

const active = ref<number>(0)
// 查看跳转,从0开始
const activeCheck = ref<number>(0)
const isNone1 = ref<boolean>(false)
const isNone2 = ref<boolean>(false)

// 接收从 step1 传递过来的数据
const step2ReceivedData = ref<number>(0)

// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
// 控制图片是否预览
const updateUploadPreviewVisible = (newV:boolean) =>{
    imagePreviewVisible.value = newV
}
// 修改图片预览列表
const setPreviewList = (imageUrl:string) =>{
    imagePreviewList.value = []
    imagePreviewList.value.push(imageUrl)
}

const handleSetStep = (_active: number) => {
  active.value = _active
}
const handleCheckSetStep = (_active: number) => {
  activeCheck.value = _active
}
// 接收并存储从 step1 传递过来的数据
const setStep2Data = (res: any) => {
  step2ReceivedData.value = res
}

// back
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  history.back()
}
onBeforeMount(() => {
  // 如果 `reviewStatus` 存在且值为 '0' 或 '2'，编辑和订大货显示
  if (route.query.progressId || (route.query.reviewStatus === '0' || route.query.reviewStatus === '2')) {
    isNone2.value = true;
    isNone1.value = false;
    if (route.query.stepNo) {
      // console.log(active.value); 
      active.value = parseInt(route.query.stepNo)
      // console.log(active.value);
    } else {
      active.value = 0 // 订大货的是0
    }
  } else { // 查看显示
    isNone2.value = false;
    isNone1.value = true;
    if (route.query.stepNo) {
      const stepNo = parseInt(route.query.stepNo)
      activeCheck.value = stepNo
      if (stepNo === 5) {
        activeCheck.value = 0
      }
    }
  }
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
.none1 {
  display: none;
}
.none2 {
  display: none;
}
</style>