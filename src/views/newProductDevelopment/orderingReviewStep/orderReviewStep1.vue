<template>
    <div>
        <div>
            <el-table ref="tableRef" stripe border :data="variantList" :header-cell-style="{ 'text-align': 'right' }"
                height="430" :show-header="false">
                <!-- 第一列固定标签列 -->
                <el-table-column :prop="'column0'" :label="labelMap['column0']" fixed align="right" width="260">
                    <template #default="{ row }">
                        <strong v-html="labelMap[row['column0']]"
                            style="color: var(--el-table-header-text-color)"></strong>

                    </template>
                </el-table-column>
                <el-table-column :prop="prop" :label="prop" v-for="(prop, i) in columns" :key="i" align="center">
                    <template #default="{ row }">
                        <template v-if="row['column0'] === 'variantImg'">
                            <el-image style="width: 105px;height: 105px;" :src="row[prop]" fit="fill" />
                        </template>
                        <template v-if="row['column0'] === 'oem'">
                            <el-checkbox v-model="row[prop]" :true-value="'1'" :false-value="'0'" size="large"
                                class="custom-checkbox" />
                        </template>
                        <template v-if="row['column0'] === 'effectiveCount'">
                            <el-input v-model="row[prop]" @click="inputHandleMouseOver($event)"
                                @keydown.enter="effectiveCountInputeHandle($event)"></el-input>
                        </template>
                        <template
                            v-if="row['column0'] !== 'effectiveCount' && row['column0'] !== 'oem' && row['column0'] !== 'variantImg'">
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

                <template #empty>
                    <el-empty class="vab-data-empty" description="暂无数据" min-width="200px" />
                </template>
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
    </div>
</template>

<script lang="ts" setup>

import { getReviewByReviewId, getMoldInfoByReviewId, getVariantList } from '/@/api/devlocal/orderingReview'
import { IReviewMoldItem, IReviewCommonItem, IVariantInfoItem } from '/@/type/review/review'
import { formatDate } from '/@/utils/dateUtils'
import { getSpecificChildren } from '/@/utils/nodeUtils'

const props = defineProps<{
    reviewStatus: string
    reviewStepNo: string
    reviewId: string
}>();

defineOptions({
    name: 'OrderReviewStep1',
})

const emit = defineEmits(['change-step'])
const variantDetialList = ref<IVariantInfoItem[]>([])
const variantList = ref<any[]>([])
const labelMap: Record<string, string> = {
    column0: '',
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
    productSize: '产品尺寸(cm)',
    material: '产品材质',
    battery: '是否含电池<br>(若有则填入电池类型)',
    variantSku: '合并变体的SKU',
    benchmarkAsin: '对标竞品ASIN',
    patent: '专利情况<br>(是否排查以及结果)',
    sampleRetentionStatus: '拍照留样情况',
    productManager: '产品经理',
    productDesign: '产品设计',
}

const moldData = ref<IReviewMoldItem[]>()

interface FormattedData {
    [key: string]: any;
}
interface RowData {
    [key: string]: any;
}

const useTableDataLineToColumn = () => {
    // 一条数据的所有字段数组
    let props = ref<string[]>([])
    // 每个字段的分组数据
    let groupData = ref<any[][]>([])
    // 计算表头
    const columns = computed(() => {
        return props.value.length > 0 ? [...groupData.value[0]] : []
    })
    // 根据每条数据的字段对数据进行分组
    const dataToGroupByKey = (list: any) => {
        list.forEach((item: any) => {
            // 遍历每个字段
            props.value.forEach((key, index) => {
                // 把对应字段的值放到对应字段分组中
                groupData.value[index].push(item[key])
            })
        })
    }

    // 根据分组数据，转换成最终显示的数据个数
    const changeGroupData = () => {
        // 转换后的数据
        const list: FormattedData[] = []
        // 解构分组数据
        const [column0, ...otherData] = groupData.value
        // 初始化每一行的数据, 除去表头，有几个key就算有几行
        props.value.slice(1).forEach((prop, i) => {
            list[i] = []
            // 设置第一列标题索引名称
            const data = { [props.value[0]]: prop }
            // 通过遍历每一列的日期，设置对应行的数据
            column0.forEach((column0, dateIndex) => {
                data[column0] = otherData[i][dateIndex]
            })
            list[i] = data
        })
        return list
    }

    // 初始化分组数据
    const initGroup = (list: RowData[]) => {
        const firstData = list[0] || {}
        // 获取一条数组的所有字段
        props.value = Object.keys(firstData)
        // 初始化每个字段的分组数据
        for (let i = 0; i < props.value.length; i++) {
            groupData.value[i] = []
        }
    }

    return {
        columns,
        initData: (data: RowData[] = []) => {
            // 初始化分组
            initGroup(data)
            // 向分组加入数据
            dataToGroupByKey(data)
            // 初始化分组内的数据，转为列数据
            return changeGroupData()
        }
    }
}
const { initData, columns } = useTableDataLineToColumn()

// 输入键盘enter失去焦点
const effectiveCountInputeHandle = (event: Event) => {
    const targetElement = event.target as HTMLInputElement;
    targetElement.blur();
}

const inputHandleMouseOver = (evnet: Event) => {
    const target = event?.target;
    if (target && (target as HTMLElement).tagName === 'INPUT') {
        const inputElement = target as HTMLInputElement;
        inputElement.select();
    }
}

// 当点击通过的时候
const handleSaveAndContinue = () => {
    $baseMessage("通过", "success", "hey")
    emit('change-step', 1)
}
// 当点击不通过的时候
const handleGoback = () => {
    $baseMessage("不通过", "error", "hey")
}

const fetchData = async () => {
    const { data } = await getReviewByReviewId({ reviewId: props.reviewId })
    let arr: IReviewCommonItem[] = []
    data.forEach((item: IReviewCommonItem, index: number) => {

        let n: IReviewCommonItem = {
            column0: (index + 1) + "",
            variantImg: item.variantImg,
            productName: item.productName,
            effectiveCount: item.effectiveCount,
            oem: item.oem,
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
</style>