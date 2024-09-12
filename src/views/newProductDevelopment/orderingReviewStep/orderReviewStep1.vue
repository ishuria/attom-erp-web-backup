<template>
    <div>
        <div>
            <el-table 
                ref="tableRef" 
                stripe border 
                :data="exchangeList" 
                :header-cell-style="{ 'text-align': 'right' }"
                height="430"
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
                    <template #default = {row}>
                        <template v-if="row['column0'] === 'imageUrl'">
                            <el-image style="width: 75px; height: 75px" :src="row.componentImg" fit="fill" />
                        </template>
                        <template v-if="row['column0'] === 'oem'">
                            <el-checkbox v-model="row[prop]" :true-value="'1'" :false-value="'0'" size="large" class="custom-checkbox"/>
                        </template>
                        <template v-if="row['column0'] === 'count'">
                            <el-input v-model="row[prop]"></el-input>
                        </template>
                        <template v-if="row['column0'] !== 'count' && row['column0'] !== 'oem' && row['column0'] !== 'imageUrl'">
                            {{ row[prop] }}
                        </template>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty class="vab-data-empty" description="暂无数据" min-width="200px"/>
                </template>
            </el-table>
        </div>

      
        <div>
            <el-table 
            ref="tableRef" 

            stripe border 
            :data="POdata" 
            :header-cell-style="{ 'text-align': 'center' }"
            style="margin-top: 25px;"
            height="90"
        >
            <!-- <el-table-column label="" width="160" prop="">
                <strong style="color: var(--el-table-header-text-color)">{{ "含在PO里的开模费" }}</strong>
            </el-table-column> -->
            <el-table-column label="提交日期" min-width="127" prop="date" align="center">
                <template #default="{ row }">
                   {{ row.date }}
                </template>
            </el-table-column>
            <el-table-column label="零件名" min-width="200" prop="name">
                    <template #default="{ row }">
                        <!-- <span>{{siteReflectCurrencyAndExchangeRate.get(row.site)}}</span> -->

                    </template>
                </el-table-column>
            <el-table-column label="供应商" min-width="127" prop="supplier">
      
            </el-table-column>
            <el-table-column label="状态" min-width="127" align="center" prop="status">
      
            </el-table-column>
            <el-table-column label="开票类型" min-width="127" align="center" prop="kaipiao">
      
            </el-table-column>
            <el-table-column label="付款金额" min-width="127" align="center" prop="cost">
      
            </el-table-column>
            <el-table-column label="处理方式" min-width="127" align="center" prop="dealMethod">
      
            </el-table-column>
            <template #empty>
                <el-empty class="vab-data-empty" description="暂无数据" min-width="200px"/>
            </template>
            </el-table>
        </div>
        <div>
            <el-table 
            ref="tableRef" 

            stripe border 
            :data="list" 
            :header-cell-style="{ 'text-align': 'center' }"
            @cell-click="changeInput"
        >
            <el-table-column label="变体" min-width="100" prop="currency">
                <template #default="{ row }">
                </template>
            </el-table-column>
            <el-table-column prop="site" label="站点" min-width="135">
                <template #default="{ row }">
                    
                </template>
            </el-table-column>
            <el-table-column label="外汇币种" min-width="100">
                <template #default="{ row }">
                    <!-- <span>{{siteReflectCurrencyAndExchangeRate.get(row.site)}}</span> -->

                </template>
            </el-table-column>
            <el-table-column label="汇率" min-width="100">
                <template #default="{ row }">
                    <!-- <span>{{siteReflectCurrencyAndExchangeRate.get(row.site)}}</span> -->

                </template>
            </el-table-column>
            <el-table-column prop="price" label="实际总成本￥" min-width="120">
                <template #default="{ row }">
                    {{ row.price }}
                </template>
            </el-table-column>
            <el-table-column prop="length" label="长(cm)" min-width="90">
                <template #default="{ row }">
                    {{ row.length }}
                </template>
            </el-table-column>

            <el-table-column prop="width" label="宽(cm)" min-width="90">
                <template #default="{ row }">
                    {{ row.width }}
                </template>
            </el-table-column>

            <el-table-column prop="height" label="高(cm)" min-width="90">
                <template #default="{ row }">
                    {{ row.height }}
                </template>
            </el-table-column>

            <el-table-column  label="重量(g)">
                <template #default="{ row }">
                    {{ row.weight }}
                </template>
            </el-table-column>
            <el-table-column label="尾程$"  min-width="70" prop="lastMile" ></el-table-column>
            <el-table-column label="头程￥"  width="90" prop="lastfirstMileMile" ></el-table-column>    
            <el-table-column label="打包￥"  width="90" prop="packaging" >
                <template #default="{ row }">
                    {{ row.packaging }}
                </template>
            </el-table-column>
            <el-table-column prop="firstMileChannel" label="头程渠道" min-width="140">
                <template #default="{ row }">
                    
                </template>
            </el-table-column>
                <el-table-column label="最终售价$" min-width="100" prop="sellingPrice">
                    <template #default="{ row }">
                        {{ row.sellingPrice }}
                    </template>
                </el-table-column>
                <el-table-column prop="grossMarginRate" label="毛利率"></el-table-column>
                <el-table-column prop="roi" label="ROI"></el-table-column>
                <el-table-column prop="weightCoefficient" label="重量系数" min-width="100">
                    <template #default="{ row }">
                        {{ row.weightCoefficient }}
                    </template>
                </el-table-column>
                <el-table-column prop="volumeCoefficient" label="体积系数" min-width="100">
                    <template #default="{ row }">
                        {{ row.volumeCoefficient }}
                    </template>
                </el-table-column>
                <el-table-column prop="tariff" label="关税%">
                    <template #default="{ row }">
                        {{ row.tariff }}
                    </template>
                </el-table-column>
                <el-table-column prop="platformCommission" label="平台佣金" min-width="100"></el-table-column>
                <el-table-column prop="storageFee" label="仓储费2个月$" min-width="140"></el-table-column>
                <template #empty>
                    <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
                </template>
            </el-table>
        </div>
        <div class="pay-button-group">
            <el-button @click="handleGoback">不通过</el-button>
            <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">通过</el-button>
        </div>
    </div>
  </template>
  
