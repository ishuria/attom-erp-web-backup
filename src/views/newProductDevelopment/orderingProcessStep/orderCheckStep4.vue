<template>
  <div class="comprehensive-table-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center">
    <el-table
      ref="tableRef"
      border
      :data="exchangeList"
      :header-cell-style="{ 'text-align': 'center' }"
      :show-header="false"
      stripe
      style="width: auto; table-layout: fixed"
    >
      <!-- 第一列固定标签列 -->
      <el-table-column align="right" fixed :label="labelMap['column0']" :prop="'column0'" width="310">
        <template #default="{ row }">
          <strong style="color: var(--el-table-header-text-color)" v-html="labelMap[row['column0']]"></strong>
        </template>
      </el-table-column>

      <!-- 动态列 -->
      <el-table-column v-for="(prop, index) in columnsChange" :key="index" align="center" :label="prop" min-width="240" :prop="prop">
        <template #default="{ row }">
          <template v-if="row['column0'] === 'productImgUrl'">
            <div style="display: flex; align-items: center; justify-content: center; height: 100%">
              <el-image fit="fill" :src="row[prop]" style="display: block; width: 75px; height: 75px" @click="setPreviewImage(row[prop])">
                <template #error><el-icon /></template>
              </el-image>
            </div>
          </template>
          <template v-if="row['column0'] === 'sampleRetention'">
            <!-- <el-select v-model="row[prop]" disabled placeholder="请选择拍照留样情况">
              <el-option
                v-for="item in photoSampleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
            <div style="display: flex; flex-wrap: wrap; gap: 4px; justify-content: center">
              <el-tag v-for="id in row[prop]" :key="id" style="font-size: var(--el-font-size-base)" type="info">
                {{ packageSampleOption.find((item) => item.id === id)?.label }}
              </el-tag>
            </div>
          </template>
          <template v-if="row['column0'] === 'packingGroup'">
            <el-checkbox v-model="row[prop]" class="custom-checkbox" disabled :false-value="1" :true-value="0" />
          </template>
          <template v-if="row['column0'] === 'productPosition'">
            {{ productPositionOption.find((item) => item.id === row[prop])?.label }}
          </template>
          <template v-if="row['column0'] === 'oem'">
            <el-checkbox v-model="row[prop]" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
          </template>
          <template v-if="row['column0'] === 'graphicDesign'">
            <el-checkbox v-model="row[prop]" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
          </template>
          <template v-if="row['column0'] === 'magnetic'">
            <el-checkbox v-model="row[prop]" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
          </template>
          <template v-if="row['column0'] === 'woodenProduct'">
            <el-checkbox v-model="row[prop]" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
          </template>
          <template v-if="row['column0'] === 'toy'">
            <el-checkbox v-model="row[prop]" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
          </template>
          <template
            v-if="
              row['column0'] !== 'productImgUrl' &&
              row['column0'] !== 'sampleRetention' &&
              row['column0'] !== 'packingGroup' &&
              row['column0'] !== 'oem' &&
              row['column0'] !== 'productPosition' &&
              row['column0'] !== 'graphicDesign' &&
              row['column0'] !== 'magnetic' &&
              row['column0'] !== 'woodenProduct' &&
              row['column0'] !== 'toy'
            "
          >
            {{ row[prop] }}
          </template>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" min-width="200px" />
      </template>
    </el-table>
    <div class="pay-button-group">
      <el-button @click="handleGoBack">上一步</el-button>
      <el-button native-type="submit" type="primary" @click="handleSave">下一步</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { TableInstance } from 'element-plus'
import {
  getProductPositionList,
  getReviewVariantPackageSampleList,
  reviewGetSkuList,
  reviewProductManager,
  reviewStepNo3GetSelectVariantList,
} from '/@/api/devlocal/orderProcess'
import type { IGetSelectVariantsList } from '/@/type/orderProcess/orderProcessType'
import { _setStepNo } from '/@/utils/stepNoState'

defineOptions({
  name: 'OrderCheckStep4',
})

const route: any = useRoute()
const emit = defineEmits<{
  (e: 'changeCheck-step', value: number): void
  (e: 'update:imagePreviewVisible', value: boolean): void
  (e: 'update:previewListValue', value: string): void
}>()
// 查询下拉变体列表
const variantsSelectList = ref<IGetSelectVariantsList[]>([])
// const listLoading = ref<boolean>(true)

const tableRef = ref<TableInstance>()

