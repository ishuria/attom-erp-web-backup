<template>
  <div style="margin-top: 20px; margin-bottom: 20px">
    <el-table border :data="tableData" :header-cell-style="{ textAlign: 'center' }" stripe>
      <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(siteQuantityList, 'SKU', 'sku')" />
      <el-table-column
        v-for="(item, index) in option"
        :key="index"
        :label="item.siteName"
        :min-width="flexColumnWidth(list, '亚马逊MX墨西哥', item.siteName)"
        :prop="item.siteName"
      >
        <template #default="{ row }">
          <!-- 如果是运营行，显示运营人员姓名 -->
          <template v-if="row.isOperationUserRow && step === 3">
            <span>{{ row[item.siteName]?.operationUserName || '-' }}</span>
          </template>
          <!-- 如果是分货完成行，显示勾选框 -->
          <template v-else-if="row.isDistributionRow && step === 3">
            <el-checkbox
              v-model="distributionCompleted[item.siteName]"
              :disabled="editDisabled"
              :false-value="0"
              :true-value="1"
              @change="handleDistributionCompleted(row, item.siteName)"
            >
              完成
            </el-checkbox>
          </template>
          <!-- 否则显示数量输入框 -->
          <template v-else>
            <el-input
              v-model="row[item.siteName].quantity"
              :disabled="editDisabled"
              :min="0"
              type="number"
              @change="handleUpdateQuantity(row, item.siteName)"
            />
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { updateDistributionCompleted, updateStepNoQuantity } from '~/src/api/devlocal/orderingReview'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'VabSiteQuantityTable',
})

const props = withDefaults(
  defineProps<{
    list: any[]
    editDisabled?: boolean
    step: number
  }>(),
  {
    editDisabled: false,
  }
)
const emit = defineEmits(['update:list'])
watch(
  () => props.list,
  () => {
    initData()
  }
)
const siteQuantityList = ref<any[]>([])
const option = ref<any[]>([])
const distributionCompleted = ref<Record<string, number>>({}) // 存储每个站点的分货完成状态
// const list = ref<any[]>([])

// 合并表格数据，在最后添加分货完成行
const tableData = computed(() => {
  // 如果 step 不是 3，只返回原始数据
  if (props.step !== 3) {
    return siteQuantityList.value
  }

  // step === 3 时，添加分货完成行
  const distributionRow: any = {
    sku: '分货完成',
    isDistributionRow: true,
  }

  const operationUserRow: any = {
    sku: '运营',
    isOperationUserRow: true,
  }

  // 为每个站点添加分货完成状态，包含必要的 id 和 orderEntryId
  // 优先从 distributionCompletedList 中获取数据
  let distributionList = []
  if (props.list && props.list.length > 0 && props.list[0].distributionCompletedList) {
    distributionList = props.list[0].distributionCompletedList
  } else {
    // 如果没有 distributionCompletedList，使用 option（兼容旧数据结构）
    distributionList = option.value
  }

  distributionList.forEach((item: any) => {
    distributionRow[item.siteName] = {
      id: item.id, // 使用站点的 id
      distributionCompleted: item.distributionCompleted || 0,
    }
    operationUserRow[item.siteName] = {
      id: item.id,
      operationUserName: item.operationUserName,
    }
  })

  // 返回数据：原始数据 + 运营行 + 分货完成行
  return [...siteQuantityList.value, operationUserRow, distributionRow]
})

// 验证订货数量（当站点是亚马逊US时，必须是5的倍数）
const validateQuantity = (row: any, siteName: string): boolean => {
  // 检查是否是亚马逊US站点
  if (siteName === '亚马逊US美国') {
    const quantity = Number(row[siteName].quantity)
    if (row[siteName].quantity && quantity !== 0) {
      if (isNaN(quantity) || quantity <= 0) {
        $baseMessage(`${siteName} 的订货数量必须是大于0的数字`, 'error')
        return false
      }
      if (quantity % 5 !== 0) {
        $baseMessage(`${siteName} 的订货数量必须是5的倍数`, 'error')
        return false
      }
    }
  }
  return true
}

const handleUpdateQuantity = async (row: any, siteName: string) => {
  // 先验证数量
  if (!validateQuantity(row, siteName)) {
    return
  }
  await updateStepNoQuantity({
    id: row[siteName].id,
    quantity: Number(row[siteName].quantity),
    orderEntryId: row.orderEntryId,
  })
}

// 处理分货完成状态变化
const handleDistributionCompleted = async (row: any, siteName: string) => {
  // 只在 step === 3 时才处理分货完成状态
  if (props.step !== 3) {
    return
  }
  // console.log(row)
  // console.log(distributionCompleted.value[siteName])
  // 从 row 里找到 siteName 对应的 id
  const id = row[siteName].id
  const { data } = await updateDistributionCompleted({ id, status: distributionCompleted.value[siteName] })
  if (data) {
    $baseMessage(`${siteName} 站点分货完成状态修改成功，且已更新其他站点分货状态`, 'success')
  } else {
    $baseMessage(`${siteName} 站点分货完成状态修改失败`, 'error')
  }
  // 点击完成后需要刷新表格
  emit('update:list')
}

let tem = 0
const initData = () => {
  siteQuantityList.value = props.list
  // console.log('list', props.list)
  siteQuantityList.value.forEach((row: any) => {
    if (row.siteQuantityList.length > tem) {
      tem = row.siteQuantityList.length
      option.value = row.siteQuantityList
    }
    row.siteQuantityList.forEach((item: any) => {
      const key = item.siteName
      row[`${key}`] = { quantity: item.quantity, id: item.id }
    })
  })
  // 清空distributionCompleted
  distributionCompleted.value = {}
  if (props.step === 3) {
    // 初始化分货完成状态，从后端数据中获取
    // 从 distributionCompletedList 中读取分货完成状态
    if (props.list && props.list.length > 0 && props.list[0].distributionCompletedList) {
      props.list[0].distributionCompletedList.forEach((item: any) => {
        distributionCompleted.value[item.siteName] = item.distributionCompleted || 0
      })
    } else {
      // 如果没有 distributionCompletedList，从 option 中读取（兼容旧数据结构）
      option.value.forEach((item: any) => {
        distributionCompleted.value[item.siteName] = item.distributionCompleted || 0
      })
    }
  }

  // console.log('siteQuantityList', siteQuantityList.value)
  // console.log('tableData', tableData.value)
}
</script>
