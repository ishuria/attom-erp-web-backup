<template>
    <div class="comprehensive-table-container auto-height-container">
      <vab-query-form>
        <vab-query-form-top-panel>
          <h2>收货仓库</h2>
        </vab-query-form-top-panel>
        <vab-query-form-left-panel :span="24">
          <el-button type="primary">新增仓库</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
  
      <el-table ref="tableRef" border stripe :data="warehouseData" @cell-click="changeInput">
        <el-table-column align="center" label="仓库ID" width="80" prop="id" >
            <template #default="{ row }">
                <span style="color: rgb(192, 192, 192)">{{ row.id }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="仓库名称" min-width="200" prop="title" >
            <template #default="{ row }">
                <div class="none">
                    <el-input type="text" v-model="row.title" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                </div>
                <span>{{ row.title }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="仓库性质" prop="author" width="120">
            <template #default="{ row }">
                <el-select v-model="row.author" style="min-width: 100%;">
                    <el-option v-for="item in warehouseOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </template>
        </el-table-column>
        <el-table-column align="center" label="仓库状态" min-width="100">
          <template #default="{ row }">
            <div class="none">
                <el-input type="text" v-model="row.status" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
            </div>
            <span>
                <el-tag effect="dark" :type="statusFilter(row.status)">
                    {{ row.status }}
                </el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="仓库地址" min-width="230" prop="address" >
            <template #default="{ row }">
                <div class="none">
                    <el-input type="text" v-model="row.address" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                </div>
                <span>{{ row.address }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="联系人" min-width="100" prop="contact" >
                        <template #default="{ row }">
                <div class="none">
                    <el-input type="text" v-model="row.contact" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                </div>
                <span>{{ row.contact }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="电话" min-width="150" prop="phone" >
                        <template #default="{ row }">
                <div class="none">
                    <el-input type="text" v-model="row.phone" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                </div>
                <span>{{ row.phone }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="添加人员" min-width="120" prop="addedBy" >
                        <template #default="{ row }">
                <div class="none">
                    <el-input type="text" v-model="row.addedBy" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                </div>
                <span>{{ row.addedBy }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="添加日期" min-width="130" prop="addedDate" >
                        <template #default="{ row }">
                <div class="none">
                    <el-input type="text" v-model="row.addedDate" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                </div>
                <span>{{ row.addedDate }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="备注" min-width="160" prop="remarks" >
            <template #default="{ row }">
                <div class="none">
                    <el-input type="text" v-model="row.remarks" @keypress.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                </div>
                <span>{{ row.remarks }}</span>
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
    name: 'WarehouseToReceive',
})
  
const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const editRef = ref<any>(null)
const tableRef = ref<TableInstance>()
const list = ref<any>([])
const listLoading = ref<boolean>(true)

const warehouseData = [
  {
    id: 1,
    title: "仓库A",
    author: 0,
    status: "正常",
    address: "地址1, 城市A",
    contact: "张三",
    phone: "13800000001",
    addedBy: "李四",
    addedDate: "2024-01-01",
    remarks: "无"
  },
  {
    id: 2,
    title: "仓库B",
    author: 1,
    status: "停用",
    address: "地址2, 城市B",
    contact: "王五",
    phone: "13800000002",
    addedBy: "赵六",
    addedDate: "2024-01-02",
    remarks: "维修中"
  },
  {
    id: 3,
    title: "仓库C",
    author: 0,
    status: "正常",
    address: "地址3, 城市C",
    contact: "周七",
    phone: "13800000003",
    addedBy: "钱八",
    addedDate: "2024-01-03",
    remarks: "新仓库"
  },
  {
    id: 4,
    title: "仓库D",
    author: 0,
    status: "正常",
    address: "地址4, 城市D",
    contact: "郑九",
    phone: "13800000004",
    addedBy: "孙十",
    addedDate: "2024-01-04",
    remarks: "无"
  },
  {
    id: 5,
    title: "仓库E",
    author: 1,
    status: "停用",
    address: "地址5, 城市E",
    contact: "黄百",
    phone: "13800000005",
    addedBy: "吴千",
    addedDate: "2024-01-05",
    remarks: "待检查"
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

const warehouseOption = [
    { label: '自有', value: 0 },
    { label: '供应商', value: 1 },
]

const statusFilter = (status: string | number) => {
const statusMap: any = {
    正常: 'success',
    停用: 'danger',
}
return statusMap[status]
}
  

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
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}
</style>