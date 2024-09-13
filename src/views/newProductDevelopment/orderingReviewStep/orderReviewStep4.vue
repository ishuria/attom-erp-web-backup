<template>
    <div>
        <div>
            <el-table 
                ref="tableRef" 
                stripe border 
                :data="variantList" 
                :header-cell-style="{ 'text-align': 'right' }"
                height="630"
                :show-header="false"
            >
                <!-- 第一列固定标签列 -->
                <el-table-column 
                    :prop="'column0'" 
                    :label="labelMap['column0']" 
                    fixed
                    align="right"
                    width="260"
                >
                    <template #default="{ row }">
                        <strong v-html="labelMap[row['column0']]" style="color: var(--el-table-header-text-color)"></strong>
                    </template>
                </el-table-column>
                <el-table-column 
                    :prop="prop" 
                    :label="prop" 
                    v-for="(prop, i) in columns" 
                    :key="i" 
                    align="center" 
                >
                    <template v-slot="scope">
                        <template v-if="scope.row['column0'] === 'variantImg'">
                            <el-image style="width: 105px;height: 105px;" :src="scope.row[prop]" fit="fill" />
                        </template>
                        <template v-if="scope.row['column0'] === 'oem'">
                            <el-checkbox v-model="scope.row[prop]" :disabled="true":true-value="1" :false-value="0" size="large" class="custom-checkbox"/>
                        </template>
                        <template v-if="scope.row['column0'] === 'amazonUsOrderQuantity'">
                          <el-input
                            v-model="scope.row[prop]" 
                            @click="inputHandleMouseOver($event)"
                            @keydown.enter="updateHnadlerNumber($event, scope)" 
                            @blur="updateHnadlerNumber($event, scope)" 
                          />
                        </template>
                        <template v-if="scope.row['column0'] === 'amazonUkOrderQuantity'">
                          <el-input 
                            v-model="scope.row[prop]" 
                            @click="inputHandleMouseOver($event)"
                            @keydown.enter="updateHnadlerNumber($event, scope)"
                            @blur="updateHnadlerNumber($event, scope)"
                          />
                        </template>
                        <template v-if="scope.row['column0'] === 'amazonDeOrderQuantity'">
                          <el-input
                            v-model="scope.row[prop]"
                            @click="inputHandleMouseOver($event)"
                            @keydown.enter="updateHnadlerNumber($event, scope)"
                            @blur="updateHnadlerNumber($event, scope)"
                          />
                        </template>
                        <template v-if="scope.row['column0'] === 'walmartUsOrderQuantity'">
                          <el-input
                            v-model="scope.row[prop]"
                            @click="inputHandleMouseOver($event)"
                            @keydown.enter="updateHnadlerNumber($event, scope)"
                            @blur="updateHnadlerNumber($event, scope)"
                          />
                        </template>
                        <template 
                          v-if="scope.row['column0'] !== 'oem' && scope.row['column0'] !== 'amazonUsOrderQuantity' && 
                          scope.row['column0'] !== 'amazonUkOrderQuantity' && scope.row['column0'] !== 'amazonDeOrderQuantity' && 
                          scope.row['column0'] !== 'walmartUsOrderQuantity' && scope.row['column0'] !== 'variantImg'"
                        >
                            {{ scope.row[prop] }}
                        </template>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty class="vab-data-empty" description="暂无数据" min-width="200px"/>
                </template>
            </el-table>
        </div>
        <div class="pay-button-group">
            <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">发布PO</el-button>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { useTableDataLineToColumn, inputHandleMouseOver } from '/@/utils/tableColum'
import {reviewProductList,updateStepNoQuantity,releasePo} from '/@/api/devlocal/orderingReview'
import { IReviewCommonItem, IReviewStepUpdateReq } from '/@/type/review/review'

defineOptions({
    name: 'OrderReviewStep4',
})

