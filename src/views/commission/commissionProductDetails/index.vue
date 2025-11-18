<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="18">
        <el-form inline>
          <template v-if="currentRoleCode === ROLE_BOSS_CODE">
            <el-form-item label="人员">
              <el-tree-select
                v-model="developQueryForm.userId"
                check-strictly
                clearable
                :data="treeShareData"
                filterable
                placeholder="全部人员"
                :props="treeProps"
                :render-after-expand="false"
                style="min-width: 220px"
                @change="developQueryData"
              />
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="人员">
              <el-select v-model="developQueryForm.userId" filterable placeholder="全部" @change="developQueryData">
                <el-option v-for="item in userLevelList" :key="item.id" :label="item.label" :value="item.id" />
              </el-select>
            </el-form-item>
          </template>
          <!-- 角色（如需） -->
          <!-- <el-form-item label="角色">
              <el-select v-model="developQueryForm.roleId" placeholder="请选择角色" @change="developQueryData">
                <el-option v-for="item in roleList" :key="item.id" :label="item.label" :value="item.id" />
              </el-select>
            </el-form-item> -->
          <!-- 人员（树形单选） -->

          <el-form-item label="站点">
            <el-select v-model="developQueryForm.site" placeholder="请选择站点" @change="developQueryData">
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>

          <el-form-item label="发放月份">
            <el-select v-model="developQueryForm.month" placeholder="请选择发放月份" @change="developQueryData">
              <el-option v-for="item in monthOption" :key="item.id" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
          <el-form-item label="上线">
            <el-select v-model="developQueryForm.online" placeholder="请选择上线" @change="developQueryData">
              <el-option v-for="item in onlineOption" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-text style="margin-left: 10px">提成总金额：</el-text>
            <el-text type="success">{{ bonus }}元</el-text>
          </el-form-item>
          <el-form-item>
            <el-text style="margin-left: 10px" type="info">(更新时间：{{ updateDate }})</el-text>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="6">
        <el-form inline :model="developQueryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model="developQueryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="developQueryData"
              @keyup.enter="developQueryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="developQueryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      v-loading="listLoading"
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoverTable"
      :data="developList"
      :default-sort="{ prop: 'currentMonthBonus', order: 'descending' }"
      :header-cell-style="{ textAlign: 'center' }"
      sortable="custom"
      stripe
      @cell-click="cellClick"
      @sort-change="handleSortChange"
    >
      <el-table-column label="发布日期" min-width="130" prop="releaseDate">
        <template #default="{ row }">
          {{ row.releaseDate ? formatDate(new Date(row.releaseDate)) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="人员" prop="userName" :width="flexColumnWidth(developList, '人员', 'userName')" />
      <el-table-column label="图片" prop="skuImageUrl" width="75">
        <template #default="{ row }">
          <el-image :src="row.skuImageUrl" style="display: block; width: 75px; height: 75px" @click="imagePreviewShow(row.skuImageUrl)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(developList, 'SKU', 'sku', 50)">
        <template #default="{ row }">
          <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)">
            {{ row.sku }}
            <vab-icon icon="file-copy-2-fill" />
          </span>
          <br />
          {{ row.desc }}
        </template>
      </el-table-column>
      <el-table-column label="站点" min-width="150" prop="siteName" />
      <el-table-column label="上新天数" min-width="130" prop="days" sortable />
      <el-table-column label="状态" min-width="100" prop="status">
        <template #default="{ row }">
          <el-tag v-if="row.status === '暂停'" type="warning">{{ row.status }}</el-tag>
          <el-tag v-if="row.status === '进行中'" type="success">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提成角色" min-width="100" prop="commissionRole" />
      <el-table-column label="当月总提成" min-width="130" prop="currentMonthBonus" sortable>
        <template #default="{ row }">
          <el-text v-if="row.currentMonthBonus >= 0" type="success">
            {{ row.currentMonthBonus ? '￥' + row.currentMonthBonus : '' }}
          </el-text>
          <el-text v-if="row.currentMonthBonus < 0" type="danger">
            {{ row.currentMonthBonus ? '￥' + row.currentMonthBonus : '' }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column label="SKU累计提成￥" min-width="140" prop="cumulativeCommission">
        <template #default="{ row }">
          {{ row.cumulativeCommission ? '￥' + row.cumulativeCommission : '' }}
        </template>
      </el-table-column>
      <el-table-column label="站点分布" min-width="130" prop="">
        <template #default="{ row }">
          <div style="width: 100%; height: 60px">
            <vab-commission-chart-pie :data="row.pieList" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="总提成比例" min-width="120" prop="totalCommissionProportion">
        <template #default="{ row }">
          {{ row.totalCommissionProportion ? row.totalCommissionProportion + '%' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="基础提成比例" min-width="130" prop="baseProportion">
        <template #default="{ row }">
          {{ row.baseProportion ? row.baseProportion + '%' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="超额完成加成" min-width="130" prop="rewardProportion">
        <template #default="{ row }">
          {{ row.rewardProportion ? row.rewardProportion + '%' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="月净利润" min-width="130">
        <template #default="{ row }">
          <el-text v-if="row.monthProfit >= 0" type="success">{{ row.currencySymbol }}{{ row.monthProfit }}</el-text>
          <el-text v-if="row.monthProfit < 0" type="danger">{{ row.currencySymbol }}{{ row.monthProfit }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="月销售额" min-width="130">
        <template #default="{ row }">{{ row.currencySymbol }}{{ row.monthSales }}</template>
      </el-table-column>
      <el-table-column label="月净利率" min-width="130" prop="monthProfitMargin">
        <template #default="{ row }">
          <el-text v-if="row.monthProfitMargin >= 0" type="success">
            {{ row.monthProfitMargin ? row.monthProfitMargin + '%' : '' }}
          </el-text>
          <el-text v-if="row.monthProfitMargin < 0" type="danger">
            {{ row.monthProfitMargin ? row.monthProfitMargin + '%' : '' }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column label="月销量" min-width="100" prop="monthSalesVolume" />
      <el-table-column label="汇率" min-width="100" prop="exchangeRate" />
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="developQueryForm.pageNo"
      :page-size="developQueryForm.pageSize"
      :total="total"
      @current-change="handleDevelopCurrentChange"
      @size-change="handleDevelopSizeChange"
    />

    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- 站点分布 -->
    <vab-dialog v-model="sitePieVisible" :draggable="false" :title="`${handleMonth()}各站点奖金占比`" width="30%" @open="handlePieOpened">
      <div ref="chartContainer" style="width: 100%; height: 400px"></div>
      <template #footer></template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { CSSProperties } from 'vue'
import { ROLE_BOSS_CODE } from '~/src/const/role'
import { useUserStore } from '~/src/store/modules/user'
import {
  getCommissionDetailDevelopList,
  getCommissionTypeMonth,
  getDevelopDesignDetailPersonList,
  getUserPersonLevelDropdownList,
} from '/@/api/devlocal/commission'
import { getOperationUpdateDate } from '/@/api/devlocal/productPerformance'
import { getSeasonalCoefficientSiteList } from '/@/api/devlocal/seasonalCoefficient'
import { useAclStore } from '/@/store/modules/acl'
import type { IGetCommissionDetailDevelopList, IGetCommissionDetailDevelopListReq } from '/@/type/commission/commissionType'
import handleClipboard from '/@/utils/clipboard'
import { formatDate } from '/@/utils/dateUtils'
import { flexColumnWidth } from '/@/utils/tableColum'
import { colorList, redColorList } from '/@/views/commission/constantOption'

defineOptions({
  name: 'CommissionProductDetails',
})
const chartContainer = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let chartObserver: ResizeObserver
const currentRoleCode = useAclStore().getRole[0]
const option = ref<any>({})
const pieList = ref<any[]>([])
const sitePieVisible = ref<boolean>(false)

const developList = ref<IGetCommissionDetailDevelopList[]>([])

const siteList = ref<{ id: number; label: string }[]>([])
const roleList = ref<{ id: number; label: string }[]>([])
// 人员树形数据（单选）
const treeShareData = ref<any[]>([])
const treeProps = reactive({
  value: 'value',
  label: 'label',
  children: 'children',
})

const developQueryForm = reactive<IGetCommissionDetailDevelopListReq>({
  keyWord: '',
  site: -1,
  userId: undefined,
  month: '',
  pageNo: 1,
  pageSize: 20,
  orderByField: 'currentMonthBonus',
  orderDirection: 'desc',
  online: -1,
})

const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])

const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  if (developQueryForm.orderByField === prop) {
    if (!order) {
      if (developQueryForm.orderDirection === 'asc') {
        column.order = 'descending'
      } else if (developQueryForm.orderDirection === 'desc') {
        column.order = 'ascending'
      }
    }
  } else {
    column.order = 'descending'
  }
  developQueryForm.orderByField = prop
  developQueryForm.orderDirection = column.order === 'ascending' ? 'asc' : 'desc'
  developQueryData()
}

const handleMonth = () => {
  return developQueryForm.month
}
const initChart = () => {
  // 配置项
  option.value = {
    // legend: {
    //   // top: '5%',
    //   left: 'center'
    // },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">${params.data.name}</div>`

        // tooltip详情内容
        let itemHtmlStrArr = ''

        itemHtmlStrArr = `<div style="display: flex;align-items:center;">
          ${params.marker}
          <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 20px 0 2px;">奖金: </div>
          <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">￥${params.data.trueValue} | ${params.percent}%</span>
        </div>`

        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr}
        </div>`
        // 最终html字符串
        const resHtmlStr = titleHtmlStr + contentHtmlStr
        return resHtmlStr
      },
    },
    series: [
      {
        name: '奖金',
        type: 'pie',
        radius: '65%',
        left: 0,
        right: 0,
        top: 0,
        bottom: 20,
        // clockwise: false,
        startAngle: 90, //起始角度
        labelLine: {
          lineStyle: {
            width: 1.5,
          },
          length: 15,
          length2: 0,
          maxSurfaceAngle: 80,
        },
        stillShowZeroSum: false,
        avoidLabelOverlap: true, // 避免标签重叠
        minShowLabelAngle: 5,
        label: {
          position: 'outer',
          alignTo: 'edge',
          edgeDistance: 10,
          lineHeight: 20,
          formatter: (params: any) => {
            const { data, percent } = params
            // const sortedData = params.seriesData
            //   .sort((a: any, b: any) => b.value - a.value) // 排序
            //   .slice(0, 3); // 获取前 3 项
            return `{a|${data.name}}\n{x|￥${data.trueValue} | ${percent}% }`
          },

          rich: {
            a: {
              color: '#000',
              fontSize: 17,
              fontWeight: 550,
              // padding: [0, 0, 5, 0],
            },
            x: {
              color: '#999',
              fontSize: 16,
              lineHeight: 20,
              // padding: [15, 0, 10, 0],
            },
          },
        },
        labelLayout(params: any) {
          const isLeft = params.labelRect.x < chartInstance?.getWidth()! / 2
          const points = params.labelLinePoints as number[][]
          // Update the end point.
          points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width

          return {
            labelLinePoints: points,
          }
        },
        data: pieList.value.slice().sort((a: any, b: any) => b.value - a.value),
        color: colorList,
      },
    ],
  }
  chartInstance?.setOption(option.value)
}
const handlePieOpened = () => {
  nextTick(() => {
    if (chartContainer.value) {
      chartInstance = echarts.init(chartContainer.value)
      chartObserver = new ResizeObserver(() => {
        if (chartInstance) {
          chartInstance.resize()
        }
      })
      chartObserver.observe(chartContainer.value)
      initChart()
    }
  })
}
const cellClick = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  const label = column.label
  if (label === '站点分布') {
    sitePieVisible.value = true
    pieList.value = row.pieList
  }
}

const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}

const handleDevelopCurrentChange = (value: number) => {
  developQueryForm.pageNo = value
  fetchDevelopData()
}
const handleDevelopSizeChange = (value: number) => {
  developQueryForm.pageNo = 1
  developQueryForm.pageSize = value
  fetchDevelopData()
}
const developQueryData = () => {
  developQueryForm.pageNo = 1
  fetchDevelopData()
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === 'SKU') {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center',
  }
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片' || data.column.label === '零件图片') {
    return 'clear-padding'
  }
  return ''
}
const fetchSiteList = async () => {
  const { data } = await getSeasonalCoefficientSiteList()
  siteList.value = data
  siteList.value.unshift({ id: -1, label: '全部' })
}

const developUserList = ref<{ id: number; label: string }[]>([])
const fetchDevelopUserList = async () => {
  const { data } = await getDevelopDesignDetailPersonList()

  // 转换为树形数据
  treeShareData.value = convertToTreeData(data)
}

// 将平铺数据转换为树形结构
const convertToTreeData = (data: any[]) => {
  // 如果没有数据，返回空数组
  if (!data || data.length === 0) {
    return []
  }

  // 检查是否有部门字段，如果没有则按角色或其他字段分组
  const hasDepartment = data.some((item) => item.department)
  const hasRoleName = data.some((item) => item.roleName)

  let groupField = 'department'
  if (!hasDepartment && hasRoleName) {
    groupField = 'roleName'
  } else if (!hasDepartment && !hasRoleName) {
    // 如果都没有，直接返回平铺结构
    return data.map((item) => ({
      label: item.userName,
      value: item.userID,
      disabled: false,
    }))
  }

  // 按指定字段分组
  const groupMap = new Map()

  data.forEach((item) => {
    const groupValue = item[groupField] || '未分组'
    if (!groupMap.has(groupValue)) {
      groupMap.set(groupValue, [])
    }
    groupMap.get(groupValue).push({
      label: item.userName,
      value: item.userID,
      disabled: false,
    })
  })

  // 转换为树形结构
  const treeData: any[] = []
  groupMap.forEach((users, groupName) => {
    treeData.push({
      label: groupName,
      value: groupName,
      disabled: true, // 分组节点不可选择
      children: users,
    })
  })

  return treeData
}

// const fetchDevelopRoleList = async () => {
//   const { data } = await getDevelopDesignDetailRoleList()
//   roleList.value = data
//   roleList.value.unshift({ id: -1, label: '全部' })
//   developQueryForm.roleId = roleList.value.find((item) => item.label === '产品经理')?.id || -1
// }
const bonus = ref<number>(0)

const fetchDevelopData = async () => {
  listLoading.value = true
  const { data } = await getCommissionDetailDevelopList(developQueryForm)
  if (data) {
    total.value = data.total
    developList.value = data.list
    bonus.value = data.bonus
    developList.value.forEach((item) => {
      let i = 0
      if (item.totalCommissionProportion) {
        item.totalCommissionProportion = parseFloat((item.totalCommissionProportion * 100).toFixed(2))
      }
      if (item.baseProportion) {
        item.baseProportion = parseFloat((item.baseProportion * 100).toFixed(2))
      }
      if (item.rewardProportion) {
        item.rewardProportion = parseFloat((item.rewardProportion * 100).toFixed(2))
      }
      if (item.monthProfitMargin) {
        item.monthProfitMargin = parseFloat((item.monthProfitMargin * 100).toFixed(2))
      }

      item.pieList = item.pieList.map((item: any, index: number) => {
        const trueValue = item.value
        const itemStyle = { color: colorList[index] }
        if (item.value < 0) {
          item.value = Math.abs(item.value)
          itemStyle.color = redColorList[i]
          i++
        }
        return {
          name: item.name,
          value: item.value,
          trueValue,
          itemStyle,
        }
      })
    })
  }
  listLoading.value = false
}

const updateDate = ref<string | undefined>('')
const fetchUpdateDate = async () => {
  const { data } = await getOperationUpdateDate({ type: 5 })
  updateDate.value = data
}
const monthOption = ref<{ id: number; label: string }[]>([])
const onlineOption = ref<{ id: number; label: string }[]>([
  {
    id: -1,
    label: '全部',
  },
  {
    id: 1,
    label: '已上线',
  },
  {
    id: 0,
    label: '未上线',
  },
])
const userName = useUserStore().getUsername
const userLevelList = ref<{ id: number; label: string }[]>([])
const fetchUserLevelList = async () => {
  const { data } = await getUserPersonLevelDropdownList()
  userLevelList.value = data
  developQueryForm.userId = userLevelList.value.find((item) => item.label.includes(userName!))?.id || -1
}
const fetchCommissionTypeMonth = async () => {
  const { data } = await getCommissionTypeMonth({ type: 2 })
  monthOption.value = data
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  developQueryForm.month = currentMonth
}
onBeforeMount(async () => {
  fetchSiteList()
  await fetchUserLevelList()
  fetchUpdateDate()
  fetchCommissionTypeMonth()
  fetchDevelopUserList()
  // fetchDevelopRoleList()
  await developQueryData()
})
</script>

<style lang="scss" scoped>
.tabs-table-container {
  :deep() {
    .el-tabs {
      border-radius: var(--el-border-radius-base);

      &__header {
        border-top-left-radius: var(--el-border-radius-base);
        border-top-right-radius: var(--el-border-radius-base);
      }

      &__nav-wrap {
        border-radius: var(--el-border-radius-base);
      }

      .el-tab-pane {
        display: flex;
        flex-direction: column;
        height: calc(var(--el-container-height) - var(--el-padding) - 52px) !important;

        .vab-query-form {
          .el-form {
            .el-form-item:first-child {
              // margin: 0 !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
          }
        }

        .noneHoverTable {
          flex: 1;
        }
      }
    }
  }
}
.copySku {
  cursor: pointer;
  -webkit-user-select: text;
  user-select: text;
  transition: all 0.3s;
  &:hover {
    color: #000;
  }
}
.noneHoverTable :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.noneHoverTable :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
</style>
