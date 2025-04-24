<template>
  <div>
    <el-space direction="vertical" style="width: 100%;">
      <el-form
        ref="formRef"
        label-position="right"
        label-width="170px"
        :model="form"
        :rules="rules"
        style="display: flex; flex-direction: column; align-items: center; justify-content: center;"
        @submit.prevent
      >

        <el-form-item label="合并变体的SKU(若有)" prop="variantSku">
          <el-input v-model="form.variantSku" clearable @blur="handleVariantSkuMap"/>
        </el-form-item>

        <el-form-item label="产品主品名" prop="productName">
          <el-input v-model="form.productName" clearable placeholder="eg:碗架,硅胶吸管,水杯收纳" />
        </el-form-item>
        <el-form-item label="产品短描述" prop="productDesc">
            <el-input v-model="form.productDesc" clearable placeholder="eg:20管45×31.7CM" />
        </el-form-item>

        <div class="list-container auto-height-container">
          <el-scrollbar>
            <el-form-item class="variant-list-error" :error="variantListError" prop="variantList">
              <ul class="vab-auto-box">
                <!-- list第一行 新增变体 -->
                <li class="list-item">
                  <div class="list-item-meta" style="font-size: var(--el-form-label-font-size); color: var(--el-text-color-regular);">
                    <div class="list-item-meta-content" style="text-align: center">
                      <el-space>
                        <span style="width: 240px;">{{ "变体名" }}</span>
                      </el-space>
                    </div>
                    <div class="list-item-meta-content" style="text-align: center">
                      <el-space>
                        <span style="width: 240px;">{{ "订货数量" }}</span>
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
                      <el-input v-model="item.variantName" clearable placeholder="黑色；白色；1大1小；海洋系列等" style="width: 240px" />
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
            </el-form-item>
          </el-scrollbar>
        </div>

      </el-form>
      <div style="color: var(--el-color-primary)">注：产品最终名称系统自动合成=产品主品名+产品规格描述+变体名（若有）</div>
    </el-space>
    <div class="pay-button-group">
      <el-button @click="handleGoback">退出</el-button>
      <el-button v-throttle="handleSubmit" :loading="saveLoading" type="primary">保存</el-button>
      <el-button v-throttle="handleSubmitAndContinue" :loading="submitAndContinueLoading" type="primary">保存并继续</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { reviewProgressId, reviewSkuInfo, reviewStepNo1, reviewStepNo1Del, reviewStepNo1SaveOn } from '/@/api/devlocal/orderProcess'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'
import { _setStepNo } from '/@/utils/stepNoState'

defineOptions({
  name: 'OrderStep1',
})

const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore

const emit = defineEmits<{
    (e: 'change-step', value: number): void
    (e: 'sendDataToStep2', value: number): void
 }>()
