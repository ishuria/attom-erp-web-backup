<template>
    <div>
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
                width="260"
            >
                <template #default="{ row }">
                    <strong style="color: var(--el-table-header-text-color)" v-html="labelMap[row['column0']]"></strong>
                </template>
            </el-table-column>
            <el-table-column label="变体值相同" prop="variantsSame" align="center" width="110">
                <template #default="{row, $index}">
                    <template v-if="row['column0'] !== 'productImage'">
                        <el-checkbox v-model="variantsSame[$index - 1]" true-value="true" false-value="false" checked class="custom-checkbox">
                        </el-checkbox>
                    </template>
                </template>
            </el-table-column>
            <!-- 动态列 -->
            <el-table-column 
                v-for="(prop, index) in columnsChange" 
                :prop="prop" 
                :label="prop" 
                :key="index"
                align="center"
                min-width="180"
            >
                <template #default = "{row, $index}">
                    <template v-if="row['column0'] === 'productImgUrl'">
                        <el-upload 
                            list-type="picture-card" 
                            :file-list="row[prop].imgUrl" 
                            :class="{ hide: row[prop].hide }"
                            :http-request="uploadImage"
                        >
                            <div 
                                style="width: 75px; height: 75px; display: flex; align-items: center; justify-content: center;"
                                @click="handleIconClick(prop)"
                            >
                                <el-icon ><Plus /></el-icon>
                            </div>
                            <template #file="{ file }">
                                <div>
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions">
                                        <span
                                            class="el-upload-list__item-preview"
                                            @click="handlePictureCardPreview(file)"
                                        >
                                            <el-icon><zoom-in /></el-icon>
                                        </span>
                                        <span
                                            class="el-upload-list__item-delete"
                                            @click="handleRemove(file, prop)"
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
                            <el-input type="text" v-model="row[prop]" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                        </div>
                        <span>{{ row[prop] }}</span>
                    </template>
                    <template v-if="row['column0'] === 'productWidth'">
                        <div class="none">
                            <el-input type="text" v-model="row[prop]" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                        </div>
                        <span>{{ row[prop] }}</span>
                    </template>
                    <template v-if="row['column0'] === 'productHeight'">
                        <div class="none">
                            <el-input type="text" v-model="row[prop]" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                        </div>
                        <span>{{ row[prop] }}</span>
                    </template>
                    <template v-if="row['column0'] === 'material'">
                        <div class="none">
                            <el-input type="text" v-model="row[prop]" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                        </div>
                        <span>{{ row[prop] }}</span>
                    </template>
                    <template v-if="row['column0'] === 'battery'">
                        <div class="none">
                            <el-input type="text" v-model="row[prop]" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                        </div>
                        <span>{{ row[prop] }}</span> 
                    </template>
                    <template v-if="row['column0'] === 'benchmarkAsin'">
                        <div class="none">
                            <el-input type="text" v-model="row[prop]" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                        </div>
                        <span>{{ row[prop] }}</span> 
                    </template>
                    <template v-if="row['column0'] === 'patent'">
                        <div class="none">
                            <el-input type="text" v-model="row[prop]" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                        </div>
                        <span>{{ row[prop] }}</span> 
                    </template>
                    <template v-if="row['column0'] === 'productManager'">
                        <div class="none">
                            <el-input type="text" v-model="row[prop]" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                        </div>
                        <span>{{ row[prop] }}</span> 
                    </template>
                    <template v-if="row['column0'] === 'productDesign'">
                        <div class="none">
                            <el-input type="text" v-model="row[prop]" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                        </div>
                        <span>{{ row[prop] }}</span> 
                    </template>
                    <template v-if="row['column0'] === 'sampleRetentionStatus'">
                        <el-select v-model="row[prop]" placeholder="请选择拍照留样情况" @change="handleSampleRetentionStatus(prop)">
                            <el-option label="已有拍照样品,大货无需留样" value="0"></el-option>
                            <el-option label="大货需要留样拍照" value="1"></el-option>
                        </el-select>
                    </template>
                    <template v-if="row['column0'] === 'packingGroup'">
                        <el-checkbox v-model="row[prop]" :true-value="'0'" :false-value="'1'" class="custom-checkbox"></el-checkbox>
                    </template>
                    
                    <template v-if="row['column0'] === 'operate'">
                        <el-link type="primary" :underline="false">填入合并变体SKU的数据</el-link>
                    </template>
                </template>
                
            </el-table-column>
            <template #empty>
                <el-empty class="vab-data-empty" description="暂无数据" min-width="200px"/>
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
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { getRootElement, getSpecificChildren } from '/@/utils/nodeUtils';
import type { TableInstance, UploadFile } from 'element-plus'
import { reviewStepNo3GetSelectVariantList, reviewStepNo5SaveFv, reviewStepNo5SkuInfoPerfect, reviewStepNo5VariantImgDel, reviewStepNo5VariantImgUpload } from '/@/api/devlocal/orderProcess';
import { IGetSelectVariantsList, IreviewStepNo5SkuInfoPerfect } from '/@/type/orderProcess/orderProcessType';

