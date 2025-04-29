<template>
  <div style="margin-top: 20px; margin-bottom: 20px;">
    <el-table border :data="siteQuantityList" :header-cell-style="{ textAlign: 'center' }" stripe>
      <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(siteQuantityList, 'SKU', 'sku')" />
      <el-table-column 
        v-for="(item, index) in option"
        :key="index"
        :label="item.siteName"
        :min-width="flexColumnWidth(list, '亚马逊MX墨西哥', item.siteName)"
        :prop="item.siteName"
      >
        <template #default="{ row }">
          <el-input v-model="row[item.siteName].quantity" :min="0" type="number" @change="handleUpdateQuantity(row, item.siteName)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { updateStepNoQuantity } from '/@/api/devlocal/orderingReview'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'VabSiteQuantityTable',
})

const props = defineProps<{
  list: any[]
}>()
watch(() => props.list, () => {
  initData()
})
const siteQuantityList = ref<any[]>([])
const option = ref<any[]>([])
// const list = ref<any[]>([])

const handleUpdateQuantity = async (row: any, siteName: string) => {
  // console.log('row', row)
  // console.log('siteName', siteName)
  // console.log('id', row[siteName].id)
  await updateStepNoQuantity({
    id: row[siteName].id,
    quantity: Number(row[siteName].quantity),
    orderEntryId: row.orderEntryId,
  })
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
      row[`${key}`] = { quantity: item.quantity, id: item.id}
    })
  })
  // console.log('siteQuantityList', siteQuantityList.value)
}
</script>