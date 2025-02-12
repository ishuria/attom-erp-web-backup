<template>
  <!-- 样品追踪dialog -->
  <vab-dialog 
    v-model="sampleVisible" 
    :before-close = "props.closeDialogHandler"
    style="padding-bottom: 20px;"
    title="样品追踪"
    width="70%"
  >
    <el-table 
      border 
      :cell-class-name="clearPadding"
      :cell-style="cellStyle" 
      class="noneHoverTable"
      :data="sampleTableList"
      :header-cell-style="{ textAlign: 'center' }"
      height="600"
      stripe 
      style="width: 100%"
      @cell-click="cellClick"
    >
      <el-table-column 
        v-for="(item, index) in sampleTrackTableColumns" 
        :key="index"
        :label="item.label"
        :min-width="handleWidth(item)" 
        :prop="item.prop"
        :width="item.width"
      >
        <template #default="{row}">
          <div v-if="item.prop === 'componentImg'">
            <el-image fit="fill" :src="row.componentImg" style="display: block; width: 70px; height: 70px" @click="showPreviewImage(row.componentImg)">
              <template #error><el-icon /></template>
            </el-image>
          </div>

          <div v-if="item.prop === 'createTime'">
              <span>{{ formatDate(new Date(row.createTime)) }}</span>
          </div>

          <div v-if="item.prop === 'receiptDate'">
              <span v-if="row.receiptDate">{{ formatDate(new Date(row.receiptDate)) }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="140">
        <template #default="{ row }">
          <el-dropdown >
            <el-button text type="primary" @click="manualReceipt(row)">
              手动签收
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="manualReceipt(row)">
                  <el-link type="primary" :underline="false" >手动签收</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="orderNo1688Update(row)">
                  <el-link type="primary" :underline="false" >1688订单号修改</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="logisticsNoUpdate(row)">
                  <el-link type="primary" :underline="false" >物流订单修改</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </vab-dialog>

  <!-- 物流单号修改或1688订单号修改 -->
  <vab-dialog 
    :before-close="orderDialogClose"
    :model-value="orderVisible"
    :title="dialogFlag === true ?'物流单号修改':'1688订单号修改'"
    width="400"
  >
    <el-form 
      ref="formRef"
      label-width="auto"
      :model="orderForm" 
      style="max-width: 400px"
    >
      <el-form-item v-if="!dialogFlag" label="1688订单号" prop="orderNo1688">
        <el-input v-model="orderForm.orderNo"/>
      </el-form-item>
      <el-form-item v-if="dialogFlag" label="物流单号" prop="logisticsNo">
        <el-input v-model="orderForm.logisticsNo"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="orderDialogClose">取消</el-button>
      <el-button type="primary" @click="submitForm">确认</el-button>
    </template>
  </vab-dialog>
  <!-- 备注 -->
  <vab-dialog v-model="remarkVisible" title="修改备注" width="25%">
    <el-input v-model="remark" :rows="20" type="textarea" />
    <template #footer>
      <el-button @click="remarkVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmUpdateRemark">确认</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>

import { ArrowDown } from '@element-plus/icons-vue'
import type { FormInstance, } from 'element-plus'
import { sampleTrackTableColumns } from '../productProgressComponent'
import { getSampleList, updateSampleOrder, updateSampleReceipt } from '/@/api/devlocal/progressSample'
import type { ISampleOrderReq, ISampleTrack } from '/@/type/progress/sampleAndComponentType'
import { formatDate } from '/@/utils/dateUtils'
import { convertString } from '/@/utils/stringUtils'
import { flexColumnWidth } from '/@/utils/tableColum'
import type { CSSProperties } from 'vue'

defineComponent({
  name:"VabSampleTranck"
})

// 备注可见
const remarkVisible = ref<boolean>(false)
const remark = ref<string>('')
const sampleTableList = ref<ISampleTrack[]>([])
const sampleVisible = ref<boolean>(false)
const orderVisible = ref<boolean>(false)
// eslint-disable-next-line vue/no-dupe-keys
const progressId = ref<string>()
const dialogFlag = ref<boolean>(false)
const formRef = ref<FormInstance>()

const props = defineProps<{
  visible:boolean
  progressId:string
  closeDialogHandler: (done: any) => void
}>();

const emit = defineEmits<{
  (e: 'update:previewListValue', value: string): void
 }>()

 // 订单号
const orderForm = reactive({
  sampleId:'',
  orderNo:'',
  logisticsNo:'',
})

const cellClick = (row: any, column: any, cell: HTMLTableCellElement) => {
  if (column.property === 'remark') {
    remark.value = row.remark
    remarkVisible.value = true
  }
}
// 确认修改备注
const confirmUpdateRemark = () => {
  //
}
const handleWidth = (item: any) => {
  switch (item.label) {
    case '零件名称': {
      return flexColumnWidth(sampleTableList.value, '零件名称', 'componentName')
    }
    case '供应商': {
      return flexColumnWidth(sampleTableList.value, '供应商', 'supplier')
    }
    case '1688订单号': {
      return flexColumnWidth(sampleTableList.value, '1688订单号', 'orderNo1688')
    }
    case '最新物流信息': {
      return flexColumnWidth(sampleTableList.value, '最新物流信息', 'logisticsMessage')
    }
  }
  return item.minWidth || 100
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const index = data.columnIndex
  if (index === 0 || index === 2 || index === 3 || index === 8 || index === 9 || index === 11) {
    return {
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'left'
  }
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}
const showPreviewImage = (url: string) => {
  emit("update:previewListValue", url)
}
const fetchData = async()=>{
  const { data } = await getSampleList({progressId:props.progressId})
  sampleTableList.value = data
}

watchEffect(()=>{
  sampleVisible.value = props.visible
  progressId.value = props.progressId
  if (sampleVisible.value === true) fetchData()
})


// 手动签收
const manualReceipt = async (row:ISampleTrack) =>{
  $baseConfirm('确定要手动签收此条样品记录吗',"系统提示", async ()=>{
    const {data} = await updateSampleReceipt({sampleId:row.sampleId})
    
    row.receiptDate = data.receiptDate
    if (data != null || data != undefined){
      $baseMessage(`样品${row.componentName}手动签收成功！`,"success","hey")
    }
  })
}

// 1688单号修改
const orderNo1688Update = (row:ISampleTrack) =>{
  orderForm.sampleId = ''
  orderVisible.value = true
  dialogFlag.value = false
  orderForm.sampleId = convertString(row.sampleId)
}

// 物流单号修改
const logisticsNoUpdate = (row:ISampleTrack) =>{
  orderForm.sampleId = ''
  orderVisible.value = true
  dialogFlag.value = true
  orderForm.sampleId = convertString(row.sampleId)
}

const orderDialogClose = () =>{
  orderVisible.value = false
  orderForm.sampleId = ''
  orderForm.logisticsNo = ''
  orderForm.orderNo = ''
}

// 修改提交
const submitForm = async () => {
  let orderParam:ISampleOrderReq = {
    sampleId: orderForm.sampleId
  }

  if (dialogFlag.value === false) {
    if (orderForm.orderNo === ''){
      $baseMessage("1688订单号不能为空！","error","hey")
      return
    }
    orderParam.order1688No = orderForm.orderNo
  } else {
    if (orderForm.logisticsNo === ''){
      $baseMessage("物流单号不能为空！","error","hey")
      return
    }
    orderParam.logisticsNo = orderForm.logisticsNo
  }

  $baseConfirm(`确定要修改${dialogFlag.value === true ?'物流单号':'1688订单号'}`,"系统提示", async ()=>{
    const {data} = await updateSampleOrder({...orderParam})
    if(data === true){
      if (orderForm.orderNo !== ''){
        $baseMessage("1688订单号修改成功！","success","hey")
        const index = sampleTableList.value.findIndex((item:ISampleTrack) => item.sampleId === parseInt(orderForm.sampleId));
        if (index !== -1) {
          sampleTableList.value[index].orderNo1688 = orderForm.orderNo;
        }
        orderDialogClose()
        return
      }

      if (orderForm.logisticsNo !== ''){
        $baseMessage("物流单号修改成功！","success","hey")
        const index = sampleTableList.value.findIndex((item:ISampleTrack) => item.sampleId === parseInt(orderForm.sampleId));
        if (index !== -1) {
          sampleTableList.value[index].logisticsNo = orderForm.logisticsNo;
        }
        orderDialogClose()
        return
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.noneHoverTable {
  :deep() {
    .clear-padding {
      padding-top: 0;
      padding-bottom: 0;
      .cell {
        padding-right: 0;
        padding-left: 0;
      }
    }
  }
}
</style>