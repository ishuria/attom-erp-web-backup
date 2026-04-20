<template>
  <vab-dialog v-model="visible" title="从新品进度导入利润核算数据" width="60%">
    <el-table
      v-loading="loading"
      border
      :cell-class-name="clearPadding"
      class="noneHoverTable"
      :data="list"
      highlight-current-row
      max-height="400"
      stripe
      @current-change="handleImportRowChange"
    >
      <el-table-column align="center" label="选择" width="60">
        <template #default="{ row }">
          <el-radio v-model="selectedImportRow" :value="row" />
        </template>
      </el-table-column>
      <el-table-column label="图片" width="75">
        <template #default="{ row }">
          <el-image :src="row.imgUrl" style="width: 75px; height: 75px" @click="handleImagePreview(row.imgUrl)" />
        </template>
      </el-table-column>

      <el-table-column label="产品描述" min-width="300" prop="desc">
        <template #default="{ row }">
          <el-tooltip content=" " effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ removeHtmlTags(row.desc) }}</div>
            </template>
            <div class="multi-line-ellipsis">{{ removeHtmlTags(row.desc) }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="站点" prop="site" width="135">
        <template #default="{ row }">
          {{ getSiteLabel(row.site) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="长(cm)" prop="length" width="90" />
      <el-table-column align="center" label="宽(cm)" prop="width" width="90" />
      <el-table-column align="center" label="高(cm)" prop="height" width="90" />
      <el-table-column align="center" label="重量(g)" prop="weight" width="90" />
      <el-table-column align="center" label="头程渠道" min-width="200" prop="firstMileChannel">
        <template #default="{ row }">
          {{ getChannelLabel(row.firstMileChannel) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="售价" prop="sellingPrice" width="100" />

      <template #empty>
        <el-empty description="暂无利润核算数据" />
      </template>
    </el-table>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button :disabled="!selectedImportRow" :loading="submitting" type="primary" @click="handleConfirmImport">确认导入</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { removeHtmlTags } from '/@/utils/tableColum'

defineOptions({
  name: 'ImportSizeDialog',
})

const visible = defineModel<boolean>({ required: true })

const props = withDefaults(
  defineProps<{
    loading?: boolean
    submitting?: boolean
    list?: any[]
    siteList?: Array<{ id: number; label: string }>
    channelList?: Array<{ id: number; label: string }>
  }>(),
  {
    loading: false,
    submitting: false,
    list: () => [],
    siteList: () => [],
    channelList: () => [],
  }
)

const emit = defineEmits<{
  (e: 'confirm', value: any): void
  (e: 'image-preview', value: string): void
}>()

const selectedImportRow = ref<any>(null)

const getSiteLabel = (site: number | null | undefined) => {
  if (site == null) return ''
  const found = props.siteList.find((s: any) => s.id === site)
  return found ? found.label : String(site)
}

const getChannelLabel = (channel: number | null | undefined) => {
  if (channel == null) return ''
  const found = props.channelList.find((c: any) => c.id === Number(channel))
  return found ? found.label : String(channel)
}

const handleImportRowChange = (row: any) => {
  selectedImportRow.value = row
}

const handleCancel = () => {
  visible.value = false
}

watch(visible, (value) => {
  if (value) {
    selectedImportRow.value = null
  }
})

const handleConfirmImport = () => {
  if (!selectedImportRow.value) return
  emit('confirm', selectedImportRow.value)
}
const handleImagePreview = (url: string) => {
  emit('image-preview', url)
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}
</script>

<style lang="scss" scoped>
.noneHoverTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoverTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
</style>
