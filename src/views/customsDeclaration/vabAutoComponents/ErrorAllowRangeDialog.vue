<template>
  <div>
    <vab-dialog
      v-model="visible"
      title="误差允许范围"
      top="4%"
      width="40%"
      class="custom-dialog"
    >
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-form>
            <el-form-item label="货代简称">
              <el-select v-model="selectId" @change="fetchFeeNameSetting">
                <el-option 
                  v-for="item in selectList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </vab-query-form-left-panel>
      </vab-query-form>
      <el-table
        border 
        :cell-style="feeNameSettingCellStyle"
        class="feeNameSettingTable"
        :data="feeNameSettingData"
        :header-cell-style="{ textAlign: 'center' }"
        stripe
        style="max-height: 70vh; overflow: auto;"
        @cell-click="changeInputFeeSetting"
      >
        <el-table-column label="我们的费用名" min-width="130" prop="costName">
          <template #default="{ row }">
            <div v-if="row.status === 1" class="none">
              <el-input v-model="row.costName" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)"/>
            </div>
            <span>{{ row.costName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算对象" min-width="130">
          <template #default="{ row }">
            <el-select v-model="row.settlementObject" @change="modifyFeeNameSetting(row)">
              <el-option 
                v-for="item in settlementObjectList"
                :label="item.label"
                :key="item.id"
                :value="item.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="误差允许范围" min-width="130">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.error" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)"/>  
            </div>
            <span>{{ row.error ? row.error + '%' : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="货代账单费用名" min-width="130" prop="billCostName">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.billCostName" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)"/>
            </div>
            <span>{{ row.billCostName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { CSSProperties } from 'vue'
import { getForwarderCostList, getFreightForwarderSelect, getSettlementObjectList, updateCostFreightForwarder } from '/@/api/devlocal/encasement'
import { IGetForwarderCostList } from '/@/type/packagingShipping/shippedType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

defineOptions({
  name: 'ErrorAllowRangeDialog'
})

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
watch(() => visible.value, async (val) => {
  if (val) {
    await fetchSelectList()
    selectId.value = selectList.value[0].id
    await fetchSettlementObjectData()
    await fetchFeeNameSetting()
  }
})
const selectId = ref<number>(0)
const feeNameSettingData = ref<IGetForwarderCostList[]>([])
const settlementObjectList = ref<{ id: number, label: string }[]>([])
// 货代下拉列表
const selectList = ref<{ id: number, label: string }[]>([])
// 获取货代简称列表
const fetchSelectList = async () => {
  const { data } = await getFreightForwarderSelect()
  selectList.value = data
}
const fetchSettlementObjectData = async () => {
  const { data } = await getSettlementObjectList()
  settlementObjectList.value = data
}
const fetchFeeNameSetting = async () => {
  const { data: res } = await getForwarderCostList({
    id: selectId.value
  })
  feeNameSettingData.value = res
}
let copyRow: any
const changeInputFeeSetting = async (row: any, column: any, cell: HTMLTableCellElement) => { 
  
  const firstChild = cell?.children[0]?.children[0];
  const secondChild = cell?.children[0]?.children[1];

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return;
  }
  copyRow = { ...row } //浅拷贝
  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none');
    secondChild.classList.add('none');

    focusAndSelectInput(cell);
  }
}
const clickCancel = async (event: any, row: any) => {
  const t1 = getRootElement(event["srcElement"],".cell").children[0]
  if (t1){
    t1.classList.add("none")
  }
  const t2 = getRootElement(event["srcElement"],".cell").children[1]
  if (t2){
    t2.classList.remove("none")
  }
  if (JSON.stringify(row) === JSON.stringify(copyRow)) return 

  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑, 发送更新请求
    await updateCostFreightForwarder({
      id: row.id,
      costName: row.costName,
      billCostName: row.billCostName,
      error: row.error
    })
  }
}
const modifyFeeNameSetting = async (row: IGetForwarderCostList) => {
  try {
    await updateCostFreightForwarder({
      id: row.id,
      costName: row.costName,
      billCostName: row.billCostName,
      settlementObject: row.settlementObject
    })
  } catch (error) {
    console.error(error)
  }
}
/**
 * @description 货代费用名设定的表格样式
 * @param data
 * @return CSSProperties 返回特定样式
 */
const feeNameSettingCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 0 && data.row.status === 0) {
    return {
      color: '#999',
      cursor: 'not-allowed',
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'center',
    cursor: 'pointer'
  }
}
</script>

<style lang="scss" scoped>
.none {
  display: none;
}
:deep(.custom-dialog .el-dialog__body) {
  padding-top: 10px;
}
</style>