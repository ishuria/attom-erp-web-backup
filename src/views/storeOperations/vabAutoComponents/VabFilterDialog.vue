<template>
  <vab-dialog
    title="筛选"
    v-model="dflag"
    width="27%"
    @close="handleClose"
  >
    <el-form
      ref="filterFormRef"
      label-position="right"
      label-width="auto"
      :model="filterForm"
      style="width: 100%; margin-right: 10px"
    >
      <el-form-item label="上新天数">
        <div class="flex">
          <el-input-number
            v-model="filterForm.number1"
            :min="0"
            placeholder="最小值"
            style="flex: 1"
          />
          <span style="white-space: nowrap; color: #303133">至</span>
          <el-input-number
            v-model="filterForm.number2"
            :min="0"
            placeholder="最大值"
            style="flex: 1"
          />
        </div>
      </el-form-item>
      <el-form-item label="ES总新">
        <div class="flex">
          <el-input-number
            v-model="filterForm.number3"
            :min="0"
            placeholder="最小值"
            style="flex: 1"
          />
          <span style="white-space: nowrap; color: #303133">至</span>
          <el-input-number
            v-model="filterForm.number4"
            :min="0"
            placeholder="最大值"
            style="flex: 1"
          />
        </div>
      </el-form-item>
      <el-form-item label="上海签收">
        <div class="flex">
          <el-input-number
            v-model="filterForm.number5"
            :min="0"
            placeholder="最小值"
            style="flex: 1"
          />
          <span style="white-space: nowrap; color: #303133">至</span>
          <el-input-number
            v-model="filterForm.number6"
            :min="0"
            placeholder="最大值"
            style="flex: 1"
          />
        </div>
      </el-form-item>
    
      
      <el-form-item label="30天净利润">
        <div class="flex">
          <el-input-number
            v-model="filterForm.number11"
            :min="0"
            placeholder="最小值"
            style="flex: 1"
          />
          <span style="white-space: nowrap; color: #303133">至</span>
          <el-input-number
            v-model="filterForm.number12"
            :min="0"
            placeholder="最大值"
            style="flex: 1"
          />
        </div>
      </el-form-item>
      <el-form-item label="30天净利率%">
        <div class="flex">
          <el-input-number
            v-model="filterForm.number13"
            :min="0"
            placeholder="最小值"
            style="flex: 1"
          />
          <span style="white-space: nowrap; color: #303133">至</span>
          <el-input-number
            v-model="filterForm.number14"
            :min="0"
            placeholder="最大值"
            style="flex: 1"
          />
        </div>
      </el-form-item>
      <el-form-item label="月销售额">
        <div class="flex">
          <el-input-number
            v-model="filterForm.number15"
            :min="0"
            placeholder="最小值"
            style="flex: 1"
          />
          <span style="white-space: nowrap; color: #303133">至</span>
          <el-input-number
            v-model="filterForm.number16"
            :min="0"
            placeholder="最大值"
            style="flex: 1"
          />
        </div>
      </el-form-item>
    
      <el-form-item label="FBA差异">
        <div class="flex">
          <el-input-number
            v-model="filterForm.number19"
            :min="0"
            placeholder="最小值"
            style="flex: 1"
          />
          <!-- <el-input type="number" placeholder="最小值" /> -->
          <span style="white-space: nowrap; color: #303133">至</span>
          <el-input-number
            v-model="filterForm.number20"
            :min="0"
            placeholder="最大值"
            style="flex: 1"
          />
          <!-- <el-input type="number" v-model="filterForm.number6" placeholder="最大值" /> -->
        </div>
      </el-form-item>
      <el-form-item label="运营分类筛选">
        <el-select></el-select>
      </el-form-item>
      <el-form-item label="广告">
        <el-select>
          <el-option 
            v-for="item in adStatusOption"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="text-align: center">
        <el-button type="danger" @click="clearFilterForm">清空</el-button>
        <el-button type="primary">确认</el-button>
        <el-button>取消</el-button>
      </div>
    </template>
  </vab-dialog>

</template>

<script lang="ts" setup>
import { FormInstance } from 'element-plus'
import { adStatusOption } from '../constantOption'

defineOptions({
  name: 'VabFilterDialog'
})
const dflag = ref<boolean>(false)
const props = defineProps<{
  filterVisible: boolean
}>()
watchEffect(() => {
  dflag.value = props.filterVisible
})
const emit = defineEmits(['updateVisible'])
const filterForm = reactive<any>({

})
const filterFormRef = ref<FormInstance>()
const clearFilterForm = () => {

}
const handleClose = () => {
  emit('updateVisible', false)
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}
</style>