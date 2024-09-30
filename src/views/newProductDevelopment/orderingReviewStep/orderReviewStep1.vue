<template>
    <div>
        <div class="comprehensive-table-container" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <el-table ref="tableRef" stripe border :data="variantList" :header-cell-style="{ 'text-align': 'right' }"
                height="430" :show-header="false" style="width: auto; table-layout: fixed;" @cell-click="tableInputChange">
                <!-- 第一列固定标签列 -->
                <el-table-column :prop="'column0'" :label="labelMap['column0']" fixed align="right" width="260">
                    <template #default="{ row }">
                        <strong v-html="labelMap[row['column0']]"
                            style="color: var(--el-table-header-text-color)"></strong>

                    </template>
                </el-table-column>
                <el-table-column :prop="prop" :label="prop" v-for="(prop, i) in columns" :key="i" align="center" min-width="240">
                    <template #default="{ row }">
                        <template v-if="row['column0'] === 'variantImg'">
                            <el-image style="width: 105px;height: 105px;" :src="row[prop]" fit="fill" data-img="img">
                                <template #error>
                                    <el-icon></el-icon>
                                </template>
                            </el-image>
                        </template>
                        <template v-if="row['column0'] === 'oem'">
                            <el-checkbox 
                                v-model="row[prop]" 
                                :true-value="1" 
                                :false-value="0" size="large"
                                class="custom-checkbox" 
                            />
                        </template>
                        <template v-if="row['column0'] === 'effectiveCount'">
                            <el-input 
                                v-model="row[prop]" 
                                @click="inputHandleMouseOver($event)"
                                @keydown.enter="effectiveCountInputeHandle($event)"
                                @blur="effectiveCountInputeHandle($event)"
                                class="center-input"
                            />
                        </template>
                        <template v-if="row['column0'] === 'packagingSize'">
                            {{ row[prop] }} cm
                        </template>
                        <template v-if="row['column0'] === 'productSize'">
                            {{ convertCmToInches(row[prop]) }} inch
                        </template>
                        <template
                            v-if="row['column0'] !== 'effectiveCount' && row['column0'] !== 'oem' && row['column0'] !== 'packagingSize' && row['column0'] !== 'variantImg' && row['column0'] !== 'productSize'">
                            {{ row[prop] }}
                        </template>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty class="vab-data-empty" description="暂无数据" min-width="200px" />
                </template>
            </el-table>
        </div>


        <div style="padding-top: 50px;">
            <el-table border :data="moldData" :header-cell-style="{ 'text-align': 'center' }" style="margin-top: 25px;">
                <el-table-column label="提交日期" align="center">
                    <template #default="{ row }">
                        {{ formatDate(new Date(row.createTime)) }}
                    </template>
                </el-table-column>
                <el-table-column label="零件名" prop="component" align="center" />
                <el-table-column label="供应商" prop="suppliser" align="center" />
                <el-table-column label="状态" align="center">
                    <template #default="{ row }">
                        <el-tag type="info" v-if="row.status == 0">审批中</el-tag>
                        <el-tag type="warning" v-if="row.status == 1">待提交付款申请</el-tag>
                        <el-tag type="success" v-if="row.status == 2">已付款</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="开票类型" align="center">
                    <template #default="{ row }">
                        <span v-if="row.invoiceType == 0">专票</span>
                        <span v-if="row.invoiceType == 1">普票</span>
                        <span v-if="row.invoiceType == 2">不开票</span>
                    </template>
                </el-table-column>

                <el-table-column label="付款金额" align="center" prop="payPrice">

                </el-table-column>
                <el-table-column label="处理方式" align="center">
                    <template #default="{ row }">
                        <span v-if="row.dealMethod == 0">不含在PO</span>
                        <span v-if="row.dealMethod == 1">含在该PO</span>
                        <span v-if="row.dealMethod == 2">含在其他PO</span>
                    </template>
                </el-table-column>

            </el-table>
        </div>

        <div style="padding-top:50px;">
            <el-table stripe border :data="variantDetialList" :header-cell-style="{ 'text-align': 'center' }">
                <el-table-column label="变体" min-width="100" prop="variant" />
                <el-table-column prop="site" label="站点" min-width="135">
                    <template #default="{ row }">
                        <span v-if="row.site == 0">亚马逊US</span>
                        <span v-if="row.site == 1">亚马逊DE</span>
                        <span v-if="row.site == 2">亚马逊UK</span>
                        <span v-if="row.site == 3">沃尔玛US</span>
                    </template>

                </el-table-column>
                <el-table-column label="外汇币种" min-width="100" prop="currencyType" />
                <el-table-column label="汇率" min-width="100" prop="foreignExchange" />
                <el-table-column label="实际总成本￥" min-width="120" prop="actualTotalCost" />
                <el-table-column label="长(cm)" min-width="90" prop="packagingLength" />
                <el-table-column label="宽(cm)" min-width="90" prop="packagingWidth" />
                <el-table-column label="高(cm)" min-width="90" prop="packagingHeight" />
                <el-table-column label="重量(g)" prop="weight" />
                <el-table-column label="尾程$" min-width="70" prop="lastMile" />
                <el-table-column label="头程￥" width="90" prop="firstMile" />
                <el-table-column label="打包￥" width="90" prop="packagingPrice" />
                <el-table-column prop="firstMileChannel" label="头程渠道" min-width="140" />
                <el-table-column label="最终售价$" min-width="100" prop="finalSellingPrice" />
                <el-table-column prop="grossMarginRate" label="毛利率"></el-table-column>
                <el-table-column prop="roi" label="ROI" />
                <el-table-column prop="weightCoefficient" label="重量系数" min-width="100" />
                <el-table-column prop="volumeCoefficient" label="体积系数" min-width="100" />
                <el-table-column prop="tariff" label="关税%">
                    <template #default="{ row }">
                        {{ row.tariff }}
                    </template>
                </el-table-column>
                <el-table-column prop="platformCommission" label="平台佣金" min-width="100" />
                <el-table-column prop="storageFee" label="仓储费2个月$" min-width="140" />
                <template #empty>
                    <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;" />
                </template>
            </el-table>
        </div>
        <div class="pay-button-group">
            <el-button type="danger" @click="handleGoback">不通过</el-button>
            <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">通过</el-button>
        </div>
        <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if="imagePreviewVisible"/>
    </div>