const formRef = ref<FormInstance>()
let form = reactive<any>({
  variantSku: '',
  productName: '',
  productDesc: '',
  variantList: [
    {
      variantName: '',
      amazonUSVariantQuantity: undefined,
      orderEntryId: undefined
    }
  ],
})
const variantListError = ref('');
const rules = reactive<any>({
  productName: [{ required: true, message: '请输入产品主品名', trigger: 'blur' }],
  productDesc: [
    { required: true, message: '请输入产品短描述', trigger: 'blur' },
  ],
  variantList: [
    {
      validator: (rule: any, value: any, callback: any) => {
        const hasVariant = value.some((variant: any) => variant.variantName !== '' && variant.amazonUSVariantQuantity !== undefined);
        if (hasVariant) {
          variantListError.value = ''; // 清空错误信息
          callback();
        } else {
          variantListError.value = '至少需要填写一个变体的名称和订货数量'; // 设置错误信息
          callback(new Error(variantListError.value));
        }
      },
      trigger: 'blur',
    },
  ],
})
// 合并变体的主品名和短描述
const handleVariantSkuMap = async () => {
  if (form.variantSku) {
    const { data } = await reviewSkuInfo({ sku: form.variantSku })
    form.productName = data.productName
    form.productDesc = data.productDesc
  }
}
const handleAddVariants = () => {
    // 新增一个空的变体名和订货数量
    form.variantList.push({
      variantName: '',
      amazonUSVariantQuantity: undefined,
      orderEntryId: undefined,
    });
}
const handleDelVariants = async (index: number) => {
  if (form.variantList.length <= 1) { // 防止删除最后一个变体
    $baseMessage("至少需要保留一个变体", "warning");
    return;
  }

  if ((route.query.reviewStatus === '0' || route.query.reviewStatus === '2') && form.variantList[index].orderEntryId !== undefined) { // 编辑下并且变体的id是存在的
    try {
      $baseConfirm('确定要删除本条变体吗', "系统提示", async () => {
        try {
          const { data } = await reviewStepNo1Del({ orderEntryId: form.variantList[index].orderEntryId! });
          if (data === true) {
            form.variantList.splice(index, 1);
            $baseMessage("变体删除成功！", "success", "hey");
          } else {
            $baseMessage("变体删除失败，请重试。", "error", "hey");
          }
        } catch (delError) {
          console.error(delError);
          $baseMessage("变体删除操作失败，请重试。", "error", "hey");
        }
      });
    } catch (confirmError) {
      console.error(confirmError);
      $baseMessage("确认操作失败，请重试。", "error", "hey");
    }
  } else {
    form.variantList.splice(index, 1);
  }
}
const _reviewId = ref<number>(parseInt(route.query.reviewId))
// 保存按钮的loading
const saveLoading = ref<boolean>(false)
// 保存并继续按钮的loading
const submitAndContinueLoading = ref<boolean>(false)
// let firstSave = false // 第一次保存
const router = useRouter()
// 当点击保存的时候
const handleSubmit = () => {
  saveLoading.value = true
  formRef.value?.validate((valid: any) => {
    if (valid) {
      const saveOn = async () => {

        if (route.query.progressId) {
          if (localStorage.getItem('orderStep1ReviewId')) {
            // console.log('orderStep1ReviewId', localStorage.getItem('orderStep1ReviewId'))
            _reviewId.value = parseInt(localStorage.getItem('orderStep1ReviewId')!)
            const { data }  = await reviewStepNo1SaveOn({ ...form, progressId: route.query.progressId, reviewId: _reviewId.value })
            if (data !== undefined && data !== null) {
              router.replace({
                query: {
                  // ...route.query,
                  reviewId: _reviewId.value.toString(),
                  reviewStatus: '0'
                }
              })
              localStorage.setItem('orderStep1Form', JSON.stringify(form))
              $baseMessage("当前进度已成功保存到“新品审核与记录”。如果中途退出后需要继续编辑，请到“新品审核与记录”里查看。", "success", "hey")
            }
          } else {
            const { data }  = await reviewStepNo1SaveOn({ ...form, progressId: route.query.progressId, reviewId: _reviewId.value })
            if (data !== undefined && data !== null) {
              _reviewId.value = data
              // const { data: res } = await reviewStepNo1({ reviewId: _reviewId.value })
              // Object.assign(form, res)

              router.replace({
                query: {
                  // ...route.query,
                  reviewId: _reviewId.value.toString(),
                  reviewStatus: '0'
                }
              })
              localStorage.setItem('orderStep1Form', JSON.stringify(form))
              $baseMessage("当前进度已成功保存到“新品审核与记录”。如果中途退出后需要继续编辑，请到“新品审核与记录”里查看。", "success", "hey")
            }
          }
          // if (firstSave) {
          //   const { data }  = await reviewStepNo1SaveOn({ ...form, progressId: route.query.progressId, reviewId: _reviewId.value })
          //   if (data) {
          //     _reviewId.value = data
          //     localStorage.setItem('orderStep1Form', JSON.stringify(form))
          //     $baseMessage("当前进度已成功保存到“新品审核与记录”。如果中途退出后需要继续编辑，请到“新品审核与记录”里查看。", "success", "hey")
          //   }
          // } else { //是初次保存,保存后刷新

          // }

        } else {
          const reviewId = parseInt(route.query.reviewId)
          // 根据 reviewId 获得 progressId
          const { data: _progressId } = await reviewProgressId({ reviewId })
          // 保存第一步
          await reviewStepNo1SaveOn({ ...form, progressId: _progressId, reviewId })

            $baseMessage(
              "当前进度已成功保存到“新品审核与记录”。如果中途退出后需要继续编辑，请到“新品审核与记录”里查看。",
              "success",
              "hey"
            )
            _setStepNo(Number(reviewId), 0)
            // await delVisitedRoute(handleActivePath(route, true))
        }
      }
      saveOn()
    }
  })
  saveLoading.value = false
}

