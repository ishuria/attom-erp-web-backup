<template>
    <div class="comprehensive-table-container auto-height-container">
        <vab-query-form>
            <vab-query-form-left-panel>
                <el-button type="primary">新增</el-button>
                <el-button type="primary">添加零件</el-button>
                <el-button type="primary">添加耗材</el-button>
            </vab-query-form-left-panel>
        </vab-query-form>
        <el-table 
            ref="tableRef" 
            stripe border 
            :data="list" 
            :header-cell-style="{ 'text-align': 'center' }"
            height="270"
        >
            <el-table-column align="center" label="属于变体" min-width="120" prop="currency">
                <template #default="{ row }">
                    <el-select v-model="row.currency" placeholder="请选择货币"  style="min-width: 11px;">
                        
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column align="center" label="零件图片" min-width="100">
                <template #default="{ row }">
                    <el-image style="width: 75px; height: 75px" :src="row.componentImg" fit="fill" />
                </template>
            </el-table-column>
            <el-table-column label="零件ID" align="center" min-width="70" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>   
            <el-table-column label="零件名" min-width="160" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>  
            <el-table-column label="每个SKU需要数量"  min-width="90" prop="componentName" >
                <template #header>
                    每个SKU<br>需要数量
                </template>
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>
            <el-table-column label="单位"  min-width="60" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>
            <el-table-column label="出厂单价"  min-width="70" prop="componentName" >
                <template #header>
                    出厂<br>单价
                </template>
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>    
            <el-table-column label="出厂总价"  min-width="70" prop="componentName" >
                <template #header>
                    出厂<br>总价
                </template>
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>
            <el-table-column label="每个SKU运费(含税)" prop="createTime" align="center" min-width="100">
                <template #header>
                    每个SKU<br>运费(含税)
                </template>
                <template #default = "{ row }">
                <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
                </template>
            </el-table-column>    
            <el-table-column label="总未税价" prop="createTime" align="center" min-width="70">
                <template #header>
                    总未<br>税价
                </template>
                <template #default = "{ row }">
                <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="总含税价" prop="componentName" min-width="70">
                <template #header>
                    总含<br>税价
                </template>
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>    
            <el-table-column label="货币" prop="oem" align="center" min-width="60">
                <template #default = "{ row }">
                    <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 11px;">
                        
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="起订量" prop="createTime" align="center" min-width="100">
                <template #default = "{ row }">
                <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
                </template>
            </el-table-column> 
            <el-table-column label="整箱数" prop="createTime" align="center" min-width="100">
                <template #default = "{ row }">
                <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
                </template>
            </el-table-column> 
            <el-table-column align="center" label="供应商" min-width="140">
                <template #default="{ row }">
                    
                </template>
            </el-table-column>
            <el-table-column label="开票" prop="oem" align="center" width="60">
                <template #default = "{ row }">
                    <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 11px;">
                        
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column  label="实际税点" prop="actualTaxRate" min-width="60">
                <template #header>
                    实际<br>税点
                </template>
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.actualTaxRate" />
                    </div>
                    <span>{{ row.actualTaxRate }}</span>
                </template>
            </el-table-column>

            <el-table-column  label="开票税点" prop="invoicingTaxRate" min-width="60">
                <template #header>
                    开票<br>税点
                </template>
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.invoicingTaxRate"  />
                    </div>
                    <span>{{ row.invoicingTaxRate }}</span>
                </template>
            </el-table-column>

            <el-table-column  label="采购链接" prop="purchaseLink" min-width="140">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.purchaseLink" />
                    </div>
                    <span>
                        <el-text truncated>
                            {{ row.purchaseLink }}
                        </el-text>
                    </span>
                </template>
            </el-table-column>
            <el-table-column  label="收货仓库" prop="remarks" min-width="100">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.remarks" />
                    </div>
                    <span>{{ row.remarks }}</span>
                </template>
            </el-table-column>
            <el-table-column  label="零件采购注意事项" prop="remarks" min-width="200">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.remarks"  />
                    </div>
                    <span>{{ row.remarks }}</span>
                </template>
            </el-table-column>
            <el-table-column  label="合同条款" prop="remarks" min-width="200">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.remarks"  />
                    </div>
                    <span>{{ row.remarks }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="120">
                <template #default="{ row }">
                    <el-link type="primary" :underline="false">复制</el-link>
                    <el-link type="primary" :underline="false">删除</el-link>
                </template>
            </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>

      <el-table 
            ref="tableRef" 

            stripe border 
            :data="list" 
            :header-cell-style="{ 'text-align': 'center' }"
            style="margin-top: 20px;"
            height="270"
        >
            <el-table-column label="变体" min-width="100" prop="currency">
                <template #default="{ row }">
                    <el-select v-model="row.currency" placeholder="请选择货币"  style="min-width: 11px;">
                        
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="站点" min-width="127">
                <template #default="{ row }">
                    <el-select v-model="row.site" placeholder="请选择站点"  style="min-width: 15px;">
                       
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="外汇币种" min-width="100">
                    <template #default="{ row }">
                        <!-- <span>{{siteReflectCurrencyAndExchangeRate.get(row.site)}}</span> -->

                    </template>
                </el-table-column>

                <el-table-column label="实际总成本￥" min-width="110">
                    <template #default="{ row }">
                        <span>{{row.foreignExchange}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="长(cm)" min-width="70">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.length" />
                        </div>
                        <span>{{ row.length }}</span>
                    </template>
                </el-table-column>

                <el-table-column  label="宽(cm)" min-width="70">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.width" />
                        </div>
                        <span>{{ row.width }}</span>
                    </template>
                </el-table-column>

                <el-table-column  label="高(cm)" min-width="70">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.height"  />
                        </div>
                        <span>{{ row.height }}</span>
                    </template>
                </el-table-column>

                <el-table-column  label="重量(g)">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.weight" />
                        </div>
                        <span>{{ row.weight }}</span>
                    </template>
                </el-table-column>
            <el-table-column label="尾程$"  min-width="70" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>
            <el-table-column label="头程￥"  min-width="70" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>    
            <el-table-column label="打包￥"  min-width="70" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>
            <el-table-column label="头程渠道" min-width="130">
                    <template #default="{ row }">
                        <el-select 
                            v-model="row.firstMileChannel" 
                            placeholder="请选择头程渠道"
                           
                            style="min-width: 15px;"
                        >
                            
                        </el-select>
                    </template>
                </el-table-column>
            <el-table-column  label="最终售价$" min-width="100">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.sellingPrice" />
                    </div>
                    <span>{{ row.sellingPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column label="毛利率" prop="createTime" align="center" width="100">
                <template #default = "{ row }">
                <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="ROI"  min-width="100" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>    
            <el-table-column label="重量系数" prop="oem" align="center" width="100">
                <template #default = "{ row }">
                    <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 11px;">
                      
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="体积系数" prop="createTime" align="center" width="100">
                <template #default = "{ row }">
                <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
                </template>
            </el-table-column> 
            <el-table-column label="关税%" prop="createTime" align="center" width="100">
                <template #default = "{ row }">
                <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
                </template>
            </el-table-column> 
            <el-table-column align="平台佣金$" label="供应商" min-width="140">
                <template #default="{ row }">
                    
                </template>
            </el-table-column>
            <el-table-column align="仓储费2个月$" label="供应商" min-width="140">
                <template #default="{ row }">
                    
                </template>
            </el-table-column>
           
            <el-table-column align="center" fixed="right" label="操作" width="120">
                <template #default="{ row }">
                    <el-link type="primary" :underline="false">逆算</el-link>
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
    name: 'OrderStep3',
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
    emit('change-step', 3)
}
// 当点击上一步的时候
const handleGoback = () => {
    emit('change-step', 1)
}
</script>
  
<style lang="scss" scoped>
.pay-button-group {
    display: block;
    margin: 20px auto;
    text-align: center;
}
</style>
  