<script lang="ts" setup>
import { getRootElement, getSpecificChildren } from '~/src/utils/nodeUtils';
import { currencyList, firstLegChannelColumns, invoicingList } from '../indexCommon'
defineOptions({
    name: 'OrderReviewStep1',
})

const emit = defineEmits(['change-step'])
// const listLoading = ref<boolean>(true)
const list = ref<any>([])
const exchangeList = ref<any>([])
const labelMap: Record<string, string> = {
  column0: '',
  imageUrl: 'SKU图片',
  productName: '产品名称',
  count: '有效计数',
  oem: 'OEM',
  orderQuantity: '订货数量(亚马逊US)',
  totalPrice: '总采购含税价',
  sellingPrice: '售价',
  cost: '产品总实际成本',
  grossProfit: '毛利率',
  packageDimensions: '包装尺寸(cm)',
  productDimensions: '产品尺寸(cm)',
  productMaterial: '产品材质',
  containsBattery: '是否含电池<br>(若有则填入电池类型)',
  skuMerge: '合并变体的SKU',
  asin: '对标竞品ASIN',
  patentStatus: '专利情况<br>(是否排查以及结果)',
  photoSampleStatus: '拍照留样情况',
  productManager: '产品经理',
  productDesign: '产品设计',
}
const  tableData = [
    {
        column0: '1',
        imageUrl: 'path-to-image.jpg',
        productName: '产品名称1',
        count: 100,
        oem: '0',
        orderQuantity: 100,
        totalPrice: '¥5000',
        sellingPrice: '$19.99',
        cost: '¥15',
        grossProfit: '29%',
        packageDimensions: '15x10x11',
        productDimensions: '25x12x1',
        productMaterial: '棉',
        containsBattery: '锂电池',
        skuMerge: '',
        asin: 'ASIN123',
        patentStatus: '无专利',
        photoSampleStatus: '已有拍照样品',
        productManager: '王文青',
        productDesign: '任佳蓉',
    },
    {
        column0: '2',
        imageUrl: 'path-to-image.jpg',
        productName: '产品名称1',
        count: 15,
        oem: '1',
        orderQuantity: 100,
        totalPrice: '¥5000',
        sellingPrice: '$19.99',
        cost: '¥15',
        grossProfit: '29%',
        packageDimensions: '15x10x11',
        productDimensions: '25x12x1',
        productMaterial: '棉',
        containsBattery: '锂电池',
        skuMerge: '',
        asin: 'ASIN123',
        patentStatus: '无专利',
        photoSampleStatus: '已有拍照样品',
        productManager: '王文青',
        productDesign: '任佳蓉',
    },
]
const POdata = [
    {
        date: '2024-8-4',
        name: 'component',
        supplier: 'supplier1',
        status: '已通过',
        kaipiao: '专票',
        cost: '3600',
        dealMethod: '含在其它PO',
    }

]
/**
 * 当点击时切换输入框，修改输入
 */
 const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 


if (!cell.children[0].children[0]
    || !cell.children[0].children[1]
    || !cell.children[0].children[0].classList
    || !cell.children[0].children[1].classList) {
return
}

cell.children[0].children[0].classList.remove('none')
cell.children[0].children[1].classList.add('none')


// 自动聚焦
const inputElement = getSpecificChildren(cell, "input")[0];
if (inputElement) {
    inputElement.focus()
} else {
const textareaElement = getSpecificChildren(cell, "textarea")[0];
if (textareaElement){
    textareaElement.focus()
}
}
}

// table blur事件
const clickCancle = async (event:any,value:any) =>{
const t1 = getRootElement(event["srcElement"],".cell").children[0]
if (t1){
  t1.classList.add("none")
}

const t2 = getRootElement(event["srcElement"],".cell").children[1]
if (t2){
  t2.classList.remove("none")
}
}
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
    return props.value.length > 0 ?  [...groupData.value[0]] : []
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
    console.log('groupData.value', groupData.value);
    
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
    for(let i = 0; i < props.value.length; i++) {
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
console.log(columns) //'path-to-image.jpg', 'path-to-image.jpg'
exchangeList.value = initData(tableData)

// 当点击通过的时候
const handleSaveAndContinue = () => {
    $baseMessage("通过","success","hey")
    emit('change-step', 1)
}
// 当点击不通过的时候
const handleGoback = () => {
    $baseMessage("不通过","error","hey")
}
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
  