const props = defineProps<{ step1Data: number }>()
// const props = defineProps({
//     formData: Object
// })
const emit = defineEmits<{ 
    (e: 'change-step', value: number): void
    (e: 'update:imagePreviewVisibale', value: boolean): void
    (e: 'update:priviewListValue', value: string): void
 }>()
// 查询下拉变体列表
const variantsSelectList = ref<IGetSelectVariantsList[]>([])
// const listLoading = ref<boolean>(true)


const tableRef = ref<TableInstance>()

const variantsSame = ref<boolean[]>([true, true, true, true, true, true, true, true, true, true, true, true, true, true,])

/**
 * 图片预览事件
 */
const handlePictureCardPreview = (file: UploadFile) => {
  emit("update:priviewListValue", file.url!)
  emit("update:imagePreviewVisibale", true)
}
// 点击图标的行的下标
const clickIconProp = ref<string>('')
/**
 * 点击添加图标事件
 */
const handleIconClick = (prop: string) => {
  // 获得点击列的变体名
  clickIconProp.value = prop
}
const imageForm = ref(new FormData()) as any;
async function uploadImage(params: any) {
  try {
    const prop = clickIconProp.value!;
    
    imageForm.value = new FormData();
    imageForm.value.append('file', params.file);
    imageForm.value.append('orderEntryId', exchangeList.value[14][prop]);

    // 上传图片
    const { data } = await reviewStepNo5VariantImgUpload(imageForm.value);
    // 确保 data 是有效的图片 URL
    if (!data) {
      throw new Error('上传图片失败');
    }
    
    exchangeList.value[0][prop].imgUrl = [{ url: data}] 
    exchangeList.value[0][prop].hide = true
    // 提示成功信息
    $baseMessage('图片上传成功!', 'success', 'hey');
    
  } catch (error) {
    console.error(error);
    $baseMessage('图片上传失败!', 'error', 'hey');
  }
}

/**
 * 图片删除功能
 */
 const handleRemove = async (file: UploadFile, prop: any) => {
    try {
        $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{
            const { data } = await reviewStepNo5VariantImgDel({ orderEntryId: exchangeList.value[14][prop]})
            if (data === true) {
                $baseMessage("此产品图片信息删除成功!", "success", "hey");
                exchangeList.value[0][prop].imgUrl = [] 
                exchangeList.value[0][prop].hide = false
            }
        })
        
    } catch (error) {
        console.error(error)
    }
}

const labelMap: Record<string, string> = {
  column0: '',
  productImgUrl: '上传成套产品图片<br>(产品要和实际一致)',
  productLength: '产品长(cm)',
  productWidth: '产品宽(cm)',
  productHeight: '产品高(cm)',
  material: '产品材质',
  battery: '是否含电池<br>(若有则填入电池类型)',
  benchmarkAsin: '对标竞品ASIN',
  patent: '专利情况<br>(是否排查以及结果)',
  productManager: '产品经理',
  productDesign: '产品设计',
  sampleRetentionStatus: '拍照留样情况',
  packingGroup: '打包小组每次打包都要<br>拍照发微信群给产品经理检查',
  certificateUpload: '证书上传',
  skuMerge: '合并变体的SKU',
  operate: '操作',
}
const variantsSameMap: Record<string, boolean> = {
  productLength: true,
  productWidth: true,
  productHeight: true,
  productMaterial: true,
  containsBattery: true,
  competitorASIN: true,
  patentStatus: true,
  productManager: true,
  productDesign: true,
  photoSampleStatus: true,
  packingGroup: true,
  certificateUpload: true,
  skuMerge: true,
  operate: true,
}
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
      inputElement.select()
  } else {
    const textareaElement = getSpecificChildren(cell, "textarea")[0];
    if (textareaElement){
      textareaElement.focus()
      textareaElement.select()
    }
  }
}
/**
 * 输入失焦事件
 */
