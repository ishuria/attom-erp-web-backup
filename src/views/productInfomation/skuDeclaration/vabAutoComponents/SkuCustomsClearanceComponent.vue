<template>
  <vab-dialog v-model="skuCustomsClearanceVisible" :draggable="false" title="Sku信息" width="50%">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="querySkuData"
              @keyup.enter="querySkuData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" native-type="submit" type="primary" @click="querySkuData" />
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" border :data="skuCustomsClearanceList" max-height="1000" stripe>
      <el-table-column align="center" label="图片" prop="skuImgUrl" width="200">
        <template #default="{ row }">
          <el-image fit="fill" :src="row.skuImgUrl" style="display: block; width: 200px; height: 200px" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="sku" prop="sku" />

      <el-table-column align="center" label="品名" prop="productName" />

      <el-table-column align="center" fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <el-link v-loading="importLoading" type="primary" underline="never" @click="importSkuCustomClearnce(row)">
            导入此sku清关信息
          </el-link>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>
    <template #footer></template>

    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="skuCustomClearnceHandleCurrentChange"
      @size-change="skuCustomClearnceHandleSizeChange"
    />
  </vab-dialog>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'SkuCustomsClearanceComponent',
})

// 获取pros传递的参数
const props = defineProps({
  targetCustomClearnId: {
    type: Number,
    required: true,
    validator: (value: number) => value > 0,
  },
})

import { Search } from '@element-plus/icons-vue'
import { addSkuCustomCleanList, otainSkuCustomCleanList } from '/@/api/devlocal/productInformation'
import { SkuCustomsClearance, SkuCustomsClearanceQueryReq } from '/@/type/productInformation/skuCustomsClearance'
const skuCustomsClearanceVisible = defineModel({ default: false })
const listLoading = ref<boolean>(false)
const importLoading = ref<boolean>(false)
const skuCustomsClearanceList = ref<SkuCustomsClearance[]>([])
const total = ref<number>(0)

const queryForm = reactive<SkuCustomsClearanceQueryReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})

/** 改变页数 */
const skuCustomClearnceHandleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

/** 分页每页多少条记录方法 */
const skuCustomClearnceHandleSizeChange = (val: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = val
  fetchData()
}

/** 查询方法 */
const querySkuData = () => {
  queryForm.pageNo = 1
  fetchData()
}

/** 查询初始化方法 */
const fetchData = async () => {
  listLoading.value = true
  const { data } = await otainSkuCustomCleanList(queryForm)
  skuCustomsClearanceList.value = data.list
  total.value = data!.total!
  listLoading.value = false
}

/** 导入其他sku的清关信息 */
const importSkuCustomClearnce = async (val: SkuCustomsClearance) => {
  try {
    importLoading.value = true
    const { data } = await addSkuCustomCleanList({
      originSkuId: val.skuId,
      targetCustomClearanceId: props.targetCustomClearnId,
    })
    if (data) {
      $baseMessage('导入sku清关信息成功！', 'success')
      importLoading.value = false
      reset()
    }
  } catch (error) {
    importLoading.value = false
  }
}

const reset = () => {
  skuCustomsClearanceVisible.value = false
  queryForm.keyWord = ''
  skuCustomsClearanceList.value = []
}

/** 监听父组件的参数变化 */
watch(skuCustomsClearanceVisible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      if (skuCustomsClearanceVisible) {
        fetchData()
      }
    })
  }
})
</script>
