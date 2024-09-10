<template>
    <div class="comprehensive-table-container auto-height-container">
        <el-table 
            ref="tableRef"
            :data="exchangeList" 
            border stripe
            :header-cell-style="{ 'text-align': 'center' }"
            @cell-click="changeInput"
        >
            <!-- 第一列固定标签列 -->
            <el-table-column 
                :prop="'column0'" 
                :label="labelMap['column0']" 
                fixed 
                align="right"
            >
                <template #default="{ row }">
                    {{ labelMap[row['column0']] }}
                </template>
            </el-table-column>
            <el-table-column label="变体值相同" prop="varientsSame" align="center" min-width="90">
                <template #default="{row}">
                    
                    <template v-if="row['column0'] !== 'productImage'">
                        <el-checkbox></el-checkbox>
                    </template>
                </template>
            </el-table-column>
            <!-- 动态列 -->
            <el-table-column 
                v-for="(prop, index) in columns" 
                :prop="prop" 
                :label="prop" 
                :key="index"
                align="center"
            >
                <template #default = {row}>
                    <template v-if="row['column0'] === 'productImage'">
                        <el-upload 
                            list-type="picture-card"  
                            :limit="1" 
                            action="#"
                        >
                            <el-icon ><Plus /></el-icon>
                            <template #file="{ file }">
                                <div>
                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                <span class="el-upload-list__item-actions">
                                    <span 
                                        v-if="!disabled"
                                        class="el-upload-list__item-preview">
                                        <el-icon><zoom-in /></el-icon>
                                    </span>
                                    <span
                                        v-if="!disabled"
                                        class="el-upload-list__item-delete"
                                    >
                                        <el-icon><Delete /></el-icon>
                                    </span>
                                </span>
                                </div>
                            </template>
                        </el-upload>
                    </template>
                    <template v-if="row['column0'] === 'productLength'">
                        <div class="none">
                            <el-input type="text" v-model="row.targetMonthlySales" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row[prop] }}</span>
                    </template>
                    <template v-if="row['column0'] === 'productWidth'">
                        <div class="none">
                            <el-input type="text" v-model="row.targetMonthlySales" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row[prop] }}</span>
                    </template>
                    <template v-if="row['column0'] === 'productHeight'">
                        <div class="none">
                            <el-input type="text" v-model="row.targetMonthlySales" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row[prop] }}</span>
                    </template>
                    <template v-if="row['column0'] === 'productMaterial'">
                        <div class="none">
                            <el-input type="text" v-model="row.targetMonthlySales" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row[prop] }}</span>
                    </template>
                    <template v-if="row['column0'] === 'containsBattery'">
                        <div class="none">
                            <el-input type="text" v-model="row.targetMonthlySales" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row[prop] }}</span> 
                    </template>
                    <template v-if="row['column0'] === 'competitorASIN'">
                        <div class="none">
                            <el-input type="text" v-model="row.targetMonthlySales" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row[prop] }}</span> 
                    </template>
                    <template v-if="row['column0'] === 'patentStatus'">
                        <div class="none">
                            <el-input type="text" v-model="row.targetMonthlySales" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row[prop] }}</span> 
                    </template>
                    <template v-if="row['column0'] === 'productManager'">
                        <el-select 
                            v-model="row[prop].productManager!" 
                            value-key="id"
                            placeholder="请选择产品经理"
                            filterable
                            clearable
                            allow-create
                            :reserve-keyword = "false"
                        >
                            <el-option v-for="item in managerList" :label="item.label!" :value="item.value" :key="item.value" />
                        </el-select>
                    </template>
                    <template v-if="row['column0'] === 'productDesign'">
                        <el-select 
                            v-model="row[prop].productDesign!" 
                            value-key="id"
                            placeholder="请选择产品设计"
                            filterable
                            clearable
                            allow-create
                            :reserve-keyword = "false"
                        >
                            <el-option v-for="item in managerList" :label="item.label!" :value="item.value" :key="item.value" />
                        </el-select>
                    </template>
                    <template v-if="row['column0'] === 'photoSampleStatus'">
                        <el-select v-model="row[prop]" placeholder="请选择">
                            <el-option label="已有拍照样品,大货无需留样" value="Sample1"></el-option>
                            <el-option label="大货需要留样拍照" value="Sample2"></el-option>
                        </el-select>
                    </template>
                    <template v-if="row['column0'] === 'packingGroup'">
                        <el-checkbox></el-checkbox>
                    </template>
                    
                    <template v-if="row['column0'] === 'operate'">
                        <el-link type="primary" :underline="false">填入合并变体SKU的数据</el-link>
                    </template>
                </template>
                
            </el-table-column>
  



            <!-- <el-table-column 
                v-for="(item, index) in props.formData?.variantNames"
                align="center"
                :label="item"
                :key="index"
            >
            </el-table-column> -->
            <!-- <el-table-column 
                v-for="(item, index) in ['变体名1', '变体名2']"
                align="center"
                :label="item"
                :prop="item"
                :key="index"
            >
            </el-table-column> -->
            <template #empty>
                <el-empty class="vab-data-empty" description="暂无数据" />
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
defineOptions({
    name: 'OrderStep5',
})
import { Search, ArrowDown, Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { getRootElement, getSpecificChildren } from '~/src/utils/nodeUtils';
import type { TableInstance } from 'element-plus'
const props = defineProps({
    formData: Object
})
const emit = defineEmits(['change-step'])

// const listLoading = ref<boolean>(true)
const list = ref<any>([])
const disabled = ref(false)
const tableRef = ref<TableInstance>()

const managerList = [
    { label: '采购助理', value: '0'},
    { label: '产品设计', value: '1'},
    { label: '产品经理', value: '2'},
    { label: '产品经理主管', value: '3'},
    { label: '行政采购主管', value: '4'},
    { label: '采购', value: '5'},
]
const rowData = [
  {
    column0: '变体名1',
    productImage: 'Image1.jpg',
    productLength: 'Product1',
    productWidth: '30',
    productHeight: '20',
    productMaterial: 'Plastic',
    containsBattery: 'No',
    competitorASIN: 'ASIN1234',
    patentStatus: 'Patented',
    productManager: 'Manager1',
    productDesign: 'Design1',
    photoSampleStatus: 'Sample1',
    packingGroup: 'Yes',
    certificateUpload: 'Certificate1.pdf',
    skuMerge: 'SKU123',
    operate: '操作'
  },
  {
    column0: '变体名2',
    productImage: 'Image1.jpg',
    productLength: 'Product1',
    productWidth: '30',
    productHeight: '20',
    productMaterial: 'Plastic',
    containsBattery: 'No',
    competitorASIN: 'ASIN1234',
    patentStatus: 'Patented',
    productManager: 'Manager1',
    productDesign: 'Design1',
    photoSampleStatus: 'Sample1',
    packingGroup: 'Yes',
    certificateUpload: 'Certificate1.pdf',
    skuMerge: 'SKU123',
    operate: '操作'
  },
];
interface FormattedData {
  [key: string]: any;
}
interface RowData {
  [key: string]: any;
}

const useTableDataLineToColumn = () => {
  // 一条数据的所有字段数组
//   let props = ref<string[]>([
//   'column0',
//   'productImage',
//   'productLength',
//   'productWidth',
//   'productHeight',
//   'productMaterial',
//   'containsBattery',
//   'competitorASIN',
//   'patentStatus',
//   'productManager',
//   'productDesign',
//   'photoSampleStatus',
//   'packingGroup',
//   'certificateUpload',
//   'skuMerge',
//   'action',
// ])
  let props = ref<string[]>([])
  // 每个字段的分组数据
//   let groupData = ref<any[][]>([
//     ['变体名1','变体名2'],
//     ['Image1.jpg', '25', '12', '1', '硅胶', 'No', 'ASIN1234', 'Patented', 'Manager1', 'Design1', 'Sample1', 'Yes', 'Certificate1.pdf', 'SKU1234'],
//     ['Image2.jpg', '25', '12', '1', '硅胶', 'No', 'ASIN1234', 'Patented', 'Manager1', 'Design1', 'Sample1', 'Yes', 'Certificate1.pdf', 'SKU1234'],
//   ])
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
console.log('columns', columns) //"变体1" "变体2"
const exchangeList = ref<any>([])

exchangeList.value = initData(rowData)
console.log('exchangeList', exchangeList.value)
const labelMap: Record<string, string> = {
  column0: '',
  productImage: '上传成套产品图片（产品要和实际一致）',
  productLength: '产品长(cm)',
  productWidth: '产品宽(cm)',
  productHeight: '产品高(cm)',
  productMaterial: '产品材质',
  containsBattery: '是否含电池（若有则填入电池类型）',
  competitorASIN: '对标竞品ASIN',
  patentStatus: '专利情况（是否排查以及结果）',
  productManager: '产品经理',
  productDesign: '产品设计',
  photoSampleStatus: '拍照留样情况',
  packingGroup: '打包小组每次打包都要拍照发微信群给产品经理检查',
  certificateUpload: '证书上传',
  skuMerge: '合并变体的SKU',
  operate: '操作',
}

const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 


if (!cell.children[0].children[0]
    || !cell.children[0].children[1]
    || !cell.children[0].children[0].classList
    || !cell.children[0].children[1].classList) {
  return
}
console.log(cell);
console.log(cell.children[0]);
console.log(cell.children[0].children[0]);

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
/**
 * 输入失焦事件
 */
const clickCancle = async (event: any, value: any) =>{

    const t1 = getRootElement(event["srcElement"],".cell").children[0]

    if (t1){
        if (t1.classList[0] !== "el-select") {
            t1.classList.add("none")
        }
    }

    const t2 = getRootElement(event["srcElement"],".cell").children[1]
    if (t2){
        t2.classList.remove("none")
    }
}

// 当点击保存的时候
const handleSave = () => {
    $baseMessage("当前信息已保存。","success","hey")
}
// 当点击保存并继续的时候
const handleSaveAndContinue = () => {
    $baseMessage("当前信息已保存。","success","hey")
    emit('change-step', 5)
    console.log('tableRef.value', tableRef.value);
    
}
// 当点击上一步的时候
const handleGoback = () => {
    emit('change-step', 3)
}
</script>

  
<style lang="scss" scoped>
.pay-button-group {
    display: block;
    margin: 20px auto;
    text-align: center;
}
// 控制编辑框显示与隐藏
.none {
  display: none;
}
</style>
  