const clickCancle = async (event: any, prop: any) =>{

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
    if (event.type === 'blur') {
        // 执行失去焦点处理逻辑
        await reviewStepNo5SkuInfoPerfect({
          productLength: exchangeList.value[1][prop],
          productWidth: exchangeList.value[2][prop],
          productHeight: exchangeList.value[3][prop],
          material: exchangeList.value[4][prop],
          battery: exchangeList.value[5][prop],
          benchmarkAsin: exchangeList.value[6][prop],
          patent: exchangeList.value[7][prop],
          productManager: exchangeList.value[8][prop],
          productDesign: exchangeList.value[9][prop],
          sampleRetentionStatus: exchangeList.value[10][prop],
          orderEntryId: exchangeList.value[14][prop],
        })
    }
}
// 修改拍照留样情况
const handleSampleRetentionStatus = async (prop: any) => {
  await reviewStepNo5SkuInfoPerfect({
          productLength: exchangeList.value[1][prop],
          productWidth: exchangeList.value[2][prop],
          productHeight: exchangeList.value[3][prop],
          material: exchangeList.value[4][prop],
          battery: exchangeList.value[5][prop],
          benchmarkAsin: exchangeList.value[6][prop],
          patent: exchangeList.value[7][prop],
          productManager: exchangeList.value[8][prop],
          productDesign: exchangeList.value[9][prop],
          sampleRetentionStatus: exchangeList.value[10][prop],
          orderEntryId: exchangeList.value[14][prop],
        })
}
// 当点击保存的时候
const handleSave = async () => {
  try {
    const { data } = await reviewStepNo5SaveFv({ reviewId: props.step1Data })
    if (data === true) {
      $baseMessage("当前信息已保存。","success","hey")
    }
  } catch (error) {
    console.error(error)
  }
}
// 当点击保存并继续的时候
const handleSaveAndContinue = async () => {
  try {
    const { data } = await reviewStepNo5SaveFv({ reviewId: props.step1Data })
    if (data === true) {
      $baseMessage("当前信息已保存。","success","hey")
      emit('change-step', 5)
    }
  } catch (error) {
    console.error(error)
  }
}
// 当点击上一步的时候
const handleGoback = () => {
    emit('change-step', 3)
}

// 表格原始数据
const skuVariantsData = ref<any>([]) 
// 转换后的表格数据
const exchangeList = ref<any>([]) 
// 表格行转换成列的函数
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
    const list: any = []
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
  const initGroup = (list: any) => {
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
    initData: (data: any) => {
      // 初始化分组
      initGroup(data)
      // 向分组加入数据
      dataToGroupByKey(data)
      // 初始化分组内的数据，转为列数据
      return changeGroupData()
    }
  }
}
// 转换后的列的数据
let columnsChange: any
// 异步获取变体数据
const fetchVariantList = async () => {
  try {
    const { data: variantSelectList } = await reviewStepNo3GetSelectVariantList({ reviewId: props.step1Data });
    variantsSelectList.value = variantSelectList;

    skuVariantsData.value = variantSelectList.map((item: any) => ({
      column0: item.label,
      productImgUrl: { hide: false, imgUrl: []},
      productLength: undefined,
      productWidth: undefined,
      productHeight: undefined,
      material: '',
      battery: '',
      benchmarkAsin: '',
      patent: '',
      productManager: '',
      productDesign: '',
      sampleRetentionStatus: '',
      packingGroup: '0',
      certificateUpload: '',
      skuMerge: '',
      operate: '操作',
      orderEntryId: item.id,
    }));
    
    const { initData, columns } = useTableDataLineToColumn();
    columnsChange = columns 
    exchangeList.value = initData(skuVariantsData.value);
    
  } catch (error) {
    console.error('Error fetching variant list:', error);
  }
};
onMounted(async () => {
  fetchVariantList()
})
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
.custom-checkbox {
  transform: scale(1.3); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
// 控制添加图片图标显示与隐藏
.hide :deep(.el-upload--picture-card) {
  display: none
}
:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 75px;
  height: 75px;
  margin: 0 8px 0 0;
  transition: none;
}
:deep(.el-upload--picture-card) {
  width: 75px;
  height: 75px;
}
:deep(.el-table__body-wrapper tr:last-child ){
  display: none;
}
</style>
  