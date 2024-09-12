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
                        <template v-if="row['column0'] === 'orderQuantity'">
                            <el-input v-model="row[prop]"></el-input>
                        </template>
                        <template v-if="row['column0'] === 'orderQuantityUK'">
                            <el-input v-model="row[prop]"></el-input>
                        </template>
                        <template v-if="row['column0'] === 'orderQuantityDE'">
                            <el-input v-model="row[prop]"></el-input>
                        </template>
                        <template v-if="row['column0'] === 'orderQuantityWo'">
                            <el-input v-model="row[prop]"></el-input>
                        </template>
                        <template v-if="row['column0'] !== 'orderQuantity' && row['column0'] !== 'orderQuantityUK' && row['column0'] !== 'orderQuantityDE' && row['column0'] !== 'orderQuantityWo' && row['column0'] !== 'imageUrl'">
                            {{ row[prop] }}
                        </template>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty class="vab-data-empty" description="暂无数据" min-width="200px"/>
                </template>
            </el-table>
        </div>
        <vab-alert type="error" center="center">
            <h3>不分货则填0，不能留空</h3>
        </vab-alert>
        <div class="pay-button-group">
            <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">提交</el-button>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { getRootElement, getSpecificChildren } from '~/src/utils/nodeUtils';
import { currencyList, firstLegChannelColumns, invoicingList } from '../indexCommon'
defineOptions({
    name: 'OrderReviewStep3',
})

const emit = defineEmits(['change-step'])
// const listLoading = ref<boolean>(true)
const list = ref<any>([])
const exchangeList = ref<any>([])
const labelMap: Record<string, string> = {
  column0: '',
  imageUrl: 'SKU图片',
  productName: '产品名称',
  sku: 'SKU',
  orderQuantity: '订货数量(亚马逊US)',
  orderQuantityUK: '订货数量(亚马逊UK)',
  orderQuantityDE: '订货数量(亚马逊DE)',
  orderQuantityWo: '订货数量(沃尔玛US)',
  sellingPrice: '售价',
  grossProfit: '毛利率',
  packageDimensions: '包装尺寸(cm)',
  productWeight: '包装重量(g)',
  productMaterial: '产品材质',
  containsBattery: '是否含电池<br>(若有则填入电池类型)',
  skuMerge: '合并变体的SKU',
  asin: '对标竞品ASIN',
  patentStatus: '专利情况<br>(是否排查以及结果)',
  productManager: '产品经理',
  productDesign: '产品设计',
}
const  tableData = [
    {
        column0: '1',
        imageUrl: 'path-to-image.jpg',
        productName: '产品名称1',
        sku: 'sku123',
        orderQuantity: 100,
        orderQuantityUK: 100,
        orderQuantityDE: 120,
        orderQuantityWo: 0,
        sellingPrice: '$19.99',
        grossProfit: '29%',
        packageDimensions: '15x10x11',
        productWeight: '56',
        productMaterial: '棉',
        containsBattery: '锂电池',
        skuMerge: '',
        asin: 'ASIN123',
        patentStatus: '无专利',
        productManager: '王文青',
        productDesign: '任佳蓉',
    },
    {
        column0: '2',
        imageUrl: 'path-to-image.jpg',
        productName: '产品名称1',
        sku: 'sku123',
        orderQuantity: 100,
        orderQuantityUK: 100,
        orderQuantityDE: 120,
        orderQuantityWo: 0,
        sellingPrice: '$19.99',
        grossProfit: '29%',
        packageDimensions: '15x10x11',
        productWeight: '77',
        productMaterial: '棉',
        containsBattery: '锂电池',
        skuMerge: '',
        asin: 'ASIN123',
        patentStatus: '无专利',
        productManager: '王文青',
        productDesign: '任佳蓉',
    },
]


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
    emit('change-step', 3)
}

</script>
  
<style lang="scss" scoped>
.pay-button-group {
    display: block;
    margin: 20px auto;
    text-align: center;
}
</style>
  