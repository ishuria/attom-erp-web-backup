<template>
  <div class="default-table-detail-container">
    <el-page-header style="margin-bottom: 0px" @back="goBack">
      <template #content>
        <div class="flex items-center">
          <span>
            <strong>{{ route.query.title }}</strong>
            <el-divider direction="vertical" />
            <strong>{{ route.query.product }}</strong>
          </span>
        </div>
      </template>
    </el-page-header>
    <el-divider style="margin: 10px 0" />
    <div class="container">
      <vab-component-list
        v-model:table1Loading="table1Loading"
        :progress-id="route.query.progressId"
        :trial-calculation-data="trialCalculationRef?.fetchData"
        @update:image-preview-visible="updateUploadPreviewVisible"
        @update:preview-list-value="setPreviewList"
      />

      <vab-trial-calculation
        ref="trialCalculationRef"
        v-model:table2Loading="table2Loading"
        :channel-list="costAccountingList"
        :cost-accounting-data="costAccountingRef?.estimatedCostList"
        :cost-accounting-fetch="costAccountingRef?.fetchDataCostAccounting"
        :cost-scroll="costAccountingRef?.autoScrollButtom"
        :progress-id="route.query.progressId"
        :site-list="siteList"
      />

      <vab-cost-accounting
        ref="costAccountingRef"
        v-model:table3Loading="table3Loading"
        :channel-list="channelList"
        :progress-id="route.query.progressId"
        :site-list="siteList"
        @update:image-preview-visible="updateUploadPreviewVisible"
        @update:preview-list-value="setPreviewList"
      />
    </div>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script lang="ts" setup>
import VabCostAccounting from './vabAutoComponents/VabCostAccounting.vue'
import VabTrialCalculation from './vabAutoComponents/VabTrialCalculation.vue'
import { getChannelList, getCostAccountingChannelList } from '/@/api/devlocal/encasement'
import { getSalesSiteList } from '/@/api/devlocal/evaluation'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'

defineOptions({
  name: 'ProductProgressComponent',
})
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
const costAccountingRef = ref<InstanceType<typeof VabCostAccounting> | null>(null)
const trialCalculationRef = ref<InstanceType<typeof VabTrialCalculation> | null>(null)
// route
const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
// 预览图片列表
const imagePreviewList = ref<string[]>([])
const channelList = ref<{ id: number; label: string }[]>([])
const costAccountingList = ref<{ id: number; label: string }[]>([])
const siteList = ref<{ id: number; label: string }[]>([])

const table1Loading = ref<boolean>(false)
const table2Loading = ref<boolean>(false)
const table3Loading = ref<boolean>(false)

// back
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  history.back()
}
// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
// 控制图片是否预览
const updateUploadPreviewVisible = (newV: boolean) => {
  imagePreviewVisible.value = newV
}
// 修改图片预览列表
const setPreviewList = (imageUrl: string) => {
  imagePreviewList.value = []
  imagePreviewList.value.push(imageUrl)
}

const fetchChannelData = async () => {
  const { data } = await getChannelList()
  channelList.value = data
}
const fetchCostAccountingChannelData = async () => {
  const { data } = await getCostAccountingChannelList()
  costAccountingList.value = data
}
const fetchSalesSiteList = async () => {
  const { data } = await getSalesSiteList()
  siteList.value = data
}
onBeforeMount(async () => {
  fetchChannelData()
  fetchCostAccountingChannelData()
  fetchSalesSiteList()
  trialCalculationRef.value?.fetchData()
})
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
