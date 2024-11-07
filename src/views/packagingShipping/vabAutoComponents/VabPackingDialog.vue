<template>
  <vab-dialog
    title="装箱"
    width="660px"
    v-model="dflag"
    class="dialog"
    @close="handleCloseDialog"
    @open="handlePackingOpen"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form ref="packingFormRef" :model="packingForm" :rules="packingFormRules" label-position="top">
          <el-form-item :label="props.upcOrFnSku" prop="fnSku">
            <el-input ref="barcodeInput" v-model="packingForm.fnSku" :disabled="barcodeDisabled" @keydown.enter="handleKeyPress" @blur="handleCodeChange" clearable />
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
        <el-button type="primary" @click="switchNext">下一个</el-button>
        <el-button type="success" @click="showConfirm">完成</el-button>
      </div>
    </template>
  </vab-dialog>
  <!-- 确认 -->
  <vab-dialog
    title="确认"
    width="35%"
    v-model="confirmVisible"
    :before-close="closeConfirm"
  >
    <el-form style="margin-left: 1px; margin-right: 1px">
      <el-form-item label="数量(箱)">
        <el-input style="width: 100%" clearable />
      </el-form-item>
    </el-form>
    <vab-query-form style="margin-top: 20px">
      <vab-query-form-right-panel :span="24">
        <el-form inline>
          <el-form-item>
            <el-input placeholder="请输入搜索关键词" clearable />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary"></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table border stripe :data="fakeData" :header-cell-style="{ textAlign: 'center' }" min-height="20vh" max-height="30vh">
      <el-table-column label="SKU" prop="sku" min-width="200"></el-table-column>
      <el-table-column label="FNSKU" prop="" min-width="100"></el-table-column>
      <el-table-column label="Description" prop="" min-width="200"></el-table-column>
      <el-table-column label="数量" prop="" min-width="70" align="center"></el-table-column>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <template #footer>
      <div style="text-align: center;">
        <el-button type="primary">保存并打印条形码</el-button>
        <el-button @click="goBack">返回</el-button>
        <el-button @click="closeConfirm">关闭</el-button>
      </div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { FormInstance } from 'element-plus'
import { usePackingStore } from '/@/store/modules/packing'
import { _addPacking, _clearPacking, _deletePacking, _updatePacking } from '/@/utils/packing'

let props = defineProps<{
  packingVisible: boolean
  upcOrFnSku: string
}>()
const dflag = ref<boolean>(false)
// 上一个显示与否
const previousVisible = ref<boolean>(false)
watchEffect(() => {
  dflag.value = props.packingVisible
  if (dflag.value) {
    // 首次打开先清空
    _clearPacking()
    // 第一次 上一个按钮隐藏，下一个按钮是一直存在
    previousVisible.value = false
    // 表单也先清空
    packingFormRef.value?.resetFields()
  }
})
const emit = defineEmits(['update:packingVisible'])
const handleCloseDialog = () => {
  dflag.value = false
  emit('update:packingVisible', dflag.value);
}
const packingForm = reactive<any>({
  fnSku: '',
  sku: '',
  productName: '',
  count: undefined,
  url: 'https://picsum.photos/200/200'
})
const packingFormRef = ref<FormInstance>()
const packingFormRules = computed(() => ({
  fnSku: [{ required: true, message: `请输入${props.upcOrFnSku}`, trigger: 'blur' }],
  count: [{ required: true, message: '请输入数量', trigger: 'blur' }]
}));
const tempCurId = ref<string>('')
const packingStore = usePackingStore()
// FNSKU输入框引用
const barcodeInput = ref<HTMLInputElement | null>(null)
// 装箱数量引用
const packingCount = ref<HTMLInputElement | null>(null)
// 确认可见
const confirmVisible = ref<boolean>(false)