let res: number
const handleSubmitAndContinue = async () => {
  submitAndContinueLoading.value = true
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      const saveOn = async () => {
        try {
          if (localStorage.getItem('orderStep1ReviewId')) {
            // console.log('orderStep1ReviewId', localStorage.getItem('orderStep1ReviewId'))
            _reviewId.value = parseInt(localStorage.getItem('orderStep1ReviewId')!)
          }
          if (route.query.progressId) {
            const { data } = await reviewStepNo1SaveOn({ ...form, progressId: route.query.progressId, reviewId: _reviewId.value })

            if (data !== undefined && data !== null) {
              res = data
              localStorage.setItem('orderStep1Form', JSON.stringify(form))
              // 只在没有 orderStep1ReviewId 的时候设置
              if (!localStorage.getItem('orderStep1ReviewId')) {
                localStorage.setItem('orderStep1ReviewId', data.toString())
              }
              emit('sendDataToStep2', res)
              emit('change-step', 1)
              // router.replace({
              //   query: {
              //     // ...route.query,
              //     reviewId: data.toString(),
              //     reviewStatus: '0',
              //     stepNo: '1'
              //   }
              // })
              $baseMessage(
                "当前进度已成功保存到“新品审核与记录”。如果中途退出后需要继续编辑，请到“新品审核与记录”里查看。",
                "success",
                "hey"
              )

            } else {
              console.error('API 返回没有 data')
            }
          } else {
            const reviewId =  parseInt(route.query.reviewId)
            const {data: _progressId } = await reviewProgressId({ reviewId: route.query.reviewId })
            await reviewStepNo1SaveOn({ ...form, progressId: _progressId, reviewId })

              $baseMessage(
                "当前进度已成功保存到“新品审核与记录”。如果中途退出后需要继续编辑，请到“新品审核与记录”里查看。",
                "success",
                "hey"
              )

              emit('change-step', 1)
              _setStepNo(Number(reviewId), 0)
              // await delVisitedRoute(handleActivePath(route, true))
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
  submitAndContinueLoading.value = false
}

defineExpose({ form });
// 当点击退出的时候
const handleGoback = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  history.back()
  localStorage.removeItem('orderStep1ReviewId')
}
const fetchData = async () => {
  const { data }  = await reviewStepNo1({ reviewId: parseInt(route.query.reviewId) })

  Object.assign(form, data);
}

onMounted(async () => {  //编辑进来的需要获取数据, 订大货的需要是空
  const getItem = localStorage.getItem('orderStep1Form')
  if (getItem) {
    Object.assign(form, JSON.parse(getItem));
    localStorage.removeItem('orderStep1Form')
  }
  // 编辑进来的
  if (route.query.reviewId && (route.query.reviewStatus === '0' || route.query.reviewStatus === '2')) {
    fetchData()
  }
  // 订大货的
  if (localStorage.getItem('orderStep1ReviewId')) {
    const { data }  = await reviewStepNo1({ reviewId: Number(localStorage.getItem('orderStep1ReviewId')) })

    Object.assign(form, data);
  }
})
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
:deep(.variant-list-error .el-form-item__error) {
    margin-left: 30px;
}
:deep(.el-input__wrapper) {
  position: relative;
  .el-input__inner {
    padding-right: 18px;
  }
  .el-input__suffix {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
  }
}
</style>
