<template>
    <div class="comprehensive-table-container auto-height-container">
        <h2 style="text-align: center">请选择需要添加到采购单里的零件</h2>
        <el-table 
            ref="tableRef" 
      
            border 
            :data="list" 
            :header-cell-style="{'text-align': 'center'}"
            height="470"
        >
            <el-table-column align="center" label="图片" min-width="100">
                <template #default="{ row }">
                    <el-image style="width: 75px; height: 75px" :src="row.componentImg" fit="fill" />
                </template>
            </el-table-column>
            <el-table-column label="已有零件ID"  min-width="100" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>   
            <el-table-column label="零件名"  min-width="160" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>  
            <el-table-column label="数量"  min-width="70" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>
            <el-table-column label="单位"  min-width="70" prop="componentName" >
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
            <el-table-column label="运费(含税)" prop="createTime" align="center" width="100">
                <template #default = "{ row }">
                <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
                </template>
            </el-table-column>    
            <el-table-column label="总未税价" prop="createTime" align="center" width="100">
                <template #default = "{ row }">
                <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="总含税价"  min-width="100" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>    
            <el-table-column label="货币" prop="oem" align="center" width="60">
                <template #default = "{ row }">
                
                </template>
            </el-table-column>
            <el-table-column align="center" label="供应商" min-width="140">
                <template #default="{ row }">
                    
                </template>
            </el-table-column>
            <el-table-column type="selection" width="38">
            </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
        <div class="pay-button-group">
            <el-button @click="handleGoback">上一步</el-button>
            <el-button native-type="submit" type="primary" @click="handleSkip">跳过</el-button>
            <el-button native-type="submit" type="primary" @click="handleContinue">继续</el-button>
        </div>
    </div>
  </template>
  
<script lang="ts" setup>
defineOptions({
    name: 'OrderStep2',
})

const emit = defineEmits(['change-step'])
const listLoading = ref<boolean>(true)
const list = ref<any>([])

// 当点击跳过的时候
const handleSkip = () => {
    emit('change-step', 2)
}
// 当点击继续的时候
const handleContinue = () => {
    emit('change-step', 2)
}
// 当点击上一步的时候
const handleGoback = () => {
    emit('change-step', 0)
}
</script>
  
<style lang="scss" scoped>
.pay-button-group {
    display: block;
    margin: 20px auto;
    text-align: center;
}
</style>
  