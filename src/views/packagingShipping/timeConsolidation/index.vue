<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <!-- <vab-query-form-top-panel>
        <strong style="font-size: larger;">工时合并计算的SKU设定</strong>
      </vab-query-form-top-panel> -->
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleOpenAddClass">新增合并分类</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent >
          <el-form-item>
            <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keydown.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :data="fakeData"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
    >
      <el-table-column align="center" fixed="left" label="操作" width="120">
        <template #default="{ row }">
          <el-button text type="primary" @click="handleOpenAdd">添加SKU</el-button>
          <el-button text type="danger" >删除</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建日期" />
      <el-table-column align="center" label="合并分类组名" />
      <el-table-column align="center" label="添加日期" />
      <el-table-column align="center" label="添加人" />
      <el-table-column label="SKU" />
      <el-table-column label="产品" />
      <el-table-column align="center" fixed="right" label="操作" width="100" >
        <template #default="{ row }">
          <el-button text type="danger" >删除</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- 新增合并分类 -->
    <vab-dialog
      v-model="addClassVisible"
      title="新增合并分类"
      width="55%"
    >
      <el-form style="margin: auto 30px">
        <el-form-item label="分类名">
          <el-input />
        </el-form-item>
      </el-form>
      <div style="margin-top: 20px; text-align: center;">
        <div style="margin-bottom: 20px; font-size: medium;">选择合并计算工时的SKU</div>
        <div class="transfer-container">
          <el-transfer 
            v-model="transferValue" 
            :data="transferData" 
            filterable 
            :titles="['源列', '目的列']"
          />
        </div>
      </div>
    
      <template #footer>
        <div style="text-align: center;">
          <el-button type="danger" @click="addClassVisible = false">取消</el-button>
          <el-button type="success" @click="handleConfirmAddClass">确定</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 添加SKU -->
    <vab-dialog
      v-model="addVisible"
      title="添加SKU"
      width="55%"
    >
      <div style="text-align: center;">
        <div style="margin-bottom: 20px; font-size: medium;">选择合并计算工时的SKU</div>
        <div class="transfer-container">
          <el-transfer 
            v-model="transferValue" 
            :data="transferData" 
            filterable 
            :titles="['源列', '目的列']"
          />
        </div>
      </div>
    
      <template #footer>
        <div style="text-align: center;">
          <el-button type="danger" @click="addVisible = false">取消</el-button>
          <el-button type="success">确定</el-button>
        </div>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { getProductAllSkuSelectList } from '/@/api/devlocal/packagingShipping'

defineOptions({
  name: 'TimeConsolidation'
})

const states = ref<string[]>([])
const initials = ref<number[]>([])
const transferData = ref<any[]>([]) // 初始化为空数组
const transferValue = ref([])

// 生成数据
const generateData = () => {
  const data: any[] = []
  states.value.forEach((sku, index) => {
    data.push({
      label: sku,
      key: initials.value[index],
      initial: initials.value[index],
    })
  })
  return data
}
const addVisible = ref<boolean>(false)
const addClassVisible = ref<boolean>(false)
const fakeData = [
  { time: '2025-03-03' }
]
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)

const handleConfirmAddClass = () => {
  console.log(transferData.value);
  console.log(transferValue.value);
  
  
}
const handleOpenAddClass = async () => {
  addClassVisible.value = true
  states.value= []
  initials.value=[]
  transferData.value=[]
  transferValue.value = []
  const { data } = await getProductAllSkuSelectList()
  data.forEach((item: any) => {
    states.value.push(item.sku)
    initials.value.push(item.skuId)
  })
  transferData.value = generateData()
}
const handleOpenAdd = () => {
  addVisible.value = true
}
const fetchData = async () => {
  //
}
const queryData = async () => {
  queryForm.pageNo = 1
  // fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // fetchData()
}
</script>

<style lang="scss" scoped>
// Transfer Element
.transfer-container{
  :deep() {
    .el-transfer-panel{
      width: 43%;
      &__body{
        height: 500px !important;
      }
    }
  }
  
}

</style>