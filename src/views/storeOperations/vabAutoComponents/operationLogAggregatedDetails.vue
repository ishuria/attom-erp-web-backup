<template>
  <el-drawer v-model="visible" append-to-body direction="ltr" title="操作日志聚合明细" width="45%">
    <!-- 表格 -->
    <el-table v-loading="detailLoading" border :data="detailList" height="calc(100vh - 180px)">
      <el-table-column label="日期" prop="date" width="170" />
      <el-table-column label="内容" min-width="170" prop="content">
        <template #default="{ row }">
          <div>
            <!-- 
              （可选）entityType
              （可选）[keyWordType] keyWord
              （可选）变更信息（创建/状态/竞价/预算/其他）
              （可选）campaignName -->
            <!-- 特殊情况：广告推广状态+创建，只显示"产品推广状态" -->
            <div v-if="row.entityType === '广告推广状态' && row.changeType === '创建'">产品推广状态</div>
            <div v-else-if="row.entityType === '广告组' && row.changeType === '创建'">创建广告组</div>
            <!-- 其他情况的正常逻辑 -->
            <template v-else>
              <!-- entityType 是否词的不展示 -->
              <div v-if="row.entityType !== '关键词' && row.entityType !== '否词' && row.entityType !== '广告活动'">
                {{ row.entityType }}
              </div>
              <div v-if="row.keyWord">
                <el-tag v-if="row.keyWordType" :type="getKeyWordType(row.keyWordType)">
                  {{ row.keyWordType }}
                </el-tag>
                {{ row.keyWord }}
              </div>
              <!-- changeType 展示逻辑 -->
              <div v-if="row.keyWordType !== '取消否定投放' && row.afterValue !== '归档'" class="change-info">
                <!-- 创建类型：蓝色加粗显示"创建" -->
                <span v-if="row.changeType === '创建'" class="create-text">创建</span>
                <!-- 状态类型：只展示变更后的值 -->
                <span v-else-if="row.changeType === '状态'">
                  <span v-if="row.afterValue === '打开'" class="status-open">打开</span>
                  <span v-else-if="row.afterValue === '关闭'" class="status-close">关闭</span>
                  <span v-else>{{ row.afterValue }}</span>
                </span>
                <!-- 竞价类型：显示完整变化及箭头 -->
                <span v-else-if="row.changeType === '竞价'" style="font-weight: bold">
                  {{ row.changeType }}: {{ row.beforeValue }} -> {{ row.afterValue }}
                  <el-icon
                    v-if="
                      row.beforeValue !== undefined && row.afterValue !== undefined && isValueIncreased(row.beforeValue, row.afterValue)
                    "
                    class="arrow-up"
                  >
                    ↑
                  </el-icon>
                  <span v-else-if="row.beforeValue !== undefined && row.afterValue !== undefined" class="arrow-down">↓</span>
                </span>
                <!-- 预算 -->
                <span v-else-if="row.changeType === '预算'">
                  <span v-if="row.afterValue === 'false'" style="color: var(--el-color-danger)">预算用完</span>
                  <span v-else-if="row.afterValue === 'true'" style="color: var(--el-color-success)">预算恢复</span>
                </span>
                <!-- 其他类型：正常显示 -->
                <span v-else>{{ row.changeType }}: {{ row.beforeValue }} -> {{ row.afterValue }}</span>
              </div>
              <div v-if="row.campaignName" class="campaign-name">{{ row.campaignName }}</div>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>

<script lang="ts" setup>
import { IGetOperationLog } from '~/src/type/storeOperation/productAnalysisType'

defineOptions({
  name: 'OperationLogAggregatedDetails',
})
const props = defineProps<{
  detailList: IGetOperationLog[]
  detailLoading: boolean
}>()
const visible = defineModel({ default: false })
const getKeyWordType = (type: string) => {
  switch (type) {
    case '精准匹配':
      return 'primary'
    case '宽泛匹配':
      return 'success'
    case '短语匹配':
      return 'warning'
    default:
      return 'info' // 或者 'default'
  }
}

// 判断值是否增加（用于箭头方向）
const isValueIncreased = (beforeValue: any, afterValue: any): boolean => {
  const before = parseFloat(String(beforeValue).replace(/[^\d.-]/g, ''))
  const after = parseFloat(String(afterValue).replace(/[^\d.-]/g, ''))
  if (isNaN(before) || isNaN(after)) return false
  return after > before
}
</script>

<style lang="scss" scoped>
.content-link {
  display: block;
  width: 100%;

  .content-text {
    white-space: pre-wrap;
    word-break: break-word;
  }
}

.change-info {
  display: flex;
  align-items: center;
  gap: 6px;

  .arrow-up {
    color: var(--el-color-danger);
    font-size: 18px;
    flex-shrink: 0;
    margin-top: -3px;
  }

  .arrow-down {
    color: var(--el-color-success);
    font-size: 18px;
    flex-shrink: 0;
    margin-top: -2px;
  }

  .create-text {
    color: var(--el-color-primary);
    font-weight: bold;
  }

  .status-open {
    color: var(--el-color-success);
    font-weight: bold;
  }

  .status-close {
    color: var(--el-color-danger);
    font-weight: bold;
  }
}

.campaign-name {
  color: #909399;
}

.parsed-content {
  :deep(.price-arrow) {
    display: inline-block;
    margin: 0 4px;
    font-size: 16px;
    font-weight: bold;

    &.price-up {
      color: var(--el-color-danger);
    }

    &.price-down {
      color: var(--el-color-success);
    }
  }

  :deep(.product-sku) {
    color: #909399;
  }
}
</style>
