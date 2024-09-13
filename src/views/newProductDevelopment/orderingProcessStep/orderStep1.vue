<template>
    <div>
        <el-space direction="vertical" style="width: 100%">
            <el-form 
                ref="formRef" 
                label-position="right" 
                label-width="160px" 
                :model="form" 
                @submit.prevent
                :rules="rules" 
            >
                <el-form-item label="合并变体的SKU(若有)" prop="variantSku">
                    <el-input v-model="form.variantSku" clearable />
                </el-form-item>
                <el-form-item label="产品主品名" prop="productName">
                    <el-input v-model="form.productName" clearable placeholder="eg:碗架,硅胶吸管,水杯收纳" />
                </el-form-item>
                <el-form-item label="产品短描述" prop="productDesc">
                    <el-input v-model="form.productDesc" clearable placeholder="eg:20管45×31.7CM" />
                </el-form-item>
            </el-form>
            <div class="list-container auto-height-container">
                <el-scrollbar>
                    <ul class="vab-auto-box">
                        <!-- list第一行 新增变体 -->
                        <li class="list-item"> 
                            <div class="list-item-meta">
                                <div class="list-item-meta-content" style="text-align: center">
                                    <el-space>
                                        <span style="width: 240px;">{{ "变体名" }}</span>
                                    </el-space>
                                </div>
                                <div class="list-item-meta-content" style="text-align: center">
                                    <el-space>
                                        <span style="width: 240px;">{{ "订货数量(亚马逊US)" }}</span>
                                    </el-space>
                                </div>
                                <div class="list-item-meta-content">
                                    <el-button type="primary" @click="handleAddVariants">新增变体</el-button>
                                </div>
                            </div>
                        </li>
                        <li v-for="(item, index) in form.variantList" :key="index" class="list-item">
                            <div class="list-item-meta">
                                <div class="list-item-meta-content">
                                  <el-input v-model="item.variantName" clearable placeholder="黑色；白色；1大1小；海洋系列等" style="width: 240px"/>
                                </div>
                                <div class="list-item-meta-content">
                                  <el-input v-model="item.amazonUSVariantQuantity" clearable style="width: 240px"/>
                                </div>
                                <div class="list-item-meta-content">
                                  <el-button type="danger" @click="handleDelVariants(index)">删除变体</el-button>
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
            <el-button native-type="submit" type="primary" @click="handleSubmit">保存</el-button>
            <el-button native-type="submit" type="primary" @click="handleSubmitAndContinue">保存并继续</el-button>
        </div>
    </div>
  </template>
  
<script lang="ts" setup>
defineOptions({
    name: 'OrderStep1',
})
import { IreviewStepNo1SaveOn } from '/@/type/orderProcess/orderProcessType';
import { reviewStepNo1Del, reviewStepNo1SaveOn } from '/@/api/devlocal/orderProcess';
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'
import type { FormInstance } from 'element-plus'

const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore

const emit = defineEmits<{ 
    (e: 'change-step', value: number): void
    (e: 'sendDataToStep2', value: number): void
 }>()
const formRef = ref<FormInstance>()
const form = reactive<IreviewStepNo1SaveOn>({
  variantSku: '',
  productName: '',
  productDesc: '',
  variantList: [
    {
      variantName: '', 
      amazonUSVariantQuantity: undefined,
      orderEntryId: 0
    }
  ],
})

const rules = reactive<any>({
  productName: [{ required: true, message: '请输入产品主品名', trigger: 'blur' }],
  productDesc: [
    { required: true, message: '请输入产品短描述', trigger: 'blur' },
  ],
})
const handleAddVariants = () => {
    // 新增一个空的变体名和订货数量
    form.variantList.push({
      variantName: '', 
      amazonUSVariantQuantity: undefined,
      orderEntryId: form.variantList.length
    });
}   
const handleDelVariants = async (index: number) => {
    if (form.variantList.length > 1) { // 防止删除最后一个变体
        form.variantList.splice(index, 1)
    } else {
        $baseMessage("至少需要保留一个变体", "warning")
    }
}

// 当点击保存的时候
const handleSubmit = () => {
  formRef.value?.validate((valid: any) => {
    if (valid) {
      const saveOn = async () => {
        if (route.query.progressId) {
          const { data }  = await reviewStepNo1SaveOn({...form, progressId: route.query.progressId})
          if (data) {
            $baseMessage("当前进度已成功保存到“新品审核与记录”。如果中途退出后需要继续编辑，请到“新品审核与记录”里查看。","success","hey")
          }
        }
      }
      saveOn()
    }
  })
}

let res: number
const handleSubmitAndContinue = async () => {
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      const saveOn = async () => {
        try {
          if (route.query.progressId) {
            const { data } = await reviewStepNo1SaveOn({ ...form, progressId: route.query.progressId })
            if (data) {
              res = data
              $baseMessage(
                "当前进度已成功保存到“新品审核与记录”。如果中途退出后需要继续编辑，请到“新品审核与记录”里查看。",
                "success",
                "hey"
              )
              emit('sendDataToStep2', res)
              emit('change-step', 1)
            } else {
              console.error('API 返回没有 data')
            }
          } else {
            console.error('progressId 未定义')
          }
        } catch (error) {
          console.error('保存过程出错:', error)
        }
      }
      saveOn()
    } else {
      console.log('表单验证失败')
    }
  })
}


defineExpose({ form });
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
  max-height: calc(var(--el-container-height) - 92px - 150px - 20px - 178px); 
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
  