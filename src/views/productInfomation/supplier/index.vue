<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <h2>供应商</h2>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel :span="24">
        <el-button type="primary" @click="handleAdd">上传通用合同模板</el-button>
        <el-button type="primary" @click="handleDetail">下载通用合同模板</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table ref="tableRef" border stripe :data="supplierData" @selection-change="setSelectRows">
      <el-table-column align="center" label="供应商ID" width="75" prop="id">
        <template #default="{ row }">
          <span style="color: rgb(192, 192, 192)">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商名称" min-width="200" prop="title" />
      <el-table-column label="优先打包" prop="isPriorityPackaging" align="center" min-width="90">
        <template #default = "{ row }">
            <el-checkbox v-model="row.isPriorityPackaging" :true-value="'1'" :false-value="'0'" class="custom-checkbox"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="税号" prop="taxNumber" min-width="100"/>
      <el-table-column align="center" label="地址" min-width="230" prop="address" />
      
      <el-table-column align="center" label="开票电话" min-width="150" prop="phone" />
      <el-table-column align="center" label="开户银行" min-width="230" prop="bank" />
      <el-table-column align="center" label="开户账号" min-width="160" prop="account" />
      <el-table-column align="center" label="联行号" min-width="160" prop="unionBankCode" />
      <el-table-column align="center" label="联系人" min-width="100" prop="contact" />
      <el-table-column align="center" label="联系人电话" min-width="150" prop="contactPhone" />
      <el-table-column align="center" label="实际税点专票" prop="actualTaxRate" min-width="90">
        <template #header>
          实际税点<br>专票
        </template>
      </el-table-column>
      <el-table-column align="center" label="开票税点专票" prop="invoicingTaxRate" min-width="90">
          <template #header>
              开票税点<br>专票
          </template>
      </el-table-column>
      <el-table-column align="center" label="实际税点普票" prop="actualTaxRateNormal" min-width="90">
        <template #header>
            实际税点<br>普票
        </template>
      </el-table-column>
      <el-table-column align="center" label="开票税点普票" prop="invoicingTaxRateNormal" min-width="90">
          <template #header>
              开票税点<br>普票
          </template>
      </el-table-column>
      <el-table-column align="center" label="旺旺ID" width="85" prop="wangwangID"></el-table-column>
      <el-table-column label="使用特定合同模板" prop="isUsingSpecificTemplate" align="center" min-width="90">
        <template #default = "{ row }">
            <el-checkbox v-model="row.isUsingSpecificTemplate" :true-value="'1'" :false-value="'0'" class="custom-checkbox"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="特定模板" min-width="160" prop="specificTemplate" >
        <template #default="{ row }">
          <el-upload 
            drag
            :limit=1
            :auto-upload="false"
            accept=".xlsx"
            action=""
            :class="{hide: row.hide}"
            :file-list="row.fileList"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!-- <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过10M</div> -->
  	    </el-upload>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="120">
        <el-button text type="danger">删除</el-button>
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
    <!-- <default-table-edit ref="editRef" @fetch-data="fetchData" /> -->
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
const fold = ref<boolean>(true)
const list = ref<any>([])
const listLoading = ref<boolean>(true)
const total = ref<number>(0)
const selectRows = ref<any>([])
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
})





