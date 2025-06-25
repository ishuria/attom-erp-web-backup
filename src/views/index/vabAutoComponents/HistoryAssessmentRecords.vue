<template>
  <!-- 考核数设定 -->
    <vab-dialog v-model="visible" :draggable="false" title="历史考核记录" top="10vh">
      <vab-query-form>
        <vab-query-form-right-panel :span="24">
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input
                v-model.trim="queryForm.keyWord"
                clearable
                placeholder="请输入搜索关键词"
                @input="$emit('query')"
                @keyup.enter="$emit('query')"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="loading" type="primary" @click="$emit('query')" />
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table
        v-loading="loading"
        border
        :data="list"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ textAlign: 'center' }"
        max-height="700"
        stripe
      >
        <el-table-column label="姓名" min-width="100" prop="userName" />
        <el-table-column label="月份" min-width="100" prop="month" />
        <el-table-column label="总考核完成数" min-width="120" prop="assessmentNumberFinish" />
        <el-table-column label="总考核数" min-width="100" prop="assessmentNumber" />
        <el-table-column label="OEM完成数" min-width="110" prop="oemFinish" />
        <el-table-column label="OEM考核数" min-width="110" prop="oem" />
      </el-table>
      <vab-pagination
        :current-page="queryForm.pageNo"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="$emit('page-change', $event)"
        @size-change="$emit('size-change', $event)"
      />
    </vab-dialog>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'

defineOptions({
  name: 'HistoryAssessmentRecords'
})

const props = defineProps<{
  modelValue: boolean
  loading: boolean
  total: number
  queryForm: any
  list: any
}>()
const emit = defineEmits(['update:modelValue', 'query', 'page-change', 'size-change'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
</script>