const total = ref<number>(0)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
}
// 展示确认
const showConfirm = () => {
  if (packingStore.packingData.length !== 0) {
    // 校验所有存储的是否是已填
    const valid = packingStore.packingData.every((item: PackingType) => {
      // 确保 fnSku 和 count 都有值，且 count 不是 0
      return item.fnSku && item.count != null && item.count !== 0;
    });
    console.log(packingStore.packingData);
    
    if (!valid) {
      // 根据具体情况生成错误消息
      const missingFields = packingStore.packingData
        .filter(item => !item.fnSku || item.count == null || item.count === 0)
        .map(item => {
          const missing = [];
          if (!item.fnSku) missing.push('fnSku');
          if (item.count == null || item.count === 0) missing.push('数量');
          return missing.join(' 和 ');
        });

        // 如果有未填写的字段
        $baseMessage(`${missingFields.join('，')}不能为空`, 'error');
        return;
    }
    confirmVisible.value = true
  } else {
    $baseMessage(`请先填写${props.upcOrFnSku}字段`, 'error')
  }
}
// 确认的返回
const goBack = () => {
  confirmVisible.value = false
}
// 关闭确认
const closeConfirm = () => {
  confirmVisible.value = false
  handleCloseDialog()
}
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
let isHandlingCodeChange = false
// 扫描完的disabled
const barcodeDisabled = ref<boolean>(false)
// 监听回车键扫描事件（包括用户回车和扫枪回车）
const handleKeyPress = (event: any) => {

  if (event.code === 'Enter') {
    const barcodeValue = (event.target as HTMLInputElement).value
    packingForm.fnSku = barcodeValue;

    // 发送网络请求，根据结果判断，是否是清空重新输入还是聚焦到数量框
    isHandlingCodeChange = true
    tempCurId.value = generateUUID()
    let flag = _addPacking(packingForm, tempCurId.value)
    if (flag) {
      console.log('packingData', packingStore.packingData)
      packingForm.fnSku = ''
      return
    }
    
    console.log('packingData', packingStore.packingData)
    // packingFormRef.value?.resetFields()
    // barcodeInput.value?.blur()
    barcodeDisabled.value = true
    if (packingCount.value) {
      packingCount.value.focus()
      packingCount.value.select()
    }
  }
}
// 用户自己输入的blur
const handleCodeChange = () => {
  if (isHandlingCodeChange) {
    isHandlingCodeChange = false
    return
  }

  // 如果用户取消输入框的输入，那么直接删除这个数据
  if (!packingForm.fnSku) {
    _deletePacking(tempCurId.value)
    return
  }
  // 发送网络请求，根据结果判断，是否是清空重新输入还是聚焦到数量框
   
  tempCurId.value = generateUUID()
  let flag = _addPacking(packingForm, tempCurId.value)
  if(flag) {
    packingForm.fnSku = ''
    return
  }
  barcodeDisabled.value = true
  console.log('packingData', packingStore.packingData)
}
// 更新表单
const handleUpdate = () => {
  const updatePacking = { tempId: tempCurId.value, ...packingForm }
  _updatePacking(updatePacking)
  console.log('更新', packingStore.packingData);
}

// 切换上一个
const switchPrevious = () => {
  // 首先判断是否都输入
  packingFormRef.value?.validate((isValid: boolean) => {
    if (isValid) {
      // 上一个一定是有数据的
      const data = packingStore.packingData
      const index = data.findIndex((item: PackingType) => item.tempId === tempCurId.value)
      // 先判断上一个是不是第一个，如果是，上一个显示隐藏
      if (index - 1 === 0) {
        previousVisible.value = false
      }
      Object.assign(packingForm, data[index - 1])
      // id赋值
      tempCurId.value = data[index - 1].tempId
    }
  })
}
// 切换下一个
const switchNext = () => {
  // 首先判断是否都输入
  packingFormRef.value?.validate((isValid: boolean) => {
    if (isValid) {
      // 两种情况，一种是在中间点击下一个，跳到对应的数据位置；一种是在最后一个点击下一个，跳到新的数据
      const data = packingStore.packingData
      const length = data.length
      const index = data.findIndex((item: PackingType) => item.tempId === tempCurId.value)
      if (length - 1 === index) { // 如果就是最后一个，创建一个新的
        packingFormRef.value?.resetFields()
        tempCurId.value = 'null'
        console.log('最后一个下一个后的数据', packingStore.packingData)
        // 上一个按钮展示
        previousVisible.value = true
        // 聚焦到FNSKU
        barcodeInput.value?.focus()
        barcodeDisabled.value = false
      } else { // 如果是中间的，就再跳到下一个
        Object.assign(packingForm, data[index + 1])
        // 当前id变换
        tempCurId.value = data[index + 1].tempId
        console.log('中间的下一个后的数据', packingStore.packingData);
        // 上一个按钮展示
        previousVisible.value = true
      }
    }
  })
}
const fakeData = [
  {
    sku: '1111111111111111111111111'
  },
  {
    sku: '1111111111111111111111111'
  },
  {
    sku: '1111111111111111111111111'
  },
  {
    sku: '1111111111111111111111111'
  },
  {
    sku: '1111111111111111111111111'
  },
  {
    sku: '1111111111111111111111111'
  },
  {
    sku: '1111111111111111111111111'
  },
  {
    sku: '1111111111111111111111111'
  },
]
</script>