<template>
    <div class="comprehensive-table-container auto-height-container">
        
        <div>
            <el-table 
                ref="tableRef" 
                stripe border 
                :data="exchangeList" 
                :header-cell-style="{ 'text-align': 'center' }"
                height="400"
            >
                <el-table-column :prop="prop" :label="i === 0 ? labelMap[prop] : prop" v-for="(prop, i) in columns" 
                :key="i" align="center">
                    <template #default = {row}>
                        {{ i === 0 ? labelMap[row[prop]] : row[prop] }}
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty class="vab-data-empty" description="暂无数据" />
                </template>
            </el-table>
        </div>

      
        <div>
            <el-table 
            ref="tableRef" 

            stripe border 
            :data="list" 
            :header-cell-style="{ 'text-align': 'center' }"
            style="margin-top: 25px;"
            height="200"
        >
            <el-table-column label="" min-width="100" prop="currency">
                {{ "含在PO里的开模费" }}
            </el-table-column>
            <el-table-column label="提交日期" min-width="127">
      
            </el-table-column>
            <el-table-column label="零件名" min-width="200">
                    <template #default="{ row }">
                        <!-- <span>{{siteReflectCurrencyAndExchangeRate.get(row.site)}}</span> -->

                    </template>
                </el-table-column>
            <el-table-column label="供应商" min-width="127">
      
            </el-table-column>
            <el-table-column label="状态" min-width="127">
      
            </el-table-column>
            <el-table-column label="开票类型" min-width="127">
      
            </el-table-column>
            <el-table-column label="付款金额" min-width="127">
      
            </el-table-column>
            <el-table-column label="处理方式" min-width="127">
      
            </el-table-column>
            <el-table-column label="均摊方式" min-width="127">
      
            </el-table-column>
            <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
            </template>
            </el-table>
        </div>
        <div class="pay-button-group">
            <el-button @click="handleGoback">上一步</el-button>
            <el-button native-type="submit" type="primary" @click="handleSave">保存</el-button>
            <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">提交审核</el-button>
        </div>
    </div>
  </template>
  
<script lang="ts" setup>
defineOptions({
    name: 'OrderStep6',
})

const emit = defineEmits(['change-step'])
// const listLoading = ref<boolean>(true)
const list = ref<any>([])
const exchangeList = ref<any>([])
const labelMap: Record<string, string> = {
  imageUrl: 'SKU图片',
  productName: '产品名称',
  orderQuantity: '订货数量(亚马逊US)',
  totalPrice: '总采购含税价',
  sellingPrice: '售价',
  cost: '产品实际总成本',
  grossProfit: '毛利率',
  packageDimensions: '包装尺寸(cm)',
  productDimensions: '产品尺寸(cm)',
  productMaterial: '产品材质',
  containsBattery: '是否含电池(若有则填入电池类型)',
  asin: '对标竞品ASIN',
  patentStatus: '专利情况(是否排查以及结果)',
  photoSampleStatus: '拍照留样情况',
  productManager: '产品经理',
  productDesign: '产品设计',
  certification: '证书',
  skuMerge: '合并变体的SKU',
}
const  tableData = [
    {
        imageUrl: 'path-to-image.jpg',
        productName: '产品名称1',
        orderQuantity: 100,
        totalPrice: '¥5000',
        sellingPrice: '$19.99',
        cost: '¥15',
        grossProfit: '29%',
        packageDimensions: '15x10x11',
        productDimensions: '25x12x1',
        productMaterial: '棉',
        containsBattery: '锂电池',
        asin: 'ASIN123',
        patentStatus: '无专利',
        photoSampleStatus: '已有拍照样品',
        productManager: '王文青',
        productDesign: '任佳蓉',
        certification: 'SKU1',
        skuMerge: 'SKU123',
    },
    {
        imageUrl: 'path-to-image.jpg',
        productName: '产品名称1',
        orderQuantity: 100,
        totalPrice: '¥5000',
        sellingPrice: '$19.99',
        cost: '¥15',
        grossProfit: '29%',
        packageDimensions: '15x10x11',
        productDimensions: '25x12x1',
        productMaterial: '棉',
        containsBattery: '锂电池',
        asin: 'ASIN123',
        patentStatus: '无专利',
        photoSampleStatus: '已有拍照样品',
        productManager: '王文青',
        productDesign: '任佳蓉',
        certification: 'SKU1',
        skuMerge: 'SKU123',
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
    return props.value.length > 0 ?  [props.value[0], ...groupData.value[0]] : []
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
exchangeList.value = initData(tableData)
// 当点击保存的时候
const handleSave = () => {
    $baseMessage("当前信息已保存。","success","hey")
}
// 当点击提交审核的时候
const handleSaveAndContinue = () => {
    $baseMessage("当前信息已保存。","success","hey")
}
// 当点击上一步的时候
const handleGoback = () => {
    emit('change-step', 4)
}
</script>
  
<style lang="scss" scoped>
.pay-button-group {
    display: block;
    margin: 20px auto;
    text-align: center;
}
</style>
  