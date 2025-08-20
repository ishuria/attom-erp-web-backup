<template>
  <div class="comprehensive-table-container auto-height-container">
    <h2 style="text-align: center">新供应商信息完善</h2>
    <el-table
      ref="tableRef"
      border
      :cell-style="cellStyle"
      :data="list"
      :header-cell-style="{ 'text-align': 'center' }"
      stripe
      @cell-click="changeInput"
    >
      <el-table-column label="供应商全名" prop="suppliser" :width="flexColumnWidth(list, '供应商全名', 'suppliser')" />
      <el-table-column label="税号" min-width="120" prop="taxNumber">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.taxNumber" @blur="supplierClickCancel($event, row)" @keydown.enter="supplierClickCancel($event, row)" />
          </div>
          <span>{{ row.taxNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" min-width="160" prop="address">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.address" @blur="supplierClickCancel($event, row)" @keydown.enter="supplierClickCancel($event, row)" />
          </div>
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票电话" min-width="100" prop="telephone">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.telephone" @blur="supplierClickCancel($event, row)" @keydown.enter="supplierClickCancel($event, row)" />
          </div>
          <span>{{ row.telephone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户银行" min-width="120" prop="bank">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.bank" @blur="supplierClickCancel($event, row)" @keydown.enter="supplierClickCancel($event, row)" />
          </div>
          <span>{{ row.bank }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户账号" min-width="120" prop="accountNumber">
        <template #default="{ row }">
          <div class="none">
            <el-input
              v-model="row.accountNumber"
              @blur="supplierClickCancel($event, row)"
              @keydown.enter="supplierClickCancel($event, row)"
            />
          </div>
          <span>{{ row.accountNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联行号" min-width="100" prop="bankRoutingNumber">
        <template #default="{ row }">
          <div class="none">
            <el-input
              v-model="row.bankRoutingNumber"
              @blur="supplierClickCancel($event, row)"
              @keydown.enter="supplierClickCancel($event, row)"
            />
          </div>
          <span>{{ row.bankRoutingNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" min-width="100" prop="contactPerson">
        <template #default="{ row }">
          <div class="none">
            <el-input
              v-model="row.contactPerson"
              @blur="supplierClickCancel($event, row)"
              @keydown.enter="supplierClickCancel($event, row)"
            />
          </div>
          <span>{{ row.contactPerson }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人电话" min-width="100" prop="contactNumber">
        <template #default="{ row }">
          <div class="none">
            <el-input
              v-model="row.contactNumber"
              @blur="supplierClickCancel($event, row)"
              @keydown.enter="supplierClickCancel($event, row)"
            />
          </div>
          <span>{{ row.contactNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人微信" min-width="100" prop="weChatNumber">
        <template #default="{ row }">
          <div class="none">
            <el-input
              v-model="row.weChatNumber"
              @blur="supplierClickCancel($event, row)"
              @keydown.enter="supplierClickCancel($event, row)"
            />
          </div>
          <span>{{ row.weChatNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商微信号" min-width="120" prop="supplierWeChatNumber">
        <template #default="{ row }">
          <div class="none">
            <el-input
              v-model="row.supplierWeChatNumber"
              @blur="supplierClickCancel($event, row)"
              @keydown.enter="supplierClickCancel($event, row)"
            />
          </div>
          <span>{{ row.supplierWeChatNumber }}</span>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
      </template>
    </el-table>

    <h2 style="text-align: center">质检项目清单（打包注意事项和质检报告）</h2>
    <div style="font-size: 22px; color: red; text-align: center">注意：一个质检项目填一行，一行不能填写多项质检内容</div>
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleAddQualityInspection">新增</el-button>
        <el-button type="primary">读取</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-table
      ref="tableRef"
      border
      :data="qualityInspectionList"
      :header-cell-style="{ 'text-align': 'center' }"
      stripe
      @cell-click="changeInput"
    >
      <el-table-column align="center" label="变体" prop="variant" width="140">
        <template #default="{ row }">
          <el-select v-model="row.variant" placeholder="请选择变体" style="min-width: 100%" @change="handleVariantUpdate(row)">
            <el-option v-for="item in variantsSelectStringList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="检查类型" min-width="30">
        <template #default="{ row }">
          <el-select v-model="row.checkType" placeholder="请选择检查类型" style="min-width: 100%" @change="handleCheckTypeUpdate(row)">
            <el-option v-for="item in checkTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="打包注意事项" min-width="200" prop="packingPrecautions">
        <template #default="{ row }">
          <div class="none">
            <el-input
              v-model="row.packingPrecautions"
              type="text"
              @blur="clickQualityInspectionCancel($event, row)"
              @keyup.enter="clickQualityInspectionCancel($event, row)"
            />
          </div>
          <span>{{ row.packingPrecautions }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="120">
        <template #default="{ row }">
          <el-link type="danger" underline="never" @click="handleDelQualityInspection(row)">删除</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
      </template>
    </el-table>
    <div class="pay-button-group">
      <el-button @click="handleGoback">上一步</el-button>
      <el-button native-type="submit" type="primary" @click="handleSave">保存</el-button>
      <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">保存并继续</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { checkTypeList } from '../indexCommon'
import {
  reviewStepNo3GetSelectVariantList,
  reviewStepNo4AddQualityInspection,
  reviewStepNo4DelQualityInspection,
  reviewStepNo4ListQualityInspection,
  reviewStepNo4SaveFr,
  reviewStepNo4SupplierList,
  reviewStepNo4UpdateQualityInspection,
  reviewStepNo4UpdateSupplier,
} from '/@/api/devlocal/orderProcess'
import type { IGetSelectVariantsList, IreviewStepNo4ListQualityInspection } from '/@/type/orderProcess/orderProcessType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

import { _setStepNo } from '/@/utils/stepNoState'
import { convertString } from '/@/utils/stringUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'OrderStep4',
})

const route: any = useRoute()
const props = defineProps<{ step1Data: number }>()
const emit = defineEmits(['change-step'])

// const listLoading = ref<boolean>(true)
const list = ref<any>([])
// 查询下拉变体列表
const variantsSelectList = ref<IGetSelectVariantsList[]>([])
interface IGetSelectVariantsStringList {
  label: string
  value: string
}
// 转化后的下拉列表
const variantsSelectStringList = ref<IGetSelectVariantsStringList[]>([])
// 质检清单列表
const qualityInspectionList = ref<IreviewStepNo4ListQualityInspection[]>([])
const handleCheckTypeUpdate = async (row: IreviewStepNo4ListQualityInspection) => {
  await reviewStepNo4UpdateQualityInspection({
    checkType: row.checkType!, //0全检 1抽检5% 2抽检10% 3抽检15% 4抽检20% 5注意事项
    packingPrecautions: row.packingPrecautions!,
    qualityInspectionId: row.qualityInspectionId!,
    variant: row.variant!,
    variantId: row.variantId!,
  })
  fetchQualityInspectionData()
}
const handleVariantUpdate = async (row: IreviewStepNo4ListQualityInspection) => {
  row.variantId = parseInt(row.variant!)
  const selectedVariant = variantsSelectStringList.value.find((item: any) => item.value === row.variant)
  row.variant = selectedVariant?.label
  await reviewStepNo4UpdateQualityInspection({
    checkType: row.checkType!, //0全检 1抽检5% 2抽检10% 3抽检15% 4抽检20% 5注意事项
    packingPrecautions: row.packingPrecautions!,
    qualityInspectionId: row.qualityInspectionId!,
    variant: row.variant!,
    variantId: row.variantId,
  })
  fetchQualityInspectionData()
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const index = data.columnIndex
  if (index === 0) {
    return {
      color: '#999',
      cursor: 'not-allowed',
      textAlign: 'left',
    }
  } else if (index === 3 || index === 7 || index === 8) {
    return {
      textAlign: 'center',
    }
  } else {
    return {
      textAlign: 'left',
    }
  }
}
/**
 * 当点击时切换输入框，修改输入
 */
let copyRow: any
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
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
// 质检table blur事件
const clickQualityInspectionCancel = async (event: any, value: any) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(copyRow, value)) {
    return
  }

  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    try {
      await reviewStepNo4UpdateQualityInspection(value)
      await fetchQualityInspectionData()
    } catch {
      Object.assign(value, copyRow)
    }
  }
}
// 新供应商table blur事件
const supplierClickCancel = async (event: any, value: any) => {
  const t1 = getRootElement(event['srcElement'], '.cell').children[0]
  if (t1) {
    t1.classList.add('none')
  }

  const t2 = getRootElement(event['srcElement'], '.cell').children[1]
  if (t2) {
    t2.classList.remove('none')
  }
  if (JSON.stringify(value) === JSON.stringify(copyRow)) {
    return
  }
  if (event.type === 'blur') {
    try {
      await reviewStepNo4UpdateSupplier(value)
      await fetchNewSupplier()
    } catch {
      Object.assign(value, copyRow)
    }
  }
}
// 新增
const handleAddQualityInspection = async () => {
  const newQualityInspection: IreviewStepNo4ListQualityInspection = {
    checkType: 0, //0全检 1抽检5% 2抽检10% 3抽检15% 4抽检20% 5注意事项
    packingPrecautions: '',
    qualityInspectionId: undefined,
    variant: '所有',
    variantId: 0,
  }
  const { data } = await reviewStepNo4AddQualityInspection({ reviewId: classReviewId! })
  newQualityInspection.qualityInspectionId = data
  qualityInspectionList.value.push(newQualityInspection)
  // console.log(qualityInspectionList.value);
}
// 删除
const handleDelQualityInspection = async (row: IreviewStepNo4ListQualityInspection) => {
  try {
    if (route.query.reviewStatus === '0' || route.query.reviewStatus === '2') {
      // 编辑下
      try {
        $baseConfirm('确定要删除本条质检信息吗', '系统提示', async () => {
          try {
            const { msg } = await reviewStepNo4DelQualityInspection({ qualityInspectionId: row.qualityInspectionId! })
            if (msg === '调用成功！') {
              const index = qualityInspectionList.value.findIndex(
                (item: IreviewStepNo4ListQualityInspection) => item.qualityInspectionId === row.qualityInspectionId
              )
              if (index !== -1) {
                qualityInspectionList.value.splice(index, 1)
              }
              $baseMessage('质检信息删除成功！', 'success', 'hey')
            } else {
              $baseMessage('质检信息删除失败，请重试。', 'error', 'hey')
            }
          } catch (delError) {
            console.error(delError)
            $baseMessage('变体删除操作失败，请重试。', 'error', 'hey')
          }
        })
      } catch (confirmError) {
        console.error(confirmError)
        $baseMessage('确认操作失败，请重试。', 'error', 'hey')
      }
    } else {
      //订大货进去 和 编辑下的新增
      const index = qualityInspectionList.value.findIndex(
        (item: IreviewStepNo4ListQualityInspection) => item.qualityInspectionId === row.qualityInspectionId
      )
      if (index !== -1) {
        qualityInspectionList.value.splice(index, 1)
      }
      $baseMessage('质检信息删除成功！', 'success', 'hey')
    }
  } catch (error) {
    console.log(error as Error)
  }
}

// 当点击保存的时候
const handleSave = async () => {
  try {
    const { data } = await reviewStepNo4SaveFr({ reviewId: classReviewId! })
    if (data === true) {
      $baseMessage('当前信息已保存。', 'success', 'hey')
      _setStepNo(Number(classReviewId), 3)
      // await delVisitedRoute(handleActivePath(route, true))
    }
  } catch (error) {
    console.error(error)
  }
}
// 校验
const checkSupplier = () => {
  for (const item of list.value) {
    if (item.invoicing !== 0) continue
    if (!item.taxNumber) {
      $baseMessage(`${item.suppliser}的税号不能为空`, 'error', 'hey')
      return false
    }
    if (!item.address) {
      $baseMessage(`${item.suppliser}的地址不能为空`, 'error', 'hey')
      return false
    }
    if (!item.telephone) {
      $baseMessage(`${item.suppliser}的开票电话不能为空`, 'error', 'hey')
      return false
    }
    if (!item.bank) {
      $baseMessage(`${item.suppliser}的开户银行不能为空`, 'error', 'hey')
      return false
    }
    if (!item.accountNumber) {
      $baseMessage(`${item.suppliser}的开户账号不能为空`, 'error', 'hey')
      return false
    }
    if (!item.bankRoutingNumber) {
      $baseMessage(`${item.suppliser}的联行号不能为空`, 'error', 'hey')
      return false
    }
    if (!item.contactPerson) {
      $baseMessage(`${item.suppliser}的联系人不能为空`, 'error', 'hey')
      return false
    }
    if (!item.contactNumber) {
      $baseMessage(`${item.suppliser}的联系人电话不能为空`, 'error', 'hey')
      return false
    }
    if (!item.weChatNumber) {
      $baseMessage(`${item.suppliser}的联系人微信不能为空`, 'error', 'hey')
      return false
    }
    if (!item.supplierWeChatNumber) {
      $baseMessage(`${item.suppliser}的供应商微信号不能为空`, 'error', 'hey')
      return false
    }
  }
  return true
}

// 当点击保存并继续的时候
const handleSaveAndContinue = async () => {
  try {
    if (!checkSupplier()) {
      return
    }
    const { data } = await reviewStepNo4SaveFr({ reviewId: classReviewId! })
    if (data === true) {
      $baseMessage('当前信息已保存。', 'success', 'hey')

      emit('change-step', 4)
      _setStepNo(Number(classReviewId), 3)
      // if (route.query.reviewId) { //编辑进来的，要更改stepNo
      //   await delVisitedRoute(handleActivePath(route, true))
      // }
    }
  } catch (error) {
    console.error(error)
  }
}
// 当点击上一步的时候
const handleGoback = () => {
  emit('change-step', 2)
}
const fetchQualityInspectionData = async () => {
  try {
    const { data } = await reviewStepNo4ListQualityInspection({ reviewId: classReviewId! })
    qualityInspectionList.value = data
    // 获取下拉变体列表
    const { data: variantSelectList } = await reviewStepNo3GetSelectVariantList({ reviewId: classReviewId! })
    variantsSelectList.value = variantSelectList
    // 转换为下拉框需要的数据格式
    // variantsSelectList.value.unshift({ id: -1, label: '所有' })
    // console.log(variantsSelectList.value);

    variantsSelectStringList.value = [
      { label: '所有', value: '0' }, // 添加“所有”选项
      ...variantSelectList.map((item: any) => ({
        label: item.label,
        value: convertString(item.id),
      })),
    ]
  } catch (error) {
    console.error(error)
  }
}
const fetchNewSupplier = async () => {
  const { data } = await reviewStepNo4SupplierList({ reviewId: classReviewId! })
  list.value = data
}
let classReviewId: number | undefined = route.query.progressId ? props.step1Data : route.query.reviewId

onMounted(() => {
  fetchNewSupplier()
  fetchQualityInspectionData()
})
</script>

<style lang="scss" scoped>
.pay-button-group {
  display: block;
  margin: 20px auto 0 auto;
  text-align: center;
}
.none {
  display: none;
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  min-height: 35px;
  max-height: 35px;
  line-height: 35px;
}
</style>
