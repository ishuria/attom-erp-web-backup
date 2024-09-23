<template>
    <div class="comprehensive-table-container auto-height-container">
        <h2 style="text-align: center;">供应商信息完善</h2>
        <el-table 
            ref="tableRef" 
            stripe border 
            :data="list" 
            :header-cell-style="{ 'text-align': 'center' }"

        >
            <el-table-column label="供应商全名" align="center" min-width="120" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>   
            <el-table-column label="税号" min-width="120" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>  
            <el-table-column label="地址"  min-width="160" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>
            <el-table-column label="开票电话"  min-width="100" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>
            <el-table-column label="开户银行"  min-width="120" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>    
            <el-table-column label="开户账号"  min-width="120" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>
            <el-table-column label="联行号" prop="createTime" align="center" min-width="100">
                <template #default = "{ row }">
                <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
                </template>
            </el-table-column>    
            <el-table-column label="联系人" prop="createTime" align="center" min-width="100">
                <template #default = "{ row }">
                <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="联系人电话" prop="componentName" min-width="100">
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>    
            
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>

      <el-table 
            ref="tableRef" 

            stripe border 
            :data="qualityInspectionList" 
            :header-cell-style="{ 'text-align': 'center' }"
            style="margin-top: 20px"
        >
            <el-table-column label="变体" width="140" prop="variant" align="center">
                <template #default="{ row, $index }">
                    <el-select v-model="row.variant" placeholder="请选择变体" style="min-width: 100%;" disabled>
                        <el-option
                            v-for="item in variantsSelectStringList"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="检查类型" min-width="30" align="center">
                <template #default="{ row, $index }">
                        <el-select v-model="row.checkType" placeholder="请选择检查类型" style="min-width: 100%;" disabled>
                            <el-option
                                v-for="item in checkTypeList"
                                :label="item.label"
                                :value="item.value"
                                :key="item.value"
                            ></el-option>
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
defineOptions({
    name: 'OrderCheckStep3',
})
import { convertString } from '~/src/utils/stringUtils';
import { checkTypeList } from '../indexCommon';
import { 
    reviewStepNo4ListQualityInspection,
    reviewStepNo3GetSelectVariantList,
} from '/@/api/devlocal/orderProcess';
import { IreviewStepNo4ListQualityInspection, IGetSelectVariantsList } from '/@/type/orderProcess/orderProcessType';

const route: any = useRoute()
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
const handleSaveAndContinue = () => {
    emit('changeCheck-step', 3)
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
onMounted(async () => {
    fetchQualityInspectionData()
})
</script>
  
<style lang="scss" scoped>
.pay-button-group {
    display: block;
    margin: 20px auto;
    text-align: center;
}
</style>
  