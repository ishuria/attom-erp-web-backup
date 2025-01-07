<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="美工类型" :name="0" >
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="showParamSetting">参数设定</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline @submit.prevent>
              <el-form-item>
                <el-input v-model="keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter="fetchData" @input="fetchData" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" :loading="listLoading" @click="fetchData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table 
          border stripe
          class="noneHoverTable" :header-cell-style="{ textAlign: 'center' }" :cell-style="cellStyle"
          :data="list"
          @cell-click="changeInput"
        >
          <el-table-column label="姓名" prop="userName" min-width=""></el-table-column>
          <el-table-column label="角色" prop="roleName" min-width=""></el-table-column>
          <el-table-column label="图片提成天数" prop="pictureDay" min-width="">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.pictureDay" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.pictureDay }}</span>
            </template>
          </el-table-column>
          <el-table-column label="图片提成单人比例" prop="singlePersonProportion" min-width="">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.singlePersonProportion" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.singlePersonProportion ? row.singlePersonProportion + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="长期提成天数" prop="longDay" min-width="">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.longDay" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.longDay }}</span>
            </template>
          </el-table-column>
          <el-table-column label="长期提成单人比例" prop="longSinglePersonProportion" min-width="">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.longSinglePersonProportion" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.longSinglePersonProportion ? row.longSinglePersonProportion + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="合作权重" prop="cooperationWeight" min-width="">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.cooperationWeight" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.cooperationWeight }}</span>
            </template>
          </el-table-column>
          <el-table-column label="合作加成倍数" prop="addition" min-width="">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.addition" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.addition }}</span>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"></el-empty>
          </template>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="产品类型" :name="1" >
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
            <el-form inline @submit.prevent>
              <el-form-item>
                <el-input v-model="keyWord2" placeholder="请输入搜索关键词" clearable @keyup.enter="fetchData2" @input="fetchData2" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" :loading="listLoading" @click="fetchData2"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table 
          border stripe
          class="noneHoverTable" :header-cell-style="{ textAlign: 'center' }" :cell-style="cellStyle"
          :data="list2"
          @cell-click="changeInput"
        >
          <el-table-column label="姓名" prop="userName"></el-table-column>
          <el-table-column label="角色" prop="roleName"></el-table-column>
          <el-table-column label="产品开发类型">
            <el-table-column label="净利提成模式">
              <el-table-column label="产品经理净利提成比例" prop="productManagerProportion">
                <template #default="{ row }">
                  <div class="none">
                    <el-input v-model="row.productManagerProportion" @keyup.enter="clickCancel2($event, row)" @blur="clickCancel2($event, row)" />
                  </div>
                  <span>{{ row.productManagerProportion ? row.productManagerProportion + '%' : '' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="产品设计净利提成比例" prop="productDesignProportion">
                <template #default="{ row }">
                  <div class="none">
                    <el-input v-model="row.productDesignProportion" @keyup.enter="clickCancel2($event, row)" @blur="clickCancel2($event, row)" />
                  </div>
                  <span>{{ row.productDesignProportion ? row.productDesignProportion + '%' : '' }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="通用调整">
              <el-table-column label="达标递增" prop="delivery">
                <template #default="{ row }">
                  <div class="none">
                    <el-input v-model="row.delivery" @keyup.enter="clickCancel2($event, row)" @blur="clickCancel2($event, row)" />
                  </div>
                  <span>{{ row.delivery ? row.delivery + '%' : '' }}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column label="产品采购类型(供应链)">
            <el-table-column label="云舟计件" prop="yunzhouCount">
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.yunzhouCount" @keyup.enter="clickCancel2($event, row)" @blur="clickCancel2($event, row)" />
                </div>
                <span>{{ row.yunzhouCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="埃托姆计件" prop="aiTuoMCount">
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.aiTuoMCount" @keyup.enter="clickCancel2($event, row)" @blur="clickCancel2($event, row)" />
                </div>
                <span>{{ row.aiTuoMCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Attom计件" prop="attomCount">
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.attomCount" @keyup.enter="clickCancel2($event, row)" @blur="clickCancel2($event, row)" />
                </div>
                <span>{{ row.attomCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="降本提成比例" prop="proportion">
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.proportion" @keyup.enter="clickCancel2($event, row)" @blur="clickCancel2($event, row)" />
                </div>
                <span>{{ row.proportion ? row.proportion + '%' : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="降本提成天数" prop="day">
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.day" @keyup.enter="clickCancel2($event, row)" @blur="clickCancel2($event, row)" />
                </div>
                <span>{{ row.day }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"></el-empty>
          </template>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <vab-dialog
      title="参数设定"
      v-model="paramSetting"
      width="20%"
    >
      <el-form ref="formRef" :rules="formRules" :model="form" label-position="right" label-width="auto" style="margin: 0 0 20px 0;">
        <el-form-item label="初始acos转化率" prop="acos">
          <el-input type="number" v-model="form.acos" />
        </el-form-item>
        <el-form-item label="转化率加成上限" prop="upperLimit">
          <el-input type="number" v-model="form.upperLimit" />
        </el-form-item>
        <el-form-item label="最低转化率" prop="minConversionRate">
          <el-input type="number" v-model="form.minConversionRate" />
        </el-form-item>
        <el-form-item label="断货补偿天数上限" prop="compensationDay">
          <el-input type="number" v-model="form.compensationDay" />
        </el-form-item>
        <el-form-item label="说明书/包装提成比例">
          <el-input v-model="form.instructionManualRate" disabled />
        </el-form-item>
      </el-form>
      <el-table 
        class="noneHoverTable"
        border stripe 
        :data="list3"
        @cell-click="changeInput"
      >
        <el-table-column label="客单价" prop="unitPrice"></el-table-column>
        <el-table-column label="初始目标转化率" prop="targetRate">
          <template #default="{ row }">
            <div class="none">
              <el-input type="number" v-model="row.targetRate" @keyup.enter="clickCancel3($event, row)" @blur="clickCancel3($event, row)" />
            </div>
            <span>{{ row.targetRate ? row.targetRate + '%' : '' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="paramSetting = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmParamSetting">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import { isEqual } from 'lodash'
import { CSSProperties } from 'vue'
import { getCommissionArtTypeList, getCommissionProductTypeList, getCommissionSetting, updateCommissionArtType, updateCommissionProductType, updateCommissionSetting1, updateCommissionSetting2 } from '/@/api/devlocal/commission'
import { IGetCommissionArtTypeList, IGetCommissionProductTypeList, IGetCommissionSettingTableList, IUpdateCommissionSetting1Req } from '/@/type/commission/commissionType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

defineOptions({
  name: 'CommissionCoefficientSetting'
})
const paramSetting = ref<boolean>(false)
const activeName = ref<number>(0)
const keyWord = ref<string>('')
const keyWord2 = ref<string>('')
const listLoading = ref<boolean>(false)
const list = ref<IGetCommissionArtTypeList[]>([])
const list2 = ref<IGetCommissionProductTypeList[]>([])
const list3 = ref<IGetCommissionSettingTableList[]>([])
let copyRow: any
const form = reactive<any>({

})
const formRef = ref<FormInstance>()
const formRules = reactive<FormRules<IUpdateCommissionSetting1Req>>({
  acos: [{ required: true, message: '请输入初始acos转化率', trigger: 'blur' }],
  upperLimit: [{ required: true, message: '请输入转化率加成上限', trigger: 'blur' }],
  minConversionRate: [{ required: true, message: '请输入最低转化率', trigger: 'blur' }],
  compensationDay: [{ required: true, message: '请输入断货补偿天数上限', trigger: 'blur' }],
})
const handleConfirmParamSetting = async () => {
  formRef.value?.validate(async (isValid) => {
    if (isValid) {
      const { data } = await updateCommissionSetting1({
        acos: form.acos,
        upperLimit: form.upperLimit,
        minConversionRate: form.minConversionRate,
        compensationDay: form.compensationDay
      })
      if (data) {
        $baseMessage('提交成功！', 'success')
        paramSetting.value = false
      }
    }
  })
  
}
const showParamSetting = async () => {
  paramSetting.value = true
  const { data } = await getCommissionSetting()
  Object.assign(form, data)
  list3.value = data.list
  list3.value.forEach((item) => {
    item.targetRate = parseFloat((item.targetRate * 100).toFixed(2))
  })
  form.instructionManualRate = data.instructionManualRate * 100 + '%'
}
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {

  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  copyRow = JSON.parse(JSON.stringify(row))

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }

}

// table blur事件
const clickCancel = async (event:any, value:any) => {
  const rootElement = getRootElement(event.srcElement, ".cell")

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add("none")
    if (t2) t2.classList.remove("none")
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    await updateCommissionArtType({
      id: value.id,
      pictureDay: value.pictureDay,
      singlePersonProportion: Number(value.singlePersonProportion) / 100,
      longDay: value.longDay,
      longSinglePersonProportion: Number(value.longSinglePersonProportion) / 100,
      cooperationWeight: value.cooperationWeight,
      addition: value.addition
    })
  }
}
// table blur事件
const clickCancel2 = async (event:any, value:any) => {
  const rootElement = getRootElement(event.srcElement, ".cell")

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add("none")
    if (t2) t2.classList.remove("none")
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    await updateCommissionProductType({
      id: value.id,
      productManagerProportion: Number(value.productManagerProportion) / 100,
      productDesignProportion: Number(value.productDesignProportion) / 100,
      delivery: Number(value.delivery) / 100,
      yunzhouCount: value.yunzhouCount,
      aiTuoMCount: value.aiTuoMCount,
      attomCount: value.attomCount,
      proportion: Number(value.proportion) / 100,
      day: value.day
    })
  }
}
const clickCancel3 = async (event:any, value:any) => {
  const rootElement = getRootElement(event.srcElement, ".cell")

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add("none")
    if (t2) t2.classList.remove("none")
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    await updateCommissionSetting2({
      id: value.id,
      targetRate: Number(value.targetRate) / 100
    })
  }
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getCommissionArtTypeList({
    keyWord: keyWord.value
  })
  list.value = data
  list.value.forEach((item) => {
    if (item.singlePersonProportion) {
      item.singlePersonProportion = parseFloat((item.singlePersonProportion * 100).toFixed(2))
    }
    if (item.longSinglePersonProportion) {
      item.longSinglePersonProportion = parseFloat((item.longSinglePersonProportion * 100).toFixed(2))
    }
  })
  listLoading.value = false
}
const fetchData2 = async () => {
  listLoading.value = true
  const { data } = await getCommissionProductTypeList({
    keyWord: keyWord2.value
  })
  list2.value = data
  list2.value.forEach((item) => {
    if (item.productManagerProportion) {
      item.productManagerProportion = parseFloat((item.productManagerProportion * 100).toFixed(2))
    }
    if (item.productDesignProportion) {
      item.productDesignProportion = parseFloat((item.productDesignProportion * 100).toFixed(2))
    }
    if (item.delivery) {
      item.delivery = parseFloat((item.delivery * 100).toFixed(2))
    }
    if (item.proportion) {
      item.proportion = parseFloat((item.proportion * 100).toFixed(2))
    }
  })
  listLoading.value = false
}
const handleTabClick = (tab: TabsPaneContext) => {
  if (tab.props.name === 1) {
    fetchData2()
  } else if (tab.props.name === 0) {
    fetchData()
  }
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const index = data.columnIndex
  if (index === 0 || index === 1) {
    return {
      textAlign: 'center',
      fontWeight: 'bold'
    }
  }
  return {
    textAlign: 'center'
  }
}
onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.tabs-table-container {
  :deep() {
    .el-tabs {
      border-radius: var(--el-border-radius-base);

      &__header {
        border-top-left-radius: var(--el-border-radius-base);
        border-top-right-radius: var(--el-border-radius-base);
      }

      &__nav-wrap {
        border-radius: var(--el-border-radius-base);
      }

      .el-tab-pane {
        display: flex;
        flex-direction: column;
        height: calc(var(--el-container-height) - var(--el-padding) - 52px) !important;

        .vab-query-form {
          .el-form {
            .el-form-item:first-child {
              // margin: 0 !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
          }
        }

        .noneHoverTable {
          flex: 1;

          
        }
      }
    }
  }
}
.noneHoverTable {
  .none {
    display: none;
  }
  :deep() {
    .el-table__body .cell {
      min-height: 34px;
      line-height: 34px;
    }
  }
}

</style>