</template>

<script lang="ts" setup>
import { getReviewByReviewId, getMoldInfoByReviewId, getVariantList, reviewStepNo1Pass, reviewStepNo1Fail } from '/@/api/devlocal/orderingReview'
import { IReviewMoldItem, IReviewCommonItem, IVariantInfoItem, IReviewStepNo1Req, IReviewStepNo1Variant } from '/@/type/review/review'
import { formatDate } from '/@/utils/dateUtils'
import { useTableDataLineToColumn, inputHandleMouseOver, effectiveCountInputeHandle } from '/@/utils/tableColum'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'
import { getDataAttribute, getSpecificChildren } from '~/src/utils/nodeUtils'

const props = defineProps<{
    reviewStatus: string
    reviewStepNo: string
    reviewId: string
}>();

defineOptions({
    name: 'OrderReviewStep1',
})

const router = useRouter()
const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
const emit = defineEmits(['change-step'])
const variantDetialList = ref<IVariantInfoItem[]>([])
const variantList = ref<any[]>([])
// 原始数组的长度
const variantSize = ref<number>(0)
const moldData = ref<IReviewMoldItem[]>()
function convertCmToInches(dimensions: string) {
    // 将字符串拆分为数组
    const cmArray = dimensions.split('x').map(Number);
    // 转换为英寸并保留两位小数
    const inchArray = cmArray.map(cm => (cm * 0.393701).toFixed(2));
    // 将数组转换回字符串格式
    return inchArray.join('x');
}
const labelMap: Record<string, string> = {
    column0: '',
    orderEntryId: '变体编号',
    variantImg: 'SKU图片',
    productName: '产品名称',
    effectiveCount: '有效计数',
    oem: 'OEM',
    amazonUsOrderQuantity: '订货数量(亚马逊US)',
    purchaseTotalPrice: '总采购含税价',
    finalSellingPrice: '售价',
    actualTotalCost: '产品总实际成本',
    grossMarginRate: '毛利率',
    packagingSize: '包装尺寸(cm)',
    productSize: '产品尺寸(in)',
    material: '产品材质',
    battery: '是否含电池<br>(若有则填入电池类型)',
    variantSku: '合并变体的SKU',
    benchmarkAsin: '对标竞品ASIN',
    patent: '专利情况<br>(是否排查以及结果)',
    sampleRetentionStatus: '拍照留样情况',
    productManager: '产品经理',
    productDesign: '产品设计',
}
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 预览图片列表
const imagePriviewList = ref<string[]>([])
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
// table单击修改
const tableInputChange = async(row: any, column: any, cell: HTMLTableCellElement, event: Event) =>{
    // 处理图片放大预览
    let el = getSpecificChildren(cell, "img")[0];
    if (getDataAttribute(el,'img') && getSpecificChildren(cell,"img")[0]){
      imagePreviewVisible.value = true
      imagePriviewList.value = []
      imagePriviewList.value.push(el.src)
    }
}
const buildParams = (): IReviewStepNo1Req => {
    let paramVArr: IReviewStepNo1Variant[] = []
    let vArr: any = []
    for (let i = 1; i < variantSize.value + 1; i++) {
        let n: any = {}
        variantList.value.map((item, index) => {
            n[item["column0"]] = item[i]
        })
        vArr.push(n)
    }

    vArr.forEach((item: any, index: number) => {
        const v: IReviewStepNo1Variant = {
            orderEntryId: item.orderEntryId,
            effectiveCount: item.effectiveCount,
            oem: item.oem
        }

        paramVArr.push(v)
    })

    const params: IReviewStepNo1Req = {
        reviewId: props.reviewId,
        variantList: paramVArr
    }

    return params
}