const props = defineProps<{
  reviewStatus: string
  reviewStepNo: string
  reviewId: string
}>();

const router = useRouter()
const emit = defineEmits(['change-step'])
const variantList = ref<any[]>([])
const labelMap: Record<string, string> = {
  column0: '',
  orderEntryId: '变体编号',
  variantImg: 'SKU图片',
  productName: '产品名称',
  sku: 'SKU',
  effectiveCount: '有效计数',
  oem: 'OEM',
  amazonUsOrderQuantity: '订货数量(亚马逊US)',
  amazonUkOrderQuantity: '订货数量(亚马逊UK)',
  amazonDeOrderQuantity: '订货数量(亚马逊DE)',
  walmartUsOrderQuantity: '订货数量(沃尔玛US)',
}

const buildParams = (idx: number): IReviewStepUpdateReq => {
  let n: any = {}
  variantList.value.map((item, index) => {
    n[item["column0"]] = item[idx]
  })

  const params: IReviewStepUpdateReq = {
    orderEntryId: n.orderEntryId,
    amazonUsOrderQuantity: n.amazonUsOrderQuantity,
    amazonUkOrderQuantity: n.amazonUkOrderQuantity,
    amazonDeOrderQuantity: n.amazonDeOrderQuantity,
    walmartUsOrderQuantity: n.walmartUsOrderQuantity
  }
  return params
}


const updateHnadlerNumber = async (event: Event, row: any) => {
  const updateParmas = buildParams(row.cellIndex)
  console.log(updateParmas)

  const targetElement = event.target as HTMLInputElement
  targetElement.blur()
  const { data } = await updateStepNoQuantity(updateParmas)
  if (data === true) {
    $baseMessage("分货数量成功！", "success", "hey")
    fetchData()
  }

}


// 当点击通过的时候
const handleSaveAndContinue = async () => {
  const deleteVNode = h('div', {}, [
    h('p', {
      style: {
        color: 'origin'
      }
    }, '请再次确认，是否要真的发布PO！')
  ]);
  $baseConfirm(deleteVNode, "系统提示", async () => {

    const { data } = await releasePo({reviewId:props.reviewId})
    if (data === true) {
      $baseMessage("发布PO成功！", "success", "hey")
      router.push({
        path: '/newProductDevelopment/newProductApprovalAndRecords'
      })
    }

  })
}

const { initData, columns } = useTableDataLineToColumn()
const fetchData = async () => {
  const { data } = await reviewProductList({ reviewId: props.reviewId })


  let arr: IReviewCommonItem[] = []
  data.forEach((item: IReviewCommonItem, index: number) => {
    let n: IReviewCommonItem = {
      column0: (index + 1) + "",
      orderEntryId: item.orderEntryId,
      variantImg: item.variantImg,
      productName: item.productName,
      sku: item.sku,
      effectiveCount: (item.effectiveCount == undefined || item.effectiveCount == null) ? "" : item.effectiveCount,
      oem: (item.oem == undefined || item.oem == null) ? 0 : item.oem,
      amazonUsOrderQuantity: item.amazonUsOrderQuantity,
      amazonUkOrderQuantity: item.amazonUkOrderQuantity,
      amazonDeOrderQuantity: item.amazonDeOrderQuantity,
      walmartUsOrderQuantity: item.walmartUsOrderQuantity,
    }
    arr.push(n)
  })

  variantList.value = initData(arr)
}

onMounted(() => {
  fetchData()
})


</script>
  
<style lang="scss" scoped>

// 选中且不被禁用的样式
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #4A62E7;
  border-color: #4A62E7;
}

// 选中且被禁用的样式
::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background: rgb(10, 108, 245);
  border-color: rgb(10, 108, 245);
}

// 选中后中间的 “✔” 的样式
::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #fff;
}

.pay-button-group {
    display: block;
    margin: 20px auto;
    text-align: center;
}
.custom-checkbox {
  transform: scale(1.3); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
</style>
  