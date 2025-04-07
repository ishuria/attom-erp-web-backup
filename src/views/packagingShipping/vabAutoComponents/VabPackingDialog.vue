<template>
  <vab-dialog
    v-model="dflag"
    class="dialog"
    title="装箱"
    width="660px"
    @close="handleCloseDialog"
    @open="handlePackingOpen"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form ref="packingFormRef" label-position="top" :model="packingForm" :rules="packingFormRules">
          <el-form-item :label="upcOrFnSku" prop="fnSkuOrUpc">
            <el-input ref="barcodeInput" v-model="packingForm.fnSkuOrUpc" clearable :disabled="barcodeDisabled" @keydown.enter="handleKeyPress" />
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
        <el-image :src="packingForm.skuImageUrl" style="width: 300px; height: 300px; cursor: pointer; border: 2px #DCDFE6 solid; border-radius: 2%;" @click="imagePreviewShow(packingForm.skuImageUrl!)">
          <template #error>
            <el-icon/>
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
    v-model="confirmVisible"
    title="确认"
    width="700px"
    @close="closeConfirm"
  >
    <el-form ref="confirmFormRef" :model="confirmForm" :rules="confirmFormRules" style="margin-right: 1px; margin-left: 1px;">
      <el-form-item label="数量(箱)" prop="encaseCount">
        <el-input v-model="confirmForm.encaseCount" clearable style="width: 100%" />
      </el-form-item>
    </el-form>
    <vab-query-form style="margin-top: 20px">
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keydown.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" native-type="submit" type="primary" @click="queryData"/>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table border :data="list" :header-cell-style="{ textAlign: 'center' }" height="22vh" max-height="30vh" stripe>
      <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')" />
      <el-table-column :label="upcOrFnSku" min-width="100" prop="fnSkuOrUpc" :width="flexColumnWidth(list, 'FNSKU', 'fnSkuOrUpc')" />
      <el-table-column label="Description" prop="productName">
        <template #default="{ row }">
          <el-tooltip content="" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip" >{{ row.productName }}</div>
            </template>
            <span style="display: flex; align-items: center;">
              <el-text style="vertical-align: middle;" truncated>{{ row.productName }}</el-text>
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量" prop="count" :width="flexColumnWidth(list, '数量', 'count')"/>
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
        <el-button type="primary" @click="saveAndPrint">保存并打印条形码</el-button>
        <el-button type="success" @click="save">保存</el-button>
        <el-button @click="closeConfirm">关闭</el-button>
      </div>
    </template>
  </vab-dialog>
  <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getEncasementSku, printBarcodeEncasement, submitEncasementSku } from '/@/api/devlocal/encasement'
import { usePackingStore } from '/@/store/modules/packing'
import type { EncasementDetailList, IEncasementProduct } from '/@/type/packagingShipping/shippedType'
import { getCurrentFormatDate } from '/@/utils/dateUtils'
import { _addPacking, _clearPacking, _updatePacking } from '/@/utils/packing'
import { flexColumnWidth } from '/@/utils/tableColum'

let props = defineProps<{
  packingVisible: boolean
  site: number | undefined
  encasementNo: number
}>()
const dflag = ref<boolean>(false)
const upcOrFnSku = ref<string>('FNSKU')

