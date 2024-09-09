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

      <h2 style="text-align: center;">质检项目清单（打包注意事项和质检报告）</h2>
      <vab-query-form>
            <vab-query-form-left-panel>
                <el-button type="primary">新增</el-button>
                <el-button type="primary">读取</el-button>
            </vab-query-form-left-panel>
        </vab-query-form>
      <el-table 
            ref="tableRef" 

            stripe border 
            :data="list" 
            :header-cell-style="{ 'text-align': 'center' }"
         
        >
            <el-table-column label="变体" min-width="100" prop="currency">
                <template #default="{ row }">
                    <el-select v-model="row.currency" placeholder="请选择货币"  style="min-width: 11px;">
                        
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="检查类型" min-width="127">
                <template #default="{ row }">
                    <el-select v-model="row.site" placeholder="请选择站点"  style="min-width: 15px;">
                       
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="打包注意事项" min-width="200">
                    <template #default="{ row }">
                        <!-- <span>{{siteReflectCurrencyAndExchangeRate.get(row.site)}}</span> -->

                    </template>
                </el-table-column>

       
            <el-table-column align="center" fixed="right" label="操作" width="120">
                <template #default="{ row }">
                    <el-link type="primary" :underline="false">删除</el-link>
                </template>
            </el-table-column>
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
    name: 'OrderStep4',
})

const emit = defineEmits(['change-step'])
// const listLoading = ref<boolean>(true)
const list = ref<any>([])

// 当点击保存的时候
const handleSave = () => {
    $baseMessage("当前信息已保存。","success","hey")
}
// 当点击保存并继续的时候
const handleSaveAndContinue = () => {
    $baseMessage("当前信息已保存。","success","hey")
    emit('change-step', 4)
}
// 当点击上一步的时候
const handleGoback = () => {
    emit('change-step', 2)
}
</script>
  
<style lang="scss" scoped>
.pay-button-group {
    display: block;
    margin: 20px auto;
    text-align: center;
}
</style>
  