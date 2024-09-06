<template>
    <div class="comprehensive-table-container auto-height-container">
       <vab-query-form>
            <vab-query-form-top-panel>
                新品审核与记录
            </vab-query-form-top-panel>
            <vab-query-form-right-panel :span="24">
                <el-form inline :model="queryForm" @submit.prevent>
                    <el-form-item>
                        <el-input v-model="queryForm.productKeyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
                    </el-form-item>
                    <el-form-item>
                        <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                        @click="queryData"></el-button>
                    </el-form-item>
                </el-form>
            </vab-query-form-right-panel>
        </vab-query-form>
  
        <el-table 
            ref="tableRef" 
            v-loading="listLoading" 
            border 
            :data="list" 
        >
            <el-table-column label="提交日期" prop="createTime" align="center" width="100">
                <template #default = "{ row }">
                <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="SKU图片" min-width="100">
                <template #default="{ row }">
                    <el-image style="width: 75px; height: 75px" :src="row.componentImg" fit="fill" />
                </template>
            </el-table-column>
            <el-table-column label="SKU"  min-width="160" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>   
            <el-table-column label="产品"  min-width="100" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>  
            <el-table-column label="首单PO"  min-width="70" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>
            <el-table-column label="首单实际成本"  min-width="100" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>
            <el-table-column label="审批成本"  min-width="100" prop="componentName" >
                <template #default="{ row }">
                    {{ row.componentName  }}
                </template>
            </el-table-column>    
        <el-table-column label="相差"  min-width="70" prop="componentName" >
            <template #default="{ row }">
                {{ row.componentName  }}
            </template>
        </el-table-column>
        <el-table-column label="立项日期" prop="createTime" align="center" width="100">
            <template #default = "{ row }">
              <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
            </template>
        </el-table-column>    
        <el-table-column label="审批日期" prop="createTime" align="center" width="100">
            <template #default = "{ row }">
              <span style="color: rgb(192, 192, 192, 1)">{{ row.createTime.split(' ')[0] }}</span>
            </template>
        </el-table-column>
        <el-table-column label="耗时"  min-width="100" prop="componentName" >
            <template #default="{ row }">
                {{ row.componentName  }}
            </template>
        </el-table-column>    
        <el-table-column label="OEM" prop="oem" align="center" width="60">
            <template #default = "{ row }">
               <el-checkbox v-model="row.oem" :true-value="'1'" :false-value="'0'" size="large" class="custom-checkbox" disabled/>
            </template>
          </el-table-column>
        <el-table-column align="center" label="审批状态" min-width="140">
            <template #default="{ row }">
                <span :class="generateStatus(row.status).color">
                    {{ generateStatus(row.status).text }}
                </span>
            </template>
        </el-table-column>
        <el-table-column label="审批人" align="center" min-width="100" prop="componentName" >
            <template #default="{ row }">
                {{ row.componentName  }}
            </template>
        </el-table-column>    
        <el-table-column label="产品经理" align="center" min-width="100" prop="componentName" >
            <template #default="{ row }">
                {{ row.componentName  }}
            </template>
        </el-table-column>        
        <el-table-column label="产品设计" align="center" min-width="100" prop="componentName" >
            <template #default="{ row }">
                {{ row.componentName  }}
            </template>
        </el-table-column>   
        <el-table-column align="center" fixed="right" label="操作" :width="!foldOperation ? 215 : 120">
          <template #default="{ row }">
            <el-dropdown>
                <el-button text type="primary">
                  查看和编辑
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false">审批和PO发布</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false">分数明细</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
        </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
      <vab-pagination
        :current-page="queryForm.pageNo"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
      <default-table-edit ref="editRef" @fetch-data="fetchData" />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ArrowDown, Delete, Plus, Search } from '@element-plus/icons-vue'
  import type { TableInstance } from 'element-plus'
  import { doDelete, getList } from '/@/api/table'
  import { useRoutesStore } from '/@/store/modules/routes'
  import { useSettingsStore } from '/@/store/modules/settings'
  import { useTabsStore } from '/@/store/modules/tabs'
  import { handleMatched, handleTabs } from '/@/utils/routes'
  
  defineOptions({
    name: 'DefaultTable',
  })
  
  const router = useRouter()
  const routesStore = useRoutesStore()
  const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
  const tabsStore = useTabsStore()
  const { changeTabsMeta, addVisitedRoute } = tabsStore
  const editRef = ref<any>(null)
  const tableRef = ref<TableInstance>()
  const list = ref<any>([])
  const listLoading = ref<boolean>(true)
  const total = ref<number>(0)
  const selectRows = ref<any>([])
  const queryForm = reactive<any>({
    pageNo: 1,
    pageSize: 20,
  })
  const foldOperation = ref<boolean>(false)
  const settingsStore = useSettingsStore()
  

// 审批状态对应的文本和颜色
const generateStatus = (value: number) => {
  switch (value) {
    case 0:
      return { text: "编辑中", color: "status-editing" };
    case 1:
      return { text: "待审核", color: "status-editing" };
    case 2:
      return { text: "主管审批未通过", color: "status-failed" };
    case 3:
      return { text: "主管审批通过", color: "status-success" };
    case 4:
      return { text: "SKU创建", color: "status-editing" };
    case 5:
      return { text: "运营分货", color: "status-editing" };
    case 6:
      return { text: "待发布PO", color: "status-editing" };
    case 7:
      return { text: "已完成", color: "status-finished" };
    default:
      return { text: "未知", color: "status-editing" };
  }
}

  const fetchData = async () => {
    listLoading.value = true
    const { data } = await getList(queryForm)
    list.value = data.list
    total.value = data.total
    listLoading.value = false
  }
  
  const handleSizeChange = (value: number) => {
    queryForm.pageNo = 1
    queryForm.pageSize = value
    fetchData()
  }
  
  const handleCurrentChange = (value: number) => {
    queryForm.pageNo = value
    fetchData()
  }
  
  const queryData = () => {
    queryForm.pageNo = 1
    fetchData()
  }
  
  const setSelectRows = (value: string) => {
    selectRows.value = value
  }
  
  onActivated(() => {
    tableRef.value?.doLayout()
  })
  
  onBeforeMount(() => {
    fetchData()
  })
  </script>
  
<style lang="scss" scoped>
.status-editing {
    color: orange;
}
.status-failed {
    color: red;
}
.status-success {
    color: black;
}
.status-finished {
    color: green;
}
.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
</style>