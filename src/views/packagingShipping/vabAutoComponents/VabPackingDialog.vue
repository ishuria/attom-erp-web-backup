<template>
  <vab-dialog
    title="装箱"
    width="660px"
    v-model="dflag"
    class="dialog"
    :before-close="handlerCloseDialog"
    @open="handlePackingOpen"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form ref="packingFormRef" :model="packingForm" label-position="top">
          <el-form-item label="FNSKU" prop="fnSku">
            <el-input id="barcodeInput" ref="barcodeInput" v-model="packingForm.fnSku" @keydown.enter="handleKeyPress" @change="handleCodeChange" @blur="handleBlurInput" clearable />
          </el-form-item>
          <el-form-item label="SKU" prop="sku">
            <el-input v-model="packingForm.sku" disabled />
          </el-form-item>
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="packingForm.productName" disabled />
          </el-form-item>
          <el-form-item label="数量" prop="count">
            <el-input ref="packingCount" v-model="packingForm.count" clearable @change="handleUpdate" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-image :src="packingForm.url" style="width: 300px; height: 300px">
          <template #error>
            <el-icon></el-icon>
          </template>
        </el-image>
      </el-col>
    </el-row>
    <template #footer>
      <div style="text-align: center;">
        <el-button v-show="previousVisible" @click="switchPrevious">上一个</el-button>
        <el-button v-show="nextVisible" type="primary" @click="switchNext">下一个</el-button>
        <el-button type="success">完成</el-button>
      </div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { FormInstance } from 'element-plus'
import { usePackingStore } from '/@/store/modules/packing'
import { _addPacking, _clearPacking, _deletePacking, _updatePacking } from '/@/utils/packing'

const packingForm = reactive<any>({
  fnSku: '',
  sku: '',
  productName: '',
  count: undefined,
  url: 'https://picsum.photos/200/200'
})
const packingFormRef = ref<FormInstance>()
let props = defineProps<{ packingVisible: boolean }>();
const dflag = ref<boolean>(false)
// 上一个显示
const previousVisible = ref<boolean>(false)
// 下一个显示
const nextVisible = ref<boolean>(true)
watchEffect(()=>{
  dflag.value = props.packingVisible
  if (dflag.value) {
      _clearPacking()
      previousVisible.value = false
    }
  }
)
const emit = defineEmits(['update:packingVisible'])
const handlerCloseDialog = () => {
  dflag.value = false
  emit('update:packingVisible', dflag.value);
}
const tempCurId = ref<string>('')
const packingStore = usePackingStore()
// FNSKU输入框引用
const barcodeInput = ref<HTMLInputElement | null>(null)
// 装箱数量引用
const packingCount = ref<HTMLInputElement | null>(null)

// 打开装箱时自动聚焦到FNSKU输入框
const handlePackingOpen = () => {
  nextTick(() => {
    if (barcodeInput.value) {   
      barcodeInput.value.focus()
    }
  })
}
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
// 监听回车键扫描事件
const handleKeyPress = (event: any) => {
  if (event.code === 'Enter') {
    const barcodeValue = (event.target as HTMLInputElement).value
    packingForm.fnSku = barcodeValue;
    // 发送网络请求，根据结果判断，是否是清空重新输入还是聚焦到数量框

    // 存入新的数据
    tempCurId.value = generateUUID()
    // 深拷贝对象，避免引用问题
    _addPacking(packingForm, tempCurId.value)
    console.log('packingData', packingStore.packingData)
    if (packingCount.value) {
      packingCount.value.focus()
      packingCount.value.select()
    }
  }
  
}
// FNSKU 失焦的时候，一定是有修改的时候，不包含回车
const handleBlurInput = () => {
  if (packingForm.fnSku) {
    // 先判断FNSKU 是否一致
    const index = packingStore.packingData.findIndex((item: PackingType) => item.fnSku === packingForm.fnSku)
    console.log(packingForm.fnSku);
    
    console.log(index);
    
    // 如果是存在的，就不需要处理
    // 如果是不存在，就说明是新的，需要重新创建一个
    if (index === -1) {
      // 发送网络请求，创建一个新的
      // 存入新的数据
      tempCurId.value = generateUUID()
      // 深拷贝对象，避免引用问题
      _addPacking(packingForm, tempCurId.value)
      console.log('packingData', packingStore.packingData)
    }
  }
  
}
// 修改表单
const handleUpdate = () => {
  const updatePacking = { tempId: tempCurId.value, ...packingForm }
  _updatePacking(updatePacking)
  console.log('更新', packingStore.packingData);
  
}
const handleCodeChange = () => {
  if (!packingForm.fnSku) {
    _deletePacking(tempCurId.value)
  }
}
// 点击上一个
const switchPrevious = () => {
  const data = packingStore.packingData
  const index = data.findIndex((item: PackingType) => item.tempId === tempCurId.value)
  Object.assign(packingForm, data[index - 1])
  if (index - 1 === 0) {
    previousVisible.value = false
    nextVisible.value = true
  }
}
// 点击下一个
const switchNext = () => {
  const data = packingStore.packingData
  const length = data.length
  const index = data.findIndex((item: PackingType) => item.tempId === tempCurId.value)
  if (length - 1 === index) { // 如果就是最后一个，创建一个新的
    packingFormRef.value?.resetFields()
    console.log('下一个后的', packingStore.packingData);
    previousVisible.value = true
    // 聚焦到FNSKU
    barcodeInput.value?.focus()
  } //如果不是，就再跳到下一个
    Object.assign(packingForm, data[index + 1])
    console.log('下一个后的', packingStore.packingData);
    previousVisible.value = true
}

</script>