const supplierData = ref([
  {
    id: 1,
    title: "供应商A",
    isPriorityPackaging: '1',     // 优先打包
    taxNumber: "1234567890",       // 税号
    address: "地址A, 城市A",
    phone: "13800000001",
    bank: "银行A",
    account: "12345678901",
    unionBankCode: "1001",
    contact: "张三",
    contactPhone: "13900000001",
    actualTaxRate: "13%",          // 实际税点专票
    invoicingTaxRate: "13%",       // 开票税点专票
    actualTaxRateNormal: "6%",     // 实际税点普票
    invoicingTaxRateNormal: "6%",   // 开票税点普票
    specificTemplate: "模板A",      // 特定模板
    wangwangID: "wwA001",           // 旺旺ID
    isUsingSpecificTemplate: '1',    // 使用特定合同模板
    fileList: [], previewData: '' ,
    hide: false
  },
  {
    id: 2,
    title: "供应商B",
    isPriorityPackaging: '0',
    taxNumber: "0987654321",
    address: "地址B, 城市B",
    phone: "13800000002",
    bank: "银行B",
    account: "12345678902",
    unionBankCode: "1002",
    contact: "李四",
    contactPhone: "13900000002",
    actualTaxRate: "13%",
    invoicingTaxRate: "13%",
    actualTaxRateNormal: "6%",
    invoicingTaxRateNormal: "6%",
    specificTemplate: "模板B",
    wangwangID: "wwB002",
    isUsingSpecificTemplate: '0'
  },
  {
    id: 3,
    title: "供应商C",
    isPriorityPackaging: '1',
    taxNumber: "1122334455",
    address: "地址C, 城市C",
    phone: "13800000003",
    bank: "银行C",
    account: "12345678903",
    unionBankCode: "1003",
    contact: "王五",
    contactPhone: "13900000003",
    actualTaxRate: "13%",
    invoicingTaxRate: "13%",
    actualTaxRateNormal: "6%",
    invoicingTaxRateNormal: "6%",
    specificTemplate: "模板C",
    wangwangID: "wwC003",
    isUsingSpecificTemplate: '1'
  },
  {
    id: 4,
    title: "供应商D",
    isPriorityPackaging: '0',
    taxNumber: "2233445566",
    address: "地址D, 城市D",
    phone: "13800000004",
    bank: "银行D",
    account: "12345678904",
    unionBankCode: "1004",
    contact: "赵六",
    contactPhone: "13900000004",
    actualTaxRate: "13%",
    invoicingTaxRate: "13%",
    actualTaxRateNormal: "6%",
    invoicingTaxRateNormal: "6%",
    specificTemplate: "模板D",
    wangwangID: "wwD004",
    isUsingSpecificTemplate: '0'
  },
  {
    id: 5,
    title: "供应商E",
    isPriorityPackaging: '1',
    taxNumber: "3344556677",
    address: "地址E, 城市E",
    phone: "13800000005",
    bank: "银行E",
    account: "12345678905",
    unionBankCode: "1005",
    contact: "钱八",
    contactPhone: "13900000005",
    actualTaxRate: "13%",
    invoicingTaxRate: "13%",
    actualTaxRateNormal: "6%",
    invoicingTaxRateNormal: "6%",
    specificTemplate: "模板E",
    wangwangID: "wwE005",
    isUsingSpecificTemplate: '1'
  }
]);


// const fetchData = async () => {
//   listLoading.value = true
//   const { data } = await getList(queryForm)
//   list.value = data.list
//   total.value = data.total
//   listLoading.value = false
// }

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}

const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}

const statusFilter = (status: string | number) => {
  const statusMap: any = {
    published: 'success',
    draft: 'primary',
    deleted: 'danger',
  }
  return statusMap[status]
}

const handleFold = () => {
  fold.value = !fold.value
}

const setSelectRows = (value: string) => {
  selectRows.value = value
}

const handleAdd = () => {
  editRef.value.showEdit()
}

const handleEdit = (row = {}) => {
  editRef.value.showEdit(row)
}

// const handleDelete = (row: any) => {
//   if (row.id) {
//     $baseConfirm('您确定要删除当前项吗', null, async () => {
//       const { msg }: any = await doDelete({ ids: row.id })
//       $baseMessage(msg, 'success', 'hey')
//       await fetchData()
//     })
//   } else {
//     if (selectRows.value.length > 0) {
//       const ids = selectRows.value.map((item: { id: any }) => item.id).join(',')
//       $baseConfirm('您确定要删除选中项吗', null, async () => {
//         const { msg }: any = await doDelete({ ids })
//         $baseMessage(msg, 'success', 'hey')
//         await fetchData()
//       })
//     } else {
//       $baseMessage('您未选中任何行', 'warning', 'hey')
//     }
//   }
// }

const handleDetailStayTable = async () => {
  if (selectRows.value.length > 0)
    for (let i = 0; i < selectRows.value.length; i++) {
      const matched = handleMatched(allRoutes.value, '/vab/table/defaultTableDetail')
      const tab = handleTabs({
        ...matched.at(-1),
        query: selectRows.value[i],
      })
      if (tab) {
        await addVisitedRoute(tab)
        await changeTabsMeta({
          title: '详情页',
          meta: {
            title: `${tab.query.title} 详情页`,
          },
        })
      }
    }
  else $baseMessage('请至少选择一行进行详情页跳转', 'warning', 'hey')
}

const handleDetail = (row: any) => {
  if (row.id)
    router.push({
      path: '/vab/table/defaultTableDetail',
      query: {
        ...row,
        timestamp: Date.now(), //允许同一个详情页同时打开多次，否则会触发路由被缓存下次无法刷新的bug
      },
    })
  else {
    if (selectRows.value.length === 1)
      router.push({
        path: '/vab/table/defaultTableDetail',
        query: {
          ...selectRows.value[0],
          timestamp: Date.now(), //允许同一个详情页同时打开多次，否则会触发路由被缓存下次无法刷新的bug
        },
      })
    else $baseMessage('请选择一行进行详情页跳转', 'warning', 'hey')
  }
}


onActivated(() => {
  tableRef.value?.doLayout()
})

// onBeforeMount(() => {
//   fetchData()
// })
</script>

<style lang="scss" scoped>
.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
.hide {
  display: none;
}
</style>