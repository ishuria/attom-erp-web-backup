<template>
    <div class="default-table-detail-container">
        <el-page-header  @back="goBack" >
            <template #content>
                <div class="flex items-center">
                    <span>{{ route.query.title }} <el-divider direction="vertical" /> {{ route.query.product }}</span>
                </div>
            </template>
        </el-page-header>
        <el-divider />

        <div style="width: 100%; height: 500px;">

        </div>

        
        <div style="width: 100%; height: 550px;">
            <!-- <el-page-header >
            <template #content>
                <div class="flex items-center">
                    <span>成本核算</span>
                </div>
            </template>
        </el-page-header> -->
            <div class="el-page-header__content">成本核算</div>
            <el-divider />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useTabsStore } from '/@/store/modules/tabs'

// route
const route: any = useRoute()
const tabsStore = useTabsStore()
const { changeTabsMeta, delVisitedRoute } = tabsStore
import { handleActivePath } from '/@/utils/routes'

// back
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  history.back()
}


</script>