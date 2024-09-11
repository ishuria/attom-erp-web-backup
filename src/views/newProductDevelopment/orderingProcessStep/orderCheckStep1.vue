<template>
    <div>
        <el-space direction="vertical" style="width: 100%">
            <el-form 
                ref="formRef" 
                label-position="right" 
                label-width="auto" 
                :model="form" 
                @submit.prevent
            >
                <el-form-item label="合并变体的SKU(若有)" prop="excludingTax">
                    <el-input v-model="form.excludingTax" disabled/>
                </el-form-item>
                <el-form-item label="产品主品名" prop="standardInvoice">
                    <el-input v-model="form.standardInvoice" disabled placeholder="eg:碗架,硅胶吸管,水杯收纳"/>
                </el-form-item>
                <el-form-item label="产品短描述" prop="specialInvoice">
                    <el-input v-model="form.specialInvoice" disabled placeholder="eg:20管45×31.7CM" />
                </el-form-item>
            </el-form>
            <div class="list-container auto-height-container">
                <el-scrollbar>
                    <ul class="vab-auto-box">
                        
                        <li v-for="(item, index) in form.variantNamesAndTotal" :key="index" class="list-item">
                            <div class="list-item-meta">
                                <div class="list-item-meta-content">
                                    <el-space>
                                        <span style="width: 50px">{{ index === 0 ? "变体名" : "" }}</span>
                                        <el-input v-model="item.variantNames" disabled placeholder="黑色；白色；1大1小；海洋系列等" style="width: 240px"/>
                                    </el-space>
                                </div>
                                <div class="list-item-meta-content">
                                    <el-space>
                                        <span style="width: 140px">{{ index === 0 ? "订货数量(亚马逊US)" : "" }}</span>
                                        <el-input v-model="item.orderTotal" disabled style="width: 240px"/>
                                    </el-space>
                                </div>
                            </div>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
            <div style="color: var(--el-color-primary)">注：产品最终名称系统自动合成=产品主品名+产品规格描述+变体名（若有）</div>
        </el-space>
        <div class="pay-button-group">
            <el-button @click="handleGoback">退出</el-button>
            <el-button native-type="submit" type="primary" @click="handleSubmitAndContinue">下一步</el-button>
        </div>
    </div>
  </template>
  
<script lang="ts" setup>
defineOptions({
    name: 'OrderCheckStep1',
})
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'
import type { FormInstance } from 'element-plus'

const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore


const emit = defineEmits(['change-step'])
const formRef = ref<FormInstance>()
const form = reactive<any>({
  payAccount: '****************',
  gatheringAccount: '****************',
  gatheringName: '***',
  variantNamesAndTotal: [
    {
        variantsNames: '', 
        orderTotal: ''
    }
  ],
})
defineExpose({ form });

// 当点击下一步的时候
const handleSubmitAndContinue = () => {
    emit('change-step', 1)
}
// 当点击退出的时候
const handleGoback = async () => {
    await delVisitedRoute(handleActivePath(route, true))
    history.back()
}
</script>
  
<style lang="scss" scoped>
.pay-button-group {
    display: block;
    margin: 20px auto;
    text-align: center;
}
.list-container {
  ul {
    padding: 0;
    margin: 0;
    list-style: none;
    outline: none;

    .list-item {
      padding: calc(var(--el-padding) / 2);
      line-height: 20px;

      &-meta {
        display: flex;
        align-items: center;
        justify-content: center;

        &-avatar {
          :deep() {
            .el-image {
              width: 60px;
              height: 60px;
              cursor: pointer;
              border-radius: var(--el-border-radius-base);
            }
          }
        }

        &-content {
          flex: 2 0;
          margin-left: var(--el-margin);
        }

        &-content2 {
          flex: 1 0;
          margin-left: var(--el-margin);
          text-align: center;
        }

        &-title {
          font-size: var(--el-font-size-base);
          font-weight: bold;
          color: var(--el-color-grey);
        }

        &-description {
          display: -webkit-box;
          overflow: hidden;
          font-size: var(--el-font-size-base);
          color: var(--el-color-grey);
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        :deep() {
          .el-progress {
            width: 300px;
            margin: auto auto auto 40px;
          }
        }
      }
    }
  }
}
</style>
  