const labelMap: Record<string, string> = {
  column0: '',
  productImgUrl: '上传成套产品图片<br>(产品要和实际一致)',
  productPosition: '产品定位',
  oem: 'OEM',
  graphicDesign: '平面设计',
  productLength: '产品长(cm)',
  productWidth: '产品宽(cm)',
  productHeight: '产品高(cm)',
  material: '产品材质',
  battery: '是否含电池<br>(若有则填入电池类型)',
  magnetic: '带磁',
  woodenProduct: '木制品',
  toy: '玩具',
  benchmarkAsin: '对标竞品ASIN',
  patent: '专利情况<br>(是否排查以及结果)',
  productManager: '产品经理',
  productDesign: '产品设计',
  procurementManager: '采购负责人',
  sampleRetention: '打包留样<br>(发布订货后系统自动增加数量和质检项)',
  packingGroup: '打包小组每次打包都要<br>拍照发微信群给产品经理检查',
  manufacturerEnName: '制造商英文名称<br>需认证产品必填(CPC/FCC/UL等)',
  certificateUpload: '证书上传',
  skuMerge: '合并变体的SKU',
}

const setPreviewImage = (url: string) => {
  emit('update:previewListValue', url)
  emit('update:imagePreviewVisible', true)
}

// 当点击保存的时候
const handleSave = async () => {
  emit('changeCheck-step', 4)
  _setStepNo(Number(route.query.reviewId), 4)
  // await delVisitedRoute(handleActivePath(route, true))
  // router.replace({ query: { ...route.query, stepNo: 4 }});
}

// 当点击上一步的时候
const handleGoBack = () => {
  emit('changeCheck-step', 2)
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
    for (let i = 0; i < props.value.length; i++) {
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
    },
  }
}
// 转换后的列的数据
let columnsChange: any

// 异步获取变体数据
const fetchVariantList = async () => {
  try {
    const { data: variantSelectList } = await reviewStepNo3GetSelectVariantList({ reviewId: route.query.reviewId })
    variantsSelectList.value = variantSelectList
    const { data: productManager } = await reviewProductManager({ reviewId: route.query.reviewId! })
    const { data } = await reviewGetSkuList({ reviewId: route.query.reviewId })
    skuVariantsData.value = data.map((item: any) => ({
      column0: '',
      productImgUrl: item.variantImg,
      productPosition: item.productPosition,
      oem: item.oem,
      graphicDesign: item.graphicDesign,
      productLength: item.productLength,
      productWidth: item.productWidth,
      productHeight: item.productHeight,
      material: item.material,
      battery: item.battery,
      magnetic: item.magnetic || 0,
      woodenProduct: item.woodenProduct || 0,
      toy: item.toy || 0,
      benchmarkAsin: item.benchmarkAsin,
      patent: item.patent,
      productManager: item.productManager === '' ? productManager : item.productManager,
      productDesign: item.productDesign,
      procurementManager: item.procurementManager,
      sampleRetention: item.sampleRetention.split(',').map(Number),
      packingGroup: item.checkStatus,
      manufacturerEnName: item.manufacturerEnName,
      certificateUpload: item.certificateUpload,
      skuMerge: item.variantSku,
      orderEntryId: undefined,
    }))
    skuVariantsData.value.forEach((item: any, index: number) => {
      if (index < variantSelectList.length) {
        const key = variantSelectList[index]
        item.column0 = key.label
        item.orderEntryId = key.id
      }
    })

    const { initData, columns } = useTableDataLineToColumn()
    columnsChange = columns
    exchangeList.value = initData(skuVariantsData.value)
    console.log(exchangeList.value)
  } catch (error) {
    console.error('Error fetching variant list:', error)
  }
}
const productPositionOption = ref<{ id: number; label: string }[]>([])
const packageSampleOption = ref<{ id: number; label: string }[]>([])
const fetchProductPositionOption = async () => {
  const { data } = await getProductPositionList()
  productPositionOption.value = data
}
const fetchPackagePositionOption = async () => {
  const { data } = await getReviewVariantPackageSampleList()
  packageSampleOption.value = data
}
onMounted(async () => {
  fetchProductPositionOption()
  fetchPackagePositionOption()
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

:deep(.el-table__body-wrapper tr:last-child) {
  display: none;
}

// 选中且不被禁用的样式
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中且被禁用的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
  background: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中后中间的 “✔” 的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}
</style>
