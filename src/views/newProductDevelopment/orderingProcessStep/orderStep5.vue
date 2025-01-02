<template>
  <div class="comprehensive-table-container" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
    <el-table 
        ref="tableRef"
        :data="exchangeList" 
        border stripe
        :header-cell-style="{ 'text-align': 'center' }"
        @cell-click="changeInput"
        style="width: auto; table-layout: fixed;"
    >
        <!-- 第一列固定标签列 -->
        <el-table-column 
            :prop="'column0'" 
            :label="labelMap['column0']" 
            fixed 
            align="right"
            width="240"
        >
            <template #default="{ row }">
                <strong style="color: var(--el-table-header-text-color)" v-html="labelMap[row['column0']]"></strong>
            </template>
        </el-table-column>
        <el-table-column label="变体值相同" align="center" width="110">
            <template #default="{row, $index}">
                <template v-if="row['column0'] !== 'productImgUrl'">
                    <el-checkbox v-model="row.variantsSame" class="custom-checkbox" @change="handleVariantsSame(row, $index)">
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
            min-width="260"
            
        >
            <template #default = "{row, $index}">
                <template v-if="row['column0'] === 'productImgUrl'">
                  <el-upload 
                        list-type="picture-card" 
                        :file-list="row[prop].imgUrl" 
                        :class="{ hide: row[prop].hide }"
                        :http-request="(file) => uploadImage(file, row, prop)"
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
                        <el-input type="text" v-model="row[prop]" @input="handleInputChange(row, prop)" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                    </div>
                    <span>{{ row[prop] }}</span>
                </template>
                <template v-if="row['column0'] === 'productWidth'">
                    <div class="none">
                        <el-input type="text" v-model="row[prop]" @input="handleInputChange(row, prop)" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                    </div>
                    <span>{{ row[prop] }}</span>
                </template>
                <template v-if="row['column0'] === 'productHeight'">
                    <div class="none">
                        <el-input type="text" v-model="row[prop]" @input="handleInputChange(row, prop)" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                    </div>
                    <span>{{ row[prop] }}</span>
                </template>
                <template v-if="row['column0'] === 'material'">
                    <div class="none">
                        <el-input type="text" v-model="row[prop]" @input="handleInputChange(row, prop)" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                    </div>
                    <span>{{ row[prop] }}</span>
                </template>
                <template v-if="row['column0'] === 'battery'">
                    <div class="none">
                        <el-input type="text" v-model="row[prop]" @input="handleInputChange(row, prop)" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                    </div>
                    <span>{{ row[prop] }}</span> 
                </template>
                <template v-if="row['column0'] === 'benchmarkAsin'">
                    <div class="none">
                        <el-input type="text" v-model="row[prop]" @input="handleInputChange(row, prop)" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                    </div>
                    <span>{{ row[prop] }}</span> 
                </template>
                <template v-if="row['column0'] === 'patent'">
                    <div class="none">
                        <el-input type="text" v-model="row[prop]" @input="handleInputChange(row, prop)" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                    </div>
                    <span>{{ row[prop] }}</span> 
                </template>
                <template v-if="row['column0'] === 'productManager'">
                    <!-- <div class="none">
                        <el-input type="text" v-model="row[prop]" filterable @input="handleInputChange(row, prop)" @keyup.enter="clickCancle($event, prop)" @blur="clickCancle($event, prop)" />
                      </div>
                    <span>{{ row[prop] }}</span>  -->
                    <el-select
                      v-model="row[prop]"
                      filterable
                      remote
                      default-first-option
                      placeholder="点击输入和搜索"
                      :remote-method="remotePeopleMethod"
                      :loading="peopleLoading"
                      @change="handleSampleRetentionStatus(row, prop)"
                      clearable
                      class="center-input"
                    >
                        <el-option
                            v-for="item in peopleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </template>
                <template v-if="row['column0'] === 'productDesign'">
                    <el-select
                      v-model="row[prop]"
                      filterable
                      remote
                      default-first-option
                      placeholder="点击输入和搜索"
                      :remote-method="remotePeopleMethod"
                      :loading="peopleLoading"
                      @change="handleSampleRetentionStatus(row, prop)"
                      clearable
                      class="center-input"
                    >
                        <el-option
                            v-for="item in peopleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </template>
                <template v-if="row['column0'] === 'sampleRetentionStatus'">
                    
                      <el-select v-model="row[prop]" placeholder="请选择拍照留样情况" @change="handleSampleRetentionStatus(row, prop)" class="center-select">
                      <el-option 
                        v-for="item in photoSampleOptions"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value"
                      >
                      </el-option>
                    </el-select>
                    
                </template>
                <template v-if="row['column0'] === 'packingGroup'">
                    <el-checkbox v-model="row[prop]" :true-value="1" :false-value="0" class="custom-checkbox" @change="handlePackingUpdate(row, prop)"></el-checkbox>
                </template>
                
                <template v-if="row['column0'] === 'operate'">
                    <el-link type="primary" :underline="false" @click="handleInsertSku(row, prop)">导入合并变体SKU的数据</el-link>
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
import type { TableInstance, UploadFile } from 'element-plus'
import { reviewGetSkuList, reviewInsertSkuInfo, reviewProductManager, reviewStepNo3GetSelectVariantList, reviewStepNo5SaveFv, reviewStepNo5SkuInfoPerfect, reviewStepNo5VariantImgDel, reviewStepNo5VariantImgUpload } from '/@/api/devlocal/orderProcess'
import { getAllName } from '/@/api/devlocal/user'
import { useTabsStore } from '/@/store/modules/tabs'
import { IGetSelectVariantsList } from '/@/type/orderProcess/orderProcessType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { handleActivePath } from '/@/utils/routes'

