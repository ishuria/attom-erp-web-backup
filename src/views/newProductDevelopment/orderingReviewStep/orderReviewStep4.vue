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
                        <template v-if="row['column0'] !== 'oem' && row['column0'] !== 'orderQuantity' && row['column0'] !== 'orderQuantityUK' && row['column0'] !== 'orderQuantityDE' && row['column0'] !== 'orderQuantityWo' && row['column0'] !== 'imageUrl'">
                            {{ row[prop] }}
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
import { getRootElement, getSpecificChildren } from '~/src/utils/nodeUtils';
import { currencyList, firstLegChannelColumns, invoicingList } from '../indexCommon'
defineOptions({
    name: 'OrderReviewStep4',
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
  count: '有效计数',
  oem: 'OEM',
  orderQuantity: '订货数量(亚马逊US)',
  orderQuantityUK: '订货数量(亚马逊UK)',
  orderQuantityDE: '订货数量(亚马逊DE)',
  orderQuantityWo: '订货数量(沃尔玛US)',
}
const  tableData = [
    {
        column0: '1',
        imageUrl: 'path-to-image.jpg',
        productName: '产品名称1',
        sku: 'sku123',
        count: 100,
        oem: '0',
        orderQuantity: 100,
        orderQuantityUK: 100,
        orderQuantityDE: 120,
        orderQuantityWo: 0,
    },
    {
        column0: '2',
        imageUrl: 'path-to-image.jpg',
        productName: '产品名称1',
        sku: 'sku123',
        count: 100,
        oem: '1',
        orderQuantity: 200,
        orderQuantityUK: 100,
        orderQuantityDE: 120,
        orderQuantityWo: 0,
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
    $baseMessage("发布PO","success","hey")
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
  