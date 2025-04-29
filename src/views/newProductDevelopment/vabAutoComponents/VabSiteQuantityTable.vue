<template>
  <div style="margin-top: 20px">
    <el-table border :data="fakeData" :header-cell-style="{ textAlign: 'center' }">
      <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(fakeData, 'SKU', 'sku')" />
      <el-table-column 
        v-for="(item, index) in option"
        :key="index"
        :label="item.siteName"
        :min-width="flexColumnWidth(list, '亚马逊MX墨西哥', item.siteName)"
        :prop="item.siteName"
      >
        <template #default="{ row }">
          <el-input v-model="row[item.siteName]" type="number" @change="handleUpdateQuantity(row, item.siteName)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'VabSiteQuantityTable',
})

const option = ref<any[]>([{ siteName: '亚马逊US'}, { siteName: '亚马逊UK'}])
const list = ref<any[]>([])
const fakeData = ref<any[]>([
  { sku: '123456', '亚马逊US': 100, '亚马逊UK': 50 },
])
const handleUpdateQuantity = (row: any, siteName: string) => {
  console.log('row', row)
  console.log('siteName', siteName)
}
const handleModify = (row: any) => {
  console.log('row', row)
}
const fetchSiteTableData = async () => {
  // listLoading.value = true
  // const { data } = await getSkuShippingChannelList(queryForm)
  // total.value = data.total
  // list.value = data.list
  // list.value.forEach((row: any) => {
  //   if (row.siteMerchandiseList.length > tem) {
  //     tem = row.siteMerchandiseList.length
  //     option.value = row.siteMerchandiseList
  //   }
  //   row.siteMerchandiseList.forEach((item: any) => {
  //     const key = item.siteName
  //     const value = item.channel
  //     row[`${key}`] = value
  //   })
  // })
  // listLoading.value = false
}
</script>