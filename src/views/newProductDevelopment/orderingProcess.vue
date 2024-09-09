<template>
    <div class="default-table-detail-container">
        <el-page-header  @back="goBack" style="margin-bottom: 0px;">
            <template #content>
                <div class="flex items-center">
                    <span> <strong> 新品订货流程 </strong></span>
                </div>
            </template>
        </el-page-header>
    </div>

   
</template>

<script lang="ts" setup>
import { handleActivePath } from '/@/utils/routes'
import { useTabsStore } from '/@/store/modules/tabs'

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


</script>