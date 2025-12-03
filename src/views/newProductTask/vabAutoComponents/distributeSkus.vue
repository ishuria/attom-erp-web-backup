<template>
  <vab-dialog v-model="visible" :title="title" width="75%">
    <div style="margin-top: 20px; text-align: center">
      <div style="margin-bottom: 20px; font-size: medium">选择要分配的SKU</div>

      <!-- 搜索输入框区域 -->
      <div class="search-container">
        <!-- 源列搜索框 -->
        <div class="search-box left-search">
          <el-input
            v-model="leftSearchKeyword"
            clearable
            placeholder="搜索源列SKU"
            @input="handleLeftSearch"
            @keydown.enter="handleLeftSearch"
          >
            <template #prefix>
              <el-icon><search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 目的列搜索框 -->
      </div>

      <div class="transfer-container">
        <el-transfer v-model="transferValue" :data="currentPageDatas" :titles="['源列', '目的列']" @change="handleTransferChange">
          <template #left-footer>
            <vab-pagination
              :current-page="page.pageNo"
              :page-size="page.pageSize"
              :total="page.total"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </template>
          <template #right-footer>
            <div class="selected-count">已选择 {{ transferValue.length }} 个SKU</div>
          </template>
        </el-transfer>
      </div>
    </div>

    <template #footer>
      <div style="text-align: center">
        <el-button type="danger" @click="handleCancel">取消</el-button>
        <el-button type="success" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { getPackagingSkuSelectList } from '/@/api/devlocal/packagingShipping'

defineOptions({
  name: 'DistributeSkus',
})

interface Props {
  title: string
}
interface Emits {
  (e: 'confirm', data: { transferValue: number[]; groupName?: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const visible = defineModel({ default: false })

// 数据管理
const sourceDatas = ref<any[]>([]) // 原始数据源
const currentDatas = ref<any[]>([]) // 当前可选择的数据（排除已选择的）
const currentPageDatas = ref<any[]>([]) // 当前页显示的数据
const page = reactive({ pageNo: 1, pageSize: 20, total: 0 })

const transferValue = ref<number[]>([])

// 搜索关键词
const leftSearchKeyword = ref<string>('')

// 监听visible变化，重置数据
watch(visible, (newVal) => {
  if (newVal) {
    transferValue.value = []
    init()
  }
})

// 初始化数据
const init = async () => {
  try {
    const { data } = await getPackagingSkuSelectList({ keyWord: '' })
    const mappedDatas = data.list.map((value, index) => ({
      label: value.sku,
      key: value.skuId,
      obj: value,
    }))

    const arrLength = mappedDatas.length
    page.total = arrLength
    sourceDatas.value = mappedDatas
    currentDatas.value = mappedDatas
    // 初始化20条数据给当前第一页的变量
    currentPageDatas.value = mappedDatas.slice(0, 20)
  } catch (error) {
    console.error('初始化数据失败:', error)
  }
}

// 分页change
const handleCurrentChange = (val: number) => {
  // 更新当前页码
  page.pageNo = val

  // 先将选中的从当前数据过滤掉
  currentDatas.value = currentDatas.value.filter((item) => {
    return !transferValue.value.includes(item.key)
  })

  // 再将过滤好的当前数据选出指定页
  currentPageDatas.value = groupFunc(val)

  // 再将选中的目标数组补给当前页变量，从而保证之前选的数据能显示
  currentPageDatas.value = currentPageDatas.value.concat(
    sourceDatas.value.filter((item) => {
      return transferValue.value.includes(item.key)
    })
  )
}

// 穿梭change
const handleTransferChange = (current: any[], direction: string, move: any[]) => {
  // 为了保证数据的一致性，目标数组还回来之后要插进当前数据变量
  if (direction === 'left') {
    currentDatas.value = sourceDatas.value.filter((val) => {
      return !current.includes(val.key)
    })
    const arrLength = currentDatas.value.length
    page.total = arrLength
  }
}

// 穿梭搜索
const filterChange = (query: string) => {
  // 自定义搜索，从当前数组变量中过滤，再渲染回组件
  const filteredDatas = sourceDatas.value.filter((val) => {
    return val.obj.sku.indexOf(query) > -1 && !transferValue.value.includes(val.key)
  })

  if (filteredDatas.length !== currentDatas.value.length) {
    currentDatas.value = filteredDatas
    // 搜索后重置到第一页
    page.pageNo = 1
    handleCurrentChange(1)
  }
}

// 数组分组函数
const groupFunc = (val: number) => {
  const arrLength = currentDatas.value.length
  page.total = arrLength

  // 使用动态的pageSize
  const num = page.pageSize
  const startIndex = (val - 1) * num
  const endIndex = startIndex + num

  // 直接返回当前页的数据
  return currentDatas.value.slice(startIndex, endIndex)
}

// 源列搜索处理
const handleLeftSearch = () => {
  filterChange(leftSearchKeyword.value)
}

// 分页大小改变
const handleSizeChange = (value: number) => {
  page.pageSize = value
  page.pageNo = 1
  // 重新计算分页数据
  handleCurrentChange(1)
}

const handleCancel = () => {
  visible.value = false
}

const handleConfirm = () => {
  const data = {
    transferValue: transferValue.value,
  }
  emit('confirm', data)
  visible.value = false
}
</script>

<style lang="scss" scoped>
// 搜索容器样式
.search-container {
  display: flex;
  justify-content: space-between;
  margin: 0 30px 20px 50px;
}

.search-box {
  flex: 1;
  max-width: 43%; // 与transfer面板宽度保持一致

  .el-input {
    width: 100%;
  }
}

.left-search {
  margin-right: auto;
}

.right-search {
  margin-left: auto;
}

// Transfer Element
.transfer-container {
  :deep() {
    .el-transfer-panel {
      width: 43%;
      &__body {
        height: 300px !important;
      }
      &__footer {
        height: 72px;
      }
    }
  }
}
</style>