// 当点击通过的时候
const handleSaveAndContinue = async () => {

    try {

        const deleteVNode = h('div', {}, [
            h('p', {
                style: {
                    color: 'origin'
                }
            }, '请再次确认，是否需要通过审批！')
        ]);
        $baseConfirm(deleteVNode, "系统提示", async () => {
            const params = buildParams()
            const { data } = await reviewStepNo1Pass(params)
            if (data === true) {
                
                $baseMessage("审批通过成功！", "success", "hey")
                await delVisitedRoute(handleActivePath(route, true))
                router.push({
                    path: '/newProductDevelopment/newProductApprovalAndRecords'
                })
            }
        })

    } catch (e) {
        console.error(e as Error)
    }

}
// 当点击不通过的时候
const handleGoback = () => {

    try {

        const deleteVNode = h('div', {}, [
            h('p', {
                style: {
                    color: 'red'
                }
            }, '确认要点击审核不通过吗？')
        ]);
        $baseConfirm(deleteVNode, "系统提示", async () => {
            const params = buildParams()
            const { data } = await reviewStepNo1Fail(params)
            if (data === true) {
                await delVisitedRoute(handleActivePath(route, true))
                $baseMessage("审核不通过提交成功", "success", "hey")
            }
        })

    } catch (e) {
        console.error(e as Error)
    }
}

const { initData, columns } = useTableDataLineToColumn()
const fetchData = async () => {
    const { data } = await getReviewByReviewId({ reviewId: props.reviewId })
    variantSize.value = data.length;

    let arr: IReviewCommonItem[] = []
    data.forEach((item: IReviewCommonItem, index: number) => {
        let n: IReviewCommonItem = {
            column0: (index + 1) + "",
            orderEntryId: item.orderEntryId,
            variantImg: item.variantImg,
            productName: item.productName,
            effectiveCount: (item.effectiveCount == undefined || item.effectiveCount == null) ? "" : item.effectiveCount,
            oem: (item.oem == undefined || item.oem == null) ? 0 : item.oem,
            amazonUsOrderQuantity: item.amazonUsOrderQuantity,
            purchaseTotalPrice: item.purchaseTotalPrice,
            finalSellingPrice: item.finalSellingPrice,
            actualTotalCost: item.actualTotalCost,
            grossMarginRate: item.grossMarginRate,
            packagingSize: item.packagingSize,
            productSize: item.productSize,
            material: item.material,
            battery: item.battery,
            variantSku: item.variantSku,
            benchmarkAsin: item.benchmarkAsin,
            patent: item.patent,
            sampleRetentionStatus: item.sampleRetentionStatus,
            productManager: item.productManager,
            productDesign: item.productDesign,
        }
        arr.push(n)
    })

    variantList.value = initData(arr)
}

const fetchMoldData = async () => {
    const { data } = await getMoldInfoByReviewId({ reviewId: props.reviewId })
    moldData.value = data
}

const fetchVariantData = async () => {
    const { data } = await getVariantList({ reviewId: props.reviewId })
    variantDetialList.value = data;
}

onMounted(async () => {
    fetchData()
    fetchMoldData()
    fetchVariantData()
})
</script>

<style lang="scss" scoped>
.pay-button-group {
    display: block;
    margin: 20px auto;
    text-align: center;
}

.custom-checkbox {
    transform: scale(1.3); // 放大 20%
    transform-origin: center; // 确保放大从中心开始
}
:deep(.center-input .el-input__inner ){
    text-align: center;
}
</style>