const route: any = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore

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
  const peopleLoading = ref(false) //搜索产品经理和产品设计loading
const peopleOptions = ref<any[]>([]) //搜索选项
const peopleList = ref<any[]>([]) //搜索列表
const remotePeopleMethod = async (query: string) => {
  if (query) {
    const { data } = await getAllName({
        name: query
    })

    peopleList.value = data.map((item: any) => {
        return { value: item.userId, label: item.userName }
    })
    peopleLoading.value = true
    setTimeout(() => {
        peopleLoading.value = false
        peopleOptions.value = peopleList.value.filter((item) => {
            return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    peopleOptions.value = []
  }
}
const handleInsertSku = async (row: any, prop: string) => {
  // console.log(row);
  // console.log(prop);
  try {
  const { data, code } = await reviewInsertSkuInfo({ sku: exchangeList.value[13][prop] })
    if (data) {
      exchangeList.value[1][prop] = data.productLength
      exchangeList.value[2][prop] = data.productWidth
      exchangeList.value[3][prop] = data.productHeight
      exchangeList.value[4][prop] = data.material
      exchangeList.value[5][prop] = data.battery
      exchangeList.value[6][prop] = data.benchmarkAsin
      await reviewStepNo5SkuInfoPerfect({
        productLength: exchangeList.value[1][prop],
        productWidth: exchangeList.value[2][prop],
        productHeight: exchangeList.value[3][prop],
        material: exchangeList.value[4][prop],
        battery: exchangeList.value[5][prop],
        benchmarkAsin: exchangeList.value[6][prop],
        orderEntryId: exchangeList.value[15][prop],
      })
      $baseMessage('导入该SKU数据成功', 'success', 'hey')
    }
  } catch (error) {
    console.error(error)
  }
}

const tableRef = ref<TableInstance>()
const photoSampleOptions = [
    { label: '已有拍照样品,大货无需留样', value: 0 },
    { label: '大货需要留样拍照', value: 1 }
];
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
async function uploadImage(params: any, row: any, _prop: any) {
  try {
    row[_prop].hide = true
   
    
    imageForm.value = new FormData();
    imageForm.value.append('file', params.file);
    imageForm.value.append('orderEntryId', exchangeList.value[15][_prop]);

    // 上传图片
    const { data } = await reviewStepNo5VariantImgUpload(imageForm.value);
    // 确保 data 是有效的图片 URL
    if (!data) {
      throw new Error('上传图片失败');
    }
    row[_prop].imgUrl = [{ url: data}] 
    
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
      const { data } = await reviewStepNo5VariantImgDel({ orderEntryId: exchangeList.value[15][prop]})
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
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 

  const firstChild = cell?.children[0]?.children[0];
  const secondChild = cell?.children[0]?.children[1];

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return;
  }

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none');
    secondChild.classList.add('none');

    focusAndSelectInput(cell);
  }
}
// 处理变体值相同
const handleVariantsSame = (row: any, index: number) => { //变体值相同的值改变的时候,也要检查是否更改
  const values = Object.values(row).filter(value => value !== null && value !== undefined && value !== '' && value !== row.variantsSame && value !== row.column0);
  if (row.variantsSame) {
    // console.log(values)
    // 如果有值，
    if (values.length === 1) {
      // 更新所有非空单元格的值
      Object.keys(row).forEach(key => {
        if (key !== 'column0' && key !== 'variantsSame') {
          row[key] = values[0];
        }
      });
    } else if (values.length > 1) {
      
      let valuesResult = values.every( item => item === values[0] );
      if (!valuesResult) {
        row.variantsSame = false
        $baseMessage('当前多个变体值不同，无法勾选。', 'error', 'hey')
      } else if(valuesResult){
        row.variantsSame = true
        Object.keys(row).forEach(key => {
          if (key !== 'column0' && key !== 'variantsSame') {
            row[key] = values[0];
            const update = async () => {
              await reviewStepNo5SkuInfoPerfect({
                productLength: exchangeList.value[1][key],
                productWidth: exchangeList.value[2][key],
                productHeight: exchangeList.value[3][key],
                material: exchangeList.value[4][key],
                battery: exchangeList.value[5][key],
                benchmarkAsin: exchangeList.value[6][key],
                patent: exchangeList.value[7][key],
                productManagerId: exchangeList.value[8][key],
                productDesignId: exchangeList.value[9][key],
                sampleRetentionStatus: exchangeList.value[10][key],
                checkStatus: exchangeList.value[11][key],
                orderEntryId: exchangeList.value[15][key],
              })
            }
            update()
          }
        });
      }
    }
  }
  return row.variantsSame;
};
const syncVariantValues = (row: any) => { //默认勾选,如果当前行1个单元格只填了1个值，则该行其他单元格都填入该值。
  const values = Object.values(row).filter(value => value !== null && value !== undefined && value !== '' && value !== row.variantsSame && value !== row.column0);
  // console.log(values[0]);
  
  if (values.length === 1) {
    Object.keys(row).forEach(key => {
      if (key !== 'column0' && key !== 'variantsSame') {
        row[key] = values[0];
      }
    });
  } else if(values.length > 1) {
    let valuesResult = values.every( item => item === values[0] );
      if (!valuesResult) {
        row.variantsSame = false
      } else if(valuesResult){
        row.variantsSame = true
      }
  }
  // console.log(row);
};

const handleInputChange = async (row: any, prop: string) => {
  if (row.variantsSame) {
    // 获取当前输入框的值
    const newValue = row[prop];

    // 确保新值非空
    if (newValue !== null && newValue !== undefined && newValue !== '') {
      Object.keys(row).forEach(async key => {
        if (key !== 'column0' && key !== 'variantsSame' && key !== prop) {
          row[key] = newValue; // 将其他单元格的值更新为当前输入框的值
          const update = async () => {
            await reviewStepNo5SkuInfoPerfect({
              productLength: exchangeList.value[1][key],
              productWidth: exchangeList.value[2][key],
              productHeight: exchangeList.value[3][key],
              material: exchangeList.value[4][key],
              battery: exchangeList.value[5][key],
              benchmarkAsin: exchangeList.value[6][key],
              patent: exchangeList.value[7][key],
              productManagerId: exchangeList.value[8][key],
              productDesignId: exchangeList.value[9][key],
              sampleRetentionStatus: exchangeList.value[10][key],
              checkStatus: exchangeList.value[11][key],
              orderEntryId: exchangeList.value[15][key],
            })
          }
          update()
        }
      
      });
    }
  }
};
/**
 * 输入失焦事件
 */
const clickCancle = async (event: any, prop: any) =>{

    const rootElement = getRootElement(event.srcElement, ".cell");

    if (rootElement) {
      const t1 = rootElement.children[0];
      const t2 = rootElement.children[1];

      if (t1) {
        if (t1.classList[0] !== 'el-select') {
          t1.classList.add("none");
        }
      }
      if (t2) t2.classList.remove("none");
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
          productManagerId: exchangeList.value[8][prop],
          productDesignId: exchangeList.value[9][prop],
          sampleRetentionStatus: exchangeList.value[10][prop],
          checkStatus: exchangeList.value[11][prop],
          orderEntryId: exchangeList.value[15][prop],
        })
    }
}
// 修改打包小组
const handlePackingUpdate = async (row: any, prop: any) => {
  if (row.variantsSame) {
    // 获取当前输入框的值
    const newValue = row[prop];
    // 确保新值非空
    if (newValue !== null && newValue !== undefined && newValue !== '') {
      Object.keys(row).forEach(async key => {
        if (key !== 'column0' && key !== 'variantsSame') {
          row[key] = newValue; // 将其他单元格的值更新为当前输入框的值
          const update = async () => {
            await reviewStepNo5SkuInfoPerfect({
              checkStatus: parseInt(exchangeList.value[11][key]),
              orderEntryId: exchangeList.value[15][key],
            })
          }
          update()
        }
      })
    }

  }else {
    await reviewStepNo5SkuInfoPerfect({
      productLength: exchangeList.value[1][prop],
      productWidth: exchangeList.value[2][prop],
      productHeight: exchangeList.value[3][prop],
      material: exchangeList.value[4][prop],
      battery: exchangeList.value[5][prop],
      benchmarkAsin: exchangeList.value[6][prop],
      patent: exchangeList.value[7][prop],
      productManagerId: exchangeList.value[8][prop],
      productDesignId: exchangeList.value[9][prop],
      sampleRetentionStatus: exchangeList.value[10][prop],
      checkStatus: exchangeList.value[11][prop],
      orderEntryId: exchangeList.value[15][prop],
    })
  }
}
// 修改拍照留样情况
const handleSampleRetentionStatus = async (row: any, prop: any) => {
  if (row.variantsSame) {
    // 获取当前输入框的值
    const newValue = row[prop];  
    // 确保新值非空
    if (newValue !== null && newValue !== undefined && newValue !== '') {
      Object.keys(row).forEach(async key => {
        if (key !== 'column0' && key !== 'variantsSame') {
          row[key] = newValue; // 将其他单元格的值更新为当前输入框的值
          const update = async () => {
            await reviewStepNo5SkuInfoPerfect({
              productLength: exchangeList.value[1][key],
              productWidth: exchangeList.value[2][key],
              productHeight: exchangeList.value[3][key],
              material: exchangeList.value[4][key],
              battery: exchangeList.value[5][key],
              benchmarkAsin: exchangeList.value[6][key],
              patent: exchangeList.value[7][key],
              productManagerId: exchangeList.value[8][key],
              productDesignId: exchangeList.value[9][key],
              sampleRetentionStatus: exchangeList.value[10][key],
              checkStatus: exchangeList.value[11][key],
              orderEntryId: exchangeList.value[15][key],
            })
          }
          update()
        } 
      })
    }
  } else {
    await reviewStepNo5SkuInfoPerfect({
      productLength: exchangeList.value[1][prop],
      productWidth: exchangeList.value[2][prop],
      productHeight: exchangeList.value[3][prop],
      material: exchangeList.value[4][prop],
      battery: exchangeList.value[5][prop],
      benchmarkAsin: exchangeList.value[6][prop],
      patent: exchangeList.value[7][prop],
      productManagerId: exchangeList.value[8][prop],
      productDesignId: exchangeList.value[9][prop],
      sampleRetentionStatus: exchangeList.value[10][prop],
      checkStatus: exchangeList.value[11][prop],
      orderEntryId: exchangeList.value[15][prop],
    })
  }
}
// 当点击保存的时候
const handleSave = async () => {
  let classReviewId: number | undefined
  if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
      classReviewId = props.step1Data
  } else {
      classReviewId = route.query.reviewId
  }
  try {
    const { data } = await reviewStepNo5SaveFv({ reviewId: classReviewId! })
    if (data === true) {
      $baseMessage("当前信息已保存。", "success", "hey")
      await delVisitedRoute(handleActivePath(route, true))
      const {...query} = route.query;
      router.replace({query: {...query, stepNo: 4}});
    }
  } catch (error) {
    console.error(error)
  }
}

