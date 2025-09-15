<template>
  <div class="comprehensive-form-container">
    <div style="display: flex; flex-direction: column; min-height: calc(var(--el-container-height) - 44px)">
      <el-page-header @back="goBack">
        <template #content>
          <span class="text-large font-600 mr-3">{{ route.query.sku ? route.query.sku : '' }}</span>
          <span class="text-large font-600 mr-3">文案</span>
          <span class="text-large font-600 mr-3" style="color: var(--el-color-primary)">(输入后系统自动保存)</span>
        </template>
      </el-page-header>

      <div style="display: flex; flex: 1; flex-direction: column">
        <el-row :gutter="50" style="display: flex; flex-grow: 1; align-items: center; justify-content: center">
          <!-- 左侧表单 -->
          <el-col :span="12" style="display: flex; justify-content: flex-end">
            <el-form class="custom-form" label-position="right" label-width="10.5em" :model="form" style="width: 80%; padding-right: 50px">
              <el-form-item label="目标客群" prop="targetAudience">
                <el-input v-model="form.targetAudience" disabled />
              </el-form-item>
              <el-form-item label="产品使用场景" prop="usageScenario">
                <el-input v-model="form.usageScenario" disabled />
              </el-form-item>
              <el-form-item label="材质" prop="material">
                <el-input v-model="form.material" disabled />
              </el-form-item>
              <el-form-item label="竞品ASIN" prop="competitiveAsin">
                <el-input v-model="form.competitiveAsin" disabled />
              </el-form-item>
              <el-form-item label="同赛道ASIN" prop="sameTrackAsin">
                <el-input v-model="form.sameTrackAsin" disabled />
              </el-form-item>
              <el-form-item label="链接关键词" prop="linkKeywords">
                <el-input v-model="form.linkKeywords" disabled />
              </el-form-item>
              <el-form-item label="需规避品牌词" prop="brand">
                <el-input v-model="form.brand" disabled />
              </el-form-item>
              <el-form-item
                label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&ensp;功能/卖点/5点(重要性从高到低排列)"
                prop="sellingPointContent"
              >
                <el-input v-model="form.sellingPointContent" disabled resize="none" :rows="15" type="textarea" />
              </el-form-item>
            </el-form>
          </el-col>

          <!-- 右侧表单 -->
          <el-col
            :span="12"
            style="display: flex; flex-direction: column; justify-content: flex-start; padding-right: 250px; margin-top: 25px"
          >
            <el-form
              ref="formRef"
              class="custom-form"
              label-position="right"
              label-width="10.5em"
              :model="form"
              style="width: 100%; height: 100%"
            >
              <el-form-item label="标题1" prop="title1">
                <el-input v-model="form.title1" resize="none" :rows="4" type="textarea" @change="setLocalStorageData" />
              </el-form-item>
              <el-form-item label="标题2" prop="title2">
                <el-input v-model="form.title2" resize="none" :rows="4" type="textarea" @change="setLocalStorageData" />
              </el-form-item>
              <el-form-item label="链接关键词(译文)" prop="linkKeywordsTs">
                <el-input v-model="form.linkKeywordsTs" resize="none" :rows="4" type="textarea" @change="setLocalStorageData" />
              </el-form-item>
              <el-form-item label="功能/卖点/5点(译文)" prop="sellingPointContentTs">
                <el-input
                  v-model="form.sellingPointContentTs"
                  resize="none"
                  :rows="15"
                  style="flex-grow: 1"
                  type="textarea"
                  @change="setLocalStorageData"
                />
              </el-form-item>
            </el-form>
            <!-- 确定和取消按钮 -->
            <div style="margin-top: auto; text-align: right">
              <el-button type="danger" @click="goBack">返回</el-button>
              <el-button type="success" @click="handleConfirmSave">确定</el-button>
            </div>
          </el-col>
        </el-row>
        <!-- <div style="margin-left: 83.5%;" @click="goBack">
          <el-button type="danger">返回</el-button>
          <el-button type="success" @click="handleConfirmSave">确定</el-button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { getArtDesignCopywriting, saveArtDesignCopywriting } from '/@/api/devlocal/imageTask'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'

defineOptions({
  name: 'Copywriting',
})
const sku = ref<string>('')
const route: any = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
const form = reactive<any>({})
const formRules = reactive<FormRules>({
  title1: [{ required: true, message: '请填写标题1', trigger: 'blur' }],
  title2: [{ required: true, message: '请填写标题2', trigger: 'blur' }],
  linkKeywordsTs: [{ required: true, message: '请填写链接关键词(译文)', trigger: 'blur' }],
  sellingPointContentTs: [{ required: true, message: '请填写功能/卖点/5点(译文)', trigger: 'blur' }],
})
const formRef = ref<FormInstance>()
const handleConfirmSave = async () => {
  const { data } = await saveArtDesignCopywriting({
    artDesignTaskId: Number(route.query.id),
    id: form.id,
    title1: form.title1,
    title2: form.title2,
    linkKeywordsTs: form.linkKeywordsTs,
    sellingPointContentTs: form.sellingPointContentTs,
  })
  if (data) {
    $baseMessage('保存成功！', 'success')
    localStorage.removeItem('copywritingForm')
    goBack()
  }
}
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  router.push({
    path: '/newProductTask/listingImageTask',
  })
}
const setLocalStorageData = () => {
  // 获取现有的缓存数据
  const existingData = localStorage.getItem(`${sku.value}_sellingPointForm`)
  let mergedData = {}

  if (existingData) {
    // 如果存在缓存，先解析现有数据
    const existing = JSON.parse(existingData)
    // 合并现有数据和新数据，新数据优先级更高
    mergedData = { ...existing, ...toRaw(form) }
  } else {
    // 如果没有缓存，直接使用新数据
    mergedData = toRaw(form)
  }

  // 保存合并后的数据
  localStorage.setItem(`${sku.value}_sellingPointForm`, JSON.stringify(mergedData))
}
onBeforeMount(async () => {
  sku.value = route.query.sku
  // // 有缓存读缓存，没缓存获取数据
  // const savedForm = localStorage.getItem(`${sku.value}_sellingPointForm`)
  // if (savedForm) {
  //   Object.assign(form, JSON.parse(savedForm))
  // } else {
  const { data } = await getArtDesignCopywriting({
    sku: sku.value,
  })
  Object.assign(form, data)
  // 获取到的数据存储到localStorage
  setLocalStorageData()
  // }
})
</script>

<style lang="scss" scoped>
.custom-form {
  .el-form-item {
    margin-bottom: 25px;
  }
}
</style>
