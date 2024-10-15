<template>
    <div class="default-table-detail-container">
        <el-page-header  @back="goBack" style="margin-bottom: 0px;">
            <template #content>
                <div class="flex items-center">
                    <span> <strong> {{ route.query.title }} </strong><el-divider direction="vertical"/> <strong>{{ route.query.product }}</strong></span>
                </div>
            </template>
        </el-page-header>
        <el-divider style="margin:10px 0"/>
        <div class="container">
        <vab-component-list 
            :progress-id="route.query.progressId"
            @update:imagePreviewVisibale="updateUploadPriviewVisible"
            @update:priviewListValue="setPreviewList"
            :trialCalculationData="trialCalculationRef?.fetchData"
        />

        <vab-trial-calculation 
            :progress-id="route.query.progressId"
            :costScroll="costAccountingRef?.autoScrollButtom"
            :costAccountingData = "costAccountingRef?.estimatedCostList"
            :costAccountingFetch = "costAccountingRef?.fetchDataCostAccounting"
            ref="trialCalculationRef"
        />

        <vab-cost-accounting
            :progress-id="route.query.progressId"
            @update:imagePreviewVisibale="updateUploadPriviewVisible"
            @update:priviewListValue="setPreviewList"
            ref="costAccountingRef"
            
        />
        </div>
        <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if="imagePreviewVisible" hide-on-click-modal/>
    </div>

   
</template>

<script lang="ts" setup>
import { handleActivePath } from '/@/utils/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import VabCostAccounting from './vabAutoComponents/VabCostAccounting.vue';
import VabTrialCalculation from './vabAutoComponents/VabTrialCalculation.vue';


// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
const costAccountingRef = ref<InstanceType<typeof VabCostAccounting> | null>(null);
const trialCalculationRef = ref<InstanceType<typeof VabTrialCalculation> | null>(null);
// route
const route: any = useRoute()
const tabsStore = useTabsStore()
const {delVisitedRoute } = tabsStore
// 预览图片列表
const imagePriviewList = ref<string[]>([])


// back
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  history.back()
}


// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}

// 控制图片是否预览
const updateUploadPriviewVisible = (newV:boolean) =>{
    imagePreviewVisible.value = newV
}

// 修改图片预览列表
const setPreviewList = (imageUrl:string) =>{
    imagePriviewList.value = []
    imagePriviewList.value.push(imageUrl)
}

onBeforeMount(async () => {
    trialCalculationRef.value?.fetchData()
})
</script>
<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
</style>