// 当点击保存并继续的时候
const handleSaveAndContinue = async () => {
  let classReviewId: number | undefined
  if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
      classReviewId = props.step1Data
  } else {
      classReviewId = route.query.reviewId
  }
  try {
    const { data } = await reviewStepNo5SaveFv({ reviewId: classReviewId! })
    if (data === true) {
      $baseMessage("当前信息已保存。","success","hey")
      emit('change-step', 5)
      if (route.query.reviewId) {
        await delVisitedRoute(handleActivePath(route, true))

        const {...query} = route.query;
        router.replace({query: {...query, stepNo: 5}});
      }
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
  let classReviewId: number | undefined
  if (route.query.progressId) { //说明是订大货进去的,接受上一步传来的reviewId
      classReviewId = props.step1Data
  } else {
      classReviewId = route.query.reviewId
  }
  try {
    const { data: variantSelectList } = await reviewStepNo3GetSelectVariantList({ reviewId: classReviewId! });
    variantsSelectList.value = variantSelectList;
    const { data } = await reviewGetSkuList({ reviewId: classReviewId! })
    // console.log(data);
    const { data: productManager } = await reviewProductManager({reviewId: classReviewId! })
    // console.log(productManager);
    skuVariantsData.value = data.map((item: any) => {
      if (item.variantImg === "") {
        return {
          column0: '',
          productImgUrl: { hide: false, imgUrl: []},
          productLength: item.productLength,
          productWidth: item.productWidth,
          productHeight: item.productHeight,
          material: item.material,
          battery: item.battery,
          benchmarkAsin: item.benchmarkAsin,
          patent: item.patent,
          productManager: productManager,
          productDesign: item.productDesign,
          sampleRetentionStatus: item.sampleRetentionStatus,
          packingGroup: item.checkStatus,
          certificateUpload: item.certificateUpload,
          skuMerge: item.variantSku,
          operate: '操作',
          orderEntryId: undefined,
        }
      } else {
          return {
            column0: '',
            productImgUrl: { hide: true, imgUrl: [{ url: item.variantImg}]},
            productLength: item.productLength,
            productWidth: item.productWidth,
            productHeight: item.productHeight,
            material: item.material,
            battery: item.battery,
            benchmarkAsin: item.benchmarkAsin,
            patent: item.patent,
            productManager: productManager,
            productDesign: item.productDesign,
            sampleRetentionStatus: item.sampleRetentionStatus,
            packingGroup: item.checkStatus,
            certificateUpload: item.certificateUpload,
            skuMerge: item.variantSku,
            operate: '操作',
            orderEntryId: undefined,
          }
      }
    })
    skuVariantsData.value.forEach((item: any, index: number) => {
      if (index < variantSelectList.length) {
        const key = variantSelectList[index];
        item.column0 = key.label;
        item.orderEntryId = key.id;
      }
    })  
    // console.log(skuVariantsData.value);
    
    const { initData, columns } = useTableDataLineToColumn();
    columnsChange = columns 
    exchangeList.value = initData(skuVariantsData.value);
    exchangeList.value.forEach((item: any) => {
      item.variantsSame = true
      if (item.column0 !== 'productImgUrl') {
        syncVariantValues(item)
      }
    })
    // console.log(exchangeList.value);

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
// .el-select-dropdown__item {
//   text-align: center;
// }
:deep(.center-select) {
 text-align: center;
 text-align-last: center;
}
:deep(.center-input) {
 text-align: center;
 text-align-last: center;
}
// 设置清除键不跳动
:deep(.el-select__wrapper) {
  position: relative;
  .el-select__inner {
    padding-right: 18px;
  }
  .el-select__suffix {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
