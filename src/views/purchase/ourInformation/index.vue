<template>
    <div class="comprehensive-table-container auto-height-container">
      <vab-query-form>
        <vab-query-form-top-panel>
          <h2>我司信息</h2>
        </vab-query-form-top-panel>
        <vab-query-form-left-panel :span="24">
          <el-button type="primary">新增</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
  
      <el-table ref="tableRef" border stripe :data="procurementData" @cell-click="changeInput" >
        <el-table-column align="center" label="采购方ID" width="100" prop="id" >
          <template #default="{ row }">
                <span style="color: rgb(192, 192, 192)">{{ row.id }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="公司简称" min-width="200" prop="title" >
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.title" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="采购方全名" min-width="200" prop="fullName" >
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.fullName" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.fullName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="报关模式" prop="customsMode" width="160">
            <template #default="{ row }">
                <el-select v-model="row.customsMode" style="min-width: 100%;">
                    <el-option v-for="item in customsModeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </template>
        </el-table-column>
        <el-table-column align="center" label="开户行" min-width="230" prop="bank" >
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.bank" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.bank }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行账号" min-width="160" prop="account" >
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.account" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>{{ row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="160">
          <template #default="{ row }">
            <el-button text type="danger" :underline="false">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
      <!-- <default-table-edit ref="editRef" @fetch-data="fetchData" /> -->
    </div>
</template>
  
<script lang="ts" setup>
import type { TableInstance } from 'element-plus'
import { useRoutesStore } from '/@/store/modules/routes'
import { getRootElement, getSpecificChildren } from '~/src/utils/nodeUtils'
  
defineOptions({
    name: 'ourInformation',
})
  
const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const editRef = ref<any>(null)
const tableRef = ref<TableInstance>()
const list = ref<any>([])
const listLoading = ref<boolean>(true)


const procurementData = [
  {
    id: 1,
    title: "公司A",
    fullName: "公司A全名",
    customsMode: 0,      // 报关模式
    bank: "银行A",             // 开户行
    account: "12345678901"     // 银行账号
  },
  {
    id: 2,
    title: "公司B",
    fullName: "公司B全名",
    customsMode: 2,
    bank: "银行B",
    account: "12345678902"
  },
  {
    id: 3,
    title: "公司C",
    fullName: "公司C全名",
    customsMode: 1,
    bank: "银行C",
    account: "12345678903"
  },
  {
    id: 4,
    title: "公司D",
    fullName: "公司D全名",
    customsMode: 0,
    bank: "银行D",
    account: "12345678904"
  },
  {
    id: 5,
    title: "公司E",
    fullName: "公司E全名",
    customsMode: 2,
    bank: "银行E",
    account: "12345678905"
  }
];
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
    
  if (!cell.children[0].children[0]
      || !cell.children[0].children[1]
      || !cell.children[0].children[0].classList
      || !cell.children[0].children[1].classList) {
      return
  }

  cell.children[0].children[0].classList.remove('none')
  cell.children[0].children[1].classList.add('none')
  
  // 自动聚焦
  const inputElement = getSpecificChildren(cell, "input")[0];
  if (inputElement) {
      inputElement.focus()
      inputElement.select()
  } else {
      const textareaElement = getSpecificChildren(cell, "textarea")[0];
      if (textareaElement){
          textareaElement.focus()
          textareaElement.select()
      }
  }
}
// 零件table blur事件
const clickCancle = async (event:any,value:any) =>{
  const t1 = getRootElement(event["srcElement"],".cell").children[0]
  if (t1){
    t1.classList.add("none")
  }

  const t2 = getRootElement(event["srcElement"],".cell").children[1]
  if (t2){
    t2.classList.remove("none")
  }
  
  if (event.type === 'blur') {
      // 执行失去焦点处理逻辑
      // await reviewStepNo3ComponentUpdate(value)
      // fetchDataComponent()
  }
}

// const fetchData = async () => {
//     listLoading.value = true
//     // const { data } = await getList(queryForm)
//     // list.value = data.list
//     // total.value = data.total
//     listLoading.value = false
// }

const customsModeOption = [
    { label: '买单', value: 0 },
    { label: '退税(按整批)', value: 1 },
    { label: '退税(可分批)', value: 2 },
]

// const handleDelete = (row: any) => {
// if (row.id) {
//     $baseConfirm('您确定要删除当前项吗', null, async () => {
//     const { msg }: any = await doDelete({ ids: row.id })
//     $baseMessage(msg, 'success', 'hey')
//     await fetchData()
//     })
// } else {
//     if (selectRows.value.length > 0) {
//     const ids = selectRows.value.map((item: { id: any }) => item.id).join(',')
//     $baseConfirm('您确定要删除选中项吗', null, async () => {
//         const { msg }: any = await doDelete({ ids })
//         $baseMessage(msg, 'success', 'hey')
//         await fetchData()
//     })
//     } else {
//     $baseMessage('您未选中任何行', 'warning', 'hey')
//     }
// }
// }

onActivated(() => {
    tableRef.value?.doLayout()
})

// onBeforeMount(() => {
//     fetchData()
// })
</script>
  
<style lang="scss" scoped>
.none {
  display: none;
}
</style>