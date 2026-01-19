<template>
  <vab-card class="profitTable">
    <template #header>
      <vab-icon icon="information-line" />
      产品利润分
      <div class="right-select">
        <slot name="select"></slot>
      </div>
    </template>

    <el-table
      border
      :cell-class-name="clearPadding"
      :data="groupedList"
      :expand-row-keys="expandedRows"
      :header-cell-style="{ textAlign: 'center' }"
      row-key="userName"
      @row-click="handleRowClick"
    >
      <el-table-column align="center" label="人员" prop="userName" width="100" />
      <el-table-column align="center" label="总利润分" prop="totalNumber" width="100">
        <template #default="{ row }">
          <span style="color: var(--el-color-success)">{{ row.totalNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="展开" type="expand" width="80">
        <template #default="{ row }">
          <div style="padding: 0">
            <el-table border :cell-class-name="clearPadding" :data="row.products.slice(1)" :show-header="false">
              <el-table-column width="100" />
              <el-table-column width="100" />
              <el-table-column width="80" />
              <el-table-column align="center" prop="number" width="100">
                <template #default="{ row: product }">
                  <span style="color: var(--el-color-success)">{{ product.number }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="imageUrl" width="75">
                <template #default="{ row: product }">
                  <el-image
                    :src="product.imageUrl"
                    style="display: block; width: 75px; height: 75px"
                    @click="imagePreviewShow(product.imageUrl)"
                  >
                    <template #error><el-icon /></template>
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column align="center" min-width="130" prop="parentASIN">
                <template #default="{ row: product }">
                  <el-popover v-if="product.skus && product.skus.length > 0" placement="top" trigger="hover" :width="360">
                    <template #reference>
                      <span style="cursor: pointer; color: var(--el-color-primary)">
                        {{ product.parentASIN }}
                      </span>
                    </template>
                    <div style="max-height: 300px; overflow-y: auto">
                      <div style="font-weight: 600; margin-bottom: 8px; color: var(--el-text-color-primary)">SKU：</div>
                      <div
                        v-for="sku in product.skus"
                        :key="sku"
                        style="padding: 4px 0; border-bottom: 1px solid var(--el-border-color-lighter)"
                      >
                        {{ sku }}
                      </div>
                    </div>
                  </el-popover>
                  <span v-else>{{ product.parentASIN }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="productTotalScore" width="100" />
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="利润分" width="100">
        <template #default="{ row }">
          <span v-if="row.products[0]" style="color: var(--el-color-success)">{{ row.products[0].number }}</span>
        </template>
      </el-table-column>
      <el-table-column :cell-class-name="clearPadding" label="图片" width="75">
        <template #default="{ row }">
          <el-image
            v-if="row.products[0]"
            :src="row.products[0].imageUrl"
            style="display: block; width: 75px; height: 75px"
            @click="imagePreviewShow(row.products[0].imageUrl)"
          >
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="计分组名" min-width="130">
        <template #default="{ row }">
          <template v-if="row.products[0]">
            <el-popover v-if="row.products[0].skus && row.products[0].skus.length > 0" placement="top" trigger="hover" :width="360">
              <template #reference>
                <span style="cursor: pointer; color: var(--el-color-primary)">
                  {{ row.products[0].parentASIN }}
                </span>
              </template>
              <div style="max-height: 300px; overflow-y: auto">
                <div style="font-weight: 600; margin-bottom: 8px; color: var(--el-text-color-primary)">SKU：</div>
                <div
                  v-for="sku in row.products[0].skus"
                  :key="sku"
                  style="padding: 4px 0; border-bottom: 1px solid var(--el-border-color-lighter)"
                >
                  {{ sku }}
                </div>
              </div>
            </el-popover>
            <span v-else>{{ row.products[0].parentASIN }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品总分" width="100">
        <template #default="{ row }">
          <span v-if="row.products[0]">{{ row.products[0].productTotalScore }}</span>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px" />
      </template>
    </el-table>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </vab-card>
</template>

<script lang="ts" setup>
import { IGetFrontPageProductProfitRes } from '/@/type/index/frontPage'

defineOptions({
  name: 'MonthlyProductProfitTable',
})

const props = defineProps<{
  list: IGetFrontPageProductProfitRes[]
}>()

// 将数据按 userName 分组
const groupedList = computed(() => {
  const groups: Record<string, any> = {}

  props.list.forEach((item) => {
    if (!groups[item.userName]) {
      groups[item.userName] = {
        userName: item.userName,
        totalNumber: item.totalNumber,
        products: [],
      }
    }
    groups[item.userName].products.push(item)
  })

  return Object.values(groups)
})

const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  return 'clear-padding'
}

// 展开行控制
const expandedRows = ref<string[]>([])
const handleRowClick = (row: any) => {
  const index = expandedRows.value.indexOf(row.userName)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
  } else {
    expandedRows.value.push(row.userName)
  }
}
</script>

<style lang="scss" scoped>
.profitTable {
  height: 478px;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: scroll;
  }

  .right-select {
    position: absolute;
    top: 50%;
    right: 25px;
    width: auto;
    height: 60px;
    line-height: 60px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    z-index: 10;
  }

  :deep(.el-table) {
    height: 100%;
    .clear-padding {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      .cell {
        padding-right: 0 !important;
        padding-left: 0 !important;
      }
    }

    // 展开行样式
    .el-table__expanded-cell {
      padding: 0 !important;

      .el-table {
        margin: 0;
        border-top: none;
      }
    }

    // 让表格行有点击效果
    .el-table__row {
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--el-table-row-hover-bg-color) !important;
      }
    }

    // 展开列的图标样式优化
    .el-table__expand-column {
      .cell {
        padding: 0 !important;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .el-table__expand-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
        transition: all 0.3s;
        font-size: 16px;
        font-weight: bold;

        &:hover {
          background-color: var(--el-color-primary-light-7);
          transform: scale(1.1);
        }

        &.el-table__expand-icon--expanded {
          background-color: var(--el-color-primary);
          color: white;

          &:hover {
            background-color: var(--el-color-primary-dark-2);
          }
        }
      }
    }
  }
}
</style>
