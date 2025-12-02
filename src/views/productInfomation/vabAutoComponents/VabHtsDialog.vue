<template>
  <vab-dialog v-model="dialogVisible" :draggable="false" :title="readonly ? '查看HTS' : '查看和修改HTS'" width="15%" @close="handleClose">
    <el-form label-width="auto" style="margin-right: 0; margin-left: 0">
      <el-form-item label="HTS美国">
        <div class="hts-select-container">
          <el-select
            v-model="htsForm.us"
            clearable
            :disabled="readonly"
            filterable
            placeholder="请选择HTS美国"
            @change="handleChangeHtsUsa"
          >
            <el-option v-for="item in usaList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
          <el-button
            v-if="htsForm.us"
            circle
            class="copy-btn"
            :icon="CopyDocument"
            size="small"
            type="primary"
            @click="handleClip(getHtsName(htsForm.us, usaList))"
          />
        </div>
      </el-form-item>
      <el-form-item label="HTS英国">
        <div class="hts-select-container">
          <el-select v-model="htsForm.uk" clearable :disabled="readonly" filterable placeholder="请选择HTS英国" @change="handleChangeHtsUk">
            <el-option v-for="item in ukHtsList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
          <el-button
            v-if="htsForm.uk"
            circle
            class="copy-btn"
            :icon="CopyDocument"
            size="small"
            type="primary"
            @click="handleClip(getHtsName(htsForm.uk, ukHtsList))"
          />
        </div>
      </el-form-item>
      <el-form-item label="HTS德国">
        <div class="hts-select-container">
          <el-select v-model="htsForm.de" clearable :disabled="readonly" filterable placeholder="请选择HTS德国" @change="handleChangeHtsDe">
            <el-option v-for="item in deHtsList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
          <el-button
            v-if="htsForm.de"
            circle
            class="copy-btn"
            :icon="CopyDocument"
            size="small"
            type="primary"
            @click="handleClip(getHtsName(htsForm.de, deHtsList))"
          />
        </div>
      </el-form-item>
      <el-form-item label="HTS加拿大">
        <div class="hts-select-container">
          <el-select
            v-model="htsForm.ca"
            clearable
            :disabled="readonly"
            filterable
            placeholder="请选择HTS加拿大"
            @change="handleChangeHtsCa"
          >
            <el-option v-for="item in caHtsList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
          <el-button
            v-if="htsForm.ca"
            circle
            class="copy-btn"
            :icon="CopyDocument"
            size="small"
            type="primary"
            @click="handleClip(getHtsName(htsForm.ca, caHtsList))"
          />
        </div>
      </el-form-item>
      <el-form-item label="HTS日本">
        <div class="hts-select-container">
          <el-select v-model="htsForm.jp" clearable :disabled="readonly" filterable placeholder="请选择HTS日本" @change="handleChangeHtsJp">
            <el-option v-for="item in jpHtsList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
          <el-button
            v-if="htsForm.jp"
            circle
            class="copy-btn"
            :icon="CopyDocument"
            size="small"
            type="primary"
            @click="handleClip(getHtsName(htsForm.jp, jpHtsList))"
          />
        </div>
      </el-form-item>
    </el-form>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { CopyDocument } from '@element-plus/icons-vue'
import { computed, reactive, ref, watch } from 'vue'
import { handleClip } from '~/src/utils/clipboard'
import {
  getCustomsClearanceSkuHtsList,
  getCustomsClearanceSkuList,
  getHtsSelectList,
  getSkuCustomsClearanceHtsList,
  updateCustomsClearanceSkuHts,
} from '/@/api/devlocal/productInformation'

