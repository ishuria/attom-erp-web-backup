<template>
  <div class="comprehensive-table-container auto-height-container">
    <h2 style="text-align: center;">新供应商信息完善</h2>
    <el-table 
      ref="tableRef" 
      border :data="list" 
      :header-cell-style="{ 'text-align': 'center' }" 
      stripe
    >
      <el-table-column align="left" label="供应商全名" prop="suppliser" :width="flexColumnWidth(list, '供应商全名', 'suppliser')" />   
      <el-table-column label="税号" min-width="120" prop="taxNumber" />  
      <el-table-column label="地址" prop="address" :width="flexColumnWidth(list, '地址', 'address')" />
      <el-table-column align="center" label="开票电话"  min-width="100" prop="telephone" />
      <el-table-column label="开户银行" prop="bank" :width="flexColumnWidth(list, '开户银行', 'bank')"/>    
      <el-table-column label="开户账号"  min-width="120" prop="accountNumber" />
      <el-table-column label="联行号" min-width="100" prop="bankRoutingNumber"/>    
      <el-table-column align="center" label="联系人" min-width="100" prop="contactPerson"/>
      <el-table-column align="center" label="联系人电话" min-width="100" prop="contactNumber"/>    
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <el-table 
      ref="tableRef" 
      border :data="qualityInspectionList" 
      :header-cell-style="{ 'text-align': 'center' }" 
      stripe
      style="margin-top: 20px"
      >
        <el-table-column align="center" label="变体" prop="variant" width="140">
          <template #default="{ row }">
            <el-select v-model="row.variant" disabled placeholder="请选择变体" style="min-width: 100%;">
              <el-option
                v-for="item in variantsSelectStringList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="检查类型" min-width="30">
          <template #default="{ row }">
            <el-select v-model="row.checkType" disabled placeholder="请选择检查类型" style="min-width: 100%;">
              <el-option
                v-for="item in checkTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="打包注意事项" min-width="200" prop="packingPrecautions">
          <template #default="{ row }">
            <span>{{ row.packingPrecautions }}</span>
          </template>
        </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <div class="pay-button-group">
      <el-button @click="handleGoback">上一步</el-button>
      <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">下一步</el-button>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { flexColumnWidth } from '~/src/utils/tableColum'
import { checkTypeList } from '../indexCommon'
import {
  reviewStepNo3GetSelectVariantList,
  reviewStepNo4ListQualityInspection,
  reviewStepNo4SupplierList,
} from '/@/api/devlocal/orderProcess'
import { useTabsStore } from '/@/store/modules/tabs'
import type { IGetSelectVariantsList, IreviewStepNo4ListQualityInspection } from '/@/type/orderProcess/orderProcessType'
import { handleActivePath } from '/@/utils/routes'
import { convertString } from '/@/utils/stringUtils'
defineOptions({
    name: 'OrderCheckStep3',
})

const route: any = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore

const emit = defineEmits(['changeCheck-step'])
// const listLoading = ref<boolean>(true)
const list = ref<any>([])
// 查询下拉变体列表
const variantsSelectList = ref<IGetSelectVariantsList[]>([])
interface IGetSelectVariantsStringList {
    label: string
    value: string
}
// 转化后的下拉列表
const variantsSelectStringList = ref<IGetSelectVariantsStringList[]>([])
// 质检清单列表
const qualityInspectionList = ref<IreviewStepNo4ListQualityInspection[]>([])

// 当点击下一步的时候
const handleSaveAndContinue = async () => {
  emit('changeCheck-step', 3)
  await delVisitedRoute(handleActivePath(route, true))
  router.replace({ query: { ...route.query, stepNo: 3 }});
}
// 当点击上一步的时候
const handleGoback = () => {
    emit('changeCheck-step', 1)
}
const fetchQualityInspectionData = async () => {
    try {
        const { data } = await reviewStepNo4ListQualityInspection({ reviewId: parseInt(route.query.reviewId) })
        qualityInspectionList.value = data
        // 获取下拉变体列表
        const { data: variantSelectList }= await reviewStepNo3GetSelectVariantList({ reviewId: parseInt(route.query.reviewId) });
        variantsSelectList.value = variantSelectList
        // 转换为下拉框需要的数据格式
        // variantsSelectList.value.unshift({ id: -1, label: '所有' })
        // console.log(variantsSelectList.value);
        
        variantsSelectStringList.value = [
            { label: '所有', value: '-1' }, // 添加“所有”选项
            ...variantSelectList.map((item: any) => ({
                label: item.label,
                value: convertString(item.id)
            }))
        ];
    } catch (error) {
        console.error(error)
    }
}
const fetchNewSupplier = async () => {
    const { data } = await reviewStepNo4SupplierList({  reviewId: parseInt(route.query.reviewId) })
    list.value = data
}
onMounted(async () => {
    fetchQualityInspectionData()
    fetchNewSupplier()
})
</script>
  
<style lang="scss" scoped>
.pay-button-group {
    display: block;
    margin: 20px auto;
    text-align: center;
}
</style>
  