// 上一个显示与否
const previousVisible = ref<boolean>(false)
// 图片预览
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewList.value = []
  imagePreviewVisible.value = true
  imagePreviewList.value.push(url)
}
const confirmFormRef = ref<FormInstance>()
// 确认的form
const confirmForm = reactive<{encaseCount: number | undefined}>({
  encaseCount: undefined
})
const confirmFormRules = reactive<FormRules<{encaseCount: number | undefined}>>({
  encaseCount: [{ required: true, message: '请输入箱数', trigger: 'blur' }]
})
// 扫描完的disabled
const barcodeDisabled = ref<boolean>(false)
watchEffect(() => {
  dflag.value = props.packingVisible
  if (props.site === 4) {
    upcOrFnSku.value = 'GTIN'
  }
  if (dflag.value) {
    // 首次打开先清空
    _clearPacking()
    // 第一次 上一个按钮隐藏，下一个按钮是一直存在
    previousVisible.value = false
    barcodeDisabled.value = false
  }
})
const emit = defineEmits(['update:packingVisible', 'update:finish'])
const handleCloseDialog = () => {
  dflag.value = false
  emit('update:packingVisible', dflag.value);
  // 表单也先清空
  packingFormRef.value?.resetFields()
  packingForm.skuImageUrl = ''
}
const packingForm = reactive<IEncasementProduct>({
  fnSkuOrUpc: '',
  sku: '',
  productName: '',
  count: undefined,
  skuImageUrl: ''
})
const packingFormRef = ref<FormInstance>()
const packingFormRules = computed(() => ({
  fnSkuOrUpc: [{ required: true, message: `请输入${upcOrFnSku.value}`, trigger: 'blur' }],
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
const list = ref<EncasementDetailList[]>([])
const filteredData = computed(() => {
  if (!queryForm.keyWord) return packingStore.packingData;  // 如果没有输入 SKU，返回所有数据
  return packingStore.packingData.filter(item => 
    item.sku.toLowerCase().includes(queryForm.keyWord.toLowerCase())  // 根据 SKU 字段过滤
  );
});
const queryData = () => {
  queryForm.pageNo = 1
  // 过滤数据：根据 SKU 字段过滤

  list.value = filteredData.value
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const fetchData = () => {
  list.value = packingStore.packingData.slice(
    (queryForm.pageNo - 1) * queryForm.pageSize,
    queryForm.pageNo * queryForm.pageSize
  );
  total.value = packingStore.packingData.length
}
// 展示确认/完成
const showConfirm = () => {
  // 先判断存入数据是否为空
  if (packingStore.packingData.length === 0) {
    $baseMessage(`请先填写${upcOrFnSku.value}`, 'error')
  } else {
    // 校验所有存储的是否是已填
    const countValid = packingStore.packingData.every((item: PackingType) => { return item.count != null && item.count !== 0; })
    if (!countValid) {
      $baseMessage(`数量不能为空`, 'error');
      return
    }
    const upcOrFnSkuValid = packingStore.packingData.every((item: PackingType) => { return item.fnSkuOrUpc })
   
    if (!upcOrFnSkuValid) {
      $baseMessage(`${upcOrFnSku.value}不能为空`, 'error');
      return
    }
    confirmForm.encaseCount = undefined // 每次打开数量置空
    confirmVisible.value = true
    fetchData()
  }
}

// 关闭确认
const closeConfirm = () => {
  confirmForm.encaseCount = undefined
  confirmVisible.value = false
  handleCloseDialog()
  emit('update:finish')
}
// 保存并打印
const saveAndPrint = async () => {
  confirmFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await submitEncasementSku({
        encaseCount: confirmForm.encaseCount,
        encasementNo: props.encasementNo,
        planSite: props.site,
        encasementDetailList: packingStore.packingData
      })
      if (data) {
        const req = `${getCurrentFormatDate()}-${props.encasementNo}-${confirmForm.encaseCount}`
        const { code } = await printBarcodeEncasement({ code: req })
        if (code === 0) {
          $baseMessage('保存并打印条形码成功', 'success')
          // const { data: res } = await printBarcodeEncasementSuccess(JSON.stringify(data))
          // if (res) {
          handleCloseDialog()
          emit('update:finish')
          // }
        }
      }
    }
  })
}
// 保存
const save = async () => {
  confirmFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await submitEncasementSku({
        encaseCount: confirmForm.encaseCount,
        encasementNo: props.encasementNo,
        planSite: props.site,
        encasementDetailList: packingStore.packingData
      })
      if (data) {
        $baseMessage('保存成功', 'success')
      } else {
        $baseMessage("保存失败", 'error')
      }
    }
  })
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
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 监听回车键扫描事件（包括用户回车和扫枪回车）
const handleKeyPress = async (event: any) => {

  if (event.code === 'Enter') {
    const barcodeValue = (event.target as HTMLInputElement).value
    packingForm.fnSkuOrUpc = barcodeValue;
    let str = barcodeValue
    if (props.site === 4 && barcodeValue.startsWith("00")) {
      str = barcodeValue.substring(2); // 或者 str = str.slice(2); 只有沃尔玛站点的去掉前面两个0
    }
   
    // 发送网络请求，根据结果判断，是否是清空重新输入还是聚焦到数量框
    const { data } = await getEncasementSku({
      site: props.site!,
      fnSkuOrUpc: str
    })
    if (data) {
      // Object.assign(packingForm, data)
      // 更新 packingForm
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(packingForm, key)) {
          packingForm[key] = (data as any)[key];
        }
      }
      // console.log('扫码后的form', packingForm);
      
      tempCurId.value = generateUUID()
      let flag = _addPacking(packingForm, tempCurId.value)
      if (flag) {
        // 如果是有相同的，就清空
        packingFormRef.value?.resetFields()
        packingForm.skuImageUrl = ''  
        return
      }
      // console.log('packingData', packingStore.packingData)
      barcodeDisabled.value = true
      if (packingCount.value) {
        packingCount.value.focus()
        packingCount.value.select()
      }
    } else {
      packingForm.fnSkuOrUpc = ''
      $baseMessage(`找不到该${upcOrFnSku}，请重新扫描`, 'error')
    }
  }
}

// 更新表单
const handleUpdate = () => {
  // console.log('更新count后的', packingForm);
  
  const updatePacking = { tempId: tempCurId.value, ...packingForm }
  // console.log('updatePacking', updatePacking);
  
  _updatePacking(updatePacking)
  // console.log('更新', packingStore.packingData);
}

// 切换上一个
const switchPrevious = () => {
  // 如果表单什么也没输入，可以切换到上一个
  if (!packingForm.fnSkuOrUpc && packingForm.count == null) {
    const data = packingStore.packingData
    const index = data.length - 1
    // console.log('上一个的数据是', data[index]);
    // console.log('index', index);

    if (index === 0) {
      previousVisible.value = false
    }
    Object.assign(packingForm, data[index])
    // id赋值
    tempCurId.value = data[index].tempId
    // 扫抢扫码不能输入
    barcodeDisabled.value = true
    return
  }
  // 首先判断是否都输入
  packingFormRef.value?.validate((isValid: boolean) => {
    if (isValid) {
      // console.log(packingForm);
      
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
      // 扫抢扫码不能输入
      barcodeDisabled.value = true
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
        packingForm.skuImageUrl = ''
        // console.log('最后一个下一个后的数据', packingStore.packingData)
        // 上一个按钮展示
        previousVisible.value = true
        // 聚焦到FNSKU
        barcodeInput.value?.focus()
        // 扫枪扫码可以输入
        barcodeDisabled.value = false
      } else { // 如果是中间的，就再跳到下一个
        Object.assign(packingForm, data[index + 1])
        // 当前id变换
        tempCurId.value = data[index + 1].tempId
        // console.log('中间的下一个后的数据', packingStore.packingData);
        // 上一个按钮展示
        previousVisible.value = true
        // 扫抢扫码不能输入
        barcodeDisabled.value = true
      }
    }
  })
}

</script>

<style lang="scss" scoped>
.custom-tooltip {
  max-width: 400px;
  font-size: var(--el-font-size-base);
  white-space: pre-wrap; 
}
</style>