defineOptions({
  name: 'VabHtsDialog',
})

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    skuCustomsDeclarationId?: number
    sku?: string // 如果提供 sku，则通过 sku 查询 skuCustomsDeclarationId
    readonly?: boolean // 是否只读模式
  }>(),
  {
    readonly: false,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const htsForm = reactive<any>({})
const usaList = ref<{ id: number; label: string }[]>([])
const ukHtsList = ref<{ id: number; label: string }[]>([])
const deHtsList = ref<{ id: number; label: string }[]>([])
const caHtsList = ref<{ id: number; label: string }[]>([])
const jpHtsList = ref<{ id: number; label: string }[]>([])

const getHtsName = (hsId: number, htsList: any[]) => {
  if (!hsId || !htsList) return ''
  const hts = htsList.find((item: any) => item.id === hsId)
  return hts ? hts.label : ''
}

// 获取 HTS 列表
const fetchHtsLists = async () => {
  await Promise.all([fetchHtsUsaList(), fetchHtsUkList(), fetchHtsDeList(), fetchHtsCaList(), fetchHtsJpList()])
}

const fetchHtsUsaList = async () => {
  const { data } = await getHtsSelectList({ country: '美国' })
  usaList.value = data
}

const fetchHtsUkList = async () => {
  const { data } = await getHtsSelectList({ country: '英国' })
  ukHtsList.value = data
}

const fetchHtsDeList = async () => {
  const { data } = await getHtsSelectList({ country: '德国' })
  deHtsList.value = data
}

const fetchHtsCaList = async () => {
  const { data } = await getHtsSelectList({ country: '加拿大' })
  caHtsList.value = data
}

const fetchHtsJpList = async () => {
  const { data } = await getHtsSelectList({ country: '日本' })
  jpHtsList.value = data
}

// 获取当前的 skuCustomsDeclarationId
const getCurrentSkuCustomsDeclarationId = async (): Promise<number | null> => {
  if (props.skuCustomsDeclarationId) {
    return props.skuCustomsDeclarationId
  }
  if (props.sku) {
    return await getSkuCustomsDeclarationId(props.sku)
  }
  return null
}

// 更新 HTS
const handleChangeHtsUsa = async () => {
  if (props.readonly) return
  const id = await getCurrentSkuCustomsDeclarationId()
  if (!id) return
  await updateCustomsClearanceSkuHts({
    id,
    htsId: htsForm.us,
    type: 0,
  })
}

const handleChangeHtsUk = async () => {
  if (props.readonly) return
  const id = await getCurrentSkuCustomsDeclarationId()
  if (!id) return
  await updateCustomsClearanceSkuHts({
    id,
    htsId: htsForm.uk,
    type: 1,
  })
}

const handleChangeHtsDe = async () => {
  if (props.readonly) return
  const id = await getCurrentSkuCustomsDeclarationId()
  if (!id) return
  await updateCustomsClearanceSkuHts({
    id,
    htsId: htsForm.de,
    type: 2,
  })
}

const handleChangeHtsCa = async () => {
  if (props.readonly) return
  const id = await getCurrentSkuCustomsDeclarationId()
  if (!id) return
  await updateCustomsClearanceSkuHts({
    id,
    htsId: htsForm.ca,
    type: 3,
  })
}

const handleChangeHtsJp = async () => {
  if (props.readonly) return
  const id = await getCurrentSkuCustomsDeclarationId()
  if (!id) return
  await updateCustomsClearanceSkuHts({
    id,
    htsId: htsForm.jp,
    type: 4,
  })
}

// 通过 sku 查询 skuCustomsDeclarationId（用于更新操作）
const getSkuCustomsDeclarationId = async (sku: string): Promise<number | null> => {
  if (!sku) return null
  try {
    const { data } = await getCustomsClearanceSkuList({
      keyWord: sku,
      status: 1,
      pageNo: 1,
      pageSize: 1,
    })
    if (data?.list && data.list.length > 0) {
      return data.list[0].id || null
    }
  } catch (error) {
    console.error('获取 skuCustomsDeclarationId 失败:', error)
  }
  return null
}

// 加载 HTS 数据
const loadHtsData = async () => {
  // 如果提供了 sku，使用新接口直接查询
  if (props.sku) {
    try {
      const { data } = await getSkuCustomsClearanceHtsList({ sku: props.sku })
      // 重置表单
      Object.keys(htsForm).forEach((key) => {
        delete htsForm[key]
      })
      // Map 转对象
      if (data && data instanceof Map) {
        const htsData: any = {}
        data.forEach((value, key) => {
          htsData[key] = value
        })
        Object.assign(htsForm, htsData)
      } else if (data && typeof data === 'object') {
        Object.assign(htsForm, data)
      }
      return
    } catch (error) {
      console.error('获取 HTS 数据失败:', error)
    }
  }

  // 如果提供了 skuCustomsDeclarationId，使用原接口
  if (props.skuCustomsDeclarationId) {
    // 重置表单
    Object.keys(htsForm).forEach((key) => {
      delete htsForm[key]
    })

    const { data } = await getCustomsClearanceSkuHtsList({ skuCustomsDeclarationId: props.skuCustomsDeclarationId })
    if (data && Object.keys(data).length > 0) {
      Object.assign(htsForm, data)
    }
  }
}

const handleClose = () => {
  dialogVisible.value = false
}

// 监听对话框打开，加载数据
watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal) {
      await fetchHtsLists()
      await loadHtsData()
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.hts-select-container {
  display: flex;
  align-items: center;
  gap: 8px;

  .el-select {
    flex: 1;
  }

  .copy-btn {
    flex-shrink: 0;
  }
}
</style>
