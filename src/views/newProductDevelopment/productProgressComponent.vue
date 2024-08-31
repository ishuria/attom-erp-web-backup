<template>
    <div class="default-table-detail-container">
        <el-page-header  @back="goBack" >
            <template #content>
                <div class="flex items-center">
                    <span> <strong> {{ route.query.title }} </strong><el-divider direction="vertical" /> <strong>{{ route.query.product }}</strong></span>
                </div>
            </template>
        </el-page-header>
        <el-divider style="margin:10px 0"/>

        <vab-component-list :progress-id="route.query.progressId" />

        <vab-cost-accounting :progress-id="route.query.progressId"/>

        <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if="imagePreviewVisible"/>
    </div>

   
</template>

<script lang="ts" setup>
import { handleActivePath } from '/@/utils/routes'
import { useTabsStore } from '/@/store/modules/tabs'


// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)

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



</script>