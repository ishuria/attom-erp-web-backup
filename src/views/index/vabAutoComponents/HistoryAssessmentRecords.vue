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
        <el-table-column label="实际总完成数" min-width="120" prop="assessmentNumberFinish" />
        <el-table-column label="实际总考核数" min-width="120" prop="assessmentNumber" />
        <el-table-column label="实际OEM完成数" min-width="130" prop="oemFinish" />
        <el-table-column label="实际OEM考核数" min-width="130" prop="oem" />
        <el-table-column label="原始总考核数" min-width="120" prop="originalAssessmentNumber" />
        <el-table-column label="原始OEM考核数" min-width="130" prop="originalOem" />
        <el-table-column label="原始总完成数" min-width="120" prop="originalAssessmentNumberFinish" />
        <el-table-column label="原始OEM完成数" min-width="130" prop="originalOemFinish" />
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