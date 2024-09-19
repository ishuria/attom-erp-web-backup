<tempalte>
   <div class="step-form-container">
        <el-page-header  @back="goBack" style="margin-bottom: 0px;">
            <template #content>
                <div class="flex items-center">
                    <span> <strong> SKU详情 </strong></span>
                </div>
            </template>
        </el-page-header>
    </div>
</tempalte>

<script lang="ts" setup>
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'

const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore

// back
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  history.back()
}


</script>