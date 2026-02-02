<template>
  <el-table
    ref="tableRef"
    v-loading="loading"
    border
    :cell-style="{ textAlign: 'center' }"
    class="noneHoveTable custom-table-hover"
    :data="data"
    :header-cell-style="{ textAlign: 'center' }"
    :row-class-name="rowClassName"
    stripe
  >
    <el-table-column label="PO" prop="po" />
    <el-table-column label="站点" prop="sendSite">
      <template #default="{ row }">
        <el-tag size="default" :style="getSiteTagStyle(row.sendSite)">{{ row.sendSite }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="产品图片" prop="skuImageUrl" width="100px">
      <template #default="{ row }">
        <el-image
          fit="fill"
          :src="row.skuImageUrl"
          style="display: block; width: 75px; height: 75px"
          @click="handleImageClick(row.skuImageUrl)"
        >
          <template #error>
            <el-icon />
          </template>
        </el-image>
      </template>
    </el-table-column>
    <el-table-column label="SKU" prop="sku">
      <template #default="{ row }">
        <span class="copySku" @click="handleClipboard($event, row.sku)">
          {{ row.sku }}
          <vab-icon icon="file-copy-2-fill" />
        </span>
        <br />
        {{ row.desc }}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button
          v-if="hasPermission({ permission: [PackingTaskPermission.PACKING_TASK_NEW_INSPECTION] })"
          plain
          type="primary"
          @click="handleShowNewInspectionReport(row)"
        >
          新品质检
        </el-button>
      </template>
    </el-table-column>
    <template #empty>
      <el-empty class="vab-data-empty" description="暂无数据" />
    </template>
  </el-table>
</template>

<script lang="ts" setup>
import PackingTaskPermission from '/@/permissions/packingTask'
import handleClipboard from '/@/utils/clipboard'
import { hasPermission } from '/@/utils/permission'

defineOptions({
  name: 'PendingNewInspectionTable',
})

const props = defineProps<{
  data: any[]
  loading: boolean
  rowClassName?: (data: { row: any; rowIndex: number }) => string
}>()

const emit = defineEmits<{
  showNewInspectionReport: [row: any]
  imagePreview: [url: string]
}>()

const handleImageClick = (url: string) => {
  emit('imagePreview', url)
}

const handleShowNewInspectionReport = (row: any) => {
  emit('showNewInspectionReport', row)
}

// 图片取消padding
const cellClassName = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.column.label === '产品图片') {
    return 'clear-padding'
  }
  return ''
}
// 返回协调的tag样式：浅色背景 + 同色文字
const getSiteTagStyle = (siteName: string) => {
  const base = getSiteBaseColor(siteName)
  // 将16进制转换为rgba，背景使用较低透明度
  const hexToRgba = (hex: string, alpha = 0.15) => {
    const h = hex.replace('#', '')
    const bigint = parseInt(h, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return {
    backgroundColor: hexToRgba(base, 0.15),
    color: base,
    border: '1px solid ' + hexToRgba(base, 0.35),
    fontSize: '14px',
  }
}
// 站点 -> 自定义颜色映射
const getSiteBaseColor = (siteName: string) => {
  if (!siteName) return '#909399'
  const colorMap: Record<string, string> = {
    亚马逊US美国: '#67C23A', // 绿色
    亚马逊UK英国: '#409EFF', // 蓝色
    亚马逊DE德国: '#8E44AD', // 紫色（由红色改为紫色）
    亚马逊CA加拿大: '#2AC3A2', // 青绿
    沃尔玛US美国: '#E6A23C', // 橙色
    亚马逊JP日本: '#5C6BC0', // 靛蓝
    Tiktok美国: '#34495E', // 深石板色
    '美国-海外仓': '#909399', // 灰色
  }
  return colorMap[siteName] ?? '#909399'
}
</script>

<style lang="scss" scoped>
.copySku {
  display: inline-block;
  padding: 0;
  cursor: pointer;
  -webkit-user-select: text;
  user-select: text;
  &:hover {
    color: #000;
  }
}

.multi-line-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-tooltip {
  max-width: 300px;
  word-break: break-word;
}
.noneHoveTable :deep(.clear-padding) {
  padding-top: 0px;
  padding-bottom: 0px;
}
.noneHoveTable :deep(.clear-padding .cell) {
  padding-right: 0px;
  padding-left: 0px;
}
</style>
