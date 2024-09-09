<template>
    <div class="comprehensive-table-container auto-height-container">
        
            
        
     

      
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
  